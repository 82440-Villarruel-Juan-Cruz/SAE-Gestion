import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";
import { useId } from "react";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import { SCHOLARSHIP_STRINGS as C } from "../../../utils/strings/student.strings";

function RequestSection({ title, description, defaultExpanded = true, children }) {
  const id = useId();

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid #DCE7F5",
        borderRadius: "12px !important",
        "&::before": { display: "none" },
        "&.Mui-expanded": { m: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`${id}-header`}
        aria-controls={`${id}-content`}
        sx={{ minHeight: 64, px: 2, bgcolor: "#F8FBFF", borderRadius: 3 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={800} color="var(--secondary)">{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>{description}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Stack spacing={2}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default function MobileScholarshipRequest({
  open,
  saving,
  error,
  onClose,
  onSubmit,
  profile,
  personalDataComplete,
  contactDataComplete,
  hasMissingFields,
  scholarshipType,
  requiredDocumentCount,
  attachedDocumentCount,
  personalFields,
  contactFields,
  addressFields,
  scholarshipFields,
  documentFields,
}) {
  const documentSummary = requiredDocumentCount > 0
    ? `${attachedDocumentCount} de ${requiredDocumentCount} documentos obligatorios adjuntos`
    : "Revisá los documentos necesarios para tu solicitud";

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullScreen>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "var(--primary)", color: "white" }}>
        <Typography variant="h6" component="span" fontWeight="bold" color="inherit">{C.cardSolicitarTitle}</Typography>
        <IconButton onClick={onClose} aria-label="Cerrar solicitud de beca" disabled={saving} sx={{ minWidth: 44, minHeight: 44, color: "inherit" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ position: "relative", px: 2, py: 2, bgcolor: "#FAFCFF" }}>
        {saving && (
          <Box sx={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5, bgcolor: "rgba(255,255,255,0.75)", backdropFilter: "blur(2px)" }}>
            <SAESpinner size="S" />
            <Typography variant="body2" color="text.secondary">{C.savingRequest}</Typography>
          </Box>
        )}
        <Stack spacing={2} useFlexGap>
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ p: 0.5, overflowWrap: "anywhere" }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, overflowWrap: "anywhere" }}>
              {[profile.nombres, profile.apellidos].filter(Boolean).join(" ")}
            </Typography>
            <Typography variant="body2" color="text.secondary"><strong>Legajo: {profile.legajo || "Sin legajo"}</strong></Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Revisá tus datos, elegí la beca y adjuntá la documentación. Podés desplegar cada sección para editarla.
            </Typography>
          </Box>
          <RequestSection title="1. Datos personales"
            description={personalDataComplete ? "DNI, CUIL y fecha de nacimiento cargados" : "Completá tu DNI, CUIL y fecha de nacimiento"}
            defaultExpanded={!personalDataComplete}>
            <Grid container spacing={1.5}>{personalFields}</Grid>
          </RequestSection>
          <RequestSection title="2. Contacto y domicilio"
            description={contactDataComplete ? "Datos cargados · Tocá para revisar o editar" : "Completá tus datos de contacto y dirección"}
            defaultExpanded={!contactDataComplete || hasMissingFields}>
            <Typography variant="subtitle2" fontWeight={700}>Contacto</Typography>
            <Grid container spacing={1.5}>{contactFields}</Grid>
            <Typography variant="subtitle2" fontWeight={700}>Domicilio</Typography>
            <Grid container spacing={1.5}>{addressFields}</Grid>
          </RequestSection>
          <RequestSection title="3. Elegí tu beca" description={scholarshipType || "Seleccioná el tipo de beca que querés solicitar"}>
            {scholarshipFields}
          </RequestSection>
          <RequestSection title="4. Documentación" description={documentSummary}>
            <Typography variant="body2" color="text.secondary">
              Adjuntá los documentos marcados como requeridos. Los opcionales se agregan por separado.
            </Typography>
            {documentFields}
          </RequestSection>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ flexShrink: 0, flexDirection: "column", gap: 1, px: 2, pt: 1.5, pb: "max(12px, env(safe-area-inset-bottom))", bgcolor: "white", borderTop: "1px solid #DCE7F5", "& > :not(style) ~ :not(style)": { ml: 0 } }}>
        <Typography variant="caption" color="text.secondary" aria-live="polite">
          {requiredDocumentCount > 0 ? documentSummary : "Revisá tus datos antes de enviar."}
        </Typography>
        <SAEButton variant="contained" onClick={onSubmit} disabled={saving} fullWidth sx={{ minHeight: 48 }}>
          {saving ? C.savingButton : "Enviar solicitud"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
