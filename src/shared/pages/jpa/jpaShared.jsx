import {
  Avatar,
  Box,
  Card,
  Container,
  Typography,
  Stack,
  Chip,
  Paper,
  Grid,
  useMediaQuery,
  Divider,
} from "@mui/material";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import { SAETypography } from "../../../assets/components/typography/SAETypography";
import { CalendarEvent } from "../../../assets/components/calendarEvent/calendarEvent";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JPAProvider } from "../../context/providers/jpaProvider";
import { HashLink as Link } from "react-router-hash-link";

import Fab from "@mui/material/Fab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import GroupsIcon from "@mui/icons-material/Groups";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CampaignIcon from "@mui/icons-material/Campaign";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { JPA_STRINGS } from "../../../utils/strings/shared.strings";

const C = JPA_STRINGS;
const baseUrl = import.meta.env.BASE_URL;
const settingsHero = {
  mobileFirst: true,
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 1400,
  autoplaySpeed: 6000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const settings = {
  dots: false,
  infinite: true,
  swipe: true,
  speed: 600,
  autoplay: true,
  autoplaySpeed: 4000,
  slidesToShow: 3,
  slidesToScroll: 1,
  swipeToSlide: true,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        speed: 600, // Reduce slightly for tablet
        swipeToSlide: false,
      },
    },
    {
      breakpoint: 933, // Mobile
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 400,
        swipeToSlide: false,
        waitForAnimate: false,
        autoplay: false,
      },
    },
  ],
};

