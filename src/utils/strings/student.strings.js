import AttachMoney from "@mui/icons-material/AttachMoney";
import Science from "@mui/icons-material/Science";
import SettingsAccessibility from "@mui/icons-material/SettingsAccessibility";

export const MAIN_STRINGS = {
  headerTitle: "Pantalla Principal",
  headerDescription: "Bienvenido ",
  panelTitle: "Tú Gestión",
  panelDescription: "Administra tu vida estudiantil desde un solo lugar",
};

export const SCHOLARSHIP_STRINGS = {
  bigTitle: "Becas",
  bigSubtitle: "Todas las becas en un solo lugar",
  title: "Administrar Becas",

  scholarshipTitle: "Mis Becas",
  scholarshipSubtitle:
    "Aquí podrás ver las becas a las que estás inscripto, el estado de cada una y la documentación requerida para cada una.",
  documentationSubtitle:
    "En esta sección podés consultar y cargar la documentación requerida para participar en deportes.",
  cardSolicitarTitle: "Solicitar Beca",
  cardSolicitarSubtitle: "Solicita una nueva beca",
  alquilarTitle: "Alquila?",
  DatosPersonales: "Datos Personales",
  TiposBecas: "Tipos de Becas",
  tipoBecaLabel: "Tipo Beca",
  proyectoInvestigacionLabel: "Proyecto Investigacion",
  areaLabel: "Area",
  descripcionSituacionLabel: "Describe tu situacion economica",
  requiredDocumentsTitle: "Documentos Requeridos",
  economicDocumentsTitle: "Documentos de Beca Economica",
  addOptionalEconomicDocumentLabel: "Agregar documento si corresponde",
  addButton: "Agregar",
  cancelButton: "Cancelar",
  saveButton: "Guardar",
  savingButton: "Guardando...",
  savingRequest: "Guardando solicitud...",
  validationSelectScholarshipType: "Selecciona un tipo de beca",
  validationSelectScholarshipOption: "Selecciona una opcion para la beca",
  validationAttachDocuments: (documents) => `Adjunta: ${documents}`,
  validationDescribeEconomicSituation: "Describi tu situacion economica",
  uploadAllowedExtensions: (extension) =>
    `Solo se permiten archivos: ${extension}`,
  uploadMaxSize: (maxSize) => `El archivo no puede superar los ${maxSize} MB.`,
  documentTypeNotFound: (documentName) =>
    `No se encontro el tipo de documento: ${documentName}`,
  uploadSuccess: "Archivo subido con exito",
  uploadError: "Error al subir el archivo",
  createEconomicScholarshipSuccess: "Se creo la beca economica correctamente",
  createInvestigationScholarshipSuccess:
    "Se creo la beca de investigacion correctamente",
  createServiceScholarshipSuccess: "Se creo la beca de servicio correctamente",
  invalidScholarshipType: "Tipo de beca invalido",
  createScholarshipError: "Hubo un error al crear la beca",
  listaTiposBecas: [
    { nombre: "Beca Economica", icon: "AttaachMoney" },
    { nombre: "Beca de Investigacion", icon: "Science" },
    { nombre: "Beca de Servicio", icon: "SettingsAccessibility" },
  ],

  listaProyectoInvestigacion: [
    "Proyecto de Investigación en Ciencias Sociales",
    "Proyecto de Investigación en Ciencias Naturales",
    "Proyecto de Investigación en Tecnología",
  ],
  listaProyectoServicio: [
    "Servicio Comunitario",
    "Servicio de Apoyo Académico",
  ],

  // Document State Label
  docStataUplodaded: "Subido",
  docStateNotUploaded: "No subido",
  docRequired: "Requerido",
  docOptional: "Opcional",
  docWithoutFile: "Sin archivo",
  docAllowedFormats: (extension) => `Formatos permitidos: ${extension}`,
  myDocumentsTitle: "Mis Documentos",
  economicScholarshipDocumentsTitle: "Documentos - Beca Economica",

  incompleteProfileTitle: "Advertencia",
  incompleteProfileMessage:
    "Para solicitar la beca debe completar los datos en la seccion de Perfil.",
  incompleteProfileButton: "Ir a Perfil",

  requestedDateLabel: "Fecha Solicitud:",
  assignedModulesLabel: "Modulos Asignados:",
  projectLabel: "Proyecto:",
  serviceLabel: "Servicio:",
  emptyValue: "-",

  cbuTitle: "CBU",
  cbuDescription: "Ingresa tu CBU para pagos.",
  cbuLabel: "CBU",
  cbuSaveButton: "Guardar CBU",
  cbuSavedSuccess: "CBU guardado con exito",
  cbuInvalid: "El CBU debe tener exactamente 22 digitos",

  utnLogoAlt: "UTN girando",
  loadScholarshipsError: "No se pudieron cargar tus becas",
  previewLoadError: "No se pudo cargar el documento",

  deleteDocTitle: "Eliminar Documento",
  deleteDocMessage: (nombreDoc) =>
    `¿Estás seguro de que deseas eliminar ${nombreDoc}?`,
  deleteDocButton: "Eliminar",
  docEliminado: "El documento ha sido eliminado con exito",
  docEliminadoError: "No se pudo eliminar el documento",
};

