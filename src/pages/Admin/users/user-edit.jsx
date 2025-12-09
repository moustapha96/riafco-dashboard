/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Form,
    Input,
    Button,
    Checkbox,
    Upload,
    message,
    Breadcrumb,
    Card,
    Avatar,
    Row,
    Col,
    Divider,
    Select
} from "antd";
import { UserOutlined, UploadOutlined, PlusCircleOutlined, SaveFilled, ArrowLeftOutlined } from "@ant-design/icons";
import userService from "../../../services/userService";
import { toast } from "sonner";
import { buildImageUrl } from "../../../utils/imageUtils";

const { Option } = Select;
import { useAuth } from "@/hooks/useAuth";

const permissionsOptions = [
    { label: "Gérer les activités", value: "GERER_ACTIVITES" },
    { label: "Gérer les ressources", value: "GERER_RESSOURCES" },
    { label: "Gérer les utilisateurs", value: "GERER_UTILISATEURS" },
    { label: "Gérer les bureaux", value: "GERER_BUREAUX" },
    { label: "Gérer les actualités", value: "GERER_ACTUALITES" },
    { label: "Gérer les partenariats", value: "GERER_PARTENARIATS" },
    { label: "Gérer les événements", value: "GERER_EVENEMENTS" },
    { label: "Gérer les newsletters", value: "GERER_NEWSLETTERS" },
    { label: "Gérer l'espace 'À propos'", value: "GERER_ESPACE_APROPOS" }
];



const AdminUserEdit = () => {

   
    const { user: currentUser } = useAuth();

    const { id } = useParams();
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        if (id) fetchUser();
    }, [id]);


    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await userService.getById(id);
            console.log(response);
            const userData = response.user;
            setUser(userData);
            form.setFieldsValue({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                status: userData.status,
                permissions: userData.permissions?.map(p => p.name) || [],
            });



            if (userData.profilePic) {
                setImageUrl(buildImageUrl(userData.profilePic));
            } else {
                setImageUrl(null); // ou une URL par défaut si vous en avez une
            }

        } catch (error) {
            toast.error(error.message || "Erreur lors de la récupération de l'utilisateur");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        console.log(values);
        try {
            console.log("Form values:", values);
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("phone", values.phone);
            formData.append("role", values.role);
            formData.append("status", values.status);
            if (values.upload?.[0]) {
                formData.append("profilePic", values.upload[0].originFileObj);
            }
            values.permissions?.forEach((permission) => { formData.append("permissions[]", permission); });

            if (id) {
                await userService.update(id, formData);
                toast.success("Utilisateur mis à jour avec succès");
            } else {
                await userService.create(formData);
                toast.success("Utilisateur créé avec succès");
            }
            navigate("/admin/users");
        } catch (error) {
            console.error("Erreur lors de l'envoi des données:", error);
            toast.error(error?.message || "Erreur lors de l'envoi des données");
        }finally {
            setLoading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 riafco-eastern-blue"></div>
            </div>
        )
    }

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">

                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Détails de l'utilisateur</h5>
                    <Breadcrumb
                        items={[
                            { title: <a href="/">Tableau de bord</a> },
                            { title: <a href="/admin/users">Utilisateurs</a> },
                            { title: id ? "Modifier l'utilisateur" : "Nouvel utilisateur" },
                        ]}
                    />
                </div>
                <div className="md:flex md:justify-end justify-end items-center mb-6">
                    <Button
                        onClick={() => navigate(-1)}
                        icon={<ArrowLeftOutlined />}
                    >
                        Retour
                    </Button>
                </div>


                <Card title={id ? "Modifier l'utilisateur" : "Nouvel utilisateur"} className="mt-4">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ status: "ACTIVE", role: "MEMBER" }}
                    >
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item label="Photo de profil" name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload
                                        name="profilePic"
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={({ file }) => setImageUrl(URL.createObjectURL(file))}
                                    >
                                        {imageUrl ? (
                                            <Avatar size={128} src={imageUrl} icon={<UserOutlined />} />
                                        ) : (
                                            <div>
                                                <UploadOutlined />
                                                <div style={{ marginTop: 8 }}>Téléverser</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item
                                    name="firstName"
                                    label="Prénom"
                                    rules={[{ required: true, message: "Prénom obligatoire" }]}
                                >
                                    <Input placeholder="Prénom" />
                                </Form.Item>
                                <Form.Item
                                    name="lastName"
                                    label="Nom"
                                    rules={[{ required: true, message: "Nom obligatoire" }]}
                                >
                                    <Input placeholder="Nom" />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, type: "email", message: "Email invalide" }]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item name="phone" label="Téléphone">
                                    <Input placeholder="Téléphone" />
                                </Form.Item>

                                <Form.Item
                                    name="role"
                                    label="Rôle"
                                    rules={[{ required: true, message: "Rôle obligatoire" }]}
                                >
                                    <Select disabled={currentUser?.role === "ADMIN" || currentUser?.role !== "SUPER_ADMIN"  }  placeholder="Sélectionner un rôle">
                                        <Option value="ADMIN">Administrateur</Option>
                                        <Option value="MEMBER">Membre</Option>
                                        <Option value="GUEST">Invité</Option>
                                        {currentUser?.role === "SUPER_ADMIN" && <Option value="SUPER_ADMIN">Super Administrateur</Option>}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="Statut"
                                    rules={[{ required: true, message: "Statut obligatoire" }]}
                                >
                                    <Select placeholder="Sélectionner un statut">
                                        <Option value="ACTIVE">Actif</Option>
                                        <Option value="INACTIVE">Inactif</Option>
                                    </Select>
                                </Form.Item>
                                <Divider>LES DROITS</Divider>
                                <Form.Item name="permissions" label="Permissions">
                                    <Checkbox.Group disabled={currentUser?.role === "ADMIN"} >
                                        <Row gutter={[0, 16]}>
                                            {permissionsOptions.map((option) => (
                                                <Col span={8} key={option.value}>
                                                    <Checkbox value={option.value}>{option.label}</Checkbox>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        className="bg-riafco-tacao"
                                        loading={loading}
                                        icon={!loading && <SaveFilled className="mr-1 h-4 w-4" />}
                                    >
                                        {loading ? "Enregistrement..." : "Valider"}
                                    </Button>

                                    
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default AdminUserEdit;