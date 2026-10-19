import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPAMetalurgic() {
   const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-metalurgica.webp`;

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
    "Laboratorios, plantas pilotos, institutos de diversa índole relacionados con la investigación, control y diseño en la industrial siderometalúrgica, de los metales no ferrosos y los no metálicos en general.",
    "Metalúrgica extractiva y materias primas.",
    "Transformación y acabado de los metales y no metales.",
    "Procesos metalúrgicos en sus diversos tipos y procesamientos de los no metales.",
    "Factibilidad de aprovechamiento en industrialización de los recursos naturales y materias primas metálicas y no metálicas.",
    "Diseño de materiales metálicos y no metálicos, su caracterización, su desempeño en servicios, su reciclado y su degradación.",
    "Comportamiento del material metálico y no metálico, evaluación de sus propiedades y análisis de fallas.",
    "Asuntos de ingeniería legal, económica y financiera.",
    "Arbitrajes, pericias y tasaciones.",
    "Higiene, seguridad industrial y contaminación ambiental.",
  ];
  const perfil = [
    "En el plano de los conocimientos metalúrgicos, el Ingeniero Metalúrgico posee claros conceptos sobre los materiales y procesos en general, de tal modo que le permitan crear y elaborar diseños ingeniosos que faciliten los procesos de obtención y de tratamientos de metales.",
    "Conocer las tendencias de diseño a los efectos de proyectar elementos que no queden rápidamente obsoletos.",
    "En este contexto, los conocimientos de tecnología de obtención de avanzada le permiten, junto con otros conceptos tales como automatización y mecánica de los fluidos, optimizar cualquier tipo de diseño.",
    "Es importante destacar que el avance de la informática y las técnicas computacionales relativizan cada vez más el papel del ingeniero como mero calculista, volcándose en consecuencia su formación hacia tareas más creativas e ingeniosas en el campo del proyecto metalúrgico.",
    "En este plano, el conocimiento estadístico de fallas de los elementos mecánicos y sus soluciones le permite dirigir más eficazmente el diseño a sistemas, no solo funcionales sino también durables.",
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
      title="Ingeniería Metalúrgica"
      image={imageDirBanner}
      description="Capacita en el estudio, selección, procesamiento, investigación y asesoramiento de metales y aleaciones, así como de materiales no metálicos, entre ellos cerámicos, plásticos reforzados y fibras de carbono."
      degreeInfo={{ degree: "Título — Ingeniero Metalúrgico", duration: "Duración — 5 años", link: "https://www.institucional.frc.utn.edu.ar/metalurgica/", intermedio: "Título intermedio — Técnico Universitario Metalúrgico (3.er año)" }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{ title: "Charla del Departamento de Ingeniería Metalúrgica", src: "https://www.youtube.com/embed/3hYEvUbSnkk?si=5S3ZqeXJPBBR3RgY" }}
    />
  );
}