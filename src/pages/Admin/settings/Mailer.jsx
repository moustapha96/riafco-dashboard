

import { useState, useRef } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Breadcrumb,
    Tag,
    Space,
    Upload,
    message,
    Alert,
    Typography,
    Divider,
} from "antd";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import userService from "../../../services/userService";
import { LoadingOutlined, SendOutlined, UploadOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const MailerManagement = () => {
    const [mailForm] = Form.useForm();
    const [mailLoading, setMailLoading] = useState(false);
    const [mailContent, setMailContent] = useState("");
    const [recipients, setRecipients] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [recipientInput, setRecipientInput] = useState("");
    const recipientInputRef = useRef(null);

    // Validation d'email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addRecipient = (e) => {
        if (e.key === "Enter" && recipientInput.trim()) {
            e.preventDefault();
            const email = recipientInput.trim();
            
            if (!isValidEmail(email)) {
                message.error("Veuillez entrer une adresse email valide");
                return;
            }
            
            if (recipients.includes(email)) {
                message.warning("Cet email est déjà dans la liste");
                return;
            }
            
            setRecipients([...recipients, email]);
            setRecipientInput("");
        }
    };

    const addRecipientFromInput = () => {
        if (recipientInput.trim()) {
            const email = recipientInput.trim();
            
            if (!isValidEmail(email)) {
                message.error("Veuillez entrer une adresse email valide");
                return;
            }
            
            if (recipients.includes(email)) {
                message.warning("Cet email est déjà dans la liste");
                return;
            }
            
            setRecipients([...recipients, email]);
            setRecipientInput("");
            recipientInputRef.current?.focus();
        }
    };

    const removeRecipient = (email) => {
        setRecipients(recipients.filter((r) => r !== email));
    };

    const handleSendMail = async (values) => {
        if (recipients.length === 0) {
            message.error("Veuillez ajouter au moins un destinataire");
            return;
        }

        if (!mailContent || mailContent.trim() === "" || mailContent === "<p><br></p>") {
            message.error("Veuillez saisir un message");
            return;
        }

        try {
            setMailLoading(true);
            
            // Préparer les données à envoyer
            const emailData = {
                to: recipients,
                subject: values.subject,
                html: mailContent,
            };

            // Si des pièces jointes existent, les convertir en base64 pour l'envoi
            if (attachments.length > 0) {
                const attachmentPromises = attachments.map(async (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve({
                                filename: file.name,
                                content: reader.result.split(',')[1], // Enlever le préfixe data:...
                                encoding: 'base64',
                            });
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file.originFileObj);
                    });
                });
                
                emailData.attachments = await Promise.all(attachmentPromises);
            }

            const response = await userService.sendMailToUser(emailData);
            
            // Afficher le résultat
            if (response.results) {
                const successCount = response.results.filter(r => r.success).length;
                const failCount = response.results.filter(r => !r.success).length;
                
                if (failCount === 0) {
                    message.success(`${successCount} email(s) envoyé(s) avec succès !`);
                } else {
                    message.warning(`${successCount} email(s) envoyé(s), ${failCount} échec(s)`);
                    console.error("Détails des échecs:", response.results.filter(r => !r.success));
                }
            } else {
                message.success(response.message || "Email(s) envoyé(s) avec succès !");
            }

            // Réinitialiser le formulaire
            mailForm.resetFields();
            setMailContent("");
            setRecipients([]);
            setAttachments([]);
            setRecipientInput("");
        } catch (error) {
            console.error("Erreur lors de l'envoi du mail:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Échec de l'envoi du mail";
            message.error(errorMessage);
            toast.error(errorMessage);
        } finally {
            setMailLoading(false);
        }
    };

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

    const handleUploadChange = ({ fileList }) => {
        setAttachments(fileList);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Envoi de mail</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Envoi de mail" },
                        ]}
                    />
                </div>

                <Alert
                    message="Envoi d'emails"
                    description="Utilisez ce formulaire pour envoyer des emails personnalisés aux utilisateurs. Les emails seront envoyés depuis support@riafco-oi.org"
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                <Card 
                    title={
                        <Space>
                            <MailOutlined />
                            <span>Envoyer un e-mail</span>
                        </Space>
                    } 
                    style={{ marginTop: 24 }}
                >
                    <Form form={mailForm} layout="vertical" onFinish={handleSendMail}>
                        <Form.Item 
                            label={
                                <Space>
                                    <UserOutlined />
                                    <span>Destinataires ({recipients.length})</span>
                                </Space>
                            }
                            required
                        >
                            <Space.Compact style={{ width: "100%" }}>
                                <Input
                                    ref={recipientInputRef}
                                    placeholder="Tapez un email et appuyez sur Entrée"
                                    value={recipientInput}
                                    onChange={(e) => setRecipientInput(e.target.value)}
                                    onKeyDown={addRecipient}
                                    style={{ flex: 1 }}
                                />
                                <Button 
                                    onClick={addRecipientFromInput}
                                    type="default"
                                >
                                    Ajouter
                                </Button>
                            </Space.Compact>
                            {recipients.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <Space wrap>
                                        {recipients.map((email) => (
                                            <Tag 
                                                key={email} 
                                                closable 
                                                onClose={() => removeRecipient(email)}
                                                color="blue"
                                            >
                                                {email}
                                            </Tag>
                                        ))}
                                    </Space>
                                </div>
                            )}
                            {recipients.length === 0 && (
                                <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: 8 }}>
                                    Ajoutez au moins un destinataire
                                </Text>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="Sujet"
                            name="subject"
                            rules={[
                                { required: true, message: "Veuillez saisir le sujet" },
                                { min: 3, message: "Le sujet doit contenir au moins 3 caractères" }
                            ]}
                        >
                            <Input 
                                placeholder="Sujet de l'email" 
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item 
                            label="Pièces jointes (optionnel)"
                            name="attachments"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                beforeUpload={() => false}
                                onChange={handleUploadChange}
                                fileList={attachments}
                                maxCount={5}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>
                                    Ajouter une pièce jointe (max 5)
                                </Button>
                            </Upload>
                            {attachments.length > 0 && (
                                <Paragraph type="secondary" style={{ fontSize: "12px", marginTop: 8 }}>
                                    {attachments.length} fichier(s) sélectionné(s)
                                </Paragraph>
                            )}
                        </Form.Item>

                        <Form.Item 
                            label="Message"
                            required
                            rules={[
                                { 
                                    validator: () => {
                                        if (!mailContent || mailContent.trim() === "" || mailContent === "<p><br></p>") {
                                            return Promise.reject(new Error("Veuillez saisir un message"));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <div style={{ background: "#fff", borderRadius: "4px" }}>
                                <ReactQuill
                                    theme="snow"
                                    value={mailContent}
                                    onChange={setMailContent}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Rédigez votre message ici..."
                                    style={{ 
                                        minHeight: "250px",
                                        marginBottom: "42px"
                                    }}
                                />
                            </div>
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <Space>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    size="large"
                                    loading={mailLoading}
                                    icon={
                                        !mailLoading ? (
                                            <SendOutlined />
                                        ) : (
                                            <LoadingOutlined className="animate-spin" />
                                        )
                                    }
                                >
                                    {mailLoading ? "Envoi en cours..." : `Envoyer à ${recipients.length} destinataire(s)`}
                                </Button>
                                <Button
                                    onClick={() => {
                                        mailForm.resetFields();
                                        setMailContent("");
                                        setRecipients([]);
                                        setAttachments([]);
                                        setRecipientInput("");
                                    }}
                                    disabled={mailLoading}
                                >
                                    Réinitialiser
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default MailerManagement;