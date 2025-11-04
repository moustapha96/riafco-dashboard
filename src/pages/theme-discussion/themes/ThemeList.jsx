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
    Breadcrumb,
} from "antd"
import {
    PlusOutlined,
    SearchOutlined,
    BookOutlined,
    MessageOutlined,
    UserOutlined,
    EyeOutlined,
    EditOutlined,
} from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import "moment/locale/fr"
import themeService from "../../../services/themeService"

const { Text } = Typography
const { Search } = Input

moment.locale("fr")

const ThemeList = () => {
    const [themes, setThemes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [searchTerm, setSearchTerm] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        loadThemes()
    }, [pagination.current, pagination.pageSize, searchTerm])

    const loadThemes = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await themeService.getAll({
                page: pagination.current,
                limit: pagination.pageSize,
                search: searchTerm,
            })
            console.log(response)
            setThemes(response.data || [])
            setPagination((prev) => ({
                ...prev,
                total: response.pagination.total || 0,
            }))
        } catch (err) {
            console.error("Erreur lors du chargement des thèmes:", err)
            setError("Erreur lors du chargement des thèmes")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value) => {
        setSearchTerm(value)
        setPagination((prev) => ({ ...prev, current: 1 }))
    }

    const handlePaginationChange = (page, pageSize) => {
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }))
    }

    const handleViewTheme = (themeId) => {
        navigate(`/themes/${themeId}`)
    }

    const handleEditTheme = (themeId) => {
        navigate(`/themes/${themeId}/edit`)
    }

    const handleCreateTheme = () => {
        navigate("/themes/new")
    }

    if (error) {
        return <Alert message="Erreur" description={error} type="error" showIcon style={{ margin: "20px 0" }} />
    }

    return <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing" style={{
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
                paddingRight: "8px"
            }}>

                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        Gérez les thèmes de discussion
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/descussions">Discussions</Link> },
                            { title: "Thèmes" },
                        ]}
                    />
                </div>
                <div className="md:flex justify-end items-center">

                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTheme}>
                        Nouveau thème
                    </Button>
                </div>


                <Card style={{ marginBottom: "24px" }}>
                    <Search
                        placeholder="Rechercher un thème..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        style={{ maxWidth: "400px" }}
                    />
                </Card>
                <Card>
                    <Spin spinning={loading}>
                        {themes.length === 0 && !loading ? (
                            <Empty description="Aucun thème trouvé" style={{ padding: "50px" }}>
                                <Button type="primary" onClick={handleCreateTheme}>
                                    Créer le premier thème
                                </Button>
                            </Empty>
                        ) : (
                            <>
                                <List
                                    dataSource={themes}
                                    renderItem={(theme) => (
                                        <List.Item
                                            key={theme.id}
                                            actions={[
                                                <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => handleViewTheme(theme.id)}>
                                                    Voir
                                                </Button>,
                                                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditTheme(theme.id)}>
                                                    Modifier
                                                </Button>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar size={64} icon={<BookOutlined />} style={{ backgroundColor: "#1e81b0" }} />}
                                                title={
                                                    <Space>
                                                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>{theme.title}</span>
                                                        <Tag color={theme.status === "ACTIVE" ? "green" : "orange"}>{theme.status}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <div>
                                                        <Text>{theme.description}</Text>
                                                        <div style={{ marginTop: "8px" }}>
                                                            <Space>
                                                                <Text type="secondary">
                                                                    <UserOutlined /> {theme.createdBy?.firstName} {theme.createdBy?.lastName}
                                                                </Text>
                                                                <Text type="secondary">Créé le {moment(theme.createdAt).format("DD MMMM YYYY")}</Text>
                                                                <Text type="secondary">
                                                                    <MessageOutlined /> {theme._count?.discussions || 0} discussion(s)
                                                                </Text>
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
                                        showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total} thèmes`}
                                    />
                                </div>
                            </>
                        )}
                    </Spin>
                </Card>
            </div>
        </div>
    </>

}

export default ThemeList
