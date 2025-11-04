
// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { Form, Input, Select, Button, Card, Breadcrumb, message, Upload, InputNumber, Avatar } from "antd";
// import { SaveOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";// Utilise le bon service
// import ifclService from "../../../services/ifclService";
// import { toast } from "sonner";
// import ReactQuill from "react-quill";

// const { Option } = Select;

// const IFCLFormAdmin = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [initialLoading, setInitialLoading] = useState(false);
//     const isEdit = !!id;
//     const [imageUrl, setImageUrl] = useState(null);

//     useEffect(() => {
//         if (isEdit) {
//             fetchMemberCountryDetails();
//         }
//     }, [id]);

//     const fetchMemberCountryDetails = async () => {
//         setInitialLoading(true);
//         try {
//             const response = await ifclService.getById(id);
//             const memberCountry = response.country || response.data;
//             console.log(memberCountry)
//             form.setFieldsValue({
//                 name: memberCountry.name,
//                 code: memberCountry.code,
//                 flag: memberCountry.flag,
//                 latitude: memberCountry.latitude,
//                 longitude: memberCountry.longitude,
//                 status: memberCountry.status,
//                 description: memberCountry.description
//             });
//         } catch (error) {
//             console.error("Erreur lors de la récupération des détails:", error);
//             message.error("Erreur lors du chargement des données");
//         } finally {
//             setInitialLoading(false);
//         }
//     };

//     const handleSubmit = async (values) => {
//         setLoading(true);
//         console.log(values);
//         try {
//             const formData = new FormData();
//             // Ajout des champs textuels
//             formData.append("name", values.name);
//             formData.append("code", values.code);
//             formData.append("latitude", values.latitude);
//             formData.append("longitude", values.longitude);
//             formData.append("status", values.status);
//             formData.append("description", values.description);

//             if (values.upload?.[0]) {
//                 formData.append("flag", values.upload[0].originFileObj);
//             }

//             if (isEdit) {
//                 await ifclService.update(id, formData);
//                 toast.success("Pays membre modifié avec succès");
//             } else {
//                 await ifclService.create(formData);
//                 toast.success("Pays membre créé avec succès");
//             }
//             navigate("/admin/ifcl");
//         } catch (error) {
//             console.error("Erreur lors de la sauvegarde:", error);
//             toast.error(error.error || error.message || "Erreur lors de la sauvegarde");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const quillModules = {
//         toolbar: [
//             ["bold", "italic", "underline", "strike"],
//             ["blockquote", "code-block"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["clean"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold", "italic", "underline", "strike", "blockquote",
//         "list", "bullet",
//         "link", "image",
//     ];


//     const normFile = (e) => {
//         if (Array.isArray(e)) return e;
//         return e?.fileList;
//     };

   
    
//     if (initialLoading) {
//         return <div>Chargement...</div>;
//     }

//     return (
//         <div className="container-fluid relative px-3">
//             <div className="layout-specing">
//                 <div className="md:flex justify-between items-center mb-6">
//                     <h5 className="text-lg font-semibold">
//                         {isEdit ? "Modifier le pays membre" : "Ajouter un pays membre"}
//                     </h5>
//                     <Breadcrumb
//                         items={[
//                             { title: <Link to="/">Dashboard</Link> },
//                             {
//                                 title: <Link to="/admin/ifcl">
//                                     Gestion des Pays membres</Link>
//                             },
//                             { title: <Link to="/admin/ifcl/maps">Maps</Link> },
//                             { title: isEdit ? "Modifier" : "Ajouter" },
//                         ]}
//                     />
//                 </div>
//                 <Card>
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={handleSubmit}
//                         initialValues={{
//                             status: "ACTIVE",
//                         }}
//                     >
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {/* Informations de base */}
//                             <div>
//                                 <h6 className="text-md font-semibold mb-4">Informations de base</h6>
//                                 <Form.Item
//                                     name="name"
//                                     label="Nom du pays"
//                                     rules={[{ required: true, message: "Le nom est requis" }]}
//                                 >
//                                     <Input placeholder="Nom du pays" />
//                                 </Form.Item>
//                                 <Form.Item
//                                     name="code"
//                                     label="Code pays"
//                                     rules={[
//                                         { required: true, message: "Le code est requis" },
//                                         { min: 2, max: 3, message: "Le code doit faire 2 ou 3 caractères" },
//                                     ]}
//                                 >
//                                     <Input placeholder="FR, US, etc." maxLength={3} />
//                                 </Form.Item>

