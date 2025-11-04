import { useState, useEffect } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    Table,
    Breadcrumb,
    Space,
    Popconfirm,
    Tag,
    Modal,
    Upload,
    Avatar,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import organizationService from "../../../services/organizationService";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import dayjs from "dayjs";




const AboutManagement = () => {
    // États pour le formulaire
    const [aboutUsList, setAboutUsList] = useState([]);
    const [aboutUsLoading, setAboutUsLoading] = useState(false);
    const [frenchContent, setFrenchContent] = useState("");
    const [englishContent, setEnglishContent] = useState("");
    const [aboutUsForm] = Form.useForm();

    // États pour la gestion du modal d'édition/création
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAboutUs, setEditingAboutUs] = useState(null);

    const [fileList, setFileList] = useState([])
    // Chargement initial
    useEffect(() => {
        loadAboutUsList();
    }, []);

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

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
    }

    // Charger la liste des "À propos"
    const loadAboutUsList = async () => {
        try {
            setAboutUsLoading(true);
            const response = await organizationService.getAllAboutUs();
            console.log(response.data);
            setAboutUsList(response.data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des informations:", error);
            toast.error("Erreur lors du chargement des informations");
        } finally {
            setAboutUsLoading(false);
        }
    };

    // Ouvrir le modal pour créer ou éditer
    const openModal = (record = null) => {
        if (record) {
            setEditingAboutUs(record);
            aboutUsForm.setFieldsValue({
                title_fr: record.title_fr || "",
                title_en: record.title_en || "",
                isPublished: record.isPublished || false,
            });
            setFrenchContent(record.paragraphe_fr || "");
            setEnglishContent(record.paragraphe_en || "");
            setFileList(
                record.image
                    ? [
                        {
                            uid: "-1",
                            name: "image.jpg",
                            status: "done",
                            url: record.image,
                        },
                    ]
                    : [],
            )
        } else {
            setEditingAboutUs(null);
            aboutUsForm.resetFields();
            setFrenchContent("");
            setEnglishContent("");
        }
        setIsModalVisible(true);
    };

    // Soumettre le formulaire
    const handleAboutUsSubmit = async (values) => {
        try {
            setAboutUsLoading(true);
            const formData = new FormData();
            formData.append("title_fr", values.title_fr || "");
            formData.append("title_en", values.title_en || "");
            formData.append("paragraphe_fr", frenchContent || "");
            formData.append("paragraphe_en", englishContent || "");
            formData.append("isPublished", String(values.isPublished || false));

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("image", fileList[0].originFileObj)
            }

            if (editingAboutUs) {
                await organizationService.updateAboutUs(editingAboutUs.id, formData);
                toast.success("Informations mises à jour avec succès");
            } else {
                await organizationService.createAboutUs(formData);
                toast.success("Informations créées avec succès");
            }

            setIsModalVisible(false);
            loadAboutUsList(); // Recharge la liste
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setAboutUsLoading(false);
        }
    };

    // Supprimer un enregistrement
    const handleDeleteAboutUs = async (id) => {
        try {
            await organizationService.deleteAboutUs(id);
            toast.success("Enregistrement supprimé avec succès");
            loadAboutUsList(); // Recharge la liste
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion de À propos</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: "À propos" },
                        ]}
                    />
                </div>
                <div style={{ padding: "24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                    <Card title="Liste des enregistrements 'À propos'"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => openModal()}
                            >
                                Ajouter
                            </Button>
                        }
                    >
                        <Table
                            dataSource={aboutUsList}
                            rowKey="id"
                            loading={aboutUsLoading}
                            columns={[
                                {
                                    title: "Image",
                                    dataIndex: "image",
                                    key: "image",
                                    render: (_, record) => (
                                        <Space size="middle">
                                            <Avatar size="default" icon={<GlobalOutlined />} src={record.image} />
                                        </Space>
                                    ),
                                },

                                {
                                    title: "Titre (FR)",
                                    dataIndex: "title_fr",
                                    key: "title_fr",
                                },
                                {
                                    title: "Titre (EN)",
                                    dataIndex: "title_en",
                                    key: "title_en",
                                },
                                {
                                    title: "Statut",
                                    key: "isPublished",
                                    render: (_, record) => (
                                        <Tag color={record.isPublished ? "green" : "orange"}>
                                            {record.isPublished ? "Publié" : "Brouillon"}
                                        </Tag>
                                    ),
                                },
                                {
                                    title: "Date de création",
                                    dataIndex: "createdAt",
                                    key: "createdAt",
                                    render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
                                },
                                {
                                    title: "Actions",
                                    key: "actions",
                                    render: (_, record) => (
                                        <Space>
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() => openModal(record)}
                                            />
                                            <Popconfirm
                                                title="Êtes-vous sûr de vouloir supprimer cet enregistrement ?"
                                                onConfirm={() => handleDeleteAboutUs(record.id)}
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <Button danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        </Space>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </div>
            </div>

            {/* Modal pour créer/éditer */}
            <Modal
                title={editingAboutUs ? "Modifier 'À propos'" : "Ajouter 'À propos'"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={aboutUsForm}
                    layout="vertical"
                    onFinish={handleAboutUsSubmit}
                >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Form.Item
                            label="Titre (Français)"
                            name="title_fr"
                            rules={[{ required: true, message: "Veuillez saisir le titre en français" }]}
                        >
                            <Input placeholder="Qui sommes-nous ?" />
                        </Form.Item>
                        <Form.Item
                            label="Titre (Anglais)"
                            name="title_en"
                            rules={[{ required: true, message: "Veuillez saisir le titre en anglais" }]}
                        >
                            <Input placeholder="About Us" />
                        </Form.Item>
                    </div>
                    <Form.Item label="Contenu (Français)">
                        <ReactQuill
                            theme="snow"
                            value={frenchContent}
                            onChange={setFrenchContent}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Contenu en français..."
                            style={{ height: "200px", marginBottom: "24px" }}
                        />
                    </Form.Item>
                    <Form.Item label="Contenu (Anglais)">
                        <ReactQuill
                            theme="snow"
                            value={englishContent}
                            onChange={setEnglishContent}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Contenu en anglais..."
                            style={{ height: "200px", marginBottom: "24px" }}
                        />
                    </Form.Item>

                    <Form.Item label="Image">
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />} size="large">
                                Sélectionner une image
                            </Button>
                        </Upload>
                    </Form.Item>


                    <Form.Item name="isPublished" valuePropName="checked">
                        <Switch checkedChildren="Publié" unCheckedChildren="Brouillon" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={aboutUsLoading}>
                                {editingAboutUs ? "Mettre à jour" : "Créer"}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>Annuler</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};



export default AboutManagement;
