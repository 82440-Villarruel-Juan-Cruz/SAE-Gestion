import { Box, CardContent, Typography, Card, CardActions } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Masonry from "@mui/lab/Masonry";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import { useMemo, useState } from "react";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import { completeWeekDays } from "../../../utils/common/constants";

function horariosToTexto(horarios) {
  if (!Array.isArray(horarios) || horarios.length === 0) return "";

  // Agrupa por rango horario
  const grupos = {};
  horarios.forEach((h) => {
    const key = `${h.hora_inicio}-${h.hora_fin}`;
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(h.dia);
  });

  // Invierto el agrupamiento: para cada día, guardo su rango
  const diasPorRango = Object.entries(grupos).map(([rango, dias]) => ({
    rango,
    dias: dias.sort((a, b) => a - b),
  }));

  // Ahora agrupo por días que tengan el mismo rango
  // Pero para mostrar: Horario: Lunes y Miércoles de 10:00 a 12:00 / Viernes de 14:00 a 16:00
  const partes = diasPorRango.map(({ rango, dias }) => {
    const diasNombres = dias.map((d) => completeWeekDays[d]);
    let diasTexto = "";
    if (diasNombres.length === 1) {
      diasTexto = diasNombres[0];
    } else if (diasNombres.length === 2) {
      diasTexto = diasNombres[0] + " y " + diasNombres[1];
    } else {
      diasTexto =
        diasNombres.slice(0, -1).join(", ") +
        " y " +
        diasNombres[diasNombres.length - 1];
    }
    const [hora_inicio, hora_fin] = rango.split("-");
    const horaInicioSinSegundos = hora_inicio.slice(0, 5);
    const horaFinSinSegundos = hora_fin.slice(0, 5);
    return (
      <span key={rango}>
        {diasTexto} de {horaInicioSinSegundos} a {horaFinSinSegundos}
      </span>
    );
  });

  // Une todos los textos con " / "
  return (
    <>
      {partes.reduce(
        (prev, curr, idx) => (idx === 0 ? [curr] : [prev, " / ", curr]),
        null,
      )}
    </>
  );
}

function profesoresToTexto(profesores) {
  if (!Array.isArray(profesores) || profesores.length === 0) return null;
  // Filtra profesores únicos por cuil_docente
  const unicos = [];
  const cuils = new Set();
  for (const p of profesores) {
    if (p.cuil_docente && !cuils.has(p.cuil_docente)) {
      unicos.push(p);
      cuils.add(p.cuil_docente);
    }
  }

  return (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {unicos.map((p, idx) => (
        <li key={p.cuil_docente || idx}>
          <Typography variant="body1">{p.docente_responsable}</Typography>
        </li>
      ))}
    </ul>
  );
}

