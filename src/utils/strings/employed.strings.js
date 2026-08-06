export const MAIN_STRINGS = {
  headerTitle: "PANEL SAE EMPLEADOS",
  headerSubtitle: "Bienvenido ",
  headerDescription:
    "Accedé rápidamente a las áreas de gestión, reportes y seguimiento diario desde una sola pantalla.",
  headerNoName: "Empleado",
  panelTitle: "Gestión General",
  panelDescription:
    "Módulos operativos principales para el trabajo diario del equipo.",

  eventsTitle: "Tus horarios y proximos eventos",
  eventsDescription: "Permite visualizar tus horarios y los eventos proximos",
};

export const CONSULTATIONS_STRINGS = {
  headerTitle: "Módulo de Consultas",
  headerSubtitle: "Gestión de Consultas",
  headerDescription:
    "Revisá el contenido visible para estudiantes y planificá su administración.",
  headerNoName: "Empleado",

  aclarationFAQS:
    "El contenido a continuacion debe controlarse mediante la solicitud al equipo de sistemas. Esto se debe a que no esta implementado un componente que permita modificarlo por la misma SAE.",
  faqsTitle: "Preguntas publicadas",
  link: "Enlace: ",
  quickFaqsTitle: "Respuestas rápidas publicadas",
  emailDescription:
    "Las consultas preparadas por estudiantes se dirigen actualmente a: ",

  errorName: "Nombre vacio o no valido",
  errorRequiredLink: "Ingresa un hipervinculo",
  errorLink: "Ingresa un hipervinculo valido con http:// o https://",
  errorSaving: "Revisa los campos marcados antes de guardar.",

  formID: "ID",
  formIcon: "Icono",
  formTitle: "Título",
  formLink: "Hipervínculo",

  cancel: "Cancelar",
  create: "Crear",
  save: "Guardar",

  //Provider
  errorNoLink: "No hay hipervinculo para copiar",
  copyLinkMsg: "Hipervinculo copiado",
  errorCopyLink: "No se pudo copiar el hipervinculo",
  errorNoUpdate: "La modificacion de links frecuentes no esta disponible.",

  creationMsg: "Link Frecuente creado!",
  updateMSg: "Link Frecuente modificado correctamente",
  deleteMsg: "Link Frecuente eliminado correctamente",
  errorMsg: "Ocurrió un error al guardar",
};

