import { useState } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useHealth } from "../../context/employedContext";
import { calendarDays } from "../../../utils/common/constants";

const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const validateHorarioForm = (form, selectedEmploy) => {
  const errors = {};

  if (!selectedEmploy) errors.general = "Seleccioná un empleado.";
  if (form.dia === null || form.dia === undefined || form.dia === "") {
    errors.dia = "Seleccioná un día.";
  }
  if (!form.hora_inicio) errors.hora_inicio = "Ingresá la hora de inicio.";
  if (!form.hora_fin) {
    errors.hora_fin = "Ingresá la hora de fin.";
  } else {
    const startMinutes = toMinutes(form.hora_inicio);
    const endMinutes = toMinutes(form.hora_fin);

    if (
      startMinutes !== null &&
      endMinutes !== null &&
      endMinutes <= startMinutes
    ) {
      errors.hora_fin = "La hora de fin debe ser posterior al inicio.";
    }
  }

  return errors;
};

// FORMULARIO DE HORARIOS
function HorarioFormFields({ fieldErrors = {}, onFieldChange } = {}) {
  const { form, handleChangeForm } = useHealth();
  const handleFieldChange = onFieldChange ?? handleChangeForm;
  return (
    <Stack spacing={1}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }} m={0}>
          <FormControl fullWidth error={Boolean(fieldErrors.dia)}>
            <InputLabel id="horario-dia-label">Día</InputLabel>
            <Select
              labelId="horario-dia-label"
              value={form?.dia ?? ""}
              label="Día"
              onChange={(e) => handleFieldChange("dia", e.target.value)}
            >
            {calendarDays.map((d) => (
              <MenuItem key={d.value} value={d.value}>
                {d.label}
              </MenuItem>
            ))}
            </Select>
            {fieldErrors.dia && (
              <FormHelperText>{fieldErrors.dia}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} m={0}>
          <SAETimeField
            label="Hora inicio"
            value={form.hora_inicio}
            onChange={(value) => handleFieldChange("hora_inicio", value)}
            minTime="08:00"
            maxTime="24:00"
            size="big"
            fullWidth
            error={Boolean(fieldErrors.hora_inicio)}
            helperText={fieldErrors.hora_inicio}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} m={0}>
          <SAETimeField
            label="Hora fin"
            value={form.hora_fin}
            onChange={(value) => handleFieldChange("hora_fin", value)}
            minTime="08:00"
            maxTime="24:00"
            size="big"
            fullWidth
            error={Boolean(fieldErrors.hora_fin)}
            helperText={fieldErrors.hora_fin}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
//ALTA DE FORMULARIOS
function NuevoHorarioCard() {
  //Con esto traemos las funciones y valores que nos hacen falta del contexto compartido
  const {
    savingHorario,
    errorHorario,
    handleCreateHorario,
    setErrorHorario,
    setShowNuevoForm,
    selectedEmploy,
    form,
    handleChangeForm,
  } = useHealth();
  const [fieldErrors, setFieldErrors] = useState({});

  const toMinutes = (time) => {
    const [hours, minutes] = String(time).split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const validateHorario = () => {
    const errors = {};

    if (!selectedEmploy) errors.general = "Seleccioná un empleado.";
    if (form.dia === null || form.dia === undefined || form.dia === "") {
      errors.dia = "Seleccioná un día.";
    }
    if (!form.hora_inicio) errors.hora_inicio = "Ingresá la hora de inicio.";
    if (!form.hora_fin) {
      errors.hora_fin = "Ingresá la hora de fin.";
    } else {
      const startMinutes = toMinutes(form.hora_inicio);
      const endMinutes = toMinutes(form.hora_fin);

      if (startMinutes !== null && endMinutes !== null && endMinutes <= startMinutes) {
        errors.hora_fin = "La hora de fin debe ser posterior al inicio.";
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorHorario(errors.general || "Revisá los campos marcados antes de guardar.");
      return false;
    }

    setErrorHorario(null);
    return true;
  };

  const handleHorarioFieldChange = (field, value) => {
    setFieldErrors((previous) => ({ ...previous, [field]: "", general: "" }));
    setErrorHorario(null);
    handleChangeForm(field, value);
  };

  const handleCreateClick = () => {
    if (!validateHorario()) return;
    handleCreateHorario();
  };

  const handleCancelClick = () => {
    setFieldErrors({});
    setErrorHorario(null);
    setShowNuevoForm(false);
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
      <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 700 }}>
        Nuevo horario
      </Typography>
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
        {errorHorario && (
          <Alert
            severity="error"
            sx={{ mb: 1.5 }}
            onClose={() => setErrorHorario(null)}
          >
            {errorHorario}
          </Alert>
        )}
        <HorarioFormFields
          fieldErrors={fieldErrors}
          onFieldChange={handleHorarioFieldChange}
        />
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <SAEButton
            variant="outlined"
            onClick={handleCancelClick}
            disabled={savingHorario}
          >
            Cancelar
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleCreateClick}
            disabled={savingHorario}
            startIcon={
              savingHorario ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AddIcon />
              )
            }
          >
            Crear
          </SAEButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
