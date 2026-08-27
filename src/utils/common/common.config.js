export const EMPTY_BUSSINESS = {
  id: "-1",
  nombre: "",
  contacto: "",
  email: "",
  cuit: "",
  cbu: "",
  activo: true,
};
export const EMPTY_VIAJES = {
  id: "-1",
  nombre: "",
  fecha_inicio: "",
  fecha_fin: "",
  seguro: false,
  origen: "",
  destino: "",
  cantidad_personas: 0,
  nombre_empresa: "",
  costo_aproximado: 0,
};
export const EMPTY_VIAJES_FORM = {
  id: "-1",
  nombre: "",
  fecha_inicio: "",
  fecha_fin: "",
  seguro: false,
  origen: "",
  destino: "",
  cantidad_personas: 0,
  id_empresa_viaje: -1,
  nombre_empresa: "",
  costo_aproximado: 0,
  motivo: "",
};
export const EMPTY_DOCUMENTACION_VIAJE = {
  id: "-1",
  nombre: "",
  datos: "",
  ruta: "",
};

export const EMPTY_DOCUMENTACION_ESTUDIANTE = {
  id: "-1",
  nombre: "",
  datos: "",
  ruta: "",
};
// ------------------------- DEPORTES -------------------------- //
export const EMPTY_TOURNAMENT = {
  nombre_torneo: "",
  fecha_inicio: "",
  fecha_fin: "",
  fecha_limite_inscripcion: "",
  activo: "",
  nombre_deporte: "",
  docente_responsable: "",
  cupo_jugadores: "",
};
export const EMPTY_TOURNAMENT_FORM = {
  id: 0,
  nombre_torneo: "",
  fecha_inicio: "",
  fecha_fin: "",
  fecha_limite_inscripcion: "",
  activo: true,
  id_deporte: 0,
  nombre_deporte: "",
  cuil_responsable: "",
  docente_responsable: "",
  cupo_jugadores: 0,
};
export const EMPTY_SCHEDULE = {
  dia: 1,
  hora_inicio: "",
  hora_fin: "",
  id_espacio_deportivo: "",
  cuil_docente: "",
  activo: true,
};
export const EMPTY_COMPLETE_SCHEDULE = {
  docente: {
    cuil: "",
    nombres: "",
    apellidos: "",
    activo: true,
    fecha_nacimiento: "",
  },
  espacio: { id: 0, nombre: "", domicilio: "", activo: true, url_maps: "" },
  deportista: {
    id: 0,
    legajo: "",
    habilitado_deportado: true,
    vencimiento_ficha: "",
    habilitado_deporte: true,
  },
  deporte: { id: 0, nombre: "", activo: true },
};
// --------------------------- SALUD --------------------------- //
export const EMPTY_TURNO = {
  id: 0,
  cuil_medico: "",
  id_especialidad: null,
  especialista: "",
  legajo: "",
  paciente: "",
  fecha_solicitud: "",
  fecha_atencion: "",
  hora_atencion: "",
  asunto: "",
  id_estado_turno: 0,
  estado: "",
};
//DEBE SER IGUAL LAS COLUMNAS QUE LAS FILAS
export const EMPTY_TURNO_PACIENTE = {
  id: 0,
  estado: "",
  asunto: "",
  especialista: "",
  fecha_solicitud: "",
  fecha_atencion: "",
  hora_atencion: "",
  id_estado_turno: 0,
  estado: "",
};

export const EMPTY_ESPECIALIDAD = {
  id: 0,
  nombre: "",
  descripcion: "",
  activo: true,
};
export const EMPTY_PERSONAL = {
  cuil: "",
  nombre: "",
  apellido: "",
  id_especialidad: null,
  especialidad: "",
  activo: true,
};
export const EMPTY_FALTA = {
  id: 0,
  observacion: "",
  fecha_alta: true,
};
export const EMPTY_CURSO = {
  id: 0,
  nombre_curso: "",
  nombre_docente: "",
  fecha_inicio: "",
  fecha_fin: "",
  cupo_maximo: 0,
  activo: true,
};
export const EMPTY_HORARIO = {
  id: null,
  hora_inicio: "",
  hora_fin: "",
  dia: null,
  cuil_especialista: "",
  especialista: "",
  activo: null,
  id_especialidad: null,
  nombre_especialidad: "",
};

