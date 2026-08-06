import { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";

import { useSports } from "../../context/employedContext";
import { calendarDays } from "../../../utils/common/constants";
import { toApiTime, toTimeInput } from "../../../utils/date.utils";
import { EMPTY_SCHEDULE } from "../../../utils/common/common.config";
import { SPORTS_STRINGS } from "../../../utils/strings/employed.strings";
import { isEmpty } from "../../../utils/text.utils";

const C = SPORTS_STRINGS;

const hasAssignedValue = (value) =>
  !isEmpty(value) && String(value).trim() !== "0";

const headerChipSx = {
  bgcolor: "rgba(255,255,255,0.22)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.7rem",
};

const getDayLabel = (day) =>
  calendarDays.find((calendarDay) => calendarDay.value === day)?.label ||
  "Día no encontrado";

const getTimeRangeLabel = (startTime, endTime) =>
  `${toTimeInput(startTime) || "--:--"} - ${toTimeInput(endTime) || "--:--"}`;

const isTimeBefore = (startTime, endTime) =>
  Boolean(startTime && endTime) && startTime < endTime;

const validateHorarioForm = (form) => {
  const errors = {};

  if (isEmpty(form.dia)) {
    errors.dia = C.scheduleValidationDay;
  }

  if (isEmpty(form.hora_inicio)) {
    errors.hora_inicio = C.scheduleValidationStartTime;
  }

  if (isEmpty(form.hora_fin)) {
    errors.hora_fin = C.scheduleValidationEndTime;
  }

  if (
    form.hora_inicio &&
    form.hora_fin &&
    !isTimeBefore(form.hora_inicio, form.hora_fin)
  ) {
    errors.hora_fin = C.scheduleValidationEndTimeAfterStart;
  }

  if (isEmpty(form.id_espacio_deportivo)) {
    errors.id_espacio_deportivo = C.scheduleValidationPlace;
  }

  if (isEmpty(form.cuil_docente)) {
    errors.cuil_docente = C.scheduleValidationTeacher;
  }

  return errors;
};

const getConflictFieldErrors = () => ({
  dia: C.scheduleValidationConflictDay,
  hora_inicio: C.scheduleValidationConflictTime,
  hora_fin: C.scheduleValidationConflictTime,
  id_espacio_deportivo: C.scheduleValidationConflictAssignment,
  cuil_docente: C.scheduleValidationConflictAssignment,
});

const isConflictError = (error) =>
  String(error?.message ?? error)
    .toLowerCase()
    .includes("conflict");

function HorarioFormFields({
  form,
  errors = {},
  onChange,
  espacios,
  docentes,
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl size="small" fullWidth error={Boolean(errors.dia)}>
          <InputLabel>Día</InputLabel>
          <Select
            value={form.dia}
            label="Día"
            onChange={(e) => onChange("dia", e.target.value)}
          >
            {calendarDays.map((d) => (
              <MenuItem key={d.value} value={d.value}>
                {d.label}
              </MenuItem>
            ))}
          </Select>
          {errors.dia && <FormHelperText>{errors.dia}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <SAETimeField
          label={C.scheduleStartTime}
          value={form.hora_inicio}
          onChange={(v) => onChange("hora_inicio", v)}
          minTime="12:00"
          maxTime="22:00"
          fullWidth
          error={Boolean(errors.hora_inicio)}
          helperText={errors.hora_inicio ?? ""}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <SAETimeField
          label={C.scheduleEndTime}
          value={form.hora_fin}
          onChange={(v) => onChange("hora_fin", v)}
          minTime="12:00"
          maxTime="22:00"
          fullWidth
          error={Boolean(errors.hora_fin)}
          helperText={errors.hora_fin ?? ""}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <FormControl
          size="small"
          fullWidth
          error={Boolean(errors.id_espacio_deportivo)}
        >
          <InputLabel>Espacio deportivo</InputLabel>
          <Select
            value={form.id_espacio_deportivo}
            label={C.schedulePlace}
            onChange={(e) => onChange("id_espacio_deportivo", e.target.value)}
          >
            <MenuItem value="">
              <em>{C.noAssigned}</em>
            </MenuItem>
            {espacios.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.id_espacio_deportivo && (
            <FormHelperText>{errors.id_espacio_deportivo}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <FormControl
          size="small"
          fullWidth
          error={Boolean(errors.cuil_docente)}
        >
          <InputLabel>{C.scheduleTeacher}</InputLabel>
          <Select
            value={form.cuil_docente}
            label="Docente"
            onChange={(e) => onChange("cuil_docente", e.target.value)}
          >
            <MenuItem value="">
              <em>{C.noAssigned}</em>
            </MenuItem>
            {docentes.map((d) => (
              <MenuItem key={d.cuil} value={d.cuil}>
                {d.nombres} {d.apellidos}
              </MenuItem>
            ))}
          </Select>
          {errors.cuil_docente && (
            <FormHelperText>{errors.cuil_docente}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <Box
          sx={{
            minHeight: 46,
            px: 1.25,
            border: "1px solid",
            borderColor: "rgba(21,101,192,0.2)",
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-start", md: "center" },
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={form.activo}
                onChange={(e) => onChange("activo", e.target.checked)}
                size="small"
                color="primary"
              />
            }
            label={C.active}
            sx={{
              m: 0,
              ".MuiFormControlLabel-label": {
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#153b6f",
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

function HorarioCard({ horario, espacios, docentes, onSaved, onDeleted }) {
  const { modificarHorarioDeportivo, eliminarHorarioDeportivo } = useSports();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    dia: horario.dia,
    hora_inicio: toTimeInput(horario.hora_inicio),
    hora_fin: toTimeInput(horario.hora_fin),
    id_espacio_deportivo: horario.id_espacio_deportivo ?? "",
    cuil_docente: horario.cuil_docente ?? "",
    activo: horario.activo,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setFieldErrors((previous) => {
      const nextErrors = { ...previous };
      delete nextErrors[field];

      if (field === "hora_inicio") {
        delete nextErrors.hora_fin;
      }

      return nextErrors;
    });
    setError("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eliminarHorarioDeportivo(horario.id);
      setConfirmDelete(false);
      onDeleted();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleSave = async () => {
    const errors = validateHorarioForm(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const espacioObj = espacios.find(
        (e) => String(e.id) === String(form.id_espacio_deportivo),
      );
      const docenteObj = docentes.find(
        (d) => String(d.cuil) === String(form.cuil_docente),
      );
      const body = {
        ...horario,
        ...form,
        hora_inicio: toApiTime(form.hora_inicio),
        hora_fin: toApiTime(form.hora_fin),
        id_espacio_deportivo: Number(form.id_espacio_deportivo) || 0,
        espacio_deportivo:
          espacioObj?.nombre ?? horario.espacio_deportivo ?? "",
        docente_responsable: docenteObj
          ? `${docenteObj.nombres} ${docenteObj.apellidos}`
          : (horario.docente_responsable ?? ""),
      };
      await modificarHorarioDeportivo(horario.id, body);
      setEditing(false);
      onSaved();
    } catch (err) {
      if (isConflictError(err)) {
        setFieldErrors(getConflictFieldErrors());
        setError("");
        return;
      }

      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      dia: horario.dia,
      hora_inicio: toTimeInput(horario.hora_inicio),
      hora_fin: toTimeInput(horario.hora_fin),
      id_espacio_deportivo: horario.id_espacio_deportivo ?? "",
      cuil_docente: horario.cuil_docente ?? "",
      activo: horario.activo,
    });
    setEditing(false);
    setError("");
    setFieldErrors({});
  };

  if (!editing) {
    if (confirmDelete) {
      return (
        <Card
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(211,47,47,0.18)",
            border: "1.5px solid #c62828",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #c62828 0%, #ef5350 100%)",
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DeleteIcon sx={{ color: "white", fontSize: 16 }} />
            <Typography
              variant="subtitle2"
              sx={{ color: "white", fontWeight: 700, flex: 1 }}
            >
              {C.scheduleDelete}
            </Typography>
            <Chip
              size="small"
              label={
                calendarDays.find((d) => d.value === horario.dia)?.label ||
                "Día no encontrado"
              }
              sx={{
                bgcolor: "rgba(255,255,255,0.22)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
            <Chip
              size="small"
              label={`${toTimeInput(horario.hora_inicio)} – ${toTimeInput(horario.hora_fin)}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.22)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          </Box>
          <CardContent
            sx={{ py: 1.5, bgcolor: "#fff5f5", "&:last-child": { pb: 1.5 } }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {C.scheduleDeleteWarning}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <SAEButton
                variant="outlined"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                {C.cancel}
              </SAEButton>
              <SAEButton
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={deleting}
                startIcon={
                  deleting ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )
                }
              >
                {C.delete}
              </SAEButton>
            </Stack>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          borderColor: horario.activo ? "#c9ddf5" : "#d7dde6",
          borderLeft: "6px solid",
          borderLeftColor: horario.activo ? "#2e7d32" : "#9aa4b2",
          bgcolor: horario.activo ? "#fbfdff" : "#f7f8fa",
          transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
          "&:hover": {
            borderColor: "#8eb8e8",
            boxShadow: "0 8px 24px rgba(21,101,192,0.12)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ minHeight: 92 }}
          >
            <Stack spacing={1.1} sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  px: 1.2,
                  py: 0.9,
                  borderRadius: 1,
                  bgcolor: horario.activo ? "#eaf4ff" : "#eceff3",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: "#153b6f", lineHeight: 1.1 }}
                >
                  {calendarDays.find((d) => d.value === horario.dia)?.label ||
                    "Día no encontrado"}
                </Typography>
                <AccessTimeIcon
                  sx={{ color: "#1565C0", display: "none", fontSize: 18 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#153b6f", display: "none", fontWeight: 800 }}
                >
                  {toTimeInput(horario.hora_inicio)} –{" "}
                  {toTimeInput(horario.hora_fin)}
                </Typography>
                <Chip
                  size="small"
                  label={horario.activo ? C.active : C.inactive}
                  color={horario.activo ? "success" : "default"}
                  variant={horario.activo ? "filled" : "outlined"}
                  sx={{ height: 22, fontWeight: 700 }}
                />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  width: "fit-content",
                  maxWidth: "100%",
                  px: 1,
                  py: 0.75,
                  borderRadius: 1,
                  bgcolor: horario.activo ? "#f4f8fd" : "#eef1f5",
                }}
              >
                <AccessTimeIcon sx={{ color: "#1565C0", fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#153b6f", fontWeight: 800, lineHeight: 1.2 }}
                  noWrap
                >
                  {getTimeRangeLabel(horario.hora_inicio, horario.hora_fin)}
                </Typography>
              </Stack>
              {hasAssignedValue(horario.espacio_deportivo) && (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <PlaceIcon sx={{ color: "#7890ad", fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {horario.espacio_deportivo}
                  </Typography>
                </Stack>
              )}
              {hasAssignedValue(horario.docente_responsable) && (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <PersonIcon sx={{ color: "#7890ad", fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {horario.docente_responsable}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              justifyContent={{ xs: "flex-end", sm: "center" }}
              sx={{ flexShrink: 0 }}
            >
              <Tooltip title={C.scheduleEditing}>
                <IconButton
                  size="small"
                  onClick={() => setEditing(true)}
                  sx={{
                    width: 34,
                    height: 34,
                    color: "primary.main",
                    bgcolor: "rgba(21,101,192,0.08)",
                    "&:hover": { bgcolor: "rgba(21,101,192,0.16)" },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={C.scheduleDelete}>
                <IconButton
                  size="small"
                  onClick={() => setConfirmDelete(true)}
                  sx={{
                    width: 34,
                    height: 34,
                    color: "error.main",
                    bgcolor: "rgba(211,47,47,0.08)",
                    "&:hover": { bgcolor: "rgba(211,47,47,0.14)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const editHeader = (
    <Box
      sx={{
        background: "linear-gradient(90deg, #1565C0 0%, #5B96CC 100%)",
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <EditIcon sx={{ color: "white", fontSize: 16 }} />
      <Typography
        variant="subtitle2"
        sx={{ color: "white", fontWeight: 700, flex: 1 }}
      >
        {C.scheduleEditing}
      </Typography>
      <Chip
        size="small"
        label={
          calendarDays.find((d) => d.value === horario.dia)?.label ||
          "Día no encontrado"
        }
        sx={{
          bgcolor: "rgba(255,255,255,0.22)",
          color: "white",
          fontWeight: 700,
          fontSize: "0.7rem",
        }}
      />
      <Chip
        size="small"
        label={`${toTimeInput(horario.hora_inicio)} – ${toTimeInput(horario.hora_fin)}`}
        sx={{
          bgcolor: "rgba(255,255,255,0.22)",
          color: "white",
          fontWeight: 700,
          fontSize: "0.7rem",
        }}
      />
    </Box>
  );

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(21,101,192,0.18)",
        border: "1.5px solid #1565C0",
      }}
    >
      {editHeader}
      <CardContent sx={{ p: 2, bgcolor: "#f0f6ff", "&:last-child": { pb: 2 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        <HorarioFormFields
          form={form}
          errors={fieldErrors}
          onChange={handleChange}
          espacios={espacios}
          docentes={docentes}
        />
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <SAEButton
            variant="outlined"
            onClick={handleCancel}
            disabled={saving}
          >
            {C.cancel}
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <CheckIcon />
              )
            }
          >
            {C.saveChanges}
          </SAEButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

function NuevoHorarioCard({
  idDeporte,
  nombreDeporte,
  espacios,
  docentes,
  onCreated,
  onCancel,
}) {
  const { crearHorarioDeportivo } = useSports();
  const [form, setForm] = useState(EMPTY_SCHEDULE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setFieldErrors((previous) => {
      const nextErrors = { ...previous };
      delete nextErrors[field];

      if (field === "hora_inicio") {
        delete nextErrors.hora_fin;
      }

      return nextErrors;
    });
    setError("");
  };

  const handleCreate = async () => {
    const errors = validateHorarioForm(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const espacioObj = espacios.find(
        (e) => String(e.id) === String(form.id_espacio_deportivo),
      );
      const docenteObj = docentes.find(
        (d) => String(d.cuil) === String(form.cuil_docente),
      );
      await crearHorarioDeportivo({
        id: 0,
        id_deporte: idDeporte,
        nombre_deporte: nombreDeporte,
        id_espacio_deportivo: Number(form.id_espacio_deportivo) || 0,
        espacio_deportivo: espacioObj?.nombre ?? "",
        hora_inicio: toApiTime(form.hora_inicio),
        hora_fin: toApiTime(form.hora_fin),
        activo: form.activo,
        cuil_docente: form.cuil_docente,
        docente_responsable: docenteObj
          ? `${docenteObj.nombres} ${docenteObj.apellidos}`
          : "",
        dia: form.dia,
      });
      onCreated();
    } catch (err) {
      if (isConflictError(err)) {
        setFieldErrors(getConflictFieldErrors());
        setError("");
        return;
      }

      setError(err.message || "Error al crear");
    } finally {
      setSaving(false);
    }
  };

  const createHeader = (
    <Box
      sx={{
        background: "linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)",
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <AccessTimeIcon sx={{ color: "white", fontSize: 16 }} />
      <Typography
        variant="subtitle2"
        sx={{ color: "white", fontWeight: 700, flex: 1 }}
      >
        {C.scheduleCreating}
      </Typography>
      <Chip size="small" label={getDayLabel(form.dia)} sx={headerChipSx} />
      <Chip
        size="small"
        label={getTimeRangeLabel(form.hora_inicio, form.hora_fin)}
        sx={headerChipSx}
      />
    </Box>
  );

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(46,125,50,0.18)",
        border: "1.5px solid #2E7D32",
      }}
    >
      {createHeader}
      <CardContent sx={{ p: 2, bgcolor: "#f1faf2", "&:last-child": { pb: 2 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        <HorarioFormFields
          form={form}
          errors={fieldErrors}
          onChange={handleChange}
          espacios={espacios}
          docentes={docentes}
        />
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <SAEButton variant="outlined" onClick={onCancel} disabled={saving}>
            {C.cancel}
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleCreate}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AddIcon />
              )
            }
          >
            {C.create}
          </SAEButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function GestionarHorariosDialog({ open, onClose }) {
  const {
    obtenerDeportesActivos,
    obtenerHorariosXDeporte,
    obtenerDocentesDeportivos,
    obtenerEspaciosDeportivos,
  } = useSports();
  const [deportes, setDeportes] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);

  const [selectedDeporte, setSelectedDeporte] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosError, setHorariosError] = useState("");
  const [showNuevoForm, setShowNuevoForm] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingCatalogos(true);
    Promise.all([
      obtenerDeportesActivos(),
      obtenerEspaciosDeportivos(),
      obtenerDocentesDeportivos(),
    ])
      .then(([deps, esps, docs]) => {
        if (cancelled) return;
        setDeportes(deps);
        setEspacios(esps);
        setDocentes(docs);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCatalogos(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    open,
    obtenerDeportesActivos,
    obtenerDocentesDeportivos,
    obtenerEspaciosDeportivos,
  ]);

  const fetchHorarios = useCallback(
    async (idDeporte) => {
      setLoadingHorarios(true);
      setHorariosError("");
      try {
        const data = await obtenerHorariosXDeporte(idDeporte);
        setHorarios(data);
      } catch (err) {
        setHorariosError(err.message || C.errorScheduleLoad);
      } finally {
        setLoadingHorarios(false);
      }
    },
    [obtenerHorariosXDeporte],
  );

  const handleDeporteChange = useCallback(
    (_e, value) => {
      setSelectedDeporte(value);
      setHorarios([]);
      setShowNuevoForm(false);
      if (value) fetchHorarios(value.id);
    },
    [fetchHorarios],
  );

  const handleSaved = useCallback(() => {
    if (selectedDeporte) fetchHorarios(selectedDeporte.id);
  }, [selectedDeporte, fetchHorarios]);

  const handleCreated = useCallback(() => {
    setShowNuevoForm(false);
    if (selectedDeporte) fetchHorarios(selectedDeporte.id);
  }, [selectedDeporte, fetchHorarios]);

  const handleClose = () => {
    setSelectedDeporte(null);
    setHorarios([]);
    setShowNuevoForm(false);
    onClose();
  };

  const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const sortedHorarios = [...horarios].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.dia) - DAY_ORDER.indexOf(b.dia) ||
      a.hora_inicio.localeCompare(b.hora_inicio),
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {C.scheduleManager}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loadingCatalogos ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Autocomplete
              options={deportes}
              getOptionLabel={(opt) => opt.nombre}
              value={selectedDeporte}
              onChange={handleDeporteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={C.scheduleSportSelection}
                  size="small"
                  placeholder={C.scheduleSportPH}
                />
              )}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              noOptionsText={C.noResults}
            />

            {!selectedDeporte && (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                {C.scheduleSportsSelect}
              </Typography>
            )}

            {selectedDeporte && (
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#5a6f8f", fontWeight: 600 }}
                  >
                    {C.scheduleAlreadyOn} {selectedDeporte.nombre}
                  </Typography>
                  <IconButton
                    onClick={() => setShowNuevoForm(true)}
                    disabled={showNuevoForm}
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      width: 36,
                      height: 36,
                      "&:hover": { bgcolor: "primary.dark" },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {showNuevoForm && (
                  <NuevoHorarioCard
                    idDeporte={selectedDeporte.id}
                    nombreDeporte={selectedDeporte.nombre}
                    espacios={espacios}
                    docentes={docentes}
                    onCreated={handleCreated}
                    onCancel={() => setShowNuevoForm(false)}
                  />
                )}

                {loadingHorarios && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 3 }}
                  >
                    <CircularProgress />
                  </Box>
                )}

                {!loadingHorarios && horariosError && (
                  <Alert severity="error">{horariosError}</Alert>
                )}

                {!loadingHorarios &&
                  !horariosError &&
                  sortedHorarios.length === 0 &&
                  !showNuevoForm && (
                    <Typography
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      {C.noSchedule}
                    </Typography>
                  )}

                {!loadingHorarios &&
                  !horariosError &&
                  sortedHorarios.map((h) => (
                    <HorarioCard
                      key={h.id}
                      horario={h}
                      espacios={espacios}
                      docentes={docentes}
                      onSaved={handleSaved}
                      onDeleted={handleSaved}
                    />
                  ))}
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton variant="outlined" onClick={handleClose}>
          {C.close}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
