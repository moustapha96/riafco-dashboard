// "use client"

// import { useState, useEffect } from "react"
// import {
//     Table,
//     Button,
//     Modal,
//     Form,
//     Input,
//     Select,
//     Upload,
//     Popconfirm,
//     Space,
//     Card,
//     Row,
//     Col,
//     Tag,
//     Tabs,
//     Breadcrumb,
//     Switch,
// } from "antd"
// import {
//     PlusOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     DownloadOutlined,
//     UploadOutlined,
//     SearchOutlined,
//     FileOutlined,
//     FolderOutlined,
//     CheckCircleOutlined,
//     CloseCircleOutlined,
//     SaveFilled,
//     LoadingOutlined,
// } from "@ant-design/icons"
// import { toast } from "sonner"
// import { useAuth } from "../../../hooks/useAuth"
// import resourceService from "../../../services/resourceService";
// import { Link } from "react-router-dom"
// const { Search } = Input
// const { TextArea } = Input
// const { TabPane } = Tabs

// const ResourcesManagement = () => {
//     const { user, isAuthenticated } = useAuth()

//     // States for resources
//     const [resources, setResources] = useState([])
//     const [categories, setCategories] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [modalVisible, setModalVisible] = useState(false)
//     const [categoryModalVisible, setCategoryModalVisible] = useState(false)
//     const [editingResource, setEditingResource] = useState(null)
//     const [editingCategory, setEditingCategory] = useState(null)
//     const [form] = Form.useForm()
//     const [categoryForm] = Form.useForm()
//     const [fileList, setFileList] = useState([])
//     const [listCouverture, setCouvertureList] = useState([])

//     // Pagination and filters
//     const [pagination, setPagination] = useState({
//         current: 1,
//         pageSize: 10,
//         total: 0,
//     })
//     const [searchTerm, setSearchTerm] = useState("")
//     const [selectedCategory, setSelectedCategory] = useState("")

//     // Fetch resources
//     const fetchResources = async (page = 1, limit = 10, search = "", category = "") => {
//         setLoading(true)
//         try {
//             const params = {
//                 page: page.toString(),
//                 limit: limit.toString(),
//                 ...(search && { search }),
//                 ...(category && { category }),
//             }

//             const response = await resourceService.getAll(params)
//             console.log(response)
//             if (response.success) {
//                 setResources(response.data)
//                 setPagination({
//                     current: response.pagination.page,
//                     pageSize: response.pagination.limit,
//                     total: response.pagination.total,
//                 })
//             } else {
//                 toast.error("Erreur lors du chargement des ressources")
//             }
//         } catch (error) {
//             console.error("Error fetching resources:", error)
//             toast.error("Erreur de connexion")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Fetch categories
//     const fetchCategories = async () => {
//         try {
//             const response = await resourceService.getAllCategories()

//             if (response.data) {
//                 setCategories(response.data)
//             }
//         } catch (error) {
//             console.error("Error fetching categories:", error)
//         }
//     }

//     // Create or update resource
//     const handleResourceSubmit = async (values) => {
//         console.log(values)
//         setLoading(true)
//         try {
//             const formData = new FormData()
//             formData.append("title", values.title)
//             formData.append("description", values.description || "")
//             formData.append("categoryId", values.categoryId || "")
//             formData.append("tags", JSON.stringify(values.tags || []))
//             formData.append("isPublic", values.isPublic)
//             formData.append("lien", values.lien)

//             if (fileList.length > 0 && fileList[0].originFileObj) {
//                 formData.append("file", fileList[0].originFileObj)
//             }
//             if (listCouverture.length > 0 && listCouverture[0].originFileObj) {
//                 formData.append("couverture", listCouverture[0].originFileObj)
//             }

//             const response = editingResource
//                 ? await resourceService.update(editingResource.id, formData)
//                 : await resourceService.create(formData)

