import { RequestAPI } from './apiClient';

export function obtenerTiposDocumento() {
  return RequestAPI('/Herramientas/ObtenerTiposDocumento', 'GET');
}

export function obtenerPerfiles() {
  return RequestAPI('/Herramientas/ObtenerPerfiles', 'GET');
}

export function obtenerCarreras() {
  return RequestAPI('/Herramientas/ObtenerCarreras', 'GET');
}
