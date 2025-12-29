"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, Typography, Button, Avatar, Tag, Spin, message, Row, Col, Divider, Space, Breadcrumb } from "antd"
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons"
import moment from "moment"
import newsService from "../../../services/newsService"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title, Paragraph, Text } = Typography

// Fonction pour supprimer les balises HTML et retourner uniquement le texte
const stripHtmlTags = (html) => {
    if (!html) return ""
    // Créer un élément DOM temporaire pour extraire le texte
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
}

const NewsDetails = () => {
    const { id } = useParams()
    console.log(id)
    const navigate = useNavigate()
    const [news, setNews] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNewsDetails()
    }, [id])

    const fetchNewsDetails = async () => {
        try {
            setLoading(true)
            const response = await newsService.getById(id)
            console.log(response)
            setNews(response.news)
        } catch (error) {
            console.log(error)
            message.error("Erreur lors du chargement des détails")
            navigate("/news")
        } finally {
            setLoading(false)
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
    const getValidationText = (status) => {
        switch (status) {
            case "VALIDATED":
                return "Validé par l'administrateur"
            case "DECLINED":
                return "Décliné par l'administrateur"
            case "PENDING":
                return "En attente de validation"
            default:
                return "En attente de validation"
        }
    }

     const getValdatedColor = (status) => {
        switch (status) {
            case "VALIDATED":
                return "green"
            case "DECLINED":
                return "orange"
            default:
                return "default"
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!news) {
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
                        Gestion des Articles
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: <Link to="/admin/news">Gestion des Articles</Link> },
                            { title: "Détails de l'article" },
                        ]}
                    />
                </div>

                <div className="md:flex md:justify-end justify-end items-center mb-6">
                    <Button
                        onClick={() => navigate(-1)}
                        icon={<ArrowLeftOutlined />}
                    >
                        Retour
                    </Button>
                </div>

                <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ marginBottom: "24px" }}>


                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <Title level={1} style={{ marginBottom: "8px" }}>
                                    {news.title_fr} <br /> {news.title_en}
                                </Title>

                                <Space size="large" wrap>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Avatar size="small" icon={<UserOutlined />} src={buildImageUrl(news.author?.profilePic)} />
                                        <Text>
                                            {news.author?.firstName} {news.author?.lastName}
                                        </Text>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <CalendarOutlined />
                                        <Text type="secondary">
                                            {news.publishedAt
                                                ? `Publié le ${moment(news.publishedAt).format("DD MMMM YYYY à HH:mm")}`
                                                : `Créé le ${moment(news.createdAt).format("DD MMMM YYYY à HH:mm")}`}
                                        </Text>
                                    </div>

                                    <Tag color={getStatusColor(news.status)}>{getStatusText(news.status)}</Tag>
                                        <Tag color={getValdatedColor(news.validated)}>{getValidationText(news.validated)}</Tag>

                                </Space>
                            </div>

                            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/news/${news.id}/edit`)}>
                                Modifier
                            </Button>
                        </div>
                    </div>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            {/* Image principale */}
                            {news.image && (
                                <Card style={{ marginBottom: "24px" }}>
                                    <img
                                        src={buildImageUrl(news.image) || "/placeholder.svg"}
                                        alt={news.title_fr}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "400px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Card>
                            )}

                            {/* Contenu principal */}
                            <Card>
                                {news.content_fr && (
                                    <div style={{ fontSize: "16px", lineHeight: "1.8", marginBottom: "24px" }}>
                                        <Title level={4} style={{ marginBottom: "12px" }}>Contenu (Français)</Title>
                                        <Paragraph style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
                                            {stripHtmlTags(news.content_fr)}
                                        </Paragraph>
                                    </div>
                                )}
                                {news.content_en && (
                                    <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
                                        <Title level={4} style={{ marginBottom: "12px" }}>Contenu (Anglais)</Title>
                                        <Paragraph style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
                                            {stripHtmlTags(news.content_en)}
                                        </Paragraph>
                                    </div>
                                )}
                            </Card>

                            {news.galleries && news.galleries.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">Galerie ({news.galleries.length})</Text>
                                    <Row gutter={[4, 4]} style={{ marginTop: 4 }}>
                                        {news.galleries.slice(0, 3).map((img, index) => (
                                            <Col key={index}>
                                                <img
                                                    src={buildImageUrl(img)}
                                                    alt={`Gallery ${index}`}
                                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                        </Col>

                        <Col xs={24} lg={8}>
                            {/* Informations sur l'auteur */}
                            <Card title="Auteur" style={{ marginBottom: "24px" }}>
                                <div style={{ textAlign: "center" }}>
                                    <Avatar
                                        size={80}
                                        icon={<UserOutlined />}
                                        src={buildImageUrl(news.author?.profilePic)}
                                        style={{ marginBottom: "16px" }}
                                    />
                                    <Title level={4} style={{ marginBottom: "8px" }}>
                                        {news.author?.firstName} {news.author?.lastName}
                                    </Title>
                                    <Text type="secondary">Auteur RIAFCO</Text>
                                </div>
                            </Card>

                            {/* Informations sur l'article */}
                            <Card title="Informations">
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <div>
                                        <Text strong>Statut: </Text>
                                        <Tag color={getStatusColor(news.status)}>{getStatusText(news.status)}</Tag>
                                    </div>

                                    <div>
                                        <Text strong>Validation: </Text>
                                        <Tag color={getValdatedColor(news.validated)}>{getValidationText(news.validated)}</Tag>
                                    </div>

                                    <Divider style={{ margin: "12px 0" }} />

                                    <div>
                                        <Text strong>Date de création: </Text>
                                        <br />
                                        <Text type="secondary">{moment(news.createdAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                    </div>

                                    {news.publishedAt && (
                                        <>
                                            <Divider style={{ margin: "12px 0" }} />
                                            <div>
                                                <Text strong>Date de publication: </Text>
                                                <br />
                                                <Text type="secondary">{moment(news.publishedAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                            </div>
                                        </>
                                    )}

                                    {news.updatedAt !== news.createdAt && (
                                        <>
                                            <Divider style={{ margin: "12px 0" }} />
                                            <div>
                                                <Text strong>Dernière modification: </Text>
                                                <br />
                                                <Text type="secondary">{moment(news.updatedAt).format("DD MMMM YYYY à HH:mm")}</Text>
                                            </div>
                                        </>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    </>

}

export default NewsDetails