//             if (response.success) {
//                 toast.success(editingResource ? "Ressource mise à jour" : "Ressource créée")
//                 setModalVisible(false)
//                 setEditingResource(null)
//                 form.resetFields()
//                 setFileList([])
//                 fetchResources(pagination.current, pagination.pageSize, searchTerm, selectedCategory)
//             } else {
//                 toast.error(response.message || "Erreur lors de la sauvegarde")
//             }
//         } catch (error) {
//             console.error("Error saving resource:", error)
//             toast.error(error.message || "Erreur lors de la sauvegarde")
//             toast.error(error.error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Delete resource
//     const handleDeleteResource = async (id) => {
//         try {
//             const response = await resourceService.delete(id)

//             if (response.success) {
//                 toast.success("Ressource supprimée")
//                 fetchResources(pagination.current, pagination.pageSize, searchTerm, selectedCategory)
//             } else {
//                 toast.error(response.message || "Erreur lors de la suppression")
//             }
//         } catch (error) {
//             console.error("Error deleting resource:", error)
//             toast.error("Erreur de connexion")
//         }
//     }

//     // Download resource

//     const handleDownload = async (record) => {
//         try {
//             console.log(record.fileName)
//             window.open(record.fileName, "_blank");
//         } catch (error) {
//             console.error("Error downloading resource:", error);
//             toast.error("Erreur de connexion");
//         }
//     };

//     const handleCategorySubmit = async (values) => {
//         console.log(values)
//         try {
//             const response = editingCategory
//                 ? await resourceService.updateCategory(editingCategory.id, values)
//                 : await resourceService.createCategory(values)

//             if (response.success) {
//                 toast.success(editingCategory ? "Catégorie mise à jour" : "Catégorie créée")
//                 setCategoryModalVisible(false)
//                 setEditingCategory(null)
//                 categoryForm.resetFields()
//                 fetchCategories()
//             } else {
//                 toast.error(response || "Erreur lors de la sauvegarde")
//             }
//         } catch (error) {
//             console.log(error)
//             console.error("Error saving category:", error)
//             toast.error("Erreur de connexion")
//         }
//     }

//     const handleDeleteCategory = async (id) => {
//         try {
//             const response = await resourceService.deleteCategory(id)

//             if (response.success) {
//                 toast.success("Catégorie supprimée")
//                 fetchCategories()
//             } else {
//                 toast.error(response || "Erreur lors de la suppression")
//             }
//         } catch (error) {
//             console.error("Error deleting category:", error)
//             toast.error("Erreur de connexion")
//         }
//     }

//     // Upload props
//     const uploadProps = {
//         fileList,
//         beforeUpload: () => false, // Prevent auto upload
//         onChange: ({ fileList }) => setFileList(fileList),
//         maxCount: 1,
//         accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpeg,.jpg,.png,.gif,.webp,.mp4,.mp3,.zip,.rar",
//     }

//     const uploadCouvertureProps = {
//         fileList: listCouverture,
//         beforeUpload: () => false, // Prevent auto upload
//         onChange: ({ fileList }) => setCouvertureList(fileList),
//         maxCount: 1,
//         accept: ".jpeg,.jpg,.png",
//     }


//     // Table columns for resources
//     const resourceColumns = [
//         {
//             title: "Titre",
//             dataIndex: "title",
//             key: "title",
//             render: (text, record) => (
//                 <Space>
//                     <FileOutlined />
//                     <span>{text}</span>
//                     {record.isPublic ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
//                 </Space>
//             ),
//         },
//         {
//             title: "Catégorie",
//             dataIndex: ["category", "name"],
//             key: "category",
//             render: (text) => (text ? <Tag color="blue">{text}</Tag> : "-"),
//         },
//         {
//             title: "Taille",
//             dataIndex: "fileSize",
//             key: "fileSize",
//             render: (size) => {
//                 if (!size) return "-"
//                 const mb = (size / (1024 * 1024)).toFixed(2)
//                 return `${mb} MB`
//             },
//         },
//         {
//             title: "Date de création",
//             dataIndex: "createdAt",
//             key: "createdAt",
//             render: (date) => new Date(date).toLocaleDateString("fr-FR"),
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <Space>
//                     <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
//                         Télécharger
//                     </Button>

