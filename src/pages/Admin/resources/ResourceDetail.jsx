// src/pages/resources/ResourceDetail.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Descriptions, Tag, Button, Space, Image, Typography, Spin } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import resourceService from "../../../services/resourceService";
import { buildImageUrl } from "../../../utils/imageUtils";
import { useAuth } from "../../../hooks/useAuth";

const { Title, Paragraph, Text } = Typography;

export default function ResourceDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [res, setRes] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await resourceService.getById(id);
        console.log(r);
        if (r?.success) setRes(r.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid px-3">
        <Spin />
      </div>
    );
  }

  if (!res) {
    return (
      <div className="container-fluid px-3">
        <Space direction="vertical" size="large">
          <Button icon={<ArrowLeftOutlined />} onClick={() => nav(-1)}>
            Retour
          </Button>
          <Text type="danger">Ressource introuvable.</Text>
        </Space>
      </div>
    );
  }

  // Déterminer l'URL du fichier à télécharger
  // Priorité: filePath > url > fileName
  const getFileUrl = () => {
    if (res.filePath) {
      return buildImageUrl(res.fileName);
    }
    if (res.url) {
      // Si url est une URL externe complète, la retourner telle quelle
      if (/^https?:\/\//i.test(res.url)) {
        return res.url;
      }
      return buildImageUrl(res.url);
    }
    if (res.fileName) {
      // Construire le chemin si on n'a que le nom de fichier
      return buildImageUrl(`/resources/${res.fileName}`);
    }
    return null;
  };

  const fileUrl = getFileUrl();
  const created = res.createdAt ? new Date(res.createdAt).toLocaleString("fr-FR") : "-";
  const updated = res.updatedAt ? new Date(res.updatedAt).toLocaleString("fr-FR") : "-";
  
  // Convertir la taille en MB (fileSize est en MB selon l'exemple)
  const sizeMB = res.fileSize 
    ? (typeof res.fileSize === 'number' 
        ? res.fileSize >= 1024 
          ? (res.fileSize / 1024).toFixed(2) + " MB" 
          : res.fileSize + " MB"
        : res.fileSize + " MB")
    : "-";

  // Gérer le téléchargement du fichier
  const handleDownload = async () => {
    try {
      if (fileUrl) {
        // Si c'est une URL externe ou un fichier, ouvrir dans un nouvel onglet
        window.open(fileUrl, "_blank");
      } else {
        // Fallback: utiliser l'endpoint de téléchargement du service
        try {
          const blob = await resourceService.download(res.id);
          const url = window.URL.createObjectURL(blob.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = res.fileName || 'resource';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading resource:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error downloading resource:", error);
    }
  };

  // Déterminer si la ressource a un fichier téléchargeable
  const hasDownloadableFile = !!(res.filePath || res.url || res.fileName);
  
  // Déterminer si la ressource a un lien externe (URL complète avec http/https)
  const hasExternalLink = !!(res.lien && /^https?:\/\//i.test(res.lien)) || !!(res.url && /^https?:\/\//i.test(res.url));
  
  // URL du lien externe (priorité: lien > url si url est externe)
  const externalLink = (res.lien && /^https?:\/\//i.test(res.lien)) 
    ? res.lien 
    : (res.url && /^https?:\/\//i.test(res.url) ? res.url : null);


  return (
    <div className="container-fluid relative px-3">
      <div
        className="layout-specing"
        style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto", paddingRight: 8 }}
      >
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => nav(-1)}>
            Retour
          </Button>
          <Link to="/admin/resources">Liste des ressources</Link>
        </Space>

        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
              <Title level={3} style={{ marginBottom: 0 }}>
                <Space>
                  <FileOutlined />
                  {res.title}
                  {res.isPublic ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                </Space>
              </Title>

              <Space>
                {hasDownloadableFile && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    Télécharger
                  </Button>
                )}
                {externalLink && (
                  <Button 
                    icon={<LinkOutlined />} 
                    onClick={() => window.open(externalLink, "_blank")}
                  >
                    Ouvrir le lien externe
                  </Button>
                )}
              </Space>
            </Space>

            {res.couverture && (
              <Image
                src={buildImageUrl(res.couverture)}
                alt="Couverture"
                style={{ maxHeight: 320, objectFit: "cover", borderRadius: 12, width: "100%" }}
                preview
                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E"
              />
            )}

            {res.description && (
              <Paragraph style={{ whiteSpace: "pre-wrap" }}>{res.description}</Paragraph>
            )}

            <Descriptions bordered size="middle" column={1}>
              <Descriptions.Item label="Catégorie">
                {res.category?.name ? <Tag color="blue">{res.category.name}</Tag> : "-"}
              </Descriptions.Item>
              
              {hasDownloadableFile &&  (user?.role == "SUPER_ADMIN" || user?.role ==="ADMIN") && (
                <>
                  <Descriptions.Item label="Nom du fichier">
                    {res.fileName || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Taille du fichier">{sizeMB}</Descriptions.Item>
                  <Descriptions.Item label="Type de fichier">{res.fileType || "-"}</Descriptions.Item>
                </>
              )}
              
              <Descriptions.Item label="Créée le">{created}</Descriptions.Item>
              
              {res.updatedAt && res.updatedAt !== res.createdAt && (
                <Descriptions.Item label="Modifiée le">{updated}</Descriptions.Item>
              )}
             
              {(externalLink || res.url) && (
                <Descriptions.Item label="Lien externe / URL">
                  {externalLink ? (
                    <a href={externalLink} target="_blank" rel="noreferrer">
                      {externalLink}
                    </a>
                  ) : res.url ? (
                    <Text type="secondary">{res.url}</Text>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
              )}
              
              {res.filePath && (user?.role == "SUPER_ADMIN" || user?.role ==="ADMIN") && (
                <Descriptions.Item label="Chemin du fichier">
                  <Text code>{res.filePath}</Text>
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="Visibilité">
                {res.isPublic ? <Tag color="green">Publique</Tag> : <Tag color="red">Privée</Tag>}
              </Descriptions.Item>
              
              <Descriptions.Item label="Tags">
                <Space wrap>
                  {Array.isArray(res.tags) && res.tags.length
                    ? res.tags.map((t, i) => <Tag key={`${t}-${i}`} color="blue">{t}</Tag>)
                    : "-"}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>
      </div>
    </div>
  );
}
