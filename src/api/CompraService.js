import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from "./apiClient";
import {
  mapCompraConDetalle,
  mapCompras,
} from "./formatters/CompraFormatter.js";

// Se reexporta para conservar el contrato que ya utilizan otros servicios.
export { RequestAPI };

export async function ObtenerComprasXFecha(fechaInicio, fechaFin, documentTypes) {
  const data = await RequestAPI(
    `/Compra/ObtenerComprasXFecha/${encodeURIComponent(fechaInicio)}/${encodeURIComponent(fechaFin)}`,
    "GET",
  );
  const purchases = Array.isArray(data) ? data.map(mapCompras) : [];

  return Promise.all(
    purchases.map(async (purchase) => {
      const idCompra = purchase.id;

      if (!idCompra) {
        return mapCompraConDetalle(purchase, null, [], documentTypes);
      }

      const [informe, documentos] = await Promise.all([
        ObtenerInformeXCompra(idCompra).catch(() => null),
        ListarDocumentacionXCompra(idCompra).catch(() => []),
      ]);

      return mapCompraConDetalle(purchase, informe, documentos, documentTypes);
    }),
  );
}

export function CrearCompra(body) {
  return RequestAPI("/Compra/CrearCompra/", "POST", body);
}

export function ModificarCompra(idCompra, body) {
  return RequestAPI(
    `/Compra/ModificarCompra/${encodeURIComponent(idCompra)}`,
    "PUT",
    body,
  );
}

export function EliminarCompra(idCompra) {
  return RequestAPI(
    `/Compra/EliminarCompra/${encodeURIComponent(idCompra)}`,
    "DELETE",
  );
}

export function ObtenerInformeXExpediente(nroExpediente) {
  return RequestAPI(
    `/Compra/ObtenerInformeXExpediente/${encodeURIComponent(nroExpediente)}`,
    "GET",
  );
}

export function ModificarInforme(nroExpediente, body) {
  return RequestAPI(
    `/Compra/ModificarInforme/${encodeURIComponent(nroExpediente)}`,
    "PUT",
    body,
  );
}

export function ObtenerInformeXCompra(idCompra) {
  return RequestAPI(
    `/Compra/ObtenerInformeXCompra/${encodeURIComponent(idCompra)}`,
    "GET",
  );
}

export function CrearInforme(body) {
  return RequestAPI("/Compra/CrearInforme/", "POST", body);
}

export function ListarDocumentacionXCompra(idCompra) {
  return RequestAPI(
    `/Compra/ListarDocumentacionXCompra/${encodeURIComponent(idCompra)}`,
    "GET",
  );
}

// Los documentos se manejan fuera de RequestAPI porque no son respuestas JSON
// convencionales y pueden transportar imágenes, PDF o multipart/form-data.
export function DescargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/Compra/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export function CrearDocumentoCompra(idCompra, idTipoDocumento, file) {
  return apiUploadFile(
    `/Compra/CrearDocumentoCompra/${encodeURIComponent(idCompra)}/${encodeURIComponent(idTipoDocumento)}`,
    file,
  );
}

export function EliminarDocumentoCompra(idDocumento) {
  return apiDeleteFile(
    `/Compra/EliminarDocumentoCompra/${encodeURIComponent(idDocumento)}`,
  );
}

export const EliminarDocumentoViaje = EliminarDocumentoCompra;
