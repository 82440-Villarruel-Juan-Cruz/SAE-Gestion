import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/sharedContext"; 
import SAEButton from "../../../assets/components/buttons/SAEButton";

export default function SessionExpiredDialog() {
  const { sessionExpired, extendSession, logout } = useAuth();
  const [extending, setExtending] = useState(false);

  const handleExtendSession = async () => {
    setExtending(true);
    try {
      await extendSession();
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      setExtending(false);
    }
  };

  return (
    <Dialog open={sessionExpired} maxWidth="sm" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ fontWeight: "bold", color: "var(--primary)" }}>
        La sesión está por expirar
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Tu sesión se cerrará pronto por seguridad.
        </Alert>
        <Typography color="text.secondary" variant="body2">
          Podés renovar el tiempo disponible o cerrar sesión y volver a iniciar.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <SAEButton variant="outlined" onClick={logout} disabled={extending}>
          Cerrar sesión
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleExtendSession}
          disabled={extending}
          startIcon={
            extending ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {extending ? "Renovando..." : "Extender sesión"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
