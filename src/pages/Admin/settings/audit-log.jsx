import { useState, useEffect } from "react";
import {
    Card,
    Table,
    Spin,
    Tag,
    Breadcrumb,
    Button,
    Modal,
} from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import settingsService from "../../../services/settingsService";

const AuditLogManagement = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [auditLogsLoading, setAuditLogsLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    // Charger les logs d'audit avec pagination
    const loadAuditLogs = async (page = 1, pageSize = 5) => {
        try {
            setAuditLogsLoading(true);
            const response = await settingsService.getAudits({
                page,
                limit: pageSize,
            });
            setAuditLogs(response.data || []);
            console.log(response.data);
            setPagination({
                current: response.pagination.page,
                pageSize: response.pagination.limit,
                total: response.pagination.total,
            });
        } catch (error) {
            console.error("Erreur lors du chargement des logs d'audit:", error);
            toast.error("Erreur lors du chargement des logs d'audit");
        } finally {
            setAuditLogsLoading(false);
        }
    };

    // Afficher les détails d'un log
    const showDetailsModal = (log) => {
        setSelectedLog(log);
        setIsDetailsModalVisible(true);
    };

    // Charger les logs au montage du composant
    useEffect(() => {
        loadAuditLogs(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    
    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion des Actions</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Gestion des Actions" },
                        ]}
                    />
                </div>
                <div style={{ padding: "24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                    <Card title="Logs d'audit">
                        {auditLogsLoading ? (
                            <div style={{ textAlign: "center", padding: "48px" }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Table
                                dataSource={auditLogs}
                                rowKey="id"
                                columns={[
                                    {
                                        title: "Utilisateur",
                                        key: "user",
                                        render: (_, record) => (
                                            <div>
                                                {record.user ? (
                                                    <>
                                                        <div>{record.user.firstName} {record.user.lastName}</div>
                                                        <div style={{ fontSize: "12px", color: "#999" }}>{record.user.email}</div>
                                                    </>
                                                ) : (
                                                    <Tag>Utilisateur supprimé</Tag>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        title: "Action",
                                        dataIndex: "action",
                                        key: "action",
                                    },
                                    {
                                        title: "Ressource",
                                        dataIndex: "resource",
                                        key: "resource",
                                    },
                                    {
                                        title: "ID Ressource",
                                        dataIndex: "resourceId",
                                        key: "resourceId",
                                        render: (resourceId) => resourceId || <Tag>N/A</Tag>,
                                    },
                                    {
                                        title: "Date",
                                        dataIndex: "createdAt",
                                        key: "createdAt",
                                        render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
                                    },
                                    {
                                        title: "IP",
                                        dataIndex: "ipAddress",
                                        key: "ipAddress",
                                        render: (ipAddress) => ipAddress || <Tag>N/A</Tag>,
                                    },
                                    {
                                        title: "Actions",
                                        key: "actions",
                                        render: (_, record) => (
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => showDetailsModal(record)}
                                            >
                                                Détails
                                            </Button>
                                        ),
                                    },
                                ]}
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: pagination.total,
                                    onChange: (page, pageSize) => {
                                        setPagination({ ...pagination, current: page , pageSize });
                                    },
                                    showSizeChanger: true,
                                    onShowSizeChange: (current, size) => {
                                        setPagination({ current: 1, pageSize: size });
                                    },
                                    pageSizeOptions: ["5", "10", "20", "50"],
                                }}
                                scroll={{ x: true }}
                            />
                        )}
                    </Card>
                </div>
            </div>

            {/* Modal pour afficher les détails */}
            <Modal
                title="Détails du log d'audit"
                open={isDetailsModalVisible}
                onCancel={() => setIsDetailsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailsModalVisible(false)}>
                        Fermer
                    </Button>
                ]}
                width={800}
            >
                {selectedLog && (
                    <div>
                        <Card title="Informations générales" style={{ marginBottom: "16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px 16px" }}>
                                <div><strong>ID:</strong></div>
                                <div>{selectedLog.id}</div>
                                <div><strong>Utilisateur:</strong></div>
                                <div>
                                    {selectedLog.user ? (
                                        <>
                                            {selectedLog.user.firstName} {selectedLog.user.lastName} ({selectedLog.user.email})
                                        </>
                                    ) : (
                                        "Utilisateur supprimé"
                                    )}
                                </div>
                                <div><strong>Action:</strong></div>
                                <div>{selectedLog.action}</div>
                                <div><strong>Ressource:</strong></div>
                                <div>{selectedLog.resource}</div>
                                <div><strong>ID Ressource:</strong></div>
                                <div>{selectedLog.resourceId || "N/A"}</div>
                                <div><strong>Date:</strong></div>
                                <div>{dayjs(selectedLog.createdAt).format("DD/MM/YYYY HH:mm:ss")}</div>
                                <div><strong>Adresse IP:</strong></div>
                                <div>{selectedLog.ipAddress || "N/A"}</div>
                                <div><strong>Agent utilisateur:</strong></div>
                                <div>{selectedLog.userAgent || "N/A"}</div>
                            </div>
                        </Card>
                        {selectedLog.details && (
                            <Card title="Détails supplémentaires">
                                <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
                                    {JSON.stringify(selectedLog.details, null, 2)}
                                </pre>
                            </Card>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AuditLogManagement;
