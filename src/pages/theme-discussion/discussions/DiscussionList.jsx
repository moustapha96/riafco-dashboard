"use client"

import { useState, useEffect } from "react"
import {
    Card,
    List,
    Button,
    Input,
    Space,
    Typography,
    Avatar,
    Tag,
    Pagination,
    Empty,
    Spin,
    Alert,
    Row,
    Col,
    Statistic,
    Select,
    Dropdown,
    Breadcrumb,
} from "antd"
import {
    PlusOutlined,
    SearchOutlined,
    MessageOutlined,
    CommentOutlined,
    UserOutlined,
    EyeOutlined,
    EditOutlined,
    BookOutlined,
    PushpinOutlined,
    LockOutlined,
    MoreOutlined,
} from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import moment from "moment"
import "moment/locale/fr"
import themeService from "../../../services/themeService"
import discussionService from "../../../services/discussionService"

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

moment.locale("fr")

const DiscussionList = () => {
    const [discussions, setDiscussions] = useState([])
    const [themes, setThemes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [filters, setFilters] = useState({
        search: "",
        themeId: null,
        status: null,
        sortBy: "createdAt",
        sortOrder: "desc",
    })

    const navigate = useNavigate()

    useEffect(() => {
        loadThemes()
    }, [])

    useEffect(() => {
        loadDiscussions()
    }, [pagination.current, pagination.pageSize, filters])

    const loadThemes = async () => {
        try {
            // const response = await themeService.getById(id)
            const response = await themeService.getAll()
            console.log(response)
            setThemes(response.data || [])
        } catch (err) {
            console.error("Erreur lors du chargement des thèmes:", err)
        }
    }

    const loadDiscussions = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await discussionService.getAll()
            console.log(response)
            setDiscussions(response.data || [])
            setPagination((prev) => ({
                ...prev,
                total: response.pagination.total || 0,
            }))
        } catch (err) {
            console.error("Erreur lors du chargement des discussions:", err)
            setError("Erreur lors du chargement des discussions")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value) => {
        setFilters((prev) => ({ ...prev, search: value }))
        setPagination((prev) => ({ ...prev, current: 1 }))
    }

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPagination((prev) => ({ ...prev, current: 1 }))
    }

    const handlePaginationChange = (page, pageSize) => {
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }))
    }

    const handleViewDiscussion = (discussionId) => {
        navigate(`/discussions/${discussionId}`)
    }

    const handleEditDiscussion = (discussionId) => {
        navigate(`/discussions/${discussionId}/edit`)
    }

    const handleCreateDiscussion = () => {
        navigate("/discussions/new")
    }

    const handleTogglePin = async (discussionId) => {
        try {
            await discussionService.togglePin(discussionId)
            loadDiscussions()
        } catch (err) {
            console.error("Erreur lors de l'épinglage:", err)
        }
    }

    const handleToggleClose = async (discussionId) => {
        try {
            await discussionService.toggleClose(discussionId)
            loadDiscussions()
        } catch (err) {
            console.error("Erreur lors de la fermeture:", err)
        }
    }

    const getDiscussionActions = (discussion) => [
        {
            key: "view",
            label: "Voir",
            icon: <EyeOutlined />,
            onClick: () => handleViewDiscussion(discussion.id),
        },
        {
            key: "edit",
            label: "Modifier",
            icon: <EditOutlined />,
            onClick: () => handleEditDiscussion(discussion.id),
        },
        {
            type: "divider",
        },
        // {
        //     key: "pin",
        //     label: discussion.isPinned ? "Désépingler" : "Épingler",
        //     icon: <PushpinOutlined />,
        //     onClick: () => handleTogglePin(discussion.id),
        // },
        // {
        //     key: "close",
        //     label: discussion.isClosed ? "Rouvrir" : "Fermer",
        //     icon: <LockOutlined />,
        //     onClick: () => handleToggleClose(discussion.id),
        // },
    ]

    if (error) {
        return <Alert message="Erreur" description={error} type="error" showIcon style={{ margin: "20px 0" }} />
    }

    return (
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
                    <h5 className="text-lg font-semibold">Discussions</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title:  "Discussions" },
                        ]}
                    />
                </div>

                <div>
                    {/* En-tête */}
                    <div style={{ marginBottom: "24px" }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Title level={2} style={{ margin: 0 }}>
                                    Discussions
                                </Title>
                                <Text type="secondary">Gérez les discussions du forum</Text>
                            </Col>
                            <Col>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateDiscussion}>
                                    Nouvelle discussion
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Filtres et recherche */}
                    <Card style={{ marginBottom: "24px" }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} lg={8}>
                                <Search
                                    placeholder="Rechercher une discussion..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    onSearch={handleSearch}
                                />
                            </Col>
                            <Col xs={24} sm={6} lg={4}>
                                <Select
                                    placeholder="Thème"
                                    allowClear
                                    style={{ width: "100%" }}
                                    onChange={(value) => handleFilterChange("themeId", value)}
                                >
                                    {themes.map((theme) => (
                                        <Option key={theme.id} value={theme.id}>
                                            {theme.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} sm={6} lg={4}>
                                <Select
                                    placeholder="Statut"
                                    allowClear
                                    style={{ width: "100%" }}
                                    onChange={(value) => handleFilterChange("status", value)}
                                >
                                    <Option value="ACTIVE">Active</Option>
                                    <Option value="CLOSED">Fermée</Option>
                                    {/* <Option value="PINNED">Épinglée</Option> */}
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} lg={4}>
                                <Select
                                    placeholder="Trier par"
                                    defaultValue="createdAt"
                                    style={{ width: "100%" }}
                                    onChange={(value) => handleFilterChange("sortBy", value)}
                                >
                                    <Option value="createdAt">Date de création</Option>
                                    <Option value="updatedAt">Dernière mise à jour</Option>
                                    <Option value="title">Titre</Option>
                                    <Option value="commentsCount">Nombre de commentaires</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} lg={4}>
                                <Select
                                    placeholder="Ordre"
                                    defaultValue="desc"
                                    style={{ width: "100%" }}
                                    onChange={(value) => handleFilterChange("sortOrder", value)}
                                >
                                    <Option value="desc">Décroissant</Option>
                                    <Option value="asc">Croissant</Option>
                                </Select>
                            </Col>
                        </Row>
                    </Card>


                    {/* Liste des discussions */}
                    <Card>
                        <Spin spinning={loading}>
                            {discussions.length === 0 && !loading ? (
                                <Empty description="Aucune discussion trouvée" style={{ padding: "50px" }}>
                                    <Button type="primary" onClick={handleCreateDiscussion}>
                                        Créer la première discussion
                                    </Button>
                                </Empty>
                            ) : (
                                <>
                                    <List
                                        dataSource={discussions}
                                        renderItem={(discussion) => (
                                            <List.Item
                                                key={discussion.id}
                                                actions={[
                                                    <Button
                                                        key="view"
                                                        type="text"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => handleViewDiscussion(discussion.id)}
                                                    >
                                                        Voir
                                                    </Button>,
                                                    <Dropdown key="more" menu={{ items: getDiscussionActions(discussion) }} trigger={["click"]}>
                                                        <Button type="text" icon={<MoreOutlined />} />
                                                    </Dropdown>,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar size={64} icon={<MessageOutlined />} style={{ backgroundColor: "#e28743" }} />}
                                                    title={
                                                        <Space>
                                                            {discussion.isPinned && <PushpinOutlined style={{ color: "#faad14" }} />}
                                                            {discussion.isClosed && <LockOutlined style={{ color: "#f5222d" }} />}
                                                            <span
                                                                style={{
                                                                    fontSize: "16px",
                                                                    fontWeight: "bold",
                                                                    textDecoration: discussion.isClosed ? "line-through" : "none",
                                                                }}
                                                            >
                                                                {discussion.title}
                                                            </span>
                                                            <Tag color="blue">
                                                                <BookOutlined /> {discussion.theme?.title}
                                                            </Tag>
                                                        </Space>
                                                    }
                                                    description={
                                                        <div>
                                                            <Text>{discussion.content}</Text>
                                                            <div style={{ marginTop: "8px" }}>
                                                                <Space>
                                                                    <Text type="secondary">
                                                                        <UserOutlined /> {discussion.createdBy?.firstName} {discussion.createdBy?.lastName}
                                                                    </Text>
                                                                    <Text type="secondary">
                                                                        Créé le {moment(discussion.createdAt).format("DD MMMM YYYY à HH:mm")}
                                                                    </Text>
                                                                    <Text type="secondary">
                                                                        <CommentOutlined /> {discussion._count?.comments || 0} commentaire(s)
                                                                    </Text>
                                                                    {discussion.updatedAt !== discussion.createdAt && (
                                                                        <Text type="secondary">Mis à jour {moment(discussion.updatedAt).fromNow()}</Text>
                                                                    )}
                                                                </Space>
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />

                                    {/* Pagination */}
                                    <div style={{ textAlign: "center", marginTop: "24px" }}>
                                        <Pagination
                                            current={pagination.current}
                                            pageSize={pagination.pageSize}
                                            total={pagination.total}
                                            onChange={handlePaginationChange}
                                            showSizeChanger
                                            showQuickJumper
                                            showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total} discussions`}
                                        />
                                    </div>
                                </>
                            )}
                        </Spin>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DiscussionList
