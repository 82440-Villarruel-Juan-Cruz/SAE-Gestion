import {
  Alert,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Chip,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useMemo, useState } from "react";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAESwitch from "../../../assets/components/buttons/SAESwitch";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import NewsPreviewDialog from "../../../assets/components/studentNews/newsPreviewDialog.jsx";
import SchoolIcon from "@mui/icons-material/School";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import NovedadesEstudiantiles from "../../../assets/components/studentNews/studentNews";
import { useNotification } from "../../../shared/context/sharedContext.js";
import { usePress } from "../../context/employedContext";
import { PressProvider } from "../../context/providers/pressProvider";
import SAEPage from "../../../assets/components/page/SAEPage";
import SAEDeleteDialog from "../../../assets/components/popUp/SAEDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import { PRENSA_STRINGS } from "../../../utils/strings/employed.strings";
import { getTipoDocumento } from "../../../utils/documents.utils";
import { getPrioridadOptions } from "../../../utils/datagrid.utils.jsx";
import { isValidText } from "../../../utils/validation.utils";

const PSN = PRENSA_STRINGS.nueva;
const C = PRENSA_STRINGS;
const PRIORIDAD_OPTIONS = getPrioridadOptions(C);

function AdministrarPrensaContent() {
  const {
    //DataGrid
    publicacionesRows,
    publicacionesColumns,
    publicacionesLoading,
    openCreatePublicacion,

    //Preview de la noticia
    selectedPub,
    handleClose,
    loadingDocs,
    documentos,
    handleOpenPreview,
    documentPreviewDialogProps,
  } = usePress();

  const activeSection = "publicaciones";
  const sectionConfig = useMemo(
    () => ({
      publicaciones: {
        key: "publicaciones",
        title: "Publicaciones",
        dialog: openCreatePublicacion,
        addButton: "Nueva Publicacion",
        icon: SchoolIcon,
        rows: publicacionesRows,
        columns: publicacionesColumns,
        loading: publicacionesLoading,
      },
    }),
    [publicacionesRows, publicacionesColumns, publicacionesLoading,openCreatePublicacion],
  );
  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );
  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.headerTitle}
        title={C.headerSubtitle}
        description={C.headerDescription}
      />
      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />

      <Box sx={{ mt: 5 }}>
        <NovedadesEstudiantiles trackViews={false} />
      </Box>

      <NuevaPublicacionDialog />

      <NewsPreviewDialog
        open={!!selectedPub}
        onClose={handleClose}
        title={selectedPub?.titulo_publicacion}
        date={
          selectedPub?.fecha_inicio
            ? new Date(selectedPub.fecha_inicio).toLocaleDateString("es-AR")
            : ""
        }
        description={selectedPub?.descripcion}
        documents={loadingDocs ? [] : documentos}
        onPreviewDocument={handleOpenPreview}
      />

      <DocumentPreviewDialog {...documentPreviewDialogProps} />

      <DialogPress />
    </SAEPage>
  );
}

