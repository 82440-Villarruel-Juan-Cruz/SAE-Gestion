import { RequestAPI } from "./apiClient";

export { RequestAPI };

export function ObtenerEstadisticasBecas(startYear, endYear) {
  return RequestAPI(
    `/Reporte/ObtenerEstadisticasBecas/${encodeURIComponent(startYear)}/${encodeURIComponent(endYear)}`,
    "GET",
  );
}

export function ObtenerEstadisticasViaje(startDate, endDate) {
  return RequestAPI(
    `/Reporte/ObtenerEstadisticasViaje/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`,
    "GET",
  );
}

export function ObtenerEstadisticasDeportes(startYear, endYear) {
  return RequestAPI(
    `/Reporte/ObtenerEstadisticasDeportes/${encodeURIComponent(startYear)}/${encodeURIComponent(endYear)}`,
    "GET",
  );
}

export function ObtenerEstadisticasSalud(startDate, endDate) {
  return RequestAPI(
    `/Reporte/ObtenerEstadisticasSalud/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`,
    "GET",
  );
}