export const HEALTH_STRING = {
  headerMainTitle: "Módulo de Salud",
  headerMainSubtitle: "Gestión de las capacidades medicas de nuestra area",
  headerMainDescription:
    "Permite cargar especialidades, personal, cursos, horarios para el personal y gestionar los turnos de los estudiantes",

  healthTurnsTitle: "Gestión de Turnos",
  healthTurnsButton: "Ingresar al Turnero",

  ourScheduleTitle: "Horarios Empleados",
  ourScheduleDescription: "Nuestros Horarios",
  ourScheduleButton: "Gestionar Horarios",

  specialityCreate: "Nuevo Especialidad",
  specialityUpdate: "Editar Especialidad",
  formId: "ID",
  formCompleteName: "Nombre Completo",
  formDescription: "Descripción",
  formActiveSpecialist: "Especialidad Activa",
  formNoActiveSpecialist: "Especialidad NO activa",

  cancel: "Cancelar",
  create: "Crear",
  save: "Guardar",
  delete: "Eliminar",

  employCreate: "Nuevo Empleado",
  employEdit: "Editar Empleado",
  employFault: "Registrar Falta",
  employHistoryFault: "Faltas Previas",
  employCreateFault: "Registrar Nueva Falta",
  faultObservation: "Observacion de la Falta",
  faultDate: "Fecha de la Falta",

  employSubtitle: "¡ATENCIÓN!",
  employAclaration:
    "Al crear el personal medico se le solicitara el CUIL, el mismo NO podra ser modificado despues, es decir, que despues de la carga de esta persona solo el equipo de sistemas podra eliminar dicho registro.",
  employCUIL: "CUIL",
  employName: "Nombre",
  employLastName: "Apellido",
  employSpeciality: "Especialidad",
  employUpdateSubtitle: "¡IMPORTANTE!",
  employUpdateAclaration:
    "Si la especialidad no se encuentra activa aparecera como dato pero no sera seleccionable.",
  employActive: "Personal Activo",
  employNoActive: "Personal NO activo",

  courseCreate: "Nuevo Curso",
  courseEdit: "Editar Curso",
  courseId: "ID",
  courseCapacity: "Cupo Máximo",
  courseName: "Nombre del Curso",
  courseTeacher: "Nombre del Docente",
  courseStart: "Fecha de Inicio",
  courseEnd: "Fecha de Finalización",
  courseActive: "Curso Activo",
  courseNoActive: "Curso No Activo",
  validationSpecialityName: "Ingresá el nombre de la especialidad.",
  validationSpecialityDescription: "Ingresá la descripción de la especialidad.",
  validationFaultObservation: "Ingresá la observación de la falta.",
  validationFaultDate: "Ingresá la fecha de la falta.",
  validationCuilRequired: "Ingresá el CUIL.",
  validationCuilFormat: "Ingresá un CUIL válido de 11 dígitos.",
  validationEmployName: "Ingresá el nombre.",
  validationEmployLastName: "Ingresá el apellido.",
  validationEmploySpeciality: "Seleccioná una especialidad.",
  validationCourseCapacity: "Ingresá un cupo válido mayor a cero.",
  validationCourseName: "Ingresá el nombre del curso.",
  validationCourseTeacher: "Ingresá el nombre del docente.",
  validationCourseStart: "Ingresá la fecha de inicio.",
  validationCourseEnd: "Ingresá la fecha de finalización.",
  validationCourseEndAfterStart:
    "La fecha de finalización no puede ser anterior al inicio.",
  validationFormError: "Revisá los campos marcados antes de guardar.",

  scheduleFilter: "Filtrar por empleado",
  scheduleAll: "Todos los empleados",

  turnsCancel: "Turnos Cancelados",
  turnsFinish: "Turnos Finalizadas",
  turnsMissingID: "Ingrese un legajo para continuar",
  turnsMissingDegree: "Ingrese una carrera para continuar",

  turnsHeader: "Modulo de Salud",
  turnsTitle: "Turnero",
  turnsCreation: "Creacion de Turnos",
  turnsCreationButton: "Crear Turno",

  turnsCreate: "Nuevo Turno",
  turnsEdit: "Editar Turno",
  turnsUserId: "Legajo",
  turnsUser: "Usuario Seleccionado:",
  turnsUserSearchAgain: "Volver a buscar",
  turnsId: "ID Turno",
  turnsPacientName: "Paciente",
  turnsMedic: "Especialista",
  turnsAppointment: "Fecha de Atención",
  turnsHour: "Hora de atención",
  turnsSubject: "Asunto",
  turnsState: "Estado",

  turnsNoDate: "Fecha Solicitud",
  turnsNoState: "Sin Definir",
  turnsNoName: "Error recuperando el nombre",
  turnsNoSubject: "Turno sin Asunto",
  turnsNoMedic: "Sin médico asignado",
  turnsNoAppointment: "Sin Fecha Asignada",
  turnsNoHour: "Sin Horario Asignado",
};

export const JPA_STRINGS = {
  headerMainTitle: "Módulo de Salud",
  headerMainSubtitle: "Gestión de las capacidades medicas de nuestra area",
  headerMainDescription:
    "Permite cargar especialidades, personal, cursos, horarios para el personal y gestionar los turnos de los estudiantes",

  eventDeleteConfirm: "Esta seguro que quiere eliminar el evento:",
  eventID: "ID",
  eventName: "Nombre del Evento",
  eventManager: "Encargado",
  eventURL: "URL Maps",
  eventeDate: "Fecha del Evento",
  eventStartTime: "Hora inicio",
  eventEndTime: "Hora fin",

  standDeleteConfirm: "Esta seguro que quiere eliminar el stand:",
  standName: "Nombre del Stand",
  standExpo: "Expositor",
  standUbi: "Ubicación en la facultad",

  interestDeleteConfirm: "Esta seguro que quiere eliminar el interesado:",
  interestName: "Nombre del Interesado",
  interestPhone: "Contacto Telefonico",
  interestEmail: "Contacto Electronico",
  interestEmailHelp: "Ingrese un correo electrónico válido",

  cancel: "Cancelar",
  create: "Crear",
  save: "Guardar",
  delete: "Eliminar",
  //Provider
  eventDeleteMsg: "Se elimino el evento correctamente",
  eventCreateMsg: "Evento creado!",
  eventEditMsg: "Evento modificado correctamente",
  eventError: "Ocurrió un error al guardar",

  standCreateMsg: "Puesto creado!",
  standEditMsg: "Puesto modificado correctamente",
  standDeleteMsg: "Se elimino el puesto correctamente",

  interestCreateMsg: "Interesado creado!",
  interestEditMsg: "Interesado modificado correctamente",
  interestDeleteMsg: "Se elimino el interesado correctamente",
};

