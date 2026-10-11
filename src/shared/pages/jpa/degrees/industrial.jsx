import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPAIndustrial() {
   const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-industrial.jpg`;

  const materias1Año = [
    "Informática I",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Pensamiento sistémico",
    "Física I",
    "Sistemas de representación",
    "Química general",
  ];
  const materias2Año = [
    "Informática II",
    "Administración general",
    "Análisis matemático II",
    "Física II",
    "Probabilidad y estadística",
    "Ciencias de los materiales",
    "Economía general",
    "Inglés I",
  ];
  const materias3Año = [
    "Estudio del trabajo",
    "Comercialización",
    "Mecánica de los fluidos",
    "Termodinámica y Maquinarias térmicas",
    "Estática y resistencia de materiales",
    "Costo y presupuestos",
    "Economía de la empresa",
    "Electrotecnia y maquinas eléctricas",
    "Análisis numérico y cálculo avanzado",
  ];
  const materias4Año = [
    "Evaluación de proyectos",
    "Instalaciones industriales",
    "Seguridad, higiene e ingeniería ambiental",
    "Procesos industriales",
    "Planificación y control de la producción",
    "Diseño de producto",
    "Inglés II",
    "Investigación operativa",
    "Mecánica y mecanismos",
    "Legislación",
  ];
  const materias5Año = [
    "Proyecto final",
    "Relaciones industriales",
    "Control de gestión",
    "Mantenimiento",
    "Manejo de materiales y distribución planta",
    "Comercio exterior",
    "Ingeniería en calidad",
    "Práctica supervisada",
  ];
  const materiasElectivas = [
    "Políticas económicas",
    "Simulación",
    "Energías renovables",
    "Gestión del conocimiento, la innovación y economía crítica",
    "Coaching de formadores",
    "Industria 4.0",
    "Gestión emprendedora",
    "Gestión ambiental",
    "Logística",
  ];
  const alcances = [
    "Realizar estudios de factibilidad, proyectar, dirigir, implementar, operar y evaluar el proceso de producción de bienes industrializados y la administración de los recursos destinados a la producción de dichos bienes.",
    "Planificar y organizar plantas industriales y plantas de transformación de recursos naturales en bienes industrializados y servicios.",
    "Proyectar las instalaciones necesarias para el desarrollo de procesos productivos destinados a la producción de bienes industrializados y dirigir su ejecución y mantenimiento.",
    "Proyectar, implementar y evaluar el proceso destinado a la producción de bienes industrializados.",
    "Determinar las especificaciones técnicas y evaluar la factibilidad tecnológica de los dispositivos y equipos necesarios para el funcionamiento del proceso destinado a la producción de bienes industrializados.",
    "Programar y organizar el movimiento y almacenamiento de materiales para el desarrollo del proceso productivo y de los bienes industrializados resultantes.",
    "Participar en el diseño de productos en lo relativo a la determinación de la factibilidad de su elaboración industrial.",
    "Determinar las condiciones de instalación y de funcionamiento que aseguren que el conjunto de operaciones necesarias para la producción y distribución de bienes industrializados se realice en condiciones de higiene y seguridad: establecer las especificaciones de equipos, dispositivos y elementos de protección y controlar su utilización.",
    "Realizar la planificación, organización, conducción y control de gestión del conjunto de operaciones necesarias para la producción y distribución de bienes industriales.",
    "Determinar la calidad y cantidad de los recursos humanos para la implementación y funcionamiento del conjunto de operaciones necesarias para la producción de bienes industrializados: evaluar su desempeño y establecer los requerimientos de capacitación.",
    "Efectuar la programación de los requerimientos financieros para la producción de bienes industrializados.",
    "Asesorar en lo relativo al proceso de producción de bienes industrializados y la administración de recursos destinados a la producción de dichos bienes.",
    "Efectuar tasaciones y valuaciones de plantas industriales en lo relativo a: sus instalaciones y equipos, sus productos semielaborados y elaborados y las tecnologías de transformación utilizadas en la producción y distribución de bienes industrializados.",
    "Realizar arbitrajes y peritajes referidos a: la planificación y organización de las plantas industriales, sus instalaciones y equipos, y el proceso de producción, los procedimientos de operación y las condiciones de higiene y seguridad en el trabajo para la producción y distribución de bienes industrializados.",
  ];
  const perfil = [
    "La carrera Ingeniería Industrial responde a la necesidad de formar profesionales capaces de cumplir funciones tanto en el campo de la gestión organizativa como en la productiva.",
    "Es una carrera que capacita Ingenieros aptos para implementar, evaluar, organizar y conducir sistemas productivos, aplicando diversas técnicas, recursos humanos, materiales, equipos, maquinas e instalaciones, con el objeto de ordenar económica y productivamente las empresas que generan bienes y servicios destinados a satisfacer necesidades de la sociedad.",
    "Esta carrera está destinada a formar profesionales que estén capacitados para ser el 'nexo' entre los sectores productivos, económicos, administrativos y del mercado.",
    "El Ingeniero Industrial es aquel profesional que se debe comunicar adecuadamente con los economistas, ingenieros especialistas o administradores de empresas. Por otra parte, conducirá los requerimientos de reingeniería que el futuro de los desarrollos empresariales reclama.",
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
      title="Ingeniería Industrial"
      image={imageDirBanner}
      description="Esta carrera forma profesionales capaces de implementar, evaluar, organizar y conducir sistemas productivos, aplicando diversas técnicas y administrando recursos humanos, materiales, equipos, máquinas e instalaciones para satisfacer las necesidades de la sociedad."
      degreeInfo={{ degree: "Título — Ingeniero Industrial", duration: "Duración — 5 años", link: "https://www.institucional.frc.utn.edu.ar/industrial/", intermedio: "Título intermedio — Técnico Universitario (4.º año)", world: "Programa de doble titulación con la Universidade Tecnológica Federal do Paraná — UTFPR (Brasil)" }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{ title: "Charla del Departamento de Ingeniería Industrial", src: "https://www.youtube.com/embed/d5d30pwWJX0?si=oY73VFB49Q0WMSzs" }}
    />
  );
}