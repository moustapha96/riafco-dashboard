import { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "sonner";
import { Table, Tag, Space, Button, Modal, Form, Input, message, Typography, Card, Spin, Breadcrumb, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import newsletterService from "../../../services/newsletterService";
import { Option } from "antd/es/mentions";

const { Text } = Typography;

export default function NewsletterSubscribersManagement() {
    const [subscribers, setSubscribers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingSubscriber, setEditingSubscriber] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Charger les abonnés depuis l'API
    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await newsletterService.getAll();
            console.log(response)
            setSubscribers(response.newsletters);
        } catch (error) {
            console.error("Erreur lors du chargement des abonnés:", error);
            message.error("Erreur lors du chargement des abonnés");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        fetchSubscribers();
    }, []);

    const handleOpenModal = (subscriber = null) => {
        setEditingSubscriber(subscriber);
        if (subscriber) {
            form.setFieldsValue({
                email: subscriber.email,
                firstName: subscriber.firstName || "",
                lastName: subscriber.lastName || "",
            });
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Soumettre le formulaire
    const handleSubmit = async (values) => {
        console.log(values)
        try {
            const subscriberData = {
                email: values.email,
                firstName: values.firstName || null,
                lastName: values.lastName || null,
                status: values.status || "ACTIVE",
            };

            if (editingSubscriber?.id) {
                await newsletterService.update(editingSubscriber.id, subscriberData);
                toast.success("Abonné mis à jour avec succès");
            } else {
                await newsletterService.createSubscriber(subscriberData);
                toast.success("Abonné ajouté avec succès");
            }
            setModalVisible(false);
            fetchSubscribers();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de l'abonné:", error);
            toast.error("Erreur lors de la sauvegarde de l'abonné");
        }
    };

    // Supprimer un abonné
    const handleDeleteSubscriber = async (subscriberId) => {
        try {
            await newsletterService.deleteSubscriber(subscriberId);
            toast.success("Abonné supprimé avec succès");
            fetchSubscribers();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'abonné:", error);
            toast.error("Erreur lors de la suppression de l'abonné");
        }
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => <Text copyable>{email}</Text>,
        },
        {
            title: "Prénom",
            dataIndex: "firstName",
            key: "firstName",
            render: (firstName) => firstName || <Tag color="default">Non renseigné</Tag>,
        },
        {
            title: "Nom",
            dataIndex: "lastName",
            key: "lastName",
            render: (lastName) => lastName || <Tag color="default">Non renseigné</Tag>,
        },
        {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "ACTIVE" ? "green" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Date d'inscription",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleOpenModal(record)}
                    >
                        Modifier
                    </Button>
                    <Button
                        type="dashed"
                        danger
                        size="small"
                        onClick={() => handleDeleteSubscriber(record.id)}
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        Gestion des Abonnés à la Newsletter
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: "Gestion des Abonnés à la Newsletter" },
                        ]}
                    />
                </div>
                {/* <div className="md:flex md:justify-end justify-end items-center mb-6">
                   
                    <Button
                        type="primary"
                        onClick={() => handleOpenModal()}
                        icon={<PiUserPlusDuotone />}
                    >
                        Ajouter un Abonné
                    </Button>
                </div> */}

                {loading && <>
                    <div className="flex items-center justify-center min-h-screen">
                        <Spin size="large" />
                    </div>
                   
                </>}
                {!loading && (
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={subscribers}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </Card>
                )}

                <Modal
                    title={editingSubscriber ? "Modifier l'Abonné" : "Ajouter un Abonné"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={500}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "L'email est requis" },
                                { type: "email", message: "Format d'email invalide" },
                            ]}
                        >
                            <Input placeholder="Email de l'abonné" />
                        </Form.Item>
                        <Form.Item
                            label="Prénom"
                            name="firstName"
                        >
                            <Input placeholder="Prénom (optionnel)" />
                        </Form.Item>
                        <Form.Item
                            label="Nom"
                            name="lastName"
                        >
                            <Input placeholder="Nom (optionnel)" />
                        </Form.Item>


                        <Form.Item
                            label="Statut"
                            name="status"
                            rules={[{ required: true, message: "Le statut est requis" }]}
                        >
                            <Select placeholder="Sélectionnez un statut">
                                <Option value="ACTIVE">ACTIF</Option>
                                <Option value="UNSUBSCRIBED">UNSUBSCRIBED</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editingSubscriber ? "Mettre à Jour" : "Ajouter"}
                                </Button>
                                <Button onClick={() => setModalVisible(false)}>
                                    Annuler
                                </Button>
                                {editingSubscriber && (
                                    <Button
                                        danger
                                        onClick={() => handleDeleteSubscriber(editingSubscriber.id)}
                                    >
                                        Supprimer
                                    </Button>
                                )}
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
