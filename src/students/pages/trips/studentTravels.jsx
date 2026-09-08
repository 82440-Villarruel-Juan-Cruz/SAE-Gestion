import {
  Avatar,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAuth } from "../../../shared/context/sharedContext";
import React, { useState, useEffect, useRef } from "react";
import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/studentContext";
import { HashLink as Link } from "react-router-hash-link";

import SAEPage from "../../../assets/components/page/SAEPage";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import DocumentCard from "../../../assets/components/documents/DocumentCard";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import TitleBox from "../../../assets/components/titleBox";
import StudentHeaderPage from "../../../assets/components/headerPage/headerPageStudent.jsx";

import { TRIPS_STRINGS } from "../../../utils/strings/student.strings"; 
import { TRAVEL_REQUIRED_DOCUMENTS } from "../../../utils/common/common.config"; 
//import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.BASE_URL;
const C = TRIPS_STRINGS;
const TRAVELS_INFORMATION = [
  {
    id: "cneisi",
    category: "Sistemas",
    question: "CNEISI",
    answer:
      "El CNEISI (Congreso Nacional de Estudiantes de Ingeniería en Sistemas de Información) es un evento académico y tecnológico organizado por y para estudiantes de la Universidad Tecnológica Nacional (UTN) en Argentina. Históricamente, el congreso rota de sede entre las distintas Facultades Regionales de la UTN. Para conocer detalles sobre futuras sedes, cronogramas y convocatorias, te sugiero seguir las actualizaciones oficiales en la página del CNEISI en la UTN Facultad Regional Villa María o revisar los perfiles oficiales del congreso en redes sociales.",
  },
  {
    id: "reyunos",
    category: "Civil",
    question: "Los Reyunos",
    answer:
      "En Los Reyunos, un espectacular embalse de aguas turquesas ubicado a solo 35 km de la ciudad de San Rafael (Mendoza), puedes disfrutar de un día lleno de aventura y relax. Las actividades principales incluyen deportes náuticos (kayak, paddle surf, windsurf), paseos en catamarán o lancha, tirolesa, rappel y pesca deportiva.",
  },
  {
    id: "vaca-muerta",
    category: "Química",
    question: "Explotación de YPF",
    answer:
      "No solo es un viaje para química sino que incluye otras carreras, como civil y mecánica. YPF es la compañía pionera, principal inversora y mayor operadora en el yacimiento de Vaca Muerta. La petrolera nacional descubrió el potencial de esta formación en 2011 y hoy concentra allí la mayor parte de su estrategia para convertir a Argentina en un polo exportador mundial de gas y petróleo. ",
  },
  {
    id: "electrica",
    category: "Eléctrica",
    question: "Visitas EPEC",
    answer:
      "La Central Nuclear Embalse es una planta de generación nucleoeléctrica ubicada en la costa sur del lago Ministro Pistarini, a unos 4 km de la ciudad de Embalse, Córdoba. La UTN (Universidad Tecnológica Nacional) frecuentemente organiza visitas técnicas a sus instalaciones para estudiantes de carreras de ingeniería.",
  },
];
const tarjetas = [
    {
      id: 1,
      titulo: "Viaje a Jujuy",
      desc: "El Cerro de los Siete Colores es un espectacular accidente geográfico ubicado en Purmamarca, provincia de Jujuy, Argentina. Su singular paleta tonal se formó hace millones de años por la sedimentación de minerales. Es el gran atractivo del noroeste argentino y se puede recorrer a pie todo el año.",
      color: "#1a73e8",
      image: `${baseUrl}images/travels/CerroColores.jpeg`,
    },
    {
      id: 2,
      titulo: "Viaje a Perito Moreno",
      desc: "El Glaciar Perito Moreno es una de las maravillas naturales más imponentes del mundo. Ubicado dentro del Parque Nacional Los Glaciares (provincia de Santa Cruz, Argentina), destaca por su fácil acceso, sus impresionantes paredes de hielo de hasta 70 metros de altura y sus constantes desprendimientos.",
      color: "#f4b400",
      image: `${baseUrl}images/travels/peritoMoreno.jpg`,
    },
    {
      id: 3,
      titulo: "Viaje a las Cataratas",
      desc: "Las Cataratas del Iguazú son una de las Siete Maravillas Naturales del Mundo. Conformadas por 275 saltos de agua, el 80% se encuentra del lado argentino y el 20% en el lado brasileño. Su mayor atractivo es la imponente Garganta del Diablo, con una caída de 82 metros",
      color: "#0f9d58",
      image: `${baseUrl}images/travels/cataratas.jpeg`,
    },
    {
      id: 4,
      titulo: "Viaje a Bariloche",
      desc: "Bariloche es conocida por su arquitectura al estilo alpino de Suiza y su chocolate, que se vende en tiendas de la calle Mitre, la avenida principal. También es una base popular para el excursionismo y el esquí en las montañas cercanas, y para explorar los alrededores del Distrito de los Lagos.",
      color: "#212121",
      image: `${baseUrl}images/travels/bariloche.jpg`,
    },
    {
      id: 6,
      titulo: "Viaje a los Reyunos",
      desc: "Los Reyunos es un imponente embalse artificial ubicado en San Rafael, Mendoza, a unos 35 km (40 minutos en auto) de la ciudad homónima. Destaca por sus aguas turquesas rodeadas de cerros y es famoso por su oferta de deportes acuáticos, aventura y complejos turísticos.",
      color: "#CF6ED1",
      image: `${baseUrl}images/travels/losreyunos.jpeg`,
    },
  ];
