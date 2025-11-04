/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, Button, Typography, Tag, Avatar, Space, Spin, Row, Col, Divider, Breadcrumb } from "antd"
import {
    ArrowLeftOutlined,
    EditOutlined,
    UserOutlined,
    BookOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons"
import moment from "moment"
import MDEditor from "@uiw/react-md-editor"
import activityService from "../../../services/activityService"
import { FaHandshake } from "react-icons/fa"
import { toast } from "sonner"


const { Title, Text } = Typography

const ActivitesDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activity, setActivity] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchActivity()
    }, [id])

    const fetchActivity = async () => {
        try {
            setLoading(true)
            const response = await activityService.getById(id)
            console.log(response.activity)
            setActivity(response.activity)
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors du chargement de l'activité")
            navigate("/admin/activities")
        } finally {
            setLoading(false)
        }
    }

    const getActivityIcon = (iconName) => {
        switch (iconName) {
            case "book":
                return <BookOutlined />
            case "users":
                return <UsergroupAddOutlined />
            case "handshake":
                return <FaHandshake />
            default:
                return <BookOutlined />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PUBLISHED":
                return "green"
            case "DRAFT":
                return "orange"
            default:
                return "default"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "PUBLISHED":
                return "Publié"
            case "DRAFT":
                return "Brouillon"
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!activity) {
        return null
    }

    return <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing"
                style={{
                    maxHeight: "calc(100vh - 100px)", // Ajustez cette valeur selon votre mise en page
                    overflowY: "auto", // Active la barre de défilement verticale
                    paddingRight: "8px" // Évite que le contenu ne touche la barre de défilement
                }}>
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        Gestion des Activités
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/admin/activities">Gestion des Activités</Link> },
                            { title: activity?.title || "Détails de l'Activité" }
                        ]}
                    />
                </div>
                <div className="md:flex justify-end items-center">


                    <Button
                        onClick={() => navigate(-1)}
                        icon={<ArrowLeftOutlined />}
                    >
                        Retour
                    </Button>
                </div>

                <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "24px" }}>


                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <Title level={1} style={{ marginBottom: "8px" }}>
                                    {activity.title_fr}
                                </Title>
                                <Title level={1} style={{ marginBottom: "8px" }}>
                                    {activity.title_en}
                                </Title>
                                <Space size="middle" style={{ marginBottom: "16px" }}>
                                    <Tag color={getStatusColor(activity.status)} size="large">
                                        {getStatusText(activity.status)}
                                    </Tag>
                                    <div style={{ fontSize: "24px", color: "#1e81b0" }}>{getActivityIcon(activity.icon)}</div>
                                </Space>
                            </div>
                            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/activities/${activity.id}/edit`)}>
                                Modifier
                            </Button>
                        </div>
                    </div>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            {activity.image && (
                                <Card title="Image" style={{ marginBottom: "24px" }}>
                                    <img
                                        src={activity.image || "/placeholder.svg"}
                                        alt={activity.title}
                                        style={{
                                            width: "100%",
                                            maxHeight: "400px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Card>
                            )}

                            <Card title="Description(Fr)" style={{ marginBottom: "24px" }}>
                                <div data-color-mode="light">
                                    <MDEditor.Markdown source={activity.description_fr} />
                                </div>
                            </Card>
                            <Card title="Description(En)" style={{ marginBottom: "24px" }}>
                                <div data-color-mode="light">
                                    <MDEditor.Markdown source={activity.description_en} />
                                </div>
                            </Card>

                            {activity.galleries && activity.galleries.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">Galerie ({activity.galleries.length})</Text>
                                    <Row gutter={[4, 4]} style={{ marginTop: 4 }}>
                                        {activity.galleries.slice(0, 3).map((img, index) => (
                                            <Col key={index}>
                                                <img
                                                    src={img}
                                                    alt={`Gallery ${index}`}
                                                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "4px" }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title="Informations">
                                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                    <div>
                                        <Text strong>Auteur</Text>
                                        <div style={{ marginTop: "8px" }}>
                                            <Space>
                                                <Avatar size="small" icon={<UserOutlined />} src={activity.author?.profilePic} />
                                                <Text>
                                                    {activity.author?.firstName} {activity.author?.lastName}
                                                </Text>
                                            </Space>
                                        </div>
                                    </div>

                                    <Divider style={{ margin: "12px 0" }} />


                                    <div>
                                        <Text strong>Date de l'activité </Text>
                                        <div style={{ marginTop: "4px" }}>
                                            <Text type="secondary">{activity.dateActivity}</Text>
                                        </div>
                                    </div>

                                    <div>
                                        <Text strong>Date de création</Text>
                                        <div style={{ marginTop: "4px" }}>
                                            <Text type="secondary">{moment(activity.createdAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                        </div>
                                    </div>

                                    <div>
                                        <Text strong>Dernière modification</Text>
                                        <div style={{ marginTop: "4px" }}>
                                            <Text type="secondary">{moment(activity.updatedAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                        </div>
                                    </div>

                                    <Divider style={{ margin: "12px 0" }} />

                                    <div>
                                        <Text strong>Statut</Text>
                                        <div style={{ marginTop: "8px" }}>
                                            <Tag color={getStatusColor(activity.status)}>{getStatusText(activity.status)}</Tag>
                                        </div>
                                    </div>

                                    <div>
                                        <Text strong>Type d'activité</Text>
                                        <div style={{ marginTop: "8px", fontSize: "20px", color: "#1e81b0" }}>
                                            {getActivityIcon(activity.icon)}
                                        </div>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    </>

}

export default ActivitesDetails
