import { getDocumentName } from "../../utils/documents.utils.js";
import { normalizeDateInput } from "../../utils/date.utils.js";
import { generateRows as generateBaseRows } from "../../utils/datagrid.utils.jsx";
import {
  formatCurrency,
  normalizeCurrencyValue,
} from "../../utils/formatters.utils.js";
import {
  EMPTY_PURCHASES,
  PURCHASE_DOCUMENTS,
} from "../../utils/common/common.config.js";

export const clonePurchase = (purchase = EMPTY_PURCHASES) => ({
  ...purchase,
  facturas_documentos: [...(purchase.facturas_documentos || [])],
  informe: {
    ...EMPTY_PURCHASES.informe,
    ...(purchase.informe_tecnico || {}),
    ...(purchase.informe || {}),
  },
});

export const isInformeDocument = (
  document = {},
  documentTypes = PURCHASE_DOCUMENTS,
) => {
  const typeId = Number(document.id_tipo_documento);
  const informeType = documentTypes.find(
    (documentType) => documentType.key === "informe",
  );
  const name = getDocumentName(document).toLowerCase();

  return (
    (informeType?.id_tipo_documento &&
      typeId === Number(informeType.id_tipo_documento)) ||
    name.includes("informetecnico") ||
    name.includes("informe")
  );
};

export const normalizeDocument = (document = {}) => {
  const normalized = {
    ...document,
    id: document.id ?? document.id_documento ?? document.idDocumento ?? null,
    id_documento:
      document.id_documento ?? document.idDocumento ?? document.id ?? null,
    id_tipo_documento:
      document.id_tipo_documento ??
      document.idTipoDocumento ??
      document.id_tipo ??
      document.idTipo ??
      null,
    nombre_documento:
      document.nombre_documento ??
      document.nombreDocumento ??
      document.nombre_archivo ??
      document.nombreArchivo ??
      document.name ??
      "",
    datos_documento:
      document.datos_documento ?? document.datosDocumento ?? null,
    extension: document.extension ?? document.ext ?? "",
    tamanio: document.tamanio ?? document.size ?? document.tamano ?? null,
    ruta: document.ruta ?? document.path ?? null,
  };

  return {
    ...normalized,
    name: getDocumentName(normalized),
  };
};

export const normalizeInforme = (informe = {}, idCompra = null) => {
  const safeInforme = informe ?? {};

  return {
    nro_expediente:
      safeInforme.nro_expediente ??
      safeInforme.nroExpediente ??
      safeInforme.expediente ??
      null,
    id_compra: safeInforme.id_compra ?? safeInforme.idCompra ?? idCompra,
    precio_real: safeInforme.precio_real ?? safeInforme.precioReal ?? "",
    fecha_licitacion: normalizeDateInput(
      safeInforme.fecha_licitacion ?? safeInforme.fechaLicitacion ?? null,
    ),
    fecha_informe: normalizeDateInput(
      safeInforme.fecha_informe ?? safeInforme.fechaInforme ?? null,
    ),
    nombre_solicitante:
      safeInforme.nombre_solicitante ?? safeInforme.nombreSolicitante ?? "",
    nombre_ganador:
      safeInforme.nombre_ganador ?? safeInforme.nombreGanador ?? "",
    documento_pdf:
      safeInforme.documento_pdf ?? safeInforme.documentoPdf ?? null,
  };
};