export const EMPTY_HORARIO_SALUD = {
  id: "",
  hora_inicio: "",
  hora_fin: "",
  dia: 1,
  cuil_especialista: null,
  especialista: "",
  activo: true,
  id_especialidad: null,
  nombre_especialidad: null,
};
// ------------------------- EMPLEADO ------------------------- //
export const EMPTY_FORM = {
  dia: 1,
  hora_inicio: "",
  hora_fin: "",
  activo: true,
};
export const EMPTY_EMPLEADO = {
  id: "",
  legajo: "",
  nombre_empleado: "",
  id_perfil: 5,
  nombre_perfil: "",
  activo: true,
};
export const EMPTY_USUARIO = {
  id: "",
  legajo: "",
  nombre_usuario: "",
  id_perfil: "",
  activo: false,
};
// ------------------------- CONSULTAS ------------------------ //
export const EMPTY_LINKFRECUENTE = {
  id: 0,
  titulo: "",
  hipervinculo: "",
  contador: 0,
};

// ---------------------------- JPA -------------------------- //

export const EMPTY_EVENTO_PUBLICO = {
  id: "",
  encargado: "",
  nombre_evento: "",
  lugar: "",
  fecha_evento: "",
  horario_inicio: "",
  horario_fin: "",
  duracion: "",
};
export const EMPTY_STANDS = {
  id: "",
  nombre_stand: "",
  expositor: "",
  ubicacion: "",
  horario_inicio: "",
  horario_fin: "",
};
export const EMPTY_INTERESADOS = {
  id: "",
  nombre_interesado: "",
  contacto: "",
  email: "",
};

// ---------------------------- PRENSA -------------------------- //
export const EMPTY_PUBLICACION = {
  titulo_publicacion: "",
  descripcion: "",
  fecha_inicio: "",
  fecha_vigencia: "",
  prioridad: 0,
  no_dar_baja: false,
  visualizaciones: 0,
};

// ---------------------------- COMRPRAS -------------------------- //

export const EMPTY_PURCHASES = {
  id: null,
  nombre_compra: "",
  precio_sugerido: "",
  motivo: "",
  fecha_compra: "",
  id_usuario: null,
  nombre_usuario: "",
  facturas_documentos: [],
  informe: {
    nro_expediente: null,
    id_compra: null,
    precio_real: "",
    fecha_licitacion: null,
    fecha_informe: null,
    nombre_solicitante: "",
    nombre_ganador: "",
    documento_pdf: null,
  },
};

// ---------------------------- BECAS -------------------------- //
export const EMPTY_PROYECTS = {
  id: 0,
  activo: false,
  nombre_proyecto_investigacion: "",
  centro_investigacion: "",
};

export const EMPTY_SERVICES = {
  id: 0,
  nombre: "",
  nro_telefono: "",
  nro_telefono_interno: "",
  email_institucional: "",
  horario_atencion: "",
  horario_atencion_final: "",
};
export const EMPTY_BECARIO = {
  id: 0,
  id_becario_previo: 0,
  activo: false,
  aceptado_inicio: false,
  puede_pagarle: false,
  legajo: "",
  nombre_becario: "",
  alquila: false,
  anio_beca: "",
  fecha_solicitud: "",
};

// ------------------------ REQUERIDOS ------------------------ //
export const PROFILE_REQUIRED_FIELDS = [
  ["legajo", "Legajo"],
  ["nombres", "Nombres"],
  ["apellidos", "Apellidos"],
  ["dni", "DNI"],
  ["cuil", "CUIL"],
  ["fecha_nacimiento", "Fecha de nacimiento"],
  ["email", "Correo electrónico"],
  ["telefono", "Teléfono"],
  ["direccion", "Dirección"],
];

export const PERSONAL_FIELDS = [
  { name: "nombres", label: "Nombres", type: "text", md: 6 },
  { name: "apellidos", label: "Apellidos", type: "text", md: 6 },
  { name: "dni", label: "DNI", type: "text", md: 3 },
  { name: "cuil", label: "CUIL", type: "text", md: 3 },
  {
    name: "fecha_nacimiento",
    label: "Fecha de nacimiento",
    type: "date",
    md: 3,
    InputLabelProps: { shrink: true },
  },
  { name: "telefono", label: "Telefono", type: "text", md: 3 },
  { name: "email", label: "Mail", type: "email", md: 6 },
  { name: "legajo", label: "Legajo", type: "text", md: 6 },
  { name: "direccion", label: "Domicilio", type: "text", md: 12 },
];

const TRAVELS_REQUIRED_DOCUMENTS = [
  {
    id: 3,
    nombre: "Listado de Estudiantes Viajantes",
    extension: ".xlsx",
  },
  {
    id: 4,
    nombre: "Nota de Viaje Plantilla",
    extension: ".docx",
  },
  {
    id: 5,
    nombre: "Nota de Viaje Cargada",
    extension: ".pdf",
  },
  {
    id: 6,
    nombre: "Informe Tecnico Viaje",
    extension: ".pdf",
  },
];