//                                 <Form.Item
//                                     name="description"
//                                     label="Description"
//                                     rules={[{ required: true, message: "La description est requise" }]}
//                                 >
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={form.getFieldValue("description")}
//                                         onChange={(value) => form.setFieldsValue({ description: value })}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="Description ..."
//                                         style={{ height: "200px", marginBottom: "24px" }}
//                                     />
//                                 </Form.Item>

//                                 <Form.Item label="Drapeau" name="upload"
//                                     valuePropName="fileList" getValueFromEvent={normFile}>
//                                     <Upload
//                                         name="flag"
//                                         listType="picture-card"
//                                         showUploadList={false}
//                                         beforeUpload={() => false}
//                                         onChange={({ file }) => setImageUrl(URL.createObjectURL(file))}
//                                     >
//                                         {imageUrl ? (
//                                             <Avatar size={128} src={imageUrl} icon={<UserOutlined />} />
//                                         ) : (
//                                             <div>
//                                                 <UploadOutlined />
//                                                 <div style={{ marginTop: 8 }}>Téléverser</div>
//                                             </div>
//                                         )}
//                                     </Upload>
//                                 </Form.Item>


//                                 <Form.Item name="status" label="Statut" rules={[{ required: true, message: "Le statut est requis" }]}>
//                                     <Select>
//                                         <Option value="ACTIVE">Actif</Option>
//                                         <Option value="INACTIVE">Inactif</Option>
//                                     </Select>
//                                 </Form.Item>
//                             </div>
//                             {/* Coordonnées */}
//                             <div>
//                                 <h6 className="text-md font-semibold mb-4">Localisation</h6>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <Form.Item
//                                         name="latitude"
//                                         label="Latitude"
//                                         rules={[{ type: "number", min: -90, max: 90, message: "Latitude entre -90 et 90" }]}
//                                     >
//                                         <InputNumber placeholder="48.8566" style={{ width: "100%" }} step={0.0001} />
//                                     </Form.Item>
//                                     <Form.Item
//                                         name="longitude"
//                                         label="Longitude"
//                                         rules={[{ type: "number", min: -180, max: 180, message: "Longitude entre -180 et 180" }]}
//                                     >
//                                         <InputNumber placeholder="2.3522" style={{ width: "100%" }} step={0.0001} />
//                                     </Form.Item>
//                                 </div>
//                             </div>
//                         </div>
//                         <Form.Item className="mt-6 text-right">
//                             <Button
//                                 type="primary"
//                                 htmlType="submit"
//                                 loading={loading}
//                                 icon={<SaveOutlined />}
//                                 size="large"
//                             >
//                                 {isEdit ? "Modifier" : "Créer"}
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default IFCLFormAdmin;

