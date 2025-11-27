"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, Space, Typography, Alert, Spin, Row, Col, Breadcrumb } from "antd"
import { SaveOutlined, ArrowLeftOutlined, MessageOutlined } from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import themeService from "../../../services/themeService"
import discussionService from "../../../services/discussionService"

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
                                    <Form.Item label="Thème"   name="themeId" rules={[{ required: true, message: "Le thème est obligatoire" }]}>
                                        <Select
                                            size="large"
                                            placeholder="Sélectionnez un thème"
                                            showSearch
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {themes.map((theme) => (
                                                <Option key={theme.id} value={theme.id}>
                                                    {theme.title}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

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
