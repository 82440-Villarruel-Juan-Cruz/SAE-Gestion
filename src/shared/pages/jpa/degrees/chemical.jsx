import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPAQuimica() {
  const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-quimica.jpg`;
  const materias1Año = [
    "Integración I",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Análisis matemático II",
    "Química General",
    "Sistemas de representación",
    "Inglés Técnico I",
  ];
  const materias2Año = [
    "Integración II",
    "Física II",
    "Química Inorgánica",
    "Física II",
    "Probabilidad y estadística",
    "Fundamentos de informática",
    "Química Orgánica",
    "Matemática Superior Aplicada",
  ];
  const materias3Año = [
    "Integración III",
    "Inglés Técnico II",
    "Termodinámica",
    "Mecánica-Eléctrica Industrial",
    "Química Analítica",
    "Economía",
    "Legislación",
    "Fisicoquímica",
    "Fenómenos de transporte",
  ];
  const materias4Año = [
    "Integración IV",
    "Operaciones Unitarias I",
    "Tecnología de la Energía Térmica",
    "Ingeniería de las Reacciones Químicas",
    "Organización Industrial",
    "Biotecnología",
    "Operaciones Unitarias II",
    "Control Estadístico de Proceso",
  ];
  const materias5Año = [
    "Control automático de procesos",
    "Prácticas Supervisadas",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Análisis Microbiológico",
    "Física de los materiales",
    "Investigación de operaciones",
    "Herramientas de dirección y gestión empresarial",
    "Materiales nanoestructurados y nanotecnologías",
    "Gestión del potencial humano",
    "Química analítica aplicada",
    "Ingeniería de las instalaciones",
    "Ingeniería ambiental",
    "Tecnología de los alimentos",
    "Propiedades, diseño y síntesis de materiales",
    "Catalizadores y procesos catalíticos",
    "Gestión integrada",
  ];
  const alcances = [
    "Estudio, cálculo, diseño, proyecto, construcción, instalación, puesta en marcha, inspección de: Industrias que involucren procesos físicos, químicos y de bioingeniería y sus instalaciones complementarias y de servicios, tales como agua, calor, gas y aire.",
    "Instalaciones donde intervengan operaciones unitarias y/o procesos unitarios.",
    "Equipos, maquinarias, aparatos o instrumentos para las industrias e instalaciones indicadas en los puntos anteriores.",
    "Debe excluirse el cálculo de obras civiles, no así el estudio del aspecto funcional de las construcciones industriales, de servicio y sus instalaciones complementarias.",
    "Operaciones de las industrias e instalaciones citadas, con planificación, programación de los procesos y la producción.",
    "Investigación y desarrollo de nuevos procesos, equipos o productos.",
    "Estudios de factibilidad de aprovechamiento e industrialización de recursos naturales y materias primas.",
    "Evaluación de riesgos de higiene, seguridad industrial y contaminación ambiental, relacionados con los incisos anteriores.",
    "Asuntos de ingeniería legal, económica y financiera relacionados a los puntos anteriores.",
    "Tareas dentro del sector público de: asesoramiento, promoción, control de evaluación y otras en temas de su competencia.",
    "Tareas relacionadas con la gestión empresarial de comercialización, administración y dirección de las empresas o instalaciones descriptas.",
    "Enseñanza de los conocimientos básicos, técnicos y científicos de los temas contenidos en la carrera en todos los niveles.",
  ];
  const perfil = [
    "La tarea fundamental de un Ingeniero Químico no se realiza en un laboratorio, con espumas de colores que salen de los tubos de ensayo o mezclas que explotan. La principal labor que se desarrolla en una planta química, entendiendo como tal a una empresa donde la materia prima que ingresa para convertirse en producto sufre una transformación esencial y no solo de forma, mediante una reacción química, por contraposición a una empresa de manufactura, tal como la automotriz.",
    "En este sentido, la tarea del Ingeniero Químico tiene que ver con cañerías, bombas de fluidos, molinos, secadores, filtros, destilaciones, reactores, seguridad de las plantas químicas, control de procesos, etc. Así, se vuelve tan importante la física y la matemática como la química.",
    "No se descuida la dimensión humana del profesional, que también es capaz de dirigir como gerente una planta, por lo que unos conjuntos de materias electivas están destinadas a la conducción de personal, dinámica de grupos humanos, administración de recursos humanos.",
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
      title="Ingeniería Química"
      image={imageDirBanner}
      description="Esta rama de la Ingeniería se dedica al estudio, síntesis, desarrollo, diseño, operación y optimización de todos aquellos procesos industriales que producen cambios físicos, químicos y/o bioquímicos en los materiales."
      degreeInfo={{
        degree: "Título — Ingeniero Químico",
        duration: "Duración — 5 años",
        link: "https://www.institucional.frc.utn.edu.ar/quimica/",
        intermedio:
          "Título intermedio — Técnico Universitario en Química (3.er año)",
        world:
          "Programa de doble titulación con el Instituto Politécnico de Bragança (Portugal — Unión Europea)",
      }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{
        title: "Charla del Departamento de Ingeniería Química",
        src: "https://www.youtube.com/embed/D9wiPbJ4jhQ?si=WEqk314a0aRyEgBV",
      }}
    />
  );
}
