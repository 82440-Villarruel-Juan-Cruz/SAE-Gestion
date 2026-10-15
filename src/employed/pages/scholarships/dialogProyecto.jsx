import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import { useScholarships } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import { getDialogTitle } from "../../../utils/util";
import { BECAS_STRINGS } from "../../../utils/strings/employed.strings";

const BS = BECAS_STRINGS.projectDialog;

export default function DialogProyecto() {
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
    handleSaveProyecto,
    resetValidation,
  } = useScholarships();

  const open = dialogOpen && dialogType === "proyectos";

  const handleSave = () => {
    handleSaveProyecto();
  };

  const handleClose = () => {
    resetValidation();
    closeDialog();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(dialogData.activo)}
                    onChange={(event) =>
                      handleDialogChange("activo", event.target.checked)
                    }
                    color="primary"
                  />
                }
                label={BS.fieldActive}
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={BS.fieldName}
                required
                value={dialogData.nombre_proyecto_investigacion ?? ""}
                onChange={(event) =>
                  handleDialogChange(
                    "nombre_proyecto_investigacion",
                    event.target.value,
                  )
                }
                error={Boolean(fieldErrors.nombre_proyecto_investigacion)}
                helperText={fieldErrors.nombre_proyecto_investigacion ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={BS.fieldResearchCenter}
                required
                value={dialogData.centro_investigacion ?? ""}
                onChange={(event) => {
                  handleDialogChange(
                    "centro_investigacion",
                    event.target.value,
                  );
                }}
                error={Boolean(fieldErrors.centro_investigacion)}
                helperText={fieldErrors.centro_investigacion ?? ""}
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
