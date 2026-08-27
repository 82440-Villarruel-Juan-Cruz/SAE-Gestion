import { useState, useMemo ,useEffect} from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  InputAdornment,
  Switch,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import SAEPage from "../../../assets/components/page/SAEPage";

import { digitsOnly } from "../../../utils/text.utils";
import { formatCbu,formatCuit,formatCurrencyInputFromText,parseCurrencyInput,sanitizeCurrencyInput} from "../../../utils/formatters.utils";

import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";

import { TRAVEL_REQUIRED_DOCUMENTS } from "../../../utils/common/common.config";
import { TRAVEL_STRINGS } from "../../../utils/strings/employed.strings";
import { formatDate } from "../../../utils/date.utils.js";
import { DataGrid } from "@mui/x-data-grid";

const C = TRAVEL_STRINGS;
export default function EmployedTravels() {
  return (
    <TravelProvider>
      <EmployedTravelsContent />
    </TravelProvider>
  );
}

function EmployedTravelsContent() {
  const {
    bussinessRows,
    loadingBussiness,
    bussinessColumns,
    openCreateBussiness,

    travelsRows,
    loadingTravels,
    travelsColumns,
    openCreateTravels,
  } = useTravel();
  const { dialogOpen, dialogType } = useNotification();

  const sectionConfig = useMemo(
    () => ({

      viajes: {
        title: "Viajes Activos",
        dialog: openCreateTravels,
        addButton: "Nuevo Viaje",
        icon: LocalAirportIcon,
        rows: travelsRows,
        columns: travelsColumns,
        loading: loadingTravels,
      },
       empresas: {
        title: "Empresas",
        dialog: openCreateBussiness,
        addButton: "Nueva Empresa",
        icon: BusinessIcon,
        rows: bussinessRows,
        columns: bussinessColumns,
        loading: loadingBussiness,
      },
    }),
    [
      bussinessRows,
      bussinessColumns,
      loadingBussiness,
      travelsRows,
      travelsColumns,
      loadingTravels,
      openCreateBussiness,
      openCreateTravels,
    ],
  );
  const [activeSection, setActiveSection] = useState("viajes");
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.headerTitle}
        title={C.headerMainSubtitle}
        description={C.headerMainDescription}
      />
      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <TravelHistory/>
      
      {dialogOpen && dialogType === "bussiness" && <BussinessDialog />}
      {dialogOpen && dialogType === "travels" && <TravelsDialog />}
      {dialogOpen && dialogType === "documents" && <DocumentsDialog />}
    </SAEPage>
  );
}
function TravelHistory() {
  const {fetchTravelsXDate,oldTravelsRows,travelHistoryColumns,loadingOldTravels}=useTravel();
  const getDefaultPurchaseDateRange = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    return {
      fechaDesde: formatDate(firstDayOfMonth, "input"),
      fechaHasta: formatDate(today, "input"),
    };
  };  
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
    fetchTravelsXDate(dateRange.fechaDesde, dateRange.fechaHasta);
  }, [dateRange.fechaDesde, dateRange.fechaHasta,fetchTravelsXDate]);

  return (
      <Box>
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
              background: "var(--gradient)",
              color: "white",
              px: 3,
              py: 2.5,
            }}
          >
      <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }} // "stretch" ayuda en móviles para que ocupen todo el ancho
      justifyContent="space-between"
      spacing={2}
    >
      {/* Bloque Izquierdo: Icono y Título */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <DashboardIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {C.historyTravelTitle}
          </Typography>
        </Box>
      </Stack>

      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={1.5}
        sx={{ width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}
      >
        <SAETextField
          size="small"
          label={C.filterDateFrom}
          type="date"
          value={dateRange.fechaDesde}
          onChange={handleFechaDesdeChange}
          sx={{
            width: { xs: "45%", sm: 180 }, // Usa porcentajes en móvil para que entren en la misma línea
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

        {/* Guion intermedio estilizado en blanco */}
        <Typography sx={{ color: "white", fontWeight: 700, px: 0.5 }}>
          -
        </Typography>

        <SAETextField
          size="small"
          label={C.filterDateTo}
          type="date"
          value={dateRange.fechaHasta}
          onChange={handleFechaHastaChange}
          sx={{
            width: { xs: "45%", sm: 180 }, // Usa porcentajes en móvil para mantener la simetría
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
      </Stack>
    </Stack>
          </Box>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={oldTravelsRows}
                columns={travelHistoryColumns}
                loading={loadingOldTravels}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                localeText={{ noRowsLabel: "No hay registros activos" }}
                sx={{ borderRadius: 0, border: "none" }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
  );
}

function BussinessDialog() {
  const { handleBussinessSave,fieldErrors, setFieldErrors, setTouchedFields,validateField, resetValidation } = useTravel();
  const {
    dialogOpen,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  const handleClose = () => {
    resetValidation();
    setDialogError("");
    closeDialog();
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? "Nueva Empresa" : "Editar Empresa"}
        </Typography>
        <IconButton onClick={handleClose} size="small">
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
                label={C.travelID}
                type="number"
                fullWidth
                value={dialogData.id||""}
                onChange={(e) => handleDataChange("id", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })}
                disabled={true}
                error={Boolean(fieldErrors.id)}
                helperText={fieldErrors.id}         
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }} m={0}>
              <SAETextField
                label={C.businessName}
                value={dialogData.nombre}
                onChange={(e) => handleDataChange("nombre", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })}
                fullWidth
                error={Boolean(fieldErrors.nombre)}
                helperText={fieldErrors.nombre}                
              />
            </Grid>
            <Grid size={{ xs: 12}} m={0}>
              <SAETextField
                label={C.businessPhone}
                value={dialogData.contacto}
                onChange={(e) =>
                  handleDataChange("contacto", digitsOnly(e.target.value),
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                }
                error={Boolean(fieldErrors.contacto)}
                helperText={fieldErrors.contacto}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.businessEmail}
                value={dialogData.email}
                onChange={(e) => handleDataChange("email", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.businessCUIT}
                value={dialogData.cuit}
                onChange={(e) =>
                  handleDataChange("cuit", formatCuit(e.target.value),
                    {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                }
                error={Boolean(fieldErrors.cuit)}
                helperText={fieldErrors.cuit}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.businessCBU}
                value={dialogData.cbu}
                onChange={(e) =>
                  handleDataChange("cbu", formatCbu(e.target.value),
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                }
                error={Boolean(fieldErrors.cbu)}
                helperText={fieldErrors.cbu}
                fullWidth
              />
            </Grid>
            {dialogMode === "edit" && (
              <FormControlLabel
                control={
                  <Switch
                    checked={dialogData.activo}
                    onChange={(e) =>
                      handleDataChange("activo", e.target.checked,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                    }
                    color="primary"
                error={Boolean(fieldErrors.activo)}
                helperText={fieldErrors.activo}                    
                  />
                }
                label={
                  dialogData.activo ? C.businessActive: C.businessNoActive
                }
              />
            )}
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={handleClose}
          disabled={dialogSaving}
        >
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleBussinessSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
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
  );
}

function TravelsDialog() {
  const { bussiness, handleTravelSave,fieldErrors, setFieldErrors, touchedFields, setTouchedFields,validateField, resetValidation } = useTravel();
  const {
    dialogOpen,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  const handleClose = () => {
    resetValidation();
    setDialogError("");
    closeDialog();
  };

  const handleDialogChange = (field, value) => {
    const nextData = { ...dialogData, [field]: value };
    const message = validateField(field, value, nextData);
    const shouldValidateEndDate =
      ["fecha_inicio", "fecha_fin"].includes(field) &&
      (field === "fecha_fin" ||
        touchedFields.fecha_fin ||
        Boolean(fieldErrors.fecha_fin));

    handleDataChange(field, value);
    setTouchedFields((previous) => ({ ...previous, [field]: true }));
    setFieldErrors((previous) => {
      const nextErrors = { ...previous };

      if (message) {
        nextErrors[field] = message;
      } else {
        delete nextErrors[field];
        setDialogError("");
      }

      if (shouldValidateEndDate) {
        const fechaFinMessage = validateField(
          "fecha_fin",
          nextData.fecha_fin,
          nextData,
        );

        if (fechaFinMessage) {
          nextErrors.fecha_fin = fechaFinMessage;
        } else {
          delete nextErrors.fecha_fin;
        }
      }

      return nextErrors;
    });
  };

  const sanitizeAddressPart = (value = "") =>
    value.replace(/\s*-\s*/g, " ").replace(/\s{2,}/g, " ");

  const parseAddress = (value = "") => {
    const parts = String(value)
      .split("-")
      .map((part) => part.trim());
    return [parts[0] || "", parts[1] || "", parts[2] || ""];
  };

  const handleAddressChange = (index, value, dataName) => {
    const parts = parseAddress(dialogData[dataName]);
    parts[index] = sanitizeAddressPart(value);
    const hasAddressData = parts.some((part) => part.trim() !== "");
    handleDialogChange(dataName, hasAddressData ? parts.join(" - ") : "");
  };

  const addressPartsOrigin = parseAddress(dialogData.origen);
  const addressPartsDestiny = parseAddress(dialogData.destino);

  return (
    <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? C.travelCreate : C.travelUpdate}
        </Typography>
        <IconButton onClick={handleClose} size="small">
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
            <Grid size={{ xs: 12, md: 2 }} m={0}>
              <SAETextField
                label={C.travelID}
                type="number"
                fullWidth
                value={dialogData.id}
                onChange={(e) => handleDialogChange("id", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })}
                disabled={true}
                error={Boolean(fieldErrors.id)}
                helperText={fieldErrors.id}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }} m={0}>
              <SAETextField
                label={C.travelName}
                value={dialogData.nombre}
                onChange={(e) => handleDialogChange("nombre", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })}
                fullWidth
                error={Boolean(fieldErrors.nombre)}
                helperText={fieldErrors.nombre}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }} m={0}>
              <SAETextField
                label={C.travelCapacity}
                type="number"
                fullWidth
                value={dialogData.cantidad_personas}
                onChange={(e) =>
                  handleDialogChange("cantidad_personas", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                }
                error={Boolean(fieldErrors.cantidad_personas)}
                helperText={fieldErrors.cantidad_personas}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} my={1}>
              <SAETextField
                label={C.travelStartDate}
                type="date"
                value={dialogData.fecha_inicio}
                onChange={(e) =>
                  handleDialogChange("fecha_inicio", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(fieldErrors.fecha_inicio)}
                helperText={fieldErrors.fecha_inicio}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} my={1}>
              <SAETextField
                label={C.travelEndDate}
                type="date"
                value={dialogData.fecha_fin}
                onChange={(e) =>
                  handleDialogChange("fecha_fin", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                }
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: dialogData.fecha_inicio || undefined },
                }}
                error={Boolean(fieldErrors.fecha_fin)}
                helperText={fieldErrors.fecha_fin}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider variant="middle" sx={{ my: 2 }}>
                <Chip label={C.travelOrigin} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelProvince}
                fullWidth
                value={addressPartsOrigin[0]}
                onChange={(e) =>
                  handleAddressChange(0, e.target.value, "origen")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
                error={Boolean(fieldErrors.origen)}
                helperText={fieldErrors.origen}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelCity}
                fullWidth
                value={addressPartsOrigin[1]}
                onChange={(e) =>
                  handleAddressChange(1, e.target.value, "origen")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelPlace}
                fullWidth
                value={addressPartsOrigin[2]}
                onChange={(e) =>
                  handleAddressChange(2, e.target.value, "origen")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider variant="middle" sx={{ my: 2 }}>
                <Chip label={C.travelDestiny} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelProvince}
                fullWidth
                value={addressPartsDestiny[0]}
                onChange={(e) =>
                  handleAddressChange(0, e.target.value, "destino")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
                error={Boolean(fieldErrors.destino)}
                helperText={fieldErrors.destino}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelCity}
                fullWidth
                value={addressPartsDestiny[1]}
                onChange={(e) =>
                  handleAddressChange(1, e.target.value, "destino")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelPlace}
                fullWidth
                value={addressPartsDestiny[2]}
                onChange={(e) =>
                  handleAddressChange(2, e.target.value, "destino")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider variant="middle" sx={{ my: 2 }}>
                <Chip
                  label={C.travelData}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} m={0}>
              <Autocomplete
                disablePortal
                options={bussiness}
                getOptionLabel={(option) => option.nombre}
                onChange={(event, newValue) => {
                  handleDialogChange(
                    "id_empresa_viaje",
                    newValue ? newValue.id : null,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      }
                  );
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  bussiness.find(
                    (buss) => buss.id === dialogData.id_empresa_viaje,
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={C.travelBusiness}
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                  error={Boolean(fieldErrors.id_empresa_viaje)}
                  helperText={fieldErrors.id_empresa_viaje}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} m={0}>
              <SAETextField
                label={C.travelBudget}
                fullWidth
                value={
                  typeof dialogData.costo_aproximado === "number"
                    ? formatCurrencyInputFromText(dialogData.costo_aproximado)
                    : (dialogData.costo_aproximado ?? "")
                }
                onChange={(e) =>
                  handleDialogChange(
                    "costo_aproximado",
                    sanitizeCurrencyInput(e.target.value),
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      }
                  )
                }
                onBlur={(e) =>
                  handleDialogChange(
                    "costo_aproximado",
                    parseCurrencyInput(e.target.value),
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                  htmlInput: {
                    inputMode: "decimal",
                    placeholder: "9.999.999,99",
                  },
                }}
                error={Boolean(fieldErrors.costo_aproximado)}
                helperText={fieldErrors.costo_aproximado}
              />
            </Grid>
            <Grid sx={{ display: "flex" }} size={{ xs: 12, md: 3 }} m={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={dialogData.seguro || false}
                    onChange={(e) =>
                      handleDialogChange("seguro", e.target.checked,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })
                    }
                    color="primary"
                    error={Boolean(fieldErrors.seguro)}
                helperText={fieldErrors.seguro}
                  />
                }
                label={dialogData.seguro ? C.travelInsurence : C.travelNoInsurence}
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.travelMotive}
                value={dialogData.motivo}
                onChange={(e) => handleDialogChange("motivo", e.target.value,
                     {
                        setTouched: setTouchedFields,
                        setErrors: setFieldErrors,
                        validateFn: validateField
                      })}
                fullWidth
                rows={2}
                multiline
                error={Boolean(fieldErrors.motivo)}
                helperText={fieldErrors.motivo}                
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={handleClose}
          disabled={dialogSaving}
        >
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleTravelSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
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
  );
}

