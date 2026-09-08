import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";

import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import SAEDeleteDialog from "../../../assets/components/popUp/SAEDeleteDialog";
import SAEPage from "../../../assets/components/page/SAEPage";

import { useConsultations } from "../../context/employedContext";
import { ConsultationProvider } from "../../context/providers/consultationsProvider";
import { useNotification } from "../../../shared/context/sharedContext";

import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import { CONSULTATION_FAQS,QUICK_CONSULTATION_FAQS,SAE_EMAIL } from "../../../utils/common/common.config";
import { CONSULTATIONS_STRINGS } from "../../../utils/strings/employed.strings";
import { getDialogTitle } from "../../../utils/util";
import { isValidHyperlink } from "../../../utils/validation.utils";
import { isEmpty } from "../../../utils/text.utils";


const C = CONSULTATIONS_STRINGS;
const validateLinkField = (field, value) => {
  switch (field) {
    case "titulo":
      return isEmpty(value) ? C.errorName : "";
    case "hipervinculo":
      if (isEmpty(value)) return C.errorRequiredLink;
      return isValidHyperlink(value) ? "" : C.errorLink;
    default:
      return "";
  }
};

function EmployedContent() {
  const {
    // ABM Link Frecuentes
    linksFrecuentesRows,
    linksFrecuentesColumns,
    loadingLinksFrecuentes,
    openCreatelinksFrecuentes,
  } = useConsultations();

  const sectionConfig = useMemo(
    () => ({
      linksFrecuentes: {
        title: "Links Frecuentes",
        dialog: openCreatelinksFrecuentes,
        addButton: "Nuevo Link",
        icon: LinkIcon,
        rows: linksFrecuentesRows,
        columns: linksFrecuentesColumns,
        loading: loadingLinksFrecuentes,
      },
    }),
    [
      openCreatelinksFrecuentes,
      linksFrecuentesRows,
      linksFrecuentesColumns,
      loadingLinksFrecuentes,
    ],
  );

  const activeSection = "linksFrecuentes";
  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.headerTitle}
        title={C.headerSubtitle}
        description={C.headerDescription}
      />

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />

      <Alert severity="info" sx={{ mt: 2 }}>
        {C.aclarationFAQS}
      </Alert>
      <Typography variant="h5" fontWeight={800} sx={{ mt: 4 }}>
        {C.faqsTitle}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {CONSULTATION_FAQS.map((faq) => (
          <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", borderRadius: 4 }}>
              <CardContent>
                <Chip label={faq.category} size="small" />
                <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                  {faq.question}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {faq.answer}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                  {C.link} {faq.link}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" fontWeight={800} sx={{ mt: 5 }}>
        {C.quickFaqsTitle}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {QUICK_CONSULTATION_FAQS.map((faq) => (
          <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", borderRadius: 4 }}>
              <CardContent>
                <Chip label={faq.category} size="small" variant="outlined" />
                <Typography fontWeight={700} sx={{ mt: 2 }}>
                  {faq.question}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {faq.answer}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography color="text.secondary" sx={{ mt: 4 }}>
        {C.emailDescription}
        <strong> {SAE_EMAIL}</strong>
      </Typography>
      <DialogConsultation />
    </SAEPage>
  );
}
function DialogConsultation() {
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

  const {
    handleLinksFrecuentesSave,
    handleLinksFrecuenteDelete,
    linksFrecuentesIcons,
  } = useConsultations();
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (dialogOpen && dialogType === "linkFrecuentes") {
      setFieldErrors({});
    }
  }, [dialogOpen, dialogType, dialogMode]);

  const selectedDialogIcon = useMemo(() => {
    const iconIndex = Number(dialogData?.id_index_ico) || 0;
    return (
      linksFrecuentesIcons.find((iconOption) => iconOption.id === iconIndex) ??
      linksFrecuentesIcons[0]
    );
  }, [dialogData?.id_index_ico, linksFrecuentesIcons]);

  const SelectedDialogIcon = selectedDialogIcon.icon;
  const handleLinkFieldChange = (field, value) => {
    handleDataChange(field, value);
    setFieldErrors((previous) => ({
      ...previous,
      [field]: validateLinkField(field, value),
    }));
  };

  const validateLinkDialog = () => {
    const fields = ["titulo", "hipervinculo"];
    const errors = fields.reduce((result, field) => {
      const message = validateLinkField(field, dialogData[field]);
      if (message) result[field] = message;
      return result;
    }, {});

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSaveLinkFrecuente = () => {
    if (!validateLinkDialog()) {
      setDialogError(C.errorSaving);
      return;
    }

    handleLinksFrecuentesSave();
  };

  // Cada nueva tabla puede agregar aquí su entidad, nombre y método de borrado.
  const deleteDialogConfig = {
    linkFrecuentes: {
      entityLabel: "Link frecuente",
      itemName: dialogData?.titulo,
      onConfirm: handleLinksFrecuenteDelete,
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
      {dialogOpen && dialogType === "linkFrecuentes" && (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {getDialogTitle("Link Frecuente", dialogMode)}
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
              <Grid container spacing={1}>
                {dialogMode !== "create" && (
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <SAETextField
                        label={C.formID}
                        type="number"
                        fullWidth
                        value={dialogData.id}
                        onChange={(e) => handleDataChange("id", e.target.value)}
                        disabled={true}
                      />
                    </Grid>
                )}
                    <Grid size={{ xs: 12 }} m={0}>
                      <SAETextField
                        label={C.formTitle}
                        value={dialogData.titulo}
                        onChange={(e) =>
                          handleLinkFieldChange("titulo", e.target.value)
                        }
                        error={Boolean(fieldErrors.titulo)}
                        helperText={fieldErrors.titulo ?? ""}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <SAETextField
                        label={C.formLink}
                        value={dialogData.hipervinculo}
                        onChange={(e) =>
                          handleLinkFieldChange("hipervinculo", e.target.value)
                        }
                        error={Boolean(fieldErrors.hipervinculo)}
                        helperText={fieldErrors.hipervinculo ?? ""}
                        fullWidth
                      />
                    </Grid>                    
                    <Grid size={{ xs: 12}} m={0}>
                      <FormControl fullWidth>
                        <InputLabel id="link-frecuente-icon-label">
                          {C.formIcon}
                        </InputLabel>
                        <Select
                          labelId="link-frecuente-icon-label"
                          label={C.formIcon}
                          value={Number(dialogData.id_index_ico) || 0}
                          onChange={(e) =>
                            handleDataChange("id_index_ico", e.target.value)
                          }
                          renderValue={() => {
                            const Icon = selectedDialogIcon.icon;
                            return (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Icon fontSize="small" color="primary" />
                                <Typography component="span">
                                  {selectedDialogIcon.label}
                                </Typography>
                              </Stack>
                            );
                          }}
                        >
                          {linksFrecuentesIcons.map((iconOption) => {
                            const Icon = iconOption.icon;

                            return (
                              <MenuItem
                                key={iconOption.id}
                                value={iconOption.id}
                              >
                                <ListItemIcon>
                                  <Icon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={iconOption.label} />
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>  
                    <Grid size={{ xs: 12 }} m={0}>
                      <Box
                        component={dialogData.hipervinculo ? "a" : "div"}
                        href={dialogData.hipervinculo || undefined}
                        target={dialogData.hipervinculo ? "_blank" : undefined}
                        rel={
                          dialogData.hipervinculo
                            ? "noopener noreferrer"
                            : undefined
                        }
                        sx={{
                          alignItems: "center",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          color: "inherit",
                          display: "flex",
                          gap: 1.5,
                          p: 2,
                          textDecoration: "none",
                          transition: "border-color 0.15s, box-shadow 0.15s",
                          "&:hover": dialogData.hipervinculo
                            ? {
                                borderColor: "primary.main",
                                boxShadow: "0 8px 22px rgba(21, 61, 113, 0.12)",
                              }
                            : undefined,
                        }}
                      >
                        <Box
                          sx={{
                            alignItems: "center",
                            bgcolor: "primary.main",
                            borderRadius: 2,
                            color: "white",
                            display: "flex",
                            flexShrink: 0,
                            height: 42,
                            justifyContent: "center",
                            width: 42,
                          }}
                        >
                          <SelectedDialogIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>
                            {dialogData.titulo || "Título del link"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {dialogData.hipervinculo ||
                              "https://ejemplo.com/link-frecuente"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
              </Grid>
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
              color="primary"
              onClick={handleSaveLinkFrecuente}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {dialogMode === "create"
                ? C.create
                : C.save}
            </SAEButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default function EmployedConsultations() {
  return (
    <ConsultationProvider>
      <EmployedContent />
    </ConsultationProvider>
  );
}
