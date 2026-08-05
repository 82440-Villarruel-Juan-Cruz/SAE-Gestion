import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from "./apiClient";
import {
  mapBecario,
  mapServicioInterno,
  mapServicioInternoPayload,
} from "./formatters/BecasFormatter";

export { RequestAPI };

export const ObtenerProyectosInvestigacion = () =>
  RequestAPI("/Beca/ObtenerProyectosInvestigacion", "GET");

export async function ObtenerServiciosInternos() {
  const data = await RequestAPI("/Beca/ObtenerServiciosInternos", "GET");
  return data.map(mapServicioInterno);
}

export async function ObtenerBecariosCompleto() {
  const data = await RequestAPI("/Beca/ObtenerBecariosCompleto", "GET");
  return data.map(mapBecario);
}

export const CrearServicioInterno = (body) =>
  RequestAPI(
    "/Beca/CrearServicioInterno",
    "POST",
    mapServicioInternoPayload(body),
  );

export const CrearProyectoInvestigacion = (body) =>
  RequestAPI("/Beca/CrearProyectoInvestigacion", "POST", body);

export function EditarProyectoInvestigacion(id, body) {
  return RequestAPI(
    `/Beca/ModificarProyecto/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function EditarServicioInterno(id, body) {
  return RequestAPI(
    `/Beca/ModificarServicio/${encodeURIComponent(id)}`,
    "PUT",
    mapServicioInternoPayload(body),
  );
}

export function ObtenerBecariosEconomicaXLegajo(legajo) {
  return RequestAPI(
    `/Beca/ObtenerBecariosEconomicaXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerBecariosServiciosXLegajo(legajo) {
  return RequestAPI(
    `/Beca/ObtenerBecariosServiciosXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerBecariosInvestigacionXLegajo(legajo) {
  return RequestAPI(
    `/Beca/ObtenerBecariosInvestigacionXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerBecariosXLegajo(legajo) {
  return RequestAPI(
    `/Beca/ObtenerBecariosXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerUsuariosXLegajo(legajo) {
  return RequestAPI(
    `/Usuarios/ObtenerUsuarioXlegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export const CrearBecarioSAE = (body) =>
  RequestAPI("/Beca/CrearBecarioSAE", "POST", body);

export function EditarBecarioSAE(id, body) {
  console.log(body);
  return RequestAPI(
    `/Beca/ModificarBecarioSAE/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearBecarioEconomica(idBecario, body) {
  return RequestAPI(
    `/Beca/CrearBecarioEconomica/${encodeURIComponent(idBecario)}`,
    "POST",
    body,
  );
}

export function EditarBecarioEconomica(id, body) {
  return RequestAPI(
    `/Beca/ModificarBecarioEconomica/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearBecarioInvestigacion(idBecario, idProyecto, body) {
  return RequestAPI(
    `/Beca/CrearBecarioInvestigacion/${encodeURIComponent(idBecario)}/${encodeURIComponent(idProyecto)}`,
    "POST",
    body,
  );
}

export function EditarBecarioInvestigacion(id, body) {
  return RequestAPI(
    `/Beca/ModificarBecarioInvestigacion/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearBecarioServicio(idBecario, idServicio, body) {
  return RequestAPI(
    `/Beca/CrearBecarioServicio/${encodeURIComponent(idBecario)}/${encodeURIComponent(idServicio)}`,
    "POST",
    body,
  );
}

export function EditarBecarioServicio(id, body) {
  return RequestAPI(
    `/Beca/ModificarBecarioServicio/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    `/Estudiante/ListarDocumentacionXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function descargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/Estudiante/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export function crearDocumentoEstudiante(idTipoDocumento, archivo) {
  return apiUploadFile(
    `/Estudiante/CrearDocumentoEstudiante/${encodeURIComponent(idTipoDocumento)}`,
    archivo,
  );
}

export function eliminarDocumentoEstudiante(idDocumento) {
  return apiDeleteFile(
    `/Estudiante/EliminarDocumentoEstudiante/${encodeURIComponent(idDocumento)}`,
  );
}