function NuevaPublicacionDialog() {
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
    docMode,
    archivo,
    busquedaDoc,
    page,
    loadingDocs,
    docSeleccionado,
    docsFiltrados,
    docsPaginados,
    totalPages,
    preview,
    handleDocModeChange,
    setArchivo,
    setDocSeleccionado,
    setBusquedaDoc,
    setPage,
    handlePreview,
    closePreview,
    handleSavePublication,
  } = usePress();
  const open = dialogOpen && dialogType === "pressPublication";
  const nuevaData = dialogData;
  const saving = dialogSaving;
  const isEdit = dialogMode === "edit";
  const [fieldErrors, setFieldErrors] = useState({});

  const isBlank = (value) => String(value ?? "").trim() === "";

  const handleCloseDialog = () => {
    setFieldErrors({});
    closeDialog();
  };

  const clearFieldError = (field) => {
    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  };

  const handlePublicationFieldChange = (field, value) => {
    clearFieldError(field);
    setDialogError("");
    handleDataChange(field, value);
  };

  const validatePublicationDialog = () => {
    const errors = {};

    if (isBlank(nuevaData.titulo_publicacion)) {
      errors.titulo_publicacion = PSN.validationTitleRequired;
    } else if (!isValidText(nuevaData.titulo_publicacion)) {
      errors.titulo_publicacion = PSN.validationTitleFormat;
    }
    if (isBlank(nuevaData.descripcion)) {
      errors.descripcion = PSN.validationDescriptionRequired;
    }
    if (isBlank(nuevaData.fecha_inicio)) {
      errors.fecha_inicio = PSN.validationStartDateRequired;
    }
    if (isBlank(nuevaData.fecha_vigencia)) {
      errors.fecha_vigencia = PSN.validationEndDateRequired;
    } else if (
      !isBlank(nuevaData.fecha_inicio) &&
      nuevaData.fecha_vigencia < nuevaData.fecha_inicio
    ) {
      errors.fecha_vigencia = PSN.validationEndDateAfterStart;
    }
    if (
      !isEdit &&
      ((docMode === "subir" && !archivo) ||
        (docMode === "existente" && !docSeleccionado))
    ) {
      errors.documento = PSN.validationDocumentRequired;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setDialogError(PSN.validationFormError);
      return false;
    }

    setDialogError("");
    return true;
  };

  const handleSaveClick = () => {
    if (!validatePublicationDialog()) return;

    handleSavePublication();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        {nuevaData && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {isEdit ? PSN.editTitle : PSN.title}
              </Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: "16px !important",
              }}
            >
              {dialogError && (
                <Alert severity="error" onClose={() => setDialogError("")}>
                  {dialogError}
                </Alert>
              )}

              <Divider>
                <Chip label={PSN.sectionDatos} size="small" />
              </Divider>
              <SAETextField
                label={PSN.fieldTitle}
                value={nuevaData.titulo_publicacion}
                onChange={(event) =>
                  handlePublicationFieldChange(
                    "titulo_publicacion",
                    event.target.value,
                  )
                }
                error={Boolean(fieldErrors.titulo_publicacion)}
                helperText={fieldErrors.titulo_publicacion ?? ""}
                fullWidth
              />
              <SAETextField
                label={PSN.fieldDescription}
                value={nuevaData.descripcion}
                onChange={(event) =>
                  handlePublicationFieldChange("descripcion", event.target.value)
                }
                error={Boolean(fieldErrors.descripcion)}
                helperText={fieldErrors.descripcion ?? ""}
                multiline
                rows={3}
                fullWidth
              />

              <Divider>
                <Chip label={PSN.sectionVigencia} size="small" />
              </Divider>
              <Box sx={{ display: "flex", gap: 2 }}>
                <SAETextField
                  label={PSN.fieldStartDate}
                  type="date"
                  value={nuevaData.fecha_inicio}
                  onChange={(event) =>
                    handlePublicationFieldChange(
                      "fecha_inicio",
                      event.target.value,
                    )
                  }
                  error={Boolean(fieldErrors.fecha_inicio)}
                  helperText={fieldErrors.fecha_inicio ?? ""}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
                <SAETextField
                  label={PSN.fieldEndDate}
                  type="date"
                  value={nuevaData.fecha_vigencia}
                  onChange={(event) =>
                    handlePublicationFieldChange(
                      "fecha_vigencia",
                      event.target.value,
                    )
                  }
                  error={Boolean(fieldErrors.fecha_vigencia)}
                  helperText={fieldErrors.fecha_vigencia ?? ""}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Box>
              <FormControlLabel
                control={
                  <SAESwitch
                    size="small"
                    checked={nuevaData.no_dar_baja}
                    onChange={(event) =>
                      handleDataChange("no_dar_baja", event.target.checked)
                    }
                  />
                }
                label={PSN.fieldNoDarBaja}
              />

              <Divider>
                <Chip label={PSN.sectionPrioridad} size="small" />
              </Divider>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {PRIORIDAD_OPTIONS.map((option) => {
                  const selected =
                    option.value === nuevaData.prioridad ||
                    (option.value === 0 &&
                      ![1, 2].includes(nuevaData.prioridad));
                  return (
                    <Chip
                      key={option.value}
                      label={option.label}
                      color={selected ? option.chipColor : "default"}
                      variant={selected ? "filled" : "outlined"}
                      onClick={() =>
                        handleDataChange("prioridad", option.value)
                      }
                      sx={{ cursor: "pointer" }}
                    />
                  );
                })}
              </Box>

              <Divider>
                <Chip label={PSN.sectionDocumentos} size="small" />
              </Divider>
              <Tabs
                centered
                value={docMode}
                onChange={(_event, value) => handleDocModeChange(value)}
              >
                <Tab value="subir" label={PSN.tabUpload} />
                <Tab value="existente" label={PSN.tabExisting} />
              </Tabs>

              {docMode === "subir" ? (
                <SAEButton
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  {archivo ? archivo.name : PSN.attachButton}
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      clearFieldError("documento");
                      setDialogError("");
                      setArchivo(event.target.files?.[0] || null);
                    }}
                  />
                </SAEButton>
              ) : (
                <Box>
                  <SAETextField
                    placeholder={PSN.searchDocPlaceholder}
                    value={busquedaDoc}
                    onChange={(event) => {
                      setBusquedaDoc(event.target.value);
                      setPage(1);
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ maxHeight: 245 }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" />
                          <TableCell>{PSN.tableColName}</TableCell>
                          <TableCell>{PSN.tableColType}</TableCell>
                          <TableCell align="center">
                            {PSN.tableColView}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loadingDocs ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <CircularProgress size={20} />
                            </TableCell>
                          </TableRow>
                        ) : docsPaginados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              {PSN.noDocuments}
                            </TableCell>
                          </TableRow>
                        ) : (
                          docsPaginados.map((document) => (
                            <TableRow
                              key={document.id}
                              hover
                              selected={docSeleccionado === document.id}
                              onClick={() => {
                                clearFieldError("documento");
                                setDialogError("");
                                setDocSeleccionado(document.id);
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell padding="checkbox">
                                <Radio
                                  checked={docSeleccionado === document.id}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{document.nombre_documento}</TableCell>
                              <TableCell>
                                {getTipoDocumento(
                                  document,
                                  C.documentTypeLabels,
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handlePreview(
                                      document.id,
                                      document.nombre_documento,
                                    );
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {docsFiltrados.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption">
                        {PSN.docCount(docsFiltrados.length)}
                      </Typography>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_event, value) => setPage(value)}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              )}
              {fieldErrors.documento && (
                <Alert severity="error">{fieldErrors.documento}</Alert>
              )}
            </DialogContent>

            <DialogActions>
              <SAEButton
                variant="outlined"
                onClick={handleCloseDialog}
                disabled={saving}
                startIcon={<CloseIcon />}
              >
                Cancelar
              </SAEButton>
              <SAEButton
                variant="contained"
                onClick={handleSaveClick}
                disabled={saving}
                startIcon={
                  saving ? <CircularProgress size={16} color="inherit" /> : <AddIcon />
                }
              >
                {saving ? PSN.saving : "Crear"}
              </SAEButton>
            </DialogActions>
          </>
        )}
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

function DialogPress() {
  const { handleDeleteConfirm } = usePress();
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    closeDialog,
  } = useNotification();

  const deleteDialogConfig = {
    pressPublicationDelete: {
      entityLabel: "Publicación",
      itemName: dialogData?.titulo_publicacion,
      onConfirm: handleDeleteConfirm,
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

  return null;
}
export default function AdministrarPrensa() {
  return (
    <PressProvider>
      <AdministrarPrensaContent />
    </PressProvider>
  );
}
