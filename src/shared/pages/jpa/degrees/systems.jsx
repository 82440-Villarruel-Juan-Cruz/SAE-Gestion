import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPASistemas() {
  const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-sistemas.jpg`;
  const materias1Año = [
    "Análisis Matemático I",
    "Algebra y Geometría Analítica",
    "Física I",
    "Ingeniería y Sociedad",
    "Algoritmos y estructura de datos",
    "Sistemas y organizaciones",
    "Matemática Discreta",
    "Arquitectura de computadoras",
    "Inglés I",
  ];
  const materias2Año = [
    "Análisis Matemático II",
    "Física II",
    "Análisis de Sistemas",
    "Paradigmas de Programación",
    "Sistemas Operativos",
    "Probabilidad y Estadística",
    "Sintaxis y Semántica de los lenguajes",
  ];
  const materias3Año = [
    "Diseño de Sistemas",
    "Comunicaciones",
    "Matemática Superior",
    "Gestión de datos",
    "Economía",
    "Inglés II",
    "Sistemas de Representación",
  ];
  const materias4Año = [
    "Redes de la información",
    "Administración de Recursos",
    "Investigación Operativa",
    "Simulación",
    "Ingeniería del Software",
    "Teoría de Control",
    "Legislación",
  ];
  const materias5Año = [
    "Proyecto Final",
    "Inteligencia Artificial",
    "Sistemas de Gestión",
    "Administración Gerencial",
  ];
  const materiasElectivas = [
    "Gestión de la Mejora de Procesos",
    "Gestión industrial de la producción",
    "Programación de aplicaciones visuales I",
    "Tecnologías educativas",
    "Tecnología de software base",
    "Diseño de lenguaje de consultas",
    "Análisis de datos: Aplicaciones con Minería de datos",
    "Auditorias de sistemas",
    "Big Data",
    "Creatividad e Innovación en Ingeniería",
    "Decisiones en escenarios complejos",
    "Desarrollo de software multi-pantalla",
    "Gerenciamiento estratégico",
    "Ingeniería de software de fuente abiertas/libres",
    "Testing de software",
    "Green software",
  ];
  const alcances = [
    "Participar en la toma de decisiones estratégicas de una organización u asesorar, en concordancia con las mismas, acerca de las políticas de desarrollo de Sistemas de Información.",
    "Evaluar, clasificar y seleccionar proyectos de Sistemas de Información y evaluar y seleccionar alternativas de asistencia externa.",
    "Planificar, efectuar y evaluar los estudios de factibilidad inherentes a todo proyecto de Diseño de Sistemas de información y de modificación o reemplazo de los mismos así como los Sistemas de computación asociados.",
    "Planificar, dirigir, ejecutar y controlar el relevamiento, análisis, diseño, desarrollo, implementación y prueba de sistemas de información.",
    "Evaluar y seleccionar los sistemas de programación disponibles con miras a sus utilizaciones en sistemas de información.",
    "Evaluar y seleccionar, desde el punto de vista de los sistemas de información, los equipos de procesamientos, comunicación y los sistemas de base de datos.",
    "Organizar y dirigir el área de sistemas: determinar el perfil de los recursos humanos necesarios y contribuir a su selección y formación.",
    "Participar en la elaboración de programas de capacitación para la utilización de sistemas de información.",
    "Determinar y controlar el cumplimiento de las pautas técnicas que rigen el funcionamiento y la utilización de recursos informáticos en cada organización.",
    "Elaborar métodos y normas a seguir en cuestiones de seguridad y privacidad de la información procesada y/o generada por los sistemas de la información; participar en la determinación de las acciones a seguir en estas materias y evaluar su aplicación.",
    "Elaborar métodos y normas a seguir en cuestión de salvaguardia y control, de los recursos, físicos y lógicos, de un sistema de computación; participar en la determinación de acciones a seguir en esta materia y evaluar su aplicación.",
    "Desarrollar modelos de simulación, sistemas expertos y otros sistemas informáticos destinados a la resolución de problemas y asesorar en su aplicación.",
    "Realizar auditorías en áreas de sistemas y centros de cómputos así como en los sistemas informáticos utilizados.",
  ];
  const perfil = [
    "El ingeniero en sistemas de la información es un profesional de sólida formación analítica que le permite la interpretación y resolución de problemas mediante el empleo de metodologías de sistemas y tecnologías de procesamiento de información.",
    "Por su preparación resulta especialmente apto para integrar la información proveniente de distintos campos disciplinarios concurrentes a un proyecto común.",
    "Posee conocimientos que le permiten administrar los recursos humanos, físicos y de aplicación que intervienen en el desarrollo de proyectos de sistemas de información.",
    "Adquiere capacidades que lo habilitan para el desempeño de funciones gerenciales acordes con su formación profesional.",
    "Está capacitado para abordar proyectos de investigación y desarrollo, integrando a tal efecto equipos interdisciplinarios en cooperación, o asumiendo el liderazgo efectivo en la coordinación técnica y metodológica de los mismos.",
  ];

  const curriculum = [
    { year: "Primer Año", subjects: materias1Año },
    { year: "Segundo Año", subjects: materias2Año },
    { year: "Tercer Año", subjects: materias3Año },
    { year: "Cuarto Año", subjects: materias4Año },
    { year: "Quinto Año", subjects: materias5Año },
    { year: "Electivas", subjects: materiasElectivas },
  ];
return (
    <DegreePageTemplate
      title="Ingeniería en Sistemas de Información"
      image={imageDirBanner}
      description="Ofrece una formación analítica que permite interpretar y resolver problemas mediante el empleo de metodologías de sistemas y tecnologías de procesamiento de información."
      degreeInfo={{ degree: "Título — Ingeniero en Sistemas de Información", duration: "Duración — 5 años", link: "https://www.institucional.frc.utn.edu.ar/sistemas/", intermedio: "Título intermedio — Analista Universitario de Sistemas (3.er año)" }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{ title: "Charla del Departamento de Ingeniería en Sistemas", src: "https://www.youtube.com/embed/_P-PybOgYys?si=wj81Dd-sUG9mbpMd" }}
    />
  );
}