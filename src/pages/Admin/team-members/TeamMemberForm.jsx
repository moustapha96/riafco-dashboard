/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Input, InputNumber, Button, Card, Breadcrumb, message, Upload, Avatar } from "antd";
import { SaveOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import teamMemberService from "../../../services/teamMemberService";
import { buildImageUrl } from "../../../utils/imageUtils";

const { TextArea } = Input;

const TeamMemberFormAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const isEdit = !!id;

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (isEdit) {
            fetchTeamMemberDetails();
        }
    }, [id]);

    const fetchTeamMemberDetails = async () => {
        setInitialLoading(true);
        try {
            const response = await teamMemberService.getById(id);
            const teamMember = response.teamMember || response.data;
            console.log(teamMember);
            form.setFieldsValue(teamMember);
            
            // Charger l'image existante si elle existe
            if (teamMember.photo) {
                const imageUrl = buildImageUrl(teamMember.photo);
                setFileList([
                    {
                        uid: "-1",
                        name: "photo.jpg",
                        status: "done",
                        url: imageUrl,
                        thumbUrl: imageUrl,
                    },
                ]);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error);
            message.error("Erreur lors du chargement des données");
        } finally {
            setInitialLoading(false);
        }
    };

    // const handleSubmit = async (values) => {
    //     console.log(values)
    //     setLoading(true);
    //     try {
    //         console.log("Form values:", values);
    //         const formData = new FormData();
    //         formData.append("email", values.email);
    //         formData.append("firstName", values.firstName);
    //         formData.append("lastName", values.lastName);
    //         formData.append("phone", values.phone);
    //         formData.append("role", values.role);
    //         formData.append("status", values.status);
    //         if (values.upload?.[0]) {
    //             formData.append("profilePic", values.upload[0].originFileObj);
    //         }

    //         if (isEdit) {
    //             await teamMemberService.update(id, values);
    //             message.success("Membre modifié avec succès");
    //         } else {
    //             await teamMemberService.create(values);
    //             message.success("Membre ajouté avec succès");
    //         }
    //         navigate("/admin/team-members");
    //     } catch (error) {
    //         console.error("Erreur lors de la sauvegarde:", error);
    //         message.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            // Ajoutez tous les champs du formulaire à formData
            formData.append("name", values.name);
            formData.append("position", values.position);
            formData.append("order", values.order);
            formData.append("bio", values.bio || "");

            // Utiliser fileList du state pour les nouveaux fichiers
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("photo", fileList[0].originFileObj);
            }

            if (isEdit) {
                await teamMemberService.update(id, formData);
                message.success("Membre modifié avec succès");
            } else {
                await teamMemberService.create(formData);
                message.success("Membre ajouté avec succès");
            }

            // Nettoyer les URLs blob après la soumission
            fileList.forEach((file) => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url);
                }
            });

            navigate("/admin/team-members");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            message.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        const updatedFileList = newFileList.map((file) => {
            if (file.originFileObj) {
                // Nouveau fichier sélectionné
                const blobUrl = URL.createObjectURL(file.originFileObj);
                return {
                    ...file,
                    url: blobUrl,
                    thumbUrl: blobUrl,
                };
            }
            // Pour les fichiers existants, s'assurer que thumbUrl est défini
            if (file.url && !file.thumbUrl) {
                return {
                    ...file,
                    thumbUrl: file.url,
                };
            }
            return file;
        });
        setFileList(updatedFileList);
    };

    const handleImageRemove = (file) => {
        if (file.url && file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url);
        }
        setFileList([]);
        return true;
    };

    // Nettoyer les URLs blob lors du démontage
    useEffect(() => {
        return () => {
            fileList.forEach((file) => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url);
                }
            });
        };
    }, [fileList]);

    if (initialLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        {isEdit ? "Modifier un membre" : "Ajouter un membre"}
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: <Link to="/admin/team-members">Membres de l'équipe</Link> },
                            { title: isEdit ? "Modifier" : "Ajouter" },
                        ]}
                    />
                </div>
                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ order: 1, status: "ACTIVE" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Form.Item
                                    name="name"
                                    label="Nom"
                                    rules={[{ required: true, message: "Le nom est requis" }]}
                                >
                                    <Input placeholder="Nom du membre" />
                                </Form.Item>
                                <Form.Item
                                    name="position"
                                    label="Poste"
                                    rules={[{ required: true, message: "Le poste est requis" }]}
                                >
                                    <Input placeholder="Poste du membre" />
                                </Form.Item>
                                <Form.Item name="order" label="Ordre" rules={[{ required: true, message: "L'ordre est requis" }]}>
                                    <InputNumber min={1} placeholder="Ordre d'affichage" />
                                </Form.Item>
                                {/* <Form.Item name="photo" label="Photo">
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>Télécharger la photo</Button>
                                    </Upload>
                                </Form.Item> */}

                                <Form.Item label="Photo">
                                    <Upload
                                        name="photo"
                                        listType="picture-card"
                                        fileList={fileList}
                                        accept="image/*"
                                        beforeUpload={(file) => {
                                            const isImage = file.type.startsWith('image/');
                                            if (!isImage) {
                                                message.error('Vous ne pouvez téléverser que des fichiers image!');
                                                return Upload.LIST_IGNORE;
                                            }
                                            return false; // Empêcher l'upload automatique
                                        }}
                                        onChange={handleImageChange}
                                        onRemove={handleImageRemove}
                                        maxCount={1}
                                    >
                                        {fileList.length < 1 && (
                                            <div>
                                                <UploadOutlined />
                                                <div style={{ marginTop: 8 }}>Téléverser</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>


                            </div>
                            <div>
                                <Form.Item name="bio" label="Bio">
                                    <TextArea rows={6} placeholder="Biographie du membre" />
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item className="mt-6 text-right">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                                size="large"
                            >
                                {isEdit ? "Modifier" : "Créer"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default TeamMemberFormAdmin;
