import { useCallback, useState, useMemo } from "react";
import {
  Autocomplete,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Container,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  Chip,
  Divider,
  Grid,
  Snackbar,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import SAEPage from "../../../assets/components/page/SAEPage";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";

import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useNotification } from "../../../shared/context/sharedContext";
import { useHealth } from "../../context/employedContext";
import {
  formatDate,
  getTodayInputDate,
  toTimeInput,
} from "../../../utils/date.utils";
import { calendarDays, carreras } from "../../../utils/common/constants";
import {
  formatAvailabilityRange,
  formatScheduleRange,
  getDayScheduleBounds,
  normalizeTimeValue,
  timeToMinutes,
} from "../../../utils/schedule.utils";
import { normalizeText } from "../../../utils/text.utils";
import { HEALTH_STRING } from "../../../utils/strings/employed.strings";

const C = HEALTH_STRING;
const PALETTE = [
  "#a0a0a0", //Pendiente
  "#1538B8", //Asignado
  "#d85656", //Cancelado
  "#a8cfff", //En curso
  "#6FA958", //Finalizado
  "#FF8E2C", //Reprogramado
];

const getTurnStatusColor = (statusId) =>
  PALETTE[Number(statusId)] ?? PALETTE[0];

const getTurnStatusTextColor = () => "white";

const getTurnStatusLabel = (statusId) => {
  switch (statusId) {
    case 0:
      return "Pendiente";
    case 1:
      return "Asignado";
    case 2:
      return "Cancelados";
    case 3:
      return "En Curso";
    case 4:
      return "Terminado";
    case 5:
      return "Reprogramar";
    default:
      return "Pendiente";
  }
};

const getMedicLabel = (medic) =>
  medic ? `${medic.apellido}, ${medic.nombre}` : "";

const normalizeMedicLabel = (value = "") =>
  String(value).replace(/,/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const getCalendarDayLabel = (value) =>
  calendarDays.find((day) => day.value === Number(value))?.label ?? "Dia";

const DAY_BY_NORMALIZED_LABEL = calendarDays.reduce((days, day) => {
  days[normalizeText(day.label)] = day.value;
  return days;
}, {});

const getDateCalendarDay = (value) => {
  if (!value) return null;

  const normalizedDate = String(value).substring(0, 10);
  const [year, month, day] = normalizedDate.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day).getDay();
};

const getTomorrowInputDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatDate(tomorrow, "input");
};

const isFutureWeekday = (value) => {
  const day = getDateCalendarDay(value);

  return (
    Boolean(value) &&
    String(value).substring(0, 10) > getTodayInputDate() &&
    day >= 1 &&
    day <= 5
  );
};

const isAppointmentInsideSchedules = (date, time, schedules = []) => {
  const day = getDateCalendarDay(date);
  const appointmentTime = timeToMinutes(time);

  if (day === null || appointmentTime === null) return true;

  return schedules.some((schedule) => {
    if (Number(schedule.dia) !== Number(day)) return false;

    const start = timeToMinutes(schedule.hora_inicio);
    const end = timeToMinutes(schedule.hora_fin);

    return (
      start !== null &&
      end !== null &&
      appointmentTime >= start &&
      appointmentTime <= end
    );
  });
};

const parseSubjectAvailabilities = (subject = "") => {
  const normalizedSubject = normalizeText(formatAvailabilityTimes(subject));
  if (!normalizedSubject) return [];

  const dayPattern = Object.keys(DAY_BY_NORMALIZED_LABEL).join("|");
  const availabilityPattern = new RegExp(
    `\\b(${dayPattern})\\b\\s+(\\d{1,2}:\\d{2})\\s*(?:hs\\.?\\s*)?(?:a|hasta|-)\\s*(\\d{1,2}:\\d{2})`,
    "g",
  );
  const availabilities = [];
  let match = availabilityPattern.exec(normalizedSubject);

  while (match) {
    availabilities.push({
      dia: DAY_BY_NORMALIZED_LABEL[match[1]],
      hora_inicio: normalizeTimeValue(match[2]),
      hora_fin: normalizeTimeValue(match[3]),
    });
    match = availabilityPattern.exec(normalizedSubject);
  }

  return availabilities;
};

const findSpecialtyInSubject = (subject = "", specialties = []) => {
  const normalizedSubject = normalizeText(subject);
  if (!normalizedSubject) return null;

  return (
    [...specialties]
      .filter((specialty) => normalizeText(specialty?.nombre))
      .sort(
        (a, b) =>
          normalizeText(b.nombre).length - normalizeText(a.nombre).length,
      )
      .find((specialty) =>
        normalizedSubject.includes(normalizeText(specialty.nombre)),
      ) ?? null
  );
};

const formatAvailabilityTimes = (value) =>
  String(value ?? "").replace(/\b(\d{1,2}:\d{2}):\d{2}\b/g, "$1");

