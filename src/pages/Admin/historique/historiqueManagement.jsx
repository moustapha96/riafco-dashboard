
import { useState, useEffect } from "react";
import {
    Card,
    Tabs,
    Form,
    Input,
    Button,
    Table,
    Modal,
    DatePicker,
    Space,
    Spin,
    Popconfirm,
    Breadcrumb,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    HistoryOutlined,
} from "@ant-design/icons";
import organizationService from "../../../services/organizationService";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";

const { TabPane } = Tabs;
const { TextArea } = Input;

const HistoriqueManagement = () => {
    const { user } = useAuth();
    const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
   
    // États pour History
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [editingHistory, setEditingHistory] = useState(null);
    const [historyForm] = Form.useForm();

   
    // Chargement initial
    useEffect(() => {
        loadHistory();
    }, []);

    // Fonctions About Us
   
   
    // Fonctions History
    const loadHistory = async () => {
        try {
            setHistoryLoading(true);
            const response = await organizationService.getHistory();
            setHistory(response.data || []);
        } catch (error) {
            if (error.response?.status === 404) {
                setHistory([]);
            } else {
                toast.error("Erreur lors du chargement de l'historique");
            }
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleHistorySubmit = async (values) => {
        const data = {
            ...values,
            date: values.date.toISOString(),
        };
        try {
            if (editingHistory) {
                await organizationService.updateHistoryEvent(editingHistory.id, data);
                toast.success("Événement mis à jour avec succès");
            } else {
                await organizationService.createHistoryEvent(data);
                toast.success("Événement créé avec succès");
            }
            setHistoryModalVisible(false);
            setEditingHistory(null);
            historyForm.resetFields();
            loadHistory();
        } catch (error) {
            if (error.response?.status === 404 && editingHistory) {
                await organizationService.createHistoryEvent(data);
                toast.success("Événement créé avec succès");
            } else {
                toast.error("Erreur lors de la sauvegarde");
            }
        }
    };

    const handleDeleteHistory = async (id) => {
        try {
            await organizationService.deleteHistoryEvent(id);
            toast.success("Événement supprimé avec succès");
            loadHistory();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression");
        }
    };

   
    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion Historique</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Gestion Historique" },
                        ]}
                    />
                </div>
                <div style={{ padding: "24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                    <Tabs defaultActiveKey="about" type="card">
                       

                        <TabPane
                            tab={<span><HistoryOutlined />Histoire</span>}
                            key="history"
                        >
                            <Card
                                title="Historique de l'organisation"
                                extra={
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setHistoryModalVisible(true)}>
                                        Ajouter une ligne
                                    </Button>
                                }
                            >
                                {historyLoading ? (
                                    <div style={{ textAlign: "center", padding: "48px" }}>
                                        <Spin size="large" />
                                    </div>
                                ) : (
                                    <Table
                                        dataSource={history}
                                        rowKey="id"
                                        columns={[
                                            {
                                                title: "Date",
                                                dataIndex: "date",
                                                key: "date",
                                                render: (date) => dayjs(date).format("DD/MM/YYYY"),
                                            },
                                            {
                                                title: "Titre",
                                                dataIndex: "title",
                                                key: "title",
                                            },
                                            {
                                                title: "Description",
                                                dataIndex: "description",
                                                key: "description",
                                                ellipsis: true,
                                            },
                                            {
                                                title: "Actions",
                                                key: "actions",
                                                render: (_, record) => (
                                                    <Space>
                                                        <Button
                                                            icon={<EditOutlined />}
                                                            onClick={() => {
                                                                setEditingHistory(record);
                                                                historyForm.setFieldsValue({
                                                                    date: dayjs(record.date),
                                                                    title: record.title,
                                                                    description: record.description,
                                                                });
                                                                setHistoryModalVisible(true);
                                                            }}
                                                        />
                                                        {canDelete && (
                                                            <Popconfirm
                                                                title="Êtes-vous sûr de vouloir supprimer cet événement ?"
                                                                onConfirm={() => handleDeleteHistory(record.id)}
                                                                okText="Oui"
                                                                cancelText="Non"
                                                            >
                                                                <Button danger icon={<DeleteOutlined />} />
                                                            </Popconfirm>
                                                        )}
                                                    </Space>
                                                ),
                                            },
                                        ]}
                                    />
                                )}
                            </Card>
                            <Modal
                                title={editingHistory ? "Modifier l'événement" : "Ajouter un événement"}
                                open={historyModalVisible}
                                onCancel={() => {
                                    setHistoryModalVisible(false);
                                    setEditingHistory(null);
                                    historyForm.resetFields();
                                }}
                                footer={null}
                            >
                                <Form form={historyForm} layout="vertical" onFinish={handleHistorySubmit}>
                                    <Form.Item
                                        label="Date"
                                        name="date"
                                        rules={[{ required: true, message: "Veuillez sélectionner une date" }]}
                                    >
                                        <DatePicker style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item label="Titre" name="title" rules={[{ required: true, message: "Veuillez saisir un titre" }]}>
                                        <Input placeholder="Titre de l'événement" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Description"
                                        name="description"
                                        rules={[{ required: true, message: "Veuillez saisir une description" }]}
                                    >
                                        <TextArea rows={4} placeholder="Description de l'événement" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Space>
                                            <Button type="primary" htmlType="submit">
                                                {editingHistory ? "Mettre à jour" : "Créer"}
                                            </Button>
                                            <Button onClick={() => setHistoryModalVisible(false)}>Annuler</Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </TabPane>

                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default HistoriqueManagement;
