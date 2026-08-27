import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SearchStudent from "../../../assets/components/searchStudent/SearchStudent";
import { useSports } from "../../context/employedContext";
import { SPORTS_STRINGS } from "../../../utils/strings/employed.strings";

const C = SPORTS_STRINGS;
const getDialogTitle = (type, mode) => {
  const action = mode === "create" ? "Nuevo" : "Editar";

  switch (type) {
    case "docente":
      return `${action} docente deportivo`;
    case "espacio":
      return `${action} espacio deportivo`;
    case "deporte":
      return `${action} deporte`;
    default:
      return `${action} deportista`;
  }
};

export default function SportsEntityDialog() {
  const {
    dialogOpen,
    dialogData = {},
    dialogType,
    dialogMode,
    dialogSaving,
    dialogError,
    setDialogError,
    dialogFieldErrors,
    closeDialog,
    handleDialogChange,
    handleDialogSave,
    buscarAlumnoPorLegajo,
  } = useSports();

  const handleStudentSelect = (student) => {
    handleDialogChange("legajo", student.legajo);
  };

  const handleStudentClear = () => {
    handleDialogChange("legajo", "");
  };

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {getDialogTitle(dialogType, dialogMode)}
        </Typography>
        <IconButton onClick={closeDialog} size="small">
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
          {dialogType === "docente" ? (
            <>
              <SAETextField
                label={C.cuil}
                value={dialogData.cuil ?? ""}
                onChange={(e) => handleDialogChange("cuil", e.target.value)}
                disabled={dialogMode === "edit"}
                fullWidth
                error={Boolean(dialogFieldErrors.cuil)}
                helperText={dialogFieldErrors.cuil}
              />
              <SAETextField
                label={C.names}
                value={dialogData.nombres ?? ""}
                onChange={(e) => handleDialogChange("nombres", e.target.value)}
                fullWidth
                error={Boolean(dialogFieldErrors.nombres)}
                helperText={dialogFieldErrors.nombres}
              />
              <SAETextField
                label={C.lastNames}
                value={dialogData.apellidos ?? ""}
                onChange={(e) =>
                  handleDialogChange("apellidos", e.target.value)
                }
                fullWidth
                error={Boolean(dialogFieldErrors.apellidos)}
                helperText={dialogFieldErrors.apellidos}
              />
              <SAETextField
                label={C.birthDay}
                type="date"
                value={dialogData.fecha_nacimiento ?? ""}
                onChange={(e) =>
                  handleDialogChange("fecha_nacimiento", e.target.value)
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(dialogFieldErrors.fecha_nacimiento)}
                helperText={dialogFieldErrors.fecha_nacimiento}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(dialogData.activo)}
                    onChange={(e) =>
                      handleDialogChange("activo", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={C.active}
              />
            </>
          ) : dialogType === "espacio" ? (
            <>
              <SAETextField
                label={C.sportPlaceName}
                value={dialogData.nombre ?? ""}
                onChange={(e) => handleDialogChange("nombre", e.target.value)}
                fullWidth
                error={Boolean(dialogFieldErrors.nombre)}
                helperText={dialogFieldErrors.nombre}
              />
              <SAETextField
                label={C.sportPlaceAddress}
                value={dialogData.domicilio ?? ""}
                onChange={(e) =>
                  handleDialogChange("domicilio", e.target.value)
                }
                fullWidth
                error={Boolean(dialogFieldErrors.domicilio)}
                helperText={dialogFieldErrors.domicilio}
              />
              <SAETextField
                label={C.sportsMaps}
                value={dialogData.url_maps ?? ""}
                onChange={(e) => handleDialogChange("url_maps", e.target.value)}
                fullWidth
                error={Boolean(dialogFieldErrors.url_maps)}
                helperText={dialogFieldErrors.url_maps}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(dialogData.activo)}
                    onChange={(e) =>
                      handleDialogChange("activo", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={C.active}
              />
            </>
          ) : dialogType === "deportista" ? (
            <>
              {dialogMode === "create" ? (
                <SearchStudent
                  legajo={dialogData.legajo ?? ""}
                  onLegajoChange={(value) =>
                    handleDialogChange("legajo", value)
                  }
                  onSelectStudent={handleStudentSelect}
                  onClearStudent={handleStudentClear}
                  onSearchStudent={buscarAlumnoPorLegajo}
                  onError={setDialogError}
                  showValidationErrors={Boolean(dialogFieldErrors.legajo)}
                  legajoError={dialogFieldErrors.legajo}
                />
              ) : (
                <SAETextField
                  label={C.studentID}
                  value={dialogData.legajo ?? ""}
                  disabled
                  fullWidth
                  error={Boolean(dialogFieldErrors.legajo)}
                  helperText={dialogFieldErrors.legajo}
                />
              )}
              <SAETextField
                label={C.studentExpireLicence}
                type="date"
                value={dialogData.vencimiento_ficha ?? ""}
                onChange={(e) =>
                  handleDialogChange("vencimiento_ficha", e.target.value)
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(dialogFieldErrors.vencimiento_ficha)}
                helperText={dialogFieldErrors.vencimiento_ficha}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(dialogData.habilitado_deportado)}
                      onChange={(e) =>
                        handleDialogChange(
                          "habilitado_deportado",
                          e.target.checked,
                        )
                      }
                      color="primary"
                    />
                  }
                  label={C.studentAuthorized}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(dialogData.habilitado_deporte)}
                      onChange={(e) =>
                        handleDialogChange(
                          "habilitado_deporte",
                          e.target.checked,
                        )
                      }
                      color="primary"
                    />
                  }
                  label={C.studentSportAuth}
                />
              </Stack>
            </>
          ) : (
            <>
              <SAETextField
                label={C.name}
                value={dialogData.nombre ?? ""}
                onChange={(e) => handleDialogChange("nombre", e.target.value)}
                fullWidth
                error={Boolean(dialogFieldErrors.nombre)}
                helperText={dialogFieldErrors.nombre}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(dialogData.activo)}
                    onChange={(e) =>
                      handleDialogChange("activo", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={C.active}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={closeDialog}
          disabled={dialogSaving}
        >
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleDialogSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? C.create : C.save}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
