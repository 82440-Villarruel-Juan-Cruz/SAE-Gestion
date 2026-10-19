import { Box, Stack, Typography, Chip, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/sharedContext"; 

export default function HeaderPageEmployed({
  header,
  title,
  description,
  backgroundImage = "images/headers/initial.webp",
  hideBackButton = false,
  backTo = "/Inicio",
  chips = null,
  showUserChips = true,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL;
  const getPerfilName = (id) => {
    if (id === undefined || id === null) return null; // Para manejar el ?? "-" externo

    switch (id) {
      case 0:
        return "Interesado";
      case 1:
        return "Estudiante";
      case 2:
        return "Empleado";
      case 5:
        return "Administrador";
      default:
        return "Desconocido";
    }
  };
  return (
    <>
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: 6,
          position: "relative",
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 5 },
          mb: 4,
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          backgroundImage: `url('${baseUrl}${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          "&::before": {
            content: '""',
            position: "absolute",
            borderRadius: 6,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--lightBlue) 100%)",
            opacity: 0.8,
            zIndex: 1,
          },
          "& > *": { position: "relative", zIndex: 2 },
        }}
      >
        <Box sx={{ maxWidth: 700 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 0.5 }}
          >
            {!hideBackButton && (
              <IconButton
                size="small"
                aria-label="Volver"
                onClick={() => navigate(backTo)}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography
              variant="overline"
              sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
            >
              {header}
            </Typography>
          </Stack>
          <Typography
            variant="h3"
            sx={{
              mt: 1,
              fontWeight: 800,
              lineHeight: 1.1,
              fontSize: { xs: "2rem", md: "2.6rem" },
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              mt: 2,
              maxWidth: 520,
              fontSize: { xs: 15, md: 17 },
              opacity: 0.92,
            }}
          >
            {description}
          </Typography>
          {(chips?.length > 0 || showUserChips) && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              flexWrap="wrap"
              gap={1.5}
              sx={{ mt: 3 }}
            >
              {chips?.map((chip, index) => (
                <Chip
                  key={`${chip.label}-${index}`}
                  size={chip.size}
                  label={chip.label}
                  color={chip.color}
                  sx={{
                    bgcolor: chip.bgcolor || "var(--chipBackground)",
                    color: chip.color ? undefined : "white",
                    fontWeight: 700,
                    border: chip.border,
                    ...chip.sx,
                  }}
                />
              ))}
              {showUserChips && (
                <>
                  <Chip
                    label={`Perfil ${getPerfilName(user?.id_perfil) ?? "-"}`}
                    sx={{
                      bgcolor: "var(--chipBackground)",
                      color: "white",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={user?.legajo ? `Legajo ${user.legajo}` : "Sesion activa"}
                    sx={{
                      bgcolor: "var(--chipBackground)",
                      color: "white",
                      fontWeight: 700,
                    }}
                  />
                </>
              )}
            </Stack>
          )}
        </Box>
        <Box
          component="img"
          src={`${baseUrl}images/principal/logoUTNrotado.png`}
          alt="UTN Logo"
          sx={{
            display: { xs: "none", md: "block" },
            width: { xs: 85, md: 180 },
            height: { xs: 85, md: 180 },
            opacity: 0,
            animation:
              "spinIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards",
            "@keyframes spinIn": {
              from: { opacity: 0, transform: "rotate(-360deg) scale(0.4)" },
              to: { opacity: 1, transform: "rotate(0deg) scale(1)" },
            },
          }}
        />
      </Box>
    </>
  );
}
