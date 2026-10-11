import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SAEButton from "../buttons/SAEButton";

export default function SAEDeleteDialog({
  open,
  entityLabel = "elemento",
  itemName,
  itemId,
  onConfirm,
  onClose,
  loading = false,
  error = "",
  onClearError,
}) {
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1.5, pr: 1 }}
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            color: "error.main",
            bgcolor: "#ffebee",
          }}
        >
          <WarningAmberRoundedIcon />
        </Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          Eliminar {entityLabel}
        </Typography>
        <IconButton
          aria-label="Cerrar"
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{ ml: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error" onClose={onClearError}>
              {error}
            </Alert>
          )}

          <Typography id="delete-dialog-description">
            Vas a eliminar este {entityLabel.toLowerCase()}. Esta accion no se
            puede deshacer.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: 1,
              borderColor: "error.light",
              bgcolor: "#fff5f5",
            }}
          >
            <Typography variant="caption" color="error.main">
              {entityLabel}
            </Typography>
            <Typography
              sx={{
                color: "error.dark",
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {itemName || "Sin nombre"}
            </Typography>
            {itemId !== undefined && itemId !== null && itemId !== "" && (
              <Typography variant="body2" color="text.secondary">
                ID: {itemId}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          startIcon={<CloseIcon />}
        >
          Cancelar
        </SAEButton>
        <SAEButton
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteOutlineIcon />
            )
          }
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