//Lo separe para que me sea mas coherente de programar
function DocumentsDialog() {
  const {
    docsViaje,
    docsViajeList,
    loadingViajeDocs,
    downloadingDocId,
    handlePreviewDoc,
    handleDownloadDoc,
    previewOpen,
    setPreviewOpen,
    previewTitle,
    previewSrc,
    previewIsPdf,
    loadingPreview,
    previewError,
    previewDocRef,
    openPopup,
    setOpenPopup,
    documentoAEliminar,
    requestDeleteDocument,
    handleDelete,
    travelNewFile,
    handleArchivoChange,
    fileInputRef,
    selectedTypeDoc,
    setTypeDoc,
  } = useTravel();
  const { dialogOpen, dialogError, closeDialog } = useNotification();

  const handleComboChange = (field, value) => {
    setTypeDoc((prev) => ({ ...prev, [field]: value }));
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <>
      <DocumentPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
        imageSrc={previewSrc}
        isPdf={previewIsPdf}
        loading={loadingPreview}
        error={previewError}
        onDownload={() =>
          previewDocRef &&
          handleDownloadDoc(
            previewDocRef.id,
            previewDocRef.nombre_documento,
            previewDocRef.extension,
          )
        }
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
           {C.travelDocs} {docsViaje.nombre}
          </Typography>
          <IconButton onClick={closeDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <Autocomplete
              disablePortal
              options={TRAVEL_REQUIRED_DOCUMENTS}
              getOptionLabel={(option) => option.nombre}
              onChange={(event, newValue) => {
                // 'newValue' es el objeto completo del perfil seleccionado (o null)
                if (newValue) {
                  handleComboChange("id", newValue.id);
                } else {
                  // Maneja el caso de que se borre la selección
                  handleComboChange("id", null);
                }
              }}
              // Asegura que la comparación se haga por id
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={
                TRAVEL_REQUIRED_DOCUMENTS.find(
                  (doc) => doc.id === selectedTypeDoc?.id,
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={C.travelRequiredDocs}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true, // Esto evita la escritura
                  }}
                />
              )}
            />
            {selectedTypeDoc && <FileDropZone />}

            {selectedTypeDoc && travelNewFile && (
              <Grid
                container
                direction={{ xs: "column", md: "row" }}
                spacing={1}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAEButton
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={handleButtonClick}
                  >
                    {C.travelChangeDocs}
                  </SAEButton>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAEButton
                    fullWidth
                    type="button"
                    variant="contained"
                    onClick={() => handleArchivoChange(selectedTypeDoc)}
                  >
                    {C.travelAddDocs}
                  </SAEButton>
                </Grid>
              </Grid>
            )}
          </Stack>
        </DialogContent>
        <DialogContent dividers>
          {dialogError && <Alert severity="error">{dialogError}</Alert>}
          {loadingViajeDocs && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <SAESpinner size="S" />
            </Box>
          )}

          {!loadingViajeDocs && docsViajeList.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              {C.travelNoDocs}
            </Typography>
          )}
          {!loadingViajeDocs && docsViajeList.length > 0 && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {docsViajeList.map((doc, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {doc.nombre_documento.replace(/_/g, " ")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.extension?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title={C.travelShowDocs}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewDoc(doc)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={C.travelDownloadDocs}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDoc(
                            doc.id,
                            doc.nombre_documento,
                            doc.extension,
                          )
                        }
                        disabled={downloadingDocId === doc.id}
                      >
                        {downloadingDocId === doc.id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <DownloadIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={C.travelDeleteDocs}>
                      <IconButton
                        size="small"
                        onClick={() => requestDeleteDocument(doc)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton variant="outlined" onClick={closeDialog}>
            {C.travelClose}
          </SAEButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, p: 4 }}>
          {C.travelDeleteDocs}
        </Typography>

        <DialogContent>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {C.travelWarningMsg}
            {documentoAEliminar?.nombre_documento}
          </Typography>
        </DialogContent>

        <DialogActions>
          <SAEButton
            onClick={() => setOpenPopup(false)}
            autoFocus
            color="outlined"
          >
            {C.cancel}
          </SAEButton>
          <SAEButton
            onClick={() => handleDelete(documentoAEliminar)}
            autoFocus
            color="error"
          >
            {C.delete}
          </SAEButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
function FileDropZone() {
  const [isOver, setIsOver] = useState(false);
  const { travelNewFile, setTravelNewFile, fileInputRef } = useTravel();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setTravelNewFile(droppedFiles[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      setTravelNewFile(selectedFiles[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: isOver ? "2px dashed #4CAF50" : "2px dashed #ccc",
        backgroundColor: isOver ? "#e8f5e9" : "#fafafa",
        padding: "14px 0px",
        textAlign: "center",
        borderRadius: "8px",
        transition: "all 0.2s ease",
      }}
    >
      {/* INPUT OCULTO: Hace el trabajo duro por detrás */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {travelNewFile ? (
        <div>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {C.travelLoadDocs} <strong>{travelNewFile.name}</strong>
          </Typography>
        </div>
      ) : (
        <div>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, paddingBottom: "2px" }}
          >
            {C.travelDrop}
            <br />o
          </Typography>
          <SAEButton
            type="button"
            variant="contained"
            onClick={handleButtonClick}
            sx={{
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {C.travelSearch}
          </SAEButton>
        </div>
      )}
    </div>
  );
}
