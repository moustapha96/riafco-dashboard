"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, Form, Input, Button, Select, Upload, message, Space, Typography, Spin, Row, Col } from "antd"
import {
    ArrowLeftOutlined,
    UploadOutlined,
    BookOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons"
import activityService from "../../../services/activityService"
import { FaHandshake } from "react-icons/fa"
import { toast } from "sonner"
import ReactQuill from "react-quill"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title } = Typography
const { Option } = Select

const ActivitesEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(!!id)
    const [description_fr, setDescriptionFr] = useState("")
    const [description_en, setDescriptionEn] = useState("")
    const [fileList, setFileList] = useState([])
    const [galleryList, setGalleryList] = useState([])


    const isEditing = !!id

    useEffect(() => {
        if (isEditing) {
            fetchActivity()
        }
    }, [id])

    const fetchActivity = async () => {
        try {
            setInitialLoading(true)
            const response = await activityService.getById(id)
            const activity = response.activity

            form.setFieldsValue({
                title_fr: activity.title_fr,
                title_en: activity.title_en,
                icon: activity.icon,
                status: activity.status,
            })

            setDescriptionFr(activity.description_fr || "")
            setDescriptionEn(activity.description_en || "")
            setFileList(
                activity.image
                    ? [
                        {
                            uid: "-1",
                            name: "image.jpg",
                            status: "done",
                            url: buildImageUrl(activity.image),
                        },
                    ]
                    : [],
            )
            setGalleryList(
                activity.galleries?.map((url, index) => ({
                    uid: `-${index + 2}`,
                    name: `gallery-${index}.jpg`,
                    status: "done",
                    url: buildImageUrl(url),
                })) || []
            )
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors du chargement de l'activité")
            navigate("/admin/activities")
        } finally {
            setInitialLoading(false)
        }
    }

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("title_fr", values.title_fr)
            formData.append("title_en", values.title_en)
            formData.append("description_fr", description_fr)
            formData.append("description_en", description_en)
            formData.append("icon", values.icon || "book")
            formData.append("status", values.status || "DRAFT")
            formData.append("dateActivity", values.dateActivity)

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("image", fileList[0].originFileObj)
            }
            galleryList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append("galleries", file.originFileObj)
                }
            })

            if (isEditing) {
                await activityService.update(id, formData)
                message.success("Activité mise à jour avec succès")
            } else {
                await activityService.create(formData)
                message.success("Activité créée avec succès")
            }

            navigate("/admin/activities")
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
    }

    const galleryUploadProps = {
        fileList: galleryList,
        onChange: ({ fileList: newFileList }) => setGalleryList(newFileList),
        beforeUpload: () => false,
        multiple: true, // Permet de sélectionner plusieurs fichiers
        accept: "image/*",
        maxCount: 10
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


    if (initialLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <Spin size="large" />
            </div>
        )
    }

    return <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing"
                style={{
                    maxHeight: "calc(100vh - 100px)", // Ajustez cette valeur selon votre mise en page
                    overflowY: "auto", // Active la barre de défilement verticale
                    paddingRight: "8px" // Évite que le contenu ne touche la barre de défilement
                }}>
                <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/activities")} style={{ marginBottom: "24px" }}>
                        Retour aux activités
                    </Button>

                    <Card>
                        <Title level={2} style={{ marginBottom: "24px" }}>
                            {isEditing ? "Modifier l'activité" : "Créer une activité"}
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                status: "DRAFT",
                                icon: "book",
                            }}
                        >
                            <Form.Item name="title_fr" label="Titre en Francais" rules={[{ required: true, message: "Le titre est requis" }]}>
                                <Input placeholder="Titre de l'activité" size="large" />
                            </Form.Item>

                            <Form.Item name="title_en" label="Titre en Anglais" rules={[{ required: true, message: "Le titre est requis" }]}>
                                <Input placeholder="Titre de l'activité" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="dateActivity"
                                label="Date de l'activité"
                                rules={[
                                    { required: true, message: "Le titre est requis" },
                                    { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" },
                                ]}
                            >
                                <Input type="date" placeholder="Date de l'activité" />
                            </Form.Item>

                            <Form.Item name="icon" label="Type d'activité" rules={[{ required: true }]}>
                                <Select size="large">
                                    <Option value="book">
                                        <Space>
                                            <BookOutlined />
                                            Formation
                                        </Space>
                                    </Option>
                                    <Option value="users">
                                        <Space>
                                            <UsergroupAddOutlined />
                                            Conférence
                                        </Space>
                                    </Option>
                                    <Option value="handshake">
                                        <Space>
                                            <FaHandshake />
                                            Atelier
                                        </Space>
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Description en Francais" rules={[{ required: true, message: "La description est requise" }]}>
                                <div data-color-mode="light">

                                    <ReactQuill
                                        theme="snow"
                                        value={description_fr}
                                        onChange={setDescriptionFr}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description ..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item label="Description en Anglais" rules={[{ required: true, message: "La description est requise" }]}>
                                <div data-color-mode="light">

                                    <ReactQuill
                                        theme="snow"
                                        value={description_en}
                                        onChange={setDescriptionEn}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description ..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item name="status" label="Statut">
                                <Select size="large">
                                    <Option value="DRAFT">Brouillon</Option>
                                    <Option value="PUBLISHED">Publié</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Image">
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />} size="large">
                                        Sélectionner une image
                                    </Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item label="Galerie d'images">
                                <Upload {...galleryUploadProps}>
                                    <Button icon={<UploadOutlined />}>
                                        Sélectionner des images
                                    </Button>
                                </Upload>
                                {galleryList.length > 0 && (
                                    <Row gutter={[8, 8]} style={{ marginTop: "8px" }}>
                                        {galleryList.map((file, index) => (
                                            <Col key={index}>
                                                <img
                                                    src={buildImageUrl(file.url) || buildImageUrl(file.thumbUrl)}
                                                    alt={`Gallery ${index}`}
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Form.Item>


                            <Form.Item style={{ textAlign: "right", marginTop: "32px" }}>
                                <Space size="middle">
                                    <Button size="large" onClick={() => navigate("/admin/activities")}>
                                        Annuler
                                    </Button>
                                    <Button type="submit"  loading={loading} size="large">
                                        {isEditing ? "Mettre à jour" : "Créer l'activité"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    </>

}

export default ActivitesEdit
