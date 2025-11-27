"use client"

import { useState, useEffect } from "react"
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,
    Tag,
    Space,
    Avatar,
    Typography,
    Row,
    Col,
    Breadcrumb,
} from "antd"
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined,
    GlobalOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import partnerService from "../../../services/partnerService"
import moment from "moment"
import { toast } from "sonner"

const { Title, Text } = Typography
const { TextArea } = Input

const PartnerManagement = () => {
    const navigate = useNavigate()
    const [partners, setPartners] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingPartner, setEditingPartner] = useState(null)
    const [form] = Form.useForm()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })

    useEffect(() => {
        fetchPartners()
    }, [pagination.current, pagination.pageSize])

    const fetchPartners = async () => {
        setLoading(true)
        try {
            const response = await partnerService.getAll(pagination.current, pagination.pageSize)
            setPartners(response.data)
            setPagination((prev) => ({
                ...prev,
                total: response.pagination.total,
            }))
            console.log(response.data)
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors du chargement des partenaires")
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setEditingPartner(null)
        form.resetFields()
        setModalVisible(true)
    }

    const handleEdit = (partner) => {
        setEditingPartner(partner)
        form.setFieldsValue({
            name: partner.name,
            description: partner.description,
            country: partner.country,
            address: partner.address,
            email: partner.email,
            phone: partner.phone,
            website: partner.website,
        })
        setModalVisible(true)
    }

    const handleDelete = async (id) => {
        try {
            await partnerService.delete(id)
            toast.success("Partenaire supprimé avec succès")
            fetchPartners()
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la suppression")
        }
    }

    const handleSubmit = async (values) => {
        console.log(values)
        try {
            const formData = new FormData()
            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    if (key === "logo" && values[key]?.file) {
                        formData.append("logo", values[key].file)
                    } else if (key !== "logo") {
                        formData.append(key, values[key])
                    }
                }
            })

            if (editingPartner) {
                await partnerService.update(editingPartner.id, formData)
                toast.success("Partenaire modifié avec succès")
            } else {
                await partnerService.create(formData)
                toast.success("Partenaire créé avec succès")
            }

            setModalVisible(false)
            form.resetFields()
            fetchPartners()
        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la sauvegarde")
        }
    }

    const handleViewDetails = (partner) => {
        navigate(`/admin/partners/${partner.id}/details`)
    }

    const columns = [
        {
            title: "Logo",
            dataIndex: "logo",
            key: "logo",
            width: 80,
            render: (logo, record) => (
                <Avatar size={50} src={logo} style={{ backgroundColor: "#e28743" }}>
                    {record.name.charAt(0).toUpperCase()}

                </Avatar>
            ),
        },
        
        {
            title: "Nom",
            dataIndex: "name",
            key: "name",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Pays",
            dataIndex: "country",
            key: "country",
            render: (country) => <Tag color="blue">{country}</Tag>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => (
                <Space>
                    <MailOutlined />
                    <Text copyable>{email}</Text>
                </Space>
            ),
        },
        {
            title: "Téléphone",
            dataIndex: "phone",
            key: "phone",
            render: (phone) =>
                phone ? (
                    <Space>
                        <PhoneOutlined />
                        <Text copyable>{phone}</Text>
                    </Space>
                ) : (
                    <Text type="secondary">Non renseigné</Text>
                ),
        },
        {
            title: "Site Web",
            dataIndex: "website",
            key: "website",
            render: (website) =>
                website ? (
                    <Button type="link" icon={<GlobalOutlined />} href={website} target="_blank" size="small">
                        Visiter <br />
                    </Button>
                ) : (
                    <Text type="secondary">Non renseigné</Text>
                ),
        },
        {
            title: "Date de création",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button type="primary" icon={<EyeOutlined />} size="small" onClick={() => handleViewDetails(record)}>
                        Détails
                    </Button>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce partenaire ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const uploadProps = {
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
    }

    return <>
        <div className="container-fluid relative px-3">
            <div className="layout-specing"
                style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    paddingRight: "8px"
                }}>

                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        Gestion des Partenaires
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Gestion des Partenaires" },
                        ]}
                    />
                </div>

                <div style={{ padding: "24px" }}>
                    <Card>
                        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                            <Col>
                                <Title level={2}>Gestion des Partenaires</Title>
                            </Col>
                            <Col>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                                    Ajouter un Partenaire
                                </Button>
                            </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={partners}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                ...pagination,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} partenaires`,
                                onChange: (page, pageSize) => {
                                    setPagination((prev) => ({
                                        ...prev,
                                        current: page,
                                        pageSize,
                                    }))
                                },
                            }}
                            scroll={{ x: 1200 }}
                        />
                    </Card>

                    <Modal
                        title={editingPartner ? "Modifier le Partenaire" : "Ajouter un Partenaire"}
                        open={modalVisible}
                        onCancel={() => {
                            setModalVisible(false)
                            form.resetFields()
                        }}
                        footer={null}
                        width={800}
                    >
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Nom du Partenaire"
                                        rules={[{ required: true, message: "Le nom est requis" }]}
                                    >
                                        <Input placeholder="Nom du partenaire" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="country" label="Pays" rules={[{ required: true, message: "Le pays est requis" }]}>
                                        <Input placeholder="Pays" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "La description est requise" }]}
                            >
                                <TextArea rows={4} placeholder="Description du partenaire" />
                            </Form.Item>

                            <Form.Item name="address" label="Adresse">
                                <TextArea rows={2} placeholder="Adresse complète" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: "L'email est requis" },
                                            { type: "email", message: "Format d'email invalide" },
                                        ]}
                                    >
                                        <Input placeholder="email@exemple.com" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="phone" label="Téléphone">
                                        <Input placeholder="+33 1 23 45 67 89" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="website" label="Site Web" rules={[{ type: "url", message: "URL invalide" }]}>
                                        <Input placeholder="https://www.exemple.com" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="logo" label="Logo">
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />}>Sélectionner le logo</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: "24px", textAlign: "right" }}>
                                <Space>
                                    <Button onClick={() => setModalVisible(false)}>Annuler</Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingPartner ? "Modifier" : "Créer"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    </>

}

export default PartnerManagement