export const USER_STRINGS = {
  headerTitle: "Módulo de Empleados",
  headerMainSubtitle: "Gestión de Empleados y sus Horarios",
  headerMainDescription:
    "Permite cargar empleados, modificar sus permisos y sus horarios",

  scheduleTitle: "Horarios Empleados",
  scheduleSubtitle: "Nuestros Horarios",
  scheduleButton: "Gestionar Horarios",

  employCreate: "Nuevo Empleado",
  employUpdate: "Editar Empleado",
  employID: "ID",
  employCompleteName: "Nombre Completo",

  employWarningTitle:"¡ATENCIÓN!",
  employWarningBody1:"Al crear un nuevo empleado debe escribirse sin errores su legajo, ya que esta sera la unica forma que pueda acceder a la aplicacion.",
  employWarningEnd:"Desde esta pestaña solo se podran crear perfiles de empleados, comedor, salud y administrador.",

  userWarningBody2:"Al crear el usuario desde esta pestaña se crea como estudiante sin que se tenga la posibilidad de cambiar ese rol.",

  employNames: "Nombres",
  employLastName: "Apellidos",
  employUserName: "Nombre de Usuario",

  studentID: "Legajo",
  employProfile:"Perfíl",
  employActive:"Usuario Activo",
  employNoActive:"Usuario NO Activo",

  cancel:"Cancelar",
  create:"Crear",
  save:"Guardar",
  delete:"Eliminar",
  clean:"Volver a Buscar",
  close:"Cerrar",

  userCreate: "Nuevo Usuario",
  userUpdate: "Editar Usuario",
  userDegree: "Carrera",

  userTitle:"Estudiantes",
  userDescription:"Permite la busqueda de estudiante registrados",
  userName:"Nombre de Usuario",
  userSearch:"Buscar Usuarios",
  dominio:"frc.utn.edu.ar",

  //Horarios
  scheduleCreate: "Nuevo horario",
  scheduleEdit: "Editar horario",
  scheduleDelete:"Eliminar horario",

  day:"Día",
  startTime:"Hora inicio",
  endTime:"Hora fin",
  selectDay:"Selecciona un día...",
  scheduleDeleteButton:"Eliminar Horario",
  scheduleDeleteWarning:"¿Estás seguro que querés eliminar este horario? Esta acción no se puede deshacer.",
  scheduleEditing:"Editando horario",
  scheduleManagmentTitle:"Gestionar horarios de los empleados",
  scheduleSelectEmploy:"Seleccionar empleado...",
  scheduleFilterMsg:"Escribí para filtrar...",
  scheduleSelectMsg:"Seleccioná un empleado para ver sus horarios",
  scheduleMsg:"Horarios registrados —",
  scheduleNoData:"No hay horarios registrados para este empleado.",
  //Provider
  validationID:"No posee ID, error",
  validationStudentID: "Ingrese un legajo",
  validationNames: "Este campo no puede estar vacio",
  validationActive:"Ocurrio un error en el formulario",
  validationProfile:"Debe seleccionar un perfil",
  validationDegree:"Debe seleccionar una carrera",

  validationOpeningTime: "Ingresá el horario de atención",
  validationClosingTime: "Ingresá el horario de cierre",
  validationClosingTimeAfterOpening: "El horario final no puede ser anterior al inicial",
  validationDay:"Seleccione un día valido",
  validationEmploy:"Seleccione un empleado valido",

  userCreatedMsg:"Usuario creado!",
  userUpdatedMsg:"Se actualizaron los datos del usuario!",
  userErrorMsg:"Ocurrio un error al guardar",
  userErrorUpdateMsg:"Ocurrio un error al actualizar el usuario...",
  scheduleGetError:"Ocurrio un error recuperando los horarios",
  
}

