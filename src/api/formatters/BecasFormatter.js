import { formatTime, normalizeDateInput, toApiTime } from "../../utils/date.utils";

export const mapBecario = (becario = {}) => ({
  ...becario,
  fecha_solicitud: normalizeDateInput(becario.fecha_solicitud ?? ""),
  id_becario_previo: becario.id_becario_previo ?? -1,
});

export const mapServicioInterno = (servicio = {}) => ({
  ...servicio,
  nro_interno_telefono: servicio.nro_interno_telefono ?? "",
  horario_atencion: formatTime(servicio.horario_atencion),
  horario_atencion_final: formatTime(servicio.horario_atencion_final),
});

export const mapServicioInternoPayload = (servicio = {}) => {
  return {
    ...servicio,
    nro_interno_telefono: servicio.nro_interno_telefono ?? "",
    horario_atencion: toApiTime(servicio.horario_atencion),
    horario_atencion_final: toApiTime(servicio.horario_atencion_final),
  };
};