//                     {isAuthenticated && (user?.role === "ADMIN" || user?.role === "MODERATOR") && (
//                         <>
//                             <Button
//                                 type="link"
//                                 icon={<EditOutlined />}
//                                 onClick={() => {
//                                     setEditingResource(record)
//                                     console.log(record)
//                                     form.setFieldsValue({
//                                         title: record.title,
//                                         description: record.description,
//                                         categoryId: record.categoryId,
//                                         tags: record.tags,
//                                         lien: record.lien,
//                                     })
//                                     setModalVisible(true)
//                                 }}
//                             >
//                                 Modifier
//                             </Button>
//                             <Popconfirm
//                                 title="Êtes-vous sûr de vouloir supprimer cette ressource ?"
//                                 onConfirm={() => handleDeleteResource(record.id)}
//                                 okText="Oui"
//                                 cancelText="Non"
//                             >
//                                 <Button type="link" danger icon={<DeleteOutlined />}>
//                                     Supprimer
//                                 </Button>
//                             </Popconfirm>
//                         </>
//                     )}
//                 </Space>
//             ),
//         },
//     ]

//     // Table columns for categories
//     const categoryColumns = [
//         {
//             title: "Nom",
//             dataIndex: "name",
//             key: "name",
//             render: (text) => (
//                 <Space>
//                     <FolderOutlined />
//                     <span>{text}</span>
//                 </Space>
//             ),
//         },
//         {
//             title: "Description",
//             dataIndex: "description",
//             key: "description",
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) =>
//                 isAuthenticated &&
//                 user?.role === "ADMIN" && (
//                     <Space>
//                         <Button
//                             type="link"
//                             icon={<EditOutlined />}
//                             onClick={() => {
//                                 setEditingCategory(record)
//                                 categoryForm.setFieldsValue({
//                                     name: record.name,
//                                     description: record.description,
//                                 })
//                                 setCategoryModalVisible(true)
//                             }}
//                         >
//                             Modifier
//                         </Button>
//                         <Popconfirm
//                             title="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
//                             onConfirm={() => handleDeleteCategory(record.id)}
//                             okText="Oui"
//                             cancelText="Non"
//                         >
//                             <Button type="link" danger icon={<DeleteOutlined />}>
//                                 Supprimer
//                             </Button>
//                         </Popconfirm>
//                     </Space>
//                 ),
//         },
//     ]

//     // Effects
//     useEffect(() => {
//         fetchResources()
//         fetchCategories()
//     }, [])

//     // Handle search and filters
//     const handleSearch = (value) => {
//         setSearchTerm(value)
//         fetchResources(1, pagination.pageSize, value, selectedCategory)
//     }

//     const handleCategoryFilter = (value) => {
//         setSelectedCategory(value)
//         fetchResources(1, pagination.pageSize, searchTerm, value)
//     }

//     const handleTableChange = (paginationInfo) => {
//         fetchResources(paginationInfo.current, paginationInfo.pageSize, searchTerm, selectedCategory)
//     }

//     return <>
//         <div className="container-fluid relative px-3">
//             <div className="layout-specing" style={{
//                 maxHeight: "calc(100vh - 100px)",
//                 overflowY: "auto",
//                 paddingRight: "8px"
//             }}>
//                 <div className="md:flex justify-between items-center mb-6">
//                     <h5 className="text-lg font-semibold">
//                         Gestion des Articles
//                     </h5>
//                     <Breadcrumb
//                         items={[
//                             { title: <Link to="/">Tableau de bord</Link> },
//                             { title: "Gestion des Reources" },
//                         ]}
//                     />
//                 </div>

