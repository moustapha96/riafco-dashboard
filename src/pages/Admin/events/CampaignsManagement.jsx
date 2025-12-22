
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import campaignsService from "../../../services/campaignsService";
import newsService from "../../../services/newsService";
import { toast } from "sonner";
import {
    Table, Tag, Space, Button, Modal, Form, Input, DatePicker,
    message, Typography, Card, Spin, Select
} from "antd";
import { useAuth } from "../../../hooks/useAuth";

const { Title } = Typography;
const { Option } = Select;

export default function CampaignsManagement() {
    const { user } = useAuth();
    const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    const [campaigns, setCampaigns] = useState([]);
    const [newsOptions, setNewsOptions] = useState([]);
    const [selectedNewsId, setSelectedNewsId] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [loading, setLoading] = useState(false);

    // Charge la liste des news (pour filtrer + formulaire)
    const fetchNews = async () => {
        try {
            const res = await newsService.getAll({ status: "PUBLISHED", limit: 100 });
            const list = (res.news || []).map(n => ({
                id: n.id,
                title: n.title_fr || n.title_en || "(Sans titre)",
            }));
            setNewsOptions(list);
        } catch (e) {
            console.error(e);
            setNewsOptions([]);
        }
    };

    // Charge campagnes (globalement ou par news si filtrée)
    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const res = selectedNewsId
                ? await campaignsService.getByNews(selectedNewsId)
                : await campaignsService.getAll();
            setCampaigns(res.campaigns || []);
        } catch (error) {
            console.error("Erreur chargement campagnes:", error);
            message.error("Erreur lors du chargement des campagnes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        fetchNews();
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [selectedNewsId]);


    const handleCloseModal = () => {
        setModalVisible(false);
        setEditingCampaign(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                newsId: values.newsId,
                subject: values.subject,
                content: values.content,
                htmlContent: values.htmlContent || null,
                scheduledAt: values.scheduledAt ? values.scheduledAt.toISOString() : null,
                status: values.status || "DRAFT",
            };

            if (!payload.newsId) {
                message.warning("Veuillez sélectionner l'actualité liée");
                return;
            }

            if (editingCampaign?.id) {
                await campaignsService.update(editingCampaign.id, payload);
                toast.success("Campagne mise à jour avec succès");
            } else {
                await campaignsService.create(payload);
                toast.success("Campagne créée avec succès");
            }

            handleCloseModal();
            fetchCampaigns();
        } catch (error) {
            console.error("Erreur sauvegarde campagne:", error);
            toast.error("Erreur lors de la sauvegarde de la campagne");
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        try {
            await campaignsService.remove(campaignId);
            toast.success("Campagne supprimée avec succès");
            fetchCampaigns();
        } catch (error) {
            console.error("Erreur suppression campagne:", error);
            toast.error("Erreur lors de la suppression de la campagne");
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "SENT": return "green";
            case "SCHEDULED": return "orange";
            case "DRAFT": return "blue";
            default: return "default";
        }
    };

    const statusLabel = (s) =>
        s === "SENT" ? "Envoyée" : s === "SCHEDULED" ? "Planifiée" : s === "DRAFT" ? "Brouillon" : s;

    const columns = [
        { title: "Sujet", dataIndex: "subject", key: "subject", render: (t) => <strong>{t}</strong> },
        {
            title: "Actualité liée",
            key: "news",
            render: (_, r) => r.news?.title_fr || r.news?.title_en || "—",
        },
       
        {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (s) => <Tag color={statusColor(s)}>{statusLabel(s)}</Tag>,
        },
        {
            title: "Envoyé le",
            dataIndex: "sentAt",
            key: "sentAt",
            render: (d) => (d ? dayjs(d).format("YYYY-MM-DD HH:mm") : "Non envoyé"),
        },
        { title: "Destinataires", dataIndex: "recipientCount", key: "recipientCount" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    {canDelete && (
                        <Button type="dashed" danger size="small" onClick={() => handleDeleteCampaign(record.id)}>Supprimer</Button>
                    )}
                </Space>
            ),
        },
    ];


    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <Title level={3}>Gestion des Campagnes</Title>

                    <Space>
                        {/* Filtre par actualité */}
                        <Select
                            allowClear
                            placeholder="Filtrer par actualité"
                            style={{ minWidth: 260 }}
                            value={selectedNewsId || undefined}
                            onChange={(v) => setSelectedNewsId(v || null)}
                            showSearch
                            optionFilterProp="children"
                        >
                            {newsOptions.map((n) => (
                                <Option key={n.id} value={n.id}>{n.title}</Option>
                            ))}
                        </Select>

                    </Space>
                </div>

                {loading && 
                    <div className="flex items-center justify-center min-h-screen">
                        <Spin size="large" />
                    </div>}
               
                {!loading && (
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={campaigns}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    </Card>
                )}

                <Modal
                    title={editingCampaign ? "Modifier la Campagne" : "Ajouter une Campagne"}
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={700}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Actualité liée"
                            name="newsId"
                            rules={[{ required: true, message: "Veuillez sélectionner l'actualité liée" }]}
                        >
                            <Select showSearch placeholder="Choisir une actualité publiée" optionFilterProp="children">
                                {newsOptions.map((n) => (
                                    <Option key={n.id} value={n.id}>{n.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Sujet"
                            name="subject"
                            rules={[{ required: true, message: "Le sujet est requis" }]}
                        >
                            <Input placeholder="Sujet de la campagne" />
                        </Form.Item>

                        <Form.Item
                            label="Contenu (texte)"
                            name="content"
                            rules={[{ required: true, message: "Le contenu est requis" }]}
                        >
                            <Input.TextArea rows={6} placeholder="Contenu texte (visible sur clients mail basiques)" />
                        </Form.Item>

                        <Form.Item label="Contenu HTML (optionnel)" name="htmlContent">
                            <Input.TextArea rows={6} placeholder="<h1>Votre contenu HTML</h1>" />
                        </Form.Item>

                        <Form.Item label="Planifier pour" name="scheduledAt">
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item
                            label="Statut"
                            name="status"
                            rules={[{ required: true, message: "Le statut est requis" }]}
                            initialValue="DRAFT"
                        >
                            <Select
                                options={[
                                    { value: "DRAFT", label: "Brouillon" },
                                    { value: "SCHEDULED", label: "Planifiée" },
                                    { value: "SENT", label: "Envoyée" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editingCampaign ? "Mettre à Jour" : "Créer"}
                                </Button>
                                <Button onClick={handleCloseModal}>Annuler</Button>
                                {editingCampaign && canDelete && (
                                    <Button danger onClick={() => handleDeleteCampaign(editingCampaign.id)}>
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
