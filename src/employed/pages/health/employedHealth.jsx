//FUNCIONES
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Grid,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";
//ICONS
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SchoolIcon from "@mui/icons-material/School";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
//COMPONENTES
import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useHealth } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";

import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEPage from "../../../assets/components/page/SAEPage";
import SAEDeleteDialog from "../../../assets/components/popUp/SAEDeleteDialog";

import GestionarHorariosDialog from "./horariosDialog.jsx";
import { EmployedCalendar } from "./healthCalendar.jsx";
import { DataGrid } from "@mui/x-data-grid";
import { HEALTH_STRING } from "../../../utils/strings/employed.strings";
import { isEmpty } from "../../../utils/text.utils";
import { validateCuil } from "../../../utils/validation.utils";

const C = HEALTH_STRING;
function EmployedAdminContent() {
  const navigate = useNavigate();

  const {
    //ABM Faltas
    SetCuilFaltas,
    //ABM Especialidades
    especialidadesRows,
    especialidadesColumns,
    loadingEspecialidades,
    openCreateEspecialidades,
    //ABM de Personal
    personalRows,
    personalColumns,
    loadingPersonal,
    openCreatePersonal,
    //ABM de Cursos
    cursosRows,
    cursosColumns,
    loadingCursos,
    openCreateCurso,
    //Valores de error, mostrar mensajes, etc.
    setHorariosDialogOpen,
    horariosDialogOpen,
  } = useHealth();

  const sectionConfig = useMemo(
    () => ({
      especialidades: {
        title: "Especialidades",
        dialog: openCreateEspecialidades,
        addButton: "Nueva Especialidad",
        icon: MedicalServicesIcon,
        rows: especialidadesRows,
        columns: especialidadesColumns,
        loading: loadingEspecialidades,
      },
      personal: {
        title: "Personal Medico",
        dialog: openCreatePersonal,
        addButton: "Alta de Personal",
        icon: PersonAddAltIcon,
        rows: personalRows,
        columns: personalColumns,
        loading: loadingPersonal,
      },
      cursos: {
        title: "Cursos Medicos",
        dialog: openCreateCurso,
        addButton: "Nuevo Curso",
        icon: SchoolIcon,
        rows: cursosRows,
        columns: cursosColumns,
        loading: loadingCursos,
      },
    }),
    [
      especialidadesRows,
      especialidadesColumns,
      loadingEspecialidades,
      openCreateEspecialidades,
      personalRows,
      personalColumns,
      loadingPersonal,
      openCreatePersonal,
      cursosRows,
      cursosColumns,
      loadingCursos,
      openCreateCurso,
    ],
  );
  const activeSection = "especialidades";

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.headerMainTitle}
        title={C.headerMainSubtitle}
        description={C.headerMainDescription}
      />

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          mt: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            background: "var(--purpleGradient)",
            color: "white",
            px: 3,
            py: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <DashboardIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h4" fontWeight={700}>
                 {C.healthTurnsTitle}
                </Typography>
              </Box>
            </Stack>
            <SAEButton
              variant="contained"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/Gestion-Salud/Turnos")}
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.4)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
            >
              {C.healthTurnsButton}
            </SAEButton>
          </Stack>
        </Box>
      </Card>

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Box
          sx={{
            background: "var(--gradient)",
            color: "white",
            px: 3,
            py: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ScheduleIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {C.ourScheduleTitle}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {C.ourScheduleDescription}
                </Typography>
              </Box>
            </Stack>
            <SAEButton
              variant="contained"
              startIcon={<ScheduleIcon />}
              onClick={() => setHorariosDialogOpen(true)}
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.4)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
            >
              {C.ourScheduleButton}
            </SAEButton>
          </Stack>
        </Box>
        {/*CALENDARIO */}
        <EmployedCalendar embedded />
      </Card>

      <GestionarHorariosDialog open={horariosDialogOpen} />
      <DialogHealth />
    </SAEPage>
  );
}

