// /* eslint-disable no-unused-vars */

// "use client"
// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { Breadcrumb, Button, Modal, Card, Tag, Descriptions } from "antd"
// import ifclService from "../../../services/ifclService"
// import { ComposableMap, Geographies, Geography } from "react-simple-maps"
// import africaGeo from "../../../data/africa.geo.json"
// import { toast } from "sonner"


// const normalize = (str = "") =>
//     str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")



// const MapsIfcl = () => {
//     const [memberCountries, setMemberCountries] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [selectedCountry, setSelectedCountry] = useState(null)
//     const [selectedCountryData, setSelectedCountryData] = useState(null)
//     const [selectedCountryMembers, setSelectedCountryMembers] = useState([])
//     const [isModalVisible, setIsModalVisible] = useState(false)

//     useEffect(() => {
//         document.documentElement.setAttribute("dir", "ltr")
//         document.documentElement.classList.add("light")
//         document.documentElement.classList.remove("dark")
//         fetchMemberCountries()
//     }, [])

   
//     const countryCodeMapping = {
//         "sénégal": "SN",
//         "côte d'ivoire": "CI",
//         "burkina faso": "BF",
//         "mali": "ML",
//         "guinée": "GN",
//         "niger": "NE",
//         "togo": "TG",
//         "bénin": "BJ",
//         "cameroun": "CM",
//         "république démocratique du congo": "CD",
//         "république du congo": "CG",
//         "gabon": "GA",
//         "tchad": "TD",
//         "centrafrique": "CF",
//         "madagascar": "MG",
//         "mauritanie": "MR",
//         "maroc": "MA",
//         "algérie": "DZ",
//         "tunisie": "TN",
//         "libye": "LY",
//         "egypt": "EG",
//         "soudan": "SD",
//         "soudan du sud": "SS",
//         "éthiopie": "ET",
//         "érythrée": "ER",
//         "djibouti": "DJ",
//         "somalie": "SO",
//         "kenya": "KE",
//         "uganda": "UG",
//         "tanzanie": "TZ",
//         "mozambique": "MZ",
//         "zambie": "ZM",
//         "malawi": "MW",
//         "zimbabwe": "ZW",
//         "botswana": "BW",
//         "namibie": "NA",
//         "afrique du sud": "ZA",
//         "lesotho": "LS",
//         "eswatini": "SZ",
//         "angola": "AO",
//         "guinée équatoriale": "GQ",
//         "guinée-bissau": "GW",
//         "liberia": "LR",
//         "sierra leone": "SL",
//         "ghana": "GH",
//         "nigeria": "NG",
//         "cap-vert": "CV",
//         "sao tomé-et-principe": "ST",
//         "seychelles": "SC",
//         "comores": "KM",
//         "maurice": "MU"
//     }



//     const getCountryCode = (countryName) => {
//         const normalizedName = normalize(countryName)
//         return countryCodeMapping[normalizedName] || null
//     }


//     const findMembersByCountry = (countryName) => {
//         const normalizedName = normalize(countryName)
//         const code = getCountryCode(countryName)
//         return memberCountries.filter((c) =>
//             normalize(c.name_fr || "") === normalizedName ||
//             normalize(c.name_en || "") === normalizedName ||
//             c.code === code
//         )
//     }

//     const getCountryColor = (countryName) => {
//         const hasMembers = findMembersByCountry(countryName).length > 0
//         if (selectedCountry === countryName) return "#FF5722"
//         return hasMembers ? "#4CAF50" : "#E0E0E0"
//     }

   
//     const handleCountryClick = (countryName) => {
//         const matches = findMembersByCountry(countryName)
//         if (matches.length > 0) {
//             setSelectedCountry(countryName)
//             setSelectedCountryMembers(matches)
//             setIsModalVisible(true)
//         } else {
//             toast.info(`${countryName} n'est pas un pays membre de la RIAFCO`)
//         }
//     }

//     const handleCloseModal = () => {
//         setIsModalVisible(false)
//         setSelectedCountry(null)
//         setSelectedCountryData(null)
//     }