function horariosPorUbicacionToTexto(ubicaciones) {
  if (!Array.isArray(ubicaciones) || ubicaciones.length === 0) return null;

  return (
    <>
      {ubicaciones.map((ubicacion, idx) => (
        <Box
          key={ubicacion.id_espacio_deportivo || idx}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "44px 1fr", sm: "36px 1fr" },
            gap: { xs: 1.5, sm: 1 },
            mt: idx ? { xs: 1.75, sm: 1.25 } : 0,
          }}
        >
          <Box
            sx={(theme) => ({
              width: { xs: 44, sm: 36 },
              height: { xs: 44, sm: 36 },
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "var(--primary)",
            })}
          >
            <LocationOnOutlinedIcon />
          </Box>
          <Box>
            <Link
              underline="none"
              color="inherit"
              href={ubicacion.url_map_espacio_deportivo}
              rel="noopener noreferrer"
              target="_blank"
              sx={{
                color: "var(--secondary)",
              }}
            >
              <Typography variant="subtitle1">
                {ubicacion.espacio_deportivo}
              </Typography>
            </Link>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mt: 0.25,
                color: "var(--primary)",
              }}
            >
              <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography component="div" variant="body2">
                {horariosToTexto(ubicacion.horarios)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

function agruparHorariosPorDeporte(arr) {
  const map = new Map();
  arr.forEach((item) => {
    // Creamos una clave única con los campos que NO son horarios ni id

    const key = JSON.stringify({
      id_deporte: item.id_deporte,
      id_inscripcion: item.id_inscripcion,
    });

    if (!map.has(key)) {
      map.set(key, {
        id_deporte: item.id_deporte,
        deporte: item.deporte,
        esta_inscripto: item.esta_inscripto,
        id_inscripcion: item.id_inscripcion,
        horarios: [],
        ubicacion: [],
        horariosPorUbicacion: [],
        profesores: [],
      });
    }
    const deporteAgrupado = map.get(key);

    deporteAgrupado.horarios.push({
      dia: item.dia,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin,
    });

    deporteAgrupado.ubicacion.push({
      id_espacio_deportivo: item.id_espacio_deportivo,
      espacio_deportivo: item.espacio_deportivo,
      url_map_espacio_deportivo: item.url_map_espacio_deportivo,
    });

    let ubicacion = deporteAgrupado.horariosPorUbicacion.find(
      (grupo) => grupo.id_espacio_deportivo === item.id_espacio_deportivo,
    );

    if (!ubicacion) {
      ubicacion = {
        id_espacio_deportivo: item.id_espacio_deportivo,
        espacio_deportivo: item.espacio_deportivo,
        url_map_espacio_deportivo: item.url_map_espacio_deportivo,
        horarios: [],
      };
      deporteAgrupado.horariosPorUbicacion.push(ubicacion);
    }

    ubicacion.horarios.push({
      dia: item.dia,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin,
    });

    deporteAgrupado.profesores.push({
      cuil_docente: item.cuil_docente,
      docente_responsable: item.docente_responsable,
    });
  });
  return Array.from(map.values());
}

export default function DeportesMasonry({ deportes, onInscribirClick }) {
  const agrupado = useMemo(
    () => agruparHorariosPorDeporte(deportes),
    [deportes],
  );
  const [filtro, setFiltro] = useState(null);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [openDialogIndex, setOpenDialogIndex] = useState(null); // Guardar el índice de la tarjeta seleccionada

  const filtroActivo =
    filtro ??
    (agrupado.some((d) => d.esta_inscripto === true) ? "inscriptos" : "todos");

  // Filtrado según el botón seleccionado
  const agrupadoFiltrado = agrupado.filter((card) => {
    const coincideFiltro =
      filtroActivo === "todos" ||
      (filtroActivo === "inscriptos" && card.esta_inscripto === true) ||
      (filtroActivo === "noinscriptos" && card.esta_inscripto === false);

    const texto = textoBusqueda.trim().toLowerCase();

    const deporte = card.deporte?.toLowerCase() || "";
    const ubicacion = card.ubicacion
      .map((item) => item.espacio_deportivo?.toLowerCase() || "")
      .join(" ");
    const profesores = card.profesores
      .map((item) => item.docente_responsable?.toLowerCase() || "")
      .join(" ");

    const coincideTexto =
      texto.length < 3 ||
      deporte.includes(texto) ||
      ubicacion.includes(texto) ||
      profesores.includes(texto);

    return coincideFiltro && coincideTexto;
  });

  const handleOpen = (index) => {
    setOpenDialogIndex(index); // Almacenar el índice de la tarjeta que se abre
  };

  const handleClose = () => {
    setOpenDialogIndex(null); // Cerrar el diálogo (resetear el índice)
  };

  const handleInscripcion = async (id_deporte) => {
    const item = agrupado.find((e) => e.id_deporte === id_deporte);
    if (!item) return;

    try {
      handleClose();
      await onInscribirClick(item);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          background: "var(--gradient)",
        }}
      >
        {/* IZQUIERDA */}
        <Box
          display="flex"
          gap={{ xs: 1, sm: 2 }}
          sx={{
            width: { xs: "100%", md: "auto" },
            overflowX: { xs: "auto", md: "visible" },
            pb: { xs: 0.5, md: 0 },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& > button": {
              flex: { xs: "1 0 auto", md: "initial" },
              whiteSpace: "nowrap",
            },
          }}
        >
          <SAEButton
            variant={filtroActivo === "todos" ? "contained" : "outlined"}
            onClick={() => setFiltro("todos")}
            sx={
              filtroActivo === "todos"
                ? undefined
                : {
                    bgcolor: "transparent",
                    color: "white",
                    borderColor: "white",
                  }
            }
          >
            Todos
          </SAEButton>
          <SAEButton
            variant={filtroActivo === "inscriptos" ? "contained" : "outlined"}
            onClick={() => setFiltro("inscriptos")}
            sx={
              filtroActivo === "inscriptos"
                ? undefined
                : {
                    bgcolor: "transparent",
                    color: "white",
                    borderColor: "white",
                  }
            }
          >
            Inscriptos
          </SAEButton>
          <SAEButton
            variant={filtroActivo === "noinscriptos" ? "contained" : "outlined"}
            onClick={() => setFiltro("noinscriptos")}
            sx={
              filtroActivo === "noinscriptos"
                ? undefined
                : {
                    bgcolor: "transparent",
                    color: "white",
                    borderColor: "white",
                  }
            }
          >
            No inscriptos
          </SAEButton>
        </Box>

        {/* DERECHA */}
        <SAETextField
          size="small"
          placeholder="Busqueda..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          sx={{
            minWidth: 250,
            width: {
              xs: "100%",
              md: 300,
            },
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.12)",
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& input::placeholder": {
              color: "rgba(255,255,255,0.7)",
              opacity: 1,
            },
            "& .MuiInputAdornment-root svg": {
              color: "rgba(255,255,255,0.7)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Masonry
        spacing={{ xs: 2, sm: 3, md: 2 }}
        columns={{ xs: 1, sm: 2, md: 4 }}
        sx={{
          mx: { xs: 0, sm: undefined },
          py: { xs: 2, sm: 0 },
          px: { xs: 2, sm: 0 },
          width: { xs: "100%", sm: "auto" },
          boxSizing: "border-box",
          "@media (max-width: 599px)": {
            display: "flex !important",
            flexFlow: "row nowrap !important",
            gap: "14px",
            height: "auto !important",
            overflowX: "auto",
            alignItems: "stretch",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: "16px",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& > *": {
              width: "min(86vw, 360px) !important",
              maxWidth: "360px",
              flex: "0 0 min(86vw, 360px)",
              scrollSnapAlign: "start",
              margin: "0 !important",
            },
          },
        }}
      >
        {agrupadoFiltrado.map((card, index) => (
          <Grid
            spacing={10}
            size={{ xs: 12, sm: 4, md: 4 }}
            key={card.id_deporte ?? index}
          >
            <Card
              sx={{
                borderRadius: 4,
                minHeight: { xs: "auto", sm: 330 },
                px: 0,
                py: 0,
                m: { xs: 0, sm: 1 },
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: "0 18px 45px rgba(21, 61, 113, 0.14)",
                border: "1px solid rgba(17, 53, 101, 0.1)",
                transition: "transform .25s ease, box-shadow .25s ease",
                "&:hover": {
                  transform: { xs: "none", sm: "translateY(-5px)" },
                  boxShadow: {
                    xs: "0 18px 45px rgba(21, 61, 113, 0.14)",
                    sm: "0 24px 55px rgba(21, 61, 113, 0.22)",
                  },
                },
              }}
            >
              <CardContent
                sx={{
                  p: 0,
                  flex: "1 1 auto",
                  "&:last-child": { pb: 0 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: { xs: 2.25, sm: 1.25 },
                    color: "white",
                    background:
                      "linear-gradient(135deg, var(--primary), var(--lightBlue))",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 52, sm: 36 },
                      height: { xs: 52, sm: 36 },
                      borderRadius: { xs: "50%", sm: 0 },
                      display: "grid",
                      placeItems: "center",
                      background: {
                        xs: "rgba(255,255,255,.18)",
                        sm: "transparent",
                      },
                      color: "var(--whiteText)",
                      flexShrink: 0,
                      boxShadow: "none",
                      transform: "none",
                    }}
                  >
                    <SportsBasketballIcon
                      sx={{ fontSize: { xs: 28, sm: 32 } }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: { xs: 22, sm: 16.5, md: 17 },
                        fontWeight: 800,
                        lineHeight: 1.05,
                      }}
                      variant="h5"
                    >
                      {card.deporte}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 0,
                    px: { xs: 2.25, sm: 1.75 },
                    pt: { xs: 2.25, sm: 1.5 },
                    pb: { xs: 1.5, sm: 0.75 },
                    "& .MuiTypography-subtitle1": {
                      fontSize: { sm: "0.92rem" },
                    },
                    "& .MuiTypography-body2": {
                      fontSize: { sm: "0.78rem" },
                    },
                  }}
                >
                  {horariosPorUbicacionToTexto(card.horariosPorUbicacion)}
                </Box>

                <Box
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    mt: { xs: 0, sm: 2 },
                    pt: { xs: 2, sm: 1.25 },
                    mx: { xs: 2.25, sm: 1.75 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, sm: 0.5 },
                      color: "var(--secondary)",
                    }}
                  >
                    <GroupsRoundedIcon sx={{ fontSize: { xs: 24, sm: 18 } }} />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: { xs: "1rem", sm: "0.82rem" },
                        fontWeight: 700,
                      }}
                    >
                      Profesores
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "var(--secondary)",
                      fontSize: { xs: 14, sm: 12.5 },
                      mt: 0.5,
                      "& ul": { mb: 0 },
                      "& li::marker": { color: "primary.main" },
                    }}
                  >
                    {profesoresToTexto(card.profesores)}
                  </Box>
                </Box>
              </CardContent>
              <CardActions
                sx={{
                  mt: "auto",
                  p: { xs: 2.25, sm: 1.25 },
                  pt: { xs: 1, sm: 1 },
                  flexShrink: 0,
                }}
              >
                <SAEButton
                  size="medium"
                  variant="contained"
                  startIcon={
                    card.esta_inscripto === false ? <AddIcon /> : <CancelIcon />
                  }
                  onClick={() => handleOpen(index)} // Abrir el diálogo específico del card
                  color={card.esta_inscripto === false ? "primary" : "error"}
                  fullWidth
                  sx={{
                    minHeight: 42,
                    px: 1.5,
                    whiteSpace: "normal",
                    lineHeight: 1.15,
                    "& .MuiButton-startIcon": {
                      mr: 0.75,
                      flexShrink: 0,
                    },
                  }}
                >
                  {card.esta_inscripto === false
                    ? "Inscribir"
                    : "Desinscribirte"}
                </SAEButton>
                <Dialog
                  open={openDialogIndex === index}
                  onClose={() => handleClose()}
                  sx={{ borderRadius: 6 }}
                >
                  <DialogTitle>{card.deporte}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Estas seguro que te vas a{" "}
                      {card.esta_inscripto === false
                        ? "Inscribir"
                        : "Desinscribirte"}{" "}
                      de {card.deporte}?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <SAEButton
                      fullWidth
                      onClick={() => handleInscripcion(card.id_deporte)}
                      variant="contained"
                      color={
                        card.esta_inscripto === false ? "primary" : "error"
                      }
                      startIcon={
                        card.esta_inscripto === false ? (
                          <CheckIcon />
                        ) : (
                          <CancelIcon />
                        )
                      }
                      autoFocus
                    >
                      {card.esta_inscripto === false
                        ? "Inscribirse"
                        : "Desincribirse"}
                    </SAEButton>
                  </DialogActions>
                </Dialog>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Masonry>
    </Box>
  );
}
