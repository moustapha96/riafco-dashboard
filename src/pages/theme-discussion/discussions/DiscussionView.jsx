
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
} from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom"
import moment from "moment"
import "moment/locale/fr"
import discussionService from "../../../services/discussionService"
import commentService from "../../../services/commentService"
import { toast } from "sonner"
import { BiReply } from "react-icons/bi"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
moment.locale("fr")

const DiscussionView = () => {
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
    const { id: discussionId } = useParams()
    const navigate = useNavigate()
    const commentRefs = useRef({})

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

    const loadDiscussionData = async () => {
        try {
            setLoading(true)
            setError(null)
            const discussionResponse = await discussionService.getById(discussionId)
            setDiscussion(discussionResponse.data)

            const commentsResponse = await commentService.getAll(discussionId)
            setComments(commentsResponse.data || [])
        } catch (err) {
            console.error("Erreur lors du chargement:", err)
            setError("Erreur lors du chargement des données")
        } finally {
            setLoading(false)
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
            await commentService.likeComment(discussionId, commentId)
            message.success("Like ajouté avec succès")
            await loadDiscussionData()
        } catch (err) {
            message.error("Erreur lors du like")
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

    const getCommentActions = (comment) => [
        {
            key: "reply",
            label: "Répondre",
            icon: <CommentOutlined />,
            onClick: () => handleReplyToComment(comment.id),
        },
        {
            key: "like",
            label: "J'aime",
            icon: <LikeOutlined />,
            onClick: () => handleLikeComment(comment.id),
        },
        {
            type: "divider",
        },
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
        },
    ]

    const getReplyActions = (reply) => [
        {
            key: "reply",
            label: "Répondre",
            icon: <BiReply />,
            onClick: () => handleReplyToReply(reply),
        },
        {
            key: "like",
            label: "J'aime",
            icon: <LikeOutlined />,
            onClick: () => handleLikeComment(reply.id),
        },
    ]

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
                {/* ... (le reste de votre code pour l'affichage de la discussion) ... */}

                <Card title={`Commentaires (${comments.length})`}>
                    {comments.length === 0 ? (
                        <Empty description="Aucun commentaire pour cette discussion" style={{ padding: "20px 0" }} />
                    ) : (
                        <List
                            dataSource={comments}
                            renderItem={(comment) => (
                                <List.Item
                                    key={comment.id}
                                    id={`comment-${comment.id}`}
                                    ref={(el) => (commentRefs.current[comment.id] = el)}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} src={comment.createdBy?.profilePic} />}
                                        title={
                                            <Row justify="space-between" align="middle">
                                                <Col>
                                                    <Space>
                                                        <Text strong>
                                                            {comment.createdBy?.firstName} {comment.createdBy?.lastName}
                                                        </Text>
                                                        <Text type="secondary" style={{ fontSize: "12px" }}>
                                                            {moment(comment.createdAt).fromNow()}
                                                        </Text>
                                                        {comment.parentId && <Tag size="small">Réponse</Tag>}
                                                    </Space>
                                                </Col>
                                                <Col>
                                                    <Space>
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<LikeOutlined />}
                                                            onClick={() => handleLikeComment(comment.id)}
                                                        >
                                                            {comment._count?.likes || 0}
                                                        </Button>
                                                        <Dropdown menu={{ items: getCommentActions(comment) }} trigger={["click"]}>
                                                            <Button type="text" size="small" icon={<MoreOutlined />} />
                                                        </Dropdown>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        }
                                        description={
                                            <div>
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
                                                    <Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>{comment.content}</Paragraph>
                                                )}

                                                {/* Affichage des réponses (replies) */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div style={{ marginTop: "16px" }}>
                                                        <div
                                                            style={{
                                                                marginBottom: "12px",
                                                                paddingLeft: "8px",
                                                                borderLeft: "3px solid #1890ff",
                                                                backgroundColor: "#f8f9fa",
                                                            }}
                                                        >
                                                            <Text type="secondary" style={{ fontSize: "12px", fontWeight: "500" }}>
                                                                {comment.replies.length} réponse{comment.replies.length > 1 ? "s" : ""}
                                                            </Text>
                                                        </div>

                                                        <List
                                                            dataSource={comment.replies}
                                                            renderItem={(reply, index) => (
                                                                <List.Item
                                                                    key={reply.id}
                                                                    style={{
                                                                        paddingLeft: "24px",
                                                                        paddingRight: "12px",
                                                                        paddingTop: "12px",
                                                                        paddingBottom: "12px",
                                                                        marginLeft: "20px",
                                                                        marginBottom: "8px",
                                                                        borderLeft: "2px solid #e6f7ff",
                                                                        backgroundColor: "#fafafa",
                                                                        borderRadius: "0 8px 8px 0",
                                                                        position: "relative",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            position: "absolute",
                                                                            left: "-10px",
                                                                            top: "20px",
                                                                            width: "8px",
                                                                            height: "2px",
                                                                            backgroundColor: "#d9d9d9",
                                                                        }}
                                                                    />

                                                                    <List.Item.Meta
                                                                        avatar={
                                                                            <Avatar
                                                                                icon={<UserOutlined />}
                                                                                src={reply.createdBy?.profilePic}
                                                                                size="small"
                                                                                style={{ border: "2px solid #fff" }}
                                                                            />
                                                                        }
                                                                        title={
                                                                            <Row justify="space-between" align="middle">
                                                                                <Col>
                                                                                    <Space>
                                                                                        <Text strong style={{ fontSize: "13px", color: "#1890ff" }}>
                                                                                            {reply.createdBy?.firstName} {reply.createdBy?.lastName}
                                                                                        </Text>
                                                                                        <Text type="secondary" style={{ fontSize: "11px" }}>
                                                                                            {moment(reply.createdAt).fromNow()}
                                                                                        </Text>
                                                                                        <Tag
                                                                                            size="small"
                                                                                            color="blue"
                                                                                            style={{
                                                                                                fontSize: "10px",
                                                                                                borderRadius: "10px",
                                                                                                padding: "0 6px",
                                                                                            }}
                                                                                        >
                                                                                            Réponse
                                                                                        </Tag>
                                                                                    </Space>
                                                                                </Col>
                                                                                <Col>
                                                                                    <Space size="small">
                                                                                        <Button
                                                                                            type="text"
                                                                                            size="small"
                                                                                            icon={<LikeOutlined />}
                                                                                            onClick={() => handleLikeComment(reply.id)}
                                                                                            style={{ fontSize: "12px" }}
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
                                                                                </Col>
                                                                            </Row>
                                                                        }
                                                                        description={
                                                                            <div style={{ marginTop: "4px" }}>
                                                                                <Paragraph
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        whiteSpace: "pre-wrap",
                                                                                        fontSize: "13px",
                                                                                        lineHeight: "1.4",
                                                                                        color: "#595959",
                                                                                    }}
                                                                                >
                                                                                    {reply.content}
                                                                                </Paragraph>
                                                                            </div>
                                                                        }
                                                                    />
                                                                </List.Item>
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
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

