import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import SchoolIcon from "@mui/icons-material/School";

export const FOOTER_STRINGS = {
  brand: "SAE Gestión — UTN Facultad Regional Córdoba",
  copyright: "© 2026 Cátedra de Proyecto Final",
};

export const FOOTER_LINKS = [
  {
    key: "instagram",
    icon: InstagramIcon,
    label: "@sae.utn.frc",
    href: "https://www.instagram.com/sae.utn.frc",
    external: true,
  },
  {
    key: "mail",
    icon: EmailIcon,
    label: "sae@frc.utn.edu.ar",
    href: "mailto:sae@frc.utn.edu.ar",
    external: false,
  },
  {
    key: "inscripcion",
    icon: SchoolIcon,
    label: "Inscripción UTN FRC",
    href: "https://www.frc.utn.edu.ar",
    external: true,
  },
];
export const MAIN_STRINGS ={
  mainDescription:"Acompañamiento estudiantil para que disfrutes al máximo tu experiencia universitaria.",
  meetUsButton:"Conocé nuestra Universidad",
  logButton:"Soy parte de la UTN"
}

export const NEWS_STRINGS = {
  title: "Novedades Estudiantiles",
  description: "Información actualizada sobre actividades, comúnicados y novedades académicas.",
  noData:"No hay noticias por ahora!",
  documentsSubtitle:"Documentos adjuntos",
  showDocumentButton: "Visualizar documento",
  downloadDocumentButton: "Descargar documento",
  showMore: "Ver más"
};

export const LOGIN_STRINGS = {
    errorCredential: "Credenciales no válidas",
    errorLastName:"Ingrese el apellido",
    errorName:"Ingrese el nombre",
    errorUpdate:"Error al actualizar el usuario",
    errorSaving:"Error al guardar",
    errorCredentials:"Debe ingresar su legajo y contraseña",
    errorID:"Debe ingresar su legajo",
    errorPassword:"Debe ingresar la contraseña",

    closeSession:"Cerrar Sesión",
    alreadySession:"Ya hay una sesión activa",
    loginTitle:"SAE GESTIÓN",
    loginSubtitle:"Inicia sesión para continuar",

    idPlaceholder:"Legajo",
    passPlaceHolder:"Contraseña",
    loginButton:"Ingresar",
    copyright:"© 2026 SAE Gestión - UTN FRC",
    loadingMessage:"Ingresando...",
    
    completeMsg:"Completá tus datos de usuario",
    completeDescription:"No poseemos tu nombre completo, por favor dejanos tu nombre como aparece en el sistema académico.",
    completeSaving:"Guardando...",
    completeSaveButton:"Confirmar"
}

export const JPA_STRINGS = {
    participateButton:"Quiero participar",
    universityChip:"Universidad Tecnológica Nacional - Córdoba",
    heroSubtitle:"Formate en una de las intituciones educativas más importantes de la Argentina y descubrí una experiencia universitaria que va mucho más allá del aula.",
    heroExplore:"Explorar Carreras",
    heroNextEvents:"Próximos Eventos",
    heroCard1:"Carreras",
    heroCard2:"Estudiantes",
    heroCard3:"Convenios",
    heroCard4:"Años",

    ourDegreesTitle:"Conocé nuestras carreras",
    ourDegressDescription:"Elegí el camino para transformar el mundo.",
    ourDegreesCaption:"Empezá tu aventura hoy →",

    journeyTitle:"Tu camino en la UTN",
    journeyDescription:"Descubrí todo lo que podés vivir durante tu formación.",

    eventsTitle:"Eventos en nuestra Universidad.",
    eventsDescription:"La Universidad no es solo para los que ya están sino para toda la comunidad, preparate para una experiencia única!",

    participateTitle:"Participá de JPA",
    participateDescription:"Sumate a la experiencia universitaria desde tu institución, empresa o como estudiante.",

    findUsTitle:"Encontranos en la UTN",
    findUsDescription:"Secretaría de Asuntos Estudiantiles · Facultad Regional Córdoba",
    whereFindUs:"Ubicación de la Secretaría de Asuntos Estudiantiles",
    findUsBus:"Líneas que te acercan",

    howToTitle:"¿Cómo querés participar?",
    howToDescription:"Elegí tu perfil y completá el formulario. Nos pondremos en contacto con vos.",

    participateName:"Nombre de la organización",
    participateEmail:"Ingrese el email",
    participatePhone:"Teléfono",
    participateQuant:"Cantidad",
    participateDate:"Fecha de visita",
    participateSend:"Enviar solicitud",

    emailSended:"Solicitud enviada",
    emailAclaration:"La SAE se pondrá en contacto al correo electrónico proporcionado.",
    close:"Cerrar"
}