//     const fetchMemberCountries = async () => {
//         setLoading(true)
//         try {
//             const response = await ifclService.getAllOf()
//             console.log("Réponse de l'API:", response)
//             setMemberCountries(response.datas || [])
//         } catch (error) {
//             console.error("Erreur lors de la récupération des pays membres:", error)
//             toast.error("Erreur lors du chargement des pays membres")
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="container-fluid relative px-3">
//             <div className="layout-specing">
//                 <div className="md:flex justify-between items-center mb-6">
//                     <h5 className="text-lg font-semibold">Carte des Pays membres</h5>
//                     <Breadcrumb
//                         items={[
//                             { title: <Link to="/">Dashboard</Link> },
//                             { title: <Link to="/admin/ifcl">Pays membres</Link> },
//                             { title: "Carte" },
//                         ]}
//                     />
//                 </div>

//                 <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//                     <h6 className="font-semibold mb-2">Légende:</h6>
//                     <div className="flex gap-4">
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-green-500 rounded"></div>
//                             <span>Pays membres ({memberCountries.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-orange-500 rounded"></div>
//                             <span>Pays sélectionné</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-gray-300 rounded"></div>
//                             <span>Autres pays</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Conteneur de la carte */}
//                 <div style={{ width: "100%", height: "100vh", marginBottom: "20px" }}>
//                     <ComposableMap
//                         projection="geoMercator"
//                         projectionConfig={{
//                             scale: 380,
//                             center: [20, -5],
//                             rotate: [0, 0, 0],
//                         }}
//                         style={{ width: "100%", height: "100%", marginTop: "10%" }}
//                     >
//                         <Geographies geography={africaGeo}>
//                             {({ geographies }) =>
//                                 geographies.map((geo) => {
//                                     const countryName = geo.properties.name
//                                     return (
//                                         <Geography
//                                             key={geo.rsmKey}
//                                             geography={geo}
//                                             onClick={() => handleCountryClick(countryName)}
//                                             style={{
//                                                 default: {
//                                                     fill: getCountryColor(countryName),
//                                                     stroke: "#FFFFFF",
//                                                     strokeWidth: 0.5,
//                                                     outline: "none",
//                                                     cursor: "pointer",
//                                                 },
//                                                 hover: {
//                                                     fill: "#2196F3",
//                                                     stroke: "#FFFFFF",
//                                                     strokeWidth: 0.5,
//                                                     outline: "none",
//                                                 },
//                                                 pressed: {
//                                                     fill: "#E91E63",
//                                                     stroke: "#FFFFFF",
//                                                     strokeWidth: 0.5,
//                                                     outline: "none",
//                                                 },
//                                             }}
//                                         />
//                                     )
//                                 })
//                             }
//                         </Geographies>
//                     </ComposableMap>
//                 </div>


//                     <Modal
//                         title={`Détails du Pays Membre${selectedCountryMembers.length > 1 ? "s" : ""}`}
//                         open={isModalVisible}
//                         onCancel={() => {
//                             setIsModalVisible(false)
//                             setSelectedCountry(null)
//                             setSelectedCountryMembers([])
//                         }}
//                         width={720}
//                         footer={[
//                             <Button key="close" onClick={() => {
//                                 setIsModalVisible(false)
//                                 setSelectedCountry(null)
//                                 setSelectedCountryMembers([])
//                             }}>
//                                 Fermer
//                             </Button>,
//                         ]}
//                     />


//                     {selectedCountryMembers.length > 0 && (
//                         <div className="space-y-4">
                          
//                             {selectedCountryMembers.length === 1 ? (
//                                 (() => {
//                                     const c = selectedCountryMembers[0]
//                                     return (
//                                         <Card>
//                                             <div className="flex items-center gap-3 mb-4">
//                                                 {c.flag && (
//                                                     <img
//                                                         src={c.flag}
//                                                         alt={`Drapeau ${c.name_fr}`}
//                                                         className="w-20 h-14 object-cover rounded"
//                                                     />
//                                                 )}
//                                                 <div>
//                                                     <h3 className="text-xl font-bold">{c.name_fr}</h3>
//                                                     {c.name_en && <p className="text-gray-500">{c.name_en}</p>}
//                                                     <Tag color={c.status === "ACTIVE" ? "green" : "red"}>
//                                                         {c.status === "ACTIVE" ? "Actif" : "Inactif"}
//                                                     </Tag>
//                                                 </div>
//                                             </div>

