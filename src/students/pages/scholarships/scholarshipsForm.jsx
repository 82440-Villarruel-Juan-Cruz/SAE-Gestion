import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Grid,
  IconButton,
  Autocomplete,
  Typography,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { Close, AddCircleOutline } from "@mui/icons-material";
import {
  useMyProfile,
  useNotification,
} from "../../../shared/context/sharedContext";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import DocumentCard from "../../../assets/components/documents/DocumentCard";

import {
  SCHOLARSHIP_STRINGS,
  PROFILE_STRINGS,
} from "../../../utils/strings/student.strings";
import { PERSONAL_FIELDS } from "../../../utils/common/common.config";
import {
  SCHOLARSHIP_TYPE,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  DEFAULT_ACCEPTED_EXTENSIONS,
} from "../../../utils/common/constants";

import {
  getDocumentKey,
  hasDocumentFile,
} from "../../../utils/documents.utils";
import { useScholarships } from "../../context/studentContext";
import { ProfileContextProvider } from "../../../shared/context/providers/profileProvider";

const C = SCHOLARSHIP_STRINGS;
const D = PROFILE_STRINGS;

const isEconomicOptionalDocument = (documento) => documento.required === false;

export default function ScholarshipsForm() {
  return (
    <ProfileContextProvider>
      <ScholarshipsContent />
    </ProfileContextProvider>
  );
}

