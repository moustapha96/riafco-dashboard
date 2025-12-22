
"use client"
import { useState, useEffect, useCallback, useMemo, useContext } from "react"
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
    ReloadOutlined,
    TrophyOutlined,
    CalendarOutlined,
    GlobalOutlined,
    TeamOutlined,
    BulbOutlined,
    ExperimentOutlined,
    RocketOutlined,
    FireOutlined,
    StarOutlined,
    GiftOutlined,
    HeartOutlined,
    BankOutlined,
    ShopOutlined,
    MedicineBoxOutlined,
    CarOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    VideoCameraOutlined,
    SoundOutlined,
    FileTextOutlined,
    CodeOutlined,
    ToolOutlined,
    SafetyOutlined,
    DollarOutlined,
    FundOutlined,
    ThunderboltOutlined,
    ApiOutlined,
    CloudOutlined,
    DatabaseOutlined,
    MobileOutlined,
    LaptopOutlined,
    CameraOutlined,
    PlayCircleOutlined,
    CustomerServiceOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    CrownOutlined,
    LikeOutlined,
    CommentOutlined,
    ShareAltOutlined,
    SendOutlined,
    MailOutlined,
    PhoneOutlined,
    MessageOutlined,
    NotificationOutlined,
    SettingOutlined,
    BuildOutlined,
    BugOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
    StopOutlined,
    PauseCircleOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    ControlOutlined,
    SecurityScanOutlined,
    LockOutlined,
    KeyOutlined,
    FileAddOutlined,
    FolderOutlined,
    PrinterOutlined,
    ScanOutlined,
    QrcodeOutlined,
    LineChartOutlined,
    BarChartOutlined,
    PieChartOutlined,
    SlidersOutlined
} from "@ant-design/icons"
import moment from "moment"
import "moment/locale/fr"
import activityService from "../../../services/activityService"
import { toast } from "sonner"
import {
    FaHandshakeAltSlash,
    FaGraduationCap,
    FaMicrophone,
    FaLaptopCode,
    FaPaintBrush,
    FaMusic,
    FaGamepad,
    FaRunning,
    FaUtensils,
    FaHotel,
    FaPlane,
    FaBicycle,
    FaSwimmingPool,
    FaMountain,
    FaTree,
    FaSeedling,
    FaRecycle,
    FaHeartbeat,
    FaUsers,
    FaBriefcase,
    FaChartLine,
    FaLightbulb,
    FaAward,
    FaTrophy,
    FaCertificate,
    FaUniversity,
    FaSchool,
    FaChalkboardTeacher,
    FaMicroscope,
    FaFlask,
    FaRobot,
    FaCloud,
    FaServer,
    FaDatabase,
    FaShieldAlt,
    FaHandshake,
    FaPalette,
    FaCamera,
    FaVideo,
    FaHeadphones,
    FaPodcast
} from "react-icons/fa"
import {
    MdAdd,
    MdSchool,
    MdWork,
    MdBusiness,
    MdEvent,
    MdSchedule
} from "react-icons/md"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { buildImageUrl } from "../../../utils/imageUtils"
import { AuthContext } from "../../../context/AuthContext"

