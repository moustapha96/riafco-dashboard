

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
} from "antd";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import userService from "../../../services/userService";
import { LoadingOutlined, SendOutlined, UploadOutlined } from "@ant-design/icons";

const MailerManagement = () => {
    const [mailForm] = Form.useForm();
    const [mailLoading, setMailLoading] = useState(false);
    const [mailContent, setMailContent] = useState("");
    const [recipients, setRecipients] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const recipientInputRef = useRef(null);

    const addRecipient = (e) => {
        if (e.key === "Enter" && e.target.value) {
            e.preventDefault();
            const email = e.target.value.trim();
            if (email && !recipients.includes(email)) {
                setRecipients([...recipients, email]);
                e.target.value = "";
            }
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
        try {
            setMailLoading(true);
            await userService.sendMailToUser({
                to: recipients,
                subject: values.subject,
                html: mailContent,
                attachments: attachments.map((file) => ({
                    filename: file.name,
                    content: file.originFileObj,
                })),
            });
            message.success("Email envoyé avec succès !");
            mailForm.resetFields();
            setMailContent("");
            setRecipients([]);
            setAttachments([]);
        } catch (error) {
            console.error("Erreur lors de l'envoi du mail:", error);
            message.error("Échec de l'envoi du mail");
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

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Envoi de mail</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: "Envoi de mail" },
                        ]}
                    />
                </div>
                <div style={{ padding: "24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                    <Card title="Envoyer un e-mail" style={{ marginTop: 24 }}>
                        <Form form={mailForm} layout="vertical" onFinish={handleSendMail}>
                            <Form.Item label="Destinataires">
                                <Input
                                    ref={recipientInputRef}
                                    placeholder="Tapez un email et appuyez sur Entrée"
                                    onKeyDown={addRecipient}
                                />
                                <Space style={{ marginTop: 8 }}>
                                    {recipients.map((email) => (
                                        <Tag key={email} closable onClose={() => removeRecipient(email)}>
                                            {email}
                                        </Tag>
                                    ))}
                                </Space>
                            </Form.Item>
                            <Form.Item
                                label="Sujet"
                                name="subject"
                                rules={[{ required: true, message: "Veuillez saisir le sujet" }]}
                            >
                                <Input placeholder="Sujet de l'email" />
                            </Form.Item>
                            <Form.Item label="Pièces jointes">
                                <Upload
                                    beforeUpload={() => false} // Désactive l'upload automatique
                                    onChange={handleUploadChange}
                                    fileList={attachments}
                                    maxCount={5}
                                >
                                    <Button icon={<UploadOutlined />}>Ajouter une pièce jointe</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Message">
                                <ReactQuill
                                    theme="snow"
                                    value={mailContent}
                                    onChange={setMailContent}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Contenu de l'email..."
                                    style={{ height: "200px", marginBottom: "24px" }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    loading={mailLoading}
                                    icon={
                                        !mailLoading ? (
                                            <SendOutlined className="mr-1 h-4 w-4" />
                                        ) : (
                                            <LoadingOutlined className="animate-spin mr-1 h-4 w-4" />
                                        )
                                    }
                                >
                                    {mailLoading ? "Envoie..." : "Envoyer"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MailerManagement;