export const normalizePurchase = (
  purchase = {},
  informe = null,
  documentos = [],
  documentTypes = PURCHASE_DOCUMENTS,
) => {
  const idCompra = purchase.id ?? purchase.id_compra ?? purchase.idCompra ?? null;
  const normalizedDocuments = (Array.isArray(documentos) ? documentos : [])
    .filter(Boolean)
    .map(normalizeDocument);
  const facturaDocs = normalizedDocuments.filter(
    (document) => !isInformeDocument(document, documentTypes),
  );
  const informeDoc =
    normalizedDocuments.find((document) =>
      isInformeDocument(document, documentTypes),
    ) ?? null;

  return {
    ...purchase,
    id: idCompra,
    id_usuario:
      purchase.id_usuario ??
      purchase.idUsuario ??
      purchase.id_usuario_empleado ??
      purchase.idUsuarioEmpleado ??
      purchase.id_empleado ??
      purchase.idEmpleado ??
      null,
    nombre_usuario:
      purchase.nombre_usuario ??
      purchase.nombreUsuario ??
      purchase.nombre_empleado ??
      purchase.nombreEmpleado ??
      purchase.nombre_usuario_empleado ??
      purchase.nombreUsuarioEmpleado ??
      "",
    nombre_compra: purchase.nombre_compra ?? purchase.nombreCompra ?? "",
    precio_sugerido: purchase.precio_sugerido ?? purchase.precioSugerido ?? "",
    motivo: purchase.motivo ?? "",
    fecha_compra: normalizeDateInput(purchase.fecha_compra ?? ""),
    facturas_documentos: facturaDocs,
    informe: {
      ...normalizeInforme(
        informe ??
          purchase.informe ??
          purchase.informe_tecnico ??
          purchase.informeTecnico ??
          {},
        idCompra,
      ),
      documento_pdf: informeDoc,
    },
  };
};

export const mapCompras = (compra) => normalizePurchase(compra);

export const mapCompraConDetalle = (
  compra,
  informe = null,
  documentos = [],
  documentTypes = PURCHASE_DOCUMENTS,
) => normalizePurchase(compra, informe, documentos, documentTypes);

export const buildCompraBody = (purchase = {}) => ({
  id_usuario: purchase.id_usuario,
  nombre_usuario: purchase.nombre_usuario,
  nombre_compra: purchase.nombre_compra,
  precio_sugerido: normalizeCurrencyValue(purchase.precio_sugerido),
  motivo: purchase.motivo,
  fecha_compra: purchase.fecha_compra,
});

export const buildInformeBody = (purchase = {}, idCompra = null) => {
  const informe = purchase.informe || {};

  return {
    nro_expediente: informe.nro_expediente ?? informe.nroExpediente ?? null,
    id_compra: idCompra ?? purchase.id,
    precio_real: normalizeCurrencyValue(informe.precio_real),
    fecha_licitacion: informe.fecha_licitacion || null,
    fecha_informe: informe.fecha_informe || null,
    nombre_solicitante: informe.nombre_solicitante || "",
    nombre_ganador: informe.nombre_ganador || "",
  };
};

export const PURCHASE_COLUMNS_SAMPLE = {
  id: null,
  nombre_usuario: "",
  nombre_compra: "",
  precio_sugerido: "",
  motivo: "",
  fecha_compra: "",
  nro_expediente: "",
  nombre_ganador: "",
  precio_real: "",
};

export const generatePurchaseRows = (data) =>
  generateBaseRows(data, (item) => ({
    id: item.id ?? item.id_compra ?? item.idCompra ?? null,
    id_usuario: item.id_usuario,
    nombre_usuario: item.nombre_usuario ?? "",
    nombre_compra: item.nombre_compra ?? "",
    precio_sugerido: formatCurrency(item.precio_sugerido ?? ""),
    motivo: item.motivo ?? "",
    fecha_compra: item.fecha_compra ?? "",
    facturas_documentos: item.facturas_documentos ?? [],
    informe: item.informe ?? {},
    nro_expediente: item.informe?.nro_expediente ?? "",
    precio_real: formatCurrency(item.informe?.precio_real),
    fecha_licitacion: item.informe?.fecha_licitacion ?? "",
    fecha_informe: item.informe?.fecha_informe ?? "",
    nombre_solicitante: item.informe?.nombre_solicitante || "",
    nombre_ganador: item.informe?.nombre_ganador || "",
  }));