//                                             <Descriptions column={1} bordered>
//                                                 {c.pays_fr && (
//                                                     <Descriptions.Item label="Nom officiel (FR)">{c.pays_fr}</Descriptions.Item>
//                                                 )}
//                                                 {c.pays_en && (
//                                                     <Descriptions.Item label="Nom officiel (EN)">{c.pays_en}</Descriptions.Item>
//                                                 )}
//                                                 {c.code && (
//                                                     <Descriptions.Item label="Code Pays"><Tag color="blue">{c.code}</Tag></Descriptions.Item>
//                                                 )}
//                                                 {c.coordonnees && (
//                                                     <Descriptions.Item label="Coordonnées">{c.coordonnees}</Descriptions.Item>
//                                                 )}
//                                                 <Descriptions.Item label="Nombre de critères">{c._count?.criteria || 0}</Descriptions.Item>
//                                                 <Descriptions.Item label="Date d'adhésion">
//                                                     {new Date(c.createdAt).toLocaleDateString("fr-FR")}
//                                                 </Descriptions.Item>
//                                             </Descriptions>

//                                             {c.description_fr && (
//                                                 <div className="mt-4">
//                                                     <h4 className="font-semibold mb-2">Description (FR):</h4>
//                                                     <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: c.description_fr }} />
//                                                 </div>
//                                             )}
//                                             {c.description_en && (
//                                                 <div className="mt-4">
//                                                     <h4 className="font-semibold mb-2">Description (EN):</h4>
//                                                     <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: c.description_en }} />
//                                                 </div>
//                                             )}

//                                             <div className="mt-4 flex justify-end">
//                                                 <Button type="primary">
//                                                     <Link to={`/admin/ifcl/${c.id}/edit`}>Modifier</Link>
//                                                 </Button>
//                                             </div>
//                                         </Card>
//                                     )
//                                 })()
//                             ) : (
//                                 <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
//                                     {selectedCountryMembers.map((c) => (
//                                         <Card key={c.id} title={c.name_fr} extra={
//                                             <Tag color={c.status === "ACTIVE" ? "green" : "red"}>
//                                                 {c.status === "ACTIVE" ? "Actif" : "Inactif"}
//                                             </Tag>
//                                         }>
//                                             <div className="flex items-center gap-3 mb-3">
//                                                 {c.flag && (
//                                                     <img
//                                                         src={c.flag}
//                                                         alt={`Drapeau ${c.name_fr}`}
//                                                         className="w-16 h-12 object-cover rounded"
//                                                     />
//                                                 )}
//                                                 <div className="text-sm text-gray-600">
//                                                     {c.name_en && <div>{c.name_en}</div>}
//                                                     {c.code && <div>Code : <Tag color="blue">{c.code}</Tag></div>}
//                                                 </div>
//                                             </div>

//                                             {c.description_fr && (
//                                                 <div className="text-sm line-clamp-3 prose"
//                                                     dangerouslySetInnerHTML={{ __html: c.description_fr }} />
//                                             )}

//                                             <div className="mt-3 flex justify-end">
//                                                 <Button type="link">
//                                                     <Link to={`/admin/ifcl/${c.id}/edit`}>Modifier</Link>
//                                                 </Button>
//                                                 <Button type="primary">
//                                                     <Link to={`/admin/ifcl/${c.id}/details`}>Détails</Link>
//                                                 </Button>
//                                             </div>
//                                         </Card>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//             </div>
//         </div>
//     )
// }

// export default MapsIfcl

/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Button, Modal, Card, Tag, Descriptions, Spin } from "antd";
import ifclService from "../../../services/ifclService";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import africaGeo from "../../../data/africa.geo.json";
import { toast } from "sonner";

const normalize = (str = "") =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const countryCodeMapping = {
    "sénégal": "SN",
    "cote d'ivoire": "CI",
    "côte d'ivoire": "CI",
    "burkina faso": "BF",
    "mali": "ML",
    "guinee": "GN",
    "guinée": "GN",
    "niger": "NE",
    "togo": "TG",
    "benin": "BJ",
    "bénin": "BJ",
    "cameroun": "CM",
    "republique democratique du congo": "CD",
    "république démocratique du congo": "CD",
    "republique du congo": "CG",
    "république du congo": "CG",
    "gabon": "GA",
    "tchad": "TD",
    "centrafrique": "CF",
    "madagascar": "MG",
    "mauritanie": "MR",
    "maroc": "MA",
    "algerie": "DZ",
    "algérie": "DZ",
    "tunisie": "TN",
    "libye": "LY",
    "egypt": "EG",
    "egypte": "EG",
    "soudan": "SD",
    "soudan du sud": "SS",
    "ethiopie": "ET",
    "éthiopie": "ET",
    "erythree": "ER",
    "érythrée": "ER",
    "djibouti": "DJ",
    "somalie": "SO",
    "kenya": "KE",
    "ouganda": "UG",
    "uganda": "UG",
    "tanzanie": "TZ",
    "mozambique": "MZ",
    "zambie": "ZM",
    "malawi": "MW",
    "zimbabwe": "ZW",
    "botswana": "BW",
    "namibie": "NA",
    "afrique du sud": "ZA",
    "lesotho": "LS",
    "eswatini": "SZ",
    "angola": "AO",
    "guinee equatoriale": "GQ",
    "guinée équatoriale": "GQ",
    "guinee-bissau": "GW",
    "guinée-bissau": "GW",
    "liberia": "LR",
    "sierra leone": "SL",
    "ghana": "GH",
    "nigeria": "NG",
    "cap-vert": "CV",
    "sao tome-et-principe": "ST",
    "sao tomé-et-principe": "ST",
    "seychelles": "SC",
    "comores": "KM",
    "maurice": "MU",
};

