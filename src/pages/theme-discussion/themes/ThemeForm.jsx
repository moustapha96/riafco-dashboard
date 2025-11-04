"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, Space, Typography, Alert, Spin, Row, Col, Breadcrumb } from "antd"
import { SaveOutlined, ArrowLeftOutlined, BookOutlined } from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import themeService from "../../../services/themeService"


const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const ThemeForm = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [error, setError] = useState(null)
    const [theme, setTheme] = useState(null)

    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = !!id

    useEffect(() => {
        if (isEditing) {
            loadTheme()
        }
        console.log(id)
    }, [id])

    const loadTheme = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await themeService.getById(id)
            console.log(response.data)
            setTheme(response.data)

            // Pré-remplir le formulaire
            form.setFieldsValue({
                title: response.data.title,
                description: response.data.description,
                status: response.data.status,
            })
        } catch (err) {
            console.error("Erreur lors du chargement du thème:", err)
            setError("Erreur lors du chargement du thème")
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
                await themeService.update(id, values)
            } else {
                await themeService.create(values)
            }

            navigate("/themes")
        } catch (err) {
            console.error("Erreur lors de la sauvegarde:", err)
            setError("Erreur lors de la sauvegarde du thème")
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleBack = () => {
        navigate("/themes")
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Chargement du thème...</div>
            </div>
        )
    }

    return <>

        <div className="container-fluid relative px-3">
            <div className="layout-specing" style={{
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
                paddingRight: "8px"
            }}>

                <div>

                    <div className="md:flex justify-between items-center mb-6">
                        <h5 className="text-lg font-semibold">
                            Gérez les thèmes de discussion
                        </h5>
                        <Breadcrumb
                            items={[
                                { title: <Link to="/">Dashboard</Link> },
                                { title: <Link to="/themes">Themes</Link> },
                                { title: <Link to="/discussions">Discussions</Link> },
                                { title: "Modification du thème" },
                            ]}
                        />
                    </div>
                    <div className="md:flex justify-end items-center">

                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
                            Retour
                        </Button>
                    </div>


                    <div style={{ marginBottom: "24px" }}>


                        <Row align="middle">
                            <Col>
                                <BookOutlined style={{ fontSize: "24px", color: "#1e81b0", marginRight: "12px" }} />
                            </Col>
                            <Col>
                                <Title level={2} style={{ margin: 0 }}>
                                    {isEditing ? "Modifier le thème" : "Nouveau thème"}
                                </Title>
                                <Text type="secondary">
                                    {isEditing ? "Modifiez les informations du thème" : "Créez un nouveau thème de discussion"}
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
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                status: "ACTIVE",
                            }}
                        >
                            <Row gutter={[24, 0]}>
                                <Col xs={24} lg={16}>
                                    <Form.Item
                                        label="Titre du thème"
                                        name="title"
                                        rules={[
                                            { required: true, message: "Le titre est obligatoire" },
                                            { min: 3, message: "Le titre doit contenir au moins 3 caractères" },
                                            { max: 100, message: "Le titre ne peut pas dépasser 100 caractères" },
                                        ]}
                                    >
                                        <Input placeholder="Entrez le titre du thème" size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Description"
                                        name="description"
                                        rules={[
                                            { required: true, message: "La description est obligatoire" },
                                            { min: 10, message: "La description doit contenir au moins 10 caractères" },
                                            { max: 500, message: "La description ne peut pas dépasser 500 caractères" },
                                        ]}
                                    >
                                        <TextArea rows={4} placeholder="Décrivez le thème de discussion" showCount maxLength={500} />
                                    </Form.Item>
                                  
                                </Col>


                                <Col xs={24} lg={8}>
                                    <Form.Item
                                        label="Statut"
                                        name="status"
                                        rules={[{ required: true, message: "Le statut est obligatoire" }]}
                                    >
                                        <Select size="large" placeholder="Sélectionnez le statut">
                                            <Option value="ACTIVE">Actif</Option>
                                            <Option value="INACTIVE">Inactif</Option>
                                        </Select>
                                    </Form.Item>

                                    {isEditing && theme && (
                                        <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
                                            <Title level={5}>Informations</Title>
                                            <Space direction="vertical" size="small">
                                                <Text type="secondary">
                                                    <strong>Créé par:</strong> {theme.createdBy?.firstName} {theme.createdBy?.lastName}
                                                </Text>
                                                <Text type="secondary">
                                                    <strong>Date de création:</strong> {new Date(theme.createdAt).toLocaleDateString("fr-FR")}
                                                </Text>
                                                <Text type="secondary">
                                                    <strong>Discussions:</strong> {theme._count?.discussions || 0}
                                                </Text>
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
                                        {isEditing ? "Mettre à jour" : "Créer le thème"}
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

export default ThemeForm
