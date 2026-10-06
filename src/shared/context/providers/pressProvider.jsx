import { useEffect, useState, useCallback } from "react";
import { PressContext } from "../sharedContext";
import {
  ObtenerNoticiasPublicas,
  descargarDocumentoPorId,
  listarDocumentosPorPublicacion,
  sumarVisualizacion,
} from "../../../api/PrensaService";

const PREVIEW_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "pdf",
]);

export function PressProvider({ children }) {
  function hasRealDocumentName(value) {
    if (!value) return false;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return false;

    const genericNames = new Set(["documento", "archivo", "file", "document"]);
    return !genericNames.has(normalized);
  }

  function getDocumentName(doc, fallback = "Archivo") {
    const candidate = doc?.nombre_documento;
    return hasRealDocumentName(candidate) ? candidate : fallback;
  }

  function normalizeExtension(value) {
    if (!value) return "";

    let normalized = String(value).trim().toLowerCase();
    if (normalized.includes("/")) {
      normalized = normalized.split("/").pop();
    }
    if (normalized.includes(";")) {
      normalized = normalized.split(";")[0];
    }

    return normalized.replace(/^\./, "");
  }

  function getDocumentExtension(doc) {
    const directExtension = normalizeExtension(doc?.extension);
    if (directExtension) return directExtension;

    const fileName = doc?.nombre_documento || "";
    const parts = fileName.split(".");
    if (parts.length < 2) return "";

    return normalizeExtension(parts.pop());
  }

  function isPreviewableDocument(doc) {
    return PREVIEW_EXTENSIONS.has(getDocumentExtension(doc));
  }

  function getImageSource(doc) {
    if (!doc?.datos_documento) return "";

    if (doc.datos_documento.startsWith("data:")) {
      return doc.datos_documento;
    }

    const extension = getDocumentExtension(doc);
    const mimeByExtension = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      bmp: "image/bmp",
      svg: "image/svg+xml",
    };

    const mime = mimeByExtension[extension] || "image/jpeg";
    return `data:${mime};base64,${doc.datos_documento}`;
  }

  const [isLoading, setLoadingNews] = useState(true);
  const [novedades, setNovedades] = useState([]);
  const [selectedPub, setSelectedPub] = useState(null);
  const [loadingSelectedDocuments, setLoadingSelectedDocuments] =
    useState(false);

  const handleCardClick = useCallback(async (publication) => {
    setSelectedPub({ ...publication, documentos: [] });
    setLoadingSelectedDocuments(true);

    try {
      const data = await listarDocumentosPorPublicacion(publication.id);
      const documents = Array.isArray(data) ? data : [];
      const coverId = String(publication.portada?.id ?? "");

      setSelectedPub((current) =>
        current?.id === publication.id
          ? {
              ...current,
              documentos: documents.filter(
                (document) => String(document.id) !== coverId,
              ),
            }
          : current,
      );
    } catch (error) {
      console.error("No se pudieron cargar los documentos:", error);
      setSelectedPub((current) =>
        current?.id === publication.id
          ? { ...current, documentos: publication.documentos || [] }
          : current,
      );
    } finally {
      setLoadingSelectedDocuments(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedPub(null);
    setLoadingSelectedDocuments(false);
  }, []);

  const fetchEventosPublicos = useCallback(async () => {
    setLoadingNews(true);
    try {
      const respuesta = await ObtenerNoticiasPublicas();
      if (respuesta?.success && respuesta?.data) {
        setNovedades(respuesta.data);
      }
    } catch {
      setNovedades([]);
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchEventosPublicos();
  }, [fetchEventosPublicos]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewDocName, setPreviewDocName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const handleOpenPreview = async (documento) => {
    const documentId = documento?.id ?? documento?.id_documento;
    const documentName = getDocumentName(documento, "Vista previa");
    const documentExtension = getDocumentExtension(documento);

    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewDocName(documentName);
    setPreviewError("");
    setPreviewDoc(null);

    if (!documentId || !documentExtension) {
      setPreviewError("No se encontró el documento para previsualizar.");
      setPreviewLoading(false);
      return;
    }

    try {
      const data = await descargarDocumentoPorId(documentId);

      if (!isPreviewableDocument(data) && !isPreviewableDocument(documento)) {
        setPreviewError("Solo se permite vista previa para imágenes o PDF.");
        return;
      }

      setPreviewDoc(data);
    } catch (error) {
      console.error("Error al descargar documento:", error);
      setPreviewError("No se pudo cargar la imagen.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewDoc(null);
    setPreviewDocName("");
    setPreviewError("");
    setPreviewLoading(false);
  };

  const handleDownloadPreview = () => {
    if (!previewDoc) return;

    const imageSource = getImageSource(previewDoc);
    if (!imageSource) return;

    const extension = getDocumentExtension(previewDoc);
    const fileName = getDocumentName(previewDoc, previewDocName || "archivo");
    const hasExtension = fileName.includes(".");
    const downloadName = hasExtension
      ? fileName
      : `${fileName}.${extension || "jpg"}`;

    const link = document.createElement("a");
    link.href = imageSource;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

    const handleDownload = async (documento) => {
    const documentId = documento?.id ?? documento?.id_documento;
    const documentName = getDocumentName(documento, "documento");
    const documentExtension = getDocumentExtension(documento);

    setPreviewLoading(true);
    if (!documentId || !documentExtension) {
      setPreviewError("No se encontró el documento para previsualizar.");
      setPreviewLoading(false);
      return;
    }
    try {
      let data = await descargarDocumentoPorId(documentId);
      const imageSource = getImageSource(data);

      if (!imageSource) return;
      const link = document.createElement("a");
      link.href = imageSource;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setPreviewError(`No se pudo descargar el documento. ${error}`);
    } finally {
      setPreviewLoading(false);
    }
  };
  const contarVisualizacion = useCallback(async (pubId) => {
    if(!pubId) return;
    try {
      await sumarVisualizacion(pubId);

    } catch {
      console.log("ERROR: Contar la visualizacion tuvo un error")
    } 
  }, []);

  return (
    <PressContext.Provider
      value={{
        isLoading,
        novedades,
        selectedPub,
        loadingSelectedDocuments,
        handleCardClick,
        handleClose,
        previewOpen,
        previewDoc,
        previewDocName,
        previewLoading,
        previewError,
        handleOpenPreview,
        handleClosePreview,
        handleDownloadPreview,
        handleDownload,

        getDocumentName,
        getImageSource,
        getDocumentExtension,
        contarVisualizacion,
      }}
    >
      {children}
    </PressContext.Provider>
  );
}