export const TRAVEL_STRINGS = {
  headerTitle: "Módulo de Viajes",
  headerMainSubtitle: "Gestión de los viajes",
  headerMainDescription:
    "En este módulo podrás gestionar los viajes de la empresa, incluyendo la creación, edición de las empresa como la gestión de los inscriptos y la documentación relacionada.",

  errorPhone: "El contacto solo puede contener numeros.",
  errorEmail: "Ingresá un email válido.",
  errorCUIT: "Ingresá un CUIT válido de 11 dígitos.",
  errorCBU: "El CBU debe tener 22 dígitos.",
  errorForm: "Revisá los campos marcados antes de guardar.",

  travelID: "ID",
  businessName: "Nombre de la Empresa",
  businessPhone: "Telefono",
  businessEmail: "Email",
  businessCUIT: "CUIT",
  businessCBU: "CBU",
  businessActive:"Empresa Activa",
  businessNoActive:"Empresa No Activa",

  cancel:"Cancelar",
  create:"Crear",
  save:"Guardar",
  delete:"Eliminar",
  search:"Buscar",

  travelCreate:"Nuevo Viaje",
  travelUpdate:"Editar Viaje",
  travelName:"Nombre del Viaje",
  travelCapacity:"Cupo",
  travelStartDate:"Fecha de Inicio",
  travelEndDate:"Fecha Vuelta",
  travelProvince:"Pais / Provincia",
  travelCity:"Ciudad / Localidad",
  travelPlace: "Complejo / Ubicacion",

  travelOrigin: "Origen",
  travelDestiny: "Destino",

  travelData: "Datos del Viaje",
  travelBusiness: "Empresa",
  travelBudget: "Presupuesto",
  travelInsurence: "Tiene Seguro",
  travelNoInsurence: "NO tiene seguro",
  travelMotive: "Motivo",

  travelDocs: "Documentación —",
  travelRequiredDocs: "Documento a Cargar",
  travelChangeDocs: "Cambiar archivo",
  travelAddDocs: "Agregar Archivo",
  travelNoDocs: "No hay documentación disponible de este viaje.",
  travelShowDocs: "Ver Documentos",
  travelDownloadDocs: "Descargar",
  travelDeleteDocs: "Eliminar Documento",
  travelClose: "Cerrar",
  travelWarningMsg: "Esta seguro que quiere eliminar el documento: ",

  travelLoadDocs: "✅Cargado:",
  travelDrop: "Arrastra tu archivo aquí 📄",
  travelSearch: "Buscar Archivo",

  inscriptsManagement: "Gestión de Inscriptos",
  inscriptsList: "Planilla de Inscriptos",
  inscriptsNoData: "Sin Inscriptos",

  errorNoID: "Ingresa un legajo para buscar.",
  errorNoDegree: "Selecciona una carrera para buscar.",

  inscriptsSearch: "Buscar estudiante para agregar",
  studentID: "Legajo",
  studentDegree: "Carrera",
  studentSearch: "Buscar estudiante",
  studentSelected: "Usuario Seleccionado",
  studentAdd: "Agregar estudiante",
  studentSearchAgain: "Volver a buscar",
  studentDocs: "Documentacion del Inscripto",
  studentsDelete: "Eliminar Inscripcion",
  inscriptsWarningTitle: "¡ATENCIÓN!",
  inscriptsWarningBody:
    "Esta a punto de eliminar este inscripto de la lista del viaje. Si esta persona subio documentacion relacionada, se mantendra a menos que se elimine de manera particular.",
  inscriptsWarningConfirm: "¿Quiere continuar?",

  helperID: "Sin @ ni dominio.",
  helperDegree: "Selecciona el dominio de la carrera.",

  inscriptsReviewed: "Documentacion Revisada",
  inscriptsNoReviewed: "Documentacion No Validada",

  historyTravelTitle:"Historial de Viajes",
  filterDateFrom: "Fecha Desde",
  filterDateTo: "Fecha Hasta",

  // Provider
  errorNoInscFound: "Inscriptos no encontrados",
  errorSavingBuss: "Ocurrió un error al guardar la empresa",

  businessCreated: "Empresa creada!",
  businessEdited: "Empresa Modificada!",

  errorSavingDocs: "Error al cargar documentación",
  errorSavingTravel: "Ocurrió un error al guardar",

  travelCreated: "Viaje creado!",
  travelEdited: "Viaje modificado!",

  errorUserNF: "Usuario no Encontrado",

  inscriptsCreated: "Se inscribio esta persona al viaje",
  inscriptsDeleted: "Se elimino el estudiante del viaje",

  errorInscDelete: "Ocurrio un error al intentar eliminar este inscripto",

  inscriptsUpdated: "Actualizado!",

  errorInscriptsDoc: "Ocurrio un error al tratar de descargar el documento",

  inscriptsDocsDeleted: "Documento Eliminado",
  errorInscDocDelete: "Error al eliminar el documento",

  onlyExtensions:"Solo se permiten archivos:",
  
  inscriptsDocsUpload:"subido con exito",
  errorInscUpload:"Error subiendo el archivo",

  validationID: "ID no encontrado",
  validationName: "Ingresa un nombre para esta empresa",
  validationPhone: "El telefono debe contener 12 digitos Ej:(54 355 222 4924)",
  validationActive: "Error al leer este campo",
  validationEmail: "Escriba un correo electronico válido",
  validationCuil: "Ingresa un CUIL/CUIT válido",
  validationCBU: "Ingrese un CBU válido",

  validationDate:"Ingresa una fecha válida",
  validationPlace:"Todos los campos son obligatorios",
  validationQuant:"Cantidad no válida",
  validationBuss:"Seleccione una empresa",
  validationCost:"Ingrese un costo valido",
  validationMotive:"Ingrese un motivo u objetivo del viaje"
}

