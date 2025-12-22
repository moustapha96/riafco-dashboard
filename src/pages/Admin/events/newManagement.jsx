import { useState, useEffect, useRef } from "react";
import moment from "moment";
import eventService from "../../../services/eventService";
import { PiPlusDuotone } from "react-icons/pi";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Table, Tag, Space, Button, Modal, Form, Input, DatePicker, message, Typography, Card, Spin, Switch, InputNumber, Breadcrumb } from "antd";
import { BiCalendar } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function EventManagement() {
    const { user } = useAuth();
    const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    const [events, setEvents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Charger les événements depuis l'API
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getAll();
            console.log(response);
            setEvents(response.events);
            console.log(response.events);
        } catch (error) {
            console.error("Erreur lors du chargement des événements:", error);
            message.error("Erreur lors du chargement des événements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        fetchEvents();
    }, []);


    const handleOpenModal = (event = null) => {
        console.log(event)
        setEditingEvent(event);
        if (event) {
            // Cas d’un événement existant
            form.setFieldsValue({
                title: event.title,
                description: event.description,
                location: event.location,
                isVirtual: event.isVirtual,
                registrationLink: event.registrationLink,
                dateRange: [moment(event.start), moment(event.end)],
            });
        } else if (event && event.start) {
            form.setFieldsValue({
                dateRange: [moment(event.start), moment(event.end || event.start)],
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
            const [startDate, endDate] = values.dateRange;
            const eventData = {
                title: values.title,
                description: values.description,
                startDate: startDate.toISOString(),
                endDate: endDate ? endDate.toISOString() : null,
                location: values.location,
                isVirtual: values.isVirtual,
                registrationLink: values.registrationLink,
                status: "PUBLISHED",
                maxAttendees: values.maxAttendees
            };
            console.log(eventData)
            if (editingEvent && editingEvent.id) {
                // Mettre à jour un événement existant
                await eventService.update(editingEvent.id, eventData);
                toast.success("Événement mis à jour avec succès");
            } else {
                // Créer un nouvel événement
                await eventService.create(eventData);
                toast.success("Événement créé avec succès");
            }

            setModalVisible(false);
            fetchEvents(); // Rafraîchir la liste des événements
        } catch (error) {
            console.log(error)
            console.error("Erreur lors de la sauvegarde de l'événement:", error);
            toast.error("Erreur lors de la sauvegarde de l'événement");
            toast.error(error.message)
        }
    };

    // Supprimer un événement
    const handleDeleteEvent = async (eventId) => {
        try {
            await eventService.delete(eventId);
            toast.success("Événement supprimé avec succès");
            fetchEvents(); // Rafraîchir la liste des événements
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement:", error);
            toast.error("Erreur lors de la suppression de l'événement");
        }
    };



    const columns = [
        {
            title: "Titre",
            dataIndex: "title",
            key: "title",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Date de début",
            dataIndex: "startDate",
            key: "startDate",
            render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Date de fin",
            dataIndex: "endDate",
            key: "endDate",
            render: (date) => date ? moment(date).format("YYYY-MM-DD HH:mm") : "N/A",
        },
        {
            title: "Lieu",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Virtuel",
            dataIndex: "isVirtual",
            key: "isVirtual",
            render: (isVirtual) => (
                <Tag color={isVirtual ? "green" : "red"}>
                    {isVirtual ? "Oui" : "Non"}
                </Tag>
            ),
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
                    {canDelete && (
                        <Button
                            type="dashed"
                            danger
                            size="small"
                            onClick={() => handleDeleteEvent(record.id)}
                        >
                            Supprimer
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return <>



        <div className="container-fluid relative px-3">
            <div className="layout-specing" style={{
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
                paddingRight: "8px"
            }}>

                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Calendrier des Événements</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Evenements" },
                        ]}
                    />
                </div>


                <div className="md:flex justify-between items-center mb-6">
                    <Space>
                        <Button
                            type="primary"

                            onClick={() => navigate("/admin/calendar")}
                            icon={<BiCalendar />}
                        >
                            Calendrier
                        </Button>
                    </Space>


                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleOpenModal()}
                            icon={<PiPlusDuotone />}
                        >
                            Ajouter un Événement
                        </Button>
                    </Space>


                </div>

                {loading && <Spin size="large" />}

                {!loading && (
                    <Card>
                        {/* <Space style={{ marginBottom: 16 }}>
                            <Button
                                type="primary"
                                onClick={() => handleOpenModal()}
                                icon={<PiPlusDuotone />}
                            >
                                Ajouter un Événement
                            </Button>
                        </Space> */}

                        <Table
                            columns={columns}
                            dataSource={events}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </Card>
                )}



                <Modal
                    title={editingEvent ? "Modifier l'Événement" : "Ajouter un Événement"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Titre"
                            name="title"
                            rules={[{ required: true, message: "Le titre est requis" }]}
                        >
                            <Input placeholder="Titre de l'événement" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea rows={4} placeholder="Description de l'événement" />
                        </Form.Item>

                        <Form.Item
                            label="Date et Heure"
                            name="dateRange"
                            rules={[{ required: true, message: "La date est requise" }]}
                        >
                            <RangePicker
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>






                        <Form.Item label="Lieu" name="location">
                            <Input placeholder="Lieu de l'événement" />
                        </Form.Item>

                        <Form.Item
                            label="Événement Virtuel"
                            name="isVirtual"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        {form.getFieldValue("isVirtual") && <>
                            {/* maxAttendees */}
                            <Form.Item label="Nombre Maximum de Participants" name="maxAttendees">
                                <InputNumber min={1} placeholder="Nombre maximum de participants" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item label="Lien d'Inscription" name="registrationLink">
                                <Input placeholder="Lien pour s'inscrire" />
                            </Form.Item>

                        </>
                        }

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editingEvent ? "Mettre à Jour" : "Créer"}
                                </Button>
                                <Button onClick={() => setModalVisible(false)}>
                                    Annuler
                                </Button>
                                {editingEvent && canDelete && (
                                    <Button
                                        danger
                                        onClick={() => handleDeleteEvent(editingEvent.id)}
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



    </>;
}
