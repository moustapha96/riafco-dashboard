import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Modal, message, Typography, Card, Spin, Breadcrumb, Descriptions, Tag } from "antd";


import moment from "moment";
import eventService from "../../../services/eventService";
import { Link } from "react-router-dom";


const { Text } = Typography;

export default function CalendarManagement() {
    const [events, setEvents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
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

    // Ouvrir le modal pour afficher les détails d'un événement
    const handleOpenModal = (event) => {
        if (event && event.extendedProps) {
            setSelectedEvent({
                title: event.title,
                description: event.extendedProps.description,
                location: event.extendedProps.location,
                isVirtual: event.extendedProps.isVirtual,
                registrationLink: event.extendedProps.registrationLink,
                startDate: event.start,
                endDate: event.end,
            });
            setModalVisible(true);
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
        editable: false, 
        selectable: false, 
        dayMaxEvents: true, 
        events: events,
        eventClick: (info) => {
            const event = info.event;
            console.log("Événement cliqué :", event);
            handleOpenModal(event);
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

                {loading && (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Spin size="large" />
                    </div>
                )}
                {!loading && (
                    <Card>
                        <FullCalendar ref={calendarRef} {...calendarConfig} />
                    </Card>
                )}


                <Modal
                    title="Détails de l'Événement"
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setSelectedEvent(null);
                    }}
                    footer={null}
                    width={600}
                >
                    {selectedEvent && (
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Titre">
                                <Text strong>{selectedEvent.title}</Text>
                            </Descriptions.Item>
                            
                            {selectedEvent.description && (
                                <Descriptions.Item label="Description">
                                    <Text>{selectedEvent.description}</Text>
                                </Descriptions.Item>
                            )}
                            
                            <Descriptions.Item label="Date de début">
                                <Text>
                                    {moment(selectedEvent.startDate).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </Descriptions.Item>
                            
                            {selectedEvent.endDate && (
                                <Descriptions.Item label="Date de fin">
                                    <Text>
                                        {moment(selectedEvent.endDate).format("DD/MM/YYYY HH:mm")}
                                    </Text>
                                </Descriptions.Item>
                            )}
                            
                            {selectedEvent.location && (
                                <Descriptions.Item label="Lieu">
                                    <Text>{selectedEvent.location}</Text>
                                </Descriptions.Item>
                            )}
                            
                            <Descriptions.Item label="Type">
                                <Tag color={selectedEvent.isVirtual ? "blue" : "green"}>
                                    {selectedEvent.isVirtual ? "Virtuel" : "Présentiel"}
                                </Tag>
                            </Descriptions.Item>
                            
                            {selectedEvent.registrationLink && (
                                <Descriptions.Item label="Lien d'inscription">
                                    <a 
                                        href={selectedEvent.registrationLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {selectedEvent.registrationLink}
                                    </a>
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    )}
                </Modal>
            </div>
        </div>
    );
}