export const SPORTS_STRINGS = {
  headerTitle: "Módulo de Deportes",
  headerMainSubtitle: "Gestion de Deportes",
  headerMainDescription:
    "Administra torneos, profesores, espacios y deportistas desde un solo lugar.",

  scheduleTitle: "Horarios deportivos",
  scheduleSubtitle: "Calendario de actividades y horarios de cada deporte.",
  scheduleManageButton: "Gestionar Horarios",

  scheduleStartTime: "Hora de Inicio",
  scheduleEndTime: "Hora de Fin",
  scheduleValidationDay: "Seleccioná un día",
  scheduleValidationStartTime: "Ingresá la hora de inicio",
  scheduleValidationEndTime: "Ingresá la hora de fin",
  scheduleValidationEndTimeAfterStart:
    "La hora de fin debe ser posterior a la de inicio",
  scheduleValidationPlace: "Seleccioná un espacio deportivo",
  scheduleValidationTeacher: "Seleccioná un docente",
  scheduleValidationConflictDay: "Revisá el día",
  scheduleValidationConflictTime: "Ya existe un horario con esos datos",
  scheduleValidationConflictAssignment:
    "El espacio o docente ya tiene un horario superpuesto",

  active: "Activo",
  inactive: "Desactivado",
  noAssigned: "Sin Asignar",
  schedulePlace: "Espacio Deportivo",
  scheduleTeacher: "Docente Encargado",

  scheduleDelete: "Eliminar Horario",
  scheduleDeleteWarning:
    "¿Estás seguro que querés eliminar este horario? Esta acción no se puede deshacer.",

  cancel: "Cancelar",
  delete: "Eliminar",
  create: "Crear",
  close: "Cerrar",
  save: "Guardar",

  noResults: "Sin resultados",
  saveChanges: "Guardar Cambios",
  scheduleEditing: "Editando Horario",
  scheduleCreating: "Crear Horario",

  errorScheduleLoad: "Error Cargando Horario",

  scheduleManager: "Gestionar Horarios Deportivos",
  scheduleSportSelection: "Seleccionar deporte",
  scheduleSportPH: "Escribí para filtrar...",
  scheduleSportsSelect:
    "Seleccioná un deporte para ver y gestionar sus horarios.",
  scheduleAlreadyOn: "Horarios Registrados —",
  noSchedule: "Sin horarios para este deporte",

  //Calendar
  scheduleFilter: "Filtrar por Deporte",
  scheduleAll: "Todos los Deportes",
  scheduleStudent: "Mis horarios",

  documentation: "Documentación - ",
  errorNoDocs: "No hay documentación disponible para este alumno.",

  download: "Descargar",
  cuil: "CUIL",
  name: "Nombre",
  names: "Nombres",
  lastNames: "Apellidos",
  birthDay: "Fecha de Nacimiento",

  sportPlaceName: "Nombre del Lugar",
  sportPlaceAddress: "Domicilio",
  sportsMaps: "URL de Maps",

  studentID: "Legajo",
  studentExpireLicence: "Vencimiento Ficha",
  studentExpireLicenceShort: "Venc. Ficha",
  studentAuthorized: "Autorizado",
  studentSportAuth: "Autorizado para Deporte",

  errorSaveTournament: "Error al guardar el torneo.",

  tournamentEdit: "Editar Torneo",
  tournamentCreate: "Nuevo Torneo",
  tournamentName: "Nombre del Torneo",
  tournamentCapacity: "Cupo de Jugadores",

  sport: "Deporte",
  tournamentTeacher: "Docente Responsable",
  tournamentStartDate: "Fecha de Inicio",
  tournamentEndDate: "Fecha de Fin",
  tournamentDateLimit: "Límite Inscripción",
  tournamenteCreate: "Crear Torneo",
  errorTournamentLoad: "Error cargando los torneos",
  inscriptsCorrect: "inscripto correctamente.",
  multipleInscriptsCorrect: "deportistas inscriptos correctamente",

  errorInscriptsSaving: "Error al inscribir deportista.",

  inscriptsDelete: " eliminado de la inscripción",
  multipleInscriptsDelete: "deportistas eliminados de la inscripción",
  errorInscriptsDelete: "Error al eliminar la inscripción.",
  noSportsman: "No hay deportistas disponibles",
  noSportsmanInscript: "Ningún deportista inscripto",

  deleteInscription: "Eliminar inscripción",
  deleteSelection: "Eliminar Selección",
  goBack: "Volver",
  inscriptTournament: "Torneo Deportivo",
  inscriptStudent: "Inscribir Estudiante",
  inscriptSearchMsg: "Buscar deportista por legajo o nombre",
  inscriptManager: "Gestionar Inscripciones",
  availables: "Disponibles",
  searchPH: "Buscar...",
  cleanSelection: "Limpiar Selección",
  selectAll: "Seleccionar Todos",
  dragMsg: "o arrastrá",
  dropMsg: "Soltar para inscribir",
  inscriptsTitle: "Inscriptos",
  inscriptsAlready: "Deportistas Inscriptos",
  generatePDF: "Generar PDF",
  inscriptsNotify: "Notificar Inscriptos",
  tournamentNoInscripts:
    "No hay deportistas inscriptos en este torneo todavía.",
  tournamentUpdated: "Torneo guardado correctamente",
  //providers

  teacherCreated: "Docente creado correctamente",
  teacherUpdated: "Docente modificado!",
  placeCreated: "Espacio creado correctamente",
  placeUpdated: "Espacio modificado",
  sportsmanCreated: "Deportista creado",
  sportsmanUpdated: "Deportista modificado",
  sportsCreated: "Deporte creado",
  sportsUpdated: "Deporte modificado",
  errorSave: "Ocurrió un error al guardar",
};
export const COMPRAS_STRINGS = {
  headerTitle: "Módulo de Compras",
  headerSubtitle: "Gestion de las Compras",
  headerDescription:
    "En este módulo se registran todas las compras que hace la secretaria.",

  sectionTitle: "Compras",
  addButton: "Registrar Compra",

  filterDateFrom: "Fecha Desde",
  filterDateTo: "Fecha Hasta",

  deleteEntityLabel: "Compra",

  dialogDocumentsTitle: "Documentos de la compra",
  dialogCreateTitle: "Registrar Compra",

  sectionPurchaseData: "Datos de la compra",
  sectionTechnicalReport: "Informe técnico",
  sectionDocumentation: "Documentación",

  fieldEmployee: "Empleado que hizo la compra",
  fieldPurchaseName: "Nombre de la compra",
  fieldSuggestedPrice: "Precio sugerido",
  fieldReason: "Motivo",
  fieldPurchaseDate: "Fecha compra",
  fieldFileNumber: "Nro expediente",
  fieldRealPrice: "Precio real",
  fieldRequesterName: "Nombre solicitante",
  fieldWinnerName: "Nombre ganador",
  fieldTenderDate: "Fecha licitacion",
  fieldReportDate: "Fecha informe",

  currencyPlaceholder: "99.999,99",

  documentationInfo:
    "Completá primero los datos de la compra para adjuntar documentación. El informe técnico puede quedar vacío.",
  notUploadedLabel: "No adjunto",
  uploadedLabel: "Adjunto",
  documentValidation: {
    incompletePurchaseData:
      "Completá los datos de la compra antes de adjuntar documentación.",
    invalidType: (extensions) => `Solo se permiten archivos: ${extensions}`,
    maxSize: (maxSizeMb) => `El archivo no puede superar los ${maxSizeMb} MB.`,
    deleteInvoiceError: "No se pudo eliminar la factura",
  },

  cancel: "Cancelar",
  save: "Guardar",

  deleteSuccess: "Compra eliminada!",
  deleteError: "No se pudo eliminar la compra",
  deleteMissingId: "No se pudo identificar la compra a eliminar.",
  deleteDocumentError: "No se pudo eliminar el documento",
  saveSuccessCreate: "Compra creada!",
  saveSuccessDocs: "Documentos actualizados!",
  saveSuccessUpdate: "Cambios guardados!",
  saveError: "Ocurrió un error al guardar",
  saveMissingPurchaseId: "No se pudo obtener el id de la compra.",
  saveMissingInvoiceType: "No se encontró el tipo de documento Facturas.",
  saveMissingReportType: "No se encontró el tipo de documento Informe tecnico.",
  saveRequiredPurchaseData:
    "Completá empleado, nombre de la compra, precio sugerido, motivo y fecha de compra.",
  saveRequiredInvoice: "Adjuntá al menos una factura para crear la compra.",
  saveRequiredReport:
    "Completá todos los campos del informe: nro expediente, precio real, fecha licitación, fecha informe, solicitante y ganador.",
  validationEmployeeRequired: "Seleccioná el empleado que hizo la compra.",
  validationPurchaseNameRequired: "Ingresá el nombre de la compra.",
  validationSuggestedPrice: "Ingresá un precio sugerido válido.",
  validationReasonRequired: "Ingresá el motivo de la compra.",
  validationPurchaseDateRequired: "Ingresá la fecha de compra.",
  validationFileNumberRequired: "Ingresá el nro expediente.",
  validationRealPrice: "Ingresá un precio real válido.",
  validationRequesterRequired: "Ingresá el nombre del solicitante.",
  validationWinnerRequired: "Ingresá el nombre del ganador.",
  validationTenderDateRequired: "Ingresá la fecha de licitación.",
  validationReportDateRequired: "Ingresá la fecha del informe.",
  loadDocumentTypesError: "No se pudieron cargar los tipos de documento.",
  attachedInvoices: (count) => `${count} facturas adjuntas`,
  actionViewDocuments: "Ver documentos",
  actionDeletePurchase: "Eliminar compra",

  incompleteReportTitle: "Informe técnico incompleto",
  incompleteReportMessage:
    "Estás por crear una compra sin informe técnico. ¿Querés continuar?",
  back: "Volver",
  createWithoutReport: "Crear sin informe",
};

