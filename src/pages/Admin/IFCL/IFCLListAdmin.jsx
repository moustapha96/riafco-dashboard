// "use client"

// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { Table, Tag, Space, Avatar, Breadcrumb, Button, Input, Select, message, Popconfirm } from "antd"
// import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, GlobalOutlined } from "@ant-design/icons"
// import ifclService from "../../../services/ifclService"

// const { Search } = Input
// const { Option } = Select

// const IFCLListAdmin = () => {
//     const [ifcls, setIfcls] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [searchTerm, setSearchTerm] = useState("")
//     const [statusFilter, setStatusFilter] = useState("")
//     const [pagination, setPagination] = useState({
//         current: 1,
//         pageSize: 10,
//         total: 0,
//     })

//     useEffect(() => {
//         document.documentElement.setAttribute("dir", "ltr")
//         document.documentElement.classList.add("light")
//         document.documentElement.classList.remove("dark")
//         fetchIFCLs()
//     }, [pagination.current, pagination.pageSize, searchTerm, statusFilter])

//     const fetchIFCLs = async () => {
//         setLoading(true)
//         try {
//             const params = {
//                 page: pagination.current,
//                 limit: pagination.pageSize,
//                 ...(searchTerm && { search: searchTerm }),
//                 ...(statusFilter && { status: statusFilter }),
//             }

//             const response = await ifclService.getAll(params)
//             console.log("Réponse de l'API:", response.datas)

//             setIfcls(response.countries || response.datas)
//             setPagination({
//                 ...pagination,
//                 total: response.pagination?.total || response.total || 0,
//             })
//         } catch (error) {
//             console.error("Erreur lors de la récupération des IFCL:", error)
//             message.error("Erreur lors du chargement des IFCL")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleDelete = async (id) => {
//         try {
//             await ifclService.delete(id)
//             message.success("IFCL supprimé avec succès")
//             fetchIFCLs()
//         } catch (error) {
//             console.error("Erreur lors de la suppression:", error)
//             message.error("Erreur lors de la suppression")
//         }
//     }

//     const handleTableChange = (newPagination) => {
//         setPagination({
//             ...pagination,
//             current: newPagination.current,
//             pageSize: newPagination.pageSize,
//         })
//     }

//     const handleSearch = (value) => {
//         setSearchTerm(value)
//         setPagination({ ...pagination, current: 1 })
//     }

//     const handleStatusFilter = (value) => {
//         setStatusFilter(value)
//         setPagination({ ...pagination, current: 1 })
//     }

//     const columns = [
//         {
//             title: "IFCL",
//             dataIndex: "name",
//             key: "name",
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Avatar size="default" icon={<GlobalOutlined />} src={record.flag} />
//                     <div>
//                         <Link to={`/admin/ifcl/${record.id}/details`} className="font-medium">
//                             {record.nameFr || record.name}
//                         </Link>
//                         <div className="text-sm text-gray-500">
//                             {record.nameEn && record.nameEn !== record.nameFr && `(${record.nameEn})`}
//                         </div>
//                     </div>
//                 </Space>
//             ),
//         },
//         {
//             title: "Pays",
//             dataIndex: "country",
//             key: "country",
//             render: (_, record) => (
//                 <div>
//                     <div>{record.paysFr || record.country}</div>
//                     {record.paysEn && record.paysEn !== record.paysFr && (
//                         <div className="text-sm text-gray-500">{record.paysEn}</div>
//                     )}
//                 </div>
//             ),
//         },
//         {
//             title: "Code",
//             dataIndex: "code",
//             key: "code",
//             render: (code) => <Tag color="blue">{code}</Tag>,
//         },
//         {
//             title: "Coordonnées",
//             key: "coordinates",
//             render: (_, record) =>
//                 record.latitude && record.longitude ? (
//                     <div className="text-sm">
//                         <div>Lat: {record.latitude}</div>
//                         <div>Lng: {record.longitude}</div>
//                     </div>
//                 ) : (
//                     "N/A"
//                 ),
//         },
//         {
//             title: "Statut",
//             dataIndex: "status",
//             key: "status",
//             render: (status) => (
//                 <Tag color={status === "ACTIVE" ? "green" : "red"}>{status === "ACTIVE" ? "Actif" : "Inactif"}</Tag>
//             ),
//         },
//         {
//             title: "Critères",
//             key: "criteriaCount",
//             render: (_, record) => (
//                 <Tag color="purple">{record._count?.criteria || record.criteriaCount || 0} critère(s)</Tag>
//             ),
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Button type="link" icon={<EyeOutlined />} size="small">
//                         <Link to={`/admin/ifcl/${record.id}/details`}>Détails</Link>
//                     </Button>
//                     <Button type="link" icon={<EditOutlined />} size="small">
//                         <Link to={`/admin/ifcl/${record.id}/edit`}>Modifier</Link>
//                     </Button>
//                     <Popconfirm
//                         title="Êtes-vous sûr de vouloir supprimer cet IFCL ?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Oui"
//                         cancelText="Non"
//                     >
//                         <Button type="link" danger icon={<DeleteOutlined />} size="small">
//                             Supprimer
//                         </Button>
//                     </Popconfirm>
//                 </Space>
//             ),
//         },
//     ]

//     return (
//         <div className="container-fluid relative px-3">
//             <div className="layout-specing">
//                 <div className="md:flex justify-between items-center mb-6">
//                     <h5 className="text-lg font-semibold">Gestion des Pays membres</h5>
//                     <Breadcrumb items={[{ title: <Link to="/">Dashboard</Link> },
//                         { title: <Link to="/admin/ifcl/maps">Maps</Link> },
//                         { title: "Gestion des Pays membres" }]} />
//                 </div>