const { Paragraph, Text, Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const ActivitesManagement = () => {
    const { user: currentUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const canEdit = ["ADMIN", "SUPER_ADMIN"].includes(currentUser?.role?.trim?.().toUpperCase());

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
        multiple: true, // Permet de sélectionner plusieurs fichiers
        accept: "image/*",
        maxCount: 10,
        onRemove: (file) => {
            // Nettoyer l'URL de prévisualisation si c'est un nouveau fichier
            if (file.url && file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url)
            }
        }
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
    }, [])

    // Gestion des actions CRUD
    const handleCreate = () => {
        setEditingActivity(null)
        setFileList([])
        setGalleryList([])
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
            icon: activity.icon || "book", // Valeur par défaut si null
            status: activity.status || "DRAFT", // Valeur par défaut si null
            dateActivity: activity.dateActivity || null, // Le format YYYY-MM-DD est déjà correct pour input type="date"
        })
        setDescriptionEn(activity.description_en || "")
        setDescriptionFr(activity.description_fr || "")
        setFileList(
            activity.image
                ? [{
                    uid: "-1",
                    name: "image.jpg",
                    status: "done",
                    url: buildImageUrl(activity.image),
                }]
                : []
        )
        setGalleryList(
            activity.galleries?.map((url, index) => ({
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

            if (editingActivity) {
                await activityService.update(editingActivity.id, formData)
                toast.success("Activité mise à jour avec succès")
            } else {
                await activityService.create(formData)
                toast.success("Activité créée avec succès")
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
            fetchActivities()
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
            toast.error("Erreur lors de la sauvegarde")
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

    // Fonctions utilitaires
    const getActivityIcon = (iconName) => {
        switch (iconName) {
            case "book": return <BookOutlined />
            case "users": return <UsergroupAddOutlined />
            case "handshake": return <FaHandshakeAltSlash />
            case "graduation": return <FaGraduationCap />
            case "microphone": return <FaMicrophone />
            case "code": return <FaLaptopCode />
            case "paint": return <FaPaintBrush />
            case "music": return <FaMusic />
            case "game": return <FaGamepad />
            case "sport": return <FaRunning />
            case "food": return <FaUtensils />
            case "hotel": return <FaHotel />
            case "travel": return <FaPlane />
            case "bike": return <FaBicycle />
            case "swim": return <FaSwimmingPool />
            case "mountain": return <FaMountain />
            case "tree": return <FaTree />
            case "seedling": return <FaSeedling />
            case "recycle": return <FaRecycle />
            case "health": return <FaHeartbeat />
            case "business": return <FaBriefcase />
            case "chart": return <FaChartLine />
            case "bulb": return <FaLightbulb />
            case "award": return <FaAward />
            case "trophy": return <FaTrophy />
            case "certificate": return <FaCertificate />
            case "university": return <FaUniversity />
            case "school": return <FaSchool />
            case "teacher": return <FaChalkboardTeacher />
            case "microscope": return <FaMicroscope />
            case "flask": return <FaFlask />
            case "robot": return <FaRobot />
            case "cloud": return <FaCloud />
            case "server": return <FaServer />
            case "database": return <FaDatabase />
            case "shield": return <FaShieldAlt />
            case "handshake-alt": return <FaHandshake />
            case "palette": return <FaPalette />
            case "camera": return <FaCamera />
            case "video": return <FaVideo />
            case "headphones": return <FaHeadphones />
            case "podcast": return <FaPodcast />
            case "calendar": return <CalendarOutlined />
            case "global": return <GlobalOutlined />
            case "team": return <TeamOutlined />
            case "bulb-ant": return <BulbOutlined />
            case "experiment": return <ExperimentOutlined />
            case "rocket": return <RocketOutlined />
            case "fire": return <FireOutlined />
            case "star": return <StarOutlined />
            case "gift": return <GiftOutlined />
            case "heart": return <HeartOutlined />
            case "bank": return <BankOutlined />
            case "shop": return <ShopOutlined />
            case "medicine": return <MedicineBoxOutlined />
            case "car": return <CarOutlined />
            case "home": return <HomeOutlined />
            case "environment": return <EnvironmentOutlined />
            case "video-camera": return <VideoCameraOutlined />
            case "sound": return <SoundOutlined />
            case "file": return <FileTextOutlined />
            case "code-ant": return <CodeOutlined />
            case "tool": return <ToolOutlined />
            case "safety": return <SafetyOutlined />
            case "dollar": return <DollarOutlined />
            case "fund": return <FundOutlined />
            case "thunderbolt": return <ThunderboltOutlined />
            case "api": return <ApiOutlined />
            case "cloud-ant": return <CloudOutlined />
            case "database-ant": return <DatabaseOutlined />
            case "mobile": return <MobileOutlined />
            case "laptop": return <LaptopOutlined />
            case "camera-ant": return <CameraOutlined />
            case "play": return <PlayCircleOutlined />
            case "customer": return <CustomerServiceOutlined />
            case "shopping": return <ShoppingOutlined />
            case "cart": return <ShoppingCartOutlined />
            case "crown": return <CrownOutlined />
            case "like": return <LikeOutlined />
            case "comment": return <CommentOutlined />
            case "share": return <ShareAltOutlined />
            case "send": return <SendOutlined />
            case "mail": return <MailOutlined />
            case "phone": return <PhoneOutlined />
            case "message": return <MessageOutlined />
            case "notification": return <NotificationOutlined />
            case "setting": return <SettingOutlined />
            case "build": return <BuildOutlined />
            case "bug": return <BugOutlined />
            case "check": return <CheckCircleOutlined />
            case "info": return <InfoCircleOutlined />
            case "question": return <QuestionCircleOutlined />
            case "stop": return <StopOutlined />
            case "pause": return <PauseCircleOutlined />
            case "appstore": return <AppstoreOutlined />
            case "dashboard": return <DashboardOutlined />
            case "control": return <ControlOutlined />
            case "security": return <SecurityScanOutlined />
            case "shield-ant": return <FaShieldAlt />
            case "lock": return <LockOutlined />
            case "key": return <KeyOutlined />
            case "file-add": return <FileAddOutlined />
            case "folder": return <FolderOutlined />
            case "printer": return <PrinterOutlined />
            case "scan": return <ScanOutlined />
            case "qrcode": return <QrcodeOutlined />
            case "line-chart": return <LineChartOutlined />
            case "bar-chart": return <BarChartOutlined />
            case "pie-chart": return <PieChartOutlined />
            case "sliders": return <SlidersOutlined />
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
        { value: "graduation", label: "Diplôme / Certification", icon: <FaGraduationCap /> },
        { value: "microphone", label: "Séminaire", icon: <FaMicrophone /> },
        { value: "code", label: "Développement", icon: <FaLaptopCode /> },
        { value: "paint", label: "Art / Design", icon: <FaPaintBrush /> },
        { value: "music", label: "Musique", icon: <FaMusic /> },
        { value: "game", label: "Gaming / E-sport", icon: <FaGamepad /> },
        { value: "sport", label: "Sport", icon: <FaRunning /> },
        { value: "food", label: "Gastronomie", icon: <FaUtensils /> },
        { value: "hotel", label: "Hôtellerie", icon: <FaHotel /> },
        { value: "travel", label: "Voyage", icon: <FaPlane /> },
        { value: "bike", label: "Cyclisme", icon: <FaBicycle /> },
        { value: "swim", label: "Natation", icon: <FaSwimmingPool /> },
        { value: "mountain", label: "Randonnée", icon: <FaMountain /> },
        { value: "tree", label: "Environnement", icon: <FaTree /> },
        { value: "seedling", label: "Agriculture", icon: <FaSeedling /> },
        { value: "recycle", label: "Recyclage", icon: <FaRecycle /> },
        { value: "health", label: "Santé", icon: <FaHeartbeat /> },
        { value: "business", label: "Business", icon: <FaBriefcase /> },
        { value: "chart", label: "Finance", icon: <FaChartLine /> },
        { value: "bulb", label: "Innovation", icon: <FaLightbulb /> },
        { value: "award", label: "Récompense", icon: <FaAward /> },
        { value: "trophy", label: "Compétition", icon: <FaTrophy /> },
        { value: "certificate", label: "Certification", icon: <FaCertificate /> },
        { value: "university", label: "Université", icon: <FaUniversity /> },
        { value: "school", label: "École", icon: <FaSchool /> },
        { value: "teacher", label: "Enseignement", icon: <FaChalkboardTeacher /> },
        { value: "microscope", label: "Recherche", icon: <FaMicroscope /> },
        { value: "flask", label: "Science", icon: <FaFlask /> },
        { value: "robot", label: "Robotique", icon: <FaRobot /> },
        { value: "cloud", label: "Cloud Computing", icon: <FaCloud /> },
        { value: "server", label: "Infrastructure", icon: <FaServer /> },
        { value: "database", label: "Base de données", icon: <FaDatabase /> },
        { value: "shield", label: "Sécurité", icon: <FaShieldAlt /> },
        { value: "handshake-alt", label: "Partenariat", icon: <FaHandshake /> },
        { value: "palette", label: "Créativité", icon: <FaPalette /> },
        { value: "camera", label: "Photographie", icon: <FaCamera /> },
        { value: "video", label: "Vidéo", icon: <FaVideo /> },
        { value: "headphones", label: "Audio", icon: <FaHeadphones /> },
        { value: "podcast", label: "Podcast", icon: <FaPodcast /> },
        { value: "calendar", label: "Événement", icon: <CalendarOutlined /> },
        { value: "global", label: "International", icon: <GlobalOutlined /> },
        { value: "team", label: "Équipe", icon: <TeamOutlined /> },
        { value: "bulb-ant", label: "Idée", icon: <BulbOutlined /> },
        { value: "experiment", label: "Expérimentation", icon: <ExperimentOutlined /> },
        { value: "rocket", label: "Lancement", icon: <RocketOutlined /> },
        { value: "fire", label: "Urgent", icon: <FireOutlined /> },
        { value: "star", label: "Premium", icon: <StarOutlined /> },
        { value: "gift", label: "Cadeau", icon: <GiftOutlined /> },
        { value: "heart", label: "Bénévolat", icon: <HeartOutlined /> },
        { value: "bank", label: "Financement", icon: <BankOutlined /> },
        { value: "shop", label: "Commerce", icon: <ShopOutlined /> },
        { value: "medicine", label: "Médecine", icon: <MedicineBoxOutlined /> },
        { value: "car", label: "Transport", icon: <CarOutlined /> },
        { value: "home", label: "Immobilier", icon: <HomeOutlined /> },
        { value: "environment", label: "Écologie", icon: <EnvironmentOutlined /> },
        { value: "video-camera", label: "Production", icon: <VideoCameraOutlined /> },
        { value: "sound", label: "Son", icon: <SoundOutlined /> },
        { value: "file", label: "Documentation", icon: <FileTextOutlined /> },
        { value: "code-ant", label: "Programmation", icon: <CodeOutlined /> },
        { value: "tool", label: "Outillage", icon: <ToolOutlined /> },
        { value: "safety", label: "Sécurité", icon: <SafetyOutlined /> },
        { value: "dollar", label: "Économie", icon: <DollarOutlined /> },
        { value: "fund", label: "Investissement", icon: <FundOutlined /> },
        { value: "thunderbolt", label: "Énergie", icon: <ThunderboltOutlined /> },
        { value: "api", label: "API", icon: <ApiOutlined /> },
        { value: "cloud-ant", label: "Cloud", icon: <CloudOutlined /> },
        { value: "database-ant", label: "Data", icon: <DatabaseOutlined /> },
        { value: "mobile", label: "Mobile", icon: <MobileOutlined /> },
        { value: "laptop", label: "Informatique", icon: <LaptopOutlined /> },
        { value: "camera-ant", label: "Photo", icon: <CameraOutlined /> },
        { value: "play", label: "Média", icon: <PlayCircleOutlined /> },
        { value: "customer", label: "Service Client", icon: <CustomerServiceOutlined /> },
        { value: "shopping", label: "Achat", icon: <ShoppingOutlined /> },
        { value: "cart", label: "E-commerce", icon: <ShoppingCartOutlined /> },
        { value: "crown", label: "VIP", icon: <CrownOutlined /> },
        { value: "like", label: "Social", icon: <LikeOutlined /> },
        { value: "comment", label: "Discussion", icon: <CommentOutlined /> },
        { value: "share", label: "Partage", icon: <ShareAltOutlined /> },
        { value: "send", label: "Communication", icon: <SendOutlined /> },
        { value: "mail", label: "Email", icon: <MailOutlined /> },
        { value: "phone", label: "Téléphonie", icon: <PhoneOutlined /> },
        { value: "message", label: "Messagerie", icon: <MessageOutlined /> },
        { value: "notification", label: "Notification", icon: <NotificationOutlined /> },
        { value: "setting", label: "Configuration", icon: <SettingOutlined /> },
        { value: "build", label: "Construction", icon: <BuildOutlined /> },
        { value: "bug", label: "Debug", icon: <BugOutlined /> },
        { value: "check", label: "Validation", icon: <CheckCircleOutlined /> },
        { value: "info", label: "Information", icon: <InfoCircleOutlined /> },
        { value: "question", label: "FAQ", icon: <QuestionCircleOutlined /> },
        { value: "stop", label: "Arrêt", icon: <StopOutlined /> },
        { value: "pause", label: "Pause", icon: <PauseCircleOutlined /> },
        { value: "appstore", label: "Application", icon: <AppstoreOutlined /> },
        { value: "dashboard", label: "Tableau de bord", icon: <DashboardOutlined /> },
        { value: "control", label: "Contrôle", icon: <ControlOutlined /> },
        { value: "security", label: "Cybersécurité", icon: <SecurityScanOutlined /> },
        { value: "shield-ant", label: "Protection", icon: <FaShieldAlt /> },
        { value: "lock", label: "Confidentialité", icon: <LockOutlined /> },
        { value: "key", label: "Accès", icon: <KeyOutlined /> },
        { value: "file-add", label: "Ajout", icon: <FileAddOutlined /> },
        { value: "folder", label: "Organisation", icon: <FolderOutlined /> },
        { value: "printer", label: "Impression", icon: <PrinterOutlined /> },
        { value: "scan", label: "Scan", icon: <ScanOutlined /> },
        { value: "qrcode", label: "QR Code", icon: <QrcodeOutlined /> },
        { value: "line-chart", label: "Analyse", icon: <LineChartOutlined /> },
        { value: "bar-chart", label: "Statistiques", icon: <BarChartOutlined /> },
        { value: "pie-chart", label: "Rapport", icon: <PieChartOutlined /> },
        { value: "sliders", label: "Paramètres", icon: <SlidersOutlined /> },
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
                                { title: <Link to="/">Tableau de bord</Link> },
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
                                                            src={buildImageUrl(item.image) || "/placeholder.svg"}
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
                                                                disabled={!canEdit}
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
                                                            <Paragraph ellipsis={{ rows: 3, tooltip: stripHtmlTags(item.description_en) }} style={{ marginBottom: 8 }}>
                                                                {stripHtmlTags(item.description_fr)}
                                                            </Paragraph>
                                                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                    <Avatar size="small" icon={<UserOutlined />} src={buildImageUrl(item.author?.profilePic)} />
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
                                    { required: true, message: "La date de l'activité est requise" },
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