const studentJourney = [
  {
    icon: <SchoolIcon />,
    title: "Conocenos",
    subtitle: "Primer paso",
    description: "Vení a conocernos",
    text: "El punto de partida para <strong>comenzar a estudiar en nuestra Universidad</strong>, donde comenzás a construir tu nueva experiencia académica y social. Durante esta fase, tendrás la oportunidad de familiarizarte con el campus, conocer a tus compañeros de clase y establecer conexiones que pueden durar toda la vida. Además, es un momento para descubrir los recursos y servicios que la universidad ofrece para apoyarte en tu camino académico.<br/> <br/> Desde la <strong>S</strong>ecretaría de <strong>A</strong>suntos <strong>E</strong>studiantiles te invitamos a acercarte a nuestra facultad en <a href='https://maps.app.goo.gl/MhoJUKgTzywVdFsZ9' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>Maestro Lopez esq. Cruz Roja Argentina</a> para ser parte de nuestras presentaciones, eventos, torneos y exposiciones!<br/><br/><strong>¡Te esperamos!</strong>",
    image: `${baseUrl}images/jpa/journey/posseto-entrada.webp`,
    alt: "Vista afuera de la UTN desde la calle Marcelo T. de Alvear",
  },
  {
    icon: <GroupsIcon />,
    title: "Inscripción",
    subtitle: "Cómo ser parte",
    description: "Todo lo que debés saber",
    text: "Comenzás a ser parte de nuestra comunidad cuando te inscribís por primera vez al ingreso; este proceso involucra que tengas <strong>finalizado el secundario y rindas un examen de ingreso. </strong> Es posible que te preinscribas para rendir aun sin finalizar tus estudios, pero será requisito una vez hayas aprobado los exámenes de ingreso y <strong>debas presentar la documentación.</strong><br/><br/> En la instancia de evaluación deberás rendir <strong> Matemática, Física e Introducción a la vida universitaria, </strong> donde el centro de estudiantes y la SAE proveen de cursos intensivos para que finalices tu formación académica en estas 3 disciplinas.<br/> <br/>Una vez tengas certeza de que estás interesado en estudiar, podés conocer más de cómo inscribirte <a href='https://www.frc.utn.edu.ar/ingreso-ingenierias-2027/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>aquí.</a>",
    image: `${baseUrl}images/jpa/journey/auditorio-jpa.jpg`,
    alt: "Auditorio Ing. Héctor Aiassa en el edificio central",
  },
  {
    icon: <DocumentScannerIcon />,
    title: "Trámites",
    subtitle: "Documentación",
    description: "Presentación de Documentación",
    text: "Una vez que ingreses y hayas aprobado los exámenes de ingreso deberás presentar en el <strong> Departamento de Alumnos </strong> documentos como <strong>tu fotocopia del DNI, Analítico o Analítico en trámite, Constancia de CUIL y una copia de tu partida de nacimiento (Descargable de CiDi)</strong>. <br/><br/> La presentación de esta documentación personal, la elección de tu carrera y la inscripción a las materias de primer año son fundamentales para que seas considerado un estudiante hecho y derecho de nuestra universidad.<br/><br/>Si necesitás asesoramiento en cómo sacar turno para el departamento o en dónde solicitar los documentos no dudes en acercarte a la <strong>SAE</strong> para recibir atención personalizada a tu problemática.",
    image: `${baseUrl}images/jpa/journey/documentacion.jpg`,
    alt: "Primer plano de una carpeta con papeles",
  },
  {
    icon: <SportsSoccerIcon />,
    title: "Vida UTN",
    subtitle: "Más que estudiar",
    description: "Comunidad Deportiva",
    text: "Desde la Secretaría de Asuntos Estudiantiles contamos con un área dedicada a la realización de deportes como actividad recreativa y competitiva. Contamos con <strong>convenios con diferentes espacios deportivos</strong> para que puedas entrenar en tu día a día, ofreciendo descuentos especiales por ser alumno de nuestra Universidad.<br/><br/>Además en nuestra facultad tenemos un predio dedicado a deportes como<strong> fútbol 11, fútbol sala, vóley, básquet, natación y arquería</strong> con sus respectivos entrenamientos para todos los géneros.<br/><br/>Si estás interesado en representar a la facultad en una o más disciplinas, no dudes en formar parte de nuestros equipos para participar en los torneos deportivos que se realizan durante todo el año.",
    image: `${baseUrl}images/jpa/journey/campus.jpg`,
    alt: "Campus de la UTN a las afueras de Córdoba",
  },
  {
    icon: <AirportShuttleIcon />,
    title: "Viajes",
    subtitle: "Explorá con la UTN",
    description: "Viajá por todo el país",
    text: "Las visitas a empresas son una excelente oportunidad para conocer la realidad del <strong>mundo laboral y establecer contactos con profesionales de la industria.</strong> A lo largo del año se gestionan viajes desde nuestra regional para conocer empresas, otras regionales o infraestructuras donde pueden tener un acercamiento a lo que será su carrera en el ámbito laboral.<br/><br/> La secretaría, en conjunto con diferentes cátedras de la facultad, organiza visitas en diversos sectores de la economía, brindando a los estudiantes la oportunidad de explorar diferentes industrias y <strong>conocer de primera mano las oportunidades laborales disponibles,</strong> siendo una parte importante de la experiencia universitaria, ya que permiten a los estudiantes conectar su formación académica con el mundo real y prepararse para su futura carrera profesional.",
    image: `${baseUrl}images/jpa/journey/visita-tecnica.jpg`,
    alt: "Visita guiada a la bodega La Abeja en San Rafael",
  },
  {
    icon: <CampaignIcon />,
    title: "Eventos",
    subtitle: "Congresos y charlas",
    description: "Indagá en nuevos mundos",
    text: "En nuestra universidad conviven un montón de comunidades e instituciones que se hacen presentes durante el año para mostrar nuevos mundos. Algunos de nuestros eventos concurrentes son muestras de las invenciones de Leonardo da Vinci <a href='https://muestraleonardodavinci.com/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>Futuros Presentes</a>, ciencia ficción traída a nosotros con <a href='https://cba.portico.net.ar/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>Pórtico</a>, congresos como el <a href='https://cneisi.sanfrancisco.utn.edu.ar/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>CNEISI</a> o <a href='https://tedxcordoba.com.ar/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>TEDxCórdoba</a>, charlas de todos los ámbitos como <a href='https://aveit.frc.utn.edu.ar/cuna-de-emprendedores/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>Cuna de Emprendedores</a> o <a href='https://www.frc.utn.edu.ar/novedades/2026/la-utn-cordoba-celebro-la-cultura-con-tres-conciertos-que-convocaron-a-cientos-de-personas/' target='_blank' style='color: #2b6cb0; text-decoration: none; font-weight: 500; border-bottom: 2px solid #90cdf4; padding-bottom: 2px;'>conciertos dentro de nuestra institución.</a> <br/><br/> No te pierdas la posibilidad de ser parte de esos eventos y muchos más; podés enterarte más siguiéndonos en Instagram <strong>@sae.utn.frc</strong>, entrando a novedades en la página institucional o echándole un ojo a nuestros eventos al final de la página.<br/><br/><strong>¡No te olvides de participar en lo que más te guste!</strong>",
    image: `${baseUrl}images/jpa/journey/futuros-presentes.webp`,
    alt: "Presentación Futuros Presentes en la Universidad Tecnológica Nacional Regional Córdoba.",
  },
  {
    icon: <WorkIcon />,
    title: "Pasantías",
    subtitle: "Becas y prácticas",
    description: "Nuestras Becas",
    text: "La Secretaría posee un programa de becas propias de nuestra universidad en la cual se ofrecen variedad de actividades para que lo económico no sea un impedimento en tu ciclo formativo. Se cuenta con becas de <strong>servicio</strong> orientadas a ser parte de las áreas de nuestra facultad, de <strong>investigación</strong> orientadas a mantener proyectos de investigación en cada especialidad o <strong>económicas</strong> que se centran en tener un seguimiento de tu situación académica/social para mejorar tus oportunidades en finalizar tus estudios de grado.<br/><br/> Por otro lado la <strong>SAE</strong> mantiene una base de conocimiento para poder ayudar a gestionar becas estatales como son las <strong>PROGRESAR</strong> o <strong>Manuel Belgrano.</strong><br/><br/>En ambas situaciones, si estás interesado en informarte más de las becas universitarias o estatales, no dudes en consultarnos.",
    image: `${baseUrl}images/jpa/journey/oficina-sae.jpg`,
    alt: "Oficina de la Secretaría de Asuntos Estudiantiles (SAE) en Córdoba.",
  },
  {
    icon: <EmojiEventsIcon />,
    title: "Graduación",
    subtitle: "Meta cumplida",
    description: "No pierdas de vista el objetivo",
    text: "Desde la <strong>SAE</strong> queremos acompañarte durante todo tu trayecto académico en nuestra universidad. Nos interesa que te sientas parte de algo más grande, que no dejes atrás tus sueños y que puedas conseguir el objetivo de recibirte con nosotros. No te olvides de que podés acercarte a nuestra oficina o comunicarte con nosotros en cualquier momento de tu camino educativo y te brindaremos una mano para lo que necesites.<br/><br/>Nos llena de orgullo que tantos profesionales elijan nuestra regional para formarse educativamente, participen en nuestros eventos, sean parte de nuestra comunidad y nos ayuden a mejorar constantemente. <br/><br/> <strong>¡Felicitamos a todos nuestros ingenieros formados en esta casa de altos estudios pública, de calidad y gratuita!</strong>",
    image: `${baseUrl}images/jpa/journey/colacion.jpg`,
    alt: "Aula Magna Agustín Tosco de la Universidad Tecnológica Nacional Regional Córdoba.",
  },
];
const carreras = [
  {
    title: "Ing. en Sistemas",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-sistemas.jpg`,
    alt:"Primer plano de código de programación colorido mostrado en un monitor de computadora con fondo oscuro. El autor es Nemuel Sereti subido a Pexels.",
    route: "/JPA/sistemas",
    duracion: "5 años",
    intereses: ["Software", "IA", "Datos"],
  },
  {
    title: "Ing. Eléctrica",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-electrica.jpg`,
    alt:"Foto de una via electrica, el autor es Efe Burak Baydar subido a Pexels.",
    route: "/JPA/electrica",
    duracion: "6 años",
    intereses: ["Centrales", "Tecnologías Renovables", "Red Eléctrica"],
  },
  {
    title: "Ing. Química",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-quimica.jpg`,
    alt:"Primer plano de tuberías y válvulas de acero inoxidable en un entorno de la industria química. El autor es Yuri Shkoda subido a Pexels.",
    route: "/JPA/quimica",
    duracion: "5 años",
    intereses: ["Destiladores", "Centrales Eléctricas", "Seguridad"],
  },

  {
    title: "Ing. Metalúrgica",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-metalurgica.jpg`,
    alt:"Plano de una persona viendo una fundicion, el autor es Emre Ezer subido a Pexels.",
    route: "/JPA/metalurgica",
    duracion: "5 años",
    intereses: ["Materiales", "Construcción", "Espadas"],
  },

  {
    title: "Ing. Electrónica",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-electronica.jpg`,
    route: "/JPA/electronica",
    alt:"Primer plano de circuitos y microprocesador en una placa base, el autor es Mikhail Nilov subido a Pexels.",
    duracion: "6 años",
    intereses: ["Robótica", "IoT", "Automatización"],
  },
  {
    title: "Ing. Civil",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-civil.jpg`,
    route: "/JPA/civil",
    alt:"Alto puente en construcción con grúas contra un cielo azul. el autor es Cesal Keser subido a Pexels.",
    duracion: "5 años",
    intereses: ["Construcción", "Reconocimiento", "Progreso Edilicio"],
  },
  {
    title: "Ing. Industrial",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-industrial.jpg`,
    route: "/JPA/industrial",
    alt:"Vista de ángulo alto de la línea de producción de botellas de vidrio en una fábrica con botellas brillantes. El autor es Keegan Checks subido a Pexels.",
    duracion: "5 años",
    intereses: [
      "Mejoras de Proceso",
      "Plantas Automatizadas",
      "Gestión de Recursos",
    ],
  },
  {
    title: "Ing. Mecánica",
    img: `${baseUrl}images/jpa/degree-carrousel/ingenieria-mecanica.jpg`,
    alt:"Primer plano del proceso de ensamblaje del motor que resalta la precisión industrial. El autor es Auto Tech subido a Pexels.",
    route: "/JPA/mecanica",
    duracion: "5 años",
    intereses: ["Producción", "Autopartes", "Nuevas Piezas"],
  },
];
const heroCarrousel = [
  `${baseUrl}images/jpa/main-hero/patio-seco.jpg`,
  `${baseUrl}images/jpa/main-hero/institucional-portada.jpg`,
  `${baseUrl}images/jpa/main-hero/estacionamiento.jpg`,
  `${baseUrl}images/jpa/main-hero/auditorio.webp`,
];

function ParticipeButton() {
  const navigate = useNavigate();
  return (
    <Fab
      color="primary"
      variant="extended"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
      className="fab-participar"
      onClick={() => navigate("/JPA/participar")}
    >
      <HowToRegIcon />
      <span className="texto"> {C.participateButton}</span>
    </Fab>
  );
}
export default function JPA() {
  return (
    <JPAProvider>
      <JPAContent />
    </JPAProvider>
  );
}
function JPAContent() {
  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "75px" },
        pb: 4,
        minHeight: "calc(110vh - 90px)",
        bgcolor: "var(--background)", //No uso el SAEPage porque me da fiaca re configurar el HeroSection
      }}
    >
      <HeroSection />
      <Container maxWidth="xl">
        <DegreesCarrousel />
        <Divider sx={{ mb: "-10px" }} />
        <JourneySection />
        <Divider sx={{ mb: "-10px" }} />
        <EventSection />
        <ParticipeButton />
      </Container>
    </Box>
  );
}

function HeroSection() {
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          "& .slick-slider": {
            touchAction: "pan-y",
          },
          "& .slick-list": {
            margin: "0 -10px",
          },
          "& .slick-slide": {
            padding: "0 10px",
            boxSizing: "border-box",
            height: "auto",
            "& > div": {
              width: "100%",
            },
          },
        }}
      >
        <Slider {...settingsHero}>
          {heroCarrousel.map((image) => {
            return (
              <Box
                sx={{
                  position: "relative",
                  height: { xs: "85vh",sm:"50vh",lg:"75vh" },
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    px: { xs: 2, md: 6 },
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.65)",
                  }}
                >
                  <Stack
                    justifyContent="center"
                    height="100%"
                    spacing={{ xs: 1, md: 4 }}
                  >
                    <Chip
                      icon={<SchoolIcon />}
                      label={C.universityChip}
                      sx={{
                        width: "fit-content",
                        bgcolor: "var(--secondary)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        fontWeight: 700,
                      }}
                    />

                    <SAETypography variant="h1" color="white">
                      Ingeniería
                      <Box
                        //Despues deberiamos fijarnos un metodo mas limpio
                        component="br"
                        sx={{ display: { xs: "block", md: "none" } }}
                      />
                      {" es más"}
                      <Box component="br" />
                      {" que una carrera"}
                    </SAETypography>

                    <SAETypography variant="subtitle1" color="white" width={{xs:"100%",md:"50%"}}>
                      {C.heroSubtitle}
                    </SAETypography>
                    <Stack direction="row" spacing={{ xs: 1, md: 2 }}>
                      <Link
                        to={`/JPA#carreras`}
                        sx={{
                          color: "white ",
                          fontSize: "18px",
                          textDecoration: "none !important",
                        }}
                      >
                        <SAEButton
                          variant="contained"
                          size="large"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            bgcolor: "#FFD54F",
                            color: "#123666",
                            minHeight:{xs:"75px",md:"50px"},
                            "&:hover": {
                              bgcolor: "#FFCA28",
                            },
                          }}
                        >
                          {C.heroExplore}
                        </SAEButton>
                      </Link>
                      <Link
                        to={`/JPA#eventos`}
                        sx={{
                          color: "white ",
                          fontSize: "18px",
                          textDecoration: "none !important",
                        }}
                      >
                        <SAEButton
                          variant="outlined"
                          size="large"
                          sx={{
                            fontWeight: 700,
                            minHeight:{xs:"75px",md:"50px"},
                            color: "white",
                            borderColor: "white",
                            bgcolor: "none",
                            "&:hover": {
                              borderColor: "white",
                              bgcolor: "rgba(255,255,255,.08)",
                            },
                          }}
                        >
                          {C.heroNextEvents}
                        </SAEButton>
                      </Link>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Slider>
      </Box>
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2,sm:-8, xl: -10 },
          position: "relative",
          zIndex: 5,
          px: { xs: 2,sm:4 },
        }}
      >
        <Paper
          elevation={5}
          sx={{
            borderRadius: { xs: 3, sm: 5 },
            overflow: "hidden",
          }}
        >
          <Grid container /*Deberiamos hacerlo una lista y luego mapear*/>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard value={8} label={C.heroCard1} />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard value={10} prefix="+" suffix="K" label={C.heroCard2} />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard value={150} prefix="+" label={C.heroCard3} />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard value={50} prefix="+" label={C.heroCard4} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

