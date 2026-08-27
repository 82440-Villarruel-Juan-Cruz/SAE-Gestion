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
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import { SAETypography } from "../../../assets/components/typography/SAETypography";
import { CalendarEvent } from "../../../assets/components/calendarEvent/calendarEvent";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJPA } from "../../context/sharedContext";
import { JPAProvider } from "../../context/providers/jpaProvider";
import { HashLink as Link } from "react-router-hash-link";

import Fab from "@mui/material/Fab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import BusinessIcon from "@mui/icons-material/Business";
import CampaignIcon from "@mui/icons-material/Campaign";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
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
  autoplaySpeed: 5000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
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
  autoplaySpeed: 1800,
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
    description:
      "Donde comienza tu vida universitaria, conociendo el campus, tus compañeros y la facultad.",
    text: "Tu etapa de ingreso es un momento emocionante y crucial en tu vida universitaria. Es el punto de partida donde comienzas a construir tu experiencia académica y social. Durante esta fase, tendrás la oportunidad de familiarizarte con el campus, conocer a tus compañeros de clase y establecer conexiones que pueden durar toda la vida. Además, es un momento para descubrir los recursos y servicios que la universidad ofrece para apoyarte en tu camino académico. Aprovechá al máximo esta etapa inicial, participando en actividades de bienvenida, explorando el campus y conectándote con otros estudiantes para comenzar tu aventura universitaria con el pie derecho.",
    image: `${baseUrl}images/infoSection/becasFRC.jpg`,
    alt: "Vista Afuera UTN",
  },
  {
    icon: <GroupsIcon />,
    title: "Inscripción",
    subtitle: "Como empezas a ser parte",
    description: "Todo lo que debes saber",
    text: "Comenzas a ser parte de la comunidad universitaria cuando realizas nuestro ingreso, para completar este proceso tenes que cumplir con una serie de requisitos como haber  <strong>finalizado el secundario, rendir un examen de ingreso y presentar la documentacion necesaria. </strong> Es posible que te preinscribas para rendir aun sin finalizar tus estudios pero te sera requisito una vez hayas realizado los examenes de ingreso, en la instancia de evaluacion deberas rendir <strong> Matematica, Fisica e Introduccion a la vida universitaria. </strong> El centro de estudiantes y la SAE proveen de cursos intensivos para que finalices tu formacion academica en estas 3 disciplinas. Acercate a nuestras charlas de ingreso para mas informacion.",
    image: `${baseUrl}images/journeyJPA/aulaMagnaFRC.jpg`,
    alt: "Aula Magna de la UTN",
  },
  {
    icon: <DocumentScannerIcon />,
    title: "Tramites",
    subtitle: "Documentación y certificados",
    description: "Informacion importante para simplificarte la vida.",
    text: "Una vez que ingreses y hayas aprobado los examenes de ingreso deberas realizar una serie de tramites para completar tu inscripcion, entre los cuales se encuentran la presentacion de tu <strong>documentacion personal, la eleccion de tu carrera y la inscripcion a materias.</strong> Uno de los tramites mas importantes para ser estudiante hecho y derecho corresponde al departamento de Alumnos y es indispensable que lo hagas antes de finalizar tu primer año de carrera. La secretaría de asuntos estudiantiles esta disponible para ayudarte a completar estos tramites y resolver cualquier duda que puedas tener durante este proceso, no dudes en acercarte para obtener asistencia personalizada.",
    image: `${baseUrl}images/infoSection/congresoFRC.webp`,
    alt: "Audtiorio de la UTN",
  },
  {
    icon: <SportsSoccerIcon />,
    title: "Vida UTN",
    subtitle: "Más que estudiar",
    description: "Ir a la UTN es mas que estudiar.",
    text: "Desde la secretaria de asuntos estudiantiles contamos con un area dedicada a la realización de deportes como actividad recreativa, en nuestra facultad contamos con deportes como:<strong> Futbol, Futbol sala, Voley, Basket, Natación, Arquería</strong> todos estos con sus respectivos entrenamientos para todos los generos. Ademas contamos con convenios con diferentes gimnasios para que puedas entrenar en tu dia a dia, ofreciendo descuentos especiales por ser alumno de nuestra Universidad. Si estas interesado en representar a la facultad dentro de las diferentes disciplinas deportivas podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para mas información.",
    image: `${baseUrl}images/infoSection/deportesFRC.webp`,
    alt: "Campus de la UTN",
  },
  {
    icon: <BusinessIcon />,
    title: "Industria",
    subtitle: "Conocé empresas",
    description: "Te acercamos a la realidad laboral.",
    text: "Las visitas a empresas son una excelente oportunidad para conocer la realidad del <strong>mundo laboral y establecer contactos con profesionales de la industria.</strong> Durante estas visitas, los estudiantes pueden aprender sobre las prácticas empresariales, las oportunidades de empleo y las tendencias del mercado. La secretaría en conjunto a diferentes catedras de la facultad organiza visitas a empresas de diversos sectores, brindando a los estudiantes la oportunidad de explorar diferentes industrias y <strong>conocer de primera mano las oportunidades laborales disponibles.</strong> Estas visitas son una parte importante de la experiencia universitaria, ya que permiten a los estudiantes conectar su formación académica con el mundo real y prepararse para su futura carrera profesional.",
    image: `${baseUrl}images/infoSection/visitasFRC.jpg`,
    alt: "Visita Guiada a Fabrica",
  },
  {
    icon: <CampaignIcon />,
    title: "Eventos",
    subtitle: "Congresos y charlas",
    description:
      "Participás en congresos, competencias y actividades académicas.",
    text: "Nuestra facultad organiza y participa en diversos congresos y eventos académicos a lo largo del año, brindando a los estudiantes la oportunidad de <strong>presentar sus trabajos, aprender de expertos en el campo y establecer contactos con profesionales de la industria.</strong> Estos eventos son una excelente oportunidad para ampliar tus conocimientos, compartir tus investigaciones y conectarte con la comunidad académica.  Un ejemplo de esto es el <strong>CNEISI</strong> que se realiza anualmente e incluye otras regionales del pais con eje en la ingeniería en sistemas.",
    image: `${baseUrl}images/infoSection/congresoFRC.webp`,
    alt: "Audtiorio de la UTN",
  },
  {
    icon: <WorkIcon />,
    title: "Pasantías",
    subtitle: "Becas y prácticas",
    description:
      "Aplicás tus conocimientos en proyectos y prácticas profesionales.",
    text: "En el area de becas de la secretaría se realiza la gestión de becas propias de la universidad y te ayudamos aplicar a becas de caracter nacional. La secretaría ofrece las siguientes becas: <strong>Beca de servicio, beca de ayuda economica y beca de investigación. </strong> Que lo economico no sea un impedimento para que puedas estudiar, desde el area nos interesa que puedas acceder a las mejores oportunidades para finalizar tus estudios de grado. Si estas intersado en aplicar a alguna de nuestras becas o como pedir/mantener otras becas estatales podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para obtener mas información.",
    image: `${baseUrl}images/navbar/inchaUTN.png`,
    alt: "Edificio de la UTN",
  },
  {
    icon: <EmojiEventsIcon />,
    title: "Graduación",
    subtitle: "Meta cumplida",
    description: "Obtenés tu título y celebrás el esfuerzo realizado.",
    text: "Después de años de dedicación y esfuerzo, llega el momento de la graduación, un hito significativo en tu vida universitaria. Es el momento en el que obtienes tu título y celebras todo lo que has logrado durante tu carrera. La graduación no solo marca el final de una etapa, sino también el comienzo de nuevas oportunidades y desafíos en tu vida profesional. Es un momento para reflexionar sobre tu viaje académico, agradecer a quienes te apoyaron y mirar hacia el futuro con entusiasmo y confianza.<br/><br/> <strong>¡Felicitamos a todos nuestros ingenieros formados en esta casa de altos estudios publica de calidad y gratuita!</strong>",
    image: `${baseUrl}images/journeyJPA/aulaMagnaFRC.jpg`,
    alt: "Aula Magna de la UTN",
  },
];
const carreras = [
  {
    title: "Ing. Sistemas de Información",
    img: `${baseUrl}images/degreesJPA/ingenieriaSistemas.jpeg`,
    route: "/JPA/sistemas",
    duracion: "5 años",
    intereses: ["Software", "IA", "Datos"],
  },
  {
    title: "Ing. Electrica",
    img: `${baseUrl}images/degreesJPA/ingenieriaElectrica.jpg`,
    route: "/JPA/electrica",
    duracion: "6 años",
    intereses: ["Centrales", "Tecnologias Renovables", "Red Electrica"],
  },
  {
    title: "Ing. Quimica",
    img: `${baseUrl}images/degreesJPA/ingenieriaQuimica.jpg`,
    route: "/JPA/quimica",
    duracion: "5 años",
    intereses: ["Cerveza", "Centrales Electricas", "Seguridad"],
  },

  {
    title: "Ing. Metalurgica",
    img: `${baseUrl}images/degreesJPA/ingenieriaMetalurgica.jpg`,
    route: "/JPA/metalurgica",
    duracion: "5 años",
    intereses: ["Materiales", "Construccion", "Espadas"],
  },

  {
    title: "Ing. Electronica",
    img: `${baseUrl}images/degreesJPA/ingenieriaElectronica.jpg`,
    route: "/JPA/electronica",
    duracion: "6 años",
    intereses: ["Robotica", "IoT", "Automatizacion"],
  },
  {
    title: "Ing. Civil",
    img: `${baseUrl}images/degreesJPA/ingenieriaCivil.jpg`,
    route: "/JPA/civil",
    duracion: "5 años",
    intereses: ["Construccion", "Reconocimiento", "Progreso Edilicio"],
  },
  {
    title: "Ing. Industrial",
    img: `${baseUrl}images/degreesJPA/ingenieriaIndustrial.jpg`,
    route: "/JPA/industrial",
    duracion: "5 años",
    intereses: [
      "Mejoras de Proceso",
      "Plantas Automatizadas",
      "Gestion de Recursos",
    ],
  },
  {
    title: "Ing. Mecanica",
    img: `${baseUrl}images/degreesJPA/ingenieriaMecanica2.jpg`,
    route: "/JPA/mecanica",
    duracion: "5 años",
    intereses: ["Produccion", "Autopartes", "Nuevas Piezas"],
  },
];
const heroCarrousel = [
  `${baseUrl}images/carrousel/AuditorioUTN.jpeg`,
  `${baseUrl}images/carrousel/EntradaUTN.jpg`,
  `${baseUrl}images/carrousel/estacionamientoUTN.jpg`,
  `${baseUrl}images/carrousel/FedeOlivos.jpeg`,
  `${baseUrl}images/degreesJPA/ingenieriaSistemas.jpeg`,
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
                  height: { xs: "55vh", lg: "75vh" },
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
                        bgcolor: "var(--chipBackground)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        fontWeight: 600,
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

                    <SAETypography variant="subtitle1" color="white">
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
        maxWidth="lg"
        sx={{
          mt: { xs: 2, sm: -3 },
          position: "relative",
          zIndex: 5,
          px: { xs: 2, sm: 3 },
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
                  alt={carrera.title}
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
  const { eventosJPA, loadingEventos } = useJPA();
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

        {loadingEventos && (
          <Stack alignItems="center" width={"100%"} gap={1}>
            <SAESpinner size="S" />
          </Stack>
        )}
        {!loadingEventos && eventosJPA && (
          <CalendarEvent eventos={eventosJPA} />
        )}
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
              {step.title}
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