//                 <div style={{ padding: "24px" }}>
//                     <Card>
//                         <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
//                             <Col>
//                                 <h2>Gestion des Ressources</h2>
//                             </Col>
//                             <Col>
//                                 {isAuthenticated && (user?.role === "ADMIN" || user?.role === "MODERATOR") && (
//                                     <Button
//                                         type="primary"
//                                         icon={<PlusOutlined />}
//                                         onClick={() => {
//                                             setEditingResource(null)
//                                             form.resetFields()
//                                             setFileList([])
//                                             setModalVisible(true)
//                                         }}
//                                     >
//                                         Nouvelle Ressource
//                                     </Button>
//                                 )}
//                             </Col>
//                         </Row>

//                         <Tabs defaultActiveKey="resources">
//                             <TabPane tab="Ressources" key="resources">
//                                 <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
//                                     <Col xs={24} sm={12} md={8}>
//                                         <Search
//                                             placeholder="Rechercher des ressources..."
//                                             allowClear
//                                             enterButton={<SearchOutlined />}
//                                             onSearch={handleSearch}
//                                         />
//                                     </Col>
//                                     <Col xs={24} sm={12} md={8}>
//                                         <Select
//                                             placeholder="Filtrer par catégorie"
//                                             allowClear
//                                             style={{ width: "100%" }}
//                                             onChange={handleCategoryFilter}
//                                         >
//                                             {categories.map((category) => (
//                                                 <Select.Option key={category.id} value={category.id}>
//                                                     {category.name}
//                                                 </Select.Option>
//                                             ))}
//                                         </Select>
//                                     </Col>
//                                 </Row>

//                                 <Table
//                                     columns={resourceColumns}
//                                     dataSource={resources}
//                                     rowKey="id"
//                                     scroll={{ x: true }}
//                                     loading={loading}
//                                     pagination={{
//                                         ...pagination,
//                                         showSizeChanger: true,
//                                         showQuickJumper: true,
//                                         showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} ressources`,
//                                     }}
//                                     onChange={handleTableChange}
//                                 />
//                             </TabPane>

//                             {isAuthenticated && user?.role === "ADMIN" && (
//                                 <TabPane tab="Catégories" key="categories">
//                                     <Row justify="end" style={{ marginBottom: "16px" }}>
//                                         <Button
//                                             type="primary"
//                                             icon={<PlusOutlined />}
//                                             onClick={() => {
//                                                 setEditingCategory(null)
//                                                 categoryForm.resetFields()
//                                                 setCategoryModalVisible(true)
//                                             }}
//                                         >
//                                             Nouvelle Catégorie
//                                         </Button>
//                                     </Row>

//                                     <Table columns={categoryColumns}
//                                         dataSource={categories}
//                                         scroll={{ x: "max-content" }}
//                                         rowKey="id" pagination={false} />
//                                 </TabPane>
//                             )}
//                         </Tabs>
//                     </Card>

//                     {/* Resource Modal */}
//                     <Modal
//                         title={editingResource ? "Modifier la Ressource" : "Nouvelle Ressource"}
//                         open={modalVisible}
//                         onCancel={() => {
//                             setModalVisible(false)
//                             setEditingResource(null)
//                             form.resetFields()
//                             setFileList([])
//                         }}
//                         footer={null}
//                         width={600}
//                     >
//                         <Form form={form} layout="vertical" onFinish={handleResourceSubmit}>
//                             <Form.Item
//                                 name="title"
//                                 label="Titre"
//                                 rules={[
//                                     { required: true, message: "Le titre est requis" },
//                                     { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" },
//                                 ]}
//                             >
//                                 <Input placeholder="Titre de la ressource" />
//                             </Form.Item>

//                             <Form.Item
//                                 label="Image deCouverture"
//                                 rules={!editingResource ? [{ message: "L'image de couverture'" }] : []}
//                             >
//                                 <Upload {...uploadCouvertureProps}>
//                                     <Button icon={<UploadOutlined />}>
//                                         {editingResource ? "Remplacer l'image" : "Sélectionner une image"}
//                                     </Button>
//                                 </Upload>
//                                 <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
//                                     Formats acceptés: images
//                                 </div>
//                             </Form.Item>


