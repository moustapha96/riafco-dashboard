
"use client"
import { useState, useEffect, useRef } from "react"
import {
    Card,
    List,
    Avatar,
    Typography,
    Spin,
    Alert,
    Button,
    Input,
    Form,
    Space,
    Divider,
    Tag,
    Empty,
    Row,
    Col,
    Dropdown,
    Modal,
    message,
} from "antd"
import {
    UserOutlined,
    CommentOutlined,
    SendOutlined,
    LikeOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    FileOutlined,
    DownloadOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom"
import moment from "moment"
import "moment/locale/fr"
import discussionService from "../../../services/discussionService"
import commentService from "../../../services/commentService"
import { toast } from "sonner"
import { BiReply } from "react-icons/bi"
import { useAuth } from "../../../hooks/useAuth"
import { DislikeOutlined } from "@ant-design/icons"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
moment.locale("fr")

const DiscussionView = () => {
    const { user } = useAuth()
    const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    const canEdit = (discussion) => {
        if (!user || !discussion) return false
        // L'utilisateur peut modifier sa propre discussion ou les admins peuvent modifier toutes les discussions
        return user.id === discussion.createdBy?.id || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    }
    const [discussion, setDiscussion] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [commentLoading, setCommentLoading] = useState(false)
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyingToReply, setReplyingToReply] = useState(null) // Nouveau état pour répondre à un reply
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [showDocument, setShowDocument] = useState(false) // État pour afficher/masquer le document
    const { id: discussionId } = useParams()
    const navigate = useNavigate()
    const commentRefs = useRef({})

    // Fonction helper pour vérifier si un commentaire est liké par l'utilisateur actuel
    const isCommentLiked = (comment) => {
        if (!user || !comment.likes) return false
        // Vérifier si l'utilisateur actuel est dans la liste des likes
        return comment.likes.some((like) => {
            // Support pour différentes structures de données
            const likeUserId = like.user?.id || like.userId || like.user
            return likeUserId === user.id
        })
    }

    // Fonction helper pour vérifier si un commentaire/reply appartient à l'utilisateur connecté
    const isMyMessage = (message) => {
        if (!user || !message.createdBy) return false
        const messageUserId = message.createdBy.id || message.createdBy?.id
        const currentUserId = user.id
        return messageUserId === currentUserId
    }

    useEffect(() => {
        if (discussionId) {
            loadDiscussionData().then(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                })
            })
        }
    }, [discussionId])

    // Rafraîchissement automatique toutes les 3 secondes (silencieux)
    useEffect(() => {
        if (!discussionId) return

        const intervalId = setInterval(() => {
            // Rafraîchissement silencieux sans afficher de chargement
            loadDiscussionData(true)
        }, 3000) // 3 secondes

        // Nettoyer l'intervalle lors du démontage du composant
        return () => {
            clearInterval(intervalId)
        }
    }, [discussionId])

    const loadDiscussionData = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true)
                setError(null)
            }
            const discussionResponse = await discussionService.getById(discussionId)
            setDiscussion(discussionResponse.data)

            const commentsResponse = await commentService.getAll(discussionId)
            setComments(commentsResponse.data || [])
        } catch (err) {
            console.error("Erreur lors du chargement:", err)
            if (!silent) {
                setError("Erreur lors du chargement des données")
            }
        } finally {
            if (!silent) {
                setLoading(false)
            }
        }
    }

    const handleEditComment = async (commentId, initialContent) => {
        setEditingCommentId(commentId)
        editForm.setFieldsValue({ content: initialContent })
    }

    const handleUpdateComment = async (commentId) => {
        try {
            const values = await editForm.validateFields()
            await commentService.update(commentId, { content: values.content })
            await loadDiscussionData()
            setEditingCommentId(null)
            toast.success("Commentaire modifié avec succès")
        } catch (err) {
            console.error("Erreur lors de la modification du commentaire:", err)
            toast.error("Erreur lors de la modification du commentaire")
        }
    }

    const handleAddComment = async (values) => {
        try {
            setCommentLoading(true)
            const parentId = replyingTo || replyingToReply?.parentId || null

            if (replyingToReply) {
                // Répondre à un reply (réponse à une réponse)
                await commentService.replyToComment(discussionId, replyingToReply.parentId, {
                    content: values.content,
                    parentId: replyingToReply.id, // Le parent est le reply auquel on répond
                })
            } else if (replyingTo) {
                // Répondre à un commentaire
                await commentService.replyToComment(discussionId, replyingTo, {
                    content: values.content,
                })
            } else {
                // Nouveau commentaire
                await discussionService.addCommentDiscussion(discussionId, {
                    content: values.content,
                })
            }

            await loadDiscussionData()
            form.resetFields()
            setReplyingTo(null)
            setReplyingToReply(null)
            toast.success("Commentaire ajouté avec succès")

            // Faire défiler vers le nouveau commentaire après un court délai
            setTimeout(() => {
                if (replyingTo || replyingToReply) {
                    const element = document.getElementById(`comment-${replyingTo || replyingToReply.parentId}`)
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
                } else {
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                    })
                }
            }, 500)
        } catch (err) {
            console.error("Erreur lors de l'ajout du commentaire:", err)
            toast.error("Erreur lors de l'ajout du commentaire")
        } finally {
            setCommentLoading(false)
        }
    }

    const handleLikeComment = async (commentId) => {
        try {
            // Trouver le commentaire pour vérifier s'il est déjà liké
            let comment = comments.find((c) => c.id === commentId)
            if (!comment) {
                // Chercher dans les replies
                for (const c of comments) {
                    if (c.replies) {
                        comment = c.replies.find((r) => r.id === commentId)
                        if (comment) break
                    }
                }
            }
            const isLiked = comment ? isCommentLiked(comment) : false
            
            await commentService.likeComment(discussionId, commentId)
            message.success(isLiked ? "Je n'aime plus" : "J'aime")
            await loadDiscussionData(true) // Rafraîchissement silencieux
        } catch (err) {
            message.error("Erreur lors du like/unlike")
            console.error("Erreur lors du like:", err)
        }
    }

    const handleReplyToComment = (commentId) => {
        setReplyingTo(commentId)
        setReplyingToReply(null)
        form.setFieldsValue({ content: "" })
    }

    const handleReplyToReply = (reply) => {
        setReplyingToReply(reply)
        setReplyingTo(null)
        form.setFieldsValue({ content: "" })
    }

    const handleDeleteComment = async (commentId) => {
        Modal.confirm({
            title: "Supprimer le commentaire",
            content: "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
            okText: "Supprimer",
            okType: "danger",
            cancelText: "Annuler",
            onOk: async () => {
                try {
                    await commentService.delete(commentId)
                    await loadDiscussionData()
                    toast.success("Commentaire supprimé")
                } catch (err) {
                    console.log(err)
                    toast.error("Erreur lors de la suppression")
                }
            },
        })
    }

    const getCommentActions = (comment) => {
        const isLiked = isCommentLiked(comment)
        const actions = [
            {
                key: "reply",
                label: "Répondre",
                icon: <CommentOutlined />,
                onClick: () => handleReplyToComment(comment.id),
            },
            {
                key: "like",
                label: isLiked ? "Je n'aime plus" : "J'aime",
                icon: isLiked ? <DislikeOutlined /> : <LikeOutlined />,
                onClick: () => handleLikeComment(comment.id),
            },
        ]
        
        if (canDelete) {
            actions.push(
                { type: "divider" },
                {
                    key: "edit",
                    label: "Modifier",
                    icon: <EditOutlined />,
                    onClick: () => handleEditComment(comment.id, comment.content),
                },
                {
                    key: "delete",
                    label: "Supprimer",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDeleteComment(comment.id),
                }
            )
        }
        
        return actions
    }

    const getReplyActions = (reply) => {
        const isLiked = isCommentLiked(reply)
        return [
            {
                key: "reply",
                label: "Répondre",
                icon: <BiReply />,
                onClick: () => handleReplyToReply(reply),
            },
            {
                key: "like",
                label: isLiked ? "Je n'aime plus" : "J'aime",
                icon: isLiked ? <DislikeOutlined /> : <LikeOutlined />,
                onClick: () => handleLikeComment(reply.id),
            },
        ]
    }

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                }}
            >
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Chargement de la discussion...</div>
            </div>
        )
    }

    if (error) {
        return <Alert message="Erreur" description={error} type="error" showIcon style={{ margin: "20px 0" }} />
    }

    if (!discussion) {
        return <Empty description="Discussion non trouvée" style={{ padding: "50px" }} />
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
                {/* En-tête avec titre et thème */}
                <Card style={{ marginBottom: "24px" }}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <Title level={2} style={{ margin: 0, marginBottom: "8px" }}>
                                    {discussion.title}
                                </Title>
                                {discussion.theme && (
                                    <Space wrap style={{ marginTop: "8px" }}>
                                        <Space>
                                            <Text type="secondary">Thème :</Text>
                                            <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>
                                                {discussion.theme.title}
                                            </Tag>
                                        </Space>
                                    </Space>
                                )}
                            </div>
                            {canEdit(discussion) && (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => navigate(`/discussions/${discussionId}/edit`)}
                                    style={{ marginLeft: "16px" }}
                                >
                                    Modifier
                                </Button>
                            )}
                        </div>
                        {discussion.content && (
                            <Paragraph style={{ margin: 0, fontSize: "15px", color: "#595959" }}>
                                {discussion.content}
                            </Paragraph>
                        )}
                        <div>
                            <Space>
                                <Text type="secondary" style={{ fontSize: "13px" }}>
                                    Par {discussion.createdBy?.firstName} {discussion.createdBy?.lastName}
                                </Text>
                                <Text type="secondary" style={{ fontSize: "13px" }}>
                                    • {moment(discussion.createdAt).format("DD/MM/YYYY à HH:mm")}
                                </Text>
                            </Space>
                        </div>
                    </Space>
                </Card>

                {/* Section document du thème */}
                {discussion.theme?.file && (
                    <Card 
                        style={{ 
                            marginBottom: "24px",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #e6f7ff"
                        }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FileOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
                                    <Text strong style={{ fontSize: "16px" }}>
                                        Document du thème
                                    </Text>
                                </div>
                                <Space>
                                    <Button
                                        icon={showDocument ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        onClick={() => setShowDocument(!showDocument)}
                                    >
                                        {showDocument ? "Masquer" : "Afficher"} le document
                                    </Button>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() => {
                                            const fileUrl = buildImageUrl(discussion.theme.file)
                                            const link = document.createElement('a')
                                            link.href = fileUrl
                                            link.download = discussion.theme.file.split('/').pop() || 'document'
                                            document.body.appendChild(link)
                                            link.click()
                                            document.body.removeChild(link)
                                        }}
                                    >
                                        Télécharger
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<FileOutlined />}
                                        onClick={() => {
                                            const fileUrl = buildImageUrl(discussion.theme.file)
                                            window.open(fileUrl, "_blank")
                                        }}
                                    >
                                        Ouvrir dans un nouvel onglet
                                    </Button>
                                </Space>
                            </div>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                Un document est disponible pour ce thème de discussion
                            </Text>
                            
                            {/* Affichage du document */}
                            {showDocument && (
                                <div
                                    style={{
                                        marginTop: "16px",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <div style={{ 
                                        padding: "12px", 
                                        backgroundColor: "#fafafa", 
                                        borderBottom: "1px solid #d9d9d9",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <Text strong style={{ fontSize: "14px" }}>
                                            Aperçu du document
                                        </Text>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<EyeInvisibleOutlined />}
                                            onClick={() => setShowDocument(false)}
                                        >
                                            Masquer
                                        </Button>
                                    </div>
                                    <div style={{ 
                                        height: "600px", 
                                        width: "100%",
                                        overflow: "auto"
                                    }}>
                                        {(() => {
                                            const fileUrl = buildImageUrl(discussion.theme.file)
                                            const fileExtension = discussion.theme.file.split('.').pop()?.toLowerCase()
                                            
                                            // Pour les images
                                            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                                                return (
                                                    <img
                                                        src={fileUrl}
                                                        alt="Document du thème"
                                                        style={{
                                                            width: "100%",
                                                            height: "auto",
                                                            objectFit: "contain",
                                                            display: "block"
                                                        }}
                                                    />
                                                )
                                            }
                                            
                                            // Pour les PDFs
                                            if (fileExtension === 'pdf') {
                                                return (
                                                    <iframe
                                                        src={fileUrl}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            border: "none"
                                                        }}
                                                        title="Document du thème"
                                                    />
                                                )
                                            }
                                            
                                            // Pour les autres types de documents (DOC, DOCX, TXT)
                                            return (
                                                <div style={{
                                                    padding: "24px",
                                                    textAlign: "center",
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                    <FileOutlined style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }} />
                                                    <Text type="secondary" style={{ fontSize: "16px", marginBottom: "16px" }}>
                                                        Aperçu non disponible pour ce type de fichier
                                                    </Text>
                                                    <Button
                                                        type="primary"
                                                        icon={<FileOutlined />}
                                                        onClick={() => window.open(fileUrl, "_blank")}
                                                    >
                                                        Ouvrir le document
                                                    </Button>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                </div>
                            )}
                        </Space>
                    </Card>
                )}

                <Card title={`Commentaires (${comments.length})`}>
                    {comments.length === 0 ? (
                        <Empty description="Aucun commentaire pour cette discussion" style={{ padding: "20px 0" }} />
                    ) : (
                        <List
                            dataSource={comments}
                            renderItem={(comment) => {
                                const isMyComment = isMyMessage(comment)
                                return (
                                    <List.Item
                                        key={comment.id}
                                        id={`comment-${comment.id}`}
                                        ref={(el) => (commentRefs.current[comment.id] = el)}
                                        style={{
                                            display: "flex",
                                            justifyContent: isMyComment ? "flex-end" : "flex-start",
                                            paddingLeft: isMyComment ? "20%" : "0",
                                            paddingRight: isMyComment ? "0" : "20%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: "80%",
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: isMyComment ? "row-reverse" : "row",
                                                gap: "12px",
                                            }}
                                        >
                                            <Avatar
                                                icon={<UserOutlined />}
                                                src={buildImageUrl(comment.createdBy?.profilePic)}
                                                style={{ flexShrink: 0 }}
                                            />
                                            <div
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: isMyComment ? "flex-end" : "flex-start",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: isMyComment ? "#1890ff" : "#f0f0f0",
                                                        color: isMyComment ? "#fff" : "#000",
                                                        padding: "12px 16px",
                                                        borderRadius: isMyComment ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                                        marginBottom: "8px",
                                                        maxWidth: "100%",
                                                        wordWrap: "break-word",
                                                    }}
                                                >
                                                    {editingCommentId === comment.id ? (
                                                        <div>
                                                            <Form
                                                                form={editForm}
                                                                onFinish={() => handleUpdateComment(comment.id)}
                                                                initialValues={{ content: comment.content }}
                                                            >
                                                                <Form.Item name="content">
                                                                    <TextArea rows={3} style={{ marginBottom: "8px" }} />
                                                                </Form.Item>
                                                                <Form.Item style={{ margin: 0 }}>
                                                                    <Space>
                                                                        <Button size="small" onClick={() => setEditingCommentId(null)}>
                                                                            Annuler
                                                                        </Button>
                                                                        <Button type="primary" size="small" htmlType="submit">
                                                                            Enregistrer
                                                                        </Button>
                                                                    </Space>
                                                                </Form.Item>
                                                            </Form>
                                                        </div>
                                                    ) : (
                                                        <Paragraph
                                                            style={{
                                                                margin: 0,
                                                                whiteSpace: "pre-wrap",
                                                                color: isMyComment ? "#fff" : "#000",
                                                            }}
                                                        >
                                                            {comment.content}
                                                        </Paragraph>
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        flexDirection: isMyComment ? "row-reverse" : "row",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: "13px",
                                                            color: isMyComment ? "#1890ff" : "#595959",
                                                        }}
                                                    >
                                                        {comment.createdBy?.firstName} {comment.createdBy?.lastName}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: "11px" }}>
                                                        {moment(comment.createdAt).fromNow()}
                                                    </Text>
                                                    {comment.parentId && (
                                                        <Tag size="small" style={{ margin: 0 }}>
                                                            Réponse
                                                        </Tag>
                                                    )}
                                                </div>
                                                <Space
                                                    style={{
                                                        flexDirection: isMyComment ? "row-reverse" : "row",
                                                    }}
                                                >
                                                    <Button
                                                        type={isCommentLiked(comment) ? "primary" : "text"}
                                                        size="small"
                                                        icon={<LikeOutlined />}
                                                        onClick={() => handleLikeComment(comment.id)}
                                                        style={isCommentLiked(comment) ? { color: "#1890ff" } : {}}
                                                    >
                                                        {comment._count?.likes || 0}
                                                    </Button>
                                                    <Dropdown menu={{ items: getCommentActions(comment) }} trigger={["click"]}>
                                                        <Button type="text" size="small" icon={<MoreOutlined />} />
                                                    </Dropdown>
                                                </Space>

                                                {/* Affichage des réponses (replies) */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div style={{ marginTop: "16px", width: "100%" }}>
                                                        <div
                                                            style={{
                                                                marginBottom: "12px",
                                                                padding: "8px 12px",
                                                                backgroundColor: "#f8f9fa",
                                                                borderRadius: "8px",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Text type="secondary" style={{ fontSize: "12px", fontWeight: "500" }}>
                                                                {comment.replies.length} réponse{comment.replies.length > 1 ? "s" : ""}
                                                            </Text>
                                                        </div>

                                                        {comment.replies.map((reply) => {
                                                            const isMyReply = isMyMessage(reply)
                                                            return (
                                                                <div
                                                                    key={reply.id}
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: isMyReply ? "flex-end" : "flex-start",
                                                                        marginBottom: "12px",
                                                                        paddingLeft: isMyReply ? "20%" : "0",
                                                                        paddingRight: isMyReply ? "0" : "20%",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            maxWidth: "80%",
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: isMyReply ? "row-reverse" : "row",
                                                                            gap: "8px",
                                                                        }}
                                                                    >
                                                                        <Avatar
                                                                            icon={<UserOutlined />}
                                                                            src={buildImageUrl(reply.createdBy?.profilePic)}
                                                                            size="small"
                                                                            style={{ flexShrink: 0 }}
                                                                        />
                                                                        <div
                                                                            style={{
                                                                                flex: 1,
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                alignItems: isMyReply ? "flex-end" : "flex-start",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    backgroundColor: isMyReply ? "#1890ff" : "#f0f0f0",
                                                                                    color: isMyReply ? "#fff" : "#000",
                                                                                    padding: "10px 14px",
                                                                                    borderRadius: isMyReply ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                                                                    marginBottom: "6px",
                                                                                    maxWidth: "100%",
                                                                                    wordWrap: "break-word",
                                                                                }}
                                                                            >
                                                                                <Paragraph
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        whiteSpace: "pre-wrap",
                                                                                        fontSize: "13px",
                                                                                        lineHeight: "1.4",
                                                                                        color: isMyReply ? "#fff" : "#595959",
                                                                                    }}
                                                                                >
                                                                                    {reply.content}
                                                                                </Paragraph>
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: "6px",
                                                                                    flexDirection: isMyReply ? "row-reverse" : "row",
                                                                                    marginBottom: "6px",
                                                                                }}
                                                                            >
                                                                                <Text
                                                                                    strong
                                                                                    style={{
                                                                                        fontSize: "12px",
                                                                                        color: isMyReply ? "#1890ff" : "#1890ff",
                                                                                    }}
                                                                                >
                                                                                    {reply.createdBy?.firstName} {reply.createdBy?.lastName}
                                                                                </Text>
                                                                                <Text type="secondary" style={{ fontSize: "10px" }}>
                                                                                    {moment(reply.createdAt).fromNow()}
                                                                                </Text>
                                                                                <Tag
                                                                                    size="small"
                                                                                    color="blue"
                                                                                    style={{
                                                                                        fontSize: "10px",
                                                                                        borderRadius: "10px",
                                                                                        padding: "0 6px",
                                                                                        margin: 0,
                                                                                    }}
                                                                                >
                                                                                    Réponse
                                                                                </Tag>
                                                                            </div>
                                                                            <Space
                                                                                size="small"
                                                                                style={{
                                                                                    flexDirection: isMyReply ? "row-reverse" : "row",
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    type={isCommentLiked(reply) ? "primary" : "text"}
                                                                                    size="small"
                                                                                    icon={<LikeOutlined />}
                                                                                    onClick={() => handleLikeComment(reply.id)}
                                                                                    style={{
                                                                                        fontSize: "12px",
                                                                                        ...(isCommentLiked(reply) ? { color: "#1890ff" } : {}),
                                                                                    }}
                                                                                >
                                                                                    {reply._count?.likes || 0}
                                                                                </Button>
                                                                                <Dropdown menu={{ items: getReplyActions(reply) }} trigger={["click"]}>
                                                                                    <Button
                                                                                        type="text"
                                                                                        size="small"
                                                                                        icon={<MoreOutlined />}
                                                                                        style={{ fontSize: "12px" }}
                                                                                    />
                                                                                </Dropdown>
                                                                            </Space>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </List.Item>
                                )
                            }}
                        />
                    )}

                    <Divider />

                    {/* Formulaire d'ajout de commentaire */}
                    {!discussion.isClosed && (
                        <div>
                            {(replyingTo || replyingToReply) && (
                                <Alert
                                    message={`Réponse ${replyingToReply ? "à une réponse" : "au commentaire"}`}
                                    description={
                                        replyingToReply
                                            ? `Vous répondez à ${replyingToReply.createdBy?.firstName} ${replyingToReply.createdBy?.lastName}`
                                            : `Vous répondez au commentaire de ${comments.find((c) => c.id === replyingTo)?.createdBy?.firstName} ${comments.find((c) => c.id === replyingTo)?.createdBy?.lastName}`
                                    }
                                    type="info"
                                    showIcon
                                    closable
                                    onClose={() => {
                                        setReplyingTo(null)
                                        setReplyingToReply(null)
                                    }}
                                    style={{ marginBottom: "16px" }}
                                />
                            )}

                            <Form form={form} onFinish={handleAddComment}>
                                <Form.Item
                                    name="content"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Veuillez saisir votre commentaire",
                                        },
                                        {
                                            min: 2,
                                            message: "Le commentaire doit contenir au moins 2 caractères",
                                        },
                                    ]}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder={
                                            replyingToReply
                                                ? `Répondre à ${replyingToReply.createdBy?.firstName}...`
                                                : replyingTo
                                                    ? "Écrivez votre réponse..."
                                                    : "Écrivez votre commentaire..."
                                        }
                                        style={{ resize: "vertical" }}
                                    />
                                </Form.Item>
                                <Form.Item style={{ margin: 0, textAlign: "right" }}>
                                    <Space>
                                        {(replyingTo || replyingToReply) && (
                                            <Button
                                                onClick={() => {
                                                    setReplyingTo(null)
                                                    setReplyingToReply(null)
                                                }}
                                            >
                                                Annuler
                                            </Button>
                                        )}
                                        <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={commentLoading}>
                                            {replyingToReply ? "Répondre" : replyingTo ? "Répondre" : "Publier le commentaire"}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default DiscussionView