"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Input, Select, Button, Card, Breadcrumb, message, Upload,  Avatar } from "antd";
import { SaveOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import ifclService from "../../../services/ifclService";
import { toast } from "sonner";
import ReactQuill from "react-quill";

const { Option } = Select;

const IFCLFormAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const isEdit = !!id;
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchMemberCountryDetails();
        }
    }, [id]);

    const fetchMemberCountryDetails = async () => {
        setInitialLoading(true);
        try {
            const response = await ifclService.getById(id);
            const memberCountry = response.country || response.data;
            console.log(memberCountry);

            form.setFieldsValue({
                name_fr: memberCountry.name_fr,
                name_en: memberCountry.name_en,
                pays_fr: memberCountry.pays_fr,
                pays_en: memberCountry.pays_en,
                description_fr: memberCountry.description_fr,
                description_en: memberCountry.description_en,
                coordonnees: memberCountry.coordonnees,
                flag: memberCountry.flag,
                status: memberCountry.status,
            });

            if (memberCountry.flag) {
                setImageUrl(memberCountry.flag);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error);
            message.error("Erreur lors du chargement des données");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Ajout des champs multilingues
            formData.append("name_fr", values.name_fr);
            formData.append("name_en", values.name_en);
            formData.append("pays_fr", values.pays_fr);
            formData.append("pays_en", values.pays_en);
            formData.append("description_fr", values.description_fr);
            formData.append("description_en", values.description_en);
            formData.append("coordonnees", values.coordonnees);
            formData.append("status", values.status);

            if (values.upload?.[0]) {
                formData.append("flag", values.upload[0].originFileObj);
            }

            if (isEdit) {
                await ifclService.update(id, formData);
                toast.success("Pays membre modifié avec succès");
            } else {
                await ifclService.create(formData);
                toast.success("Pays membre créé avec succès");
            }
            navigate("/admin/ifcl");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            toast.error(error.error || error.message || "Erreur lors de la sauvegarde");
        } finally {
            setLoading(false);
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

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    if (initialLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">
                        {isEdit ? "Modifier le pays membre" : "Ajouter un pays membre"}
                    </h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/admin/ifcl">Gestion des Pays membres</Link> },
                            { title: <Link to="/admin/ifcl/maps">Cartes</Link> },
                            { title: isEdit ? "Modifier" : "Ajouter" },
                        ]}
                    />
                </div>

                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            status: "ACTIVE",
                        }}
                    >
                        <div className="grid grid-cols-1 gap-6">
                            {/* Noms multilingues */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item
                                    name="name_fr"
                                    label="Nom du pays (FR)"
                                    rules={[{ required: true, message: "Le nom en français est requis" }]}
                                >
                                    <Input placeholder="Nom du pays en français" />
                                </Form.Item>

                                <Form.Item
                                    name="name_en"
                                    label="Nom du pays (EN)"
                                    rules={[{ required: true, message: "Le nom en anglais est requis" }]}
                                >
                                    <Input placeholder="Nom du pays en anglais" />
                                </Form.Item>
                            </div>

                            {/* Noms officiels multilingues */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item
                                    name="pays_fr"
                                    label="Nom officiel (FR)"
                                    rules={[{ required: true, message: "Le nom officiel en français est requis" }]}
                                >
                                    <Input placeholder="Nom officiel en français" />
                                </Form.Item>

                                <Form.Item
                                    name="pays_en"
                                    label="Nom officiel (EN)"
                                    rules={[{ required: true, message: "Le nom officiel en anglais est requis" }]}
                                >
                                    <Input placeholder="Nom officiel en anglais" />
                                </Form.Item>
                            </div>

                            {/* Descriptions multilingues */}
                            <div className="grid grid-cols-1 gap-6">
                                <Form.Item
                                    name="description_fr"
                                    label="Description (FR)"
                                    rules={[{ required: true, message: "La description en français est requise" }]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={form.getFieldValue("description_fr")}
                                        onChange={(value) => form.setFieldsValue({ description_fr: value })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description en français..."
                                        style={{ height: "150px", marginBottom: "24px" }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="description_en"
                                    label="Description (EN)"
                                    rules={[{ required: true, message: "La description en anglais est requise" }]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={form.getFieldValue("description_en")}
                                        onChange={(value) => form.setFieldsValue({ description_en: value })}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Description en anglais..."
                                        style={{ height: "150px", marginBottom: "24px" }}
                                    />
                                </Form.Item>
                            </div>

                            {/* Coordonnées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item
                                    name="coordonnees"
                                    label="Coordonnées géographiques"
                                    rules={[{ required: true, message: "Les coordonnées sont requises" }]}
                                >
                                    <Input placeholder="Ex: 14.7167° N, 17.4677° W" />
                                </Form.Item>

                                <Form.Item label="Drapeau" name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload
                                        name="flag"
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
                            </div>

                            {/* Statut */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item name="status" label="Statut" rules={[{ required: true, message: "Le statut est requis" }]}>
                                    <Select>
                                        <Option value="ACTIVE">Actif</Option>
                                        <Option value="INACTIVE">Inactif</Option>
                                    </Select>
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

export default IFCLFormAdmin;