export const SPORTS_STRINGS = {
  bigTitle: "Deportes",
  bigSubtitle: "Todos lo relacionado a deportes en un solo Lugar",
  title: "Administrar Deportes",
  newButtonLabel: "Nuevo Deporte",

  documentationTitle: "Documentación",
  documentationSubtitle:
    "En esta sección podés consultar y cargar la documentación requerida para participar en deportes.",

  sportsTitle: "Deportes",
  sportsSubTitle: "Listado de deportes a los que te podes inscribir",

  tournamnetsTitle: "Torneos",
  tournamnetsSubTitle: "Listado de torneos disponibles",

  horariosTitle: "Horarios",
  horariosSubTitle: "Horarios de todos los deportes",

  // Error messages
  errorLoadSports: "Error al cargar los deportes",
  errorCreateSport: "Error al crear el deporte",
  errorUpdateSport: "Error al actualizar el deporte",
  errorDeleteSport: "Error al eliminar el deporte",
  erroLoadTournaments: "Error al cargar los torneos",
  errotLoadDocumentsType: "Error al cargar los tipos de documentos",

  errorLoadSportman: "Error al cargar el deportista",
  errorLoadSportmanHorario: "Error al cargar el horario del deportista",

  errorHandleSucscription: "Error al manejar la inscripción",

  // Document State Label
  docStataUplodaded: "Subido",
  docStateNotUploaded: "No subido",

  docEliminado: "Documento eliminado con éxito",
  docEliminadoError: "Error al eliminar el documento",

  //Succes messages
  successInsncription: "Inscripción realizada con éxito",
  successUnsuscription: "Desinscripción realizada con éxito",

  deleteDocTitle: "Eliminar Documento",
  deleteDocMessage: (nombreDoc) =>
    `¿Estás seguro de que deseas eliminar ${nombreDoc}?`,
  deleteDocButton: "Eliminar",
};
export const CONSULTATIONS_STRINGS = {
  headerTitle: "Consultas SAE",
  headerDescription:
    "Encontrá respuestas rápidas o escribinos para recibir ayuda personalizada.",
  linktreeTitle: "Links frecuentes",
  linktreeDescription: "Accesos rápidos a recursos útiles de SAE.",
  linktreeNoData: "No hay links frecuentes disponibles.",
  faqsTitle: "Preguntas frecuentes",
  faqsDescription: "Respuestas rápidas",
  moreFaqsTitle: "Más respuestas rápidas",
  moreFaqsDescription: "Revisá estas preguntas antes de enviar una consulta.",
  sendMailTitle: "Enviar una consulta",
  emailClaration: "Tu consulta se enviará por correo a ",
  formNameLabel: "Nombre",
  formMailLabel: "Correo",
  formSubjectLabel: "Asunto",
  formQuestionLabel: "Consulta",
  sendButton: "Enviar consulta",
  sendingButton: "Enviando...",
  //Provider
  errorURL: "Este link no tiene hipervínculo configurado",
  errorCount: "Error al contar visualización del link: ",
  errorValidateSubmit: "Es necesario que todos los campos sean válidos",
  errorSubmit: "No se pudo enviar la consulta. Intentá nuevamente.",
  msgSubmit: "Consulta enviada con éxito.",
};
export const HEALTH_STRINGS = {
  headerTitle: "Salud",
  headerDescription:
    "Permite sacar turnos médicos y ver los cursos disponibles",
  servicesTitle: "Servicios para Alumnos",
  noServicesTitle: "No hay servicios activos",
  servicesDescription:
    "Especialidades médicas disponibles para solicitar turnos",
  servicesCardSche: "Horarios de Atención:",
  servicesNoDay: "Día no asignado",
  servicesButton: "Pedir Turno",
  activeTurnsTitle: "Turnos Activos",
  activeTurnsDescription:
    "Podrás ver aquellos turnos que tengas activos en estos días.",
  activeTurnsReminder:
    "Recorda que los turnos pueden cambiar de horario sin previo aviso.",
  noActiveTurns: "No hay turnos activos",
  turnsCardPacient: "Paciente: ",
  turnsCardSuject: "Asunto: ",
  turnsCardMedic: "Atiende: ",
  noNameTurn: "Error recuperando el nombre",
  noSubject: "Turno sin Asunto",
  noMedic: "Sin Asignar",
  noDate: "Sin Asignar",
  noSchedule: "Sin Asignar",
  showTurn: "Ver datos turno",
  deleteTurn: "Eliminar Turno",
  courseTitle: "Cursos y Capacitaciones",
  courseDescription: "Descubrí que lo primero es la salud",
  noCourses: "No hay cursos actualmente activos",
  available: "Vacantes",
  courseTeacher: "Docente: ",
  courseStart: "Desde el: 📅",
  courseEnd: " hasta el: ",
  turnsHistoryTitle: "Histórico de Turnos",
  turnsHistoryDescription: "Turnos cancelados o finalizados",
  noRegisters: "Sin Registros",
  cancelTurnsTitle: "Turnos Cancelados",
  cancelTurnTitle: "Cancelar turno",
  cancelTurnSummary: "Turno a cancelar",
  confirmCancelTurn: "Confirmar cancelacion",
  realizedTurnsTitle: "Turnos Finalizados",
  requestTurnTitle: "Solicitar turno",
  turnCancellationDisclaimer:
    "La solicitud queda sujeta a confirmacion del area de salud. El turno puede ser cancelado o cambiado de horario segun disponibilidad del especialista.",
  dialogSubtitle: "¡ATENCIÓN!",
  creationAclaration:
    "Una vez generado el turno no podrá ser modificado.En caso de equivocación debera eliminarlo y despues volverlo a crear.",
  yourData: "Sus datos",
  youtID: "Tu legajo:",
  solicitudDate: "Fecha de Solicitud",
  availability: "Disponibilidad",
  selectedSpecialty: "Especialidad seleccionada",
  specialtySchedules: "Horarios de la especialidad",
  availabilityHint:
    "Agrega uno o mas dias y horarios en los que podrias asistir.",
  addAvailability: "Agregar disponibilidad",
  selectedAvailability: "Disponibilidad cargada",
  noAvailability: "Todavia no agregaste disponibilidad",
  availabilityRequired: "Agrega al menos una disponibilidad.",
  day: "Dia",
  subject: "Asunto:",
  estimateSchedule: "Hora Aproximada",
  seeMedicAvaila: "Revisar los horarios de inicio y fin del especialista",
  yourSympthoms: "Explique su dolencia",
  deleteAclaration:
    "Esta por cancelar el turno, toda la informacion que se haya utilizado en este turno se perdera como tambien la disponibilidad.",
  dialogIdTurn: "ID Turno",
  dialogStudentId: "Legajo Estudiante",
  dialogDate: "Fecha de Atención",
  dialogSchedule: "Horario de Atención",
  close: "Cerrar",
  delete: "Eliminar",
  create: "Crear",
};
export const PROFILE_STRINGS = {
  myProfileTitle: "Mi Perfil",
  myProfileSubtitle: "Información personal y de contacto",
  personalInfoTitle: "Información Personal",
  personalInfoID: "Legajo",

  personalInfoNames: "Nombres",
  nameRequired: "El nombre es obligatorio",

  personalInfoLastNames: "Apellidos",
  lastNameRequired: "El apellido es obligatorio",

  personalInfoDNI: "DNI",
  DNIRequired: "El DNI debe tener 8 dígitos",

  personalInfoCUIL: "CUIL",
  CUILRequired: "El CUIL debe tener 11 dígitos",

  personalInfoBirth: "Fecha de Nacimiento",
  birthDateRequired: "La fecha de nacimiento es obligatoria",

  contactInfoTitle: "Información de contacto",

  contactInfoEmail: "Correo Electrónico",
  emailRequired: "Ingresá un correo válido. Ejemplo: nombre@dominio.com",

  contactInfoPhone: "Teléfono",
  phoneRequired: "Completá el teléfono con el formato +54 351 123-4567",

  contactInfoProvince: "Provincia",
  provinceRequired: "La provincia es obligatoria",

  contactInfoCity: "Ciudad / Localidad",
  cityRequired: "La ciudad/localidad es obligatoria",

  contactInfoStreet: "Nombre de la calle",
  streetRequired: "La calle es obligatoria",

  contactInfoNumber: "Altura",
  numberRequired: "La altura es obligatoria",

  missingSubtitle: "¡ATENCIÓN!",
  missingOneField: "Falta completar el campo: ",
  missingMultipleFields: "Faltan completar los campos: ",

  myDocumentsTitle: "Mis documentos",
  myDocumentsSubtitle: "Archivos presentados en los distintos servicios",
  myDocumentsNoData: "Todavía no hay documentos subidos",

  saveChangesButton: "Guardar Cambios",

  //Provider:
  missingFieldMessage: "Completá todos los campos. Faltan: ",
  completeAdressMessage:
    "Completá provincia, ciudad/localidad, calle y altura.",

  savedProfile: "Sus datos fueron modificados correctamente!",
  errorProfile: "Ocurrio un error al modificar sus datos",
};
export const TRIPS_STRINGS = {
  headerTitle: "Viajes",
  headerDescription: "Experimenta aventuras con nuestra universidad",

  documentationTitle: "Documentación pendiente",
  documentationAclaration:
    "Para confirmar tu participación en el viaje, verificá que toda la documentación requerida haya sido presentada.",

  documentationButton: "Revisar documentación",
  travelCardMessage: "Conoce mas de este viaje →",

  myDocumentTitle: "Documentación",
  myDocumentSubtitle:
    "En esta sección podés consultar y cargar la documentación requerida para participar en viajes.",
  docStataUplodaded: "Subido",
  docStateNotUploaded: "No subido",
  deleteDocTitle: "Eliminar Documento",
    deleteDocMessage: (nombreDoc) =>
    `¿Estás seguro de que deseas eliminar ${nombreDoc}?`,
  deleteDocButton: "Eliminar",
  docEliminado: "Documento eliminado con éxito",
  docEliminadoError: "Error al eliminar el documento",

  faqsTitle: "Más respuestas rápidas",
  faqsDescription: "Revisá estas preguntas antes de enviar una consulta.",

  //Provider
  errorLoadingDocuments: "No se pudo cargar el documento",
  errorExtensionMsg: "Solo se permiten archivos: ",
  errorMaxMBMsg: "El archivo no puede superar los ",

  savedFile: "Archivo subido con éxito",
  errorFile: "Error al subir el archivo:",
};
