"use client"

import { useState, useEffect } from "react"
import {
    Table,
    Card,
    Tag,
    Button,
    Modal,
    Input,
    Select,
    Space,
    message,
    Descriptions,
    Typography,
    Row,
    Col,
    Pagination,
    Tooltip,
    Popconfirm,
    Breadcrumb,
} from "antd"
import { EyeOutlined, MessageOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons"

import moment from "moment"
import contactService from "../../../services/contactService"
import { Link } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

const ContactManagement = () => {
    const { user } = useAuth()

    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedContact, setSelectedContact] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [responseVisible, setResponseVisible] = useState(false)
    const [responseText, setResponseText] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [sending, setSending] = useState(false);

    // Charger les contacts
    const loadContacts = async (page = 1, status = "") => {
        setLoading(true)
        try {
            const params = {
                page,
                limit: pagination.pageSize,
                ...(status && { status }),
            }
            const response = await contactService.getAll(params)
            setContacts(response.data)
            setPagination((prev) => ({
                ...prev,
                current: response.pagination.page,
                total: response.pagination.total,
            }))
        } catch (error) {
            message.error("Erreur lors du chargement des contacts")
            console.error("Erreur:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadContacts()
    }, [])

    // Gérer le changement de statut
    const handleStatusChange = async (contactId, newStatus) => {
        try {
            await contactService.updateStatus(contactId, newStatus)
            message.success("Statut mis à jour avec succès")
            loadContacts(pagination.current, statusFilter)
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut")
            console.error("Erreur:", error)
        }
    }

    // Répondre à un contact
    const handleResponse = async () => {
        setLoading(true)
        if (!responseText.trim()) {
            message.warning("Veuillez saisir une réponse")
            return
        }
        console.log(selectedContact)
        try {
            await contactService.respond(selectedContact.id,responseText)
            message.success("Réponse envoyée avec succès")
            setResponseVisible(false)
            setResponseText("")
            setSelectedContact(null)
            loadContacts(pagination.current, statusFilter)
        } catch (error) {
            message.error("Erreur lors de l'envoi de la réponse")
            console.error("Erreur:", error)
        }finally{
            setLoading(false)
        }
    }

    // Supprimer un contact
    const handleDelete = async (contactId) => {
        try {
            await contactService.delete(contactId)
            message.success("Contact supprimé avec succès")
            loadContacts(pagination.current, statusFilter)
        } catch (error) {
            message.error("Erreur lors de la suppression")
            console.error("Erreur:", error)
        }
    }

    // Filtrer par statut
    const handleStatusFilter = (status) => {
        console.log(status)
        setStatusFilter(status)
        loadContacts(1, status)
    }

    // Colonnes du tableau
    const columns = [
        {
            title: "Nom",
            dataIndex: "name",
            key: "name",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => <Text copyable>{email}</Text>,
        },
        {
            title: "Sujet",
            dataIndex: "subject",
            key: "subject",
            ellipsis: true,
        },
        {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusConfig = {
                    PENDING: { color: "orange", text: "En attente" },
                    IN_PROGRESS: { color: "blue", text: "En cours" },
                    RESOLVED: { color: "green", text: "Résolu" },
                    CLOSED: { color: "gray", text: "Fermé" },
                }
                const config = statusConfig[status] || { color: "default", text: status }
                return <Tag color={config.color}>{config.text}</Tag>
            },
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Voir les détails">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedContact(record)
                                setDetailsVisible(true)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Répondre">
                        <Button
                            type="text"
                            icon={<MessageOutlined />}
                            onClick={() => {
                                setSelectedContact(record)
                                setResponseVisible(true)
                            }}
                        />
                    </Tooltip>
                    <Select
                        value={record.status}
                        style={{ width: 120 }}
                        onChange={(value) => handleStatusChange(record.id, value)}
                        size="small"
                    >
                        <Option value="PENDING">En attente</Option>
                        <Option value="IN_PROGRESS">En cours</Option>
                        <Option value="RESOLVED">Résolu</Option>
                        <Option value="CLOSED">Fermé</Option>
                    </Select>
                    {user && user.role === "SUPER_ADMIN" && (
                        <Popconfirm
                            title="Êtes-vous sûr de vouloir supprimer ce contact ?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Oui"
                            cancelText="Non"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                   
                </Space>
            ),
        },
    ]

    return <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion de À propos</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: "Contacts" },
                        ]}
                    />
                </div>

                <div style={{ padding: "24px" }}>
                    <Card>
                        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                            <Col>
                                <Title level={2} style={{ margin: 0 }}>
                                    Gestion des Contacts
                                </Title>
                            </Col>
                            <Col>
                                <Space>
                                    <Select
                                        placeholder="Filtrer par statut"
                                        style={{ width: 150 }}
                                        allowClear
                                        value={statusFilter}
                                        onChange={handleStatusFilter}
                                        suffixIcon={<FilterOutlined />}
                                    >
                                        <Option value="PENDING">En attente</Option>
                                        <Option value="IN_PROGRESS">En cours</Option>
                                        <Option value="RESOLVED">Résolu</Option>
                                        <Option value="CLOSED">Fermé</Option>
                                    </Select>
                                    <Button
                                        icon={<ReloadOutlined />}
                                        onClick={() => loadContacts(pagination.current, statusFilter)}
                                        loading={loading}
                                    >
                                        Actualiser
                                    </Button>
                                </Space>
                            </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={contacts}
                            rowKey="id"
                            loading={loading}
                            pagination={false}
                            scroll={{ x: 800 }}
                        />

                        <div style={{ marginTop: "16px", textAlign: "right" }}>
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={(page) => loadContacts(page, statusFilter)}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total} contacts`}
                            />
                        </div>
                    </Card>

                    {/* Modal des détails */}
                    <Modal
                        title="Détails du Contact"
                        open={detailsVisible}
                        onCancel={() => {
                            setDetailsVisible(false)
                            setSelectedContact(null)
                        }}
                        footer={[
                            <Button key="close" onClick={() => setDetailsVisible(false)}>
                                Fermer
                            </Button>,
                        ]}
                        width={600}
                    >
                        {selectedContact && (
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Nom">{selectedContact.name}</Descriptions.Item>
                                <Descriptions.Item label="Email">{selectedContact.email}</Descriptions.Item>
                                <Descriptions.Item label="Sujet">{selectedContact.subject}</Descriptions.Item>
                                <Descriptions.Item label="Message">
                                    <div style={{ whiteSpace: "pre-wrap" }}>{selectedContact.message}</div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Statut">
                                    <Tag
                                        color={
                                            selectedContact.status === "PENDING"
                                                ? "orange"
                                                : selectedContact.status === "IN_PROGRESS"
                                                    ? "blue"
                                                    : selectedContact.status === "RESOLVED"
                                                        ? "green"
                                                        : "gray"
                                        }
                                    >
                                        {selectedContact.status === "PENDING"
                                            ? "En attente"
                                            : selectedContact.status === "IN_PROGRESS"
                                                ? "En cours"
                                                : selectedContact.status === "RESOLVED"
                                                    ? "Résolu"
                                                    : "Fermé"}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Date de création">
                                    {moment(selectedContact.createdAt).format("DD/MM/YYYY à HH:mm")}
                                </Descriptions.Item>
                                {selectedContact.response && (
                                    <>
                                        <Descriptions.Item label="Réponse">
                                            <div style={{ whiteSpace: "pre-wrap" }}>{selectedContact.response}</div>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Répondu le">
                                            {moment(selectedContact.respondedAt).format("DD/MM/YYYY à HH:mm")}
                                        </Descriptions.Item>
                                    </>
                                )}
                            </Descriptions>
                        )}
                    </Modal>

                    {/* Modal de réponse */}
                    <Modal
                        title="Répondre au Contact"
                        open={responseVisible}
                        onOk={handleResponse}
                        onCancel={() => {
                            setResponseVisible(false)
                            setResponseText("")
                            setSelectedContact(null)
                        }}
                        okText="Envoyer"
                        confirmLoading={loading}
                        okButtonProps={{ disabled: !responseText.trim() }}
                        cancelText="Annuler"
                        width={600}
                    >
                        {selectedContact && (
                            <div style={{ marginBottom: "16px" }}>
                                <Text strong>Contact: </Text>
                                <Text>
                                    {selectedContact.name} ({selectedContact.email})
                                </Text>
                                <br />
                                <Text strong>Sujet: </Text>
                                <Text>{selectedContact.subject}</Text>
                            </div>
                        )}
                        <TextArea
                            rows={6}
                            placeholder="Saisissez votre réponse..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                        />
                    </Modal>
                </div>
            </div>
        </div>
    </>

}

export default ContactManagement

