import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
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

import AddIcon from "@mui/icons-material/Add";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEPage from "../../../assets/components/page/SAEPage";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SearchStudent from "../../../assets/components/searchStudent/SearchStudent.jsx";

import GestionarHorariosDialog from "./horariosDialog.jsx";
import { EmployedCalendar } from "./employedCalendar.jsx";

import { useEmploy } from "../../context/employedContext";
import { AdminUsersProvider } from "../../context/providers/employProvider";
import { useNotification } from "../../../shared/context/sharedContext";
import { USER_STRINGS } from "../../../utils/strings/employed.strings";
import SAESpinner from "../../../assets/components/spinner/SAESpinner.jsx";

const C = USER_STRINGS;

const formatProfileList = (perfiles = []) => {
  const profileNames = perfiles.map((perfil) => perfil?.nombre).filter(Boolean);

  if (profileNames.length === 0) return C.employWarningEnd;
  if (profileNames.length === 1) {
    return `Desde esta pestaña se podrá crear el perfil ${profileNames[0]}.`;
  }

  const lastProfile = profileNames.at(-1);
  const previousProfiles = profileNames.slice(0, -1).join(", ");

  return `Desde esta pestaña se podrán crear los perfiles ${previousProfiles} y ${lastProfile}.`;
};

const getSpecialtyLabel = (specialty) =>
  specialty?.nombre_especialidad ?? specialty?.nombre ?? "";

const getSpecialtyDomain = (specialty) =>
  specialty?.nombre_carrera ??
  specialty?.sigla ??
  specialty?.nombre_especialidad ??
  "";

function EmployedAdminContent() {
  const {
    empleadosRows,
    empleadosColumns,
    loadingEmpleados,
    openCreateEmpleados,
    dialogType,
    horariosDialogOpen,
    setHorariosDialogOpen,
    openCreateUsuarios,
  } = useEmploy();

  const sectionConfig = useMemo(
    () => ({
      empleados: {
        title: "Empleados",
        dialog: openCreateEmpleados,
        addButton: "Nuevo Empleado",
        icon: Diversity3Icon,
        rows: empleadosRows,
        columns: empleadosColumns,
        loading: loadingEmpleados,
      },
    }),
    [empleadosRows, empleadosColumns, loadingEmpleados, openCreateEmpleados],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.headerTitle}
        title={C.headerMainSubtitle}
        description={C.headerMainDescription}
      />

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          my: 3,
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
              <PersonAddAltIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {C.userTitle}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {C.userDescription}
                </Typography>
              </Box>
            </Stack>
            <SAEButton
              variant="contained"
              startIcon={<Diversity3Icon />}
              onClick={openCreateUsuarios}
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.4)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
            >
              {C.userCreate}
            </SAEButton>
          </Stack>
        </Box>
        <StudentSection />
      </Card>
      <SAEDataGrid sectionConfig={sectionConfig} />

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
                  {C.scheduleTitle}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {C.scheduleSubtitle}
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
              {C.scheduleButton}
            </SAEButton>
          </Stack>
        </Box>
        <EmployedCalendar embedded />
      </Card>

      {dialogType === "empleados" && <EmpleadosDialog />}
      {dialogType === "usuarios" && <UsuariosDialog />}
      <GestionarHorariosDialog open={horariosDialogOpen} />
    </SAEPage>
  );
}