export const PRENSA_STRINGS = {
  headerTitle: "Módulo de Prensa",
  headerSubtitle: "Gestión de Publicaciones",
  headerDescription:
    "Permite gestionar las publicaciones en el módulo de prensa",
  headerNoName: "Empleado",

  errorLoadPublicaciones: "Error al cargar las publicaciones",
  errorLoadDocumentos: "Error al cargar los documentos de la publicación",

  priorityNormal: "Normal",
  priorityMedium: "Media",
  priorityHigh: "Alta",

  documentTypeLabels: {
    image: "Imagen",
    document: "Documento",
  },

  documentPreview: {
    fallbackTitle: "Vista previa",
    fallbackName: "archivo",
    noId: "No se encontro el id del documento para previsualizar.",
    notSupported: "Solo se permite vista previa para imagenes o PDF.",
    loadError: "No se pudo cargar la imagen.",
  },
  snackCreated: "Publicación creada correctamente.",
  snackSaved: "Publicación modificada correctamente.",
  snackDeleted: "Publicación eliminada correctamente.",

  snackErrorDelete: "No se pudo eliminar la publicación.",
  snackWarnDocLink:
    "La publicación se guardó, pero no se pudo vincular el documento.",
  snackWarnDocUpload:
    "La publicación se guardó, pero no se pudo subir el documento.",
  snackErrorSave: "No se pudo modificar la publicación.",
  snackErrorCreate: "No se pudo crear la publicación.",

  nueva: {
    title: "Nueva publicación",
    editTitle: "Editar publicación",
    sectionDatos: "Datos de la publicación",
    fieldTitle: "Título",
    fieldDescription: "Descripción",
    sectionVigencia: "Vigencia",
    fieldStartDate: "Fecha de inicio",
    fieldEndDate: "Fecha de vigencia",
    fieldNoDarBaja: "No dar de baja automáticamente",
    sectionPrioridad: "Prioridad",
    sectionDocumentos: "Documentación",
    tabUpload: "Subir documento",
    tabExisting: "Documento existente",
    attachButton: "Seleccionar archivo",
    searchDocPlaceholder: "Buscar documento...",
    tableColName: "Nombre",
    tableColType: "Tipo",
    tableColView: "Vista previa",
    noDocuments: "No hay documentos disponibles.",
    docCount: (count) => `${count} documento${count === 1 ? "" : "s"}`,
    saving: "Guardando...",
    saveButton: "Guardar",
    validationTitleRequired: "Ingresá el título.",
    validationDescriptionRequired: "Ingresá la descripción.",
    validationStartDateRequired: "Ingresá la fecha de inicio.",
    validationEndDateRequired: "Ingresá la fecha de vigencia.",
    validationEndDateAfterStart:
      "La fecha de vigencia no puede ser anterior al inicio.",
    validationDocumentRequired: "Adjuntá o seleccioná un documento.",
    validationFormError: "Revisá los campos marcados antes de guardar.",
  },
};

