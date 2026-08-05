import { RequestAPI } from "./apiClient";

export { RequestAPI };

export function ObtenerEmpleados() {
  return RequestAPI("/Empleados/ObtenerEmpleados/", "GET");
}

export function ObtenerUsuariosXLegajo(legajo) {
  return RequestAPI(
    `/Usuarios/ObtenerUsuarioXlegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerUsuarios() {
  return RequestAPI("/Usuarios/ObtenerUsuarios/", "GET");
}

export function CrearEmpleado(body, nombres, apellidos) {
  return RequestAPI(
    `/Empleados/CrearEmpleado?nombres=${encodeURIComponent(nombres)}&apellidos=${encodeURIComponent(apellidos)}`,
    "POST",
    body,
  );
}

export function ModificarUsuario(id, body) {
  return RequestAPI(
    `/Usuarios/ModificarUsuario/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearRegistroUsuario(body, nombres, apellidos, idEspecialidad) {
  return RequestAPI(
    `/Usuarios/CrearRegistroUsuario?nombres=${encodeURIComponent(nombres)}&apellidos=${encodeURIComponent(apellidos)}&id_especialidad=${encodeURIComponent(idEspecialidad)}`,
    "POST",
    body,
  );
}

export function ObtenerHorarios() {
  return RequestAPI("/Empleados/ObtenerHorarios/", "GET");
}

export function BuscarHorariosXEmpleado(idEmpleado) {
  return RequestAPI(
    `/Empleados/ObtenerHorariosXEmpleado/${encodeURIComponent(idEmpleado)}`,
    "GET",
  );
}

export function CrearHorarioEmpleado(body) {
  return RequestAPI("/Empleados/CrearHorario/", "POST", body);
}

export function ModificarHorario(id, body) {
  return RequestAPI(
    `/Empleados/ModificarHorario/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function EliminarHorario(idHorario) {
  return RequestAPI(
    `/Empleados/EliminarHorario/${encodeURIComponent(idHorario)}`,
    "DELETE",
  );
}

export function BuscarLinkFrecuentes() {
  return RequestAPI("/Empleados/ObtenerLinktree/", "GET");
}

export function CrearLinkFrecuentes(body) {
  return RequestAPI("/Empleados/CrearItemLinkTree/", "POST", body);
}

export function EliminarLinkFrecuentes(idLink) {
  return RequestAPI(
    `/Empleados/EliminarItem/${encodeURIComponent(idLink)}`,
    "DELETE",
  );
}

export function ContarVisualizacionLinkFrecuente(idLink) {
  return RequestAPI(
    `/Empleados/ContarVisualizacionItem/${encodeURIComponent(idLink)}`,
    "PUT",
  );
}
