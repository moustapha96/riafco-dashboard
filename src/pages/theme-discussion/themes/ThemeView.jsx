"use client";
import { useState, useEffect } from "react";
import {
    Card,
    List,
    Button,
    Input,
    Space,
    Typography,
    Avatar,
    Tag,
    Empty,
    Spin,
    Alert,
    Breadcrumb,
    Form,
    Tooltip,
} from "antd";
import {
    PlusOutlined,
    BookOutlined,
    MessageOutlined,
    UserOutlined,
    EyeOutlined,
    SendOutlined,
} from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import themeService from "../../../services/themeService";
import discussionService from "../../../services/discussionService";
import CommentComponent from "../commentaire/comment";

moment.locale("fr");
const { Title, Text } = Typography;
const { TextArea } = Input;

const ThemeView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [theme, setTheme] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [commentForm] = Form.useForm();
    const [expandedDiscussionId, setExpandedDiscussionId] = useState(null);
    const [comments, setComments] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    // Charger les données du thème et des discussions
    useEffect(() => {
        loadThemeData();
    }, [id]);

    const loadThemeData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [discussionsResponse, themeResponse] = await Promise.all([
                themeService.getDiscussions(id, {
                    page: pagination.current,
                    limit: pagination.pageSize,
                }),
                themeService.getById(id),
            ]);

            setDiscussions(discussionsResponse.data || []);
            setTheme(themeResponse.data || {});
        } catch (err) {
            console.error("Erreur lors du chargement:", err);
            setError("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Charger les commentaires d'une discussion
    const loadComments = async (discussionId) => {
        try {
            setCommentLoading((prev) => ({ ...prev, [discussionId]: true }));
            const response = await discussionService.getDiscussionComments(discussionId, {
                page: 1,
                limit: 10,
            });
            console.log( response.data);

            setComments((prev) => ({ ...prev, [discussionId]: response.data || [] }));
        } catch (err) {
            console.error("Erreur lors du chargement des commentaires:", err);
            setError("Erreur lors du chargement des commentaires");
        } finally {
            setCommentLoading((prev) => ({ ...prev, [discussionId]: false }));
        }
    };

    // Ajouter un commentaire
    const handleAddComment = async (discussionId) => {
        try {
            const values = await commentForm.validateFields();
            setCommentLoading((prev) => ({ ...prev, [discussionId]: true }));
            await discussionService.addCommentDiscussion(discussionId, {
                content: values.comment,
            });
            await loadComments(discussionId);
            commentForm.resetFields();
        } catch (err) {
            console.error("Erreur lors de l'ajout du commentaire:", err);
            setError("Erreur lors de l'ajout du commentaire");
        } finally {
            setCommentLoading((prev) => ({ ...prev, [discussionId]: false }));
        }
    };

    // Gérer l'expansion des commentaires
    const toggleComments = (discussionId) => {
        if (expandedDiscussionId === discussionId) {
            setExpandedDiscussionId(null);
        } else {
            setExpandedDiscussionId(discussionId);
            if (!comments[discussionId]) {
                loadComments(discussionId);
            }
        }
    };

    // Navigation vers une discussion
    const handleViewDiscussion = (discussionId) => {
        navigate(`/discussions/${discussionId}`);
    };

    if (error) {
        return (
            <Alert
                message="Erreur"
                description={error}
                type="error"
                showIcon
                style={{ margin: "20px 0" }}
            />
        );
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
                    <h5 className="text-lg font-semibold">Thème : {theme.title}</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/themes">Thèmes</Link> },
                            { title: theme.title },
                        ]}
                    />
                </div>

                <Card style={{ marginBottom: "24px" }}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Title level={4}>
                            <BookOutlined style={{ marginRight: "8px" }} />
                            {theme.title}
                        </Title>
                        <Text>{theme.description}</Text>
                        <Tag color={theme.color || "blue"}>{theme.status}</Tag>
                    </Space>
                </Card>

                <Card title="Discussions">
                    <Spin spinning={loading}>
                        {discussions.length === 0 && !loading ? (
                            <Empty description="Aucune discussion trouvée pour ce thème">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate(`/themes/${id}/discussions/new`)}
                                >
                                    Créer une discussion
                                </Button>
                            </Empty>
                        ) : (
                            <List
                                dataSource={discussions}
                                renderItem={(discussion) => (
                                    <List.Item key={discussion.id}>
                                        <Card style={{ width: "100%" }}>
                                            <Space direction="vertical" style={{ width: "100%" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Title level={5}>{discussion.title}</Title>
                                                    <Space>
                                                        <Button
                                                            type="text"
                                                            icon={<EyeOutlined />}
                                                            onClick={() => handleViewDiscussion(discussion.id)}
                                                        >
                                                            Voir
                                                        </Button>
                                                    </Space>
                                                </div>
                                                <Text>{discussion.content}</Text>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                                                    <Space>
                                                        <Text type="secondary">
                                                            <UserOutlined /> {discussion.createdBy?.firstName} {discussion.createdBy?.lastName}
                                                        </Text>
                                                        <Text type="secondary">
                                                            {moment(discussion.createdAt).format("DD MMMM YYYY à HH:mm")}
                                                        </Text>
                                                        <Text type="secondary">
                                                            <MessageOutlined /> {discussion._count?.comments || 0} commentaire(s)
                                                        </Text>
                                                    </Space>
                                                </div>
                                                {expandedDiscussionId === discussion.id && (
                                                    <div style={{ marginTop: "16px" }}>
                                                        <List
                                                            dataSource={comments[discussion.id] || []}
                                                            renderItem={(comment) => (
                                                                <List.Item key={comment.id}>
                                                                    
                                                                    <CommentComponent
                                                                        comment={comment}
                                                                        author={<Text strong>{comment.createdBy.firstName} {comment.createdBy.lastName}</Text>}
                                                                        avatar={<Avatar icon={<UserOutlined />} />}
                                                                        content={<Text>{comment.content}</Text>}
                                                                        datetime={
                                                                            <Tooltip title={moment(comment.createdAt).format("DD MMMM YYYY à HH:mm")}>
                                                                                <Text type="secondary">{moment(comment.createdAt).fromNow()}</Text>
                                                                            </Tooltip>
                                                                        }
                                                                    />
                                                                </List.Item>
                                                            )}
                                                        />
                                                        <Form form={commentForm} onFinish={() => handleAddComment(discussion.id)}>
                                                            <Form.Item name="comment" rules={[{ required: true, message: "Veuillez entrer un commentaire" }]}>
                                                                <TextArea rows={3} placeholder="Ajouter un commentaire..." />
                                                            </Form.Item>
                                                            <Form.Item>
                                                                <Button
                                                                    type="primary"
                                                                    htmlType="submit"
                                                                    icon={<SendOutlined />}
                                                                    loading={commentLoading[discussion.id]}
                                                                >
                                                                    Publier
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    </div>
                                                )}
                                            </Space>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Spin>
                </Card>
            </div>
        </div>
    );
};


export default ThemeView;