//                             <Form.Item
//                                 name="description"
//                                 label="Description"
//                                 rules={[{ max: 1000, message: "La description ne peut pas dépasser 1000 caractères" }]}
//                             >
//                                 <TextArea rows={4} placeholder="Description de la ressource" />
//                             </Form.Item>

//                             <Form.Item name="categoryId" label="Catégorie">
//                                 <Select placeholder="Sélectionner une catégorie" allowClear>
//                                     {categories.map((category) => (
//                                         <Select.Option key={category.id} value={category.id}>
//                                             {category.name}
//                                         </Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>

//                              <Form.Item name="lien" label="Url ressource">
//                                 <Input placeholder="Url de la ressource" />
//                             </Form.Item>


//                             <Form.Item name="tags" label="Tags">
//                                 <Select mode="tags" placeholder="Ajouter des tags" style={{ width: "100%" }} />
//                             </Form.Item>

//                             <Form.Item
//                                 label="Fichier"
//                                 rules={!editingResource ? [{ required: true, message: "Un fichier est requis" }] : []}
//                             >
//                                 <Upload {...uploadProps}>
//                                     <Button icon={<UploadOutlined />}>
//                                         {editingResource ? "Remplacer le fichier" : "Sélectionner un fichier"}
//                                     </Button>
//                                 </Upload>
//                                 <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
//                                     Formats acceptés: PDF, DOC, XLS, PPT, images, vidéos, archives (max 50MB)
//                                 </div>
//                             </Form.Item>

//                             <Form.Item
//                                 label="Ressource publique"
//                                 name="isPublic"
//                                 valuePropName="checked"
//                             >
//                                 <Switch />
//                             </Form.Item>

//                             <Form.Item>
//                                 <Space>
//                                     <Button type="primary" htmlType="submit"
//                                         loading={loading}
//                                         disabled={loading}
//                                         icon={loading ? <LoadingOutlined /> : <SaveFilled />}
//                                     >
//                                         {editingResource ? "Mettre à jour" : "Créer"}
//                                     </Button>
//                                     <Button

//                                         onClick={() => {
//                                             setModalVisible(false)
//                                             setEditingResource(null)
//                                             form.resetFields()
//                                             setFileList([])
//                                         }}
//                                     >
//                                         Annuler
//                                     </Button>
//                                 </Space>
//                             </Form.Item>
//                         </Form>
//                     </Modal>

//                     {/* Category Modal */}
//                     <Modal
//                         title={editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
//                         open={categoryModalVisible}
//                         onCancel={() => {
//                             setCategoryModalVisible(false)
//                             setEditingCategory(null)
//                             categoryForm.resetFields()
//                         }}
//                         footer={null}
//                     >
//                         <Form form={categoryForm} layout="vertical" onFinish={handleCategorySubmit}>
//                             <Form.Item
//                                 name="name"
//                                 label="Nom"
//                                 rules={[
//                                     { required: true, message: "Le nom est requis" },
//                                     { min: 2, max: 100, message: "Le nom doit contenir entre 2 et 100 caractères" },
//                                 ]}
//                             >
//                                 <Input placeholder="Nom de la catégorie" />
//                             </Form.Item>

//                             <Form.Item
//                                 name="description"
//                                 label="Description"
//                                 rules={[{ max: 500, message: "La description ne peut pas dépasser 500 caractères" }]}
//                             >
//                                 <TextArea rows={3} placeholder="Description de la catégorie" />
//                             </Form.Item>

//                             <Form.Item>
//                                 <Space>
//                                     <Button type="primary" htmlType="submit">
//                                         {editingCategory ? "Mettre à jour" : "Créer"}
//                                     </Button>
//                                     <Button
//                                         onClick={() => {
//                                             setCategoryModalVisible(false)
//                                             setEditingCategory(null)
//                                             categoryForm.resetFields()
//                                         }}
//                                     >
//                                         Annuler
//                                     </Button>
//                                 </Space>
//                             </Form.Item>
//                         </Form>
//                     </Modal>
//                 </div>
//             </div>
//         </div>
//     </>

