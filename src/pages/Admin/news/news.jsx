
"use client"
import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    message,
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
    DatePicker,
    Divider,
    Empty,
    Tooltip
} from "antd"
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    UploadOutlined,
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined
} from "@ant-design/icons"

import moment from "moment"
import "moment/locale/fr"
import newsService from "../../../services/newsService"
import { toast } from "sonner"
import { PiUserPlusDuotone } from "react-icons/pi"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

import { useAuth } from "../../../hooks/useAuth"
import { buildImageUrl } from "../../../utils/imageUtils"
const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const NewsManagement = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const canEdit = ["ADMIN", "SUPER_ADMIN"].includes(user?.role?.trim?.().toUpperCase());
   
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingNews, setEditingNews] = useState(null)
    const [form] = Form.useForm()
    const [content_fr, setContentFr] = useState("")
    const [content_en, setContentEn] = useState("")
    const [fileList, setFileList] = useState([])
    const [galleryList, setGalleryList] = useState([])


    // État pour la pagination et les filtres
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0,
    })

    const [filters, setFilters] = useState({
        search: "",
        status: null,
        dateRange: null,
        author: null
    })

    const [filtersVisible, setFiltersVisible] = useState(false)

    // Récupérer les news avec pagination et filtres
    const fetchNews = useCallback(async () => {
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
                ...(filters.author && { authorId: filters.author })
            }
           
            const response = await newsService.getAll(params)
           
            setNews(response.news)
            setPagination(prev => ({
                ...prev,
                total: response.pagination.total,
            }))
        } catch (error) {
            console.error("Erreur lors du chargement des news:", error)
            toast.error("Erreur lors du chargement des news")
        } finally {
            setLoading(false)
        }
    }, [pagination.current, pagination.pageSize, filters])

    // Charger les news au montage et quand les dépendances changent
    useEffect(() => {
        fetchNews()
    }, [fetchNews])

    // Nettoyer les URLs de prévisualisation lors du démontage
    useEffect(() => {
        return () => {
            fileList.forEach(file => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url)
                }
            })
            galleryList.forEach(file => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url)
                }
            })
        }
    }, [fileList, galleryList])

    // Gestion des actions CRUD
    const handleCreate = () => {
        setEditingNews(null)
        setFileList([])
        setGalleryList([])
        setContentFr("")
        setContentEn("")
        form.resetFields()
        setModalVisible(true)
    }

    const handleEdit = (newsItem) => {
        setEditingNews(newsItem)
        form.setFieldsValue({
            title_fr: newsItem.title_fr,
            title_en: newsItem.title_en,
            status: newsItem.status || "DRAFT", // Valeur par défaut si null
            validated: newsItem.validated || "PENDING", // Valeur par défaut si null
        })
        setContentFr(newsItem.content_fr || "")
        setContentEn(newsItem.content_en || "")
        setFileList(
            newsItem.image
                ? [{
                    uid: "-1",
                    name: "image.jpg",
                    status: "done",
                    url: buildImageUrl(newsItem.image),
                }]
                : []
        )
        setGalleryList(
            newsItem.galleries?.map((url, index) => ({
                uid: `-${index + 2}`,
                name: `gallery-${index}.jpg`,
                status: "done",
                url: buildImageUrl(url),
            })) || []
        )
        setModalVisible(true)
    }

    const handleDelete = async (id) => {
        try {
            await newsService.delete(id)
            toast.success("News supprimée avec succès")
            fetchNews()
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la suppression")
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await newsService.updateStatus(id, status)
            toast.success("Statut mis à jour")
            fetchNews()
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error)
            toast.error("Erreur lors de la mise à jour du statut")
        }
    }
    const handleValidatedStatusChange = async (id, validated) => {
        try {
            await newsService.updateValidatedStatus(id, validated)
            toast.success("Statut mis à jour")
            fetchNews()
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error)
            toast.error("Erreur lors de la mise à jour du statut")
        }
    }

    const handleViewDetails = (id) => {
        navigate(`/admin/news/${id}/view`)
    }

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true)
            const formData = new FormData()
            formData.append("title_fr", values.title_fr)
            formData.append("title_en", values.title_en)
            formData.append("content_fr", content_fr)
            formData.append("content_en", content_en)
            formData.append("status", values.status || "DRAFT")
            formData.append("validated", values.validated || 'PENDING')

            // Ajouter l'image de couverture si c'est un nouveau fichier
            if (fileList.length > 0) {
                if (fileList[0].originFileObj) {
                    formData.append("image", fileList[0].originFileObj)
                } else if (fileList[0].url && !fileList[0].url.startsWith('blob:')) {
                    // Si c'est une image existante, on ne l'envoie pas (elle est déjà sur le serveur)
                    // Le backend gardera l'image existante si aucun nouveau fichier n'est envoyé
                }
            }

            // Ajouter les images de la galerie (seulement les nouveaux fichiers)
            galleryList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append("galleries", file.originFileObj)
                }
            })

            if (editingNews) {
                await newsService.update(editingNews.id, formData)
                toast.success("News mise à jour avec succès")
            } else {
                await newsService.create(formData)
                toast.success("News créée avec succès")
            }

            setModalVisible(false)
            // Nettoyer les URLs de prévisualisation
            fileList.forEach(file => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url)
                }
            })
            galleryList.forEach(file => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url)
                }
            })
            setFileList([])
            setGalleryList([])
            fetchNews()
        } catch (error) {
            console.log(error)
            message.error("Erreur lors de la sauvegarde")
        } finally {
            setSubmitting(false)
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

    const handleAuthorFilterChange = (value) => {
        setFilters(prev => ({
            ...prev,
            author: value
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
            author: null
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

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => {
            // Créer des URLs de prévisualisation pour les nouveaux fichiers
            const updatedFileList = newFileList.map(file => {
                if (file.originFileObj && !file.url && !file.thumbUrl) {
                    file.url = URL.createObjectURL(file.originFileObj)
                    file.thumbUrl = file.url
                }
                return file
            })
            setFileList(updatedFileList)
        },
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
        onRemove: (file) => {
            // Nettoyer l'URL de prévisualisation si c'est un nouveau fichier
            if (file.url && file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url)
            }
        }
    }

    const galleryUploadProps = {
        fileList: galleryList,
        onChange: ({ fileList: newFileList }) => {
            // Créer des URLs de prévisualisation pour les nouveaux fichiers
            const updatedFileList = newFileList.map(file => {
                if (file.originFileObj && !file.url && !file.thumbUrl) {
                    file.url = URL.createObjectURL(file.originFileObj)
                    file.thumbUrl = file.url
                }
                return file
            })
            setGalleryList(updatedFileList)
        },
        beforeUpload: () => false,
        multiple: true,
        accept: "image/*",
        maxCount: 10,
        onRemove: (file) => {
            // Nettoyer l'URL de prévisualisation si c'est un nouveau fichier
            if (file.url && file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url)
            }
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

    // Fonction pour enlever les balises HTML et décoder les entités HTML
    const stripHtmlTags = (html) => {
        if (!html) return ""
        try {
            // Créer un élément temporaire pour parser le HTML
            const tmp = document.createElement("DIV")
            tmp.innerHTML = html
            // Récupérer le texte sans les balises HTML
            const text = tmp.textContent || tmp.innerText || ""
            // Nettoyer les espaces multiples et les retours à la ligne
            return text.replace(/\s+/g, " ").trim()
        } catch (error) {
            // En cas d'erreur, utiliser une regex simple pour enlever les balises
            return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
        }
    }

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

    return (
        <>
            <div className="container-fluid relative px-3">
                <div className="layout-specing" style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    paddingRight: "8px"
                }}>
                    <div className="md:flex justify-between items-center mb-6">
                        <Title level={4} style={{ margin: 0 }}>Gestion des Articles</Title>
                        <Breadcrumb
                            items={[
                                { title: <Link to="/">Tableau de bord</Link> },
                                { title: "Gestion des Articles" },
                            ]}
                        />
                    </div>

                    {/* Barre de recherche et filtres */}
                    <Card className="mb-6">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Rechercher une news..."
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
                                    icon={<PiUserPlusDuotone />}
                                    onClick={handleCreate}
                                    style={{ width: "100%" }}
                                >
                                    Ajouter un Article
                                </Button>
                            </Col>
                        </Row>

                        {/* Filtres avancés */}
                        {filtersVisible && (
                            <Row gutter={[16, 16]} className="mt-4">
                                <Col xs={24} sm={12} md={8}>
                                    <RangePicker
                                        style={{ width: "100%" }}
                                        onChange={handleDateRangeChange}
                                        value={filters.dateRange}
                                        format="DD/MM/YYYY"
                                        placeholder={["Date de début", "Date de fin"]}
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <Select
                                        placeholder="Filtrer par auteur"
                                        value={filters.author}
                                        onChange={handleAuthorFilterChange}
                                        allowClear
                                        style={{ width: "100%" }}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {/* En production, vous devrez remplir cette liste avec les auteurs disponibles */}
                                        <Option value="1">Jean Dupont</Option>
                                        <Option value="2">Marie Martin</Option>
                                    </Select>
                                </Col>
                            </Row>
                        )}
                    </Card>

                    {/* Liste des news */}
                    <Spin spinning={loading}>
                        {news.length === 0 ? (
                            <Empty
                                description="Aucune news trouvée"
                                style={{ margin: "40px 0" }}
                            >
                                <Button type="primary" onClick={handleCreate}>
                                    Créer une news
                                </Button>
                            </Empty>
                        ) : (
                            <>
                                <Row gutter={[16, 16]}>
                                    {news.map((item) => (
                                        <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    item.image ? (
                                                        <img
                                                            alt={item.title_fr}
                                                            src={buildImageUrl(item.image)}
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
                                                        }}>
                                                            Aucune image
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
                                                    canEdit && (
                                                        <Tooltip title="Supprimer" key="delete">
                                                            <Popconfirm
                                                                title="Êtes-vous sûr de vouloir supprimer cette news ?"
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
                                                        </Tooltip>
                                                    ),
                                                ]}
                                            >
                                                <Card.Meta
                                                    title={
                                                        <div>
                                                            <Text strong ellipsis={{ tooltip: item.title_fr }}>
                                                                {item.title_fr}
                                                            </Text>
                                                            <div style={{ marginTop: 8 }}>
                                                                <Select
                                                                prefix="Statut"
                                                                    value={item.status}
                                                                    size="small"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(value) => handleStatusChange(item.id, value)}
                                                                >
                                                                    <Option value="DRAFT">Brouillon</Option>
                                                                    <Option value="PUBLISHED">Publié</Option>
                                                                </Select>
                                                            </div>
                                                            
                                                            {item.status === "PUBLISHED" && <>
                                                            
                                                                <div style={{ marginTop: 8 }}>
                                                                    <Select
                                                                        prefix="Validation"
                                                                        value={item.validated}
                                                                        size="small"
                                                                        disabled={!canEdit }
                                                                        style={{ width: "100%" }}
                                                                        onChange={(value) => handleValidatedStatusChange(item.id, value)}
                                                                    >
                                                                        <Option value="VALIDATED">Valider</Option>
                                                                        <Option value="DECLINED">Refusé</Option>
                                                                        <Option value="PENDING">En attente</Option>
                                                                    </Select>
                                                                </div>
                                                            </> }
                                                            
                                                        </div>
                                                    }
                                                    description={
                                                        <div>
                                                            <Paragraph style={{ marginBottom: 8, cursor: "pointer" }}>
                                                                    {stripHtmlTags(item.content_fr)?.substring(0, 10)}
                                                                    {stripHtmlTags(item.content_fr)?.length > 10 && "..."}
                                                                </Paragraph>
                                                                
                                                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                    <Avatar size="small" icon={<UserOutlined />} src={buildImageUrl(item.author?.profilePic)} />
                                                                    <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                        {item.author?.firstName} {item.author?.lastName}
                                                                    </Text>
                                                                </div>
                                                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                    {item.publishedAt
                                                                        ? `Publié le ${moment(item.publishedAt).format("DD/MM/YYYY")}`
                                                                        : `Créé le ${moment(item.createdAt).format("DD/MM/YYYY")}`}
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
                                            `${range[0]}-${range[1]} sur ${total} articles`}
                                        pageSizeOptions={["12", "24", "48", "96"]}
                                        responsive
                                    />
                                </Row>
                            </>
                        )}
                    </Spin>

                    {/* Modal pour créer/modifier une news */}
                    <Modal
                        title={editingNews ? "Modifier l'article" : "Créer un article"}
                        open={modalVisible}
                        onCancel={() => {
                            // Nettoyer les URLs de prévisualisation avant de fermer
                            fileList.forEach(file => {
                                if (file.url && file.url.startsWith('blob:')) {
                                    URL.revokeObjectURL(file.url)
                                }
                            })
                            galleryList.forEach(file => {
                                if (file.url && file.url.startsWith('blob:')) {
                                    URL.revokeObjectURL(file.url)
                                }
                            })
                            setFileList([])
                            setGalleryList([])
                            setModalVisible(false)
                        }}
                        footer={null}
                        width={800}
                        style={{ top: 20 }}
                    >
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                name="title_fr"
                                label="Titre en français"
                                rules={[
                                    { required: true, message: "Le titre est requis" },
                                    { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" }
                                ]}
                            >
                                <Input placeholder="Titre de l'article" />
                            </Form.Item>

                            <Form.Item
                                name="title_en"
                                label="Titre en anglais"
                                rules={[
                                    { required: true, message: "Le titre est requis" },
                                    { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" }
                                ]}
                            >
                                <Input placeholder="Article title" />
                            </Form.Item>

                            <Form.Item label="Contenu en français">
                                <div data-color-mode="light">
                                    <ReactQuill
                                        theme="snow"
                                        value={content_fr}
                                        onChange={setContentFr}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Contenu de l'article en français..."
                                        style={{ height: "300px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item label="Contenu en anglais">
                                <div data-color-mode="light">
                                    <ReactQuill
                                        theme="snow"
                                        value={content_en}
                                        onChange={setContentEn}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Article content in English..."
                                        style={{ height: "300px", marginBottom: "24px" }}
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
                                {fileList.length > 0 && (() => {
                                    const previewUrl = fileList[0].url || fileList[0].thumbUrl
                                    return previewUrl ? (
                                        <div style={{ marginTop: "8px" }}>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ maxWidth: "200px", maxHeight: "150px", marginTop: "8px", objectFit: "cover" }}
                                            />
                                        </div>
                                    ) : null
                                })()}
                            </Form.Item>

                            <Form.Item label="Galerie d'images">
                                <Upload {...galleryUploadProps}>
                                    <Button icon={<UploadOutlined />}>
                                        Sélectionner des images
                                    </Button>
                                </Upload>
                                {galleryList.length > 0 && (
                                    <Row gutter={[8, 8]} style={{ marginTop: "8px" }}>
                                        {galleryList.map((file, index) => {
                                            const imageUrl = file.url || file.thumbUrl
                                            return imageUrl ? (
                                                <Col key={file.uid || index}>
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Gallery ${index}`}
                                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                                                    />
                                                </Col>
                                            ) : null
                                        })}
                                    </Row>
                                )}
                            </Form.Item>


                            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                                <Space>
                                    <Button onClick={() => {
                                        setModalVisible(false)
                                        form.resetFields()
                                        setContentFr("")
                                        setContentEn("")
                                        setFileList([])
                                    }}>
                                        Annuler
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={submitting}>
                                        {editingNews ? "Mettre à jour" : "Créer"}
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

export default NewsManagement
