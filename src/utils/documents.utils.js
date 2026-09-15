import { hasRealDocumentName } from "./validation.utils";
import { firstNonEmptyText, normalizeText } from "./text.utils";
import {
  DEFAULT_ACCEPTED_EXTENSIONS,
  IMAGE_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  PREVIEW_EXTENSIONS,
} from "./common/constants";

// Une la configuracion local con tipos/archivos de la API y conserva el estado
// previo para no perder archivos elegidos ni opcionales ya visibles.
export const getDocumentKey = (documento) =>
  documento.id ?? documento.id_tipo_documento ?? documento.nombre;

export const buildDocumentsFromConfig = (
  documentsConfig,
  tiposDocumento = [],
  previousDocuments = [],
  documentos = [],
) => {
  return documentsConfig.map((documentConfig) => {
    const previousDocument = previousDocuments.find(
      (document) => getDocumentKey(document) === getDocumentKey(documentConfig),
    );
    const documentType = tiposDocumento.find(
      (tipoDocumento) =>
        normalizeText(tipoDocumento.nombre) ===
        normalizeText(documentConfig.nombre),
    );
    const uploadedDocument = documentos.find(
      (documento) =>
        Number(documento.id_tipo_documento) ===
          Number(documentType?.id ?? documentType?.id_tipo_documento),
    );

    

    return {
      ...documentConfig,
      archivo: previousDocument?.archivo ?? documentConfig.archivo ?? null,
      archivoNombre: firstNonEmptyText(
        previousDocument?.archivoNombre,
        documentConfig.archivoNombre,
        documentConfig.nombre_documento,
        uploadedDocument?.nombre_documento,
      ),
      subido: Boolean(
        previousDocument?.archivo ||
        documentConfig.subido ||
        documentConfig.archivoNombre ||
        uploadedDocument,
      ),
      id_archivo:
        uploadedDocument?.id ??
        previousDocument?.id_archivo ??
        documentConfig.id_archivo ??
        null,
      id_tipo_documento:
        documentType?.id ??
        documentType?.id_tipo_documento ??
        documentConfig.id_tipo_documento,
      visible: Boolean(
        documentConfig.required ||
        previousDocument?.visible ||
        previousDocument?.archivoNombre ||
        documentConfig.archivoNombre ||
        uploadedDocument,
      ),
      extension:
        documentType?.extension ??
        uploadedDocument?.extension ??
        documentConfig.extension ??
        DEFAULT_ACCEPTED_EXTENSIONS,
    };
  });
};
/* ==========================================================
 * PREVIEW
 * ========================================================== */

export const createPreviewState = () => ({
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
});

/* ==========================================================
 * DOCUMENT
 * ========================================================== */

export const getDocumentId = (document = {}) =>
  document?.id_archivo ??
  document?.id_documento ??
  document?.idDocumento ??
  document?.id ??
  null;

export const getDocumentDisplayName = (document = {}, fallback = "Archivo") =>
  firstNonEmptyText(
    document?.archivoNombre,
    hasRealDocumentName(document?.nombre_documento)
      ? document.nombre_documento
      : fallback,
  );

export const hasDocumentFile = (document = {}) =>
  Boolean(
    document?.subido ||
    document?.archivo ||
    document?.archivoNombre ||
    document?.id_archivo,
  );

/* ==========================================================
 * FILES
 * ========================================================== */

export const renameFile = (file, fileName) =>
  new File([file], fileName, {
    type: file.type,
    lastModified: file.lastModified,
  });

export const isFile = (value) =>
  typeof File !== "undefined" && value instanceof File;

export const sanitizeFileNamePart = (value, fallback = "archivo") =>
  String(value || fallback)
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "") || fallback;

export const getFileName = (file, fallback = "Ningún archivo seleccionado") => {
  if (typeof file === "string") return file;

  return file?.name ?? getDocumentDisplayName(file, fallback);
};

export const getFileExtension = (file = {}) => {
  const extension =
    getDocumentExtension({
      nombre_documento: file?.name ?? file?.nombre_documento,
      extension: file?.extension,
    }) || normalizeExtension(file?.type);

  return extension ? `.${extension}` : "";
};

