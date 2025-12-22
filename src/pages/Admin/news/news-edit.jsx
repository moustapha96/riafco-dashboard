
// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { Card, Button, Form, Input, Upload, Select, Space, Spin, Typography, Row, Col } from "antd"
// import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons"
// import "@uiw/react-md-editor/markdown-editor.css"
// import "@uiw/react-markdown-preview/markdown.css"
// import newsService from "../../../services/newsService"
// import { toast } from "sonner"
// import ReactQuill from "react-quill"
// import { buildImageUrl } from "../../../utils/imageUtils"

// const { Title } = Typography
// const { Option } = Select

// const NewsEdit = () => {
//     const navigate = useNavigate()
//     const { id } = useParams()
//     const isEdit = Boolean(id)

//     const [loading, setLoading] = useState(false)
//     const [saving, setSaving] = useState(false)
//     const [form] = Form.useForm()
//     const [content_fr, setContentFr] = useState("")
//     const [content_en, setContentEn] = useState("")
//     const [fileList, setFileList] = useState([])
//     const [galleryList, setGalleryList] = useState([])
//     const [coverPreview, setCoverPreview] = useState(null)


//     useEffect(() => {
//         if (isEdit) {
//             fetchNews()
//         }
//     }, [id, isEdit])

//     const fetchNews = async () => {
//         try {
//             setLoading(true)
//             const response = await newsService.getById(id)
//             const newsData = response.news

//             form.setFieldsValue({
//                 title_fr: newsData.title_fr,
//                 title_en: newsData.title_en,
//                 status: newsData.status,
//             })
//             setContentFr(newsData.content_fr)
//             setContentEn(newsData.content_en)
//             setFileList(
//                 newsData.image
//                     ? [
//                         {
//                             uid: "-1",
//                             name: newsData.image.split('/').pop() || "image.jpg",
//                             status: "done",
//                             url: buildImageUrl(newsData.image),
//                             thumbUrl: buildImageUrl(newsData.image),
//                         },
//                     ]
//                     : [],
//             )
//             if (newsData.image) {
//                 const builtUrl = buildImageUrl(newsData.image)
//                 setCoverPreview(builtUrl)
//               }
              
//             // Debug: vérifier que l'image est bien chargée
//             if (newsData.image) {
//                 console.log("Image de couverture chargée:", {
//                     original: newsData.image,
//                     builtUrl: buildImageUrl(newsData.image)
//                 });
//             }
//             setGalleryList(
//                 newsData.galleries?.map((url, index) => ({
//                     uid: `-${index + 2}`,
//                     name: `gallery-${index}.jpg`,
//                     status: "done",
//                     url: buildImageUrl(url),
//                 })) || []
//             )
//         } catch (error) {
//             console.log(error)
//             toast.error("Erreur lors du chargement de la news")
//             navigate("/admin/news")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleSubmit = async (values) => {
//         try {
//             setSaving(true)
//             const formData = new FormData()
//             formData.append("title_fr", values.title_fr)
//             formData.append("title_en", values.title_en)
//             formData.append("content_fr", content_fr)
//             formData.append("content_en", content_en)
//             formData.append("status", values.status || "DRAFT")

//             if (fileList.length > 0 && fileList[0].originFileObj) {
//                 formData.append("image", fileList[0].originFileObj)
//             }

//             galleryList.forEach((file) => {
//                 if (file.originFileObj) {
//                     formData.append("galleries", file.originFileObj)
//                 }
//             })

//             if (isEdit) {
//                 await newsService.update(id, formData)
//                 toast.success("News mise à jour avec succès")
//             } else {
//                 await newsService.create(formData)
//                 toast.success("News créée avec succès")
//             }

//             navigate("/admin/news")
//         } catch (error) {
//             console.log(error)
//             toast.error("Erreur lors de la sauvegarde")
//         } finally {
//             setSaving(false)
//         }
//     }

    
//     const uploadProps = {
//         fileList,
//         onChange: ({ fileList: newFileList }) => setFileList(newFileList),
//         beforeUpload: () => false,
//         maxCount: 1,
//         accept: "image/*",
//     }
//     const galleryUploadProps = {
//         fileList: galleryList,
//         onChange: ({ fileList: newFileList }) => setGalleryList(newFileList),
//         beforeUpload: () => false,
//         multiple: true,
//         accept: "image/*",
//     }

