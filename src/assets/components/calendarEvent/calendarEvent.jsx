import {
  Box,
  Stack,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Link,
  Typography,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SAEHorizontalCarousel from "../carousel/SAEHorizontalCarousel";
import { formatDate } from "../../../utils/date.utils";
const settingsSchedule = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3, // Cuántas tarjetas se ven en computadora
  slidesToScroll: 1,
  swipe: true,
  swipeToSlide: true,
  touchMove: true,
  draggable: true,
  responsive: [
    {
      breakpoint: 1024, // En pantallas medianas (tablets)
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

export function CalendarEvent({ eventos }) {
  const isDesktop = useMediaQuery("(min-width:1200px)", {
    noSsr: true,
  });
  const isTablet = useMediaQuery("(min-width:900px)", {
    noSsr: true,
  });
  const coursesSlidesToShow = Math.min(
    eventos.length || 1,
    isDesktop ? 3 : isTablet ? 2 : 1,
  );
  return (
    <Box
      sx={{
        py: { xs: 4, sm: 8 },
        px: { xs: 0, sm: 4 },
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        "& .slick-slider": {
          width: "100%",
          touchAction: "pan-y",
        },
        "& .slick-list": {
          margin: { xs: "0 -6px", sm: "0 -10px" },
        },
        "& .slick-slide": {
          padding: { xs: "0 6px", sm: "0 10px" },
          boxSizing: "border-box",
          height: "auto",
          "& > div": {
            width: "100%",
          },
        },
        "& .slick-slide > div": {
          padding: { xs: "0 4px", sm: "0 10px" },
          boxSizing: "border-box",
          height: "auto",
          "& > div": {
            width: "100%",
          },
        },
        ".slick-prev:before,.slick-next:before": {
          color: "black",
        },
      }}
    >
      {/* <Slider {...settingsSchedule} responsive={[]} slidesToShow={slidesToShow}>
        {eventos.map((evento) => {
          return (
            <EventoCard
              key={
                evento.id ?? `${evento.nombre_evento}-${evento.fecha_evento}`
              }
              evento={evento}
            ></EventoCard>
          );
        })}
      </Slider> */}
      <SAEHorizontalCarousel
        items={eventos}
        slidesToShow={coursesSlidesToShow}
        getKey={(evento) => evento.id || evento.nombre_evento}
        activeIndicatorColor="var(--primary)"
        indicatorColor="var(--textSecondary)"
        renderItem={(evento, index) => {
          return (
            <EventoCard key={evento.id || index} evento={evento}></EventoCard>
          );
        }}
      />
    </Box>
  );
}

function EventoCard({ evento }) {
  const scheduleLabel = evento.duracion
    ? `${evento.horario_inicio} - ${evento.duracion}`
    : evento.horario_inicio;

  return (
    <Card
      sx={{
        my: 2,
        minHeight: { xs: "auto", sm: 360 },
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "white",
        border: "1px solid rgba(18, 54, 102, 0.1)",
        boxShadow: "0 16px 42px rgba(21, 61, 113, 0.11)",
        transition: "transform .22s ease, box-shadow .22s ease",
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-4px)" },
          boxShadow: "0 24px 56px rgba(21, 61, 113, 0.17)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.25, sm: 3 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          color: "text.primary",
        }}
      >
        <Stack
          direction={{ xs: "row", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                borderRadius: 2.5,
                bgcolor: "rgba(48, 98, 172, 0.09)",
                color: "var(--primary)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <EventAvailableIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 13, color: "text.secondary", fontWeight: 700 }}
              >
                Fecha
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 17, sm: 18 },
                  fontWeight: 800,
                  color: "#123666",
                }}
              >
                {formatDate(evento.fecha_evento, "short")}
              </Typography>
            </Box>
          </Stack>
          <Chip
            icon={<AccessTimeIcon />}
            label={scheduleLabel}
            size="large"
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              height: 34,
              borderRadius: 2,
              bgcolor: "rgba(18, 54, 102, 0.08)",
              color: "#123666",
              fontWeight: 800,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        </Stack>

        <Typography
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.5, sm: 1.75 },
            borderRadius: 2.5,
            bgcolor: "#123666",
            fontSize: { xs: 21, sm: 24 },
            lineHeight: 1.18,
            fontWeight: 850,
            color: "white",
            textAlign: "center",
          }}
          mt={2.3}
        >
          {evento.nombre_evento}
        </Typography>

        <Box
          sx={{
            flexShrink: 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          mt={2.3}
        >
          <Stack sx={{ width: "100%" }}>
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
              sx={{
                flex: 1,
                minWidth: 0,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#f7f9fc",
                border: "1px solid rgba(17, 53, 101, 0.08)",
                width: "100%",
              }}
            >
              <PersonOutlineIcon
                sx={{ mt: 0.2, fontSize: 20, color: "var(--primary)" }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Expositor
                </Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 650,
                    color: "text.primary",
                    overflowWrap: "anywhere",
                  }}
                >
                  {evento.encargado}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ minHeight: "24px" }} mt={2.3}>
          <Link
            target="_blank"
            href={evento.lugar}
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              width: "100%",
              minHeight: 44,
              borderRadius: 2,
              bgcolor: "white",
              color: "var(--primary)",
              border: "1px solid rgba(48, 98, 172, 0.28)",
              fontWeight: 800,
              transition:
                "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(48, 98, 172, 0.08)",
                borderColor: "var(--primary)",
              },
            }}
          >
            <LocationOnIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Ver Ubicación en Maps
            </Typography>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