function EmpleadosDialog() {
  const {
    perfiles,
    handleEmpleadosSave,
    fieldErrors,
    setFieldErrors,
    setTouchedFields,
    validateField,
  } = useEmploy();
  const {
    dialogOpen,
    dialogData,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    setDialogData,
    closeDialog,
  } = useNotification();
  const employWarningEnd = useMemo(
    () => formatProfileList(perfiles),
    [perfiles],
  );

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? C.employCreate : C.employUpdate}
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

          {dialogMode === "edit" && (
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <SAETextField
                  label={C.employID || ""}
                  type="number"
                  fullWidth
                  value={dialogData.id}
                  onChange={(e) =>
                    handleDataChange("id", e.target.value, {
                      setTouched: setTouchedFields,
                      setErrors: setFieldErrors,
                      validateFn: validateField,
                    })
                  }
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }} m={0}>
                <SAETextField
                  label={C.employCompleteName || ""}
                  value={dialogData.nombre_empleado}
                  disabled
                  onChange={(e) =>
                    handleDataChange("nombre_empleado", e.target.value, {
                      setTouched: setTouchedFields,
                      setErrors: setFieldErrors,
                      validateFn: validateField,
                    })
                  }
                  fullWidth
                  error={Boolean(fieldErrors.nombre_empleado)}
                  helperText={fieldErrors.nombre_empleado ?? ""}
                />
              </Grid>
            </Grid>
          )}

          {dialogMode === "create" && (
            <>
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
                    {C.employWarningTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {C.employWarningBody1}
                    <br />
                    <br />
                    {employWarningEnd}
                  </Typography>
                </CardContent>
              </Card>

              <SAETextField
                label={C.employNames || ""}
                value={dialogData.nombres}
                onChange={(e) =>
                  handleDataChange("nombres", e.target.value, {
                    setTouched: setTouchedFields,
                    setErrors: setFieldErrors,
                    validateFn: validateField,
                  })
                }
                fullWidth
                error={Boolean(fieldErrors.nombres)}
                helperText={fieldErrors.nombres ?? ""}
              />
              <SAETextField
                label={C.employLastName || ""}
                value={dialogData.apellidos}
                onChange={(e) =>
                  handleDataChange("apellidos", e.target.value, {
                    setTouched: setTouchedFields,
                    setErrors: setFieldErrors,
                    validateFn: validateField,
                  })
                }
                fullWidth
                error={Boolean(fieldErrors.apellidos)}
                helperText={fieldErrors.apellidos ?? ""}
              />
              <SAETextField
                label={C.employUserName || ""}
                value={dialogData.nombre_usuario}
                onChange={(e) =>
                  handleDataChange("nombre_usuario", e.target.value, {
                    setTouched: setTouchedFields,
                    setErrors: setFieldErrors,
                    validateFn: validateField,
                  })
                }
                fullWidth
                error={Boolean(fieldErrors.nombre_usuario)}
                helperText={fieldErrors.nombre_usuario ?? ""}
              />
            </>
          )}

          <SAETextField
            label={C.studentID}
            value={dialogData.legajo}
            disabled={dialogMode !== "create"}
            onChange={(e) =>
              handleDataChange("legajo", e.target.value, {
                setTouched: setTouchedFields,
                setErrors: setFieldErrors,
                validateFn: validateField,
              })
            }
            fullWidth
            error={Boolean(fieldErrors.legajo)}
            helperText={fieldErrors.legajo ?? ""}
          />

          <Autocomplete
            disablePortal
            options={perfiles}
            getOptionLabel={(option) => option.nombre}
            onChange={(_event, newValue) => {
              handleDataChange("id_perfil", newValue ? newValue.id : null, {
                setTouched: setTouchedFields,
                setErrors: setFieldErrors,
                validateFn: validateField,
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              perfiles.find((perfil) => perfil.id === dialogData.id_perfil) ||
              null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={C.employProfile}
                inputProps={{
                  ...params.inputProps,
                  readOnly: true,
                }}
                error={Boolean(fieldErrors.id_perfil)}
                helperText={fieldErrors.id_perfil ?? ""}
              />
            )}
          />

          {dialogMode === "edit" && (
            <FormControlLabel
              control={
                <Switch
                  checked={dialogData.activo}
                  onChange={(e) =>
                    handleDataChange("activo", e.target.checked, {
                      setTouched: setTouchedFields,
                      setErrors: setFieldErrors,
                      validateFn: validateField,
                    })
                  }
                  color="primary"
                />
              }
              label={dialogData.activo ? C.employActive : C.employNoActive}
              error={Boolean(fieldErrors.activo)}
              helperText={fieldErrors.activo ?? ""}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={closeDialog}
          disabled={dialogSaving}
        >
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleEmpleadosSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? C.create : C.save}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

function UsuariosDialog() {
  const {
    carreras,
    handleUsuariosSave,
    fieldErrors,
    setFieldErrors,
    setTouchedFields,
    validateField,
  } = useEmploy();
  const {
    dialogOpen,
    dialogData,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    setDialogData,
    closeDialog,
  } = useNotification();
  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? C.userCreate : C.userUpdate}
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
                {C.employWarningTitle}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {C.userWarningBody2}
              </Typography>
            </CardContent>
          </Card>
          <Grid
            container
            spacing={2}
            display={"flex"}
            justifyContent={"center"}
            size={12}
          >
            <Grid size={{ xs: 12, sm: 3 }}>
              <SAETextField
                label={C.studentID}
                value={dialogData.legajo}
                disabled={dialogMode !== "create"}
                onChange={(e) =>
                  handleDataChange("legajo", e.target.value, {
                    setTouched: setTouchedFields,
                    setErrors: setFieldErrors,
                    validateFn: validateField,
                  })
                }
                fullWidth
                error={Boolean(fieldErrors.legajo)}
                helperText={fieldErrors.legajo ?? ""}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 1 }}
              display={"flex"}
              justifyContent={"center"}
            >
              <Typography
                variant="subtitle2"
                alignSelf={"center"}
                sx={{
                  fontSize: { xs: "20px", sm: "22px" },
                  color: "text.secondary",
                  fontWeight: 700,
                  lineHeight: { sm: "56px" },
                }}
              >
                {" "}
                @
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                disablePortal
                options={carreras ?? []}
                getOptionLabel={getSpecialtyLabel}
                onChange={(_event, newValue) => {
                  const nombreCarrera = getSpecialtyDomain(newValue);
                  const idEspecialidad = newValue?.id ?? "";

                  setDialogData((previous) => ({
                    ...previous,
                    nombre_carrera: nombreCarrera,
                    id_especialidad: idEspecialidad,
                  }));
                  setTouchedFields((previous) => ({
                    ...previous,
                    nombre_carrera: true,
                    id_especialidad: true,
                  }));
                  setFieldErrors((previous) => ({
                    ...previous,
                    nombre_carrera: validateField(
                      "nombre_carrera",
                      nombreCarrera,
                      {
                        ...dialogData,
                        nombre_carrera: nombreCarrera,
                        id_especialidad: idEspecialidad,
                      },
                    ),
                    id_especialidad: validateField(
                      "id_especialidad",
                      idEspecialidad,
                      {
                        ...dialogData,
                        nombre_carrera: nombreCarrera,
                        id_especialidad: idEspecialidad,
                      },
                    ),
                  }));
                }}
                isOptionEqualToValue={(option, value) =>
                  Number(option?.id) === Number(value?.id)
                }
                value={
                  carreras?.find(
                    (carrera) =>
                      Number(carrera.id) ===
                      Number(dialogData.id_especialidad),
                  ) ?? null // Use ?? to strictly catch null/undefined
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={C.userDegree}
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                    error={Boolean(
                      fieldErrors.nombre_carrera || fieldErrors.id_especialidad,
                    )}
                    helperText={
                      fieldErrors.nombre_carrera ??
                      fieldErrors.id_especialidad ??
                      ""
                    }
                  />
                )}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 2 }}
              display={"flex"}
              justifyContent={"center"}
            >
              <Typography
                variant="body1"
                textAlign={"center"}
                alignSelf={"center"}
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  lineHeight: { sm: "56px" },
                }}
              >
                {" "}
                {C.dominio}
              </Typography>
            </Grid>
          </Grid>

          <SAETextField
            label={C.employNames}
            value={dialogData.nombres}
            onChange={(e) =>
              handleDataChange("nombres", e.target.value, {
                setTouched: setTouchedFields,
                setErrors: setFieldErrors,
                validateFn: validateField,
              })
            }
            fullWidth
            error={Boolean(fieldErrors.nombres)}
            helperText={fieldErrors.nombres ?? ""}
          />
          <SAETextField
            label={C.employLastName}
            value={dialogData.apellidos}
            onChange={(e) =>
              handleDataChange("apellidos", e.target.value, {
                setTouched: setTouchedFields,
                setErrors: setFieldErrors,
                validateFn: validateField,
              })
            }
            fullWidth
            error={Boolean(fieldErrors.apellidos)}
            helperText={fieldErrors.apellidos ?? ""}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={closeDialog}
          disabled={dialogSaving}
        >
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={() => handleUsuariosSave()}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? C.create : C.save}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

