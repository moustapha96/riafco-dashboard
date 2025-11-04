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

const { Title, Paragraph, Text } = Typography;
const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

function publicUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // déjà absolu
  return `${API}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function ResourceDetail() {
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

  const fileUrl = publicUrl(res.url || res.fileName);
  const created = res.createdAt ? new Date(res.createdAt).toLocaleString("fr-FR") : "-";
  const sizeMB = res.fileSize ? (res.fileSize / (1024 * 1024)).toFixed(2) + " MB" : "-";


    const handleDownload = async () => {
    try {
      // backend renvoie `url` prioritaire, fallback fileName
      const url = res.url || res.fileName;
      if (url) window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading resource:", error);
    }
  };


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
                {fileUrl && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    Télécharger
                  </Button>
                )}
                {res.lien && (
                  <Button icon={<LinkOutlined />} onClick={() => window.open(res.lien, "_blank")}>
                    Ouvrir le lien
                  </Button>
                )}
              </Space>
            </Space>

            {res.couverture && (
              <Image
                src={res.couverture}
                alt="Couverture"
                style={{ maxHeight: 320, objectFit: "cover", borderRadius: 12 }}
                preview
              />
            )}

            {res.description && (
              <Paragraph style={{ whiteSpace: "pre-wrap" }}>{res.description}</Paragraph>
            )}

            <Descriptions bordered size="middle" column={1}>
              <Descriptions.Item label="Catégorie">
                {res.category?.name ? <Tag color="blue">{res.category.name}</Tag> : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Taille">{sizeMB}</Descriptions.Item>
              <Descriptions.Item label="Type de fichier">{res.fileType || "-"}</Descriptions.Item>
              <Descriptions.Item label="Créée le">{created}</Descriptions.Item>
             
              <Descriptions.Item label="Lien externe">
                {res.lien ? (
                  <a href={res.lien} target="_blank" rel="noreferrer">
                    {res.lien}
                  </a>
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Visibilité">
                {res.isPublic ? <Tag color="green">Publique</Tag> : <Tag color="red">Privée</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Tags">
                <Space wrap>
                  {Array.isArray(res.tags) && res.tags.length
                    ? res.tags.map((t, i) => <Tag key={`${t}-${i}`}>{t}</Tag>)
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
