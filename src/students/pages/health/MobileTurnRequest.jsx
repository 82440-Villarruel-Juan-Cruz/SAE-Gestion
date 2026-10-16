import {
  Alert,
  Box,
  ButtonBase,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import { formatDate } from "../../../utils/date.utils";
import { HEALTH_STRINGS as C } from "../../../utils/strings/student.strings";

export default function MobileTurnRequest({
  data,
  schedules,
  selectedKey,
  usedKeys,
  getScheduleKey,
  formatSchedule,
  availabilities,
  formatAvailability,
  minTime,
  maxTime,
  error,
  onSelect,
  onChange,
  onAdd,
  onRemove,
}) {
  const selectedAlreadyAdded = usedKeys.has(selectedKey);

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          {C.selectedSpecialty}
        </Typography>
        <Typography variant="h5" fontWeight={800} color="var(--secondary)">
          {data.nombre_especialidad}
        </Typography>
        <Typography component="div" variant="caption" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
          Legajo: {data.legajo}
        </Typography>
        <Typography component="div" variant="caption" color="text.secondary">
          Fecha de solicitud: {formatDate(data.fecha_solicitud, "short")}
        </Typography>
      </Box>

      <Stack spacing={1.25}>
        <Typography component="h2" variant="subtitle1" fontWeight={800}>
          1. Elegí cuándo podés asistir
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Elegí una franja y agregala a tu solicitud. Podés agregar varias.
        </Typography>
        {schedules.length === 0 && (
          <Alert severity="info">No hay horarios disponibles para esta especialidad.</Alert>
        )}
        {schedules.map((schedule) => {
          const key = getScheduleKey(schedule);
          const selected = key === selectedKey;
          const added = usedKeys.has(key);

          return (
            <ButtonBase
              key={key}
              onClick={() => onSelect(schedule)}
              aria-pressed={selected}
              sx={{
                width: "100%", minHeight: 56, p: 1.5, gap: 1,
                justifyContent: "space-between", textAlign: "left",
                border: "2px solid", borderRadius: 2,
                borderColor: selected ? "#477EAF" : "#DCE7F5",
                bgcolor: selected ? "#E7F1FF" : "white",
                "&.Mui-focusVisible": { outline: "3px solid #153b6f", outlineOffset: 2 },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700}>{formatSchedule(schedule)}</Typography>
                {added && <Typography variant="caption" color="text.secondary">Agregada a tu solicitud</Typography>}
              </Box>
              {(selected || added) && <CheckCircleIcon sx={{ color: "#477EAF", flexShrink: 0 }} />}
            </ButtonBase>
          );
        })}
        {selectedKey && !selectedAlreadyAdded && (
          <Stack spacing={1.5} sx={{ p: 1.5, bgcolor: "#F3F7FC", borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              Podés ajustar las horas dentro de esta franja.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <SAETimeField label="Desde" value={data.horario_disponible_desde}
                  onChange={(value) => onChange("horario_disponible_desde", value)}
                  minTime={minTime} maxTime={maxTime} size="big" fullWidth readOnly />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <SAETimeField label="Hasta" value={data.horario_disponible_hasta}
                  onChange={(value) => onChange("horario_disponible_hasta", value)}
                  minTime={minTime} maxTime={maxTime} size="big" fullWidth readOnly />
              </Box>
            </Stack>
            <SAEButton variant="outlined" startIcon={<AddIcon />} fullWidth onClick={onAdd} sx={{ minHeight: 48 }}>
              Agregar esta disponibilidad
            </SAEButton>
          </Stack>
        )}
        {error && <Alert severity="error" role="alert">{error}</Alert>}
      </Stack>

      <Box sx={{ p: 1.5, bgcolor: "#F3F7FC", borderRadius: 2, border: "1px solid #DCE7F5" }}>
        <Typography variant="subtitle2" fontWeight={800}>
          {availabilities.length > 0 ? `Disponibilidades agregadas (${availabilities.length})` : "Todavía no agregaste disponibilidad"}
        </Typography>
        {availabilities.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tocá «Agregar esta disponibilidad» para incluir la franja elegida.
          </Typography>
        )}
        {availabilities.map((availability, index) => (
          <Stack key={availability.horario_seleccionado ?? index} direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
            <CheckCircleIcon fontSize="small" sx={{ color: "#477EAF" }} />
            <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>{formatAvailability(availability)}</Typography>
            <IconButton aria-label={`Quitar ${formatAvailability(availability)}`} onClick={() => onRemove(index)} sx={{ minWidth: 44, minHeight: 44, color: "#b93636" }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        ))}
      </Box>

      <Stack spacing={1.25}>
        <Typography component="h2" variant="subtitle1" fontWeight={800}>
          2. Contanos el motivo
        </Typography>
        <SAETextField label={C.yourSympthoms} value={data.asunto}
          onChange={(event) => onChange("asunto", event.target.value)}
          multiline fullWidth rows={3} />
      </Stack>
      <Alert severity="info">{C.turnCancellationDisclaimer}</Alert>
    </Stack>
  );
}
