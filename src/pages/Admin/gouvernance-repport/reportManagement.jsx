
import { useState, useEffect } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Table,
    Modal,
    DatePicker,
    Space,
    Spin,
    Popconfirm,
    Tag,
    Breadcrumb,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,

} from "@ant-design/icons";
import organizationService from "../../../services/organizationService";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";


const ReportManagement = () => {
    const { user } = useAuth();
    const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
   
    // États pour Reports
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [reportForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);


    // Chargement initial
    useEffect(() => {
        loadReports();
    }, []);
    // Fonctions Reports
    const loadReports = async () => {
        try {
            setReportsLoading(true);
            const response = await organizationService.getReports();
            setReports(response.reports || []);
        } catch (error) {
            console.error("Erreur lors du chargement des rapports:", error);
            toast.error("Erreur lors du chargement des rapports");
        } finally {
            setReportsLoading(false);
        }
    };


    const handleReportSubmit = async () => {
        try {
            const values = await reportForm.validateFields();
            const formData = new FormData();
            formData.append("title_fr", values.title_fr || "");
            formData.append("title_en", values.title_en || "");
            formData.append("paragraphe_fr", descriptionFr || "");
            formData.append("paragraphe_en", descriptionEn || "");
            formData.append("publishedAt", dayjs(values.publishedAt).toISOString());
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("fileUrl", fileList[0].originFileObj);
            }

            if (editingReport) {
                await organizationService.updateReport(editingReport.id, formData);
                toast.success("Rapport mis à jour avec succès");
            } else {
                await organizationService.createReport(formData);
                toast.success("Rapport créé avec succès");
            }

            setReportModalVisible(false);
            setEditingReport(null);
            setDescriptionFr("");
            setDescriptionEn("");
            reportForm.resetFields();
            loadReports();
        } catch (error) {
            console.log(error)
            console.error("Erreur lors de la soumission du rapport:", error);
            toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
        }
    };

    const handleDeleteReport = async (id) => {
        try {
            await organizationService.deleteReport(id);
            toast.success("Rapport supprimé avec succès");
            loadReports();
        } catch (error) {
            console.error("Erreur lors de la suppression du rapport:", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    // Configuration pour ReactQuill
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet",
        "link", "image",
    ];

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion rapport Gouvernance</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Gestion rapport" },
                        ]}
                    />
                </div>
                <div style={{ padding: "24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                    <Card
                        title="Rapports et documents"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setReportModalVisible(true)}>
                                Ajouter un rapport
                            </Button>
                        }
                    >
                        {reportsLoading ? (
                            <div style={{ textAlign: "center", padding: "48px" }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Table
                                dataSource={reports}
                                rowKey="id"
                                    columns={[
                                    
                                    {
                                        title: "Titre (FR)",
                                        dataIndex: "title_fr",
                                        key: "title_fr",
                                        render: (text) => text || <Tag>Non défini</Tag>,
                                    },
                                    {
                                        title: "Titre (EN)",
                                        dataIndex: "title_en",
                                        key: "title_en",
                                        render: (text) => text || <Tag>Non défini</Tag>,
                                    },
                                    {
                                        title: "Date de publication",
                                        dataIndex: "publishedAt",
                                        key: "publishedAt",
                                        render: (date) => dayjs(date).format("DD/MM/YYYY"),
                                    },
                                    {
                                        title: "Fichier",
                                        dataIndex: "fileUrl",
                                        key: "fileUrl",
                                        render: (fileUrl) =>
                                            fileUrl ? (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                    Voir le fichier
                                                </a>
                                            ) : (
                                                <Tag>Aucun fichier</Tag>
                                            ),
                                    },
                                    {
                                        title: "Actions",
                                        key: "actions",
                                        render: (_, record) => (
                                            <Space>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        setEditingReport(record);
                                                        reportForm.setFieldsValue({
                                                            title_fr: record.title_fr || "",
                                                            title_en: record.title_en || "",
                                                            publishedAt: dayjs(record.publishedAt),
                                                        });
                                                        setDescriptionFr(record.paragraphe_fr || "");
                                                        setDescriptionEn(record.paragraphe_en || "");
                                                        setReportModalVisible(true);
                                                    }}
                                                />
                                                {canDelete && (
                                                    <Popconfirm
                                                        title="Êtes-vous sûr de vouloir supprimer ce rapport ?"
                                                        onConfirm={() => handleDeleteReport(record.id)}
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
                        title={editingReport ? "Modifier le rapport" : "Ajouter un rapport"}
                        open={reportModalVisible}
                        onCancel={() => {
                            setReportModalVisible(false);
                            setEditingReport(null);
                            setDescriptionFr("");
                            setDescriptionEn("");
                            setFileList([]);
                            reportForm.resetFields();
                        }}
                        footer={null}
                        width={800}
                    >
                        <Form
                            form={reportForm}
                            layout="vertical"
                            onFinish={handleReportSubmit}
                        >
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <Form.Item label="Titre (Français)" name="title_fr">
                                    <Input placeholder="Titre en français" />
                                </Form.Item>
                                <Form.Item label="Titre (Anglais)" name="title_en">
                                    <Input placeholder="Titre en anglais" />
                                </Form.Item>
                            </div>
                            <Form.Item label="Description (Français)">
                                <ReactQuill
                                    theme="snow"
                                    value={descriptionFr}
                                    onChange={setDescriptionFr}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Description en français..."
                                    style={{ height: "200px", marginBottom: "24px" }}
                                />
                            </Form.Item>
                            <Form.Item label="Description (Anglais)">
                                <ReactQuill
                                    theme="snow"
                                    value={descriptionEn}
                                    onChange={setDescriptionEn}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Description en anglais..."
                                    style={{ height: "200px", marginBottom: "24px" }}
                                />
                            </Form.Item>
                            <Form.Item label="Fichier du rapport">
                                <Upload
                                    name="file"
                                    fileList={fileList}
                                    onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                    beforeUpload={() => false} // Désactive le téléversement automatique
                                    maxCount={1} // Limite à un seul fichier
                                >
                                    <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                                </Upload>
                            </Form.Item>


                            <Form.Item
                                label="Date de publication"
                                name="publishedAt"
                                rules={[{ required: true, message: "Veuillez sélectionner une date" }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        {editingReport ? "Mettre à jour" : "Créer"}
                                    </Button>
                                    <Button onClick={() => setReportModalVisible(false)}>Annuler</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ReportManagement;
