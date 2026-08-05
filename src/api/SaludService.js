import { RequestAPI } from './apiClient';

export { RequestAPI };

export function ObtenerEspecialidadesActivas() {
  return RequestAPI('/Salud/ObtenerEspecialidadesActivas/', 'GET');
}

export function ObtenerEspecialidades() {
  return RequestAPI('/Salud/ObtenerEspecialidadesCompleto/', 'GET');
}

export function CrearEspecialidad(body) {
  return RequestAPI('/Salud/CrearEspecialidad/', 'POST', body);
}

export function ModificaEspecialidad(id, body) {
  return RequestAPI(
    `/Salud/ModificarEspecialidad/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function ObtenerPersonalMedico() {
  return RequestAPI('/Salud/ObtenerListadoEspecialistas/', 'GET');
}

export function CrearPersonal(body) {
  return RequestAPI('/Salud/CrearEspecialista/', 'POST', body);
}

export function ModificarPersonal(cuil, body) {
  return RequestAPI(
    `/Salud/ModificarEspecialista/${encodeURIComponent(cuil)}`,
    'PUT',
    body,
  );
}

export function ObtenerCursosMedicos() {
  return RequestAPI('/Salud/ObtenerCursosMedicos/', 'GET');
}

export function CrearCurso(body) {
  return RequestAPI('/Salud/CrearCursoMedico/', 'POST', body);
}

export function ModificarCurso(id, body) {
  return RequestAPI(
    `/Salud/ModificarCursoMedicos/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function EliminarCursoMedico(id) {
  return RequestAPI(
    `/Salud/EliminarCursoMedico/${encodeURIComponent(id)}`,
    'DELETE',
  );
}

export function ObtenerHorariosCompleto() {
  return RequestAPI('/Salud/ObtenerHorarioMedicos/', 'GET');
}

export function ObtenerHorariosXCUIL(cuil) {
  return RequestAPI(
    `/Salud/ObtenerHorariosXCuil/${encodeURIComponent(cuil)}`,
    'GET',
  );
}

export function CrearHorario(body) {
  return RequestAPI('/Salud/CrearHorarioMedico/', 'POST', body);
}

export function ModificarHorario(id, body) {
  return RequestAPI(
    `/Salud/ModificarHorarioMedicos/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function EliminarHorario(id) {
  return RequestAPI(
    `/Salud/EliminarHorario/${encodeURIComponent(id)}`,
    'DELETE',
  );
}

export function ObtenerFaltasXCUIL(cuil) {
  return RequestAPI(
    `/Salud/ObtenerFaltasEspecialista/${encodeURIComponent(cuil)}`,
    'GET',
  );
}

export function RegistrarFalta(body) {
  return RequestAPI('/Salud/RegistrarFaltaMedica/', 'POST', body);
}

export function ObtenerEstadosTurno() {
  return RequestAPI('/Salud/ObtenerEstadosTurno/', 'GET');
}

export function ObtenerTurnosEstudiante(legajo) {
  return RequestAPI(
    `/Salud/ObtenerTurnosXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerTurnos() {
  return RequestAPI('/Salud/ObtenerTurnosMedicos/', 'GET');
}

export function ObtenerTurnosActivos() {
  return RequestAPI('/Salud/ObtenerTurnosMedicosActivos/', 'GET');
}

export function ObtenerTurnosFinalizados() {
  return RequestAPI('/Salud/ObtenerTurnosMedicosFinalizados/', 'GET');
}

export function ObtenerTurnosCancelados() {
  return RequestAPI('/Salud/ObtenerTurnosMedicosCancelado/', 'GET');
}

export function CrearTurnos(body) {
  return RequestAPI('/Salud/CrearTurnoMedico/', 'POST', body);
}

export function ModificarTurno(id, body) {
  return RequestAPI(
    `/Salud/ModificarTurnoMedico/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}
