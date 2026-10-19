import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPAElectrical() {
  const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-electrica.webp`;
  const materias1Año = [
    "Fundamentos de Informática",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Química General",
    "Integración Eléctrica I",
    "Física I",
    "Sistemas de representación",
  ];
  const materias2Año = [
    "Análisis Matemático II",
    "Estabilidad",
    "Integración Eléctrica II",
    "Física II",
    "Mecánica Térmica",
    "Probabilidad y estadística",
    "Electrotecnia I",
    "Cálculo numérico",
    "Inglés Técnico I",
  ];
  const materias3Año = [
    "Tecnología y ensayos de materiales eléctricos",
    "Instrumentos y mediciones eléctricas",
    "Teoría de los campos",
    "Física III",
    "Electrotecnia II",
    "Termodinámica",
    "Máquinas eléctricas I",
    "Fundamentos para el análisis de señales",
  ];
  const materias4Año = [
    "Electrónica I",
    "Máquinas eléctricas II",
    "Seguridad, riesgo eléctrico y medio ambiente",
    "Instalaciones eléctricas y luminotecnia",
    "Control automático",
    "Máquinas térmicas, hidráulicas y de fluidos",
    "Economía",
    "Inglés Técnico II",
    "Legislación",
  ];
  const materias5Año = [
    "Generación, transmisión y distribución de energía eléctrica",
    "Sistemas de potencia",
    "Accionamientos y controles eléctricos",
    "Electrónica II",
    "Organización y administración de empresas",
    "Prácticas supervisadas",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Impacto ambiental de líneas y centrales eléctricas",
    "Fuentes no convencionales de energía",
    "Centrales y protecciones eléctricas",
    "Transmisión de datos en sistemas eléctricos",
    "Legislación laboral",
    "Elementos de máquinas y tecnología mecánica",
  ];
  const alcances = [
    "Diseño, cálculo y proyecto",
    "Dirección ejecutiva de obra",
    "Dirección de instalaciones y montaje",
    "Explotación de sistemas eléctricos en sus aspectos técnicos y de organización",
    "Mantenimiento",
    "Comercialización de la energía eléctrica",
    "Pericias y asesoramiento técnico",
    "Consultorías",
    "Dirección de equipo de trabajo en proyectos relevantes de ingeniería",
    "Investigación, desarrollo e innovación tecnológica",
    "Docencia universitaria",
    "Multiplicador de fuentes de producción y desarrollo",
  ];
  const perfil = [
    "La carrera de grado de Ingeniería Eléctrica responde a la necesidad de formar profesionales aptos para cumplir funciones, técnicas o de gestión en el área de Generación, Transmisión, Distribución y Utilización de Energía Eléctrica.",
    "La carrera, dividida en orientaciones, permite al futuro ingeniero una elección en base a los aspectos tradicionales de la gestión organizativa y productiva, transformación, transporte y utilización de la energía eléctrica, del análisis técnico-económico de la confiabilidad y seguridad de los sistemas eléctricos, y, por otra parte, los desarrollos consolidados en el campo de la electrónica industrial, la robótica y, en general, el control de los dispositivos electromecánicos.",
    "En base a su formación, se valdrá de técnicas informáticas de tipo aplicativo para el proyecto de máquinas, dispositivos e instalaciones y los controles automáticos de los mismos.",
    // OJO con este Texto https://sites.google.com/view/sae-frc/oferta-acad%C3%A9mica/ing-el%C3%A9ctrica?authuser=5#h.wafj0gphve6c
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
      title="Ingeniería Eléctrica"
      image={imageDirBanner}
      description="La carrera de Ingeniería Eléctrica responde a la necesidad de formar profesionales aptos para cumplir funciones técnicas o de gestión en el área de generación, transmisión, distribución y utilización de la energía eléctrica."
      degreeInfo={{ degree: "Título — Ingeniero Electricista", duration: "Duración — 5 años", link: "https://www.institucional.frc.utn.edu.ar/electrica/" }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{ title: "Charla del Departamento de Ingeniería Eléctrica", src: "https://www.youtube.com/embed/NWkrj-F6I34?si=24XQ9ecdSBk_CTJg" }}
    />
  );
}