// }

// export default ResourcesManagement

// src/pages/resources/ResourcesManagement.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Popconfirm,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Tabs,
  Breadcrumb,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  SearchOutlined,
  FileOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SaveFilled,
  LoadingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import resourceService from "../../../services/resourceService";
import { Link, useNavigate } from "react-router-dom";

const { Search } = Input;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ResourcesManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // States for resources
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [listCouverture, setCouvertureList] = useState([]);

  // Pagination and filters
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch resources
  const fetchResources = async (page = 1, limit = 10, search = "", category = "") => {
    setLoading(true);
    try {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
      };

      const response = await resourceService.getAll(params);
      if (response.success) {
        setResources(response.data);
        setPagination({
          current: response.pagination.page,
          pageSize: response.pagination.limit,
          total: response.pagination.total,
        });
      } else {
        toast.error("Erreur lors du chargement des ressources");
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await resourceService.getAllCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Create or update resource
  const handleResourceSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("categoryId", values.categoryId || "");
      formData.append("tags", JSON.stringify(values.tags || []));
      formData.append("isPublic", values.isPublic);
      formData.append("lien", values.lien);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
      if (listCouverture.length > 0 && listCouverture[0].originFileObj) {
        formData.append("couverture", listCouverture[0].originFileObj);
      }

      const response = editingResource
        ? await resourceService.update(editingResource.id, formData)
        : await resourceService.create(formData);

      if (response.success) {
        toast.success(editingResource ? "Ressource mise à jour" : "Ressource créée");
        setModalVisible(false);
        setEditingResource(null);
        form.resetFields();
        setFileList([]);
        setCouvertureList([]);
        fetchResources(pagination.current, pagination.pageSize, searchTerm, selectedCategory);
      } else {
        toast.error(response.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // Delete resource
  const handleDeleteResource = async (id) => {
    try {
      const response = await resourceService.delete(id);
      if (response.success) {
        toast.success("Ressource supprimée");
        fetchResources(pagination.current, pagination.pageSize, searchTerm, selectedCategory);
      } else {
        toast.error(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Erreur de connexion");
    }
  };

  // Download resource
  const handleDownload = async (record) => {
    try {
      // backend renvoie `url` prioritaire, fallback fileName
      const url = record.url || record.fileName;
      if (url) window.open(url, "_blank");
      else toast.error("Aucun fichier disponible.");
    } catch (error) {
      console.error("Error downloading resource:", error);
      toast.error("Erreur de connexion");
    }
  };

  const handleCategorySubmit = async (values) => {
    try {
      const response = editingCategory
        ? await resourceService.updateCategory(editingCategory.id, values)
        : await resourceService.createCategory(values);

      if (response.success) {
        toast.success(editingCategory ? "Catégorie mise à jour" : "Catégorie créée");
        setCategoryModalVisible(false);
        setEditingCategory(null);
        categoryForm.resetFields();
        fetchCategories();
      } else {
        toast.error(response || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Erreur de connexion");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await resourceService.deleteCategory(id);
      if (response.success) {
        toast.success("Catégorie supprimée");
        fetchCategories();
      } else {
        toast.error(response || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Erreur de connexion");
    }
  };

  // Upload props
  const uploadProps = {
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList }) => setFileList(fileList),
    maxCount: 1,
    accept:
      ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpeg,.jpg,.png,.gif,.webp,.mp4,.mp3,.zip,.rar",
  };

  const uploadCouvertureProps = {
    fileList: listCouverture,
    beforeUpload: () => false,
    onChange: ({ fileList }) => setCouvertureList(fileList),
    maxCount: 1,
    accept: ".jpeg,.jpg,.png",
  };

  // Table columns for resources
  const resourceColumns = [
    {
      title: "Titre",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <FileOutlined />
          <Link to={`/resources/${record.id}`}>{text}</Link>
          {record.isPublic ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red" }} />
          )}
        </Space>
      ),
    },
    {
      title: "Catégorie",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : "-"),
    },
    {
      title: "Taille",
      dataIndex: "fileSize",
      key: "fileSize",
      render: (size) => {
        if (!size) return "-";
        const mb = (size / (1024 * 1024)).toFixed(2);
        return `${mb} MB`;
      },
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("fr-FR"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/resources/${record.id}`)}
          >
            Voir
          </Button>

          <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
            Télécharger
          </Button>

          {isAuthenticated && (user?.role === "ADMIN" || user?.role === "MODERATOR") && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingResource(record);
                  form.setFieldsValue({
                    title: record.title,
                    description: record.description,
                    categoryId: record.categoryId,
                    tags: record.tags,
                    lien: record.lien,
                  });
                  setModalVisible(true);
                }}
              >
                Modifier
              </Button>
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer cette ressource ?"
                onConfirm={() => handleDeleteResource(record.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  Supprimer
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Table columns for categories
  const categoryColumns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <FolderOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        isAuthenticated && user?.role === "ADMIN" ? (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingCategory(record);
                categoryForm.setFieldsValue({
                  name: record.name,
                  description: record.description,
                });
                setCategoryModalVisible(true);
              }}
            >
              Modifier
            </Button>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
              onConfirm={() => handleDeleteCategory(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Supprimer
              </Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  // Effects
  useEffect(() => {
    fetchResources();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search and filters
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchResources(1, pagination.pageSize, value, selectedCategory);
  };

  const handleCategoryFilter = (value) => {
    setSelectedCategory(value);
    fetchResources(1, pagination.pageSize, searchTerm, value);
  };

  const handleTableChange = (paginationInfo) => {
    fetchResources(paginationInfo.current, paginationInfo.pageSize, searchTerm, selectedCategory);
  };

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
          <div className="md:flex justify-between items-center mb-6">
            <h5 className="text-lg font-semibold">Gestion des Articles</h5>
            <Breadcrumb
              items={[{ title: <Link to="/">Tableau de bord</Link> }, { title: "Gestion des Reources" }]}
            />
          </div>

          <div style={{ padding: "24px" }}>
            <Card>
              <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                <Col>
                  <h2>Gestion des Ressources</h2>
                </Col>
                <Col>
                  {isAuthenticated && (user?.role === "ADMIN" || user?.role === "MODERATOR") && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingResource(null);
                        form.resetFields();
                        setFileList([]);
                        setCouvertureList([]);
                        setModalVisible(true);
                      }}
                    >
                      Nouvelle Ressource
                    </Button>
                  )}
                </Col>
              </Row>

              <Tabs defaultActiveKey="resources">
                <TabPane tab="Ressources" key="resources">
                  <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                    <Col xs={24} sm={12} md={8}>
                      <Search
                        placeholder="Rechercher des ressources..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={handleSearch}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Select
                        placeholder="Filtrer par catégorie"
                        allowClear
                        style={{ width: "100%" }}
                        onChange={handleCategoryFilter}
                      >
                        {categories.map((category) => (
                          <Select.Option key={category.id} value={category.id}>
                            {category.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>

                  <Table
                    columns={resourceColumns}
                    dataSource={resources}
                    rowKey="id"
                    scroll={{ x: true }}
                    loading={loading}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} ressources`,
                    }}
                    onChange={handleTableChange}
                  />
                </TabPane>

                {isAuthenticated && user?.role === "ADMIN" && (
                  <TabPane tab="Catégories" key="categories">
                    <Row justify="end" style={{ marginBottom: "16px" }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setEditingCategory(null);
                          categoryForm.resetFields();
                          setCategoryModalVisible(true);
                        }}
                      >
                        Nouvelle Catégorie
                      </Button>
                    </Row>

                    <Table
                      columns={categoryColumns}
                      dataSource={categories}
                      scroll={{ x: "max-content" }}
                      rowKey="id"
                      pagination={false}
                    />
                  </TabPane>
                )}
              </Tabs>
            </Card>

            {/* Resource Modal */}
            <Modal
              title={editingResource ? "Modifier la Ressource" : "Nouvelle Ressource"}
              open={modalVisible}
              onCancel={() => {
                setModalVisible(false);
                setEditingResource(null);
                form.resetFields();
                setFileList([]);
                setCouvertureList([]);
              }}
              footer={null}
              width={600}
            >
              <Form form={form} layout="vertical" onFinish={handleResourceSubmit}>
                <Form.Item
                  name="title"
                  label="Titre"
                  rules={[
                    { required: true, message: "Le titre est requis" },
                    { min: 3, max: 200, message: "Le titre doit contenir entre 3 et 200 caractères" },
                  ]}
                >
                  <Input placeholder="Titre de la ressource" />
                </Form.Item>

                <Form.Item
                  label="Image de Couverture"
                  rules={!editingResource ? [{ message: "L'image de couverture" }] : []}
                >
                  <Upload {...uploadCouvertureProps}>
                    <Button icon={<UploadOutlined />}>
                      {editingResource ? "Remplacer l'image" : "Sélectionner une image"}
                    </Button>
                  </Upload>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                    Formats acceptés: images
                  </div>
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ max: 1000, message: "La description ne peut pas dépasser 1000 caractères" }]}
                >
                  <TextArea rows={4} placeholder="Description de la ressource" />
                </Form.Item>

                <Form.Item name="categoryId" label="Catégorie">
                  <Select placeholder="Sélectionner une catégorie" allowClear>
                    {categories.map((category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="lien" label="Url ressource">
                  <Input placeholder="Url de la ressource" />
                </Form.Item>

                <Form.Item name="tags" label="Tags">
                  <Select mode="tags" placeholder="Ajouter des tags" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  label="Fichier"
                  rules={!editingResource ? [{ required: true, message: "Un fichier est requis" }] : []}
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>
                      {editingResource ? "Remplacer le fichier" : "Sélectionner un fichier"}
                    </Button>
                  </Upload>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                    Formats acceptés: PDF, DOC, XLS, PPT, images, vidéos, archives (max 50MB)
                  </div>
                </Form.Item>

                <Form.Item label="Ressource publique" name="isPublic" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      disabled={loading}
                      icon={loading ? <LoadingOutlined /> : <SaveFilled />}
                    >
                      {editingResource ? "Mettre à jour" : "Créer"}
                    </Button>
                    <Button
                      onClick={() => {
                        setModalVisible(false);
                        setEditingResource(null);
                        form.resetFields();
                        setFileList([]);
                        setCouvertureList([]);
                      }}
                    >
                      Annuler
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>

            {/* Category Modal */}
            <Modal
              title={editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
              open={categoryModalVisible}
              onCancel={() => {
                setCategoryModalVisible(false);
                setEditingCategory(null);
                categoryForm.resetFields();
              }}
              footer={null}
            >
              <Form form={categoryForm} layout="vertical" onFinish={handleCategorySubmit}>
                <Form.Item
                  name="name"
                  label="Nom"
                  rules={[
                    { required: true, message: "Le nom est requis" },
                    { min: 2, max: 100, message: "Le nom doit contenir entre 2 et 100 caractères" },
                  ]}
                >
                  <Input placeholder="Nom de la catégorie" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ max: 500, message: "La description ne peut pas dépasser 500 caractères" }]}
                >
                  <TextArea rows={3} placeholder="Description de la catégorie" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {editingCategory ? "Mettre à jour" : "Créer"}
                    </Button>
                    <Button
                      onClick={() => {
                        setCategoryModalVisible(false);
                        setEditingCategory(null);
                        categoryForm.resetFields();
                      }}
                    >
                      Annuler
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourcesManagement;