export const BECAS_STRINGS = {
  headerTitle: "Módulo de Becas",
  headerSubtitle: "Gestion de Becas",
  headerDescription:
    "EAdministra becas, proyectos de investigacion y servicios desde un solo lugar.",

  scholarshipTypeEconomica: "Beca económica",
  scholarshipTypeServicio: "Servicio interno",
  scholarshipTypeInvestigacion: "Investigación",

  loadResearchProjectsError: "Error al cargar proyectos de investigación:",
  loadInternalServicesError: "Error al cargar servicios internos:",
  loadScholarshipHoldersError: "Error al cargar becarios completos:",

  saveDefaultSuccess: "La accion se realizo exitosamente",
  saveGenericSuccess: "Se guardó con éxito",
  saveResearchProjectCreated: "Proyecto de investigación creado exitosamente",
  saveResearchProjectUpdated: "Proyecto de investigación editado exitosamente",
  saveInternalServiceCreated: "Servicio interno creado exitosamente",
  saveInternalServiceUpdated: "Servicio interno editado exitosamente",
  saveScholarshipHolderCreated: "Becario creado exitosamente",
  saveScholarshipHolderUpdated: "Becario editado exitosamente",
  saveNoChanges: "No se detectaron cambios para guardar",
  saveMissingCardLogic: "No hay logica de guardado definida para esta card:",
  saveError: "Ocurrio un error al guardar",
  missingScholarshipId: (name) => `No se encontro el id de la beca ${name}`,

  becarioDialog: {
    entityTitle: "Becarios",
    loadScholarshipsError: "No se pudieron recuperar las becas del alumno",

    validationYear: "Ingresá un año válido",
    validationYearRequired: "Ingresá el año de la beca",
    validationRequestDateRequired: "Ingresá la fecha de solicitud",
    validationFutureDate: "La fecha no puede ser mayor a hoy",
    validationScholarshipType: "Seleccioná un tipo de beca",
    validationDuplicateScholarship: "El becario ya tiene ese tipo de beca",
    validationModules: "Los módulos deben ser un número de 0 a 3",
    validationResearchProject: "Seleccioná un proyecto de investigación",
    validationInternalService: "Seleccioná un servicio",

    fieldId: "ID",
    fieldPreviousScholarshipHolderId: "ID Becario Previo",
    fieldStudentId: "Legajo",
    fieldScholarshipHolderName: "Nombre Becario",
    fieldRent: "Alquila",
    fieldActive: "Activo",
    fieldAcceptedStart: "Aceptado Inicio",
    fieldCanPay: "Puede Pagarle",
    fieldScholarshipYear: "Año Beca",
    fieldRequestDate: "Fecha Solicitud",
    fieldProjectName: "Nombre del proyecto",
    fieldServiceName: "Nombre del servicio",
    fieldModules: "Módulos",
    fieldAssignedModules: "Módulos asignados",
    fieldScholarshipType: "Tipo de beca",

    clear: "Limpiar",
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando",
    scholarshipData: "Datos de becas",
    searchingScholarships: "Buscando becas...",
    noScholarships: "No tiene becas registradas.",
    addScholarship: "Agregar nueva beca",
    requiredDocumentation: "Documentación requerida",
    loadingDocumentation: "Controlando documentación...",
    commonDocumentation: "Documentación general",
    economicDocumentation: "Documentación económica",
    uploadedDocument: "Subido",
    missingDocument: "Falta",
    viewDocument: "Ver documento",
    documentationLoadError: "No se pudo controlar la documentación del alumno",
    previewLoadError: "No se pudo cargar el documento",
  },

  serviceDialog: {
    entityTitle: "Servicio",
    fieldId: "ID",
    fieldName: "Nombre",
    fieldPhone: "Nro Teléfono",
    fieldInternalPhone: "Nro Teléfono Interno",
    fieldInstitutionalEmail: "Email Institucional",
    fieldOpeningTime: "Horario Atención",
    fieldClosingTime: "Horario Atención Final",

    validationName: "Ingresá el nombre del servicio",
    validationPhoneRequired: "Ingresá el teléfono",
    validationPhoneFormat: "Ingresá un teléfono válido de 12 dígitos",
    validationInternalPhone: "Ingresá un interno válido",
    validationEmailRequired: "Ingresá el email institucional",
    validationEmailFormat:
      "Ingresá un email válido. Ejemplo: servicio@frc.utn.edu.ar",
    validationOpeningTime: "Ingresá el horario de atención",
    validationClosingTime: "Ingresá el horario de cierre",
    validationClosingTimeAfterOpening:
      "El horario final no puede ser anterior al inicial",

    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando",
  },

  projectDialog: {
    entityTitle: "Proyecto",
    sectionTitle: "Proyectos",
    addButton: "Nuevo proyecto",
    editAction: "Editar Proyecto",
    fieldId: "ID",
    fieldActive: "Activo",
    fieldName: "Nombre Proyecto Investigación",
    fieldResearchCenter: "Centro de Investigación",

    validationName: "Ingresá el nombre del proyecto",
    validationResearchCenter: "Ingresá el centro de investigación",

    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando",
  },
};
