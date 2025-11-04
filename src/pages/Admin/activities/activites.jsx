
"use client"
import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Pagination,
    Tag,
    Popconfirm,
    Select,
    Typography,
    Avatar,
    Space,
    Spin,
    Modal,
    Form,
    Upload,
    Breadcrumb,
    Divider,
    Empty,
    DatePicker,
    Tooltip
} from "antd"
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    UploadOutlined,
    BookOutlined,
    UsergroupAddOutlined,
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined
} from "@ant-design/icons"
import moment from "moment"
import "moment/locale/fr"
import activityService from "../../../services/activityService"
import { toast } from "sonner"
import { FaHandshakeAltSlash } from "react-icons/fa"
import { MdAdd } from "react-icons/md"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const { Paragraph, Text, Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const ActivitesManagement = () => {
    const navigate = useNavigate()
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingActivity, setEditingActivity] = useState(null)
    const [form] = Form.useForm()
    const [description_fr, setDescriptionFr] = useState("")
    const [description_en, setDescriptionEn] = useState("")
    const [fileList, setFileList] = useState([])
    const [galleryList, setGalleryList] = useState([])


    // État pour la pagination et les filtres
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    })

    const [filters, setFilters] = useState({
        search: "",
        status: null,
        dateRange: null,
        icon: null
    })

    const [filtersVisible, setFiltersVisible] = useState(false)

    // Configuration de ReactQuill
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    }

    const quillFormats = [
        "header", "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet", "link", "image",
    ]

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


    // Récupérer les activités avec pagination et filtres
    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true)
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
                ...(filters.search && { search: filters.search }),
                ...(filters.status && { status: filters.status }),
                ...(filters.dateRange && {
                    startDate: filters.dateRange[0].format('YYYY-MM-DD'),
                    endDate: filters.dateRange[1].format('YYYY-MM-DD')
                }),
                ...(filters.icon && { icon: filters.icon })
            }

            const response = await activityService.getAll(params)
            setActivities(response.activities)
            setPagination(prev => ({
                ...prev,
                total: response.pagination.total,
            }))
        } catch (error) {
            console.error("Erreur lors du chargement des activités:", error)
            toast.error("Erreur lors du chargement des activités")
        } finally {
            setLoading(false)
        }
    }, [pagination.current, pagination.pageSize, filters])

    // Charger les activités au montage et quand les dépendances changent
    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])

    // Gestion des actions CRUD
    const handleCreate = () => {
        setEditingActivity(null)
        setFileList([])
        setDescriptionFr("")
        setDescriptionEn("")
        form.resetFields()
        setModalVisible(true)
    }

    const handleEdit = (activity) => {
        setEditingActivity(activity)
        form.setFieldsValue({
            title_fr: activity.title_fr,
            title_en: activity.title_en,
            icon: activity.icon,
            status: activity.status,
            dateActivity: activity.dateActivity

        })
        setDescriptionEn(activity.description_en || "")
        setDescriptionFr(activity.description_fr || "")
        setFileList(
            activity.image
                ? [{
                    uid: "-1",
                    name: "image.jpg",
                    status: "done",
                    url: activity.image,
                }]
                : []
        )
        setGalleryList(
            activity.galleries?.map((url, index) => ({
                uid: `-${index + 2}`,
                name: `gallery-${index}.jpg`,
                status: "done",
                url: url,
            })) || []
        )
        setModalVisible(true)
    }

    const handleDelete = async (id) => {
        try {
            await activityService.delete(id)
            toast.success("Activité supprimée avec succès")
            fetchActivities()
        } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            toast.error("Erreur lors de la suppression")
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await activityService.updateStatus(id, status)
            toast.success("Statut mis à jour")
            fetchActivities()
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error)
            toast.error("Erreur lors de la mise à jour du statut")
        }
    }

    const handleViewDetails = (id) => {
        navigate(`/admin/activities/${id}/view`)
    }

    const handleSubmit = async (values) => {
        console.log(values)
        try {
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

            if (editingActivity) {
                await activityService.update(editingActivity.id, formData)
                toast.success("Activité mise à jour avec succès")
            } else {
                await activityService.create(formData)
                toast.success("Activité créée avec succès")
            }

            setModalVisible(false)
            fetchActivities()
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
            toast.error("Erreur lors de la sauvegarde")
        }
    }

    // Fonctions utilitaires
    const getActivityIcon = (iconName) => {
        switch (iconName) {
            case "book": return <BookOutlined />
            case "users": return <UsergroupAddOutlined />
            case "handshake": return <FaHandshakeAltSlash />
            default: return <BookOutlined />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PUBLISHED": return "green"
            case "DRAFT": return "orange"
            default: return "default"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "PUBLISHED": return "Publié"
            case "DRAFT": return "Brouillon"
            default: return status
        }
    }

    // Gestion des changements de pagination
    const handlePaginationChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }))
    }

    // Gestion des changements de filtres
    const handleSearchChange = (value) => {
        setFilters(prev => ({
            ...prev,
            search: value
        }))
        setPagination(prev => ({
            ...prev,
            current: 1 // Réinitialiser à la première page
        }))
    }

    const handleStatusFilterChange = (value) => {
        setFilters(prev => ({
            ...prev,
            status: value
        }))
        setPagination(prev => ({
            ...prev,
            current: 1 // Réinitialiser à la première page
        }))
    }

    const handleDateRangeChange = (dates) => {
        setFilters(prev => ({
            ...prev,
            dateRange: dates
        }))
        setPagination(prev => ({
            ...prev,
            current: 1 // Réinitialiser à la première page
        }))
    }

    const handleIconFilterChange = (value) => {
        setFilters(prev => ({
            ...prev,
            icon: value
        }))
        setPagination(prev => ({
            ...prev,
            current: 1 // Réinitialiser à la première page
        }))
    }

    // Réinitialiser les filtres
    const resetFilters = () => {
        setFilters({
            search: "",
            status: null,
            dateRange: null,
            icon: null
        })
        setPagination(prev => ({
            ...prev,
            current: 1
        }))
    }

    // Basculer l'affichage des filtres avancés
    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible)
    }

    // Options pour les filtres
    const iconOptions = [
        { value: "book", label: "Formation", icon: <BookOutlined /> },
        { value: "users", label: "Conférence", icon: <UsergroupAddOutlined /> },
        { value: "handshake", label: "Atelier", icon: <FaHandshakeAltSlash /> },
    ]

    return (
        <>
            <div className="container-fluid relative px-3">
                <div className="layout-specing" style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    paddingRight: "8px"
                }}>
                    <div className="md:flex justify-between items-center mb-6">
                        <Title level={4} style={{ margin: 0 }}>Gestion des Activités</Title>
                        <Breadcrumb
                            items={[
                                { title: <Link to="/">Dashboard</Link> },
                                { title: "Gestion des Activités" },
                            ]}
                        />
                    </div>

                    {/* Barre de recherche et filtres */}
                    <Card className="mb-6">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Rechercher une activité..."
                                    prefix={<SearchOutlined />}
                                    value={filters.search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    allowClear
                                />
                            </Col>

                            <Col xs={24} sm={12} md={4}>
                                <Select
                                    placeholder="Filtrer par statut"
                                    value={filters.status}
                                    onChange={handleStatusFilterChange}
                                    allowClear
                                    style={{ width: "100%" }}
                                >
                                    <Option value="PUBLISHED">Publié</Option>
                                    <Option value="DRAFT">Brouillon</Option>
                                </Select>
                            </Col>

                            <Col xs={24} sm={12} md={4}>
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={toggleFilters}
                                    style={{ width: "100%" }}
                                >
                                    {filtersVisible ? "Masquer les filtres" : "Filtres avancés"}
                                </Button>
                            </Col>

                            <Col xs={24} sm={12} md={4}>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={resetFilters}
                                    style={{ width: "100%" }}
                                >
                                    Réinitialiser
                                </Button>
                            </Col>

                            <Col xs={24} sm={12} md={4} className="text-right">
                                <Button
                                    type="primary"
                                    icon={<MdAdd />}
                                    onClick={handleCreate}
                                    style={{ width: "100%" }}
                                >
                                    Nouvelle Activité
                                </Button>
                            </Col>
                        </Row>

                        {/* Filtres avancés */}
                        {filtersVisible && (
                            <Row gutter={[16, 16]} className="mt-4">
                                <Col xs={24} sm={12} md={6}>
                                    <RangePicker
                                        style={{ width: "100%" }}
                                        onChange={handleDateRangeChange}
                                        value={filters.dateRange}
                                        format="DD/MM/YYYY"
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={6}>
                                    <Select
                                        placeholder="Filtrer par type"
                                        value={filters.icon}
                                        onChange={handleIconFilterChange}
                                        allowClear
                                        style={{ width: "100%" }}
                                    >
                                        {iconOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                <Space>
                                                    {option.icon}
                                                    {option.label}
                                                </Space>
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
                        )}
                    </Card>

                    {/* Liste des activités */}
                    <Spin spinning={loading}>
                        {activities.length === 0 ? (
                            <Empty
                                description="Aucune activité trouvée"
                                style={{ margin: "40px 0" }}
                            >
                                <Button type="primary" onClick={handleCreate}>
                                    Créer une activité
                                </Button>
                            </Empty>
                        ) : (
                            <>
                                <Row gutter={[16, 16]}>
                                    {activities.map((item) => (
                                        <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    item.image ? (
                                                        <img
                                                            alt={item.title_fr}
                                                            src={item.image || "/placeholder.svg"}
                                                            style={{ height: 200, objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            height: 200,
                                                            backgroundColor: "#f5f5f5",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "#999",
                                                            flexDirection: "column",
                                                            gap: 8,
                                                        }}>
                                                            <div style={{ fontSize: "48px" }}>{getActivityIcon(item.icon)}</div>
                                                            <Text type="secondary">Aucune image</Text>
                                                        </div>
                                                    )
                                                }
                                                actions={[
                                                    <Tooltip title="Voir les détails" key="view">
                                                        <Button
                                                            type="text"
                                                            icon={<EyeOutlined />}
                                                            onClick={() => handleViewDetails(item.id)}
                                                        />
                                                    </Tooltip>,
                                                    <Tooltip title="Modifier" key="edit">
                                                        <Button
                                                            type="text"
                                                            icon={<EditOutlined />}
                                                            onClick={() => handleEdit(item)}
                                                        />
                                                    </Tooltip>,
                                                    <Tooltip title="Supprimer" key="delete">
                                                        <Popconfirm
                                                            title="Êtes-vous sûr de vouloir supprimer cette activité ?"
                                                            onConfirm={() => handleDelete(item.id)}
                                                            okText="Oui"
                                                            cancelText="Non"
                                                        >
                                                            <Button
                                                                type="text"
                                                                icon={<DeleteOutlined />}
                                                                danger
                                                            />
                                                        </Popconfirm>
                                                    </Tooltip>,
                                                ]}
                                            >
                                                <Card.Meta
                                                    title={
                                                        <div>
                                                            <Text strong ellipsis={{ tooltip: item.title_en }}>
                                                                {item.title_fr}
                                                            </Text>
                                                            <div style={{ marginTop: 8 }}>
                                                                <Select
                                                                    value={item.status}
                                                                    size="small"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(value) => handleStatusChange(item.id, value)}
                                                                >
                                                                    <Option value="DRAFT">Brouillon</Option>
                                                                    <Option value="PUBLISHED">Publié</Option>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    }
                                                    description={
                                                        <div>
                                                            <Paragraph ellipsis={{ rows: 3, tooltip: item.description_en }} style={{ marginBottom: 8 }}>
                                                                {item.description_fr}
                                                            </Paragraph>
                                                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                    <Avatar size="small" icon={<UserOutlined />} src={item.author?.profilePic} />
                                                                    <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                        {item.author?.firstName} {item.author?.lastName}
                                                                    </Text>
                                                                </div>

                                                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                    Date Activité {item.dateActivity}
                                                                </Text>
                                                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                    Créé le {moment(item.createdAt).format("DD/MM/YYYY")}
                                                                </Text>
                                                                <Tag color={getStatusColor(item.status)} size="small">
                                                                    {getStatusText(item.status)}
                                                                </Tag>
                                                            </Space>
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Pagination */}
                                <Divider />
                                <Row justify="center" className="mt-6">
                                    <Pagination
                                        current={pagination.current}
                                        pageSize={pagination.pageSize}
                                        total={pagination.total}
                                        onChange={handlePaginationChange}
                                        onShowSizeChange={handlePaginationChange}
                                        showSizeChanger
                                        showQuickJumper
                                        showTotal={(total, range) =>
                                            `${range[0]}-${range[1]} sur ${total} activités`}
                                        pageSizeOptions={["6", "12", "24", "48"]}
                                        responsive
                                    />
                                </Row>
                            </>
                        )}
                    </Spin>

                    {/* Modal pour créer/modifier une activité */}
                    <Modal
                        title={editingActivity ? "Modifier l'Activité" : "Créer une Activité"}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                        width={800}
                        style={{ top: 20 }}
                    >
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                name="title_fr"
                                label="Titre en Français"
                                rules={[
                                    { required: true, message: "Le titre est requis" },
                                    { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" },
                                ]}
                            >
                                <Input placeholder="Titre de l'activité" />
                            </Form.Item>

                            <Form.Item
                                name="title_en"
                                label="Titre en Anglais"
                                rules={[
                                    { required: true, message: "Le titre est requis" },
                                    { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" },
                                ]}
                            >
                                <Input placeholder="Title of the activity" />
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

                            <Form.Item name="icon" label="Type d'activité" initialValue="book">
                                <Select>
                                    {iconOptions.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            <Space>
                                                {option.icon}
                                                {option.label}
                                            </Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Description en Français">
                                <div data-color-mode="light">
                                    <ReactQuill
                                        theme="snow"
                                        value={description_fr}
                                        onChange={setDescriptionFr}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description en français..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item label="Description en Anglais">
                                <div data-color-mode="light">
                                    <ReactQuill
                                        theme="snow"
                                        value={description_en}
                                        onChange={setDescriptionEn}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description in English..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item name="status" label="Statut" initialValue="DRAFT">
                                <Select>
                                    <Option value="DRAFT">Brouillon</Option>
                                    <Option value="PUBLISHED">Publié</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Image de couverture">
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>
                                        {fileList.length > 0 ? "Remplacer l'image" : "Sélectionner une image"}
                                    </Button>
                                </Upload>
                                {fileList.length > 0 && (
                                    <div style={{ marginTop: "8px" }}>
                                        <img
                                            src={fileList[0].url || fileList[0].thumbUrl}
                                            alt="Preview"
                                            style={{ maxWidth: "200px", maxHeight: "150px", marginTop: "8px" }}
                                        />
                                    </div>
                                )}
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
                                                    src={file.url || file.thumbUrl}
                                                    alt={`Gallery ${index}`}
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Form.Item>


                            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                                <Space>
                                    <Button onClick={() => setModalVisible(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingActivity ? "Mettre à jour" : "Créer"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default ActivitesManagement
