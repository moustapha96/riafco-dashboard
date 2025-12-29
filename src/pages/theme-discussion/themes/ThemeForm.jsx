"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, Space, Typography, Alert, Spin, Row, Col, Breadcrumb, Upload, Switch } from "antd"
import { SaveOutlined, ArrowLeftOutlined, BookOutlined, UploadOutlined, FileOutlined, DeleteOutlined } from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import themeService from "../../../services/themeService"
import { buildImageUrl } from "../../../utils/imageUtils"
import { toast } from "sonner"


const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const ThemeForm = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [error, setError] = useState(null)
    const [theme, setTheme] = useState(null)
    const [fileList, setFileList] = useState([])

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
                isPublic: response.data.isPublic !== undefined ? response.data.isPublic : true,
            })

            // Si un fichier existe, l'afficher dans la liste
            if (response.data.file) {
                setFileList([{
                    uid: '-1',
                    name: response.data.file.split('/').pop() || 'document',
                    status: 'done',
                    url: buildImageUrl(response.data.file),
                }])
            } else {
                setFileList([])
            }
        } catch (err) {
            console.error("Erreur lors du chargement du thème:", err)
            setError("Erreur lors du chargement du thème")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (values) => {
        try {
            setSubmitLoading(true)
            setError(null)

            // Créer FormData pour l'upload de fichier
            const formData = new FormData()
            formData.append("title", values.title)
            formData.append("description", values.description)
            formData.append("status", values.status)
            formData.append("isPublic", values.isPublic !== undefined ? values.isPublic.toString() : "true")

            // Gestion du fichier
            const hasNewFile = fileList.length > 0 && fileList[0].originFileObj
            const hasExistingFile = isEditing && theme?.file && fileList.length > 0 && !fileList[0].originFileObj
            const fileRemoved = isEditing && theme?.file && fileList.length === 0

            if (hasNewFile) {
                // Nouveau fichier à uploader
                formData.append("file", fileList[0].originFileObj)
                console.log("Envoi d'un nouveau fichier:", fileList[0].originFileObj.name)
            } else if (fileRemoved) {
                // Fichier supprimé - envoyer un indicateur pour que le backend supprime le fichier
                // Note: Le backend doit gérer le paramètre "removeFile" ou vérifier si file est undefined
                formData.append("removeFile", "true")
                console.log("Indication de suppression du fichier")
            } else if (hasExistingFile) {
                // Fichier existant conservé - ne rien envoyer, le backend gardera l'ancien
                console.log("Conservation du fichier existant")
            }

            // Debug: Afficher le contenu du FormData
            console.log("FormData contents:")
            for (let pair of formData.entries()) {
                console.log(pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1]))
            }

            if (isEditing) {
                await themeService.update(id, formData)
                toast.success("Thème mis à jour avec succès")
            } else {
                await themeService.create(formData)
                toast.success("Thème créé avec succès")
            }

            navigate("/themes")
        } catch (err) {
            console.error("Erreur lors de la sauvegarde:", err)
            const errorMessage = err.response?.data?.message || err.message || "Erreur lors de la sauvegarde du thème"
            setError(errorMessage)
            toast.error(errorMessage)
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
                                { title: <Link to="/">Tableau de bord</Link> },
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
                                isPublic: true,
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

                                    <Form.Item
                                        label="Document (optionnel)"
                                        tooltip="Ajoutez un document ou une image lié au thème (max 10 MB)"
                                    >
                                        <Upload
                                            fileList={fileList}
                                            beforeUpload={() => false}
                                            onChange={({ fileList: newFileList }) => {
                                                // Vérifier la taille du fichier (10 MB max)
                                                const file = newFileList[0]?.originFileObj
                                                if (file && file.size > 10 * 1024 * 1024) {
                                                    toast.error("Le fichier ne doit pas dépasser 10 MB")
                                                    return
                                                }
                                                setFileList(newFileList)
                                            }}
                                            maxCount={1}
                                            accept=".jpeg,.jpg,.png,.gif,.webp,.pdf,.doc,.docx,.txt"
                                            onRemove={() => {
                                                setFileList([])
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                {fileList.length > 0 ? "Remplacer le fichier" : "Sélectionner un fichier"}
                                            </Button>
                                        </Upload>
                                        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                                            Formats acceptés: Images (JPEG, JPG, PNG, GIF, WEBP) ou Documents (PDF, DOC, DOCX, TXT) - Max 10 MB
                                        </div>
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

                                    <Form.Item
                                        label="Thème public"
                                        name="isPublic"
                                        valuePropName="checked"
                                        tooltip="Un thème public est visible par tous les utilisateurs"
                                    >
                                        <Switch checkedChildren="Public" unCheckedChildren="Privé" />
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
                                                {theme.file && (
                                                    <div>
                                                        <Text type="secondary">
                                                            <strong>Document:</strong>{" "}
                                                            <a
                                                                href={buildImageUrl(theme.file)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ color: "#1890ff" }}
                                                            >
                                                                <FileOutlined /> Voir le document
                                                            </a>
                                                        </Text>
                                                    </div>
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
