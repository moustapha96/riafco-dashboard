"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, Form, Input, Button, Select, Upload, message, Space, Typography, Spin, Row, Col } from "antd"
import {
    ArrowLeftOutlined,
    UploadOutlined,
    BookOutlined,
    UsergroupAddOutlined,
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
import activityService from "../../../services/activityService"
import { 
    FaHandshake,
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
    FaPalette,
    FaCamera,
    FaVideo,
    FaHeadphones,
    FaPodcast
} from "react-icons/fa"
import { toast } from "sonner"
import ReactQuill from "react-quill"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title } = Typography
const { Option } = Select

const ActivitesEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(!!id)
    const [description_fr, setDescriptionFr] = useState("")
    const [description_en, setDescriptionEn] = useState("")
    const [fileList, setFileList] = useState([])
    const [galleryList, setGalleryList] = useState([])


    const isEditing = !!id

    useEffect(() => {
        if (isEditing) {
            fetchActivity()
        }
    }, [id])

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

    const fetchActivity = async () => {
        try {
            setInitialLoading(true)
            const response = await activityService.getById(id)
            console.log(response)
            const activity = response.activity

            form.setFieldsValue({
                title_fr: activity.title_fr,
                title_en: activity.title_en,
                icon: activity.icon || "book", // Valeur par défaut si null
                status: activity.status || "DRAFT", // Valeur par défaut si null
                dateActivity: activity.dateActivity || null, // Le format YYYY-MM-DD est déjà correct pour input type="date"
            })

            setDescriptionFr(activity.description_fr || "")
            setDescriptionEn(activity.description_en || "")
            setFileList(
                activity.image
                    ? [
                        {
                            uid: "-1",
                            name: "image.jpg",
                            status: "done",
                            url: buildImageUrl(activity.image),
                        },
                    ]
                    : [],
            )
            setGalleryList(
                activity.galleries?.map((url, index) => ({
                    uid: `-${index + 2}`,
                    name: `gallery-${index}.jpg`,
                    status: "done",
                    url: buildImageUrl(url),
                })) || []
            )
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors du chargement de l'activité")
            navigate("/admin/activities")
        } finally {
            setInitialLoading(false)
        }
    }

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
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

            if (isEditing) {
                await activityService.update(id, formData)
                message.success("Activité mise à jour avec succès")
            } else {
                await activityService.create(formData)
                message.success("Activité créée avec succès")
            }

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
            navigate("/admin/activities")
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
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

    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet",
        "link", "image",
    ];

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

    if (initialLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <Spin size="large" />
            </div>
        )
    }

    return <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing"
                style={{
                    maxHeight: "calc(100vh - 100px)", // Ajustez cette valeur selon votre mise en page
                    overflowY: "auto", // Active la barre de défilement verticale
                    paddingRight: "8px" // Évite que le contenu ne touche la barre de défilement
                }}>
                <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/activities")} style={{ marginBottom: "24px" }}>
                        Retour aux activités
                    </Button>

                    <Card>
                        <Title level={2} style={{ marginBottom: "24px" }}>
                            {isEditing ? "Modifier l'activité" : "Créer une activité"}
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                status: "DRAFT",
                                icon: "book",
                            }}
                        >
                            <Form.Item name="title_fr" label="Titre en Francais" rules={[{ required: true, message: "Le titre est requis" }]}>
                                <Input placeholder="Titre de l'activité" size="large" />
                            </Form.Item>

                            <Form.Item name="title_en" label="Titre en Anglais" rules={[{ required: true, message: "Le titre est requis" }]}>
                                <Input placeholder="Titre de l'activité" size="large" />
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

                            <Form.Item name="icon" label="Type d'activité" rules={[{ required: true }]}>
                                <Select size="large" showSearch filterOption={(input, option) =>
                                    option.children.props.children[1].toLowerCase().includes(input.toLowerCase())
                                }>
                                    {iconOptions.map(option => (
                                        <Option key={option.value} value={option.value}>
                                            <Space>
                                                {option.icon}
                                                {option.label}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Description en Francais" rules={[{ required: true, message: "La description est requise" }]}>
                                <div data-color-mode="light">

                                    <ReactQuill
                                        theme="snow"
                                        value={description_fr}
                                        onChange={setDescriptionFr}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description ..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item label="Description en Anglais" rules={[{ required: true, message: "La description est requise" }]}>
                                <div data-color-mode="light">

                                    <ReactQuill
                                        theme="snow"
                                        value={description_en}
                                        onChange={setDescriptionEn}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description ..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item name="status" label="Statut">
                                <Select size="large">
                                    <Option value="DRAFT">Brouillon</Option>
                                    <Option value="PUBLISHED">Publié</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Image de couverture">
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />} size="large">
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


                            <Form.Item style={{ textAlign: "right", marginTop: "32px" }}>
                                <Space size="middle">
                                    <Button size="large" onClick={() => navigate("/admin/activities")} disabled={loading}>
                                        Annuler
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                                        {isEditing ? "Mettre à jour" : "Créer l'activité"}
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

export default ActivitesEdit
