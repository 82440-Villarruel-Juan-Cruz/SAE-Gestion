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
import { onlyDigits } from "../../../utils/text.utils";

const BS = BECAS_STRINGS.serviceDialog;

export default function DialogServicios() {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogSaving,
    closeDialog,
  } = useNotification();
  const {
    fieldErrors,
    handleDialogChange,
    handleSaveServicios,
    resetValidation,
  } = useScholarships();

  const open = dialogOpen && dialogType === "servicio";

  const handleSave = () => {
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
                required
                value={dialogData.nombre ?? ""}
                onChange={(event) =>
                  handleDialogChange("nombre", event.target.value)
                }
                error={Boolean(fieldErrors.nombre)}
                helperText={fieldErrors.nombre ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label={BS.fieldPhone}
                required
                value={dialogData.nro_telefono ?? ""}
                onChange={(event) =>
                  handleDialogChange(
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
                  handleDialogChange(
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
                required
                value={dialogData.email_institucional ?? ""}
                onChange={(event) =>
                  handleDialogChange("email_institucional", event.target.value)
                }
                error={Boolean(fieldErrors.email_institucional)}
                helperText={fieldErrors.email_institucional ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETimeField
                label={BS.fieldOpeningTime}
                required
                value={dialogData.horario_atencion}
                onChange={(value) =>
                  handleDialogChange("horario_atencion", value)
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
                required
                value={dialogData.horario_atencion_final}
                onChange={(value) =>
                  handleDialogChange("horario_atencion_final", value)
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
