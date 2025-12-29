"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, Space, Typography, Alert, Spin, Row, Col, Breadcrumb } from "antd"
import { SaveOutlined, ArrowLeftOutlined, MessageOutlined, FileOutlined, DownloadOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import themeService from "../../../services/themeService"
import discussionService from "../../../services/discussionService"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const DiscussionForm = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [error, setError] = useState(null)
    const [discussion, setDiscussion] = useState(null)
    const [themes, setThemes] = useState([])
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [showDocument, setShowDocument] = useState(false)

    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = !!id

    useEffect(() => {
        loadThemes()
        if (isEditing) {
            loadDiscussion()
        }
    }, [id])

    const loadThemes = async () => {
        try {
            const response = await themeService.getAll({ limit: 100 })
            setThemes(response.data || [])
        } catch (err) {
            console.error("Erreur lors du chargement des thèmes:", err)
        }
    }

    const loadThemeDetails = async (themeId) => {
        try {
            const response = await themeService.getById(themeId)
            setSelectedTheme(response.data)
        } catch (err) {
            console.error("Erreur lors du chargement du thème:", err)
            setSelectedTheme(null)
        }
    }

    const handleThemeChange = (themeId) => {
        if (themeId) {
            loadThemeDetails(themeId)
        } else {
            setSelectedTheme(null)
            setShowDocument(false)
        }
    }

    const loadDiscussion = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await discussionService.getById(id)
            setDiscussion(response.data)

            // Pré-remplir le formulaire
            form.setFieldsValue({
                title: response.data.title,
                content: response.data.content,
                themeId: response.data.themeId,
            })
            
            // Charger le thème de la discussion
            if (response.data.themeId) {
                loadThemeDetails(response.data.themeId)
            }
        } catch (err) {
            console.error("Erreur lors du chargement de la discussion:", err)
            setError("Erreur lors du chargement de la discussion")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (values) => {
        console.log(values)
        try {
            setSubmitLoading(true)
            setError(null)

            if (isEditing) {
                await discussionService.update(id, values)
            } else {
                await discussionService.create(values)
            }

            navigate("/discussions")
        } catch (err) {
            console.error("Erreur lors de la sauvegarde:", err)
            setError("Erreur lors de la sauvegarde de la discussion")
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleBack = () => {
        navigate("/discussions")
    }

    if (loading) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
            }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Chargement de la discussion...</div>
            </div>
        )
    }

    return <>
        <div className="container-fluid relative px-3">
            <div
                className="layout-specing"
                style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    paddingRight: "8px",
                }}
            >
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Commentaire de la discussion</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: <Link to="/discussions">Discussions</Link> },
                            { title: "Modification Discussions" },
                        ]}
                    />
                </div>
                <div className="md:flex justify-end items-center">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                        Retour
                    </Button>
                </div>

                <div>
                    {/* En-tête */}
                    <div style={{ marginBottom: "24px" }}>
                       

                        <Row align="middle">
                            <Col>
                                <MessageOutlined style={{ fontSize: "24px", color: "#52c41a", marginRight: "12px" }} />
                            </Col>
                            <Col>
                                <Title level={2} style={{ margin: 0 }}>
                                    {isEditing ? "Modifier la discussion" : "Nouvelle discussion"}
                                </Title>
                                <Text type="secondary">
                                    {isEditing ? "Modifiez les informations de la discussion" : "Créez une nouvelle discussion"}
                                </Text>
                            </Col>
                        </Row>
                    </div>

                    {error && (
                        <Alert
                            message="Erreur"
                            description={error}
                            type="error"
                            showIcon
                            style={{ marginBottom: "24px" }}
                            closable
                            onClose={() => setError(null)}
                        />
                    )}

                    {/* Formulaire */}
                    <Card>
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={[24, 0]}>
                                <Col xs={24} lg={16}>
                                    <Form.Item
                                        label="Titre de la discussion"
                                        name="title"
                                        rules={[
                                            { required: true, message: "Le titre est obligatoire" },
                                            { min: 3, message: "Le titre doit contenir au moins 3 caractères" },
                                            { max: 200, message: "Le titre ne peut pas dépasser 200 caractères" },
                                        ]}
                                    >
                                        <Input placeholder="Entrez le titre de la discussion" size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Contenu"
                                        name="content"
                                        rules={[
                                            { required: true, message: "Le contenu est obligatoire" },
                                            { min: 10, message: "Le contenu doit contenir au moins 10 caractères" },
                                        ]}
                                    >
                                        <TextArea rows={8} placeholder="Décrivez votre discussion en détail" showCount maxLength={2000} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Form.Item label="Thème" name="themeId" rules={[{ required: true, message: "Le thème est obligatoire" }]}>
                                        <Select
                                            size="large"
                                            placeholder="Sélectionnez un thème"
                                            showSearch
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            onChange={handleThemeChange}
                                        >
                                            {themes.map((theme) => (
                                                <Option key={theme.id} value={theme.id}>
                                                    {theme.title}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Section document du thème sélectionné */}
                                    {selectedTheme?.file && (
                                        <Card 
                                            size="small"
                                            style={{ 
                                                marginTop: "16px",
                                                backgroundColor: "#f8f9fa",
                                                border: "1px solid #e6f7ff"
                                            }}
                                        >
                                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <FileOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
                                                        <Text strong style={{ fontSize: "14px" }}>
                                                            Document du thème
                                                        </Text>
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={showDocument ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                        onClick={() => setShowDocument(!showDocument)}
                                                    >
                                                        {showDocument ? "Masquer" : "Afficher"}
                                                    </Button>
                                                </div>
                                                
                                                {showDocument && (
                                                    <div
                                                        style={{
                                                            marginTop: "12px",
                                                            border: "1px solid #d9d9d9",
                                                            borderRadius: "8px",
                                                            overflow: "hidden",
                                                            backgroundColor: "#fff",
                                                        }}
                                                    >
                                                        <div style={{ 
                                                            padding: "8px", 
                                                            backgroundColor: "#fafafa", 
                                                            borderBottom: "1px solid #d9d9d9",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center"
                                                        }}>
                                                            <Text strong style={{ fontSize: "12px" }}>
                                                                Aperçu du document
                                                            </Text>
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<EyeInvisibleOutlined />}
                                                                onClick={() => setShowDocument(false)}
                                                            >
                                                                Masquer
                                                            </Button>
                                                        </div>
                                                        <div style={{ 
                                                            height: "400px", 
                                                            width: "100%",
                                                            overflow: "auto"
                                                        }}>
                                                            {(() => {
                                                                const fileUrl = buildImageUrl(selectedTheme.file)
                                                                const fileExtension = selectedTheme.file.split('.').pop()?.toLowerCase()
                                                                
                                                                // Pour les images
                                                                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                                                                    return (
                                                                        <img
                                                                            src={fileUrl}
                                                                            alt="Document du thème"
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "auto",
                                                                                objectFit: "contain",
                                                                                display: "block"
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                                
                                                                // Pour les PDFs
                                                                if (fileExtension === 'pdf') {
                                                                    return (
                                                                        <iframe
                                                                            src={fileUrl}
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "100%",
                                                                                border: "none"
                                                                            }}
                                                                            title="Document du thème"
                                                                        />
                                                                    )
                                                                }
                                                                
                                                                // Pour les autres types de documents
                                                                return (
                                                                    <div style={{
                                                                        padding: "16px",
                                                                        textAlign: "center",
                                                                        height: "100%",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        justifyContent: "center",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        <FileOutlined style={{ fontSize: "36px", color: "#1890ff", marginBottom: "12px" }} />
                                                                        <Text type="secondary" style={{ fontSize: "14px", marginBottom: "12px" }}>
                                                                            Aperçu non disponible
                                                                        </Text>
                                                                        <Button
                                                                            type="primary"
                                                                            size="small"
                                                                            icon={<FileOutlined />}
                                                                            onClick={() => window.open(fileUrl, "_blank")}
                                                                        >
                                                                            Ouvrir
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <Space size="small" style={{ marginTop: "8px" }}>
                                                    <Button
                                                        size="small"
                                                        icon={<DownloadOutlined />}
                                                        onClick={() => {
                                                            const fileUrl = buildImageUrl(selectedTheme.file)
                                                            const link = document.createElement('a')
                                                            link.href = fileUrl
                                                            link.download = selectedTheme.file.split('/').pop() || 'document'
                                                            document.body.appendChild(link)
                                                            link.click()
                                                            document.body.removeChild(link)
                                                        }}
                                                    >
                                                        Télécharger
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        icon={<FileOutlined />}
                                                        onClick={() => {
                                                            const fileUrl = buildImageUrl(selectedTheme.file)
                                                            window.open(fileUrl, "_blank")
                                                        }}
                                                    >
                                                        Ouvrir
                                                    </Button>
                                                </Space>
                                            </Space>
                                        </Card>
                                    )}

                                    {isEditing && discussion && (
                                        <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
                                            <Title level={5}>Informations</Title>
                                            <Space direction="vertical" size="small">
                                                <Text type="secondary">
                                                    <strong>Créé par:</strong> {discussion.createdBy?.firstName} {discussion.createdBy?.lastName}
                                                </Text>
                                                <Text type="secondary">
                                                    <strong>Date de création:</strong> {new Date(discussion.createdAt).toLocaleDateString("fr-FR")}
                                                </Text>
                                                <Text type="secondary">
                                                    <strong>Commentaires:</strong> {discussion._count?.comments || 0}
                                                </Text>
                                                <Text type="secondary">
                                                    <strong>Statut:</strong> {discussion.isClosed ? "Fermée" : "Active"}
                                                </Text>
                                                {discussion.isPinned && (
                                                    <Text type="secondary">
                                                        <strong>Épinglée:</strong> Oui
                                                    </Text>
                                                )}
                                            </Space>
                                        </Card>
                                    )}
                                </Col>
                            </Row>

                            {/* Actions */}
                            <div style={{ textAlign: "right", marginTop: "24px" }}>
                                <Space>
                                    <Button onClick={handleBack}>Annuler</Button>
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitLoading}>
                                        {isEditing ? "Mettre à jour" : "Créer la discussion"}
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </div>

            </div>
        </div>
    </>


}

export default DiscussionForm
