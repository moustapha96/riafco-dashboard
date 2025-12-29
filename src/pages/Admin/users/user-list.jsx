
// export default UserListAdmin;
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Tag, Space, Avatar, Breadcrumb, Button,  Input, Select, message, Modal } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { PiPlusDuotone } from "react-icons/pi";
import userService from "../../../services/userService";
import { useAuth } from "../../../hooks/useAuth";
import { buildImageUrl } from "../../../utils/imageUtils";


const { Search } = Input;

const UserListAdmin = () => {
        const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        search: "",
        role: null,
        status: null,
    });
    const [sortConfig, setSortConfig] = useState({
        field: "createdAt",
        order: "descend",
    });

    const navigate = useNavigate();

    // Fonction pour récupérer les utilisateurs avec gestion des filtres et tri
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
                search: filters.search,
                ...(filters.role && { role: filters.role }),
                ...(filters.status && { status: filters.status }),
                sortBy: sortConfig.field,
                sortOrder: sortConfig.order === "ascend" ? "asc" : "desc",
                permissions : filters.permissions
            };
            console.log(params);
            const response = await userService.getAll(params);
            // Toujours exclure les SUPER_ADMIN de l'affichage
            setUsers(response.users.filter(user => user.role !== "SUPER_ADMIN"));

            setPagination(prev => ({
                ...prev,
                total: response.pagination.total,
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, filters, sortConfig]);

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        fetchUsers();
    }, [fetchUsers]);

    const handleTableChange = (newPagination, newFilters, sorter) => {
        // Gérer la pagination
        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            setPagination({
                ...pagination,
                current: newPagination.current,
                pageSize: newPagination.pageSize,
            });
        }

        // Gérer le tri
        if (sorter && sorter.field) {
            setSortConfig({
                field: sorter.field,
                order: sorter.order,
            });
        }
    };

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        setPagination(prev => ({ ...prev, current: 1 })); // Réinitialiser à la première page
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, current: 1 })); 
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            role: null,
            status: null,
        });
        setPagination(prev => ({ ...prev, current: 1 }));
    };


    const handleDeleteUser = async (userId) => {
        try {
            await userService.delete(userId);
            message.success("Utilisateur supprimé avec succès");
            fetchUsers();
        } catch (error) {
            message.error("Échec de la suppression");
            console.error(error);
        }
    };


    const roleOptions = [
        { value: "ADMIN", label: "Administrateur" },
        { value: "MEMBER", label: "Membre" },
        { value: "GUEST", label: "Inivité" },
    ];

    const permissionsOptions = [
        { value: "GERER_ACTIVITES", label: "Gérer les activités" },
        { value: "GERER_RESSOURCES", label: "Gérer les ressources" },
        { value: "GERER_UTILISATEURS", label: "Gérer les utilisateurs" },
        { value: "GERER_BUREAUX", label: "Gérer les bureaux" },
        { value: "GERER_ACTUALITES", label: "Gérer les actualités" },
        { value: "GERER_PARTENARIATS", label: "Gérer les partenariats" },
    ]

    const statusOptions = [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" },
    ];

    const columns = [
        {
            title: "Nom complet",
            dataIndex: ["firstName", "lastName"],
            key: "name",
            sorter: true,
            render: (_, record) => (
                <Space size="middle">
                    <Avatar
                        size="default"
                        icon={<UserOutlined />}
                        src={buildImageUrl(record.profilePic)}
                    />
                    <Link to={`/admin/users/${record.id}/details`}>
                        {record.firstName} {record.lastName}
                    </Link>
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: true,
        },
        {
            title: "Téléphone",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => phone || "N/A",
        },
        {
            title: "Rôle",
            dataIndex: "role",
            key: "role",
            filters: roleOptions,
            filterSearch: true,
            onFilter: (value, record) => record.role === value,
            render: (role) => (
                <Tag color=
                    {role === "ADMIN"
                    ? "red" : role === "MEMBER"
                        ? "blue" : "green"}>
                    
                    {role === "ADMIN"
                        ? "Administrateur" :
                        role === "MEMBER"
                            ? "Membre" : "Invité"}
                </Tag>
            ),
        },
        {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            filters: statusOptions,
            filterSearch: true,
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={status === "ACTIVE" ? "green" : "red"}>
                    {status === "ACTIVE" ? "Actif" : "Inactif"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link">
                        <Link to={`/admin/users/${record.id}/details`}>Détails</Link>
                    </Button>
                    <Button type="link">
                        <Link to={`/admin/users/${record.id}/edit`}>Modifier</Link>
                    </Button>

                    {(currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN") && record.role !== "SUPER_ADMIN" && (
                        <Button
                            type="link"
                            danger
                            onClick={() => {
                                // Logique pour supprimer l'utilisateur (exemple avec confirmation)
                                Modal.confirm({
                                    title: "Supprimer cet utilisateur ?",
                                    content: "Cette action est irréversible.",
                                    okText: "Supprimer",
                                    okType: "danger",
                                    cancelText: "Annuler",
                                    onOk: () => {
                                        // Appeler votre fonction de suppression ici
                                        handleDeleteUser(record.id);
                                    },
                                });
                            }}
                        >
                            Supprimer
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Liste des utilisateurs</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Tableau de bord</Link> },
                            { title: "Liste des utilisateurs" },
                        ]}
                    />
                </div>

                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                   

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                        <div className="w-full md:flex-1">
                            <Search
                                placeholder="Rechercher un utilisateur..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                className="w-full"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 w-full md:w-auto justify-start sm:justify-center md:justify-end">
                            <Select
                                placeholder="Filtrer par rôle"
                                allowClear
                                className="w-full sm:w-44"
                                onChange={(value) => handleFilterChange("role", value)}
                                options={roleOptions}
                            />
                            <Select
                                placeholder="Filtrer par statut"
                                allowClear
                                className="w-full sm:w-44"
                                onChange={(value) => handleFilterChange("status", value)}
                                options={statusOptions}
                            />
                            <Select
                                placeholder="Filtrer par permissions"
                                allowClear
                                className="w-full sm:w-44"
                                onChange={(value) => handleFilterChange("permissions", value)}
                                options={permissionsOptions}
                            />
                            <Button className="w-full sm:w-auto" onClick={clearFilters}>
                                Réinitialiser
                            </Button>
                        </div>

                       
                        <div className="w-full md:w-auto flex justify-start md:justify-end">
                            <Button
                                type="primary"
                                onClick={() => navigate("/admin/users/create")}
                                icon={<PiPlusDuotone />}
                                className="w-full sm:w-auto"
                            >
                                Nouvel Utilisateur
                            </Button>
                        </div>
                    </div>

                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        showTotal: (total) => `Total ${total} utilisateurs`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: true }}
                    className="responsive-table"
                />
            </div>
        </div>
    );
};

export default UserListAdmin;
