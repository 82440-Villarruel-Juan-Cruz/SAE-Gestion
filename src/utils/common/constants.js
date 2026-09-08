export const calendarDays = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
];
export const completeWeekDays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
export const SCHOLARSHIPS_STATES = {
  SOLICITADO: "solicitado",
  RECHAZADO: "rechazado",
  ACEPTADO_INICIO: "aceptado_inicio",
  ACEPTADO_PAGADO: "aceptado_pagado",
  FIN_BECADO: "fin_becado",
};

export const SCHOLARSHIP_TYPE = {
  ECONOMICA: "Beca Económica",
  SERVICIO: "Beca de Servicio",
  INVESTIGACION: "Beca de Investigación",
};

export const SCHOLARSHIP_TYPES = {
  ECONOMICA: "economica",
  SERVICIO: "servicio",
  INVESTIGACION: "investigacion",
};

export const SCHOLARSHIP_TYPE_OPTIONS = [
  { tipo: SCHOLARSHIP_TYPES.ECONOMICA, nombre: SCHOLARSHIP_TYPE.ECONOMICA },
  { tipo: SCHOLARSHIP_TYPES.SERVICIO, nombre: SCHOLARSHIP_TYPE.SERVICIO },
  {
    tipo: SCHOLARSHIP_TYPES.INVESTIGACION,
    nombre: SCHOLARSHIP_TYPE.INVESTIGACION,
  },
];

export const EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS = {
  common: [],
  economic: [],
};

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const DEFAULT_ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
export const PRESS_DOCS_PER_PAGE = 5;
export const PREVIEW_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "pdf",
]);

export const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "svg",
]);

export const DOCUMENT_PREVIEW_DEFAULT_MESSAGES = {
  fallbackTitle: "Vista previa",
  fallbackName: "archivo",
  noId: "No se encontró el id del documento para previsualizar.",
  notSupported: "Solo se permite vista previa para imágenes o PDF.",
  loadError: "No se pudo cargar la imagen.",
};

export const CAREERS = [
  { value: "sistemas", label: "Sistemas" },
  { value: "electrica", label: "Eléctrica" },
  { value: "electronica", label: "Electrónica" },
  { value: "mecanica", label: "Mecánica" },
  { value: "metalurgica", label: "Metalúrgica" },
  { value: "quimica", label: "Química" },
  { value: "industrial", label: "Industrial" },
  { value: "civil", label: "Civil" },
  { value: "frc", label: "FRC" },
];

export const carreras = CAREERS;

export const PLACEHOLDER_IMAGE = "images/principal/newsGeneric.webp";

export const DOCS_PER_PAGE = 5;