export const SPORTS_REQUIRED_DOCUMENTS = [
  {
    id_tipo_documento: null,
    nombre: "Certificado de Alumno Regular",
    descripcion:
      "Certificado vigente que acredita tu condición de estudiante regular.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_AlumnoRegular",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Fotocopia Documento",
    descripcion:
      "Copia legible del frente y dorso de tu DNI en un único archivo.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DNI",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Ficha Medica o E.M.M.A.C",
    descripcion:
      "Certificado médico vigente que indica que estás apto para realizar actividad física.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FichaMedica",
    id_archivo: null,
    extension: null,
    required: true,
  },
];

// Documentos comunes a cualquier solicitud de beca.
export const SCHOLARSHIPS_REQUERID_DOCUMENTS = [
  {
    id_tipo_documento: null,
    nombre: "Comprobante de CBU",
    descripcion: "Constancia bancaria donde figure tu CBU para pagos.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CBU",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Declaracion Jurada",
    descripcion: "Descarga, completa, firma y adjunta la declaracion jurada.",
    externalUrl:
      "https://docs.google.com/document/d/1wbuUbySrYoNTnyOcojTkkMGHOleb0Afq/edit?usp=drivesdk&ouid=116947469098280320832&rtpof=true&sd=true",
    externalUrlLabel: "Ejemplo",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DDJJ",
    id_archivo: null,
    extension: null,
    required: true,
  },
];

// Documentos especificos para la beca economica. Los opcionales se muestran
// solo cuando el usuario los agrega o cuando ya tienen un archivo cargado.
export const ECONOMIC_DOCUMENTS = [
  {
    nombre: "DNI Grupo Familiar",
    descripcion: "DNI de las personas que integran tu grupo familiar.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DNI_FAMILIAR",
    id_archivo: null,
  },
  {
    nombre: "Comprobante Ingresos Mensuales",
    descripcion:
      "Recibos de sueldo, monotributo, jubilacion u otros ingresos del hogar.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_INGRESOS_MENSUALES",
    id_archivo: null,
  },
  {
    nombre: "Factura Servicio",
    descripcion:
      "Factura reciente de luz, gas, agua, internet u otro servicio del domicilio.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FACTURAS_SERVICIOS",
    id_archivo: null,
  },
  {
    nombre: "Impuesto Inmobiliario",
    descripcion:
      "Comprobante del impuesto inmobiliario de la vivienda familiar.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_IMPUESTO_INMOBILIARIO",
    id_archivo: null,
  },
];

export const ECONOMIC_OPTIONAL_DOCUMENTS = [
  {
    nombre: "Constancia de Desocupado",
    descripcion:
      "Constancia emitida por ANSES si algun integrante no tiene empleo.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CONSTANCIA_DESOCUPADO",
    id_archivo: null,
  },
  {
    nombre: "Libreta Casamiento o Partida Hermanos",
    descripcion:
      "Documentacion que acredite hermanos menores a cargo del grupo familiar.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_HERMANOS_MENORES",
    id_archivo: null,
  },
  {
    nombre: "Libreta Casamiento y Partida Hijos",
    descripcion: "Documentacion que acredite conyuge o hijos a cargo.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FAMILIA_CASADO_HIJOS",
    id_archivo: null,
  },
  {
    nombre: "Contrato Alquiler y Pago",
    descripcion:
      "Contrato de alquiler y comprobante del ultimo pago realizado.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CONTRATO_ALQUILER",
    id_archivo: null,
  },
  {
    nombre: "Pago Credito Hipotecario",
    descripcion: "Comprobante del pago mensual del credito hipotecario.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CREDITO_HIPOTECARIO",
    id_archivo: null,
  },
];
export const TRAVEL_REQUIRED_DOCUMENTS = [
  {
    id_tipo_documento: 1,
    nombre: "Certificado de Alumno Regular",
    descripcion:
      "Certificado vigente que acredita tu condición de estudiante regular.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_AlumnoRegular",
    id_archivo: null,
    extension: ".pdf",
    required: true,
  },
  {
    id_tipo_documento: 2,
    nombre: "Fotocopia Documento",
    descripcion:
      "Copia legible del frente y dorso de tu DNI en un único archivo.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DNI",
    id_archivo: null,
    extension:".pdf",
    required: true,
  },
  {
    id_tipo_documento:13,
    nombre: "Declaracion Jurada",
    descripcion:
      "Certificadofirmado en el cual establece un heredero a tu fortuna.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{idViaje}_{legajo}_DDJJ",
    id_archivo: null,
    extension: ".pdf",
    required: true,
  },
];

