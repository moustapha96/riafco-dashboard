/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import {
    Card,
    Form,
    Input,
    Button,
    Spin,
    Typography,
    Space,
    Switch,
    Select,
    DatePicker,
    Modal,
    Table,
    Tag,
    Popconfirm,
    Breadcrumb,
} from "antd"
import {
    SaveOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons"



import dayjs from "dayjs"
import legalService from "../../../services/legalService "
import { toast } from "sonner"
import { Link } from "react-router-dom"
import ReactQuill from "react-quill";

const { Title, Text } = Typography

const { Option } = Select
const MentionLegalManagement = () => {
    const [loading, setLoading] = useState(false)

    const [legalDocuments, setLegalDocuments] = useState([])
    const [editingDocument, setEditingDocument] = useState(null)
    const [documentModalVisible, setDocumentModalVisible] = useState(false)

    const [documentForm] = Form.useForm()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [legalResponse] = await Promise.all([legalService.getAll()])
            setLegalDocuments(legalResponse.data)
        } catch (error) {
            toast.error("Erreur lors du chargement des données")
            console.error("Erreur:", error)
        } finally {
            setLoading(false)
        }
    }



    const handleEditDocument = (document) => {
        setEditingDocument(document)
        documentForm.setFieldsValue({
            title_fr: document.title_fr,
            title_en: document.title_en,
            content_fr: document.content_fr,
            content_en: document.content_en,
            type: document.type,
            isActive: document.isActive,
            effectiveDate: document.effectiveDate ? dayjs(document.effectiveDate) : dayjs(),
        })
        setDocumentModalVisible(true)
    }

    const handleCreateDocument = () => {
        setEditingDocument(null)
        documentForm.resetFields()
        documentForm.setFieldsValue({
            isActive: true,
            effectiveDate: dayjs(), // 
        })
        setDocumentModalVisible(true)
    }

    const handleSaveDocument = async (values) => {
        setLoading(true)
        console.log(values);
        try {
            const data = {
                ...values,
                effectiveDate: values.effectiveDate ? values.effectiveDate.toISOString() : new Date().toISOString(),
            }
            console.log(data)
            if (editingDocument) {
                await legalService.update(editingDocument.id, data)
                toast.success("Document mis à jour avec succès")
            } else {
                await legalService.create(data)
                toast.success("Document créé avec succès")
            }

            setDocumentModalVisible(false)
            loadData()
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde du document")
            console.error("Erreur:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteDocument = async (id) => {
        try {
            await legalService.delete(id)
            toast.success("Document supprimé avec succès")
            loadData()
        } catch (error) {
            toast.error("Erreur lors de la suppression")
            console.log(error)
        }
    }

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

    const documentColumns = [
        {
            title: "Titre(Fr)",
            dataIndex: "title_fr",
            key: "title",
        },
        {
            title: "Titre(En)",
            dataIndex: "title_en",
            key: "title",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => {
                const typeMap = {
                    PRIVACY_POLICY: { text: "Politique de Confidentialité", color: "blue" },
                    TERMS_OF_SERVICE: { text: "Conditions d'Utilisation", color: "green" },
                    LEGAL_NOTICE: { text: "Mentions Légales", color: "orange" },
                }
                const config = typeMap[type] || { text: type, color: "default" }
                return <Tag color={config.color}>{config.text}</Tag>
            },
        },
        {
            title: "Statut",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => <Tag color={isActive ? "success" : "default"}>{isActive ? "Actif" : "Inactif"}</Tag>,
        },
        {
            title: "Version",
            dataIndex: "version",
            key: "version",
        },
        {
            title: "Date d'effet",
            dataIndex: "effectiveDate",
            key: "effectiveDate",
            render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditDocument(record)}>
                        Modifier
                    </Button>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce document ?"
                        onConfirm={() => handleDeleteDocument(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion des Mentions Légales</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Mentiones Légales" },
                        ]}
                    />
                </div>

                <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "24px" }}>
                        <Title level={2}>
                            Mentions Légales
                        </Title>
                        <Text type="secondary">Gérez les mentions légales de votre site</Text>
                    </div>

                    <Card
                        title="Mentions Légales"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateDocument}>
                                Nouveau document
                            </Button>
                        }
                    >
                        <Table
                            columns={documentColumns}
                            dataSource={legalDocuments}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: "auto" }}
                        />
                    </Card>

                    <Modal
                        title={editingDocument ? "Modifier le document" : "Nouveau document"}
                        open={documentModalVisible}
                        onCancel={() => setDocumentModalVisible(false)}
                        footer={null}
                        width={800}
                    >
                        <Form form={documentForm} layout="vertical" onFinish={handleSaveDocument}>
                            <Form.Item label="Titre en Francais" name="title_fr" rules={[{ required: true, toast: "Le titre est requis" }]}>
                                <Input placeholder="Titre du document" />
                            </Form.Item>

                            <Form.Item label="Titre en Anglais" name="title_en" rules={[{ required: true, toast: "Le titre est requis" }]}>
                                <Input placeholder="Titre du document" />
                            </Form.Item>

                            <Form.Item label="Type" name="type" rules={[{ required: true, toast: "Le type est requis" }]}>
                                <Select placeholder="Sélectionnez un type">
                                    <Option value="PRIVACY_POLICY">Politique de Confidentialité</Option>
                                    <Option value="TERMS_OF_SERVICE">Conditions d'Utilisation</Option>
                                    <Option value="LEGAL_NOTICE">Mentions Légales</Option>
                                </Select>
                            </Form.Item>



                            <Form.Item label="Contenu en Francais">
                                <ReactQuill
                                    theme="snow"
                                    value={documentForm.getFieldValue("content_fr")}
                                    onChange={(value) => documentForm.setFieldsValue({ contenu_fr: value })}

                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Contenu ..."
                                    style={{ height: "200px", marginBottom: "24px" }}
                                />
                            </Form.Item>

                            <Form.Item label="Contenu en Anglais">
                                <ReactQuill
                                    theme="snow"
                                    value={documentForm.getFieldValue("content_en")}
                                    onChange={(value) => documentForm.setFieldsValue({ contenu_en: value })}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Contenu ..."
                                    style={{ height: "200px", marginBottom: "24px" }}
                                />
                            </Form.Item>


                            <Form.Item
                                label="Date d'effet"
                                name="effectiveDate"
                                rules={[{ required: true, message: "La date est requise" }]}
                                getValueProps={(value) => ({
                                    value: value ? dayjs(value) : undefined,
                                })}
                            >
                                <DatePicker />
                            </Form.Item>



                            <Form.Item name="isActive" valuePropName="checked">
                                <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
                                <span style={{ marginLeft: "8px" }}>Document actif</span>
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                                        Sauvegarder
                                    </Button>
                                    <Button onClick={() => setDocumentModalVisible(false)}>Annuler</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default MentionLegalManagement