const getCountryCode = (countryName) => {
    const normalizedName = normalize(countryName);
    return countryCodeMapping[normalizedName] || null;
};

export default function MapsIfcl() {
    const [memberCountries, setMemberCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCountryMembers, setSelectedCountryMembers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        fetchMemberCountries();
    }, []);

    const fetchMemberCountries = async () => {
        setLoading(true);
        try {
            const response = await ifclService.getAllOf();
            setMemberCountries(response?.datas || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des pays membres:", error);
            toast.error("Erreur lors du chargement des pays membres");
        } finally {
            setLoading(false);
        }
    };

    // Indexage en mémoire pour des recherches rapides
    const indexedByCountry = useMemo(() => {
        const map = new Map(); // key: code/name_norm -> array
        (memberCountries || []).forEach((c) => {
            const codeKey = (c.code || "").toUpperCase();
            const frKey = normalize(c.name_fr || "");
            const enKey = normalize(c.name_en || "");
            const keys = new Set([codeKey, frKey, enKey].filter(Boolean));
            keys.forEach((k) => {
                if (!map.has(k)) map.set(k, []);
                map.get(k).push(c);
            });
        });
        return map;
    }, [memberCountries]);

    const findMembersByCountry = (countryName) => {
        const code = getCountryCode(countryName);
        const frKey = normalize(countryName);
        const enKey = normalize(countryName);
        const res = new Set();
        if (code && indexedByCountry.has(code)) {
            indexedByCountry.get(code).forEach((c) => res.add(c));
        }
        if (indexedByCountry.has(frKey)) {
            indexedByCountry.get(frKey).forEach((c) => res.add(c));
        }
        if (indexedByCountry.has(enKey)) {
            indexedByCountry.get(enKey).forEach((c) => res.add(c));
        }
        return Array.from(res);
    };

    const getCountryColor = (countryName) => {
        const hasMembers = findMembersByCountry(countryName).length > 0;
        if (selectedCountry === countryName) return "#FF5722"; // sélection
        return hasMembers ? "#4CAF50" : "#E0E0E0"; // membre / autre
    };

    const handleCountryClick = (countryName) => {
        const matches = findMembersByCountry(countryName);
        if (matches.length > 0) {
            setSelectedCountry(countryName);
            setSelectedCountryMembers(matches);
            setIsModalVisible(true);
        } else {
            toast.info(`${countryName} n'est pas un pays membre de la RIAFCO`);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedCountry(null);
        setSelectedCountryMembers([]);
    };

    return (
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold">Carte des Pays membres</h5>
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: <Link to="/admin/ifcl">Pays membres</Link> },
                            { title: "Carte" },
                        ]}
                    />
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h6 className="font-semibold mb-2">Légende :</h6>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded" />
                            <span>Pays membres ({memberCountries.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded" />
                            <span>Pays sélectionné</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded" />
                            <span>Autres pays</span>
                        </div>
                    </div>
                </div>

                {/* Carte */}
                <div className="w-full h-[75vh] md:h-[80vh] mb-5 relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                            <Spin size="large" />
                        </div>
                    )}
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: 380, center: [20, -5], rotate: [0, 0, 0] }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Geographies geography={africaGeo}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const countryName = geo.properties.name;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() => handleCountryClick(countryName)}
                                            style={{
                                                default: {
                                                    fill: getCountryColor(countryName),
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                    cursor: "pointer",
                                                },
                                                hover: {
                                                    fill: "#2196F3",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: "#E91E63",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>

                {/* Modal avec contenu */}
                <Modal
                    title={
                        selectedCountry
                            ? `Pays sélectionné : ${selectedCountry} ${selectedCountryMembers.length > 1 ? `(${selectedCountryMembers.length} membres)` : ""
                            }`
                            : "Détails du pays"
                    }
                    open={isModalVisible}
                    onCancel={handleCloseModal}
                    width={780}
                    footer={[
                        <Button key="close" onClick={handleCloseModal}>
                            Fermer
                        </Button>,
                    ]}
                    destroyOnClose
                >
                    {selectedCountryMembers.length === 0 ? (
                        <p className="text-slate-500">Aucun membre trouvé pour ce pays.</p>
                    ) : selectedCountryMembers.length === 1 ? (
                        (() => {
                            const c = selectedCountryMembers[0];
                            return (
                                <Card bordered={false} className="!p-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        {c.flag && (
                                            <img
                                                src={c.flag}
                                                alt={`Drapeau ${c.name_fr || c.name_en || ""}`}
                                                className="w-20 h-14 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold">{c.name_fr || c.name_en}</h3>
                                            {c.name_en && c.name_fr && (
                                                <p className="text-gray-500">{c.name_en}</p>
                                            )}
                                            <Tag color={c.status === "ACTIVE" ? "green" : "red"}>
                                                {c.status === "ACTIVE" ? "Actif" : "Inactif"}
                                            </Tag>
                                        </div>
                                    </div>

                                    <Descriptions column={1} bordered>
                                        {c.pays_fr && (
                                            <Descriptions.Item label="Nom officiel (FR)">
                                                {c.pays_fr}
                                            </Descriptions.Item>
                                        )}
                                        {c.pays_en && (
                                            <Descriptions.Item label="Nom officiel (EN)">
                                                {c.pays_en}
                                            </Descriptions.Item>
                                        )}
                                        {c.code && (
                                            <Descriptions.Item label="Code Pays">
                                                <Tag color="blue">{c.code}</Tag>
                                            </Descriptions.Item>
                                        )}
                                        {c.coordonnees && (
                                            <Descriptions.Item label="Coordonnées">
                                                {c.coordonnees}
                                            </Descriptions.Item>
                                        )}
                                        <Descriptions.Item label="Nombre de critères">
                                            {c._count?.criteria || 0}
                                        </Descriptions.Item>
                                        {c.createdAt && (
                                            <Descriptions.Item label="Date d'adhésion">
                                                {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>

                                    {c.description_fr && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-2">Description (FR)</h4>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={{ __html: c.description_fr }}
                                            />
                                        </div>
                                    )}
                                    {c.description_en && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-2">Description (EN)</h4>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={{ __html: c.description_en }}
                                            />
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button>
                                            <Link to={`/admin/ifcl/${c.id}/details`}>Détails</Link>
                                        </Button>
                                        <Button type="primary">
                                            <Link to={`/admin/ifcl/${c.id}/edit`}>Modifier</Link>
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })()
                    ) : (
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                            {selectedCountryMembers.map((c) => (
                                <Card
                                    key={c.id}
                                    title={c.name_fr || c.name_en}
                                    extra={
                                        <Tag color={c.status === "ACTIVE" ? "green" : "red"}>
                                            {c.status === "ACTIVE" ? "Actif" : "Inactif"}
                                        </Tag>
                                    }
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {c.flag && (
                                            <img
                                                src={c.flag}
                                                alt={`Drapeau ${c.name_fr || c.name_en || ""}`}
                                                className="w-16 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div className="text-sm text-gray-600">
                                            {c.name_en && c.name_fr && <div>{c.name_en}</div>}
                                            {c.code && (
                                                <div>
                                                    Code : <Tag color="blue">{c.code}</Tag>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {c.description_fr && (
                                        <div
                                            className="text-sm line-clamp-3 prose"
                                            dangerouslySetInnerHTML={{ __html: c.description_fr }}
                                        />
                                    )}

                                    <div className="mt-3 flex justify-end gap-2">
                                        <Button type="link">
                                            <Link to={`/admin/ifcl/${c.id}/edit`}>Modifier</Link>
                                        </Button>
                                        <Button type="primary">
                                            <Link to={`/admin/ifcl/${c.id}/details`}>Détails</Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
