import { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  Tab,
  Tabs,
  Chip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SearchStudent from "../../../assets/components/searchStudent/SearchStudent";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import { useScholarships } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import { getDialogTitle } from "../../../utils/util";
import {
  EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS,
  SCHOLARSHIP_TYPE_OPTIONS,
  SCHOLARSHIP_TYPES,
} from "../../../utils/common/constants";
import { getTodayInputDate } from "../../../utils/date.utils";
import { BECAS_STRINGS } from "../../../utils/strings/employed.strings";
import {
  createPreviewState,
  getDocumentId,
  hasDocumentFile,
  isPdfDocument,
} from "../../../utils/documents.utils";

const BS = BECAS_STRINGS.becarioDialog;

export default function DialogBecas() {
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
    handleSaveBecario,
    handleBuscarBecarioPorLegajo,
    handleBuscarBecario,
    handleBuscarDocumentacionBecario,
    handleDescargarDocumentacionBecario,
    proyectosRows,
    serviciosRows,
  } = useScholarships();
  const [fieldErrors, setFieldErrors] = useState({});
  const [becasAlumno, setBecasAlumno] = useState([]);
  const [activeBecaTab, setActiveBecaTab] = useState(0);
  const [loadingBecasAlumno, setLoadingBecasAlumno] = useState(false);
  const [documentationStatus, setDocumentationStatus] = useState(
    EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS,
  );
  const [loadingDocumentation, setLoadingDocumentation] = useState(false);
  const [preview, setPreview] = useState(createPreviewState());
  const open = dialogOpen && dialogType === "becario";
  const todayInputDate = getTodayInputDate();
  const showStudentSearch =
    dialogMode === "create" && !dialogData.nombre_becario;
  const showStudentData =
    dialogMode === "edit" || Boolean(dialogData.nombre_becario);
  const selectedScholarshipType =
    SCHOLARSHIP_TYPE_OPTIONS.find(
      (option) => option.tipo === dialogData.beca?.tipo,
    ) ?? null;
  const existingScholarshipTypes = becasAlumno.map((beca) => beca.tipo);
  const availableScholarshipTypeOptions = SCHOLARSHIP_TYPE_OPTIONS.filter(
    (option) => !existingScholarshipTypes.includes(option.tipo),
  );
  const canAddScholarship =
    showStudentData && availableScholarshipTypeOptions.length > 0;
  const hasAnyScholarship =
    becasAlumno.length > 0 || Boolean(dialogData.beca?.tipo);
  const hasEconomicScholarship =
    existingScholarshipTypes.includes(SCHOLARSHIP_TYPES.ECONOMICA) ||
    dialogData.beca?.tipo === SCHOLARSHIP_TYPES.ECONOMICA;
  const documentationGroups = useMemo(
    () => [
      {
        title: BS.commonDocumentation,
        documents: documentationStatus.common,
      },
      ...(hasEconomicScholarship
        ? [
            {
              title: BS.economicDocumentation,
              documents: documentationStatus.economic,
            },
          ]
        : []),
    ],
    [hasEconomicScholarship, documentationStatus],
  );
  const activeBeca = becasAlumno[activeBecaTab] ?? null;
  const activeBecaProjectId =
    activeBeca?.datos?.["proyecto_investigacion.id"] ??
    activeBeca?.datos?.proyecto_investigacion?.id ??
    "";
  const activeBecaServiceId =
    activeBeca?.datos?.["servicio.id"] ?? activeBeca?.datos?.servicio?.id ?? "";

  const fetchBecasAlumno = async (legajo) => {
    if (!legajo) return;

    try {
      setLoadingBecasAlumno(true);
      const becas = await handleBuscarBecario(legajo);
      setBecasAlumno(becas);
      handleDataChange("becas", becas);
      handleDataChange("originalBecas", JSON.parse(JSON.stringify(becas)));
      setActiveBecaTab(0);
    } catch {
      setBecasAlumno([]);
      setDialogError(BS.loadScholarshipsError);
    } finally {
      setLoadingBecasAlumno(false);
    }
  };

  const fetchDocumentationStatus = async (legajo) => {
    if (!legajo) {
      setDocumentationStatus(EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS);
      return;
    }

    try {
      setLoadingDocumentation(true);
      const status = await handleBuscarDocumentacionBecario(legajo);
      setDocumentationStatus(status);
    } catch {
      setDocumentationStatus(EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS);
      setDialogError(BS.documentationLoadError);
    } finally {
      setLoadingDocumentation(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setBecasAlumno([]);
      setDocumentationStatus(EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS);
      setActiveBecaTab(0);
      return;
    }

    if (dialogData.legajo) {
      fetchBecasAlumno(dialogData.legajo);
      fetchDocumentationStatus(dialogData.legajo);
    }
    // handleDataChange viene del dialog compartido y cambia de identidad al editar.
    // Este efecto debe depender solamente del legajo visible en el dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dialogData.legajo]);

  const getStudentName = (student = {}) =>
    student.nombre_usuario ??
    student.nombre_becario ??
    student.nombre ??
    student.Nombre ??
    "";

  const handleStudentSelect = (student) => {
    handleDataChange("legajo", student.legajo);
    handleDataChange("nombre_becario", getStudentName(student));
    fetchBecasAlumno(student.legajo);
    fetchDocumentationStatus(student.legajo);
  };

  const handleStudentClear = () => {
    handleDataChange("legajo", "");
    handleDataChange("nombre_becario", "");
    handleDataChange("beca", null);
    setDocumentationStatus(EMPTY_SCHOLARSHIP_DOCUMENTATION_STATUS);
    setBecasAlumno([]);
    setActiveBecaTab(0);
  };

  const handleScholarshipTypeChange = (option) => {
    setFieldErrors((prev) => ({ ...prev, beca: "" }));
    handleDataChange(
      "beca",
      option ? { tipo: option.tipo, modulos_asignados: "" } : null,
    );
  };

  const handleScholarshipTargetChange = (field, option) => {
    setFieldErrors((prev) => ({ ...prev, beca: "" }));
    handleDataChange("beca", {
      ...(dialogData.beca ?? {}),
      [field]: option?.id ?? "",
    });
  };

  const updateActiveBecaData = (changes) => {
    const nextBecas = becasAlumno.map((beca, index) =>
      index === activeBecaTab
        ? { ...beca, datos: { ...(beca.datos ?? {}), ...changes } }
        : beca,
    );

    setBecasAlumno(nextBecas);
    handleDataChange("becas", nextBecas);
  };

  const handleActiveBecaModulesChange = (value) => {
    const numberValue =
      value === "" ? "" : Math.min(Math.max(Number(value), 0), 3);

    updateActiveBecaData({
      modulos_asignados: Number.isNaN(numberValue) ? "" : String(numberValue),
    });
  };

  const handleActiveBecaTargetChange = (field, option) => {
    const relationField = field.split(".")[0];

    updateActiveBecaData({
      [field]: option?.id ?? "",
      [relationField]: option
        ? { ...(activeBeca?.datos?.[relationField] ?? {}), ...option }
        : null,
    });
  };

  const handleModulesChange = (value) => {
    setFieldErrors((prev) => ({ ...prev, modulos_asignados: "" }));

    if (value === "") {
      handleDataChange("beca", {
        ...(dialogData.beca ?? {}),
        modulos_asignados: "",
      });
      return;
    }

    const numberValue = Math.min(Math.max(Number(value), 0), 3);
    handleDataChange("beca", {
      ...(dialogData.beca ?? {}),
      modulos_asignados: String(Number.isNaN(numberValue) ? "" : numberValue),
    });
  };

  const handleYearChange = (value) => {
    setFieldErrors((prev) => ({ ...prev, anio_beca: "" }));
    handleDataChange(
      "anio_beca",
      String(value ?? "")
        .replace(/\D/g, "")
        .slice(0, 4),
    );
  };

  const handleDateChange = (value) => {
    setFieldErrors((prev) => ({ ...prev, fecha_solicitud: "" }));
    handleDataChange("fecha_solicitud", value);
  };

  const closePreview = () => {
    setPreview((previous) => ({
      ...previous,
      open: false,
      imageSrc: null,
    }));
  };

  const handlePreviewDocument = async (document) => {
    const documentId = getDocumentId(document);

    if (!documentId) return;

    setPreview({
      open: true,
      loading: true,
      title: document.nombre,
      imageSrc: null,
      isPdf: false,
      error: null,
    });

    try {
      const data = await handleDescargarDocumentacionBecario(documentId);
      setPreview({
        open: true,
        loading: false,
        title: document.nombre,
        imageSrc: data.datos_documento,
        isPdf: isPdfDocument(data),
        error: null,
      });
    } catch {
      setPreview((previous) => ({
        ...previous,
        loading: false,
        error: BS.previewLoadError,
      }));
    }
  };

  const renderDocumentationGroup = ({ title, documents }) => (
    <Grid key={title} size={{ xs: 12, md: 6 }} m={0}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" fontWeight="bold">
          {title}
        </Typography>
        {documents.map((document) => {
          const uploaded = hasDocumentFile(document);

          return (
            <Stack key={document.nombre} spacing={0.5}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">{document.nombre}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Chip
                    size="small"
                    color={uploaded ? "success" : "warning"}
                    label={uploaded ? BS.uploadedDocument : BS.missingDocument}
                  />
                  {uploaded && (
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewDocument(document)}
                      aria-label={BS.viewDocument}
                      title={BS.viewDocument}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Grid>
  );

  const validateBecarioData = () => {
    const errors = {};

    if (dialogMode === "create" && !dialogData.nombre_becario) {
      errors.student = BS.validationStudentRequired;
    }

    if (!dialogData.anio_beca) {
      errors.anio_beca = BS.validationYearRequired;
    } else if (!/^\d{4}$/.test(String(dialogData.anio_beca))) {
      errors.anio_beca = BS.validationYear;
    }

    if (!dialogData.fecha_solicitud) {
      errors.fecha_solicitud = BS.validationRequestDateRequired;
    } else if (String(dialogData.fecha_solicitud) > todayInputDate) {
      errors.fecha_solicitud = BS.validationFutureDate;
    }

    if (dialogMode === "create" || dialogData.beca?.tipo) {
      if (!dialogData.beca?.tipo) {
        errors.beca = BS.validationScholarshipType;
      } else if (existingScholarshipTypes.includes(dialogData.beca.tipo)) {
        errors.beca = BS.validationDuplicateScholarship;
      } else if (
        dialogData.beca.modulos_asignados === "" ||
        dialogData.beca.modulos_asignados === undefined ||
        Number(dialogData.beca.modulos_asignados) > 3
      ) {
        errors.modulos_asignados = BS.validationModules;
      } else if (
        dialogData.beca.tipo === SCHOLARSHIP_TYPES.INVESTIGACION &&
        !dialogData.beca["proyecto_investigacion.id"]
      ) {
        errors.beca = BS.validationResearchProject;
      } else if (
        dialogData.beca.tipo === SCHOLARSHIP_TYPES.SERVICIO &&
        !dialogData.beca["servicio.id"]
      ) {
        errors.beca = BS.validationInternalService;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveBecarioDialog = () => {
    if (!validateBecarioData()) return;

    handleSaveBecario();
  };

  return (
    <>
      <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" fontWeight="bold">
            {getDialogTitle(BS.entityTitle, dialogMode)}
          </Typography>
          <IconButton onClick={closeDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {dialogError && (
            <Alert
              severity="error"
              onClose={() => setDialogError("")}
              sx={{ mb: 2 }}
            >
              {dialogError}
            </Alert>
          )}

          <Stack spacing={2} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {dialogMode === "edit" && (
                <Grid size={{ xs: 12, md: 6 }} m={0}>
                  <SAETextField
                    label={BS.fieldId}
                    value={dialogData.id ?? ""}
                    disabled
                    fullWidth
                  />
                </Grid>
              )}
              {dialogMode === "edit" && (
                <Grid size={{ xs: 12, md: 6 }} m={0}>
                  <SAETextField
                    label={BS.fieldPreviousScholarshipHolderId}
                    value={dialogData.id_becario_previo ?? ""}
                    disabled
                    fullWidth
                  />
                </Grid>
              )}
              {showStudentSearch && (
                <Grid size={{ xs: 12, md: 12 }} m={0}>
                  <SearchStudent
                    legajo={dialogData.legajo ?? ""}
                    onLegajoChange={(value) =>
                      handleDataChange("legajo", value)
                    }
                    onSelectStudent={handleStudentSelect}
                    onClearStudent={handleStudentClear}
                    onSearchStudent={handleBuscarBecarioPorLegajo}
                    onError={setDialogError}
                    showValidationErrors={Boolean(fieldErrors.student)}
                    legajoError={BS.validationStudentRequired}
                    careerError={BS.validationCareerRequired}
                  />
                </Grid>
              )}
              {showStudentData && (
                <>
                  <Grid size={{ xs: 12, md: 5 }} m={0}>
                    <SAETextField
                      label={BS.fieldStudentId}
                      value={dialogData.legajo ?? ""}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }} m={0}>
                    <SAETextField
                      label={BS.fieldScholarshipHolderName}
                      value={dialogData.nombre_becario ?? ""}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  {dialogMode === "create" && (
                    <Grid
                      size={{ xs: 12, md: 2 }}
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
                        {BS.clear}
                      </SAEButton>
                    </Grid>
                  )}
                </>
              )}
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(dialogData.alquila)}
                      onChange={(event) =>
                        handleDataChange("alquila", event.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label={BS.fieldRent}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(dialogData.activo)}
                      onChange={(event) =>
                        handleDataChange("activo", event.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label={BS.fieldActive}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(dialogData.aceptado_inicio)}
                      onChange={(event) =>
                        handleDataChange(
                          "aceptado_inicio",
                          event.target.checked,
                        )
                      }
                      color="primary"
                    />
                  }
                  label={BS.fieldAcceptedStart}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(dialogData.puede_pagarle)}
                      onChange={(event) =>
                        handleDataChange("puede_pagarle", event.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label={BS.fieldCanPay}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} m={0}>
                <SAETextField
                  label={BS.fieldScholarshipYear}
                  value={dialogData.anio_beca ?? ""}
                  onChange={(event) => handleYearChange(event.target.value)}
                  error={Boolean(fieldErrors.anio_beca)}
                  helperText={fieldErrors.anio_beca ?? ""}
                  fullWidth
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      maxLength: 4,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} m={0}>
                <SAETextField
                  label={BS.fieldRequestDate}
                  type="date"
                  value={dialogData.fecha_solicitud ?? ""}
                  onChange={(event) => handleDateChange(event.target.value)}
                  error={Boolean(fieldErrors.fecha_solicitud)}
                  helperText={fieldErrors.fecha_solicitud ?? ""}
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      max: todayInputDate,
                    },
                  }}
                />
              </Grid>
              {showStudentData && (
                <Grid size={{ xs: 12 }} m={0}>
                  <Divider textAlign="center">
                    <Chip label={BS.scholarshipData}></Chip>
                  </Divider>
                </Grid>
              )}
              {showStudentData && (
                <Grid size={{ xs: 12 }} m={0}>
                  <Box>
                    {loadingBecasAlumno ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <Typography variant="body2">
                          {BS.searchingScholarships}
                        </Typography>
                      </Stack>
                    ) : becasAlumno.length > 0 ? (
                      <>
                        <Tabs
                          value={activeBecaTab}
                          onChange={(_event, value) => setActiveBecaTab(value)}
                          variant="scrollable"
                          scrollButtons="auto"
                          sx={{ mb: 2 }}
                        >
                          {becasAlumno.map((beca) => (
                            <Tab key={beca.tipo} label={beca.nombre} />
                          ))}
                        </Tabs>
                        <Grid container spacing={2}>
                          {activeBeca?.tipo ===
                            SCHOLARSHIP_TYPES.INVESTIGACION && (
                            <Grid size={{ xs: 12, md: 8 }} m={0}>
                              <Autocomplete
                                options={proyectosRows}
                                value={
                                  proyectosRows.find(
                                    (proyecto) =>
                                      String(proyecto.id) ===
                                      String(activeBecaProjectId),
                                  ) ?? null
                                }
                                onChange={(_event, option) =>
                                  handleActiveBecaTargetChange(
                                    "proyecto_investigacion.id",
                                    option,
                                  )
                                }
                                getOptionLabel={(option) =>
                                  String(
                                    option.nombre_proyecto_investigacion ?? "",
                                  )
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
                                fullWidth
                                renderInput={(params) => (
                                  <SAETextField
                                    {...params}
                                    label={BS.fieldProjectName}
                                  />
                                )}
                              />
                            </Grid>
                          )}
                          {activeBeca?.tipo === SCHOLARSHIP_TYPES.SERVICIO && (
                            <Grid size={{ xs: 12, md: 8 }} m={0}>
                              <Autocomplete
                                options={serviciosRows}
                                value={
                                  serviciosRows.find(
                                    (servicio) =>
                                      String(servicio.id) ===
                                      String(activeBecaServiceId),
                                  ) ?? null
                                }
                                onChange={(_event, option) =>
                                  handleActiveBecaTargetChange(
                                    "servicio.id",
                                    option,
                                  )
                                }
                                getOptionLabel={(option) =>
                                  String(option.nombre ?? "")
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
                                fullWidth
                                renderInput={(params) => (
                                  <SAETextField
                                    {...params}
                                    label={BS.fieldServiceName}
                                  />
                                )}
                              />
                            </Grid>
                          )}

                          <Grid size={{ xs: 12, md: 4 }} m={0}>
                            <SAETextField
                              label={BS.fieldModules}
                              type="number"
                              value={activeBeca?.datos?.modulos_asignados ?? ""}
                              onChange={(event) =>
                                handleActiveBecaModulesChange(
                                  event.target.value,
                                )
                              }
                              fullWidth
                              slotProps={{
                                htmlInput: {
                                  min: 0,
                                  max: 3,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {BS.noScholarships}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
              {showStudentData && hasAnyScholarship && (
                <>
                  <Grid size={{ xs: 12 }} m={0}>
                    <Divider textAlign="center">
                      <Chip label={BS.requiredDocumentation}></Chip>
                    </Divider>
                  </Grid>
                  <Grid size={{ xs: 12 }} m={0}>
                    {loadingDocumentation ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <Typography variant="body2">
                          {BS.loadingDocumentation}
                        </Typography>
                      </Stack>
                    ) : (
                      <Grid container spacing={2}>
                        {documentationGroups.map(renderDocumentationGroup)}
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
              {canAddScholarship && (
                <>
                  <Grid size={{ xs: 12 }} m={0}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {BS.addScholarship}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }} m={0}>
                    <Autocomplete
                      options={availableScholarshipTypeOptions}
                      value={selectedScholarshipType}
                      onChange={(_event, option) =>
                        handleScholarshipTypeChange(option)
                      }
                      getOptionLabel={(option) => option.nombre}
                      isOptionEqualToValue={(option, value) =>
                        option.tipo === value.tipo
                      }
                      fullWidth
                      renderInput={(params) => (
                        <SAETextField
                          {...params}
                          label={BS.fieldScholarshipType}
                          error={Boolean(fieldErrors.beca)}
                          helperText={fieldErrors.beca ?? ""}
                        />
                      )}
                    />
                  </Grid>

                  {dialogData.beca?.tipo ===
                    SCHOLARSHIP_TYPES.INVESTIGACION && (
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <Autocomplete
                        options={proyectosRows}
                        value={
                          proyectosRows.find(
                            (proyecto) =>
                              String(proyecto.id) ===
                              String(
                                dialogData.beca?.["proyecto_investigacion.id"],
                              ),
                          ) ?? null
                        }
                        onChange={(_event, option) =>
                          handleScholarshipTargetChange(
                            "proyecto_investigacion.id",
                            option,
                          )
                        }
                        getOptionLabel={(option) =>
                          String(option.nombre_proyecto_investigacion ?? "")
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        fullWidth
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label={BS.fieldProjectName}
                            error={Boolean(fieldErrors.beca)}
                            helperText={fieldErrors.beca ?? ""}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {dialogData.beca?.tipo === SCHOLARSHIP_TYPES.SERVICIO && (
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <Autocomplete
                        options={serviciosRows}
                        value={
                          serviciosRows.find(
                            (servicio) =>
                              String(servicio.id) ===
                              String(dialogData.beca?.["servicio.id"]),
                          ) ?? null
                        }
                        onChange={(_event, option) =>
                          handleScholarshipTargetChange("servicio.id", option)
                        }
                        getOptionLabel={(option) => String(option.nombre ?? "")}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        fullWidth
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label={BS.fieldServiceName}
                            error={Boolean(fieldErrors.beca)}
                            helperText={fieldErrors.beca ?? ""}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {dialogData.beca?.tipo && (
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <SAETextField
                        label={BS.fieldAssignedModules}
                        type="number"
                        value={dialogData.beca?.modulos_asignados ?? ""}
                        onChange={(event) =>
                          handleModulesChange(event.target.value)
                        }
                        error={Boolean(fieldErrors.modulos_asignados)}
                        helperText={fieldErrors.modulos_asignados ?? ""}
                        fullWidth
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: 3,
                          },
                        }}
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={closeDialog}
            disabled={dialogSaving}
          >
            {BS.cancel}
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleSaveBecarioDialog}
            disabled={dialogSaving}
            startIcon={
              dialogSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {" "}
            {dialogSaving ? BS.saving : BS.save}
          </SAEButton>
        </DialogActions>
      </Dialog>
      <DocumentPreviewDialog
        open={preview.open}
        onClose={closePreview}
        title={preview.title}
        imageSrc={preview.imageSrc}
        isPdf={preview.isPdf}
        loading={preview.loading}
        error={preview.error}
      />
    </>
  );
}
