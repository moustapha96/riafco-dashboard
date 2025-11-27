import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Button, Modal, Form, Input, DatePicker, Switch, message, Typography, Space, Card, Spin, InputNumber, Breadcrumb } from "antd";


import moment from "moment";
import eventService from "../../../services/eventService";
import { PiPlusDuotone } from "react-icons/pi";
import { toast } from "sonner";
import { Link } from "react-router-dom";



const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function CalendarManagement() {
    const [events, setEvents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const calendarRef = useRef(null);

    // Charger les événements depuis l'API
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getAll();
            console.log(response);
            const formattedEvents = response.events.map((event) => ({
                id: event.id,
                title: event.title,
                start: event.startDate,
                end: event.endDate,
                extendedProps: {
                    description: event.description,
                    location: event.location,
                    isVirtual: event.isVirtual,
                    registrationLink: event.registrationLink,
                },
            }));
            setEvents(formattedEvents);
            console.log(formattedEvents);
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
        setEditingEvent(event);
        if (event && event.extendedProps) {
            // Cas d’un événement existant
            form.setFieldsValue({
                title: event.title,
                description: event.extendedProps.description,
                location: event.extendedProps.location,
                isVirtual: event.extendedProps.isVirtual,
                registrationLink: event.extendedProps.registrationLink,
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
            };
            console.log(eventData)
            if (editingEvent.id) {
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

    const calendarConfig = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        initialDate: new Date().toISOString().slice(0, 10),
        navLinks: true,
        editable: true, 
        selectable: true, 
        dayMaxEvents: true, 
        events: events,
        eventClick: (info) => {
            const event = info.event;
            console.log("Événement cliqué :", event);
            handleOpenModal(event);
        },
        dateClick: (info) => {
            handleOpenModal({
                start: info.dateStr,
                end: info.dateStr,
            });
        },
        height: "auto",
    };

    return (

        <div className="container-fluid relative px-3">
            <div className="layout-specing">

                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Calendrier des Événements</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: <Link to="/admin/events">Evenements</Link> },
                            { title: "Calendrier" },
                        ]}
                    />
                </div>

                <div className="md:flex justify-between items-center mb-6">

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

                {loading && <>
                    <Spin size="large" />
                </>}
                {events && <>
                <Card>
                    <FullCalendar ref={calendarRef} {...calendarConfig} />
                </Card>
                </>}


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
                                {editingEvent && (
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
    );
}
