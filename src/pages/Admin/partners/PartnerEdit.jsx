"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Upload, Button, Row, Col, Typography, Space, Spin, Breadcrumb } from "antd"
import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import partnerService from "../../../services/partnerService"
import { toast } from "sonner"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title } = Typography
const { TextArea } = Input

const PartnerEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = Boolean(id)

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(isEditing)
    const [partner, setPartner] = useState(null)

    useEffect(() => {
        if (isEditing) {
            fetchPartner()
        }
    }, [id])

    const fetchPartner = async () => {
        setInitialLoading(true)
        try {
            const response = await partnerService.getById(id)
            const partnerData = response.data
            setPartner(partnerData)

            form.setFieldsValue({
                name: partnerData.name,
                description: partnerData.description,
                country: partnerData.country,
                address: partnerData.address,
                email: partnerData.email,
                phone: partnerData.phone,
                website: partnerData.website,
            })
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors du chargement du partenaire")
            navigate("/admin/partners")
        } finally {
            setInitialLoading(false)
        }
    }

    const handleSubmit = async (values) => {
        setLoading(true)
        console.log(values)
        try {
            const formData = new FormData()

            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    if (key === "logo" && values[key]?.file) {
                        formData.append("logo", values[key].file)
                    } else if (key !== "logo") {
                        formData.append(key, values[key])
                    }
                }
            })
            console.log(formData)

            if (isEditing) {
                await partnerService.update(id, formData)
                toast.success("Partenaire modifié avec succès")
            } else {
                await partnerService.create(formData)
                toast.success("Partenaire créé avec succès")
            }

            navigate("/admin/partners")
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    const uploadProps = {
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
        },
    }

    if (initialLoading) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <Spin size="large" />
            </div>
        )
    }

    return <>

        <div className="container-fluid relative px-3">
            <div className="layout-specing"
                style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    paddingRight: "8px"
                }}>

                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        Gestion des Partenaires
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/admin/partners">Gestion des Partenaires</Link> },
                            { title: "Modification" },
                        ]}
                    />
                </div>
                <div className="md:flex justify-end items-center mb-6">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/partners")}>
                        Retour
                    </Button>
                </div>


                <div style={{ padding: "24px" }}>
                    <Card>
                        <div style={{ marginBottom: "24px" }}>
                            <Space justify="space-between" align="middle" style={{ marginBottom: "24px" }}>

                                <Title level={2} style={{ margin: 0 }}>
                                    {isEditing ? "Modifier le Partenaire" : "Créer un Partenaire"}
                                </Title>
                            </Space>
                        </div>

                        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: "800px" }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Nom du Partenaire"
                                        rules={[{ required: true, message: "Le nom est requis" }]}
                                    >
                                        <Input placeholder="Nom du partenaire" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="country" label="Pays" rules={[{ required: true, message: "Le pays est requis" }]}>
                                        <Input placeholder="Pays" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "La description est requise" }]}
                            >
                                <TextArea rows={4} placeholder="Description du partenaire" size="large" />
                            </Form.Item>

                            <Form.Item name="address" label="Adresse">
                                <TextArea rows={2} placeholder="Adresse complète" size="large" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: "L'email est requis" },
                                            { type: "email", message: "Format d'email invalide" },
                                        ]}
                                    >
                                        <Input placeholder="email@exemple.com" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="phone" label="Téléphone">
                                        <Input placeholder="+33 1 23 45 67 89" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="website" label="Site Web" rules={[{ type: "url", message: "URL invalide" }]}>
                                        <Input placeholder="https://www.exemple.com" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="logo" label="Logo">
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />} size="large">
                                                Sélectionner le logo
                                            </Button>
                                        </Upload>
                                        {isEditing && partner?.logo && (
                                            <div style={{ marginTop: "8px" }}>
                                                <img
                                                    src={buildImageUrl(partner.logo) || "/placeholder.svg"}
                                                    alt="Logo actuel"
                                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                                />
                                            </div>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: "32px" }}>
                                <Space>
                                    <Button size="large" onClick={() => navigate("/admin/partners")}>
                                        Annuler
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} size="large">
                                        {isEditing ? "Modifier" : "Créer"}
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

export default PartnerEdit
