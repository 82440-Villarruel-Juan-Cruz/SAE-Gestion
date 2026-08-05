import { apiUploadFile, apiDownloadDocument, RequestAPI } from './apiClient';
import { mapHorarios, mapTorneo } from './formatters/DeportesFormatters';

// DOCENTES DEPORTIVOS
export async function obtenerDocentesDeportivos() {
  return RequestAPI('/Deporte/ObtenerDocentesDeportivos', 'GET');
}

export async function crearDocenteDeportivo(body) {
  return RequestAPI('/Deporte/CrearDocenteDeportivo', 'POST', body);
}

export async function modificarDocenteDeportivo(cuil, body) {
  return RequestAPI(
    '/Deporte/ModificarDocenteDeportivo/' + encodeURIComponent(cuil),
    'PUT',
    body,
  );
}

// DEPORTISTAS
export async function obtenerDeportistas() {
  return RequestAPI('/Deporte/ObtenerDeportistasCompleto', 'GET');
}

export async function crearDeportista(body) {
  return RequestAPI('/Deporte/CrearDeportista', 'POST', body);
}

export async function modificarDeportista(id, body) {
  return RequestAPI(
    '/Deporte/ModificarDeportista/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

export async function obtenerIdDeportista(legajo) {
  return RequestAPI(
    '/Deporte/ObtenerDeportistasXLegajo/' + encodeURIComponent(legajo),
    'GET',
  );
}

export async function obtenerDeportistasXTorneo(idTorneo) {
  return RequestAPI(
    '/Deporte/ObtenerDeportistasXTorneo/' + encodeURIComponent(idTorneo),
    'GET',
  );
}

export async function obtenerDeportistasXTorneo2(idTorneo) {
  return obtenerDeportistasXTorneo(idTorneo);
}

// ESPACIOS DEPORTIVOS
export async function obtenerEspaciosDeportivos() {
  return RequestAPI('/Deporte/ObtenerEspDeportivoCompleto', 'GET');
}

export async function obtenerEspDeportivoActivos() {
  return RequestAPI('/Deporte/obtenerEspDeportivoActivos/', 'GET');
}

export async function crearEspacioDeportivo(body) {
  return RequestAPI('/Deporte/CrearEspacioDeportivo', 'POST', body);
}

export async function modificarEspacioDeportivo(id, body) {
  return RequestAPI(
    '/Deporte/ModificarEspacioDeportivo/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

// DEPORTES
export async function obtenerDeportesActivos() {
  return RequestAPI('/Deporte/ObtenerDeportesActivos/', 'GET');
}

export async function obtenerDeportesCompleto() {
  return RequestAPI('/Deporte/ObtenerDeportesCompleto/', 'GET');
}

export async function crearDeporte(body) {
  return RequestAPI('/Deporte/CrearDeporte', 'POST', body);
}

export async function modificarDeporte(id, body) {
  return RequestAPI(
    '/Deporte/ModificarDeporte/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

// HORARIOS
export async function obtenerHorariosActivos() {
  return RequestAPI('/Deporte/obtenerHorariosActivos/', 'GET');
}

export async function obtenerHorariosXDeporte(idDeporte) {
  return RequestAPI(
    '/Deporte/ObtenerHorariosXDeporte/' + encodeURIComponent(idDeporte),
    'GET',
  );
}

export async function crearHorarioDeportivo(body) {
  return RequestAPI('/Deporte/CrearHorarioDeportivo/', 'POST', body);
}

export async function modificarHorarioDeportivo(id, body) {
  return RequestAPI(
    '/Deporte/ModificarHorario/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

export async function eliminarHorarioDeportivo(id) {
  return RequestAPI(
    '/Deporte/EliminarHorarioDeportivo/' + encodeURIComponent(id),
    'DELETE',
  );
}

// TORNEOS
export async function obtenerTorneosDeportivos() {
  const torneos = await RequestAPI(
    '/Deporte/ObtenerTorneosDeportivos/',
    'GET',
  );
  return Array.isArray(torneos) ? torneos.map(mapTorneo) : [];
}

export async function obtenerTorneoXId(id) {
  const torneo = await RequestAPI(
    '/Deporte/ObtenerTorneosXId/' + encodeURIComponent(id),
    'GET',
  );
  return torneo ? mapTorneo(torneo) : torneo;
}

export async function obtenerTorneosXDeporte(id_deporte) {
  const torneos = await RequestAPI(
    '/Deporte/ObtenerTorneosXDeporte/' + encodeURIComponent(id_deporte),
    'GET',
  );
  return Array.isArray(torneos) ? torneos.map(mapTorneo) : [];
}

export async function crearTorneo(body) {
  return RequestAPI('/Deporte/CrearTorneo/', 'POST', body);
}

export async function modificarTorneo(id, body) {
  return RequestAPI(
    '/Deporte/ModificarTorneo/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

export async function crearInscripcionTorneo(idTorneo, idDeportista, body) {
  return RequestAPI(
    '/Deporte/CrearInscripcionTorneo/' +
      encodeURIComponent(idTorneo) +
      '/' +
      encodeURIComponent(idDeportista),
    'POST',
    body,
  );
}

export async function eliminarInscripcionTorneo(idInscripcion) {
  return RequestAPI(
    '/Deporte/EliminarInscripcionTorneo/' +
      encodeURIComponent(idInscripcion),
    'DELETE',
  );
}

// INSCRIPCIONES
export async function obtenerInscripcionesXDeportista(id_deportista) {
  return RequestAPI(
    '/Deporte/obtenerInscripcionesXDeportista/' +
      encodeURIComponent(id_deportista),
    'GET',
  );
}

export async function crearInscripcionDeporte(id_deporte, id_deportista) {
  return RequestAPI(
    '/Deporte/CrearInscripcionDeporte/' +
      encodeURIComponent(id_deporte) +
      '/' +
      encodeURIComponent(id_deportista),
    'POST',
  );
}

export async function eliminarInscripcionDeporte(idInscripcion) {
  return RequestAPI(
    '/Deporte/EliminarInscripcionDeporte/' +
      encodeURIComponent(idInscripcion),
    'DELETE',
  );
}

// DOCUMENTACION
export async function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    '/Estudiante/ListarDocumentacionXLegajo/' + encodeURIComponent(legajo),
    'GET',
  );
}

export function descargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/Estudiante/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export async function crearDocumentoEstudiante(id_tipo_documento, archivo) {
  return apiUploadFile(
    `/Estudiante/CrearDocumentoEstudiante/${encodeURIComponent(id_tipo_documento)}`,
    archivo,
  );
}

export async function eliminarDocumentoEstudiante(id_archivo) {
  return RequestAPI(
    '/Estudiante/EliminarDocumentoEstudiante/' +
      encodeURIComponent(id_archivo),
    'DELETE',
  );
}

export async function obtenerHorariosDeportista(id_deportista) {
  const [
    deporte,
    horariosActivos,
    espaciosDeportivos,
    inscripcionesDeportista,
  ] = await Promise.all([
    obtenerDeportesActivos(),
    obtenerHorariosActivos(),
    obtenerEspDeportivoActivos(),
    id_deportista
      ? obtenerInscripcionesXDeportista(id_deportista)
      : Promise.resolve([]),
  ]);

  if (!deporte?.length) {
    throw new Error('No hay deportes activos');
  }

  if (!horariosActivos?.length) {
    throw new Error('No hay horarios activos');
  }

  if (!espaciosDeportivos?.length) {
    throw new Error('No hay espacios deportivos');
  }

  const inscripciones = inscripcionesDeportista ?? [];

  return mapHorarios(
    horariosActivos,
    deporte,
    espaciosDeportivos,
    inscripciones,
  );
}