function DegreesCarrousel() {
  const dragRef = useRef(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:932px)");
  const isTablet = useMediaQuery("(max-width:1199px)");
  const slidesToShow = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <section
      key={"carreras"}
      id={"carreras"}
      style={{ scrollMarginTop: "120px" }}
    >
      <Box
        sx={{
          mt: { xs: 7, md: 10 },
          textAlign: "center",
          mb: { xs: 3, md: 4 },
        }}
      >
        <Typography variant="h2" fontWeight={700}>
          {C.ourDegreesTitle}
        </Typography>

        <Typography variant="h6" color="text.secondary">
          {C.ourDegressDescription}
        </Typography>
      </Box>
      <Box
        sx={{
          width: { xs: "calc(100vw - 12px)", sm: "100%" },
          ml: { xs: "calc(50% - 50vw + 6px)", sm: 0 },
          boxSizing: "border-box",
          overflow: "hidden",
          "& .slick-slider": {
            width: "100%",
            touchAction: "pan-y",
          },
          "& .slick-list": {
            margin: { xs: 0, sm: "0 -10px" },
          },
          "& .slick-slide": {
            padding: { xs: "0 4px", sm: "0 10px" },
            boxSizing: "border-box",
            height: "auto",
            "& > div": {
              width: "100%",
              margin: 0,
            },
          },
        }}
      >
        <Slider
          {...settings}
          responsive={[]}
          slidesToShow={slidesToShow}
          swipe
          draggable
          beforeChange={() => {
            dragRef.current = true;
          }}
          afterChange={() => {
            setTimeout(() => {
              dragRef.current = false;
            }, 100);
          }}
        >
          {carreras.map((carrera) => {
            return (
              <Card
                //onClick={() => navigate(carrera.route)}
                sx={{
                  width: "200px",
                  objectFit: "cover",
                  display: "block",
                  height: { xs: 440, sm: 400 },
                  borderRadius: { xs: 3, sm: 5 },
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all .35s ease",
                  my: 2,
                  mx: 0,
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0 15px 25px rgba(0,0,0,.15)",
                  },
                  "&:hover .hover-overlay": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={carrera.img}
                  alt={carrera.alt}
                  title={carrera.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,

                    background:
                      "linear-gradient(to top, rgba(0,0,0,.95), rgba(0,0,0,.15))",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    color: "white",
                  }}
                >
                  <Typography
                    sx={{
                      my: 0,
                      opacity: 0.85,
                    }}
                  >
                    📚 {carrera.duracion}
                  </Typography>
                  <Typography mt={0.5} variant="h5" fontWeight={800}>
                    {carrera.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={1}
                    pb={1}
                    flexWrap="wrap"
                  >
                    {carrera.intereses.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,.15)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(0,0,0,.55)",
                    opacity: 0,
                    transition: "all .3s ease",
                  }}
                  onClick={() => {
                    if (dragRef.current) return;
                    navigate(carrera.route);
                  }}
                  className="hover-overlay"
                >
                  <SAETypography
                    variant="overline"
                    sx={{
                      color: "white",
                      letterSpacing: 1,
                    }}
                  >
                    {C.ourDegreesCaption}
                  </SAETypography>
                </Box>
              </Card>
            );
          })}
        </Slider>
      </Box>
    </section>
  );
}

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1400 }) {
  const elementRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasStarted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = window.setTimeout(() => setDisplayValue(value), 0);
      return () => window.clearTimeout(timeout);
    }

    let animationFrame;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, hasStarted, value]);

  return (
    <span ref={elementRef}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

function StatCard({ value, label, prefix, suffix }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 2.25, sm: 4 },
        bgcolor: "white",
        height: "100%",
        borderRight: "1px solid rgba(18, 54, 102, 0.08)",
        borderBottom: {
          xs: "1px solid rgba(18, 54, 102, 0.08)",
          sm: "none",
        },
      }}
    >
      <Typography
        variant="h4"
        color="#123666"
        fontWeight={800}
        fontSize={{ xs: "1.65rem", sm: "2.125rem" }}
      >
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </Typography>

      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

