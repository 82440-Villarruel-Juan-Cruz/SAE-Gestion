import {
  mapResponseCrearDocumento,
  mapResponseEliminarDocumento,
  mapResponseListarDocumentacionXLegajo,
} from './formatters/EstudianteFormatters';
import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from './apiClient';

export { RequestAPI };

export function ObtenerPerfilXLegajo(legajo) {
  return RequestAPI(
    `/Estudiante/BuscarPerfilEstudiante/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ModificarPerfilEstudiante(legajo, body) {
  return RequestAPI(
    `/Estudiante/ModificarPerfilEstudiante/${encodeURIComponent(legajo)}`,
    'PUT',
    body,
  );
}

export function DescargarDocumentacionXId(id, token) {
  return apiDownloadDocument(
    `/Estudiante/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id, token },
  );
}

export function EliminarDocumentoEstudiante(idArchivo, token) {
  return apiDeleteFile(
    `/Estudiante/EliminarDocumentoEstudiante/${encodeURIComponent(idArchivo)}`,
    { token, mapper: mapResponseEliminarDocumento },
  );
}

export function ListarDocumentacionXLegajo(legajo, token) {
  return RequestAPI(
    `/Estudiante/ListarDocumentacionXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
    null,
    { token, mapper: mapResponseListarDocumentacionXLegajo },
  );
}

export function ModificarDocumentoEstudiante(idDocumento, archivo, token) {
  return apiUploadFile(
    `/Estudiante/ModificarDocumento/${encodeURIComponent(idDocumento)}`,
    archivo,
    { method: 'PUT', token, mapper: mapResponseCrearDocumento },
  );
}

export function CrearDocumentoEstudiante(idTipoDocumento, archivo, token) {
  return apiUploadFile(
    `/Estudiante/CrearDocumentoEstudiante/${encodeURIComponent(idTipoDocumento)}`,
    archivo,
    { token, mapper: mapResponseCrearDocumento },
  );
}
