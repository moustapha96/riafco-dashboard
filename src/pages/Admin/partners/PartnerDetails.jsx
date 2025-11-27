"use client"

import { useState, useEffect } from "react"
import { Card, Button, Avatar, Typography, Row, Col, Space, Divider, Tag, Spin, message, Breadcrumb } from "antd"
import {
    ArrowLeftOutlined,
    EditOutlined,
    GlobalOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from "@ant-design/icons"
import { useParams, useNavigate, Link } from "react-router-dom"
import partnerService from "../../../services/partnerService"
import moment from "moment"
import { toast } from "sonner"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title, Text, Paragraph } = Typography

const PartnerDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [partner, setPartner] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPartnerDetails()
    }, [id])

    const fetchPartnerDetails = async () => {
        try {
            const response = await partnerService.getById(id)
            console.log(response.data.logo)
            setPartner(response.data)
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors du chargement des détails du partenaire")
            navigate("/admin/partners")
        } finally {
            setLoading(false)
        }
    }



    const handleEdit = () => {
        navigate(`/admin/partners/${id}/edit`)
    }

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <Spin size="large" />
            </div>
        )
    }

    if (!partner) {
        return null
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
                            { title: "Details" },
                        ]}
                    />
                </div>

                <div className="md:flex justify-end items-center mb-6">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: "16px" }}>
                        Retour
                    </Button>
                </div>
                <div style={{ padding: "24px" }}>
                    <Card>
                        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>

                            <Col>
                                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                                    Modifier
                                </Button>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={8} style={{ textAlign: "center" }}>
                                <Avatar
                                    size={120}
                                    src={buildImageUrl(partner.logo)}
                                    style={{
                                        backgroundColor: "#1e81b0",
                                        fontSize: "48px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    {partner.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Title level={3}>{partner.name}</Title>
                                <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>
                                    {partner.country}
                                </Tag>
                            </Col>

                            <Col xs={24} md={16}>
                                <Title level={4}>Informations générales</Title>
                                <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>{partner.description}</Paragraph>

                                <Divider />

                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12}>
                                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong>
                                                    <EnvironmentOutlined style={{ marginRight: "8px", color: "#1e81b0" }} />
                                                    Adresse
                                                </Text>
                                                <br />
                                                <Text>{partner.address || "Non renseignée"}</Text>
                                            </div>

                                            <div>
                                                <Text strong>
                                                    <MailOutlined style={{ marginRight: "8px", color: "#1e81b0" }} />
                                                    Email
                                                </Text>
                                                <br />
                                                <Text copyable>{partner.email}</Text>
                                            </div>
                                        </Space>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong>
                                                    <PhoneOutlined style={{ marginRight: "8px", color: "#1e81b0" }} />
                                                    Téléphone
                                                </Text>
                                                <br />
                                                <Text copyable>{partner.phone || "Non renseigné"}</Text>
                                            </div>

                                            <div>
                                                <Text strong>
                                                    <GlobalOutlined style={{ marginRight: "8px", color: "#1e81b0" }} />
                                                    Site Web
                                                </Text>
                                                <br />
                                                {partner.website ? (
                                                    <Button type="link" href={partner.website} target="_blank" style={{ padding: 0 }}>
                                                        {partner.website}
                                                    </Button>
                                                ) : (
                                                    <Text type="secondary">Non renseigné</Text>
                                                )}
                                            </div>
                                        </Space>
                                    </Col>
                                </Row>

                                <Divider />

                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12}>
                                        <Text strong>
                                            <CalendarOutlined style={{ marginRight: "8px", color: "#1e81b0" }} />
                                            Date de création
                                        </Text>
                                        <br />
                                        <Text>{moment(partner.createdAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Text strong>
                                            <CalendarOutlined style={{ marginRight: "8px", color: "#1e81b0" }} />
                                            Dernière modification
                                        </Text>
                                        <br />
                                        <Text>{moment(partner.updatedAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </div>

    </>
}

export default PartnerDetails
