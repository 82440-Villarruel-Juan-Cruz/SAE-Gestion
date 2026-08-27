import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import { useSports } from "../../context/employedContext";
import { getTodayInputDate, toApiDateTime } from "../../../utils/date.utils";
import { EMPTY_TOURNAMENT_FORM } from "../../../utils/common/common.config";
import { SPORTS_STRINGS } from "../../../utils/strings/employed.strings";
import { isEmpty } from "../../../utils/text.utils";

const C = SPORTS_STRINGS;

export default function TorneoFormDialog({
  open,
  onClose,
  onSave,
  initialData = null,
  mode = "create",
}) {
  const { obtenerDeportesCompleto, obtenerDocentesDeportivos } = useSports();
  const isEdit = mode === "edit";
  const todayInputDate = getTodayInputDate();

  const [formData, setFormData] = useState(EMPTY_TOURNAMENT_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deportesList, setDeportesList] = useState([]);
  const [docentesList, setDocentesList] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);

  // Reset form and load catalogs every time dialog opens
  useEffect(() => {
    if (!open) return;
    setFormData(initialData ?? EMPTY_TOURNAMENT_FORM);
    setFieldErrors({});
    setError("");

    let cancelled = false;
    setLoadingCatalogos(true);
    Promise.all([obtenerDeportesCompleto(), obtenerDocentesDeportivos()])
      .then(([deps, docs]) => {
        if (cancelled) return;
        setDeportesList(deps);
        setDocentesList(docs);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCatalogos(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateField = (field, value, data = formData) => {
    switch (field) {
      case "nombre_torneo":
      case "fecha_inicio":
      case "fecha_fin":
      case "fecha_limite_inscripcion":
        if (isEmpty(value)) return C.tournamentRequired;
        if (
          field === "fecha_fin" &&
          data.fecha_inicio &&
          value < data.fecha_inicio
        ) {
          return C.tournamentEndDateBeforeStart;
        }
        if (field === "fecha_limite_inscripcion" && value < todayInputDate) {
          return C.tournamentLimitDateBeforeToday;
        }
        if (
          field === "fecha_limite_inscripcion" &&
          data.fecha_inicio &&
          value > data.fecha_inicio
        ) {
          return C.tournamentLimitDateAfterStart;
        }
        return "";
      case "cupo_jugadores": {
        const numberValue = Number(value);
        return Number.isInteger(numberValue) && numberValue > 0
          ? ""
          : C.tournamentCapacityInvalid;
      }
      case "id_deporte":
        return Number(value) >= 0 ? "" : C.tournamentSportRequired;
      case "cuil_responsable":
        return isEmpty(value) ? C.tournamentTeacherRequired : "";
      default:
        return "";
    }
  };

  const handleChanges = (changes) => {
    setFormData((previousFormData) => {
      const next = { ...previousFormData, ...changes };
      setFieldErrors((previousErrors) => {
        const nextErrors = { ...previousErrors };

        Object.keys(changes).forEach((field) => {
          nextErrors[field] = validateField(field, next[field], next);
        });

        if (Object.hasOwn(changes, "fecha_inicio")) {
          nextErrors.fecha_fin = validateField(
            "fecha_fin",
            next.fecha_fin,
            next,
          );
          nextErrors.fecha_limite_inscripcion = validateField(
            "fecha_limite_inscripcion",
            next.fecha_limite_inscripcion,
            next,
          );
        }

        return nextErrors;
      });
      return next;
    });
  };

  const handleChange = (field, value) => {
    handleChanges({ [field]: value });
  };

  const validate = () => {
    const fields = [
      "nombre_torneo",
      "cupo_jugadores",
      "id_deporte",
      "cuil_responsable",
      "fecha_inicio",
      "fecha_fin",
      "fecha_limite_inscripcion",
    ];
    const errors = fields.reduce((result, field) => {
      const message = validateField(field, formData[field]);
      if (message) result[field] = message;
      return result;
    }, {});

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setError("");
    try {
      const body = {
        ...formData,
        fecha_inicio: toApiDateTime(formData.fecha_inicio),
        fecha_fin: toApiDateTime(formData.fecha_fin),
        fecha_limite_inscripcion: toApiDateTime(
          formData.fecha_limite_inscripcion,
        ),
        cupo_jugadores: Number(formData.cupo_jugadores) || 0,
        id_deporte: Number(formData.id_deporte) || 0,
      };
      await onSave(body);
      onClose();
    } catch (err) {
      setError(
        err.message ||
          (isEdit ? C.errorUpdateTournament : C.errorCreateTournament),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isEdit ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
        {isEdit ? C.tournamentEdit : C.tournamentCreate}
        <IconButton size="small" onClick={onClose} sx={{ ml: "auto" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {/* Row: nombre + cupo */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <SAETextField
              label={C.tournamentName}
              fullWidth
              required
              value={formData.nombre_torneo}
              onChange={(e) => handleChange("nombre_torneo", e.target.value)}
              error={Boolean(fieldErrors.nombre_torneo)}
              helperText={fieldErrors.nombre_torneo ?? ""}
            />
            <SAETextField
              label={C.tournamentCapacity}
              type="number"
              required
              sx={{ minWidth: 160 }}
              value={formData.cupo_jugadores}
              onChange={(e) => handleChange("cupo_jugadores", e.target.value)}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
              error={Boolean(fieldErrors.cupo_jugadores)}
              helperText={fieldErrors.cupo_jugadores ?? ""}
            />
          </Stack>

          {/* Deporte autocomplete */}
          <Autocomplete
            options={deportesList}
            loading={loadingCatalogos}
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : (opt.nombre ?? "")
            }
            value={
              deportesList.find(
                (d) => String(d.id) === String(formData.id_deporte),
              ) ??
              deportesList.find(
                (d) =>
                  d.nombre?.toLowerCase() ===
                  formData.nombre_deporte?.toLowerCase(),
              ) ??
              (formData.id_deporte
                ? { id: formData.id_deporte, nombre: formData.nombre_deporte }
                : null)
            }
            onChange={(_, val) => {
              if (val) {
                handleChanges({
                  id_deporte: val.id,
                  nombre_deporte: val.nombre,
                });
              } else {
                handleChanges({
                  id_deporte: 0,
                  nombre_deporte: "",
                });
              }
            }}
            isOptionEqualToValue={(opt, val) =>
              String(opt.id) === String(val?.id)
            }
            renderInput={(params) => (
              <SAETextField
                {...params}
                label={C.Deporte}
                fullWidth
                required
                error={Boolean(fieldErrors.id_deporte)}
                helperText={fieldErrors.id_deporte ?? ""}
              />
            )}
          />

          {/* Docente autocomplete */}
          <Autocomplete
            options={docentesList}
            loading={loadingCatalogos}
            getOptionLabel={(opt) =>
              typeof opt === "string"
                ? opt
                : `${opt.nombres ?? ""} ${opt.apellidos ?? ""}`.trim()
            }
            value={
              docentesList.find((d) => d.cuil === formData.cuil_responsable) ??
              (formData.cuil_responsable
                ? {
                    cuil: formData.cuil_responsable,
                    nombres: formData.docente_responsable,
                    apellidos: "",
                  }
                : null)
            }
            onChange={(_, val) => {
              if (val) {
                handleChanges({
                  cuil_responsable: val.cuil,
                  docente_responsable:
                    `${val.nombres ?? ""} ${val.apellidos ?? ""}`.trim(),
                });
              } else {
                handleChanges({
                  cuil_responsable: "",
                  docente_responsable: "",
                });
              }
            }}
            isOptionEqualToValue={(opt, val) => opt.cuil === val?.cuil}
            filterOptions={(opts, { inputValue }) => {
              const lower = inputValue.toLowerCase();
              return opts.filter(
                (d) =>
                  d.cuil?.toLowerCase().includes(lower) ||
                  `${d.nombres} ${d.apellidos}`.toLowerCase().includes(lower),
              );
            }}
            renderOption={(props, opt) => (
              <li {...props} key={opt.cuil}>
                <Box>
                  <Typography variant="body2">
                    {opt.nombres} {opt.apellidos}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {opt.cuil}
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <SAETextField
                {...params}
                label={C.tournamentTeacher}
                fullWidth
                required
                error={Boolean(fieldErrors.cuil_responsable)}
                helperText={fieldErrors.cuil_responsable ?? ""}
              />
            )}
          />

          {/* Dates row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <SAETextField
              label={C.tournamentStartDate}
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_inicio}
              onChange={(e) => handleChange("fecha_inicio", e.target.value)}
              error={Boolean(fieldErrors.fecha_inicio)}
              helperText={fieldErrors.fecha_inicio ?? ""}
            />
            <SAETextField
              label={C.tournamentEndDate}
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_fin}
              onChange={(e) => handleChange("fecha_fin", e.target.value)}
              error={Boolean(fieldErrors.fecha_fin)}
              helperText={fieldErrors.fecha_fin ?? ""}
            />
            <SAETextField
              label={C.tournamentDateLimit}
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_limite_inscripcion}
              onChange={(e) =>
                handleChange("fecha_limite_inscripcion", e.target.value)
              }
              error={Boolean(fieldErrors.fecha_limite_inscripcion)}
              helperText={fieldErrors.fecha_limite_inscripcion ?? ""}
            />
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={formData.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
              />
            }
            label={C.active}
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <SAEButton variant="outlined" onClick={onClose} disabled={saving}>
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSave}
          disabled={saving}
        >
          {isEdit ? C.save : C.tournamenteCreate}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
