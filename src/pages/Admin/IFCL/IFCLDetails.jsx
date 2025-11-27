
/* eslint-disable react/no-unescaped-entities */
"use client"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    Card,
    Descriptions,
    Tag,
    Button,
    Space,
    Breadcrumb,
    Avatar,
    List,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
} from "antd"
import { EditOutlined, PlusOutlined, GlobalOutlined, EnvironmentOutlined } from "@ant-design/icons"
import ifclService from "../../../services/ifclService"
import { toast } from "sonner"
import { buildImageUrl } from "../../../utils/imageUtils"
const { TextArea } = Input

const IFCLDetailsAdmin = () => {
    const { id } = useParams()
    const [memberCountry, setMemberCountry] = useState(null)
    const [criteria, setCriteria] = useState([])
    const [loading, setLoading] = useState(true)
    const [criteriaLoading, setCriteriaLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingCriterion, setEditingCriterion] = useState(null)
    const [form] = Form.useForm()

    useEffect(() => {
        fetchMemberCountryDetails()
        fetchCriteria()
    }, [id])

    const fetchMemberCountryDetails = async () => {
        setLoading(true)
        try {
            const response = await ifclService.getById(id)
            console.log(response)
            setMemberCountry(response.country || response)
        } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error)
            message.error("Erreur lors du chargement des détails")
        } finally {
            setLoading(false)
        }
    }

    const fetchCriteria = async () => {
        setCriteriaLoading(true)
        try {
            const response = await ifclService.getCriteria(id)
            setCriteria(response.criteria || response.data || [])
        } catch (error) {
            console.error("Erreur lors de la récupération des critères:", error)
        } finally {
            setCriteriaLoading(false)
        }
    }

    const handleAddCriterion = () => {
        setEditingCriterion(null)
        form.resetFields()
        setModalVisible(true)
    }

    const handleEditCriterion = (criterion) => {
        console.log(criterion)
        setEditingCriterion(criterion)
        form.setFieldsValue({
            name: criterion.name,
            description: criterion.description,
        })
        setModalVisible(true)
    }

    const handleSaveCriterion = async (values) => {
        console.log(values)
        try {
            if (editingCriterion) {
                await ifclService.updateCriterion(editingCriterion.id, values)
                toast.success("Critère modifié avec succès")
            } else {
                await ifclService.addCriterion(id, values)
                toast.success("Critère ajouté avec succès")
            }
            setModalVisible(false)
            fetchCriteria()
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error.message)
            toast.error(error.message || "Erreur lors de la sauvegarde")
        }
    }

    const handleDeleteCriterion = async (criterionId) => {
        try {
            await ifclService.deleteCriterion(criterionId)
            toast.success("Critère supprimé avec succès")
            fetchCriteria()
        } catch (error) {
            console.error("Erreur lors de la suppression:", error.message)
            toast.error(error.message || "Erreur lors de la suppression")
        }
    }

    if (loading) {
        return <div>Chargement...</div>
    }

    if (!memberCountry) {
        return <div>Pays membre non trouvé</div>
    }

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Détails du pays membre</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/admin">Dashboard</Link> },
                            { title: <Link to="/admin/ifcl">Gestion des Pays membres</Link> },
                            { title: <Link to="/admin/ifcl/maps">Cartes</Link> },
                            { title: "Détails" },
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations principales */}
                    <div className="lg:col-span-2">
                        <Card
                            title={
                                <Space>
                                    <Avatar size="large" icon={<GlobalOutlined />} src={buildImageUrl(memberCountry.flag)} />
                                    <div>
                                        <div className="text-lg font-semibold">{memberCountry.name_fr}</div>
                                        {memberCountry.name_en && (
                                            <div className="text-sm text-gray-500">{memberCountry.name_en}</div>
                                        )}
                                    </div>
                                </Space>
                            }
                            extra={
                                <Button type="primary" icon={<EditOutlined />}>
                                    <Link to={`/admin/ifcl/${memberCountry.id}/edit`}>Modifier</Link>
                                </Button>
                            }
                        >
                            <Descriptions column={1} bordered>
                                {/* Nom officiel */}
                                <Descriptions.Item label="Nom officiel (FR)">
                                    {memberCountry.pays_fr}
                                </Descriptions.Item>
                                {memberCountry.pays_en && (
                                    <Descriptions.Item label="Nom officiel (EN)">
                                        {memberCountry.pays_en}
                                    </Descriptions.Item>
                                )}

                                {/* Statut */}
                                <Descriptions.Item label="Statut">
                                    <Tag color={memberCountry.status === "ACTIVE" ? "green" : "red"}>
                                        {memberCountry.status === "ACTIVE" ? "Actif" : "Inactif"}
                                    </Tag>
                                </Descriptions.Item>

                                {/* Coordonnées */}
                                {memberCountry.coordonnees && (
                                    <Descriptions.Item label="Coordonnées">
                                        <Space>
                                            <EnvironmentOutlined />
                                            {memberCountry.coordonnees}
                                        </Space>
                                    </Descriptions.Item>
                                )}

                                {/* Descriptions */}
                                {memberCountry.description_fr && (
                                    <Descriptions.Item label="Description (FR)">
                                        <div dangerouslySetInnerHTML={{ __html: memberCountry.description_fr }} />
                                    </Descriptions.Item>
                                )}
                                {memberCountry.description_en && (
                                    <Descriptions.Item label="Description (EN)">
                                        <div dangerouslySetInnerHTML={{ __html: memberCountry.description_en }} />
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>
                    </div>

                    {/* Critères */}
                    <div>
                        <Card
                            title="Descriptif"
                            extra={
                                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddCriterion}>
                                    Ajouter
                                </Button>
                            }
                        >
                            <List
                                loading={criteriaLoading}
                                dataSource={criteria}
                                renderItem={(criterion) => (
                                    <List.Item
                                        key={criterion.id}
                                        actions={[
                                            <Button key="edit" type="link" size="small" onClick={() => handleEditCriterion(criterion)}>
                                                Modifier
                                            </Button>,
                                            <Popconfirm
                                                key="delete"
                                                title="Supprimer ce critère ?"
                                                onConfirm={() => handleDeleteCriterion(criterion.id)}
                                            >
                                                <Button type="link" danger size="small">
                                                    Supprimer
                                                </Button>
                                            </Popconfirm>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={criterion.name || "Sans nom"}
                                            description={
                                                <div>
                                                    {criterion.description && (
                                                        <div dangerouslySetInnerHTML={{ __html: criterion.description }} />
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>
                </div>

                {/* Modal pour ajouter/modifier un critère */}
                <Modal
                    title={editingCriterion ? "Modifier la description" : "Ajouter une description"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleSaveCriterion}>
                        <Form.Item
                            name="name"
                            label="Nom"
                            rules={[{ required: true, message: "Le nom est requis" }]}
                        >
                            <Input placeholder="Nom du critère" />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <TextArea rows={3} placeholder="Description du critère" />
                        </Form.Item>

                        <Form.Item className="mb-0 text-right">
                            <Space>
                                <Button onClick={() => setModalVisible(false)}>Annuler</Button>
                                <Button type="primary" htmlType="submit">
                                    {editingCriterion ? "Modifier" : "Ajouter"}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default IFCLDetailsAdmin