export default function StudentTravels() {
  return (
    <TravelProvider>
      <StudentTravelContent />
    </TravelProvider>
  );
}

function StudentTravelContent() {
  const { user } = useAuth();
  const {
    travelsLegajo,
    loadingTravel,
    fetchTravelsLegajo,
    documentosParaMostrar,
    loadingDocumentos,
  } = useTravel();
  const hasPendingRequiredDocuments = documentosParaMostrar.some(
    (documento) => documento.required && !documento.subido,
  );

  useEffect(() => {
    fetchTravelsLegajo(user.legajo);
  }, [fetchTravelsLegajo, user]);

  return (
    <SAEPage>
      <StudentHeaderPage
        title={C.headerTitle}
        description={C.headerDescription}
        backgroundImage="images/carrousel/EntradaUTN.jpg"
        icon={LocalAirportIcon}
      />
      {!loadingTravel &&
        !loadingDocumentos &&
        travelsLegajo?.length > 0 &&
        hasPendingRequiredDocuments && (
        <NotificacionEstudiante />
      )}
      <CarrouselVertical />
      <TravelDocumentsSection />
      <InformationSection />
    </SAEPage>
  );
}
function NotificacionEstudiante() {
  //const navigate = useNavigate();
  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg,#FFF8E1 0%,#FFECB3 100%)",
        border: "1px solid #FFD54F",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#FFD54F",
                color: "#123666",
              }}
            >
              <AssignmentIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700} color="#123666">
                {C.documentationTitle}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {C.documentationAclaration}
              </Typography>
            </Box>
          </Stack>
          {/*<SAEButton
            variant="contained"
            onClick={()=>navigate("/Mi-Perfil")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "#123666",
              "&:hover": {
                bgcolor: "#0E2D55",
              },
            }}
          >
            Revisar documentación
          </SAEButton>*/}
          <Link
            to="/Mis-Viajes#Documentacion"
            style={{ textDecoration: "none" }}
          >
            <SAEButton
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#123666",
                "&:hover": {
                  bgcolor: "#0E2D55",
                },
              }}
            >
              {C.documentationButton}
            </SAEButton>
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
}
function CarrouselVertical() {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const isMobile = useMediaQuery("(max-width:599px)");
  const isTablet = useMediaQuery("(max-width:1024px)");
  const sliderRef = useRef(null);

  const ALTURA_TARJETA = isMobile ? 400 : isTablet? 350: 500;

  const settings = {
    dots: false,
    infinite: false,
    vertical: !isMobile,
    verticalSwiping: false,
    swipe: isMobile,
    draggable: isMobile,
    touchMove: isMobile,
    slidesToShow: isMobile ? 1 : indiceActivo + 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setIndiceActivo(next),
  };
  const handlePrev = () => {
    setIndiceActivo((prev) => (prev === 0 ? tarjetas.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndiceActivo((prev) => (prev === tarjetas.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isMobile) sliderRef.current?.slickGoTo(indiceActivo);
  }, [indiceActivo, isMobile]);

  return (
    <Box
      sx={{
        width: "100%",
        margin: "0",
        pt: 4,
        touchAction: "pan-y",
        overflow: "hidden",
      }}
    >
      {/* Contenedor del mazo de cartas */}
      <Box
        sx={{
          height: { xs: ALTURA_TARJETA, sm: ALTURA_TARJETA + 80 },
          
          position: "relative",
          "& .slick-list": {
            overflow: "hidden",
            touchAction: "pan-y",
          },
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {tarjetas.map((item, index) => {
            const yaPaso = index > indiceActivo;
            const esActiva = index === indiceActivo;

            let desplazamientoY = 0;
            let escala = 1;
            let zIndex = tarjetas.length;
            let MX = isMobile? 2:0;
            if (yaPaso) {
              const lugaresMovidos = indiceActivo - index;
              desplazamientoY =
                lugaresMovidos * ALTURA_TARJETA -
                lugaresMovidos * 25 +
                index * 12;
            } else if (esActiva) {
              zIndex = 10;
              desplazamientoY = index * ALTURA_TARJETA * 0.99;
              escala = 1;
            } else {
              zIndex = index;
              desplazamientoY = index * ALTURA_TARJETA * 1.002;
              escala = 1 - 0.05 * (1 / index);
            }
            if (index === 0 && indiceActivo > 0) escala = 0.93;
            return (
              <Box key={item.id} sx={{ outline: "none" }} padding={MX}>
                <Card
                  elevation={esActiva ? 6 : 4}
                  onClick={() => {
                    if (esActiva) {
                      window.open(
                        "https://www.argentina.gob.ar/migraciones/museo-de-la-inmigracion/galeria-de-fotos",
                        "_blank",
                      );
                    } else {
                      setIndiceActivo(index);
                    }
                  }}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                    display: "block",
                    height: ALTURA_TARJETA,
                    borderRadius: 5,
                    transform: isMobile
                      ? "none"
                      : `translateY(-${desplazamientoY}px) scale(${escala})`,
                    transformOrigin: "top center",
                    zIndex: zIndex,
                    overflow: "hidden",
                    cursor: esActiva ? "pointer" : "cursor",
                    position: "relative",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": esActiva
                      ? {
                          boxShadow: "0 15px 15px rgba(0,0,0,.15)",
                        }
                      : "",
                    "&:hover .hover-overlay": esActiva
                      ? {
                          opacity: 1,
                        }
                      : "",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.titulo}
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
                      p: { xs: 2.5, sm: 4 },
                      color: "white",
                    }}
                  >
                    <Typography
                      mt={0.5}
                      variant="h5"
                      fontWeight={800}
                      fontSize={{ xs: "1.35rem", sm: "1.5rem" }}
                    >
                      {item.titulo}
                    </Typography>
                    <Typography
                      mt={0.5}
                      variant="body2"
                      fontWeight={300}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: { xs: 5, sm: "unset" },
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.desc}
                    </Typography>
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
                    className="hover-overlay"
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        letterSpacing: 1,
                      }}
                    >
                      {C.travelCardMessage}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Slider>
      </Box>

      <Stack
        sx={{
          zIndex: 20,
          backgroundColor: "transparent",
          borderRadius: 2,
          mt:{xs:4,md:-2},
          position: "relative",
        }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <IconButton onClick={handlePrev}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Stack direction="row" spacing={1.5}>
          {tarjetas.map((_, index) => (
            <Box
              key={index}
              onClick={() => setIndiceActivo(index)}
              sx={{
                width: indiceActivo === index ? 42 : 12,
                cursor: indiceActivo !== index ? "pointer" : "cursor",
                height: 12,
                borderRadius: 20,
                bgcolor:
                  indiceActivo === index
                    ? "var(--primary)"
                    : "var(--textSecondary)",
                transition: "all .3s ease",
              }}
            />
          ))}
        </Stack>

        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
function TravelDocumentsSection() {
  const {
    loadingTravel,
    travelsLegajo,
    closePreview,
    handlePreview,
    handleArchivoChange,
    requestDeleteDocument,
    documentosParaMostrar,
    loadingDocumentos,
    documentoAEliminar,
    openPopup,
    closeDeleteDialog,
    handleDelete,
    preview,
  } = useTravel();

  return (
    <>
      {!loadingTravel && travelsLegajo.length > 0 && (
        <section id="Documentacion">
          <TitleBox
            title={C.myDocumentTitle}
            description={C.myDocumentSubtitle}
          />
          {loadingDocumentos ? (
            <Stack alignItems="center" sx={{ py: 5 }}>
              <SAESpinner size="S" />
            </Stack>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {documentosParaMostrar.map((item) => (
                <Grid
                  key={item.id_tipo_documento ?? item.nombre}
                  size={{ xs: 12, sm: 6, md: 4 }}
                  sx={{ justifyContent: "center", alignItems: "center" }}
                >
                  <DocumentCard
                    documento={item}
                    onPreview={handlePreview}
                    onFileChange={handleArchivoChange}
                    onDelete={requestDeleteDocument}
                    uploadDisabled={item.subido}
                    deleteDisabled={!item.subido}
                    notUploadedLabel={C.docStateNotUploaded}
                    uploadedLabel={C.docStataUplodaded}
                    showRequirement
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </section>
      )}
      <Dialog open={openPopup} onClose={closeDeleteDialog}>
        <DialogTitle>{C.deleteDocTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {C.deleteDocMessage(documentoAEliminar?.archivoNombre)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SAEButton onClick={() => handleDelete(documentoAEliminar)} autoFocus>
            {C.deleteDocButton}
          </SAEButton>
        </DialogActions>
      </Dialog>
      <DocumentPreviewDialog
        open={preview.open}
        onClose={closePreview}
        title={preview.title}
        imageSrc={preview.imageSrc}
        isPdf={preview.isPdf}
        loading={preview.loading}
        error={preview.error}
      />
    </>
  );
}
function InformationSection() {
  return (
    <Box>
      <TitleBox
        title={C.faqsTitle}
        description={C.faqsDescription}
      />

      {TRAVELS_INFORMATION.map((faq) => (
        <Accordion
          key={faq.id}
          disableGutters
          sx={{
            mb: 1.5,
            borderRadius: "12px !important",
            border: "1px solid rgba(17, 53, 101, 0.08)",
            boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip label={faq.category} size="small" variant="outlined" />
              <Typography fontWeight={700}>{faq.question}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
