import { useCallback, useState, useMemo } from "react";
import {
  Autocomplete,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
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
import { formatDate, toTimeInput } from "../../../utils/date.utils";
import { carreras } from "../../../utils/common/constants";
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
  const selectedSpecialtyId = hasValue(dialogData?.id_especialidad)
    ? dialogData.id_especialidad
    : (selectedMedic?.id_especialidad ?? null);
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
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Fecha y horario" size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label={C.turnsAppointment}
                        type="date"
                        value={dialogData.fecha_atencion}
                        onChange={(e) =>
                          handleDataChange("fecha_atencion", e.target.value)
                        }
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
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
                        minTime="00:00"
                        maxTime="23:59"
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
                onClick={handleTurnosSave}
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
