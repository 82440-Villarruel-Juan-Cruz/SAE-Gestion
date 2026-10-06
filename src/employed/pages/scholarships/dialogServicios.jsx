import { useState } from "react";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import { useScholarships } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import { getDialogTitle } from "../../../utils/util";
import { BECAS_STRINGS } from "../../../utils/strings/employed.strings";
import {
  isTimeAfter,
  isValidEmail,
  isValidMinLengthPhone,
  isValidPhone,
  isValidText,
} from "../../../utils/validation.utils";
import { isEmpty, onlyDigits } from "../../../utils/text.utils";

const BS = BECAS_STRINGS.serviceDialog;

export default function DialogServicios() {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogSaving,
    handleDataChange,
    closeDialog,
  } = useNotification();
  const { handleSaveServicios } = useScholarships();
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const open = dialogOpen && dialogType === "servicio";

  const resetValidation = () => {
    setFieldErrors({});
    setTouchedFields({});
  };

  const validateField = (field, value, data = dialogData) => {
    switch (field) {
      case "nombre":
        if (isEmpty(value)) return BS.validationName;
        return isValidText(value) ? "" : BS.validationNameFormat;
      case "nro_telefono":
        if (isEmpty(value)) return BS.validationPhoneRequired;
        return isValidPhone(value) ? "" : BS.validationPhoneFormat;
      case "nro_interno_telefono":
        return !isEmpty(value) && !isValidMinLengthPhone(value, 2)
          ? BS.validationInternalPhone
          : "";
      case "email_institucional":
        if (isEmpty(value)) return BS.validationEmailRequired;
        return isValidEmail(value) ? "" : BS.validationEmailFormat;
      case "horario_atencion":
        return isEmpty(value) ? BS.validationOpeningTime : "";
      case "horario_atencion_final":
        if (isEmpty(value)) return BS.validationClosingTime;
        return isTimeAfter(value, data.horario_atencion)
          ? ""
          : BS.validationClosingTimeAfterOpening;
      default:
        return "";
    }
  };

  const handleFieldChange = (field, value) => {
    const previousValue = dialogData[field];
    const emptyEquivalent = isEmpty(previousValue) && isEmpty(value);

    if (previousValue === value || emptyEquivalent) return;

    const nextData = { ...dialogData, [field]: value };
    handleDataChange(field, value);
    setTouchedFields((previous) => ({ ...previous, [field]: true }));

    setFieldErrors((previous) => ({
      ...previous,
      [field]: validateField(field, value, nextData),
      ...(field === "horario_atencion" &&
        (touchedFields.horario_atencion_final ||
          !isEmpty(nextData.horario_atencion_final)) && {
          horario_atencion_final: validateField(
            "horario_atencion_final",
            nextData.horario_atencion_final,
            nextData,
          ),
        }),
    }));
  };

  const validate = () => {
    const fields = [
      "nombre",
      "nro_telefono",
      "nro_interno_telefono",
      "email_institucional",
      "horario_atencion",
      "horario_atencion_final",
    ];
    const errors = fields.reduce((result, field) => {
      const message = validateField(field, dialogData[field]);
      return message ? { ...result, [field]: message } : result;
    }, {});

    setFieldErrors(errors);
    setTouchedFields(
      fields.reduce((result, field) => ({ ...result, [field]: true }), {}),
    );
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    resetValidation();
    handleSaveServicios();
  };

  const handleClose = () => {
    resetValidation();
    closeDialog();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
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
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={BS.fieldName}
                value={dialogData.nombre ?? ""}
                onChange={(event) =>
                  handleFieldChange("nombre", event.target.value)
                }
                error={Boolean(fieldErrors.nombre)}
                helperText={fieldErrors.nombre ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label={BS.fieldPhone}
                value={dialogData.nro_telefono ?? ""}
                onChange={(event) =>
                  handleFieldChange(
                    "nro_telefono",
                    onlyDigits(event.target.value),
                  )
                }
                error={Boolean(fieldErrors.nro_telefono)}
                helperText={fieldErrors.nro_telefono ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label={BS.fieldInternalPhone}
                value={dialogData.nro_interno_telefono ?? ""}
                onChange={(event) =>
                  handleFieldChange(
                    "nro_interno_telefono",
                    onlyDigits(event.target.value),
                  )
                }
                error={Boolean(fieldErrors.nro_interno_telefono)}
                helperText={fieldErrors.nro_interno_telefono ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={BS.fieldInstitutionalEmail}
                value={dialogData.email_institucional ?? ""}
                onChange={(event) =>
                  handleFieldChange("email_institucional", event.target.value)
                }
                error={Boolean(fieldErrors.email_institucional)}
                helperText={fieldErrors.email_institucional ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETimeField
                label={BS.fieldOpeningTime}
                value={dialogData.horario_atencion}
                onChange={(value) =>
                  handleFieldChange("horario_atencion", value)
                }
                minTime="00:00"
                maxTime="23:59"
                size="big"
                error={Boolean(fieldErrors.horario_atencion)}
                helperText={fieldErrors.horario_atencion ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETimeField
                label={BS.fieldClosingTime}
                value={dialogData.horario_atencion_final}
                onChange={(value) =>
                  handleFieldChange("horario_atencion_final", value)
                }
                minTime={dialogData.horario_atencion || "00:00"}
                maxTime="23:59"
                size="big"
                error={Boolean(fieldErrors.horario_atencion_final)}
                helperText={fieldErrors.horario_atencion_final ?? ""}
                fullWidth
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
          startIcon={<CloseIcon />}
        >
          {BS.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleSave}
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
          {dialogSaving ? BS.saving : dialogMode === "create" ? "Crear" : BS.save}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
