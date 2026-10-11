import DegreePageTemplate from "../../../../assets/components/degrees/DegreePageTemplate";

export default function SharedJPACivil() {
  const imageDirBanner = `${import.meta.env.BASE_URL}images/jpa/degree-banners/ing-civil.jpg`;
  const materias1Año = [
    "Análisis Matemático I",
    "Algebra y Geometría Analítica",
    "Ingeniería y Sociedad",
    "Ingeniería Civil I",
    "Sistemas de Representación",
    "Química General",
    "Física 1",
    "Fundamentos de la informática",
  ];
  const materias2Año = [
    "Análisis Matemático II",
    "Estabilidad",
    "Ingeniería Civil II",
    "Tecnología de los materiales",
    "Física II",
    "Probabilidad y Estadística",
    "Inglés I",
  ];
  const materias3Año = [
    "Resistencia de los materiales",
    "Tecnología del hormigón",
    "Tecnología de la construcción",
    "Geotopografía",
    "Hidráulica general y aplicada",
    "Cálculo Avanzado",
    "Instalaciones Eléctrica y Acústica",
    "Instalaciones TermoMecánicas",
    "Inglés II",
    "Economía",
  ];
  const materias4Año = [
    "Geotecnia",
    "Instalaciones sanitarias y de gas",
    "Diseño arquitectónico, planeamiento y urbanismo",
    "Análisis estructural I",
    "Estructura de hormigón",
    "Hidrología y obras hidráulicas",
    "Ingeniería Legal",
  ];
  const materias5Año = [
    "Construcciones metálicas y de madera",
    "Cimentaciones",
    "Ingeniería sanitaria",
    "Organización y conducción de obras",
    "Vías de comunicación I",
    "Análisis estructural II",
    "Vías de comunicación II",
    "Proyecto Final",
  ];
  const materiasElectivas = [
    "Aeropuertos",
    "Análisis estructural III",
    "Dinámica estructural",
    "Diseño Arquitectónico y planeamiento II",
    "Geología aplicada",
    "Hidrología urbana",
    "Introducción a los sistemas de información geográficos",
    "Obras fluviales y marítimas",
    "PreFabricación",
    "Puentes",
    "Saneamiento y medio ambiente",
    "Tránsito y transporte",
    "Uso de recursos hídricos",
    "Vialidad especial",
  ];
  const alcances = [
    "El egresado de Ingeniería Civil podrá diseñar, calcular y proyectar: estructuras, edificios, viviendas, puentes, obas viales, obas hidráulicas, obras de saneamiento, obras ferroviarias, obras portuarias, obas aeroportuarias, obas geotécnicas, estructuras, obras civiles, obras viales, instalaciones y obas complementarias.",
    "También estará capacitado para dirigir y controlar la construcción, rehabilitación, demolición y mantenimiento de estructuras, edificios, viviendas, puentes, obas viales, obras hidráulicas, obras de saneamiento, obas ferroviarias, obras portuarias, obas aeroportuarias, obas geotécnicas, estructuras, obas civiles, obras viales, instalaciones y obras complementarias.",
  ];
  const perfil = [
    "El ingeniero civil de hoy está encargado de resolver problemas de infraestructura para la producción de bienes y servicios del país en general: edificios, fabricas, viviendas, puentes, carreteras, vías ferroviarias y navegables, puertos y aeropuertos, aprovechamientos hidroeléctricos, sistemas de riego, defensa aluvionales, distribución de agua, desagües pluviales, cloacales e industriales.",
    "También entenderá en la seguridad, mantenimiento y operación, modernización, planificación, control ecológico y eficiente remplazo de la infraestructura, teniendo en cuenta los aspectos técnicos-económicos.",
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
      title="Ingeniería Civil"
      image={imageDirBanner}
      description="Está capacitado para proyectar, mensurar, planificar, dirigir, construir y auditar el desarrollo de obras de infraestructura y sus instalaciones: viviendas, edificios, naves industriales, estaciones de servicio, carreteras, puentes, obras ferroviarias, canales, diques, puertos, aeropuertos y desarrollos urbanos."
      degreeInfo={{ degree: "Título — Ingeniero Civil", duration: "Duración — 5 años y medio", video: "https://www.youtube.com/watch?v=Y-CLFhciSwc", link: "https://www.institucional.frc.utn.edu.ar/civil/", world: "Programa de doble titulación con el Instituto Politécnico de Bragança (Portugal — Unión Europea)" }}
      curriculum={curriculum}
      scopes={alcances}
      profile={perfil}
      video={{ title: "Charla del Departamento de Ingeniería Civil", src: "https://www.youtube.com/embed/Y-CLFhciSwc?si=WKpNEfpsLWXjtRav" }}
    />
  );
}