//     if (loading) {
//         return (
//             <div style={{ padding: "24px", textAlign: "center" }}>
//                 <Spin size="large" />
//             </div>
//         )
//     }

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

//     return <>
//         <div className="container-fluid relative px-3">
//             <div className="layout-specing"
//                 style={{
//                     maxHeight: "calc(100vh - 100px)",
//                     overflowY: "auto",
//                     paddingRight: "8px"
//                 }}
//             >
//                 <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
//                     <div style={{ marginBottom: "24px" }}>
//                         <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/news")} style={{ marginBottom: "16px" }}>
//                             Retour à la liste
//                         </Button>
//                         <Title level={2}>{isEdit ? "Modifier la News" : "Créer une News"}</Title>
//                     </div>

//                     <Card>
//                         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//                             <Form.Item name="title_fr" label="Titre en Francais" rules={[{ required: true, message: "Le titre est requis" }]}>
//                                 <Input placeholder="Titre de la news" size="large" />
//                             </Form.Item>

//                             <Form.Item name="title_en" label="Titre en Anglais" rules={[{ required: true, message: "Le titre est requis" }]}>
//                                 <Input placeholder="Titre de la news" size="large" />
//                             </Form.Item>

//                             <Form.Item label="Contenu en Francais" rules={[{ required: true, message: "Le contenu est requis" }]}>
//                                 <div data-color-mode="light">
                                   
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={content_fr}
//                                         onChange={setContentFr}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="Description ..."
//                                         style={{ height: "200px", marginBottom: "24px" }}
//                                     />
//                                 </div>
//                             </Form.Item>

//                             <Form.Item label="Contenu en Anglais" rules={[{ required: true, message: "Le contenu est requis" }]}>
//                                 <div data-color-mode="light">

//                                     <ReactQuill
//                                         theme="snow"
//                                         value={content_en}
//                                         onChange={setContentEn}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="Description ..."
//                                         style={{ height: "200px", marginBottom: "24px" }}
//                                     />
//                                 </div>
//                             </Form.Item>

//                             <Form.Item name="status" label="Statut" initialValue="DRAFT">
//                                 <Select size="large">
//                                     <Option value="DRAFT">Brouillon</Option>
//                                     <Option value="PUBLISHED">Publié</Option>
//                                 </Select>
//                             </Form.Item>

//                             <Form.Item label="Image de couverture">
//                                 <Upload {...uploadProps}>
//                                     {fileList.length < 1 && (
//                                         <Button icon={<UploadOutlined />} size="large">
//                                             Sélectionner une image
//                                         </Button>
//                                     )}
//                                 </Upload>
//                                 {fileList.length > 0 && (
//                                     <div style={{ marginTop: "16px" }}>
//                                         <img
//                                             src={fileList[0].url || fileList[0].thumbUrl}
//                                             alt="Aperçu de couverture"
//                                             style={{ 
//                                                 maxWidth: "100%", 
//                                                 maxHeight: "300px", 
//                                                 objectFit: "cover",
//                                                 borderRadius: "8px",
//                                                 border: "1px solid #d9d9d9",
//                                                 display: "block"
//                                             }}
//                                             onError={(e) => {
//                                                 console.error("Erreur de chargement de l'image:", fileList[0].url || fileList[0].thumbUrl);
//                                                 e.target.style.display = "none";
//                                             }}
//                                         />
//                                         <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
//                                             {fileList[0].name || "Image de couverture"}
//                                         </div>
//                                     </div>
//                                 )}
//                             </Form.Item>

//                             <Form.Item label="Galerie d'images">
//                                 <Upload {...galleryUploadProps}>
//                                     <Button icon={<UploadOutlined />}>
//                                         Sélectionner des images
//                                     </Button>
//                                 </Upload>
//                                 {galleryList.length > 0 && (
//                                     <Row gutter={[8, 8]} style={{ marginTop: "8px" }}>
//                                         {galleryList.map((file, index) => (
//                                             <Col key={index}>
//                                                 <img
//                                                     src={file.url || file.thumbUrl}
//                                                     alt={`Gallery ${index}`}
//                                                     style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                                                 />
//                                             </Col>
//                                         ))}
//                                     </Row>
//                                 )}
//                             </Form.Item>


//                             <Form.Item style={{ textAlign: "right", marginTop: "32px" }}>
//                                 <Space size="middle">
//                                     <Button size="large" onClick={() => navigate("/news")}>
//                                         Annuler
//                                     </Button>
//                                     <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">
//                                         {isEdit ? "Mettre à jour" : "Créer"}
//                                     </Button>
//                                 </Space>
//                             </Form.Item>
//                         </Form>
//                     </Card>
//                 </div></div>
//         </div>
//     </>

