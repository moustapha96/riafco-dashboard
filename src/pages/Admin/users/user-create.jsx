import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { UserOutlined, UploadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import userService from "../../../services/userService";

const { Option } = Select;


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



const AdminUserCreate = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");

    }, []);


    const handleSubmit = async (values) => {
        setLoading(true)
        console.log(values)
        try {
            console.log("Form values:", values);
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("phone", values.phone);
            formData.append("role", values.role);
            formData.append("status","ACTIVE");
            // formData.append("password", values.password);
            formData.append("password", "password");
            // formData.append("confirmPassword", values.confirmPassword);
            formData.append("confirmPassword", "password");

            if (values.upload?.[0]) {
                formData.append("profilePic", values.upload[0].originFileObj);
            }

            values.permissions?.forEach((permission) => { formData.append("permissions[]", permission); });

            await userService.create(formData);
            message.success("Utilisateur créé avec succès");

            navigate("/admin/users");
        } catch (error) {
            console.error("Erreur lors de l'envoi des données:", error);
            error.errors.forEach(element => {
                message.error(element.msg);
            });
            message.error(error?.message || "Erreur lors de l'envoi des données");
        } finally {
            setLoading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Liste des utilisateurs</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },

                            { title: <Link to="/admin/users">Utilisateurs</Link> },
                            { title: "Nouvel utilisateur" },
                        ]}
                    />
                </div>

                
                <Card title={"Nouvel utilisateur"} className="mt-4">
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
                                    <Select placeholder="Sélectionner un rôle">
                                        <Option value="ADMIN">Administrateur</Option>
                                        <Option value="MEMBER">Membre</Option>
                                        <Option value="GUEST">Invité</Option>
                                    </Select>
                                </Form.Item>

                                {/* <Form.Item
                                    name="status"
                                    label="Statut"
                                    rules={[{ required: true, message: "Statut obligatoire" }]}
                                >
                                    <Select placeholder="Sélectionner un statut">
                                        <Option value="ACTIVE">Actif</Option>
                                        <Option value="INACTIVE">Inactif</Option>
                                    </Select>
                                </Form.Item> */}

                                <Divider>LES DROITS</Divider>
                                <Form.Item name="permissions" label="Permissions">
                                    <Checkbox.Group>
                                        <Row gutter={[0, 16]}>
                                            {permissionsOptions.map((option) => (
                                                <Col span={8} key={option.value}>
                                                    <Checkbox value={option.value}>{option.label}</Checkbox>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                {/* <Divider>Mot de passe</Divider>
                                <Form.Item
                                    name="password"
                                    label="Mot de passe"
                                    rules={[{ required: true, message: "Mot de passe obligatoire" }]}
                                >
                                    <Input.Password placeholder="Mot de passe" />
                                </Form.Item> */}

                                {/* <Form.Item
                                    name="confirmPassword"
                                    label="Confirmer le mot de passe"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: "Confirmer le mot de passe obligatoire" },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("Les mots de passe ne correspondent pas"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirmer le mot de passe" />
                                </Form.Item> */}

                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        loading={loading}
                                        icon={!loading && <PlusCircleOutlined className="mr-1 h-4 w-4" />}
                                    >
                                        {loading ? "Validation..." : "Valider"}
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

export default AdminUserCreate;