export const PURCHASE_DOCUMENTS = [
  {
    key: "facturas",
    id_tipo_documento: null,
    nombre: "Facturas",
    descripcion: "Comprobantes de la compra.",
    formatoNombre: "{nombreCompra}_factura_{nro}",
    extension: ".pdf,.jpg,.jpeg,.png",
    multiple: true,
    required: true,
  },
  {
    key: "informe",
    id_tipo_documento: null,
    nombre: "Informe tecnico",
    descripcion: "Informe tecnico de la compra en PDF.",
    formatoNombre: "{nombreCompra}_InformeTecnico",
    extension: ".pdf",
    multiple: false,
    required: false,
  },
];

export const SAE_EMAIL = import.meta.env.VITE_SAE_EMAIL || "sae@frc.utn.edu.ar";

export const CONSULTATION_FAQS = [
  {
    id: "becas",
    category: "Becas",
    question: "¿Cómo solicito una beca?",
    answer:
      "Completá todos los datos de tu perfil, cargá la documentación requerida y elegí el tipo de beca desde Mis Becas.",
    link: "/Mis-Becas",
    linkLabel: "Ir a Mis Becas",
    image: "images/infoSection/becasFRC.jpg",
  },
  {
    id: "deportes",
    category: "Deportes",
    question: "¿Dónde consulto deportes e inscripciones?",
    answer:
      "En Mis Deportes podés consultar las disciplinas disponibles, horarios e inscripciones activas.",
    link: "/Mis-Deportes",
    linkLabel: "Ir a Mis Deportes",
    image: "images/infoSection/deportesFRC.webp",
  },
  {
    id: "salud",
    category: "Salud",
    question: "¿Cómo solicito un turno médico?",
    answer:
      "Ingresá a Mi Salud para consultar especialidades, profesionales, horarios y gestionar tus turnos.",
    link: "/Mi-Salud",
    linkLabel: "Ir a Mi Salud",
    image: "images/infoSection/saludFRC.jpg",
  },
  {
    id: "perfil",
    category: "Perfil",
    question: "¿Por qué debo completar mi perfil?",
    answer:
      "Los datos completos y actualizados son necesarios para solicitar becas y utilizar otros servicios de SAE.",
    link: "/Mi-Perfil",
    linkLabel: "Completar mi perfil",
    image: "images/infoSection/tramitesFRC.jpg",
  },
];

export const QUICK_CONSULTATION_FAQS = [
  {
    id: "documentacion-formatos",
    category: "Documentación",
    question: "¿Qué formatos de archivo puedo subir?",
    answer:
      "Cada documento indica los formatos permitidos antes de cargarlo. Generalmente se aceptan PDF, JPG, JPEG y PNG.",
  },
  {
    id: "documentacion-reemplazar",
    category: "Documentación",
    question: "¿Puedo reemplazar un documento cargado?",
    answer:
      "Sí. Mientras el trámite lo permita, eliminá el archivo actual y cargá la versión corregida.",
  },
  {
    id: "beca-estado",
    category: "Becas",
    question: "¿Dónde consulto el estado de mi beca?",
    answer:
      "Ingresá a Mis Becas. Allí vas a encontrar las solicitudes realizadas y el estado actualizado de cada una.",
  },
  {
    id: "beca-varias",
    category: "Becas",
    question: "¿Puedo solicitar más de un tipo de beca?",
    answer:
      "Podés consultar y solicitar las opciones habilitadas. La aprobación depende de los requisitos y criterios definidos por SAE.",
  },
  {
    id: "salud-cancelar",
    category: "Salud",
    question: "¿Qué hago si no puedo asistir a un turno?",
    answer:
      "Ingresá a Mi Salud y revisá las opciones disponibles para cancelar o gestionar el turno con anticipación.",
  },
  {
    id: "perfil-actualizar",
    category: "Perfil",
    question: "¿Cómo actualizo mis datos personales?",
    answer:
      "Ingresá a Mi Perfil, modificá los datos necesarios y presioná Guardar Cambios. Todos los campos deben quedar completos.",
  },
  {
    id: "respuesta-consulta",
    category: "Contacto",
    question: "¿Cuánto demora la respuesta a una consulta?",
    answer:
      "El tiempo puede variar según el tema y la cantidad de solicitudes. Incluí todos los datos necesarios para agilizar la respuesta.",
  },
  {
    id: "problema-acceso",
    category: "Acceso",
    question: "¿Qué hago si no puedo acceder a una sección?",
    answer:
      "Verificá que tu sesión siga activa y recargá la página. Si el problema continúa, enviá una consulta detallando la sección y el error.",
  },
];

export const INITIAL_PREVIEW = {
  open: false,
  loading: false,
  doc: null,
  title: "",
  error: "",
};