export function TurnGrid() {
  const {
    //Visualizacion de Turnos No Activos
    loadingNoActivos,
    noActivosRows,
    noActivosColumns,

    pendienteTurnos,
    asignadoTurnos,
    enCursoTurnos,
    reprogramadoTurnos,
    loadingTurnos,
    openCreateTurnos,
    openEditTurnos,
    handleTurnosSave,
    setUsuarioSelected,
    usuarioSelected,
    loadingUsuario,
    fetchUsuariosXlegajo,
    openShowNoActivos,
    // Personal y estados
    personal,
    especialidadesActivas,
    estadosTurno,
    allHorarios,
    loadingHorarios,
  } = useHealth();

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

  const [careerSearch, setCareerSearch] = useState("");
  const [inactiveTurnsType, setInactiveTurnsType] = useState(null);
  const [showMedicSchedules, setShowMedicSchedules] = useState(false);
  const [showStudentAvailability, setShowStudentAvailability] = useState(false);

  const inactiveTurnsConfig = useMemo(
    () => ({
      inactiveTurns: {
        key: "inactiveTurns",
        title:
          inactiveTurnsType === "cancelados" ? C.turnsCancel : C.turnsFinish,
        icon: CalendarMonthIcon,
        rows: noActivosRows,
        columns: noActivosColumns,
        loading: loadingNoActivos,
        initialState: {
          sorting: {
            sortModel: [{ field: "fecha_atencion", sort: "desc" }],
          },
        },
      },
    }),
    [inactiveTurnsType, loadingNoActivos, noActivosColumns, noActivosRows],
  );

  const handleShowInactiveTurns = (type) => {
    if (inactiveTurnsType === type) {
      setInactiveTurnsType(null);
      return;
    }

    setInactiveTurnsType(type);
    openShowNoActivos(type);
  };

  const dialogStatus = Number(dialogData?.id_estado_turno ?? 0);
  const dialogStatusColor = getTurnStatusColor(dialogStatus);
  const dialogStatusTextColor = getTurnStatusTextColor(dialogStatus);
  const selectedMedic = useMemo(() => {
    const selectedByCuil = personal?.find(
      (medic) => String(medic.cuil) === String(dialogData?.cuil_medico),
    );

    if (selectedByCuil) return selectedByCuil;

    const dialogMedicName = normalizeMedicLabel(dialogData?.especialista);
    if (!dialogMedicName) return null;

    return (
      personal?.find(
        (medic) =>
          normalizeMedicLabel(getMedicLabel(medic)) === dialogMedicName,
      ) ?? null
    );
  }, [dialogData.cuil_medico, dialogData.especialista, personal]);
  const subjectSpecialty = useMemo(
    () =>
      findSpecialtyInSubject(dialogData?.asunto, especialidadesActivas ?? []),
    [dialogData?.asunto, especialidadesActivas],
  );
  const selectedSpecialtyId = hasValue(dialogData?.id_especialidad)
    ? dialogData.id_especialidad
    : (selectedMedic?.id_especialidad ?? subjectSpecialty?.id ?? null);
  const hasSelectedSpecialty = hasValue(selectedSpecialtyId);
  const selectedSpecialty = useMemo(
    () =>
      hasSelectedSpecialty
        ? (especialidadesActivas?.find(
            (specialty) => Number(specialty.id) === Number(selectedSpecialtyId),
          ) ?? null)
        : null,
    [especialidadesActivas, hasSelectedSpecialty, selectedSpecialtyId],
  );
  const filteredPersonal = useMemo(
    () =>
      hasSelectedSpecialty
        ? personal.filter(
            (medic) =>
              (medic.activo ||
                String(medic.cuil) === String(selectedMedic?.cuil)) &&
              Number(medic.id_especialidad) === Number(selectedSpecialtyId),
          )
        : [],
    [hasSelectedSpecialty, personal, selectedMedic?.cuil, selectedSpecialtyId],
  );
  const selectedMedicValue =
    selectedMedic &&
    (!hasSelectedSpecialty ||
      Number(selectedMedic.id_especialidad) === Number(selectedSpecialtyId))
      ? selectedMedic
      : null;
  const selectedMedicSchedules = useMemo(
    () =>
      selectedMedicValue
        ? allHorarios
            .filter(
              (schedule) =>
                String(schedule.cuil_especialista) ===
                String(selectedMedicValue.cuil),
            )
            .sort((a, b) => {
              const dayDiff = Number(a.dia) - Number(b.dia);
              if (dayDiff) return dayDiff;

              return timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio);
            })
        : [],
    [allHorarios, selectedMedicValue],
  );
  const studentAvailabilities = useMemo(
    () => parseSubjectAvailabilities(dialogData.asunto),
    [dialogData.asunto],
  );
  const appointmentOutsideMedicSchedules =
    selectedMedicValue &&
    selectedMedicSchedules.length > 0 &&
    dialogData.fecha_atencion &&
    dialogData.hora_atencion &&
    !isAppointmentInsideSchedules(
      dialogData.fecha_atencion,
      dialogData.hora_atencion,
      selectedMedicSchedules,
    );
  const selectedAppointmentDay = getDateCalendarDay(dialogData.fecha_atencion);
  const selectedDayMedicSchedules =
    selectedAppointmentDay === null
      ? []
      : selectedMedicSchedules.filter(
          (schedule) => Number(schedule.dia) === Number(selectedAppointmentDay),
        );
  const selectedDayStudentAvailabilities =
    selectedAppointmentDay === null
      ? []
      : studentAvailabilities.filter(
          (availability) =>
            Number(availability.dia) === Number(selectedAppointmentDay),
        );
  const { minTime: selectedDayMedicMinTime, maxTime: selectedDayMedicMaxTime } =
    getDayScheduleBounds(selectedMedicSchedules, selectedAppointmentDay);
  const {
    minTime: selectedDayStudentMinTime,
    maxTime: selectedDayStudentMaxTime,
  } = getDayScheduleBounds(studentAvailabilities, selectedAppointmentDay);
  const getGreaterMinTime = (firstTime, secondTime) =>
    timeToMinutes(firstTime) > timeToMinutes(secondTime)
      ? firstTime
      : secondTime;
  const getLowerMaxTime = (firstTime, secondTime) =>
    timeToMinutes(firstTime) < timeToMinutes(secondTime)
      ? firstTime
      : secondTime;
  const turnMinTime =
    selectedDayMedicSchedules.length > 0 &&
    selectedDayStudentAvailabilities.length > 0
      ? getGreaterMinTime(selectedDayMedicMinTime, selectedDayStudentMinTime)
      : selectedDayMedicSchedules.length > 0
        ? selectedDayMedicMinTime
        : selectedDayStudentAvailabilities.length > 0
          ? selectedDayStudentMinTime
          : "00:00";
  const turnMaxTime =
    selectedDayMedicSchedules.length > 0 &&
    selectedDayStudentAvailabilities.length > 0
      ? getLowerMaxTime(selectedDayMedicMaxTime, selectedDayStudentMaxTime)
      : selectedDayMedicSchedules.length > 0
        ? selectedDayMedicMaxTime
        : selectedDayStudentAvailabilities.length > 0
          ? selectedDayStudentMaxTime
          : "23:59";
  const appointmentOutsideStudentAvailabilities =
    studentAvailabilities.length > 0 &&
    dialogData.fecha_atencion &&
    dialogData.hora_atencion &&
    !isAppointmentInsideSchedules(
      dialogData.fecha_atencion,
      dialogData.hora_atencion,
      studentAvailabilities,
    );
  const dateIsInvalid =
    Boolean(dialogData.fecha_atencion) &&
    !isFutureWeekday(dialogData.fecha_atencion);

  const validateTurnScheduleBeforeSave = () => {
    if (dialogData.fecha_atencion && !isFutureWeekday(dialogData.fecha_atencion)) {
      setDialogError(
        "La fecha de atencion debe ser futura y de lunes a viernes.",
      );
      return false;
    }

    if (
      dialogData.fecha_atencion &&
      dialogData.hora_atencion &&
      studentAvailabilities.length > 0 &&
      !isAppointmentInsideSchedules(
        dialogData.fecha_atencion,
        dialogData.hora_atencion,
        studentAvailabilities,
      )
    ) {
      setDialogError(
        "El turno debe coincidir con la disponibilidad indicada por el estudiante.",
      );
      return false;
    }

    if (!selectedMedicValue || !dialogData.fecha_atencion || !dialogData.hora_atencion) {
      return true;
    }

    if (selectedMedicSchedules.length === 0) {
      setDialogError("El especialista seleccionado no tiene horarios cargados.");
      return false;
    }

    if (selectedDayMedicSchedules.length === 0) {
      setDialogError(
        "El especialista seleccionado no tiene disponibilidad para ese dia.",
      );
      return false;
    }

    if (
      !isAppointmentInsideSchedules(
        dialogData.fecha_atencion,
        dialogData.hora_atencion,
        selectedMedicSchedules,
      )
    ) {
      setDialogError(
        "El horario del turno debe estar dentro de la disponibilidad del especialista.",
      );
      return false;
    }

    return true;
  };

  const handleSaveTurn = () => {
    if (!validateTurnScheduleBeforeSave()) return;

    handleTurnosSave();
  };

  const handlePatientSearch = () => {
    const studentId = String(dialogData.legajo ?? "")
      .trim()
      .split("@")[0];

    if (!studentId) {
      setDialogError(C.turnsMissingID);
      return;
    }
    if (!careerSearch) {
      setDialogError(C.turnsMissingDegree);
      return;
    }

    setDialogError("");
    fetchUsuariosXlegajo(`${studentId}@${careerSearch}.frc.utn.edu.ar`);
  };

  return (
    <>
      <SAEPage>
        <HeaderPageEmployed
          header={C.turnsHeader}
          title={C.turnsTitle}
          backTo="/Gestion-Salud"
        />

        {loadingTurnos && (
          <Stack alignItems="center" gap={1}>
            <SAESpinner size="L" />
          </Stack>
        )}
        {!loadingTurnos && (
          <>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
                overflow: "hidden",
                mt: 1,
                mb: 2,
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
                    {/* <DashboardIcon sx={{ fontSize: 32 }} /> */}
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {C.turnsCreation}
                      </Typography>
                    </Box>
                  </Stack>
                  <SAEButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreateTurnos}
                    sx={{
                      whiteSpace: "nowrap",
                      bgcolor: "rgba(255,255,255,0.18)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.4)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                    }}
                  >
                    {C.turnsCreationButton}
                  </SAEButton>
                </Stack>
              </Box>
            </Card>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }} m={0}>
                <TurnList
                  listadoTurnos={pendienteTurnos}
                  estadoActual={0}
                  editAction={openEditTurnos}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} m={0}>
                <TurnList
                  listadoTurnos={reprogramadoTurnos}
                  estadoActual={5}
                  editAction={openEditTurnos}
                />
              </Grid>
            </Grid>

            <TurnList
              listadoTurnos={asignadoTurnos}
              estadoActual={1}
              editAction={openEditTurnos}
            />
            <TurnList
              listadoTurnos={enCursoTurnos}
              estadoActual={3}
              editAction={openEditTurnos}
            />
            <Grid container spacing={1}>
              <Grid size={{ xs: 6 }} m={0}>
                <TurnList
                  listadoTurnos={[]}
                  estadoActual={4}
                  onShowInactive={handleShowInactiveTurns}
                  inactiveTurnsType={inactiveTurnsType}
                />
              </Grid>
              <Grid size={{ xs: 6 }} m={0}>
                <TurnList
                  listadoTurnos={[]}
                  estadoActual={2}
                  onShowInactive={handleShowInactiveTurns}
                  inactiveTurnsType={inactiveTurnsType}
                />
              </Grid>
            </Grid>

            {inactiveTurnsType && (
              <Box sx={{ mt: 3 }}>
                <SAEDataGrid
                  sectionConfig={inactiveTurnsConfig}
                  currentSection="inactiveTurns"
                />
              </Box>
            )}
          </>
        )}

        {dialogOpen && dialogType === "turnos" && (
          <Dialog
            open={dialogOpen}
            onClose={closeDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { width: "min(900px, calc(100% - 32px))" },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: dialogStatusColor,
                color: dialogStatusTextColor,
                transition: "background-color 0.2s ease",
              }}
            >
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                {dialogMode === "create" ? C.turnsCreation : C.turnsEdit}
              </Typography>
              <IconButton onClick={closeDialog} size="small" color="inherit">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ pt: 1.5 }}>
                {dialogError && (
                  <Alert severity="error" onClose={() => setDialogError("")}>
                    {dialogError}
                  </Alert>
                )}
                <>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Solicitante" size="small" />
                      </Divider>
                    </Grid>
                    {dialogMode === "create" && (
                      <Grid size={{ xs: 12 }} m={0}>
                        {/* CASO A: No hay usuario seleccionado -> Mostramos el buscador */}
                        {!usuarioSelected ? (
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            alignItems={{ sm: "flex-start" }}
                            sx={{ mb: 1 }}
                          >
                            <SAETextField
                              label={C.turnsUserId}
                              value={dialogData.legajo}
                              onChange={(e) =>
                                handleDataChange("legajo", e.target.value)
                              }
                              fullWidth
                              disabled={loadingUsuario}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handlePatientSearch();
                              }}
                            />
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontWeight: 700,
                                lineHeight: { sm: "56px" },
                              }}
                            >
                              @
                            </Typography>
                            <Autocomplete
                              options={carreras}
                              value={
                                carreras.find(
                                  (career) => career.value === careerSearch,
                                ) ?? null
                              }
                              onChange={(_event, career) =>
                                setCareerSearch(career?.value ?? "")
                              }
                              getOptionLabel={(career) => career.label}
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              }
                              disabled={loadingUsuario}
                              fullWidth
                              renderInput={(params) => (
                                <SAETextField {...params} label="Carrera" />
                              )}
                            />
                            <Stack
                              direction="row"
                              alignItems="center"
                              sx={{ minHeight: 56 }}
                            >
                              <Typography
                                color="text.secondary"
                                fontWeight={700}
                                whiteSpace="nowrap"
                              >
                                .frc.utn.edu.ar
                              </Typography>
                              {loadingUsuario ? (
                                <CircularProgress size={24} sx={{ ml: 1 }} />
                              ) : (
                                <IconButton
                                  onClick={handlePatientSearch}
                                  aria-label="Buscar paciente"
                                >
                                  <SearchIcon />
                                </IconButton>
                              )}
                            </Stack>
                          </Stack>
                        ) : (
                          /* CASO B: Usuario encontrado -> Mostramos resultado y opción de limpiar */
                          <Box
                            sx={{
                              p: 2,
                              border: "1px solid #ccc",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {C.turnsUser}
                            </Typography>
                            {/* Reemplazá esto con los campos reales de tu objeto "usuarioSelected" */}
                            <Typography variant="body1">
                              {usuarioSelected.nombre_usuario}
                            </Typography>

                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => setUsuarioSelected(null)} // Resetea para permitir volver a buscar
                              sx={{ mt: 2 }}
                            >
                              {C.turnsUserSearchAgain}
                            </Button>
                          </Box>
                        )}
                      </Grid>
                    )}
                    {dialogMode === "edit" && (
                      <>
                        <Grid size={{ xs: 12, md: 2 }} m={0}>
                          <SAETextField
                            label={C.turnsId}
                            type="number"
                            fullWidth
                            value={dialogData.id}
                            onChange={(e) =>
                              handleDataChange("id", e.target.value)
                            }
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }} m={0}>
                          <SAETextField
                            label={C.turnsPacientName}
                            value={dialogData.paciente}
                            onChange={(e) =>
                              handleDataChange("paciente", e.target.value)
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }} m={0}>
                          <SAETextField
                            label={C.turnsUserId}
                            value={dialogData.legajo}
                            onChange={(e) =>
                              handleDataChange("legajo", e.target.value)
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip
                          label="Especialidad y especialista"
                          size="small"
                        />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <Autocomplete
                        disablePortal
                        options={especialidadesActivas}
                        getOptionLabel={(option) => option.nombre}
                        onChange={(_event, newValue) => {
                          handleDataChange(
                            "id_especialidad",
                            newValue ? newValue.id : null,
                          );
                          if (
                            !newValue ||
                            Number(selectedMedic?.id_especialidad) !==
                              Number(newValue.id)
                          ) {
                            handleDataChange("cuil_medico", null);
                            handleDataChange("especialista", "");
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        value={selectedSpecialty}
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label={C.employSpeciality}
                            inputProps={{
                              ...params.inputProps,
                              readOnly: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <Autocomplete
                        disablePortal
                        options={filteredPersonal}
                        getOptionLabel={getMedicLabel}
                        disabled={!hasSelectedSpecialty}
                        onChange={(_event, newValue) => {
                          // 'newValue' es el objeto completo del perfil seleccionado (o null)
                          if (newValue) {
                            handleDataChange("cuil_medico", newValue.cuil);
                            handleDataChange(
                              "especialista",
                              getMedicLabel(newValue),
                            );
                            handleDataChange(
                              "id_especialidad",
                              newValue.id_especialidad,
                            );
                          } else {
                            // Maneja el caso de que se borre la selección
                            handleDataChange("cuil_medico", null);
                            handleDataChange("especialista", "");
                          }
                        }}
                        // Asegura que la comparación se haga por id
                        isOptionEqualToValue={(option, value) =>
                          String(option.cuil) === String(value.cuil)
                        }
                        value={selectedMedicValue} // Pasa el objeto completo
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label={C.turnsMedic}
                            helperText={
                              hasSelectedSpecialty
                                ? undefined
                                : "Seleccioná una especialidad para filtrar"
                            }
                            inputProps={{
                              ...params.inputProps,
                              readOnly: true, // Esto evita la escritura
                            }}
                          />
                        )}
                      />
                    </Grid>
                    {selectedMedicValue && (
                      <Grid size={{ xs: 12 }} m={0}>
                        <Stack
                          spacing={1}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#F8FBFF",
                            border: "1px solid #DCE7F5",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#153b6f", fontWeight: 800 }}
                          >
                            Horarios disponibles de {getMedicLabel(selectedMedicValue)}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setShowMedicSchedules((current) => !current)
                            }
                            endIcon={
                              showMedicSchedules ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )
                            }
                            sx={{ alignSelf: "flex-start" }}
                          >
                            {showMedicSchedules ? "Ocultar" : "Ver horarios"}
                          </Button>
                          <Collapse in={showMedicSchedules} unmountOnExit>
                            {loadingHorarios ? (
                              <Stack direction="row" alignItems="center" gap={1}>
                                <CircularProgress size={18} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Cargando horarios...
                                </Typography>
                              </Stack>
                            ) : selectedMedicSchedules.length > 0 ? (
                              <Stack direction="row" flexWrap="wrap" gap={1}>
                                {selectedMedicSchedules.map(
                                  (schedule, index) => (
                                    <Chip
                                      key={`${schedule.cuil_especialista}-${schedule.dia}-${schedule.hora_inicio}-${schedule.hora_fin}-${index}`}
                                      icon={<AccessTimeIcon />}
                                      label={formatScheduleRange(
                                        schedule,
                                        getCalendarDayLabel,
                                      )}
                                      sx={{
                                        bgcolor: "#E7F1FF",
                                        color: "#153b6f",
                                        fontWeight: 700,
                                        height: "auto",
                                        minHeight: 32,
                                        "& .MuiChip-label": {
                                          whiteSpace: "normal",
                                          py: 0.5,
                                        },
                                      }}
                                    />
                                  ),
                                )}
                              </Stack>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Este especialista no tiene horarios cargados.
                              </Typography>
                            )}
                          </Collapse>
                          {appointmentOutsideMedicSchedules && (
                            <Alert severity="warning">
                              La fecha y hora seleccionadas no coinciden con los
                              horarios disponibles del especialista.
                            </Alert>
                          )}
                          {selectedMedicValue &&
                            dialogData.fecha_atencion &&
                            selectedDayMedicSchedules.length === 0 &&
                            !dateIsInvalid && (
                              <Alert severity="warning">
                                El especialista no tiene disponibilidad para el
                                dia seleccionado.
                              </Alert>
                            )}
                        </Stack>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Fecha y horario" size="small" />
                      </Divider>
                    </Grid>
                    {studentAvailabilities.length > 0 && (
                      <Grid size={{ xs: 12 }} m={0}>
                        <Stack
                          spacing={1}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#F8FBFF",
                            border: "1px solid #DCE7F5",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#153b6f", fontWeight: 800 }}
                          >
                            Disponibilidad indicada por el estudiante
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setShowStudentAvailability((current) => !current)
                            }
                            endIcon={
                              showStudentAvailability ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )
                            }
                            sx={{ alignSelf: "flex-start" }}
                          >
                            {showStudentAvailability
                              ? "Ocultar"
                              : "Ver disponibilidad"}
                          </Button>
                          <Collapse in={showStudentAvailability} unmountOnExit>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {studentAvailabilities.map(
                                (availability, index) => (
                                  <Chip
                                    key={`${availability.dia}-${availability.hora_inicio}-${availability.hora_fin}-${index}`}
                                    icon={<AccessTimeIcon />}
                                    label={formatAvailabilityRange(
                                      {
                                        dia: availability.dia,
                                        hora_desde: availability.hora_inicio,
                                        hora_hasta: availability.hora_fin,
                                      },
                                      getCalendarDayLabel,
                                    )}
                                    sx={{
                                      bgcolor: "#FFFFFF",
                                      border: "1px solid #B7CBE5",
                                      color: "#153b6f",
                                      fontWeight: 700,
                                      height: "auto",
                                      minHeight: 32,
                                      "& .MuiChip-label": {
                                        whiteSpace: "normal",
                                        py: 0.5,
                                      },
                                    }}
                                  />
                                ),
                              )}
                            </Stack>
                          </Collapse>
                          {appointmentOutsideStudentAvailabilities && (
                            <Alert severity="warning">
                              La fecha y hora seleccionadas no coinciden con la
                              disponibilidad indicada por el estudiante.
                            </Alert>
                          )}
                          {dialogData.fecha_atencion &&
                            selectedDayStudentAvailabilities.length === 0 &&
                            !dateIsInvalid && (
                              <Alert severity="warning">
                                El estudiante no indicó disponibilidad para el
                                día seleccionado.
                              </Alert>
                            )}
                        </Stack>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label={C.turnsAppointment}
                        type="date"
                        value={dialogData.fecha_atencion}
                        onChange={(e) =>
                          handleDataChange("fecha_atencion", e.target.value)
                        }
                        fullWidth
                        error={dateIsInvalid}
                        helperText={
                          dateIsInvalid
                            ? "La fecha debe ser futura y de lunes a viernes."
                            : appointmentOutsideStudentAvailabilities
                              ? "Elegí un horario dentro de la disponibilidad del estudiante."
                              : ""
                        }
                        slotProps={{
                          htmlInput: { min: getTomorrowInputDate() },
                          inputLabel: { shrink: true },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label={C.turnsHour}
                        value={
                          dialogData?.hora_atencion?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("hora_atencion", value)
                        }
                        minTime={
                          selectedDayMedicSchedules.length > 0 ||
                          selectedDayStudentAvailabilities.length > 0
                            ? turnMinTime
                            : "00:00"
                        }
                        maxTime={
                          selectedDayMedicSchedules.length > 0 ||
                          selectedDayStudentAvailabilities.length > 0
                            ? turnMaxTime
                            : "23:59"
                        }
                        error={Boolean(
                          appointmentOutsideMedicSchedules ||
                            appointmentOutsideStudentAvailabilities,
                        )}
                        helperText={
                          appointmentOutsideMedicSchedules
                            ? "Elegí un horario disponible del especialista."
                            : ""
                        }
                        size="big"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Asunto" size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        label={C.turnsSubject}
                        value={formatAvailabilityTimes(dialogData.asunto)}
                        onChange={(e) =>
                          handleDataChange("asunto", e.target.value)
                        }
                        multiline
                        fullWidth
                        rows={4} // Número inicial de filas
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label={C.turnsState} size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <Autocomplete
                        disablePortal
                        options={estadosTurno}
                        getOptionLabel={(option) => option.estado_turno}
                        onChange={(event, newValue) => {
                          // 'newValue' es el objeto completo del perfil seleccionado (o null)
                          if (newValue) {
                            handleDataChange(
                              "id_estado_turno",
                              newValue.id_estado_turno,
                            );
                          } else {
                            // Maneja el caso de que se borre la selección
                            handleDataChange("id_estado_turno", null);
                          }
                        }}
                        // Asegura que la comparación se haga por id
                        isOptionEqualToValue={(option, value) =>
                          option.id_estado_turno === value.id_estado_turno
                        }
                        value={
                          estadosTurno?.find(
                            (estado) =>
                              estado.id_estado_turno ===
                              dialogData?.id_estado_turno,
                          ) ?? null
                        }
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label="Estados"
                            inputProps={{
                              ...params.inputProps,
                              readOnly: true, // Esto evita la escritura
                            }}
                          />
                        )}
                        renderValue={(value) =>
                          value ? (
                            <Chip
                              label={value.estado_turno}
                              sx={{
                                bgcolor: getTurnStatusColor(
                                  value.id_estado_turno,
                                ),
                                color: getTurnStatusTextColor(
                                  value.id_estado_turno,
                                ),
                                fontSize: "1rem",
                                fontWeight: 800,
                                height: 40,
                                px: 1,
                                borderRadius: 2,
                                minWidth: 150,
                                "& .MuiChip-label": {
                                  px: 1.5,
                                },
                              }}
                            />
                          ) : null
                        }
                        renderOption={(props, option) => {
                          const { key, ...optionProps } = props;

                          return (
                            <Box component="li" key={key} {...optionProps}>
                              <Chip
                                label={option.estado_turno}
                                sx={{
                                  bgcolor: getTurnStatusColor(
                                    option.id_estado_turno,
                                  ),
                                  color: getTurnStatusTextColor(
                                    option.id_estado_turno,
                                  ),
                                  fontWeight: 800,
                                  height: 34,
                                  minWidth: 130,
                                  justifyContent: "center",
                                  "& .MuiChip-label": {
                                    width: "100%",
                                    textAlign: "center",
                                  },
                                }}
                              />
                            </Box>
                          );
                        }}
                      />
                    </Grid>
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
                onClick={handleSaveTurn}
                disabled={dialogSaving}
                startIcon={
                  dialogSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : dialogMode === "create" ? (
                    <AddIcon />
                  ) : (
                    <SaveOutlinedIcon />
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
      </SAEPage>
    </>
  );
}

function TurnList({
  listadoTurnos,
  estadoActual,
  editAction,
  onShowInactive,
  inactiveTurnsType,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const { handleTurnosChangeState, loadingTurnos } = useHealth();

  const handleDrop = useCallback(
    async (e, nuevoEstado) => {
      e.preventDefault();
      const idRecuperado = e.dataTransfer.getData("text/plain");

      if (!idRecuperado) return;

      await handleTurnosChangeState(idRecuperado, nuevoEstado);
    },
    [handleTurnosChangeState],
  );
  const inactiveType = estadoActual === 2 ? "cancelados" : "finalizados";
  const isInactiveListOpen = inactiveTurnsType === inactiveType;
  const statusColor = getTurnStatusColor(estadoActual);
  const statusLabel = getTurnStatusLabel(estadoActual);
  const turnsCount = listadoTurnos?.length ?? 0;

  return (
    <>
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          setIsDragOver(false);
          handleDrop(e, estadoActual);
        }}
        sx={{
          borderRadius: 4,
          boxShadow: isDragOver
            ? `0 22px 48px ${statusColor}33`
            : "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          mt: 3,
          border: "2px solid",
          borderColor: isDragOver ? statusColor : "lightGray",
          transform: isDragOver ? "translateY(-2px)" : "none",
          transition:
            "border-color .18s ease, box-shadow .18s ease, transform .18s ease",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background: statusColor,
            color: "white",
            minHeight: 50,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            transition: "box-shadow .18s ease",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <AccessTimeIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5">{statusLabel}</Typography>
              </Box>
            </Stack>
            {
              /*Estados cancelados y finalizados */
              (estadoActual === 2 || estadoActual === 4) && (
                <SAEButton
                  variant="contained"
                  startIcon={
                    isInactiveListOpen ? <CloseIcon /> : <VisibilityIcon />
                  }
                  onClick={() => onShowInactive?.(inactiveType)}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: isInactiveListOpen
                      ? "rgba(0,0,0,0.22)"
                      : "rgba(255,255,255,0.92)",
                    color: isInactiveListOpen ? "white" : PALETTE[estadoActual],
                    mt: 2,
                    border: "1px solid rgba(255,255,255,0.65)",
                    "&:hover": {
                      bgcolor: isInactiveListOpen
                        ? "rgba(0,0,0,0.32)"
                        : "white",
                    },
                  }}
                >
                  {isInactiveListOpen ? "Ocultar Turnos" : "Ver Turnos"}
                </SAEButton>
              )
            }
            {estadoActual !== 2 && estadoActual !== 4 && (
              <Chip
                size="large"
                label={`${turnsCount} ${turnsCount === 1 ? "turno" : "turnos"}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.92)",
                  color: statusColor,
                  fontWeight: 800,
                  minWidth: 112,
                  height: 38,
                  fontSize: "1rem",
                  "& .MuiChip-label": {
                    px: 2,
                  },
                }}
              />
            )}
          </Stack>
        </Box>
        {/*Lo organizo de esta forma para reciclar el componente. */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            gap: 2,
            overflowX: "auto",
            maxHeight: { xs: 430, md: 470 },
            //Solo los estados a pendiente y a reprogramar tienen esta altura minima
            minHeight:
              estadoActual === 0 || estadoActual === 5 || isDragOver
                ? 250
                : "none",
            paddingX: 1,
            paddingY: 0.5,
            pr: 1.5,
            bgcolor: isDragOver ? `${statusColor}14` : "transparent",
            outline: isDragOver ? `1px solid ${statusColor}40` : "none",
            outlineOffset: -8,
            transition: "background-color .18s ease, outline-color .18s ease",
            scrollbarColor: "rgba(21, 61, 113, 0.45) rgba(21, 61, 113, 0.08)",
            // Opcional: Ocultar o estilizar la barra de scroll
            "&::-webkit-scrollbar": { height: "6px", width: "8px" },
            "&::-webkit-scrollbar-track": {
              bgcolor: "rgba(21, 61, 113, 0.08)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(21, 61, 113, 0.45)",
              borderRadius: "4px",
            },
          }}
        >
          {isDragOver && (
            <Box
              sx={{
                position: "absolute",
                inset: 12,
                borderRadius: 3,
                border: `1px solid ${statusColor}55`,
                bgcolor: "rgba(255,255,255,0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 2,
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.55), 0 10px 28px ${statusColor}1f`,
              }}
            >
              <Stack alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    bgcolor: statusColor,
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: `0 10px 22px ${statusColor}66`,
                  }}
                >
                  <AccessTimeIcon />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#153b6f", fontWeight: 900 }}
                >
                  {C.turnsDropToState} {statusLabel}
                </Typography>
              </Stack>
            </Box>
          )}
          {loadingTurnos && listadoTurnos && (
            <Grid
              width={"100%"}
              container
              alignItems="center"
              justifyContent="center"
            >
              <SAESpinner></SAESpinner>
            </Grid>
          )}
          {!loadingTurnos &&
            listadoTurnos &&
            estadoActual !== 2 &&
            estadoActual !== 4 &&
            //ESTAS SON LAS TARJETAS QUE VES ADENTRO DEL COMPONENTE
            listadoTurnos.map((turno) => (
              <Card
                draggable
                onDragStart={(e) => {
                  // Guardamos el id como texto dentro del evento de arrastre
                  e.dataTransfer.setData("text/plain", turno.id.toString());
                }}
                onDragEnd={(e) => e.dataTransfer.setData("text/plain", null)}
                key={turno.id}
                variant="outlined"
                sx={{
                  minWidth: 260, // Ancho fijo mínimo para mantener consistencia
                  maxWidth: 400,
                  my: 2,
                  cursor: "grab",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardActionArea onClick={() => editAction(turno)}>
                  <CardContent sx={{ "&:last-child": { paddingBottom: 2 } }}>
                    {/* Cabecera: Nombre y Estado */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.0}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6f8099",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                          }}
                        >
                          Fecha solicitud
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#153b6f",
                            fontWeight: 800,
                            lineHeight: 1.2,
                          }}
                        >
                          {formatDate(turno.fecha_solicitud, "short") ||
                            C.turnsNoDate}
                        </Typography>
                      </Box>

                      <Chip
                        label={turno.estado || C.turnsNoState}
                        size="small"
                        sx={{
                          bgcolor: PALETTE[estadoActual],
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    {/* Datos Mínimos: Fecha y Hora */}
                    <Stack spacing={1} mt={1.5}>
                      <Stack spacing={0.25}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6f8099",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                          }}
                        >
                          Solicitante
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--primary)",
                            fontWeight: 600,
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {turno.paciente || C.turnsNoName}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.25}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6f8099",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                          }}
                        >
                          Atiende
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--primary)",
                            fontWeight: 600,
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {turno.especialista || C.turnsNoMedic}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.25}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6f8099",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                          }}
                        >
                          Asunto
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--primary)",
                            display: "-webkit-box",
                            fontWeight: 600,
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {formatAvailabilityTimes(turno.asunto) ||
                            C.turnsNoSubject}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(turno.fecha_atencion, "short") ||
                            C.turnsNoAppointment}
                        </Typography>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {toTimeInput(turno.hora_atencion) || C.turnsNoHour}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Box>
      </Card>
    </>
  );
}

// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function TurnBoardHealth() {
  return (
    <HealthUsersProvider>
      <TurnGrid />
    </HealthUsersProvider>
  );
}
