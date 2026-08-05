import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from './apiClient';

export { RequestAPI };

export function ObtenerViajesXLegajo(legajo) {
  return RequestAPI(
    `/Viaje/ObtenerViajesXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}
export function ObtenerViajesXFecha(desde,hasta) {
  return RequestAPI(
    `/Viaje/ObtenerViajesXFecha/${encodeURIComponent(desde)}/${encodeURIComponent(hasta)}`,
    'GET',
  );
}
export function ObtenerViajesActivos() {
  return RequestAPI('/Viaje/ObtenerViajesActivo/', 'GET');
}

export function ModificarViaje(id, body) {
  return RequestAPI(
    `/Viaje/ModificarViaje/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function CrearViaje(body) {
  return RequestAPI('/Viaje/CrearViaje', 'POST', body);
}

export function ObtenerDocumentacionViaje(id) {
  return RequestAPI(
    `/Viaje/ListarDocumentacionXViaje/${encodeURIComponent(id)}`,
    'GET',
  );
}

export function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    `/Estudiante/ListarDocumentacionXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function DescargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/Viaje/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export function CrearDocumentoViaje(idViaje, idTipoDocumento, archivo) {
  return apiUploadFile(
    `/Viaje/CrearDocumentoViaje/${encodeURIComponent(idViaje)}/${encodeURIComponent(idTipoDocumento)}`,
    archivo,
  );
}

export function EliminarDocumentoViaje(idArchivo) {
  return apiDeleteFile(
    `/Viaje/EliminarDocumentoViaje/${encodeURIComponent(idArchivo)}`,
  );
}

export function ObtenerEmpresas() {
  return RequestAPI('/Viaje/ObtenerEmpresasViaje/', 'GET');
}

export function ModificarEmpresa(id, body) {
  return RequestAPI(
    `/Viaje/ModificarEmpresa/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function CrearEmpresa(body) {
  return RequestAPI('/Viaje/CrearEmpresa', 'POST', body);
}

export function ObtenerInscriptosViaje(idViaje) {
  return RequestAPI(
    `/Viaje/ObtenerInscriptosViaje/${encodeURIComponent(idViaje)}`,
    'GET',
  );
}

export function EliminarInscriptosViaje(idInscripto) {
  return RequestAPI(
    `/Viaje/EliminarInscriptos/${encodeURIComponent(idInscripto)}`,
    'DELETE',
  );
}

export function CrearInscriptoViaje(body) {
  return RequestAPI('/Viaje/CrearInscriptoViaje', 'POST', body);
}

export function ModificarInscripto(id, body) {
  return RequestAPI(
    `/Viaje/ModificarInscripto/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}
