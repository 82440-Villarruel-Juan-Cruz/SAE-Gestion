 import {
  Autocomplete,
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { PurchaseProvider } from "../../context/providers/purchaseProvider";
import { AdminUsersProvider } from "../../context/providers/employProvider";
import { useEmploy, usePurchase } from "../../context/employedContext";

import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import DocumentCard from "../../../assets/components/documents/DocumentCard";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import { useNotification } from "../../../shared/context/sharedContext";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SAEPage from "../../../assets/components/page/SAEPage";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import SAEDeleteDialog from "../../../assets/components/popUp/SAEDeleteDialog";
import { COMPRAS_STRINGS } from "../../../utils/strings/employed.strings";
import { getFileName } from "../../../utils/documents.utils";
import {
  getCurrencyValue,
  handleCurrencyBlur,
  handleCurrencyInputChange,
  normalizeCurrencyValue,
} from "../../../utils/formatters.utils";

export default function EmployedPurchases() {
  return (
    <AdminUsersProvider>
      <PurchaseProvider>
        <EmployedPurchasesContent />
      </PurchaseProvider>
    </AdminUsersProvider>
  );
}

function EmployedPurchasesContent() {
  const {
    purchasesRows,
    purchasesColumns,
    loadingPurchase,
    fetchPurchases,
    openCreatePurchases,
    preview,
    getDefaultPurchaseDateRange,
    closePreview,
  } = usePurchase();

  const sectionConfig = useMemo(
    () => ({
      compras: {
        title: COMPRAS_STRINGS.sectionTitle,
        dialog: openCreatePurchases,
        addButton: COMPRAS_STRINGS.addButton,
        icon: ShoppingCartIcon,
        rows: purchasesRows,
        columns: purchasesColumns,
        loading: loadingPurchase,
      },
    }),
    [purchasesRows, purchasesColumns, loadingPurchase, openCreatePurchases],
  );
  const [activeSection] = useState("compras");
  const [dateRange, setDateRange] = useState(getDefaultPurchaseDateRange);

  const handleFechaDesdeChange = (event) => {
    const fechaDesde = event.target.value;

    setDateRange((previous) => ({
      ...previous,
      fechaDesde,
      fechaHasta:
        previous.fechaHasta < fechaDesde ? fechaDesde : previous.fechaHasta,
    }));
  };

  const handleFechaHastaChange = (event) => {
    const fechaHasta = event.target.value;

    setDateRange((previous) => ({
      ...previous,
      fechaHasta: fechaHasta > previous.today ? previous.today : fechaHasta,
    }));
  };

  useEffect(() => {
    fetchPurchases(dateRange.fechaDesde, dateRange.fechaHasta);
  }, [dateRange.fechaDesde, dateRange.fechaHasta, fetchPurchases]);

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );
  return (
    <SAEPage>
      <HeaderPageEmployed
        header={COMPRAS_STRINGS.headerTitle}
        title={COMPRAS_STRINGS.headerSubtitle}
        description={COMPRAS_STRINGS.headerDescription}
        backgroundImage={"images/headers/purchases.jfif"}
      />
      

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
        beforeSearch={
          <>
            <SAETextField
              size="small"
              label={COMPRAS_STRINGS.filterDateFrom}
              type="date"
              value={dateRange.fechaDesde}
              onChange={handleFechaDesdeChange}
              sx={{
                width: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.6)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                "& .MuiInputAdornment-root svg": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
              slotProps={{
                htmlInput: { max: dateRange.fechaHasta },
              }}
            />
            <SAETextField
              size="small"
              label={COMPRAS_STRINGS.filterDateTo}
              type="date"
              value={dateRange.fechaHasta}
              onChange={handleFechaHastaChange}
              sx={{
                width: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.6)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                "& .MuiInputAdornment-root svg": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
              slotProps={{
                input: {},
                htmlInput: {
                  min: dateRange.fechaDesde,
                  max: dateRange.today,
                },
              }}
            />
          </>
        }
      />
      <DocumentPreviewDialog
        open={preview.open}
        onClose={closePreview}
        title={preview.title}
        imageSrc={preview.imageSrc}
        isPdf={preview.isPdf}
        loading={preview.loading}
        error={preview.error}
        onDownload={preview.onDownload}
      />
      <DialogPurchase dateRange={dateRange} />
    </SAEPage>
  );
}

function DialogPurchase({ dateRange }) {
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
  const isDocsDialog = dialogType === "docs";
  const showPurchaseForm = dialogType === "purchases";
  const showDocumentsForm = dialogMode === "create" || isDocsDialog;
  const { empleados, loadingEmpleados } = useEmploy();
  const validationKey = `${dialogType}-${dialogMode}-${dialogOpen}`;
  const [fieldValidation, setFieldValidation] = useState({
    key: validationKey,
    errors: {},
  });
  const fieldErrors =
    fieldValidation.key === validationKey ? fieldValidation.errors : {};

  const {
    isPurchaseDataComplete,
    focusedCurrencyField,
    setFocusedCurrencyField,
    handleInformeTecnicoChange,
    handleEmpleadoChange,
    handleFacturaChange,
    handleInformePdfChange,
    handleDeletePurchaseDocument,
    handleRemoveFactura,
    handlePreview,
    purchaseDocuments,
    handleSavePurchase,
    handleConfirmWithoutInforme,
    warningOpen,
    setWarningOpen,
    handleDeletePurchase,
  } = usePurchase();

  const selectedEmpleado = useMemo(
    () =>
      empleados.find(
        (empleado) => String(empleado.id) === String(dialogData.id_usuario),
      ) || null,
    [dialogData.id_usuario, empleados],
  );

  const isBlank = (value) => String(value ?? "").trim() === "";
  const isValidCurrency = (value) => {
    const normalizedValue = normalizeCurrencyValue(value);

    return (
      normalizedValue !== "" &&
      normalizedValue !== null &&
      normalizedValue !== undefined &&
      !Number.isNaN(Number(normalizedValue)) &&
      Number(normalizedValue) >= 0
    );
  };
  const hasInformeData = (informe = {}) =>
    [
      informe.nro_expediente,
      informe.precio_real,
      informe.fecha_licitacion,
      informe.fecha_informe,
      informe.nombre_solicitante,
      informe.nombre_ganador,
    ].some((value) => !isBlank(value));

  const validatePurchaseDialog = () => {
    const errors = {};
    const informe = dialogData.informe || {};

    if (!dialogData.id_usuario) {
      errors.id_usuario = COMPRAS_STRINGS.validationEmployeeRequired;
    }
    if (isBlank(dialogData.nombre_compra)) {
      errors.nombre_compra = COMPRAS_STRINGS.validationPurchaseNameRequired;
    }
    if (!isValidCurrency(dialogData.precio_sugerido)) {
      errors.precio_sugerido = COMPRAS_STRINGS.validationSuggestedPrice;
    }
    if (isBlank(dialogData.motivo)) {
      errors.motivo = COMPRAS_STRINGS.validationReasonRequired;
    }
    if (isBlank(dialogData.fecha_compra)) {
      errors.fecha_compra = COMPRAS_STRINGS.validationPurchaseDateRequired;
    }
    if (dialogMode === "create" && !dialogData.facturas_documentos?.length) {
      errors.facturas_documentos = COMPRAS_STRINGS.saveRequiredInvoice;
    }

    if (hasInformeData(informe)) {
      if (isBlank(informe.nro_expediente)) {
        errors["informe.nro_expediente"] =
          COMPRAS_STRINGS.validationFileNumberRequired;
      }
      if (!isValidCurrency(informe.precio_real)) {
        errors["informe.precio_real"] = COMPRAS_STRINGS.validationRealPrice;
      }
      if (isBlank(informe.nombre_solicitante)) {
        errors["informe.nombre_solicitante"] =
          COMPRAS_STRINGS.validationRequesterRequired;
      }
      if (isBlank(informe.nombre_ganador)) {
        errors["informe.nombre_ganador"] =
          COMPRAS_STRINGS.validationWinnerRequired;
      }
      if (isBlank(informe.fecha_licitacion)) {
        errors["informe.fecha_licitacion"] =
          COMPRAS_STRINGS.validationTenderDateRequired;
      }
      if (isBlank(informe.fecha_informe)) {
        errors["informe.fecha_informe"] =
          COMPRAS_STRINGS.validationReportDateRequired;
      }
    }

    setFieldValidation({
      key: validationKey,
      errors,
    });

    if (errors.facturas_documentos) {
      setDialogError(errors.facturas_documentos);
    } else if (Object.keys(errors).length > 0) {
      setDialogError(
        hasInformeData(informe)
          ? COMPRAS_STRINGS.saveRequiredReport
          : COMPRAS_STRINGS.saveRequiredPurchaseData,
      );
    } else {
      setDialogError("");
    }

    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field) => {
    setFieldValidation((previous) => {
      const previousErrors =
        previous.key === validationKey ? previous.errors : {};

      return previousErrors[field]
        ? {
            key: validationKey,
            errors: { ...previousErrors, [field]: undefined },
          }
        : previous;
    });
  };

  const handlePurchaseFieldChange = (field, value) => {
    clearFieldError(field);
    setDialogError("");
    handleDataChange(field, value);
  };

  const handleInformeFieldChange = (field, value) => {
    clearFieldError(`informe.${field}`);
    setDialogError("");
    handleInformeTecnicoChange(field, value);
  };

  const handlePurchaseSaveClick = () => {
    if (!validatePurchaseDialog()) return;

    handleSavePurchase(dateRange.fechaDesde, dateRange.fechaHasta);
  };

  const handleDocumentFileChange = (event, item) => {
    if (item.key === "facturas") {
      clearFieldError("facturas_documentos");
      setDialogError("");
      handleFacturaChange(event, item);
      return;
    }

    handleInformePdfChange(event, item);
  };

  const deleteDialogConfig = {
    purchaseDelete: {
      entityLabel: COMPRAS_STRINGS.deleteEntityLabel,
      itemName: dialogData?.nombre_compra,
      onConfirm: () =>
        handleDeletePurchase(dateRange.fechaDesde, dateRange.fechaHasta),
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
      <Dialog
        open={dialogOpen && ["purchases", "docs"].includes(dialogType)}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isDocsDialog
            ? COMPRAS_STRINGS.dialogDocumentsTitle
            : COMPRAS_STRINGS.dialogCreateTitle}
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

          <Stack spacing={3}>
            {showPurchaseForm && (
              <Box>
                <Divider sx={{ mb: 2 }}>
                  <Chip
                    label={COMPRAS_STRINGS.sectionPurchaseData}
                    size="small"
                  />
                </Divider>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Autocomplete
                    options={empleados}
                    loading={loadingEmpleados}
                    value={selectedEmpleado}
                    onChange={(event, value) => {
                      clearFieldError("id_usuario");
                      handleEmpleadoChange(event, value);
                    }}
                    getOptionLabel={(option) => option?.nombre_empleado || ""}
                    isOptionEqualToValue={(option, value) =>
                      String(option.id) === String(value.id)
                    }
                    renderInput={(params) => (
                      <SAETextField
                        {...params}
                        label={COMPRAS_STRINGS.fieldEmployee}
                        required
                        fullWidth
                        error={Boolean(fieldErrors.id_usuario)}
                        helperText={fieldErrors.id_usuario ?? ""}
                      />
                    )}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldPurchaseName}
                    required
                    value={dialogData.nombre_compra ?? ""}
                    onChange={(e) =>
                      handlePurchaseFieldChange("nombre_compra", e.target.value)
                    }
                    error={Boolean(fieldErrors.nombre_compra)}
                    helperText={fieldErrors.nombre_compra ?? ""}
                    fullWidth
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldSuggestedPrice}
                    required
                    value={getCurrencyValue(
                      "precio_sugerido",
                      dialogData.precio_sugerido,
                      focusedCurrencyField,
                    )}
                    onFocus={() => setFocusedCurrencyField("precio_sugerido")}
                    onBlur={() =>
                      handleCurrencyBlur(
                        "precio_sugerido",
                        dialogData.precio_sugerido,
                        handlePurchaseFieldChange,
                        setFocusedCurrencyField,
                      )
                    }
                    onChange={(e) =>
                      handleCurrencyInputChange(
                        "precio_sugerido",
                        e.target.value,
                        handlePurchaseFieldChange,
                      )
                    }
                    error={Boolean(fieldErrors.precio_sugerido)}
                    helperText={fieldErrors.precio_sugerido ?? ""}
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                      htmlInput: {
                        inputMode: "decimal",
                        placeholder: COMPRAS_STRINGS.currencyPlaceholder,
                      },
                    }}
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldReason}
                    required
                    value={dialogData.motivo ?? ""}
                    onChange={(e) =>
                      handlePurchaseFieldChange("motivo", e.target.value)
                    }
                    error={Boolean(fieldErrors.motivo)}
                    helperText={fieldErrors.motivo ?? ""}
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldPurchaseDate}
                    required
                    type="date"
                    value={dialogData.fecha_compra ?? ""}
                    onChange={(e) =>
                      handlePurchaseFieldChange("fecha_compra", e.target.value)
                    }
                    error={Boolean(fieldErrors.fecha_compra)}
                    helperText={fieldErrors.fecha_compra ?? ""}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                </Box>
              </Box>
            )}

            {showPurchaseForm && (
              <Box>
                <Divider sx={{ mb: 2 }}>
                  <Chip
                    label={COMPRAS_STRINGS.sectionTechnicalReport}
                    size="small"
                  />
                </Divider>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldFileNumber}
                    value={dialogData.informe?.nro_expediente ?? ""}
                    onChange={(e) =>
                      handleInformeFieldChange(
                        "nro_expediente",
                        e.target.value,
                      )
                    }
                    error={Boolean(fieldErrors["informe.nro_expediente"])}
                    helperText={fieldErrors["informe.nro_expediente"] ?? ""}
                    fullWidth
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldRealPrice}
                    value={getCurrencyValue(
                      "precio_real",
                      dialogData.informe?.precio_real,
                      focusedCurrencyField,
                    )}
                    onFocus={() => setFocusedCurrencyField("precio_real")}
                    onBlur={() =>
                      handleCurrencyBlur(
                        "precio_real",
                        dialogData.informe?.precio_real,
                        handleInformeFieldChange,
                        setFocusedCurrencyField,
                      )
                    }
                    onChange={(e) =>
                      handleCurrencyInputChange(
                        "precio_real",
                        e.target.value,
                        handleInformeFieldChange,
                      )
                    }
                    error={Boolean(fieldErrors["informe.precio_real"])}
                    helperText={fieldErrors["informe.precio_real"] ?? ""}
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                      htmlInput: {
                        inputMode: "decimal",
                        placeholder: COMPRAS_STRINGS.currencyPlaceholder,
                      },
                    }}
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldRequesterName}
                    value={dialogData.informe?.nombre_solicitante ?? ""}
                    onChange={(e) =>
                      handleInformeFieldChange(
                        "nombre_solicitante",
                        e.target.value,
                      )
                    }
                    error={Boolean(fieldErrors["informe.nombre_solicitante"])}
                    helperText={
                      fieldErrors["informe.nombre_solicitante"] ?? ""
                    }
                    fullWidth
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldWinnerName}
                    value={dialogData.informe?.nombre_ganador ?? ""}
                    onChange={(e) =>
                      handleInformeFieldChange(
                        "nombre_ganador",
                        e.target.value,
                      )
                    }
                    error={Boolean(fieldErrors["informe.nombre_ganador"])}
                    helperText={fieldErrors["informe.nombre_ganador"] ?? ""}
                    fullWidth
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldTenderDate}
                    type="date"
                    value={dialogData.informe?.fecha_licitacion ?? ""}
                    onChange={(e) =>
                      handleInformeFieldChange(
                        "fecha_licitacion",
                        e.target.value,
                      )
                    }
                    error={Boolean(fieldErrors["informe.fecha_licitacion"])}
                    helperText={fieldErrors["informe.fecha_licitacion"] ?? ""}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <SAETextField
                    label={COMPRAS_STRINGS.fieldReportDate}
                    type="date"
                    value={dialogData.informe?.fecha_informe ?? ""}
                    onChange={(e) =>
                      handleInformeFieldChange(
                        "fecha_informe",
                        e.target.value,
                      )
                    }
                    error={Boolean(fieldErrors["informe.fecha_informe"])}
                    helperText={fieldErrors["informe.fecha_informe"] ?? ""}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>
              </Box>
            )}

            {showDocumentsForm && (
              <Box>
                <Divider sx={{ mb: 2 }}>
                  <Chip
                    label={COMPRAS_STRINGS.sectionDocumentation}
                    size="small"
                  />
                </Divider>
                {!isDocsDialog && !isPurchaseDataComplete && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {COMPRAS_STRINGS.documentationInfo}
                  </Alert>
                )}
                <Grid container spacing={2}>
                  {purchaseDocuments.map((documentType) => (
                    <Grid
                      key={documentType.id_tipo_documento}
                      size={{ xs: 12, md: 6 }}
                      item
                    >
                      <DocumentCard
                        documento={documentType}
                        onFileChange={handleDocumentFileChange}
                        onDelete={(item) => handleDeletePurchaseDocument(item)}
                        onPreview={handlePreview}
                        documents={documentType.documentos}
                        getDocumentName={getFileName}
                        onDeleteDocument={(index) =>
                          documentType.key === "facturas"
                            ? handleRemoveFactura(index)
                            : handleDeletePurchaseDocument(documentType)
                        }
                        uploadDisabled={!isPurchaseDataComplete}
                        deleteDisabled={!documentType.subido}
                        showRequirement
                        showActions={!isDocsDialog}
                        notUploadedLabel={COMPRAS_STRINGS.notUploadedLabel}
                        uploadedLabel={COMPRAS_STRINGS.uploadedLabel}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={closeDialog}
            disabled={dialogSaving}
            startIcon={<CloseIcon />}
          >
            {COMPRAS_STRINGS.cancel}
          </SAEButton>
          {!isDocsDialog && (
            <SAEButton
              variant="contained"
              onClick={handlePurchaseSaveClick}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <SaveOutlinedIcon />
                )
              }
            >
              {dialogMode === "create" ? "Crear" : COMPRAS_STRINGS.save}
            </SAEButton>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={warningOpen} onClose={() => setWarningOpen(false)}>
        <DialogTitle>{COMPRAS_STRINGS.incompleteReportTitle}</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            {COMPRAS_STRINGS.incompleteReportMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <SAEButton
            variant="outlined"
            onClick={() => setWarningOpen(false)}
            startIcon={<CloseIcon />}
          >
            {COMPRAS_STRINGS.back}
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={() =>
              handleConfirmWithoutInforme(
                dateRange.fechaDesde,
                dateRange.fechaHasta,
              )
            }
          >
            {COMPRAS_STRINGS.createWithoutReport}
          </SAEButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