function DialogHealth() {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  const {
    especialidades,
    especialidadesActivas,
    handleEspecialidadesSave,
    faltasRows,
    faltasColumns,
    loadingFaltas,
    handlePersonalSave,
    handleCursoSave,
  } = useHealth();
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (dialogOpen) {
      setFieldErrors({});
      setDialogError("");
    }
  }, [dialogMode, dialogOpen, dialogType, setDialogError]);

  const handleFieldChange = (field, value) => {
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
    setDialogError("");
    handleDataChange(field, value);
  };

  const isPositiveInteger = (value) => {
    const numberValue = Number(value);
    return Number.isInteger(numberValue) && numberValue > 0;
  };

  const isValidDateInput = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
  };

  const validateDialog = () => {
    const errors = {};

    if (dialogType === "especialidades") {
      if (isEmpty(dialogData.nombre)) errors.nombre = C.validationSpecialityName;
      if (isEmpty(dialogData.descripcion)) {
        errors.descripcion = C.validationSpecialityDescription;
      }
    }

    if (dialogType === "personal" && dialogMode === "faltas") {
      if (isEmpty(dialogData.observacion)) {
        errors.observacion = C.validationFaultObservation;
      }
      if (!isValidDateInput(dialogData.fecha_alta)) {
        errors.fecha_alta = C.validationFaultDate;
      }
    }

    if (dialogType === "personal" && dialogMode !== "faltas") {
      if (isEmpty(dialogData.cuil)) {
        errors.cuil = C.validationCuilRequired;
      } else if (!validateCuil(String(dialogData.cuil))) {
        errors.cuil = C.validationCuilFormat;
      }
      if (isEmpty(dialogData.nombre)) errors.nombre = C.validationEmployName;
      if (isEmpty(dialogData.apellido)) errors.apellido = C.validationEmployLastName;
      if (isEmpty(dialogData.id_especialidad)) {
        errors.id_especialidad = C.validationEmploySpeciality;
      }
    }

    if (dialogType === "cursos") {
      if (
        isEmpty(dialogData.cupo_maximo) ||
        !isPositiveInteger(dialogData.cupo_maximo)
      ) {
        errors.cupo_maximo = C.validationCourseCapacity;
      }
      if (isEmpty(dialogData.nombre_curso)) errors.nombre_curso = C.validationCourseName;
      if (isEmpty(dialogData.nombre_docente)) {
        errors.nombre_docente = C.validationCourseTeacher;
      }
      if (!isValidDateInput(dialogData.fecha_inicio)) {
        errors.fecha_inicio = C.validationCourseStart;
      }
      if (!isValidDateInput(dialogData.fecha_fin)) {
        errors.fecha_fin = C.validationCourseEnd;
      } else if (
        isValidDateInput(dialogData.fecha_inicio) &&
        new Date(dialogData.fecha_fin) < new Date(dialogData.fecha_inicio)
      ) {
        errors.fecha_fin = C.validationCourseEndAfterStart;
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setDialogError(C.validationFormError);
      return false;
    }

    setDialogError("");
    return true;
  };

  const handleSaveWithValidation = (saveHandler) => {
    if (!validateDialog()) return;
    saveHandler();
  };

  const deleteDialogConfig = {
    cursos: {
      entityLabel: "Curso",
      itemName: dialogData?.nombre_curso,
      onConfirm: handleCursoSave,
    },
  };

  if (dialogOpen && dialogMode === "delete") {
    const config = deleteDialogConfig[dialogType];

    return config ? (
      <SAEDeleteDialog
        open={dialogOpen}
        entityLabel={config.entityLabel}
        itemName={config.itemName}
        itemId={dialogData?.id}
        onConfirm={config.onConfirm}
        onClose={closeDialog}
        loading={dialogSaving}
        error={dialogError}
        onClearError={() => setDialogError("")}
      />
    ) : null;
  }

  return (
    <>
      {dialogOpen && dialogType === "especialidades" && (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>

          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogMode === "create" ? C.specialityCreate : C.specialityUpdate}
            </Typography>
            <IconButton onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {dialogError && (
                <Alert severity="error" onClose={() => setDialogError("")}>
                  {dialogError}
                </Alert>
              )}
              <>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 3 }} m={0}>
                    <SAETextField
                      label={C.formId}
                      type="number"
                      fullWidth
                      value={dialogData.id}
                      onChange={(e) => handleFieldChange("id", e.target.value)}
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 9 }} m={0}>
                    <SAETextField
                      label={C.formCompleteName}
                      value={dialogData.nombre}
                      onChange={(e) =>
                        handleFieldChange("nombre", e.target.value)
                      }
                      fullWidth
                      required
                      error={Boolean(fieldErrors.nombre)}
                      helperText={fieldErrors.nombre}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} m={0}>
                    <SAETextField
                      label={C.formDescription}
                      value={dialogData.descripcion}
                      onChange={(e) =>
                        handleFieldChange("descripcion", e.target.value)
                      }
                      required
                      error={Boolean(fieldErrors.descripcion)}
                      helperText={fieldErrors.descripcion}
                      multiline
                      fullWidth
                      minRows={4}
                      maxRows={8}
                    />
                  </Grid>
                  {dialogMode === "edit" && (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={dialogData.activo}
                          onChange={(e) =>
                            handleFieldChange("activo", e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label={
                        dialogData.activo
                          ? C.formActiveSpecialist
                          : C.formNoActiveSpecialist
                      }
                    />
                  )}
                </Grid>
              </>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SAEButton
              variant="outlined"
              onClick={closeDialog}
              disabled={dialogSaving}
              startIcon={<CloseIcon />}
            >
              {C.cancel}
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={() => handleSaveWithValidation(handleEspecialidadesSave)}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
                )
              }
            >
              {dialogMode === "create"
                ? C.create
                : dialogMode === "delete"
                  ? C.delete
                  : C.save}
            </SAEButton>
          </DialogActions>
        </Dialog>
      )}

      {/*DIALOG DE PERSONAL*/}
      {dialogOpen && dialogType === "personal" && (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogMode === "create"
                ? C.employCreate //Primera condicion
                : dialogMode === "edit"
                  ? C.employEdit //Segunda condicion
                  : C.employFault}
            </Typography>
            <IconButton onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {dialogError && (
                <Alert severity="error" onClose={() => setDialogError("")}>
                  {dialogError}
                </Alert>
              )}
              <>
                {dialogMode === "faltas" ? (
                  <>
                    <Grid container spacing={1}>
                      <Typography
                        variant="subtitle2"
                        color="textPrimary"
                        fontWeight={600}
                        gutterBottom
                      >
                        {C.employHistoryFault}
                      </Typography>
                      <Grid size={{ xs: 12 }} my={1}>
                        <Box sx={{ width: "100%" }}>
                          <DataGrid
                            rows={faltasRows}
                            columns={faltasColumns}
                            loading={loadingFaltas}
                            autoHeight
                            disableRowSelectionOnClick
                            pageSizeOptions={[5, 10, 25]}
                            initialState={{
                              pagination: { paginationModel: { pageSize: 5 } },
                            }}
                            localeText={{ noRowsLabel: "Sin Registros" }}
                            sx={{ borderRadius: 0, border: "none" }}
                          />
                        </Box>
                      </Grid>
                      <Typography
                        variant="subtitle2"
                        color="textPrimary"
                        fontWeight={600}
                        gutterBottom
                      >
                        {C.employCreateFault}
                      </Typography>
                      <Grid size={{ xs: 12 }} my={1}>
                        <SAETextField
                          label={C.faultObservation}
                          value={dialogData.observacion}
                          onChange={(e) =>
                            handleFieldChange("observacion", e.target.value)
                          }
                          required
                          error={Boolean(fieldErrors.observacion)}
                          helperText={fieldErrors.observacion}
                          multiline
                          fullWidth
                          rows={4} // Número inicial de filas
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} my={1}>
                        <SAETextField
                          label={C.faultDate}
                          type="date"
                          value={dialogData.fecha_alta}
                          onChange={(e) =>
                            handleFieldChange("fecha_alta", e.target.value)
                          }
                          fullWidth
                          required
                          error={Boolean(fieldErrors.fecha_alta)}
                          helperText={fieldErrors.fecha_alta}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    {dialogMode === "create" && (
                      <Card
                        sx={{
                          bgcolor: "rgba(235, 235, 41, 0.7)",
                          border: "1px solid rgba(235, 41, 41, 0.1)",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            color="textPrimary"
                            fontWeight={600}
                            gutterBottom
                          >
                            {C.employSubtitle}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {C.employAclaration}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label={C.employCUIL}
                          type="number"
                          fullWidth
                          value={dialogData.cuil}
                          onChange={(e) =>
                            handleFieldChange("cuil", e.target.value)
                          }
                          disabled={dialogMode === "edit"}
                          required
                          error={Boolean(fieldErrors.cuil)}
                          helperText={fieldErrors.cuil}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label={C.employName}
                          value={dialogData.nombre}
                          onChange={(e) =>
                            handleFieldChange("nombre", e.target.value)
                          }
                          fullWidth
                          required
                          error={Boolean(fieldErrors.nombre)}
                          helperText={fieldErrors.nombre}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label={C.employLastName}
                          value={dialogData.apellido}
                          onChange={(e) =>
                            handleFieldChange("apellido", e.target.value)
                          }
                          fullWidth
                          required
                          error={Boolean(fieldErrors.apellido)}
                          helperText={fieldErrors.apellido}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }} m={0}>
                        <Autocomplete
                          disablePortal
                          options={especialidadesActivas}
                          getOptionLabel={(option) => option.nombre}
                          onChange={(event, newValue) => {
                            // 'newValue' es el objeto completo del perfil seleccionado (o null)
                            if (newValue) {
                              handleFieldChange("id_especialidad", newValue.id);
                            } else {
                              // Maneja el caso de que se borre la selección
                              handleFieldChange("id_especialidad", null);
                            }
                          }}
                          // Asegura que la comparación se haga por id
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          value={especialidades.find(
                            (especialidad) =>
                              especialidad.id === dialogData.id_especialidad,
                          ) || null} // Pasa el objeto completo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={C.employSpeciality}
                              required
                              error={Boolean(fieldErrors.id_especialidad)}
                              helperText={fieldErrors.id_especialidad}
                              inputProps={{
                                ...params.inputProps,
                                readOnly: true, // Esto evita la escritura
                              }}
                            />
                          )}
                        />
                      </Grid>
                      {dialogMode === "edit" && (
                        <>
                          <Card
                            sx={{
                              bgcolor: "rgba(226, 71, 71, 0.7)",
                              border: "1px solid rgba(235, 41, 41, 0.1)",
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="textPrimary"
                                fontWeight={600}
                                gutterBottom
                              >
                                {C.employUpdateSubtitle}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {C.employUpdateAclaration}
                              </Typography>
                            </CardContent>
                          </Card>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={dialogData.activo}
                                onChange={(e) =>
                                  handleFieldChange("activo", e.target.checked)
                                }
                                color="primary"
                              />
                            }
                            label={
                              dialogData.activo
                                ? C.employActive
                                : C.employNoActive
                            }
                          />
                        </>
                      )}
                    </Grid>
                  </>
                )}
              </>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SAEButton
              variant="outlined"
              onClick={closeDialog}
              disabled={dialogSaving}
              startIcon={<CloseIcon />}
            >
              {C.cancel}
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={() => handleSaveWithValidation(handlePersonalSave)}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
                )
              }
            >
              {dialogMode === "create"
                ? C.create
                : dialogMode === "delete"
                  ? C.delete
                  : C.save}
            </SAEButton>
          </DialogActions>
        </Dialog>
      )}
      {/* DIALOG DE CURSOS */}
      {dialogOpen && dialogType === "cursos" && (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogMode === "create" ? C.courseCreate : C.courseEdit}
            </Typography>
            <IconButton onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {dialogError && (
                <Alert severity="error" onClose={() => setDialogError("")}>
                  {dialogError}
                </Alert>
              )}
              <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 3 }} m={0}>
                      <SAETextField
                        label={C.courseId}
                        type="number"
                        fullWidth
                        value={dialogData.id}
                        onChange={(e) => handleFieldChange("id", e.target.value)}
                        disabled={true}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} m={0}>
                      <SAETextField
                        label={C.courseCapacity}
                        type="number"
                        fullWidth
                        value={dialogData.cupo_maximo}
                        onChange={(e) =>
                          handleFieldChange("cupo_maximo", e.target.value)
                        }
                        required
                        error={Boolean(fieldErrors.cupo_maximo)}
                        helperText={fieldErrors.cupo_maximo}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <SAETextField
                        label={C.courseName}
                        value={dialogData.nombre_curso}
                        onChange={(e) =>
                          handleFieldChange("nombre_curso", e.target.value)
                        }
                        fullWidth
                        required
                        error={Boolean(fieldErrors.nombre_curso)}
                        helperText={fieldErrors.nombre_curso}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <SAETextField
                        label={C.courseTeacher}
                        value={dialogData.nombre_docente}
                        onChange={(e) =>
                          handleFieldChange("nombre_docente", e.target.value)
                        }
                        fullWidth
                        required
                        error={Boolean(fieldErrors.nombre_docente)}
                        helperText={fieldErrors.nombre_docente}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} m={0}>
                      <SAETextField
                        label={C.courseStart}
                        type="date"
                        value={dialogData.fecha_inicio}
                        onChange={(e) =>
                          handleFieldChange("fecha_inicio", e.target.value)
                        }
                        fullWidth
                        required
                        error={Boolean(fieldErrors.fecha_inicio)}
                        helperText={fieldErrors.fecha_inicio}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} m={0}>
                      <SAETextField
                        label={C.courseEnd}
                        type="date"
                        value={dialogData.fecha_fin}
                        onChange={(e) =>
                          handleFieldChange("fecha_fin", e.target.value)
                        }
                        fullWidth
                        required
                        error={Boolean(fieldErrors.fecha_fin)}
                        helperText={fieldErrors.fecha_fin}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                    {dialogMode === "edit" && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={dialogData.activo}
                            onChange={(e) =>
                              handleFieldChange("activo", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={
                          dialogData.activo ? C.courseActive : C.courseNoActive
                        }
                      />
                    )}
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SAEButton
              variant="outlined"
              onClick={closeDialog}
              disabled={dialogSaving}
              startIcon={<CloseIcon />}
            >
              {C.cancel}
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={() => handleSaveWithValidation(handleCursoSave)}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
                )
              }
            >
              {dialogMode === "create"
                ? C.create
                : C.save}
            </SAEButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function EmployedHealth() {
  return (
    <HealthUsersProvider>
      <EmployedAdminContent />
    </HealthUsersProvider>
  );
}
