import { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";

import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useHealth } from "../../context/employedContext";
import { calendarDays } from "../../../utils/common/constants"; 
import { HEALTH_STRING } from "../../../utils/strings/employed.strings";

const HOUR_HEIGHT = 36; // px per hour
const START_HOUR = 8; //AM
const END_HOUR = 22; //PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 16
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;
const TIME_COL_WIDTH = 40; // px
const WEEKEND = new Set([0, 6]); // dia values for Sat/Sun
const C = HEALTH_STRING;
const PALETTE = [
  "#1565C0",
  "#2E7D32",
  "#B71C1C",
  "#E65100",
  "#6A1B9A",
  "#00838F",
  "#AD1457",
  "#558B2F",
  "#4527A0",
  "#00695C",
];

//#region Cosas que creo que van en utils
function parseMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  return (
    Number.parseInt(parts[0], 10) * 60 + (Number.parseInt(parts[1], 10) || 0)
  );
}

function fmtHour(h) {
  return `${String(h).padStart(2, "0")}:00`;
}

function fmtTime(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}
//#endregion

function layoutEvents(events) {
  if (events.length === 0) return [];
  const sorted = events
    .map((ev) => ({
      ...ev,
      _start: parseMinutes(ev.hora_inicio),
      _end: parseMinutes(ev.hora_fin),
    }))
    .sort((a, b) => a._start - b._start || b._end - a._end);
  const colEnds = [];
  const withCol = sorted.map((ev) => {
    let col = colEnds.findIndex((end) => end <= ev._start);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(ev._end);
    } else {
      colEnds[col] = ev._end;
    }
    return { ...ev, col };
  });
  return withCol.map((ev) => {
    const numCols =
      withCol
        .filter((o) => o._start < ev._end && o._end > ev._start)
        .reduce((max, o) => Math.max(max, o.col), 0) + 1;
    return { ...ev, numCols };
  });
}

export function EmployedCalendar({ embedded = false }) {
  const {
    selectedEmploy,
    setSelectedEmploy,
    personal,
    loadingPersonal,
    allHorarios,
    loadingHorarios,
    dialogError,
  } = useHealth();

  const colorOf = useMemo(() => {
    const map = {};
    personal.forEach((d, i) => {
      // CLAVE: Usamos el cuil como clave para poder buscarlo fácilmente después
      map[d.cuil] = PALETTE[i % PALETTE.length];
    });
    return map;
  }, [personal]);

  const visibleHorarios = useMemo(
    () =>
      selectedEmploy === null
        ? allHorarios
        : allHorarios.filter((h) => h.cuil_especialista === selectedEmploy),
    [allHorarios, selectedEmploy],
  );
  const byDay = useMemo(() => {
    const map = calendarDays.reduce((acc, day) => {
      acc[day.value] = [];
      return acc;
    }, {});

    visibleHorarios.forEach((horario) => {
      if (map[horario.dia]) {
        map[horario.dia].push(horario);
      }
    });

    return Object.fromEntries(
      Object.entries(map).map(([diaId, eventosDelDia]) => [
        diaId,
        layoutEvents(eventosDelDia),
      ]),
    );
  }, [visibleHorarios]);

  const hourLabels = useMemo(
    () => Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + 1 + i),
    [],
  );

  // hour grid line positions (i = 1 … TOTAL_HOURS-1, skip top/bottom edges)
  const hourLineOffsets = useMemo(
    () =>
      Array.from({ length: TOTAL_HOURS - 1 }, (_, i) => (i + 1) * HOUR_HEIGHT),
    [],
  );

  return (
    <Box>
      {/* Filter chips */}
      <Card
        sx={{
          borderRadius: embedded ? 0 : 3,
          boxShadow: embedded ? "none" : "0 18px 45px rgba(21,61,113,0.08)",
          mb: embedded ? 0 : 2,
          borderTop: embedded ? "1px solid #e3eaf4" : "none",
        }}
      >
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              color: "#5a6f8f",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            {C.scheduleFilter}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<MedicalServicesIcon />}
              label={C.scheduleAll}
              variant={selectedEmploy === null ? "filled" : "outlined"}
              color={selectedEmploy === null ? "primary" : "default"}
              onClick={() => setSelectedEmploy(null)}
              sx={{ fontWeight: selectedEmploy === null ? 700 : 400 }}
            />
            {personal.map((e, i) => {
              const c = PALETTE[i % PALETTE.length];
              const active = selectedEmploy === e.cuil;

              return (
                <Chip
                  key={i}
                  label={e.apellido + ", " + e.nombre}
                  onClick={() => setSelectedEmploy(active ? null : e.cuil)}
                  sx={{
                    fontWeight: active ? 700 : 400,
                    bgcolor: active ? c : "transparent",
                    color: active ? "#fff" : c,
                    border: "1px solid",
                    borderColor: c,
                    "&:hover": { bgcolor: active ? c : `${c}22` },
                    transition: "background-color 0.15s",
                  }}
                />
              );
            })}
          </Stack>

          {/* Color legend */}
          {personal.length > 0 && (
            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                gap: 1,
                mt: 1.5,
                pt: 1.5,
                borderTop: "1px solid #e3eaf4",
              }}
            >
              {personal.map((e, i) => (
                <Stack
                  key={e.cuil}
                  direction="row"
                  alignItems="center"
                  spacing={0.6}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "3px",
                      bgcolor: PALETTE[i % PALETTE.length],
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#5a6f8f", fontSize: "0.72rem" }}
                  >
                    {e.apellido + ", " + e.nombre}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {loadingHorarios && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loadingHorarios && dialogError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {dialogError}
        </Alert>
      )}

      {!loadingHorarios && !loadingPersonal && !dialogError && (
        <Card
          sx={{
            borderRadius: embedded ? 0 : 4,
            boxShadow: embedded ? "none" : "0 18px 45px rgba(21,61,113,0.08)",
            borderTop: embedded ? "1px solid #e3eaf4" : "none",
            overflowX: "auto",
            p: embedded ? { xs: 1, sm: 2 } : 0,
            pt: embedded ? { xs: 1.5, sm: 2 } : 0,
          }}
        >
          <Box sx={{ minWidth: TIME_COL_WIDTH + calendarDays.length * 90 }}>
            {/* Header row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${calendarDays.length}, 1fr)`,
                borderBottom: "2px solid #dde6f5",
                bgcolor: "#fff",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Box />
              {calendarDays.map((day) => (
                <Box
                  key={day.value}
                  sx={{
                    py: 1,
                    textAlign: "center",
                    borderLeft: "1px solid #dde6f5",
                    bgcolor: WEEKEND.has(day.value)
                      ? "#b2c7e71c"
                      : "transparent",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "#153b6f",
                      fontSize: "0.8rem",
                    }}
                  >
                    {day.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Body grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${calendarDays.length}, 1fr)`,
              }}
            >
              {/* Time labels column */}
              <Box
                sx={{
                  position: "relative",
                  height: TOTAL_HEIGHT,
                  bgcolor: "#fff",
                  borderRight: "1px solid #dde6f5",
                }}
              >
                {hourLabels.map((h, i) => (
                  <Box
                    key={h}
                    sx={{
                      position: "absolute",
                      top: (i + 1) * HOUR_HEIGHT - 9,
                      right: 6,
                      left: 0,
                      textAlign: "right",
                      pointerEvents: "none",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8fa3c0",
                        fontWeight: 600,
                        fontSize: "0.68rem",
                      }}
                    >
                      {fmtHour(h)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Day columns */}
              {calendarDays.map((day) => (
                <Box
                  key={day.value}
                  sx={{
                    position: "relative",
                    height: TOTAL_HEIGHT,
                    borderLeft: "1px solid #dde6f5",
                    bgcolor: WEEKEND.has(day.value) ? "#b2c7e71c" : "#fafcff",
                  }}
                >
                  {/* Hour grid lines */}
                  {hourLineOffsets.map((offset) => (
                    <Box
                      key={offset}
                      sx={{
                        position: "absolute",
                        top: offset,
                        left: 0,
                        right: 0,
                        borderTop: "1px solid #e8eef8",
                        pointerEvents: "none",
                      }}
                    />
                  ))}

                  {/* Events */}
                  {byDay[day.value].map((ev, index) => {
                    const startMin = parseMinutes(ev.hora_inicio);
                    const endMin = parseMinutes(ev.hora_fin);
                    const top =
                      (startMin - START_HOUR * 60) * (HOUR_HEIGHT / 60);
                    const height = Math.max(
                      (endMin - startMin) * (HOUR_HEIGHT / 60),
                      28,
                    );
                    const c = colorOf[ev.cuil_especialista] || PALETTE[index];

                    return (
                      <Tooltip
                        key={ev.id}
                        placement="top"
                        arrow
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                mb: 0.25,
                              }}
                            >
                              {ev.especialista}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", mb: 0.25 }}>
                              {fmtTime(ev.hora_inicio)} – {fmtTime(ev.hora_fin)}
                            </Typography>
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: top + 1,
                            left: `calc(${(ev.col / ev.numCols) * 100}% + 2px)`,
                            width: `calc(${(1 / ev.numCols) * 100}% - 4px)`,
                            height: height - 2,
                            bgcolor: c,
                            color: "#fff",
                            borderRadius: 1.5,
                            px: 0.8,
                            py: 0.3,
                            overflow: "hidden",
                            cursor: "default",
                            zIndex: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                            transition: "opacity 0.15s, box-shadow 0.15s",
                            "&:hover": {
                              opacity: 0.88,
                              boxShadow: "0 4px 14px rgba(0,0,0,0.26)",
                              zIndex: 3,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              display: "block",
                              lineHeight: 1.3,
                              fontSize: "0.7rem",
                            }}
                            noWrap
                          >
                            {ev.especialista}
                          </Typography>
                          {height > 38 && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                fontSize: "0.62rem",
                                lineHeight: 1.2,
                                opacity: 0.92,
                              }}
                              noWrap
                            >
                              {fmtTime(ev.hora_inicio)} – {fmtTime(ev.hora_fin)}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
}
