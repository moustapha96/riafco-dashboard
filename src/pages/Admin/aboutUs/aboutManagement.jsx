import { useState, useEffect } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    Breadcrumb,
    Space,
    Upload,
    Spin,
    Typography,
} from "antd";
import {
    UploadOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import organizationService from "../../../services/organizationService";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import dayjs from "dayjs";
import { buildImageUrl } from "../../../utils/imageUtils";




const { Title } = Typography;

const AboutManagement = () => {
    // États pour le formulaire
    const [aboutUsData, setAboutUsData] = useState(null);
    const [aboutUsLoading, setAboutUsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [frenchContent, setFrenchContent] = useState("");
    const [englishContent, setEnglishContent] = useState("");
    const [aboutUsForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    // Chargement initial
    useEffect(() => {
        loadAboutUs();
    }, []);

    // Nettoyer les URLs blob lors du démontage
    useEffect(() => {
        return () => {
            fileList.forEach((file) => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url)
                }
            })
        }
    }, [fileList])

    // Configuration pour ReactQuill
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet",
        "link", "image",
    ];

    const handleImageChange = ({ fileList: newFileList }) => {
        const updatedFileList = newFileList.map((file) => {
            if (file.originFileObj) {
                // Nouveau fichier sélectionné
                const blobUrl = URL.createObjectURL(file.originFileObj)
                return {
                    ...file,
                    url: blobUrl,
                    thumbUrl: blobUrl, // Nécessaire pour l'affichage dans picture-card
                }
            }
            // Pour les fichiers existants, s'assurer que thumbUrl est défini
            if (file.url && !file.thumbUrl) {
                return {
                    ...file,
                    thumbUrl: file.url,
                }
            }
            return file
        })
        setFileList(updatedFileList)
    }

    const handleImageRemove = (file) => {
        if (file.url && file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url)
        }
        return true
    }

    const uploadProps = {
        fileList,
        onChange: handleImageChange,
        onRemove: handleImageRemove,
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
        listType: "picture-card",
    }

    // Charger l'enregistrement "À propos" unique
    const loadAboutUs = async () => {
        try {
            setAboutUsLoading(true);
            const response = await organizationService.getAboutUs();
            const data = response.aboutUs || response.data;
            
            if (data) {
                setAboutUsData(data);
                aboutUsForm.setFieldsValue({
                    title_fr: data.title_fr || "",
                    title_en: data.title_en || "",
                    isPublished: data.isPublished || false,
                });
                setFrenchContent(data.paragraphe_fr || "");
                setEnglishContent(data.paragraphe_en || "");
                
                // Préparer la liste des fichiers pour l'image existante
                if (data.image) {
                    const imageUrl = buildImageUrl(data.image);
                    setFileList([
                        {
                            uid: "-1",
                            name: "image.jpg",
                            status: "done",
                            url: imageUrl,
                            thumbUrl: imageUrl,
                        },
                    ]);
                } else {
                    setFileList([]);
                }
            } else {
                // Aucun enregistrement existant, formulaire vide pour création
                setAboutUsData(null);
                aboutUsForm.resetFields();
                setFrenchContent("");
                setEnglishContent("");
                setFileList([]);
            }
        } catch (error) {
            // Si 404, c'est normal (aucun enregistrement), on laisse le formulaire vide
            if (error?.response?.status !== 404) {
                console.error("Erreur lors du chargement des informations:", error);
                toast.error("Erreur lors du chargement des informations");
            }
        } finally {
            setAboutUsLoading(false);
        }
    };


    // Soumettre le formulaire
    const handleAboutUsSubmit = async (values) => {
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("title_fr", values.title_fr || "");
            formData.append("title_en", values.title_en || "");
            formData.append("paragraphe_fr", frenchContent || "");
            formData.append("paragraphe_en", englishContent || "");
            formData.append("isPublished", String(values.isPublished || false));

            // Gérer l'image : utiliser originFileObj pour les nouveaux fichiers uniquement
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("image", fileList[0].originFileObj);
            }

            if (aboutUsData?.id) {
                // Mise à jour de l'enregistrement existant
                await organizationService.updateAboutUs(aboutUsData.id, formData);
                toast.success("Informations mises à jour avec succès");
            } else {
                // Création d'un nouvel enregistrement
                await organizationService.createAboutUs(formData);
                toast.success("Informations créées avec succès");
            }

            // Nettoyer les URLs blob
            fileList.forEach((file) => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url);
                }
            });

            // Recharger les données
            await loadAboutUs();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion de À propos</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "À propos" },
                        ]}
                    />
                </div>
                <div style={{ padding: "24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                    {aboutUsLoading ? (
                        <div style={{ textAlign: "center", padding: "50px" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Card 
                            title={
                                <Title level={2} style={{ margin: 0 }}>
                                    {aboutUsData ? "Modifier 'À propos'" : "Créer 'À propos'"}
                                </Title>
                            }
                        >
                            <Form
                                form={aboutUsForm}
                                layout="vertical"
                                onFinish={handleAboutUsSubmit}
                            >
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <Form.Item
                                        label="Titre (Français)"
                                        name="title_fr"
                                        rules={[{ required: true, message: "Veuillez saisir le titre en français" }]}
                                    >
                                        <Input placeholder="Qui sommes-nous ?" size="large" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Titre (Anglais)"
                                        name="title_en"
                                        rules={[{ required: true, message: "Veuillez saisir le titre en anglais" }]}
                                    >
                                        <Input placeholder="About Us" size="large" />
                                    </Form.Item>
                                </div>
                                <Form.Item label="Contenu (Français)">
                                    <ReactQuill
                                        theme="snow"
                                        value={frenchContent}
                                        onChange={setFrenchContent}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Contenu en français..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </Form.Item>
                                <Form.Item label="Contenu (Anglais)">
                                    <ReactQuill
                                        theme="snow"
                                        value={englishContent}
                                        onChange={setEnglishContent}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Contenu en anglais..."
                                        style={{ height: "200px", marginBottom: "24px" }}
                                    />
                                </Form.Item>

                                <Form.Item label="Image">
                                    <Upload {...uploadProps}>
                                        {fileList.length < 1 && (
                                            <div>
                                                <UploadOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                                                <div style={{ marginTop: 8 }}>Sélectionner une image</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>

                                <Form.Item name="isPublished" valuePropName="checked" label="Statut de publication">
                                    <Switch checkedChildren="Publié" unCheckedChildren="Brouillon" />
                                </Form.Item>
                                <Form.Item>
                                    <Space>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={submitting}
                                            icon={<SaveOutlined />}
                                            size="large"
                                        >
                                            {aboutUsData ? "Mettre à jour" : "Créer"}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};



export default AboutManagement;