function StudentSection() {
  const {
    estudianteBuscado,
    handleUsuariosSave,
    setEstudiante,
    loadingUsuarios,
    fetchUsuariosXLegajo,
  } = useEmploy();

  const {
    handleDataChange,
    dialogData,
    setDialogData,
    setDialogType,
    showNotification,
  } = useNotification();

  const [loadingCard, setLoadingCard] = useState(false);

  const handleStudentSearch = async (student) => {
    const resultado = await fetchUsuariosXLegajo(student);
    setDialogData({
      ...resultado,
      nombre_carrera: "",
      nombres: "a",
      apellidos: "b",
    }); //Para las validaciones
    setDialogType("usuarios");
    return resultado;
  };
  const handleStudentClear = () => {
    setEstudiante(null);
    setDialogData({ legajo: "", nombre_usuario: "" });
  };
  const handleSelectStudent = (student) => {
    setEstudiante(student);
  };
  const handleSearchedChange = async (field, value) => {
    const updatedStudent = { ...estudianteBuscado, [field]: value };
    setEstudiante(updatedStudent);
    setLoadingCard(true);
    await handleUsuariosSave(updatedStudent);
    setLoadingCard(false);
  };
  return (
    <Grid
      container
      spacing={2}
      my={{ xs: 2, md: 4 }}
      px={{ xs: 2, md: 4 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loadingUsuarios && (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <SAESpinner size="L" />
        </Stack>
      )}
      {!loadingUsuarios && !estudianteBuscado && (
        <Grid size={{ xs: 12 }} m={0}>
          <SearchStudent
            legajo={dialogData?.legajo ?? ""}
            onLegajoChange={(value) => handleDataChange("legajo", value)}
            onSelectStudent={handleSelectStudent}
            onClearStudent={handleStudentClear}
            onSearchStudent={handleStudentSearch}
            onError={showNotification}
          />
        </Grid>
      )}
      {!loadingUsuarios && estudianteBuscado && (
        <>
          <Grid
            size={{ xs: 2, md: 1 }}
            m={0}
            pl={{ xs: 0, md: 2 }}
            position={"relative"}
          >
            {loadingCard && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(255, 255, 255, 0.7)", // Fondo blanco semitransparente
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2, //
                  borderRadius: 3,
                  backdropFilter: "blur(2px)",
                }}
              >
                <SAESpinner size="S" />
              </Box>
            )}
            <SAETextField
              label={C.employID || ""}
              type="number"
              fullWidth
              value={estudianteBuscado?.id}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 10, md: 3 }} m={0}>
            <SAETextField
              label={C.studentID || ""}
              value={estudianteBuscado?.legajo ?? ""}
              disabled
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} m={0}>
            <SAETextField
              label={C.userName || ""}
              value={estudianteBuscado?.nombre_usuario ?? "Not Found"}
              disabled
              fullWidth
            />
          </Grid>
          <Grid
            size={{ xs: 6, md: 2 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={estudianteBuscado?.activo}
                  onChange={(e) =>
                    handleSearchedChange("activo", e.target.checked)
                  }
                  color="primary"
                />
              }
              disabled={loadingCard}
              label={
                estudianteBuscado.activo ? C.employActive : C.employNoActive
              }
            />
          </Grid>
          <Grid
            size={{ xs: 6, sm: 6, md: 2 }}
            m={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <SAEButton
              variant="outlined"
              onClick={handleStudentClear}
              startIcon={<CloseIcon />}
            >
              {C.clean}
            </SAEButton>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default function AdminEmployed() {
  return (
    <AdminUsersProvider>
      <EmployedAdminContent />
    </AdminUsersProvider>
  );
}