export function ScholarshipsContent() {
  const { dialogOpen, dialogSaving, setDialogSaving, closeDialog } =
    useNotification();
  const {
    datosPerfil,
    addressParts,
    requiredError,
    emailHasError,
    phoneHasError,
    dniHasError,
    formatDni,
    formatCuil,
    today,
    missingRequiredFields,

    handleMaskedChange,
    handleAddressChange,
    handleProfileSave,
    formatPhone,
    cuilHasError,
  } = useMyProfile();
  const {
    handleChange,
    handlePreview,
    documentosEconomica,
    handleDocumentoChange,
    formBeca,
    setFormBeca,
    setDocumentoAEliminar,
    proyectosRows,
    serviciosRows,
    documentosRequeridos,
    setDocumentosRequeridos,
    documentosEconomicaVisibles,
    documentosEconomicosOpcionalesDisponibles,
    handleDocumentoEconomicoDelete,
    documentoEconomicoOpcionalId,
    setDocumentoEconomicoOpcionalId,
    handleAgregarDocumentoEconomico,
    uploadingDocumentoId,
    setDocumentosEconomica,
    handleDialogSave,
    saving,
  } = useScholarships(); //Esto en teoria lo llamamos desde dentro del provider de becas

  const isSaving = dialogSaving || saving;

  const handleSaveScholarshipRequest = async () => {
    if (isSaving) return;

    setDialogSaving(true);
    try {
      await handleProfileSave();
      await handleDialogSave();
    } finally {
      setDialogSaving(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {C.cardSolicitarTitle}
        </Typography>
        <IconButton onClick={closeDialog} size="small" disabled={isSaving}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        {isSaving && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              bgcolor: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(2px)",
            }}
          >
            <SAESpinner size="S" />
            <Typography variant="body2" color="text.secondary">
              {C.savingRequest}
            </Typography>
          </Box>
        )}

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip
            label={C.DatosPersonales}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Divider>
        {/* 
        <Grid container spacing={2}>
          {PERSONAL_FIELDS.map((field) => (
            <Grid key={field.name} size={{ xs: 12, sm: 6, md: field.md ?? 6 }}>
              <SAETextField
                fullWidth
                label={field.label}
                name={field.name}
                disabled
                type={field.type}
                InputLabelProps={field.InputLabelProps}
                value={datosPerfil[field.name] ?? ""}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.75)",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid> */}

        <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.personalInfoID}
              fullWidth
              disabled
              value={datosPerfil.legajo}
              InputLabelProps={{ shrink: true }}
              required
              error={requiredError(datosPerfil.legajo)}
              helperText={
                requiredError(datosPerfil.legajo)
                  ? "El legajo es obligatorio"
                  : ""
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.personalInfoNames}
              fullWidth
              value={datosPerfil.nombres}
              onChange={(e) => handleChange("nombres", e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ htmlInput: { maxLength: 60 } }}
              required
              disabled
              error={requiredError(datosPerfil.nombres)}
              helperText={
                requiredError(datosPerfil.nombres) ? C.nameRequired : ""
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.personalInfoLastNames}
              fullWidth
              value={datosPerfil.apellidos}
              onChange={(e) => handleChange("apellidos", e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ htmlInput: { maxLength: 60 } }}
              required
              disabled
              error={requiredError(datosPerfil.apellidos)}
              helperText={
                requiredError(datosPerfil.apellidos) ? C.lastNameRequired : ""
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.personalInfoDNI}
              fullWidth
              value={formatDni(datosPerfil.dni)}
              onChange={handleMaskedChange("dni", formatDni)}
              InputLabelProps={{ shrink: true }}
              placeholder="12.345.678"
              slotProps={{
                htmlInput: { inputMode: "numeric", maxLength: 10 },
              }}
              required
              error={dniHasError}
              helperText={dniHasError ? C.DNIRequired : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.personalInfoCUIL}
              fullWidth
              value={formatCuil(datosPerfil.cuil)}
              onChange={handleMaskedChange("cuil", formatCuil)}
              InputLabelProps={{ shrink: true }}
              placeholder="20-12345678-3"
              slotProps={{
                htmlInput: { inputMode: "numeric", maxLength: 13 },
              }}
              required
              error={cuilHasError}
              helperText={cuilHasError ? C.CUILRequired : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.personalInfoBirth}
              type="date"
              value={datosPerfil.fecha_nacimiento}
              onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: today },
              }}
              required
              error={requiredError(datosPerfil.fecha_nacimiento)}
              helperText={
                requiredError(datosPerfil.fecha_nacimiento)
                  ? C.birthDateRequired
                  : ""
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SAETextField
              label={D.contactInfoEmail}
              type="email"
              fullWidth
              value={datosPerfil.email}
              onChange={(e) => handleChange("email", e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              error={emailHasError}
              required
              helperText={emailHasError ? C.emailRequired : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SAETextField
              label={D.contactInfoPhone}
              fullWidth
              value={datosPerfil.telefono}
              onChange={handleMaskedChange("telefono", formatPhone)}
              InputLabelProps={{ shrink: true }}
              placeholder="+54 351 123-4567"
              slotProps={{
                htmlInput: { inputMode: "tel", maxLength: 16 },
              }}
              error={phoneHasError}
              required
              helperText={phoneHasError ? C.phoneRequired : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <SAETextField
              label={D.contactInfoProvince}
              fullWidth
              value={addressParts[0]}
              onChange={(e) => handleAddressChange(0, e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ htmlInput: { maxLength: 50 } }}
              required
              error={requiredError(addressParts[0])}
              helperText={
                requiredError(addressParts[0]) ? C.provinceRequired : ""
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SAETextField
              label={D.contactInfoCity}
              fullWidth
              value={addressParts[1]}
              onChange={(e) => handleAddressChange(1, e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ htmlInput: { maxLength: 60 } }}
              required
              error={requiredError(addressParts[1])}
              helperText={requiredError(addressParts[1]) ? C.cityRequired : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SAETextField
              label={D.contactInfoStreet}
              fullWidth
              value={addressParts[2]}
              onChange={(e) => handleAddressChange(2, e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ htmlInput: { maxLength: 80 } }}
              required
              error={requiredError(addressParts[2])}
              helperText={
                requiredError(addressParts[2]) ? C.streetRequired : ""
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <SAETextField
              label={D.contactInfoNumber}
              fullWidth
              value={addressParts[3]}
              onChange={(e) => handleAddressChange(3, e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{
                htmlInput: { inputMode: "numeric", maxLength: 6 },
              }}
              required
              error={requiredError(addressParts[3])}
              helperText={
                requiredError(addressParts[3]) ? C.numberRequired : ""
              }
            />
          </Grid>

          {missingRequiredFields.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Card
                sx={{
                  bgcolor: "rgba(235, 235, 41, 0.7)",
                  border: "1px solid rgba(235, 41, 41, 0.1)",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    fontWeight={600}
                    py={1}
                  >
                    {C.missingSubtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ lineHeight: 2 }}
                  >
                    {missingRequiredFields.length === 1
                      ? C.missingOneField
                      : C.missingMultipleFields}
                    {missingRequiredFields.join(", ")}.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip label={C.TiposBecas} size="small" sx={{ fontWeight: 700 }} />
        </Divider>

        <Autocomplete
          fullWidth
          disabled={isSaving}
          options={C.listaTiposBecas}
          value={
            C.listaTiposBecas.find(
              (beca) => beca.nombre === formBeca?.tipoBeca,
            ) ?? null
          }
          getOptionLabel={(option) => option.nombre ?? ""}
          isOptionEqualToValue={(option, value) =>
            option.nombre === value.nombre
          }
          onChange={(_, value) =>
            setFormBeca((prev) => ({
              ...prev,
              tipoBeca: value?.nombre ?? "",
              beca: null,
            }))
          }
          renderInput={(params) => (
            <SAETextField {...params} label={C.tipoBecaLabel} />
          )}
        />

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.INVESTIGACION && (
          <Autocomplete
            fullWidth
            disabled={isSaving}
            options={proyectosRows}
            value={formBeca?.beca ?? null}
            getOptionLabel={(option) =>
              option.nombre_proyecto_investigacion ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setFormBeca((prev) => ({ ...prev, beca: value }))
            }
            renderInput={(params) => (
              <SAETextField {...params} label={C.proyectoInvestigacionLabel} />
            )}
          />
        )}

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.SERVICIO && (
          <Autocomplete
            fullWidth
            disabled={isSaving}
            options={serviciosRows}
            value={formBeca?.beca ?? null}
            getOptionLabel={(option) => option.nombre ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setFormBeca((prev) => ({ ...prev, beca: value }))
            }
            renderInput={(params) => (
              <SAETextField {...params} label={C.areaLabel} />
            )}
          />
        )}

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA && (
          <SAETextField
            fullWidth
            multiline
            minRows={4}
            label={C.descripcionSituacionLabel}
            name="descripcionSituacion"
            value={formBeca?.descripcionSituacion}
            onChange={handleChange}
            disabled={isSaving}
          />
        )}

        {documentosRequeridos?.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label={C.requiredDocumentsTitle}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {documentosRequeridos?.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {documentosRequeridos?.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={getDocumentKey(item)}>
                <DocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleDocumentoChange(
                      event,
                      getDocumentKey(documento),
                      documentosRequeridos,
                      setDocumentosRequeridos,
                    )
                  }
                  onDelete={(documento) => setDocumentoAEliminar(documento)}
                  uploadDisabled={
                    item.subido || uploadingDocumentoId === getDocumentKey(item)
                  }
                  deleteDisabled={!item.subido}
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}

        {documentosEconomicaVisibles?.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label={C.economicDocumentsTitle}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA &&
          documentosEconomicosOpcionalesDisponibles.length > 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Autocomplete
                fullWidth
                disabled={isSaving}
                options={documentosEconomicosOpcionalesDisponibles}
                value={
                  documentosEconomicosOpcionalesDisponibles.find(
                    (documento) =>
                      getDocumentKey(documento) ===
                      documentoEconomicoOpcionalId,
                  ) ?? null
                }
                getOptionLabel={(option) => option.nombre ?? ""}
                isOptionEqualToValue={(option, value) =>
                  getDocumentKey(option) === getDocumentKey(value)
                }
                onChange={(_, value) =>
                  setDocumentoEconomicoOpcionalId(
                    value ? getDocumentKey(value) : "",
                  )
                }
                renderInput={(params) => (
                  <SAETextField
                    {...params}
                    label={C.addOptionalEconomicDocumentLabel}
                  />
                )}
              />
              <SAEButton
                variant="contained"
                onClick={handleAgregarDocumentoEconomico}
                disabled={!documentoEconomicoOpcionalId || isSaving}
                startIcon={<AddCircleOutline />}
                sx={{ minWidth: { sm: 150 } }}
              >
                {C.addButton}
              </SAEButton>
            </Stack>
          )}

        {documentosEconomicaVisibles?.length > 0 && (
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {documentosEconomicaVisibles?.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={getDocumentKey(item)}>
                <DocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleDocumentoChange(
                      event,
                      getDocumentKey(documento),
                      documentosEconomica,
                      setDocumentosEconomica,
                    )
                  }
                  onDelete={handleDocumentoEconomicoDelete}
                  uploadDisabled={
                    item.subido || uploadingDocumentoId === getDocumentKey(item)
                  }
                  deleteDisabled={
                    !isEconomicOptionalDocument(item) && !hasDocumentFile(item)
                  }
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <SAEButton onClick={closeDialog} disabled={isSaving}>
          {C.cancelButton}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleSaveScholarshipRequest}
          disabled={isSaving}
        >
          {isSaving ? C.savingButton : C.saveButton}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