// VISUALIZACION Y EDICION
function HorarioCard({ horario }) {
  const {
    editingId,
    setEditingId,
    deleteId,
    setDeleteId,
    setForm,
    handleEditHorario,
    handleDeleteHorario,
    handleCancelHorario,
    savingHorario,
    errorHorario,
    setErrorHorario,
    selectedEmploy,
    form,
    handleChangeForm,
  } = useHealth();
  const [fieldErrors, setFieldErrors] = useState({});

  const isEditing = String(editingId ?? "") === String(horario.id ?? "");
  const isDeleting = String(deleteId ?? "") === String(horario.id ?? "");
  //Porque no podia usar los otros no tengo ni idea.
  const DIAS_LABEL = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
  };
  function toTimeInput(str) {
    if (!str || typeof str !== "string") return "";

    return str.substring(0, 5);
  }

  const handleEditFieldChange = (field, value) => {
    setFieldErrors((previous) => ({ ...previous, [field]: "", general: "" }));
    setErrorHorario(null);
    handleChangeForm(field, value);
  };

  const handleEditClick = () => {
    const errors = validateHorarioForm(form, selectedEmploy);

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorHorario(
        errors.general || "Revisá los campos marcados antes de guardar.",
      );
      return;
    }

    setErrorHorario(null);
    handleEditHorario();
  };

  //Luis te pido por favor que si lees esto empieces a comentar el codigo porque es complicado entender que es cada pequeña parte
  if (!isEditing) {
    if (isDeleting) {
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
              Eliminar horario
            </Typography>
            <Chip
              size="small"
              label={DIAS_LABEL[horario.dia]}
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
              ¿Estás seguro que querés eliminar este horario? Esta acción no se
              puede deshacer.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <SAEButton
                variant="outlined"
                onClick={() => setDeleteId(horario.id)}
                disabled={!isDeleting}
              >
                Cancelar
              </SAEButton>
              <SAEButton
                variant="contained"
                color="error"
                onClick={handleDeleteHorario}
                disabled={!isDeleting}
                startIcon={
                  !isDeleting ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )
                }
              >
                Eliminar
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
          borderColor: "#c9ddf5",
          borderLeft: "6px solid",
          borderLeftColor: "#2e7d32",
          bgcolor: "#fbfdff",
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
                  bgcolor: "#eaf4ff",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: "#153b6f", lineHeight: 1.1 }}
                >
                  {DIAS_LABEL[horario.dia]}
                </Typography>
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
                  bgcolor: "#f4f8fd",
                }}
              >
                <AccessTimeIcon sx={{ color: "#1565C0", fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#153b6f", fontWeight: 800, lineHeight: 1.2 }}
                  noWrap
                >
                  {toTimeInput(horario.hora_inicio)} -{" "}
                  {toTimeInput(horario.hora_fin)}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <PersonIcon sx={{ color: "#7890ad", fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {horario.especialista} - {horario.nombre_especialidad}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              justifyContent={{ xs: "flex-end", sm: "center" }}
              sx={{ flexShrink: 0 }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  setFieldErrors({});
                  setErrorHorario(null);
                  setForm({
                    ...horario,
                    hora_inicio: toTimeInput(horario.hora_inicio),
                    hora_fin: toTimeInput(horario.hora_fin),
                    cuil_especialista: horario.cuil_especialista,
                  });
                  setEditingId(horario.id);
                }}
                sx={{
                  color: "primary.main",
                  bgcolor: "rgba(21,101,192,0.08)",
                  width: 34,
                  height: 34,
                  "&:hover": { bgcolor: "rgba(21,101,192,0.16)" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setDeleteId(horario.id)}
                sx={{
                  color: "error.main",
                  bgcolor: "rgba(211,47,47,0.08)",
                  width: 34,
                  height: 34,
                  "&:hover": { bgcolor: "rgba(211,47,47,0.14)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
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
        Editando horario
      </Typography>
      <Chip
        size="small"
        label={DIAS_LABEL[horario.dia]}
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
      <Chip
        size="small"
        label={`${horario.especialista} - ${horario.nombre_especialidad}`}
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
      <CardContent
        sx={{ py: 1.5, bgcolor: "#f0f6ff", "&:last-child": { pb: 1.5 } }}
      >
        {errorHorario && (
          <Alert
            severity="error"
            sx={{ mb: 1.5 }}
            onClose={() => setErrorHorario("")}
          >
            {errorHorario}
          </Alert>
        )}
        <HorarioFormFields
          fieldErrors={fieldErrors}
          onFieldChange={handleEditFieldChange}
        />
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 1 }}
        >
          <SAEButton
            variant="outlined"
            onClick={handleCancelHorario}
            disabled={savingHorario}
          >
            Cancelar
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleEditClick}
            disabled={savingHorario}
            startIcon={
              savingHorario ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <CheckIcon />
              )
            }
          >
            Guardar cambios
          </SAEButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

//VISUALIZADOR DE HORARIOS POR EMPLEADO
export default function GestionarHorariosDialog({ open }) {
  //Estas son todas funciones que se utilizan en esta pantalla. Lo puse todo en un archivo para que se puedan consultar de manera generica de otros componentes
  const {
    personal,
    loadingHorarios,
    selectedHorarios,
    selectedEmploy,
    selectedHorariosLoading,
    handleEmployChange,
    handleClose,
    showNuevoForm,
    setShowNuevoForm,
    setForm,
    dialogError,
  } = useHealth();
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
          Gestionar Horarios Empleados
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loadingHorarios && selectedEmploy ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              borderColor: "#d6e4f7",
              bgcolor: "#fbfdff",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack spacing={2}>
            <Autocomplete
              options={personal}
              getOptionLabel={(opt) =>
                `${opt.apellido + ", " + opt.nombre}` || ""
              }
              value={selectedEmploy}
              onChange={handleEmployChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar empleado"
                  size="small"
                  placeholder="Escribí para filtrar..."
                />
              )}
              isOptionEqualToValue={(opt, val) => opt.cuil === val.cuil}
              noOptionsText="Sin resultados"
            />

            {!selectedEmploy && (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                Seleccioná un empleado para ver sus horarios
              </Typography>
            )}

            {selectedEmploy && (
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    borderTop: "1px solid #d6e4f7",
                    pt: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#5a6f8f", fontWeight: 600 }}
                  >
                    Horarios registrados — {selectedEmploy.apellido},{" "}
                    {selectedEmploy.nombre}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        id: null,
                        hora_inicio: "",
                        hora_fin: "",
                        dia: previous?.dia ?? 1,
                        activo: true,
                      }));
                      setShowNuevoForm(true);
                    }}
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

                {showNuevoForm && <NuevoHorarioCard />}

                {selectedHorariosLoading && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 3 }}
                  >
                    <CircularProgress />
                  </Box>
                )}

                {!selectedHorariosLoading && dialogError && (
                  <Alert severity="error">{dialogError}</Alert>
                )}

                {!selectedHorariosLoading &&
                  !dialogError &&
                  selectedEmploy &&
                  selectedHorarios &&
                  selectedHorarios.length === 0 &&
                  !showNuevoForm && (
                    <Typography
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      No hay horarios registrados para este empleado.
                    </Typography>
                  )}

                {!selectedHorariosLoading &&
                  !dialogError &&
                  selectedHorarios.map((h) => (
                    <HorarioCard key={h.id} horario={h} />
                  ))}
              </Stack>
            )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton variant="outlined" onClick={handleClose}>
          Cerrar
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
