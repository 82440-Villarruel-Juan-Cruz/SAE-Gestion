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

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import { toTimeInput } from "../../../utils/date.utils";

import { useEmploy } from "../../context/employedContext";
import { AdminUsersProvider } from "../../context/providers/employProvider";
import { USER_STRINGS } from "../../../utils/strings/employed.strings";
import { calendarDays } from "../../../utils/common/constants";

const headerChipSx = {
  bgcolor: "rgba(255,255,255,0.22)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.7rem",
};

const C = USER_STRINGS;

const getDayLabel = (days, day) =>
  days?.find((calendarDay) => calendarDay.value === day)?.label ||
  "Día no encontrado";

const getTimeRangeLabel = (startTime, endTime) =>
  `${toTimeInput(startTime) || "--:--"} - ${toTimeInput(endTime) || "--:--"}`;

// FORMULARIO DE HORARIOS
function HorarioFormFields() {
  const {
    form,
    handleChangeForm,
    fieldErrors,
    setFieldErrors,
    setTouchedFields,
    validateField,
  } = useEmploy();
  return (
    <Stack spacing={1}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }} m={0}>
          <FormControl fullWidth error={Boolean(fieldErrors.hora_inicio)}>
            <InputLabel>{C.day}</InputLabel>
            <Select
              label={C.day}
              value={form.dia}
              onChange={(e) =>
                handleChangeForm("dia", e.target.value, {
                  setTouched: setTouchedFields,
                  setErrors: setFieldErrors,
                  validateFn: validateField,
                })
              }
            >
              {calendarDays.map((d) => (
                <MenuItem key={d.value} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>

            <FormHelperText sx={{ color: "red" }}>
              {fieldErrors.dia ?? ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SAETimeField
            label={C.startTime}
            value={form.hora_inicio}
            onChange={(value) =>
              handleChangeForm("hora_inicio", value, {
                setTouched: setTouchedFields,
                setErrors: setFieldErrors,
                validateFn: validateField,
              })
            }
            minTime="08:00"
            maxTime="24:00"
            size="big"
            fullWidth
            error={Boolean(fieldErrors.hora_inicio)}
            helperText={fieldErrors.hora_inicio ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SAETimeField
            label={C.endTime}
            value={form.hora_fin}
            onChange={(value) =>
              handleChangeForm("hora_fin", value, {
                setTouched: setTouchedFields,
                setErrors: setFieldErrors,
                validateFn: validateField,
              })
            }
            minTime="08:00"
            maxTime="24:00"
            size="big"
            fullWidth
            error={Boolean(fieldErrors.hora_fin)}
            helperText={fieldErrors.hora_fin ?? ""}
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
    form,
    setShowNuevoForm,
  } = useEmploy();

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
        {C.scheduleCreate}
      </Typography>
      <Chip
        size="small"
        label={getDayLabel(calendarDays, form.dia)}
        sx={headerChipSx}
      />
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
        {errorHorario && (
          <Alert
            severity="error"
            sx={{ mb: 1.5 }}
            onClose={() => setErrorHorario(null)}
          >
            {errorHorario}
          </Alert>
        )}
        <HorarioFormFields />
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <SAEButton
            variant="outlined"
            onClick={() => setShowNuevoForm(false)}
            disabled={savingHorario}
          >
            {C.cancel}
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleCreateHorario}
            disabled={savingHorario}
            startIcon={
              savingHorario ? (
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
    DAYS,
  } = useEmploy();

  const isEditing = editingId === horario.id;
  const isDeleting = deleteId === horario.id;

  function toTimeInput(str) {
    if (!str || typeof str !== "string") return "";

    return str.substring(0, 5);
  }

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
              {C.scheduleDeleteButton}
            </Typography>
            <Chip
              size="small"
              label={
                calendarDays.find(
                  (d) => d.value === (horario.dia === 0 ? 7 : horario.dia),
                )?.label || "Día no laborable"
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
                onClick={() => setDeleteId(null)}
                disabled={!isDeleting}
              >
                {C.cancel}
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
                  {calendarDays.find(
                    (d) => d.value === (horario.dia === 0 ? 7 : horario.dia),
                  )?.label || "Día no laborable"}
                </Typography>
                <AccessTimeIcon
                  sx={{ color: "#1565C0", display: "none", fontSize: 18 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#5a6f8f", display: "none" }}
                >
                  {toTimeInput(horario.hora_inicio)} –{" "}
                  {toTimeInput(horario.hora_fin)}
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
                  {getTimeRangeLabel(horario.hora_inicio, horario.hora_fin)}
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
                  setForm({
                    ...horario,
                    hora_inicio: toTimeInput(horario.hora_inicio),
                    hora_fin: toTimeInput(horario.hora_fin),
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
        {C.scheduleEditing}
      </Typography>
      <Chip
        size="small"
        label={
          calendarDays.find(
            (d) => d.value === (horario.dia === 0 ? 7 : horario.dia),
          )?.label || "Día no laborable"
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
        {errorHorario && (
          <Alert
            severity="error"
            sx={{ mb: 1.5 }}
            onClose={() => setErrorHorario("")}
          >
            {errorHorario}
          </Alert>
        )}
        <HorarioFormFields />
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <SAEButton
            variant="outlined"
            onClick={handleCancelHorario}
            disabled={savingHorario}
          >
            {C.cancel}
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleEditHorario}
            disabled={savingHorario}
            startIcon={
              savingHorario ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <CheckIcon />
              )
            }
          >
            {C.save}
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
    empleados,
    loadingHorarios,
    selectedHorarios,
    selectedEmploy,
    selectedHorariosLoading,
    handleEmployChange,
    handleClose,
    showNuevoForm,
    setShowNuevoForm,
    dialogError,
  } = useEmploy();
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
          {C.scheduleManagmentTitle}
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
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Autocomplete
              options={empleados}
              getOptionLabel={(opt) => opt.nombre_empleado || ""}
              value={selectedEmploy}
              onChange={handleEmployChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={C.scheduleSelectEmploy}
                  size="small"
                  placeholder={C.scheduleFilterMsg}
                  //error={Boolean(fieldErrors.hora_fin)} Ya viene preseleccionado
                  ///helperText={fieldErrors.hora_fin ?? ""}
                />
              )}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              noOptionsText="Sin resultados"
            />

            {!selectedEmploy && (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                {C.scheduleSelectMsg}
              </Typography>
            )}

            {selectedEmploy && (
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
                    {C.scheduleMsg} {selectedEmploy.nombre_empleado}
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
                      {C.scheduleNoData}
                    </Typography>
                  )}

                {!selectedHorariosLoading &&
                  !dialogError &&
                  selectedHorarios?.map((h) => (
                    <HorarioCard key={h.id} horario={h} />
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
