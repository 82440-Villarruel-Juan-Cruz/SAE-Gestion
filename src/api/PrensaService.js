import { mapPublicacionPublica } from "./formatters/PrensaFormatter.js";
import {
  ApiError,
  apiDownloadDocument,
  apiRequest,
  apiUploadFile,
  RequestAPI,
  resolveApiUrl,
} from "./apiClient";

export async function listarPublicacionesCompleto() {
  const data = await RequestAPI(
    "/Prensa/ListarPublicacionesCompleto",
    "GET",
  );
  return data.map(mapPublicacionPublica);
}

export const listarPublicacionesActivas = () =>
  RequestAPI("/Prensa/ListarPublicacionesActivas", "GET");

export function obtenerPublicacionPorId(id) {
  return RequestAPI(
    `/Prensa/ObtenerPublicacionXId/${encodeURIComponent(id)}`,
    "GET",
  );
}

export const crearPublicacion = (body) =>
  RequestAPI("/Prensa/CrearPublicacion", "POST", body);

export function modificarPublicacion(id, body) {
  return RequestAPI(
    `/Prensa/ModificarPublicacion/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function eliminarPublicacion(id) {
  return RequestAPI(
    `/Prensa/EliminarPublicacion/${encodeURIComponent(id)}`,
    "DELETE",
  );
}

export function listarDocumentosPorPublicacion(idPublicacion) {
  return RequestAPI(
    `/Prensa/ListarDocumentoXPublicacion/${encodeURIComponent(idPublicacion)}`,
    "GET",
  );
}

export const listarDocumentosSinData = () =>
  RequestAPI("/Prensa/ListarDocumentosSinData", "GET");

export function crearDocumentoPrensa(formData) {
  return apiUploadFile("/Prensa/CrearDocumentoPrensaLibre", formData);
}

export function crearVinculoDocPubli(idPublicacion, idDocumento) {
  return RequestAPI(
    `/Prensa/CrearVinculoDocPubli/${encodeURIComponent(idPublicacion)}/${encodeURIComponent(idDocumento)}`,
    "POST",
  );
}

export function descargarDocumentoPorId(idDocumento) {
  return apiDownloadDocument(
    `/Prensa/DescargarDocumentoXId/${encodeURIComponent(idDocumento)}`,
    { id: idDocumento },
  );
}

const PUBLIC_NEWS_ERRORS = {
  400: "Se enviaron parámetros a una vista",
  401: "El endpoint requiere autenticación",
  409: "Conflicto en la base de datos",
  500: "Error interno del servidor",
};

export async function ObtenerNoticiasPublicas() {
  try {
    const response = await apiRequest(
      "/Prensa/ListarPublicacionesActivas",
      { auth: false, includeHeaders: true },
    );

    if (response.status === 204 || !response.data?.length) {
      return {
        success: false,
        data: [],
        message: "No hay publicaciones a listar",
      };
    }
    //console.log("Respuesta de la API:", response); // Agrega este console.log para verificar la respuesta de la API
    const publications = response.data
      .map(mapPublicacionPublica)
      .sort((a, b) => b.prioridad - a.prioridad);

    return { success: true, data: publications, message: "" };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof ApiError
          ? (PUBLIC_NEWS_ERRORS[error.status] ?? error.message)
          : "Error no contemplado",
    };
  }
}

export function getDownloadUrl(id) {
  return resolveApiUrl(
    `/Prensa/DescargarDocumentoXId/${encodeURIComponent(id)}`,
  );
}
