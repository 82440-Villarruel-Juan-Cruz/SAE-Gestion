import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPAElectric() {
  const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-electronica.jpg`;

  const materias1Año = [
    "Informática I",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Análisis matemático II",
    "Física I",
    "Sistemas de representación",
  ];
  const materias2Año = [
    "Informática II",
    "Análisis de señales y sistemas",
    "Química general",
    "Física II",
    "Probabilidad y estadística",
    "Física electrónica",
    "Inglés I",
  ];
  const materias3Año = [
    "Teoría de circuitos I",
    "Técnicas digitales I",
    "Dispositivos electrónicos",
    "Legislación",
    "Electrónica aplicada I",
    "Medios de enlace",
    "Inglés II",
  ];
  const materias4Año = [
    "Técnicas digitales II",
    "Medidas electrónicas I",
    "Teoría de circuitos II",
    "Máquinas e instalaciones eléctricas",
    "Sistemas de comunicaciones",
    "Electrónica aplicada II",
    "Seguridad, higiene y medio ambiente",
  ];
  const materias5Año = [
    "Técnicas digitales III",
    "Medidas Electrónicas II",
    "Sistemas de control",
    "Electrónica aplicada III",
    "Tecnología electrónica",
    "Organización industrial",
    "Práctica profesional supervisada",
    "Economía",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Software en tiempo real",
    "Equipos de microondas",
    "Control de procesos",
    "Sistema de comunicaciones II",
    "Sistema de comunicaciones III",
    "Sistemas de telecomunicaciones",
    "Técnicas digitales IV",
    "Sistemas de televisión",
    "Bioelectrónica",
    "Fundamentos de acústica y electroacústica",
    "Visión por computadora",
  ];
  const alcances = [
    "Sistemas o partes de sistemas de generación, transmisión, distribución, conversión, control, automatización, recepción, procesamiento, utilización de señales de naturaleza electromagnética en todas las frecuencias y potencias.",
    "Instalaciones que utilicen energía eléctrica como accesorio de lo detallado en el inciso anterior.",
    "Laboratorios de todo tipo relacionados con los incisos anteriores, excepto obras civiles e industriales.",
    "Sistemas de Control.",
    "Asuntos de ingeniería legal, económica y financiera relacionados con los incisos anteriores.",
    "Arbitrajes, pericias y tasaciones relacionados con los incisos anteriores.",
    "Higiene, seguridad industrial, contaminación ambiental relacionados con los incisos anteriores.",
    //Ojo con el texto de aca Hablar con JC https://sites.google.com/view/sae-frc/oferta-acad%C3%A9mica/ing-electr%C3%B3nica?authuser=5#h.wj7xjaj30il2
  ];
  const perfil = [
    "Es un profesional capacitado para desarrollar sistemas de ingeniería y paralelamente aplicar la tecnología existente, comprometido con el medio, lo que le permite ser promotor de cambio, con capacidad de innovación, al servicio de un conocimiento productivo, generando empleos y desarrollo social.",
    "Es un profesional formado y capacitado para afrontar con solvencia el planeamiento, desarrollo, dirección y control de sistemas electrónicos. Por su preparación, resulta especialmente apto para integrar la información proveniente de distintos campos disciplinarios concurrentes a un proyecto común.",
    "Está capacitado para abordar proyectos de investigación y desarrollo, integrando a tal efecto equipos interdisciplinarios, en cooperación o asumiendo el liderazgo efectivo en la coordinación técnica y metodológica de los mismos. Por su sólida formación físico-matemática, está preparado para generar tecnología, resolviendo problemas inéditos en la industria.",
    "Su formación integral le permite administrar recursos humanos, físicos y de aplicación que intervienen en el desarrollo de proyectos, lo que lo habilita para el desempeño de funciones gerenciales acordes con su especialidad.",
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
      title="Ingeniería Electrónica"
      image={imageDirBanner}
      description="La carrera forma profesionales capacitados para afrontar con solvencia el planeamiento, desarrollo, dirección y control de sistemas electrónicos, así como proyectos de investigación y desarrollo, administrando los recursos humanos y físicos necesarios."
      degreeInfo={{ degree: "Título — Ingeniero Electrónico", duration: "Duración — 5 años y medio", intermedio: "Título intermedio — Técnico Universitario en Electrónica (4.º año)", link: "https://www.institucional.frc.utn.edu.ar/electronica/", world: "Programa de doble titulación con el Instituto Politécnico de Bragança (Portugal — Unión Europea)" }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{ title: "Charla del Departamento de Ingeniería Electrónica", src: "https://www.youtube.com/embed/HncSWXqAH08?si=Ymti9cGO302QzVdS" }}
    />
  );
}