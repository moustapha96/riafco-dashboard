"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, List, Avatar, Typography, Button, Space } from "antd"
import {
    BookOutlined,
    MessageOutlined,
    CommentOutlined,
    UserOutlined,
    PlusOutlined,
    EyeOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import themeService from "../../services/themeService"
import discussionService from "../../services/discussionService"

const { Title, Text } = Typography

const DashboardThemeDiscussion = () => {
    const [stats, setStats] = useState({
        themes: 0,
        discussions: 0,
        comments: 0,
        users: 0,
    })
    const [recentThemes, setRecentThemes] = useState([])
    const [recentDiscussions, setRecentDiscussions] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)

            // Charger les thèmes récents
            const themesResponse = await themeService.getAll({ page: 1, limit: 5 })
            setRecentThemes(themesResponse.themes || [])

            // Charger les discussions récentes
            const discussionsResponse = await discussionService.getAll({ page: 1, limit: 5 })
            setRecentDiscussions(discussionsResponse.discussions || [])

            // Simuler des statistiques (à remplacer par de vraies données)
            setStats({
                themes: themesResponse.total || 0,
                discussions: discussionsResponse.total || 0,
                comments: 150, // À récupérer depuis l'API
                users: 25, // À récupérer depuis l'API
            })
        } catch (error) {
            console.error("Erreur lors du chargement du dashboard:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div style={{ marginBottom: "24px" }}>
                <Title level={2}>Tableau de bord</Title>
                <Text type="secondary">Vue d'ensemble de votre forum</Text>
            </div>

            {/* Statistiques */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Thèmes"
                            value={stats.themes}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: "#1e81b0" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Discussions"
                            value={stats.discussions}
                            prefix={<MessageOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Commentaires"
                            value={stats.comments}
                            prefix={<CommentOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Utilisateurs"
                            value={stats.users}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#f5222d" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Actions rapides */}
            <Card title="Actions rapides" style={{ marginBottom: "24px" }}>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/themes/new")}>
                        Nouveau thème
                    </Button>
                    <Button icon={<PlusOutlined />} onClick={() => navigate("/discussions/new")}>
                        Nouvelle discussion
                    </Button>
                </Space>
            </Card>

            {/* Contenu récent */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Thèmes récents"
                        extra={
                            <Button type="link" onClick={() => navigate("/themes")} icon={<EyeOutlined />}>
                                Voir tout
                            </Button>
                        }
                    >
                        <List
                            loading={loading}
                            dataSource={recentThemes}
                            renderItem={(theme) => (
                                <List.Item key={theme.id}>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<BookOutlined />} />}
                                        title={theme.title}
                                        description={theme.description}
                                    />
                                    <Button type="link" onClick={() => navigate(`/themes/${theme.id}`)}>
                                        Voir
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Discussions récentes"
                        extra={
                            <Button type="link" onClick={() => navigate("/discussions")} icon={<EyeOutlined />}>
                                Voir tout
                            </Button>
                        }
                    >
                        <List
                            loading={loading}
                            dataSource={recentDiscussions}
                            renderItem={(discussion) => (
                                <List.Item key={discussion.id}>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<MessageOutlined />} />}
                                        title={discussion.title}
                                        description={`Par ${discussion.createdBy?.firstName} ${discussion.createdBy?.lastName}`}
                                    />
                                    <Button type="link" onClick={() => navigate(`/discussions/${discussion.id}`)}>
                                        Voir
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default DashboardThemeDiscussion