//                 {/* Filtres et actions */}
//                 <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
//                     <div className="flex gap-4 items-center">
//                         <Search
//                             placeholder="Rechercher par nom ou code..."
//                             allowClear
//                             onSearch={handleSearch}
//                             style={{ width: 300 }}
//                         />
//                         <Select placeholder="Filtrer par statut" allowClear onChange={handleStatusFilter} style={{ width: 150 }}>
//                             <Option value="ACTIVE">Actif</Option>
//                             <Option value="INACTIVE">Inactif</Option>
//                         </Select>
//                     </div>

//                     <Button type="primary" icon={<PlusOutlined />}>
//                         <Link to="/admin/ifcl/create">Ajouter un Pays membre</Link>
//                     </Button>
//                 </div>

//                 <Table
//                     columns={columns}
//                     dataSource={ifcls}
//                     loading={loading}
//                     rowKey="id"
//                     pagination={pagination}
//                     onChange={handleTableChange}
//                     scroll={{ x: true }}
//                     className="responsive-table"
//                 />
//             </div>
//         </div>
//     )
// }

// export default IFCLListAdmin

"use client"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Table, Tag, Space, Avatar, Breadcrumb, Button, Input, Select, message, Popconfirm } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, GlobalOutlined } from "@ant-design/icons"
import ifclService from "../../../services/ifclService"

const { Search } = Input
const { Option } = Select

const IFCLListAdmin = () => {
    const [ifcls, setIfcls] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr")
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")
        fetchIFCLs()
    }, [pagination.current, pagination.pageSize, searchTerm, statusFilter])

    const fetchIFCLs = async () => {
        setLoading(true)
        try {
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter }),
            }
            const response = await ifclService.getAll(params)
            console.log("Réponse de l'API:", response.datas)
            setIfcls(response.datas || [])
            setPagination({
                ...pagination,
                total: response.pagination?.total || response.total || 0,
            })
        } catch (error) {
            console.error("Erreur lors de la récupération des pays membres:", error)
            message.error("Erreur lors du chargement des pays membres")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await ifclService.delete(id)
            message.success("Pays membre supprimé avec succès")
            fetchIFCLs()
        } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            message.error("Erreur lors de la suppression du pays membre")
        }
    }

    const handleTableChange = (newPagination) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        })
    }

    const handleSearch = (value) => {
        setSearchTerm(value)
        setPagination({ ...pagination, current: 1 })
    }

    const handleStatusFilter = (value) => {
        setStatusFilter(value)
        setPagination({ ...pagination, current: 1 })
    }

    const columns = [
        {
            title: "Pays",
            dataIndex: "name_fr",
            key: "name_fr",
            render: (_, record) => (
                <Space size="middle">
                    <Avatar size="default" icon={<GlobalOutlined />} src={record.flag} />
                    <div>
                        <Link to={`/admin/ifcl/${record.id}/details`} className="font-medium">
                            {record.name_fr}
                        </Link>
                        {record.name_en && (
                            <div className="text-sm text-gray-500">
                                {record.name_en}
                            </div>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: "Nom Officiel",
            dataIndex: "pays_fr",
            key: "pays_fr",
            render: (_, record) => (
                <div>
                    <div>{record.pays_fr}</div>
                    {record.pays_en && (
                        <div className="text-sm text-gray-500">{record.pays_en}</div>
                    )}
                </div>
            ),
        },
        {
            title: "Coordonnées",
            dataIndex: "coordonnees",
            key: "coordonnees",
            render: (coordonnees) => (
                <div className="text-sm">
                    {coordonnees || "N/A"}
                </div>
            ),
        },
        {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "ACTIVE" ? "green" : "red"}>
                    {status === "ACTIVE" ? "Actif" : "Inactif"}
                </Tag>
            ),
        },
        {
            title: "Critères",
            key: "criteriaCount",
            render: (_, record) => (
                <Tag color="purple">
                    {record._count?.criteria || record.criteriaCount || 0} critère(s)
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EyeOutlined />} size="small">
                        <Link to={`/admin/ifcl/${record.id}/details`}>Détails</Link>
                    </Button>
                    <Button type="link" icon={<EditOutlined />} size="small">
                        <Link to={`/admin/ifcl/${record.id}/edit`}>Modifier</Link>
                    </Button>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce pays membre ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} size="small">
                            Supprimer
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Gestion des Pays membres</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/admin/ifcl/maps">Cartes</Link> },
                            { title: "Gestion des Pays membres" }
                        ]}
                    />
                </div>

                {/* Filtres et actions */}
                <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <Search
                            placeholder="Rechercher par nom ou code..."
                            allowClear
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                        />
                        <Select
                            placeholder="Filtrer par statut"
                            allowClear
                            onChange={handleStatusFilter}
                            style={{ width: 150 }}
                        >
                            <Option value="ACTIVE">Actif</Option>
                            <Option value="INACTIVE">Inactif</Option>
                        </Select>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />}>
                        <Link to="/admin/ifcl/create">Ajouter un Pays membre</Link>
                    </Button>
                </div>

                {/* Tableau des pays membres */}
                <Table
                    columns={columns}
                    dataSource={ifcls}
                    loading={loading}
                    rowKey="id"
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: true }}
                    className="responsive-table"
                />
            </div>
        </div>
    )
}

export default IFCLListAdmin
