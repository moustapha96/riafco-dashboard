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
  LinkOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import resourceService from "../../../services/resourceService";
import { Link, useNavigate } from "react-router-dom";
import { buildImageUrl } from "../../../utils/imageUtils";
import { Image } from "antd";

const { Search } = Input;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ResourcesManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const canDelete = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
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
      console.log(response);
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

  // Download resource - utilise la même logique que ResourceDetail
  const handleDownload = async (record) => {
    try {
      // Déterminer l'URL du fichier (priorité: filePath > url > fileName)
      const getFileUrl = () => {
        if (record.filePath) {
          return buildImageUrl(record.filePath);
        }
        if (record.url) {
          // Si url est une URL externe complète, la retourner telle quelle
          if (/^https?:\/\//i.test(record.url)) {
            return record.url;
          }
          return buildImageUrl(record.url);
        }
        if (record.fileName) {
          return buildImageUrl(`/resources/${record.fileName}`);
        }
        return null;
      };

      const fileUrl = getFileUrl();

      if (fileUrl) {
        window.open(fileUrl, "_blank");
      } else {
        // Fallback: utiliser l'endpoint de téléchargement
        try {
          const blob = await resourceService.download(record.id);
          const url = window.URL.createObjectURL(blob.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = record.fileName || 'resource';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading resource:", error);
          toast.error("Erreur lors du téléchargement");
        }
      }
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
      title: "Couverture",
      key: "couverture",
      width: 100,
      render: (_, record) => {
        if (record.couverture) {
          return (
            <Image
              src={buildImageUrl(record.couverture)}
              alt={record.title}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 4 }}
              preview
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E"
            />
          );
        }
        return <FileOutlined style={{ fontSize: 24, color: "#ccc" }} />;
      },
    },
    {
      title: "Titre",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Space>
            <FileOutlined />
            <Link to={`/admin/resources/${record.id}`} style={{ fontWeight: 500 }}>
              {text}
            </Link>
            {record.isPublic ? (
              <CheckCircleOutlined style={{ color: "green" }} title="Publique" />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} title="Privée" />
            )}
          </Space>
          {Array.isArray(record.tags) && record.tags.length > 0 && (
            <Space wrap size={[4, 4]}>
              {record.tags.slice(0, 3).map((tag, i) => (
                <Tag key={`${tag}-${i}`} color="blue" style={{ margin: 0 }}>
                  {tag}
                </Tag>
              ))}
              {record.tags.length > 3 && (
                <Tag color="default" style={{ margin: 0 }}>
                  +{record.tags.length - 3}
                </Tag>
              )}
            </Space>
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
        // fileSize est déjà en MB selon les données fournies
        if (typeof size === 'number') {
          return size >= 1024
            ? (size / 1024).toFixed(2) + " MB"
            : size + " MB";
        }
        return size + " MB";
      },
    },
    {
      title: "Type",
      dataIndex: "fileType",
      key: "fileType",
      render: (type) => {
        if (!type) return "-";
        // Extraire l'extension ou le type principal
        const typeMap = {
          'application/pdf': 'PDF',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
          'image/jpeg': 'JPG',
          'image/png': 'PNG',
        };
        return typeMap[type] || type.split('/').pop().toUpperCase();
      },
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString("fr-FR") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        const hasDownloadableFile = !!(record.filePath || record.url || record.fileName);
        const hasExternalLink = !!(record.lien && /^https?:\/\//i.test(record.lien)) ||
          !!(record.url && /^https?:\/\//i.test(record.url));

        return (
          <Space direction="vertical" size={4}>
            <Space>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/admin/resources/${record.id}`)}
              >
                Voir
              </Button>

              {hasDownloadableFile && (
                <Button
                  type="link"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(record)}
                >
                  Télécharger
                </Button>
              )}

              {hasExternalLink && (
                <Button
                  type="link"
                  size="small"
                  icon={<LinkOutlined />}
                  onClick={() => window.open(record.lien || record.url, "_blank")}
                >
                  Lien
                </Button>
              )}
            </Space>

            {isAuthenticated && (user?.role === "ADMIN" || user?.role === "MODERATOR") && (
              <Space>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingResource(record);
                    form.setFieldsValue({
                      title: record.title,
                      description: record.description,
                      categoryId: record.categoryId,
                      tags: Array.isArray(record.tags) ? record.tags : [],
                      lien: record.lien,
                      isPublic: record.isPublic,
                    });
                    // Réinitialiser les listes de fichiers
                    setFileList([]);
                    setCouvertureList([]);
                    // Si une couverture existe, l'afficher
                    if (record.couverture) {
                      setCouvertureList([{
                        uid: '-1',
                        name: 'couverture',
                        status: 'done',
                        url: buildImageUrl(record.couverture),
                      }]);
                    }
                    setModalVisible(true);
                  }}
                >
                  Modifier
                </Button>
                {canDelete && (
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer cette ressource ?"
                    onConfirm={() => handleDeleteResource(record.id)}
                    okText="Oui"
                    cancelText="Non"
                  >
                    <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            )}
          </Space>
        );
      },
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
        isAuthenticated && canDelete ? (
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
            <h5 className="text-lg font-semibold">Gestion des Ressources</h5>
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
                  {isAuthenticated && (user?.role === "ADMIN" || user?.role === "MEMBER" ||  user?.role ==="SUPER_ADMIN" ) && (
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
                    scroll={{ x: 1200 }}
                    loading={loading}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} ressources`,
                      pageSizeOptions: ['10', '20', '50', '100'],
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
                  tooltip="Image de couverture optionnelle pour la ressource"
                >
                  <Upload {...uploadCouvertureProps} listType="picture-card">
                    {listCouverture.length < 1 && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Ajouter une image</div>
                      </div>
                    )}
                  </Upload>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                    Formats acceptés: JPG, PNG, GIF (max 5MB)
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

                <Form.Item
                  name="lien"
                  label="Lien externe (URL)"
                  tooltip="Lien externe vers une ressource en ligne (optionnel)"
                >
                  <Input
                    placeholder="https://exemple.com/ressource"
                    type="url"
                  />
                </Form.Item>

                <Form.Item
                  label="Ressource publique"
                  name="isPublic"
                  valuePropName="checked"
                  tooltip="Une ressource publique est visible par tous les utilisateurs"
                >
                  <Switch checkedChildren="Publique" unCheckedChildren="Privée" />
                </Form.Item>

                <Form.Item
                  name="tags"
                  label="Tags"
                  tooltip="Appuyez sur Entrée pour ajouter un tag"
                >
                  <Select
                    mode="tags"
                    placeholder="Ajouter des tags (appuyez sur Entrée)"
                    style={{ width: "100%" }}
                    tokenSeparators={[',']}
                  />
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