function EventSection() {
  
  return (
    <section key={"eventos"} id={"eventos"} style={{ scrollMarginTop: "20px" }}>
      <Box
        sx={{
          mt: { xs: 4, md: 12 },
        }}
      >
        <Box
          sx={{
            mt: { xs: 4, md: 10 },
            textAlign: "center",
            mb: { xs: 1, md: 6 },
          }}
        >
          <Typography variant="h2" fontWeight={700}>
            {C.eventsTitle}
          </Typography>

          <Typography variant="h6" color="text.secondary">
            {C.eventsDescription}
          </Typography>
        </Box>
        <CalendarEvent/>
      </Box>
    </section>
  );
}
function JourneySection() {
  const [selectedStep, setSelectedStep] = useState(0);
  const isMobile = useMediaQuery("(max-width:899px)");
  const stepRefs = useRef([]);
  const avatarRefs = useRef([]);

  useEffect(() => {
    if (!isMobile) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleStep = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleStep) {
          setSelectedStep(Number(visibleStep.target.dataset.journeyIndex));
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.05, 0.25, 0.5],
      },
    );

    stepRefs.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    avatarRefs.current[selectedStep]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [isMobile, selectedStep]);

  const goToMobileStep = (index) => {
    setSelectedStep(index);
    stepRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box
      textAlign="center"
      mb={{ xs: 5, md: 8 }}
      sx={{
        position: "relative",
        zIndex: 1,
        mt: { xs: 4, md: 10 },
        px: { xs: 0, md: 4 },
        py: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          mt: { xs: 7, md: 10 },
          textAlign: "center",
          mb: { xs: 3, md: 6 },
        }}
      >
        <Typography variant="h2" fontWeight={700}>
          {C.journeyTitle}
        </Typography>

        <Typography variant="h6" color="text.secondary">
          {C.journeyDescription}
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "sticky",
          top: 70,
          zIndex: 10,
          mt: 2,
          width: "100vw",
          ml: "calc(50% - 50vw)",
          px: 1.5,
          pt: 2,
          pb: 1.5,
          minHeight: 104,
          bgcolor: "rgba(248, 250, 253, 0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(18, 54, 102, 0.1)",
          boxShadow: "0 8px 18px rgba(18, 54, 102, 0.08)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: "auto",
            px: 1,
            py: 0.75,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {studentJourney.map((step, index) => (
            <Box
              key={index}
              ref={(element) => {
                avatarRefs.current[index] = element;
              }}
              onClick={() => goToMobileStep(index)}
              sx={{
                flex: "0 0 76px",
                cursor: "pointer",
              }}
            >
              <Avatar
                sx={{
                  mx: "auto",
                  width: 46,
                  height: 46,
                  bgcolor: selectedStep === index ? "#123666" : "#E8EEF5",
                  color: selectedStep === index ? "white" : "#123666",
                  transition: ".3s",
                  transform:
                    selectedStep === index ? "scale(1.08)" : "scale(1)",
                }}
              >
                {step.icon}
              </Avatar>
              <Typography
                mt={0.5}
                fontSize="0.72rem"
                fontWeight={selectedStep === index ? 700 : 500}
                noWrap
              >
                {step.title}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Box
          sx={{
            height: 3,
            mt: 0.5,
            width: `${((selectedStep + 1) / studentJourney.length) * 100}%`,
            bgcolor: "#123666",
            transition: ".4s",
          }}
        />
      </Box>

        <Stack spacing={3} sx={{ display: { xs: "flex", md: "none" }, mt: 3 }}>
          {studentJourney.map((step, index) => (
            <Box
              key={step.title}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              data-journey-index={index}
              sx={{ scrollMarginTop: "175px" }}
            >
              <JourneyDetailCard step={step} mobile />
            </Box>
          ))}
        </Stack>


      {/* Desktop: selector por clic y una única tarjeta activa */}
      <Box sx={{ display: { xs: "none", md: "block" }, mt: 8, mb: 8 }}>
        <Grid container direction="row" spacing={4}>
          {studentJourney.map((step, index) => (
            <Box
              key={index}
              onMouseEnter={() => setSelectedStep(index)}
              onClick={() => setSelectedStep(index)}
              sx={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                cursor: "pointer",
                flex: 1,
              }}
            >
              <Avatar
                sx={{
                  mx: "auto",
                  width: 70,
                  height: 70,
                  bgcolor: selectedStep === index ? "#123666" : "#E8EEF5",
                  color: selectedStep === index ? "white" : "#123666",
                  transition: ".3s",
                  transform:
                    selectedStep === index ? "scale(1.15)" : "scale(1)",
                }}
              >
                {step.icon}
              </Avatar>
              <Typography mt={2}>{step.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {step.subtitle}
              </Typography>
            </Box>
          ))}
        </Grid>
        <Box
          sx={{
            height: 6,
            my: 3,
            width: `${((selectedStep + 1) / studentJourney.length) * 100}%`,
            bgcolor: "#123666",
            transition: ".4s",
          }}
        />
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <JourneyDetailCard step={studentJourney[selectedStep]} />
      </Box>
    </Box>
  );
}

function JourneyDetailCard({ step, mobile = false }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        borderRadius: mobile ? 3 : 5,
        overflow: "hidden",
        boxShadow: mobile ? "0 10px 30px rgba(18, 54, 102, 0.12)" : undefined,
      }}
    >
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 5 }} m={0}>
          <Box
            component="img"
            src={step.image}
            alt={step.alt}
            sx={{
              width: "100%",
              height: mobile ? 210 : "100%",
              objectFit: "cover",
              transition: ".4s",
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }} m={0}>
          <Box p={mobile ? 2.5 : 5}>
            <Typography
              variant="h4"
              fontSize={mobile ? "1.65rem" : "2.125rem"}
              textAlign={mobile ? "left" : "center"}
            >
              {step.description}
            </Typography>
            <Box
              sx={{
                position: "relative",
                mt: 2,
                maxHeight: mobile && !expanded ? 185 : "none",
                overflow: "hidden",
                transition: "max-height .35s ease",
                "&::after":
                  mobile && !expanded
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 55,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(to bottom, transparent, white)",
                      }
                    : undefined,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  color: "black",
                  fontSize: mobile ? "1rem" : "1.25rem",
                  lineHeight: mobile ? 1.65 : 1.5,
                  textAlign: "left",
                }}
                dangerouslySetInnerHTML={{
                  __html: step.text,
                }}
              />
            </Box>
            {mobile && (
              <SAEButton
                onClick={() => setExpanded((current) => !current)}
                sx={{
                  mt: 1,
                  px: 0,
                  minWidth: 0,
                  fontWeight: 800,
                  textTransform: "none",
                  color: "#123666",
                }}
              >
                {expanded ? "Ver menos" : "Ver más"}
              </SAEButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