// }

// export default NewsEdit

"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Card,
  Button,
  Form,
  Input,
  Upload,
  Select,
  Space,
  Spin,
  Typography,
  Row,
  Col,
} from "antd"
import {
  SaveOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import newsService from "../../../services/newsService"
import { toast } from "sonner"
import ReactQuill from "react-quill"
import { buildImageUrl } from "../../../utils/imageUtils"

const { Title } = Typography
const { Option } = Select

const NewsEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()
  const [content_fr, setContentFr] = useState("")
  const [content_en, setContentEn] = useState("")
  const [fileList, setFileList] = useState([])
  const [galleryList, setGalleryList] = useState([])
  const [coverPreview, setCoverPreview] = useState(null) // 👈 URL de preview (backend ou blob)

  useEffect(() => {
    if (isEdit) {
      fetchNews()
    }
  }, [id, isEdit])

  // Nettoyer les URLs de prévisualisation lors du démontage
  useEffect(() => {
    return () => {
      fileList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
      galleryList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [fileList, galleryList])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await newsService.getById(id)
      const newsData = response.news

      form.setFieldsValue({
        title_fr: newsData.title_fr,
        title_en: newsData.title_en,
        status: newsData.status || "DRAFT", // Valeur par défaut si null
      })

      setContentFr(newsData.content_fr)
      setContentEn(newsData.content_en)

      // Image de couverture existante
      if (newsData.image) {
        const builtUrl = buildImageUrl(newsData.image)
        setFileList([
          {
            uid: "-1",
            name: newsData.image.split("/").pop() || "image.jpg",
            status: "done",
            url: builtUrl,
            thumbUrl: builtUrl,
          },
        ])
        setCoverPreview(builtUrl)
      } else {
        setFileList([])
        setCoverPreview(null)
      }

      // Galerie existante
      setGalleryList(
        newsData.galleries?.map((url, index) => ({
          uid: `-${index + 2}`,
          name: `gallery-${index}.jpg`,
          status: "done",
          url: buildImageUrl(url),
        })) || [],
      )
    } catch (error) {
      console.log(error)
      toast.error("Erreur lors du chargement de la news")
      navigate("/admin/news")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values) => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("title_fr", values.title_fr)
      formData.append("title_en", values.title_en)
      formData.append("content_fr", content_fr)
      formData.append("content_en", content_en)
      formData.append("status", values.status || "DRAFT")

      // Ajouter l'image de couverture si c'est un nouveau fichier
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          formData.append("image", fileList[0].originFileObj)
        } else if (fileList[0].url && !fileList[0].url.startsWith('blob:')) {
          // Si c'est une image existante, on ne l'envoie pas (elle est déjà sur le serveur)
          // Le backend gardera l'image existante si aucun nouveau fichier n'est envoyé
        }
      }

      // Ajouter les images de la galerie (seulement les nouveaux fichiers)
      galleryList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("galleries", file.originFileObj)
        }
      })

      if (isEdit) {
        await newsService.update(id, formData)
        toast.success("News mise à jour avec succès")
      } else {
        await newsService.create(formData)
        toast.success("News créée avec succès")
      }

      // Nettoyer les URLs de prévisualisation
      fileList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
      galleryList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
      navigate("/admin/news")
    } catch (error) {
      console.log(error)
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  // Gestion du changement d'image de couverture + preview
  const handleCoverChange = ({ fileList: newFileList }) => {
    // Créer des URLs de prévisualisation pour les nouveaux fichiers
    const updatedFileList = newFileList.map(file => {
      if (file.originFileObj && !file.url && !file.thumbUrl) {
        file.url = URL.createObjectURL(file.originFileObj)
        file.thumbUrl = file.url
      }
      return file
    })
    setFileList(updatedFileList)

    if (updatedFileList.length === 0) {
      setCoverPreview(null)
      return
    }

    const file = updatedFileList[0]
    setCoverPreview(file.url || file.thumbUrl || null)
  }

  // Gestion des images de galerie
  const handleGalleryChange = ({ fileList: newFileList }) => {
    // Créer des URLs de prévisualisation pour les nouveaux fichiers
    const updatedFileList = newFileList.map(file => {
      if (file.originFileObj && !file.url && !file.thumbUrl) {
        file.url = URL.createObjectURL(file.originFileObj)
        file.thumbUrl = file.url
      }
      return file
    })
    setGalleryList(updatedFileList)
  }

  const uploadProps = {
    fileList,
    onChange: handleCoverChange,
    beforeUpload: () => false,
    maxCount: 1,
    accept: "image/*",
    onRemove: (file) => {
      // Nettoyer l'URL de prévisualisation si c'est un nouveau fichier
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
      if (fileList.length === 1) {
        setCoverPreview(null)
      }
    }
  }

  const galleryUploadProps = {
    fileList: galleryList,
    onChange: handleGalleryChange,
    beforeUpload: () => false,
    multiple: true,
    accept: "image/*",
    maxCount: 10,
    onRemove: (file) => {
      // Nettoyer l'URL de prévisualisation si c'est un nouveau fichier
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    )
  }

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ]

  return (
    <>
      <div className="container-fluid relative px-3">
        <div
          className="layout-specing"
          style={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/news")}
                style={{ marginBottom: "16px" }}
              >
                Retour à la liste
              </Button>
              <Title level={2}>
                {isEdit ? "Modifier la News" : "Créer une News"}
              </Title>
            </div>

            <Card>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="title_fr"
                  label="Titre en Français"
                  rules={[{ required: true, message: "Le titre est requis" }]}
                >
                  <Input placeholder="Titre de la news" size="large" />
                </Form.Item>

                <Form.Item
                  name="title_en"
                  label="Titre en Anglais"
                  rules={[{ required: true, message: "Le titre est requis" }]}
                >
                  <Input placeholder="Titre de la news" size="large" />
                </Form.Item>

                <Form.Item
                  label="Contenu en Français"
                  rules={[{ required: true, message: "Le contenu est requis" }]}
                >
                  <div data-color-mode="light">
                    <ReactQuill
                      theme="snow"
                      value={content_fr}
                      onChange={setContentFr}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Description ..."
                      style={{ height: "200px", marginBottom: "24px" }}
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  label="Contenu en Anglais"
                  rules={[{ required: true, message: "Le contenu est requis" }]}
                >
                  <div data-color-mode="light">
                    <ReactQuill
                      theme="snow"
                      value={content_en}
                      onChange={setContentEn}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Description ..."
                      style={{ height: "200px", marginBottom: "24px" }}
                    />
                  </div>
                </Form.Item>

                <Form.Item name="status" label="Statut" initialValue="DRAFT">
                  <Select size="large">
                    <Option value="DRAFT">Brouillon</Option>
                    <Option value="PUBLISHED">Publié</Option>
                  </Select>
                </Form.Item>

                {/* Image de couverture */}
                <Form.Item label="Image de couverture">
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} size="large">
                      {fileList.length > 0 ? "Remplacer l'image" : "Sélectionner une image"}
                    </Button>
                  </Upload>

                  {coverPreview && (
                    <div style={{ marginTop: "16px" }}>
                      <img
                        src={coverPreview}
                        alt="Aperçu de couverture"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #d9d9d9",
                          display: "block",
                        }}
                        onError={(e) => {
                          console.error(
                            "Erreur de chargement de l'image:",
                            coverPreview,
                          )
                          e.currentTarget.style.display = "none"
                        }}
                      />
                      {fileList[0] && (
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {fileList[0].name || "Image de couverture"}
                        </div>
                      )}
                    </div>
                  )}
                </Form.Item>

                {/* Galerie d'images */}
                <Form.Item label="Galerie d'images">
                  <Upload {...galleryUploadProps}>
                    <Button icon={<UploadOutlined />}>
                      Sélectionner des images
                    </Button>
                  </Upload>
                  {galleryList.length > 0 && (
                    <Row gutter={[8, 8]} style={{ marginTop: "8px" }}>
                      {galleryList.map((file, index) => {
                        const imageUrl = file.url || file.thumbUrl
                        return imageUrl ? (
                          <Col key={file.uid || index}>
                            <img
                              src={imageUrl}
                              alt={`Gallery ${index}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          </Col>
                        ) : null
                      })}
                    </Row>
                  )}
                </Form.Item>

                <Form.Item style={{ textAlign: "right", marginTop: "32px" }}>
                  <Space size="middle">
                    <Button
                      size="large"
                      onClick={() => navigate("/admin/news")}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={saving}
                      size="large"
                    >
                      {isEdit ? "Mettre à jour" : "Créer"}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewsEdit
