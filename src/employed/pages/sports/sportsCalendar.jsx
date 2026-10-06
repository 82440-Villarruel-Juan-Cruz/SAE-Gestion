import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import { calendarDays } from "../../../utils/common/constants";
import { toTimeInput } from "../../../utils/date.utils";
import { SPORTS_STRINGS } from "../../../utils/strings/employed.strings";
import { isEmpty } from "../../../utils/text.utils";
import { useSports } from "../../context/employedContext";

const C = SPORTS_STRINGS;

const START_HOUR = 8;
const END_HOUR = 23;
const HOUR_HEIGHT = 40;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;
const TIME_COL_WIDTH = 54;
const DAY_COL_MIN_WIDTH = 128;
const MIN_EVENT_HEIGHT = 28;

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

const CALENDAR_CARD_SX = {
  borderRadius: 4,
  boxShadow: "0 18px 45px rgba(21,61,113,0.08)",
  overflow: "hidden",
};

const calendarGridColumns = `${TIME_COL_WIDTH}px repeat(${calendarDays.length}, minmax(${DAY_COL_MIN_WIDTH}px, 1fr))`;
const calendarMinWidth = TIME_COL_WIDTH + calendarDays.length * DAY_COL_MIN_WIDTH;

function parseMinutes(time = "") {
  const [hours = 0, minutes = 0] = String(time).split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

function hasValidText(value) {
  return !isEmpty(value) && String(value).trim() !== "0";
}

function layoutEvents(events) {
  const sortedEvents = events
    .map((event) => ({
      ...event,
      _start: parseMinutes(event.hora_inicio),
      _end: parseMinutes(event.hora_fin),
    }))
    .sort((a, b) => a._start - b._start || b._end - a._end);

  const columnEnds = [];
  const eventsWithColumns = sortedEvents.map((event) => {
    let column = columnEnds.findIndex((end) => end <= event._start);

    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(event._end);
    } else {
      columnEnds[column] = event._end;
    }

    return { ...event, col: column };
  });

  return eventsWithColumns.map((event) => {
    const numCols =
      eventsWithColumns
        .filter(
          (other) => other._start < event._end && other._end > event._start,
        )
        .reduce((max, other) => Math.max(max, other.col), 0) + 1;

    return { ...event, numCols };
  });
}

function groupEventsByDay(events) {
  const eventsByDay = Object.fromEntries(
    calendarDays.map((day) => [day.value, []]),
  );

  events.forEach((event) => {
    if (eventsByDay[event.dia]) eventsByDay[event.dia].push(event);
  });

  return Object.fromEntries(
    Object.entries(eventsByDay).map(([day, dayEvents]) => [
      day,
      layoutEvents(dayEvents),
    ]),
  );
}

async function loadHorarios(deportes, obtenerHorariosXDeporte) {
  const schedules = await Promise.all(
    deportes.map((deporte) =>
      obtenerHorariosXDeporte(deporte.id).catch(() => []),
    ),
  );

  return schedules.flat();
}

function useSportsSchedule(subscribedSportIds) {
  const { obtenerDeportesActivos, obtenerHorariosXDeporte } = useSports();
  const [deportes, setDeportes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSchedule() {
      setLoading(true);
      setError("");

      try {
        const activeSports = await obtenerDeportesActivos();
        if (cancelled) return;

        const sportSchedules = await loadHorarios(
          activeSports,
          obtenerHorariosXDeporte,
        );
        if (cancelled) return;

        setDeportes(activeSports);
        setHorarios(sportSchedules);
      } catch (err) {
        if (!cancelled) setError(err.message || C.errorScheduleLoad);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSchedule();

    return () => {
      cancelled = true;
    };
  }, [obtenerDeportesActivos, obtenerHorariosXDeporte]);

  const subscribedIds = useMemo(
    () => new Set((subscribedSportIds ?? []).map(Number)),
    [subscribedSportIds],
  );

  const colorBySportId = useMemo(
    () =>
      Object.fromEntries(
        deportes.map((deporte, index) => [
          deporte.id,
          PALETTE[index % PALETTE.length],
        ]),
      ),
    [deportes],
  );

  const visibleHorarios = useMemo(() => {
    if (selected === "mine") {
      return horarios.filter((horario) =>
        subscribedIds.has(Number(horario.id_deporte)),
      );
    }

    if (selected === null) return horarios;

    return horarios.filter((horario) => horario.id_deporte === selected);
  }, [horarios, selected, subscribedIds]);

  const eventsByDay = useMemo(
    () => groupEventsByDay(visibleHorarios),
    [visibleHorarios],
  );

  return {
    colorBySportId,
    deportes,
    error,
    eventsByDay,
    loading,
    selected,
    setSelected,
  };
}

function ScheduleFilters({
  deportes,
  selected,
  setSelected,
  subscribedSportIds,
}) {
  return (
    <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
      {/* <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          color: "#5a6f8f",
          fontWeight: 600,
          fontSize: "0.75rem",
        }}
      >
        {C.scheduleFilter}
      </Typography> */}

      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        <Chip
          icon={<SportsSoccerIcon />}
          label={C.scheduleAll}
          variant={selected === null ? "filled" : "outlined"}
          color={selected === null ? "primary" : "default"}
          onClick={() => setSelected(null)}
          sx={{ fontWeight: selected === null ? 700 : 400 }}
        />

        {subscribedSportIds !== null && (
          <Chip
            icon={<EventAvailableIcon />}
            label={C.scheduleStudent}
            variant={selected === "mine" ? "filled" : "outlined"}
            color={selected === "mine" ? "primary" : "default"}
            onClick={() => setSelected(selected === "mine" ? null : "mine")}
            sx={{ fontWeight: selected === "mine" ? 700 : 400 }}
          />
        )}

        {deportes.map((deporte, index) => (
          <SportFilterChip
            key={deporte.id}
            color={PALETTE[index % PALETTE.length]}
            deporte={deporte}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </Stack>

      {deportes.length > 0 && selected === null && (
        <ColorLegend deportes={deportes} />
      )}
    </CardContent>
  );
}

function SportFilterChip({ color, deporte, selected, setSelected }) {
  const active = selected === deporte.id;

  return (
    <Chip
      label={deporte.nombre}
      onClick={() => setSelected(active ? null : deporte.id)}
      sx={{
        fontWeight: active ? 700 : 400,
        bgcolor: active ? color : "transparent",
        color: active ? "#fff" : color,
        border: "1px solid",
        borderColor: color,
        "&:hover": { bgcolor: active ? color : `${color}22` },
        transition: "background-color 0.15s",
      }}
    />
  );
}

function ColorLegend({ deportes }) {
  return (
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
      {deportes.map((deporte, index) => (
        <Stack
          key={deporte.id}
          direction="row"
          alignItems="center"
          spacing={0.6}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "3px",
              bgcolor: PALETTE[index % PALETTE.length],
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "#5a6f8f", fontSize: "0.72rem" }}
          >
            {deporte.nombre}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function ScheduleState({ error, loading }) {
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 5 }}>
        <SAESpinner size="S" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return null;
}

function CalendarGrid({ colorBySportId, eventsByDay }) {
  const [activeEventId, setActiveEventId] = useState(null);
  const hourLabels = useMemo(
    () =>
      Array.from({ length: TOTAL_HOURS }, (_, index) => START_HOUR + 1 + index),
    [],
  );
  const hourLineOffsets = useMemo(
    () =>
      Array.from(
        { length: TOTAL_HOURS - 1 },
        (_, index) => (index + 1) * HOUR_HEIGHT,
      ),
    [],
  );

  return (
    <ClickAwayListener onClickAway={() => setActiveEventId(null)}>
      <Box sx={{ minWidth: calendarMinWidth }}>
        <CalendarHeader />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: calendarGridColumns,
          }}
        >
          <TimeColumn hourLabels={hourLabels} />

          {calendarDays.map((day) => (
            <DayColumn
              key={day.value}
              activeEventId={activeEventId}
              colorBySportId={colorBySportId}
              day={day}
              events={eventsByDay[day.value] ?? []}
              hourLineOffsets={hourLineOffsets}
              onEventActivate={setActiveEventId}
            />
          ))}
        </Box>
      </Box>
    </ClickAwayListener>
  );
}

function CalendarHeader() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: calendarGridColumns,
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
            py: { xs: 1.25, sm: 1 },
            textAlign: "center",
            borderLeft: "1px solid #dde6f5",
            bgcolor: "transparent",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "#153b6f",
              fontSize: { xs: "0.86rem", sm: "0.8rem" },
              lineHeight: 1.1,
            }}
          >
            {day.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function TimeColumn({ hourLabels }) {
  return (
    <Box
      sx={{
        position: "relative",
        height: TOTAL_HEIGHT,
        bgcolor: "#fff",
        borderRight: "1px solid #dde6f5",
      }}
    >
      {hourLabels.map((hour, index) => (
        <Box
          key={hour}
          sx={{
            position: "absolute",
            top: (index + 1) * HOUR_HEIGHT - 9,
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
            {toTimeInput(`${hour}:00`)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function DayColumn({
  activeEventId,
  colorBySportId,
  day,
  events,
  hourLineOffsets,
  onEventActivate,
}) {
  return (
    <Box
      sx={{
        position: "relative",
        height: TOTAL_HEIGHT,
        borderLeft: "1px solid #dde6f5",
        bgcolor: "#fafcff",
      }}
    >
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

      {events.map((event) => (
        <CalendarEvent
          key={event.id}
          active={activeEventId === event.id}
          color={colorBySportId[event.id_deporte] || PALETTE[0]}
          event={event}
          onActivate={onEventActivate}
        />
      ))}
    </Box>
  );
}

function CalendarEvent({ active, color, event, onActivate }) {
  const startMin = parseMinutes(event.hora_inicio);
  const endMin = parseMinutes(event.hora_fin);
  const top = (startMin - START_HOUR * 60) * (HOUR_HEIGHT / 60);
  const height = Math.max(
    (endMin - startMin) * (HOUR_HEIGHT / 60),
    MIN_EVENT_HEIGHT,
  );

  return (
    <Tooltip
      arrow
      open={active}
      placement="top"
      title={<EventTooltip event={event} />}
    >
      <Box
        onClick={(eventClick) => {
          eventClick.stopPropagation();
          onActivate(event.id);
        }}
        onFocus={() => onActivate(event.id)}
        onMouseEnter={() => onActivate(event.id)}
        onMouseLeave={() => onActivate(null)}
        onTouchStart={(touchEvent) => {
          touchEvent.stopPropagation();
          onActivate(event.id);
        }}
        role="button"
        tabIndex={0}
        sx={{
          position: "absolute",
          top: top + 1,
          left: `calc(${(event.col / event.numCols) * 100}% + 2px)`,
          width: `calc(${(1 / event.numCols) * 100}% - 4px)`,
          height: height - 2,
          bgcolor: color,
          color: "#fff",
          borderRadius: 1.5,
          px: 0.8,
          py: 0.3,
          overflow: "hidden",
          cursor: "pointer",
          zIndex: active ? 3 : 2,
          opacity: active ? 0.9 : 1,
          boxShadow: active
            ? "0 4px 14px rgba(0,0,0,0.26)"
            : "0 2px 8px rgba(0,0,0,0.18)",
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
          {event.nombre_deporte}
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
            {toTimeInput(event.hora_inicio)} – {toTimeInput(event.hora_fin)}
          </Typography>
        )}

        {height > 56 && hasValidText(event.espacio_deportivo) && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: "0.62rem",
              lineHeight: 1.2,
              opacity: 0.85,
            }}
            noWrap
          >
            {event.espacio_deportivo}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

function EventTooltip({ event }) {
  return (
    <Box sx={{ p: 0.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 0.25 }}>
        {event.nombre_deporte}
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", mb: 0.25 }}>
        {toTimeInput(event.hora_inicio)} – {toTimeInput(event.hora_fin)}
      </Typography>
      {hasValidText(event.espacio_deportivo) && (
        <Typography sx={{ fontSize: "0.75rem", mb: 0.25 }}>
          {event.espacio_deportivo}
        </Typography>
      )}
      {hasValidText(event.docente_responsable) && (
        <Typography sx={{ fontSize: "0.75rem" }}>
          {event.docente_responsable}
        </Typography>
      )}
    </Box>
  );
}

export default function SportsCalendar({
  embedded = false,
  subscribedSportIds = null,
}) {
  const {
    colorBySportId,
    deportes,
    error,
    eventsByDay,
    loading,
    selected,
    setSelected,
  } = useSportsSchedule(subscribedSportIds);

  const content = (
    <>
      <ScheduleFilters
        deportes={deportes}
        selected={selected}
        setSelected={setSelected}
        subscribedSportIds={subscribedSportIds}
      />

      <Box
        sx={{
          borderTop: "1px solid #e3eaf4",
          overflowX: "auto",
          overflowY: "hidden",
          p: { xs: 1, sm: 2 },
          pt: { xs: 1.5, sm: 2 },
        }}
      >
        <ScheduleState error={error} loading={loading} />

        {!loading && !error && (
          <CalendarGrid
            colorBySportId={colorBySportId}
            eventsByDay={eventsByDay}
          />
        )}
      </Box>
    </>
  );

  if (embedded) return content;

  return <Card sx={CALENDAR_CARD_SX}>{content}</Card>;
}