export const validateDocumentFile = (
  file,
  documentType = {},
  messages = {},
  options = {},
) => {
  const extension = getFileExtension(file);
  const acceptedExtensions =
    documentType.extension ??
    options.acceptedExtensions ??
    DEFAULT_ACCEPTED_EXTENSIONS;
  const allowedExtensions = String(acceptedExtensions)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const maxSizeBytes = options.maxSizeBytes ?? MAX_FILE_SIZE_BYTES;
  const maxSizeMb = options.maxSizeMb ?? MAX_FILE_SIZE_MB;

  if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
    return typeof messages.invalidType === "function"
      ? messages.invalidType(acceptedExtensions)
      : `Formato no válido. Formatos permitidos: ${acceptedExtensions}`;
  }

  if (file?.size > maxSizeBytes) {
    return typeof messages.maxSize === "function"
      ? messages.maxSize(maxSizeMb)
      : `El archivo no puede superar los ${maxSizeMb} MB.`;
  }

  return "";
};

/* ==========================================================
 * EXTENSIONS
 * ========================================================== */

export const normalizeExtension = (value) => {
  if (!value) return "";

  let normalized = String(value).trim().toLowerCase();

  if (normalized.includes("/")) normalized = normalized.split("/").pop();

  if (normalized.includes(";")) normalized = normalized.split(";")[0];

  return normalized.replace(/^\./, "");
};

export const getDocumentExtension = (document = {}) => {
  const extension = normalizeExtension(document?.extension);

  if (extension) return extension;

  const parts = String(document?.nombre_documento || "").split(".");

  if (parts.length < 2) return "";

  return normalizeExtension(parts.pop());
};

export const getTipoDocumento = (
  document = {},
  labels = { image: "Imagen", document: "Documento" },
) =>
  IMAGE_EXTENSIONS.has(getDocumentExtension(document))
    ? labels.image
    : labels.document;

/* ==========================================================
 * PREVIEW HELPERS
 * ========================================================== */

export const isPdfDocument = (document = {}) => {
  if (document?.datos_documento?.startsWith("data:application/pdf")) {
    return true;
  }

  return getDocumentExtension(document) === "pdf";
};

export const isPreviewableDocument = (document = {}) =>
  PREVIEW_EXTENSIONS.has(getDocumentExtension(document));

export const getImageSource = (document = {}) => {
  if (!document?.datos_documento) return "";

  if (document.datos_documento.startsWith("data:")) {
    return document.datos_documento;
  }

  const mimeByExtension = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
  };

  const mime = mimeByExtension[getDocumentExtension(document)] || "image/jpeg";

  return `data:${mime};base64,${document.datos_documento}`;
};

/* ==========================================================
 * FORMAT
 * ========================================================== */

export const formatDocumentSize = (size) => {
  const bytes = Number(size);

  if (!Number.isFinite(bytes) || bytes <= 0) return null;

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const buildDocumentName = (format = "", data = {}, extension = "") => {
  const name = Object.entries(data).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{${key}\\}`, "gi"), value ?? ""),
    format,
  );
  const normalizedExtension = normalizeExtension(extension);
  return normalizedExtension ? `${name}.${normalizedExtension}` : name;
};

export const buildDownloadFileName = (
  fileName = "",
  fallback = "documento",
  extension = "",
) => {
  const name = String(fileName || fallback).trim().replace(/\.+$/, "");
  const normalizedExtension = normalizeExtension(extension);

  if (!normalizedExtension || getDocumentExtension({ nombre_documento: name })) {
    return name;
  }

  return `${name}.${normalizedExtension}`;
};

/* ==========================================================
 * DOCUMENT MAPPING
 * ========================================================== */

export function asignarTiposADocumentos(documentosBase, tipos) {
  return documentosBase.map((doc) => {
    const match = tipos.find(
      (tipo) => normalizeText(tipo.nombre) === normalizeText(doc.nombre),
    );

    if (!match) return doc;

    return {
      ...doc,
      id_tipo_documento: match.id,
      extension: match.extension,
    };
  });
}

export function asignarArchivosADocumentos(documentosBase, documentosSubidos) {
  return documentosBase.map((doc) => {
    const archivo = documentosSubidos.find(
      (item) =>
        Number(item.id_tipo_documento) === Number(doc.id_tipo_documento),
    );

    if (!archivo) return doc;

    return {
      ...doc,
      archivo: archivo.archivo,
      archivoNombre: archivo.nombre_documento,
      subido: true,
      id_archivo: archivo.id,
      extension: archivo.extension,
    };
  });
}

export function getDocumentName(doc, fallback = "Archivo") {
  const candidate = doc?.nombre_documento;
  return hasRealDocumentName(candidate) ? candidate : fallback;
}

export function cloneDocuments(documents) {
  return documents.map((document) => ({ ...document }));
}
