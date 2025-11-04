/* eslint-disable react/no-unescaped-entities */
import  { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Card, Descriptions, Avatar, Statistic, Row, Col, Divider, Tag, Space, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EditFilled } from "@ant-design/icons";
import userService from "../../../services/userService";


const AdminUserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        fetchUserDetails(id);
    }, [id]);

    const fetchUserDetails = async (userId) => {
        setLoading(true);
        try {
            const response = await userService.getById(userId);
            setUser(response.user);
            console.log(response.user);
            console.log("Détails de l'utilisateur récupérés :", response.user);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (!user) return <div>Utilisateur non trouvé.</div>;

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Détails de l'utilisateur</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/admin/users">Liste des utilisateurs</Link> },
                            { title: `${user.firstName} ${user.lastName}` },
                        ]}
                    />
                </div>
                <div className="md:flex md:justify-end justify-end items-center mb-6">
                    <Button
                        type="primary"
                        onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                        icon={<EditFilled />}
                    >
                        Modifier
                    </Button>
                </div>

                <Card>
                    <Descriptions title="Informations personnelles"   bordered>
                        <Descriptions.Item label="Nom complet" span={2}>
                            <Avatar size="large" icon={<UserOutlined />} src={user.profilePic} />
                            <span className="ml-3">{user.firstName} {user.lastName}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <Link to={`mailto:${user.email}`}>
                                <MailOutlined /> {user.email}
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item label="Téléphone">
                            {user.phone ? <Link to={`tel:${user.phone}`}><PhoneOutlined /> {user.phone}</Link> : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Rôle">
                            <Tag color={user.role === "ADMIN" ?
                                "red" : user.role === "MEMBER" ?
                                    "red" : user.role === "GUEST" ?
                                        "blue" : "green"}>
                                
                                {user.role}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Statut">
                            <Tag color={user.status === "ACTIVE" ? "green" : "red"}>
                                {user.status}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Dernière connexion">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Jamais"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Créé le">
                            {new Date(user.createdAt).toLocaleString()}
                        </Descriptions.Item>
                    </Descriptions>

                    <h3 className="text-lg font-semibold mb-4">Permissions</h3>
                    <Space wrap>
                        {user.permissions && user.permissions.length > 0 ? (
                            user.permissions.map((permission) => (
                                <Tag key={permission} color="blue">
                                    {/* {permissionLabels[permission] || permission} */}
                                    {permission.name}
                                </Tag>
                            ))
                        ) : (
                            <Tag color="gray">Aucune permission</Tag>
                        )}
                    </Space>
                    <Divider />

                    <h3 className="text-lg font-semibold mb-4">Statistiques d'activité</h3>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Statistic title="Activités" value={user._count.activities} />
                        </Col>
                        <Col span={6}>
                            <Statistic title="Événements" value={user._count.events} />
                        </Col>
                        <Col span={6}>
                            <Statistic title="Actualités" value={user._count.news} />
                        </Col>
                        <Col span={6}>
                            <Statistic title="Ressources" value={user._count.resources} />
                        </Col>
                    </Row>

                    <Divider />

                </Card>
            </div>
        </div>
    );
};

export default AdminUserDetail;