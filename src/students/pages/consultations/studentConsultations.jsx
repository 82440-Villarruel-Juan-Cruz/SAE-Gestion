import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SendIcon from "@mui/icons-material/Send";

import {
  CONSULTATION_FAQS,
  QUICK_CONSULTATION_FAQS,
  SAE_EMAIL,
} from "../../../utils/common/common.config.js"


import HeaderPageStudent from "../../../assets/components/headerPage/headerPageStudent.jsx";
import TitleBox from "../../../assets/components/titleBox.jsx";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import SAEPage from "../../../assets/components/page/SAEPage";
import { SAETypography } from "../../../assets/components/typography/SAETypography";

import { CONSULTATIONS_STRINGS } from "../../../utils/strings/student.strings.js"; 

import { getLinkFrecuenteIconByIndex } from "../../../utils/util.jsx"; 
import { ConsultationAlumnoProvider } from "../../../students/context/providers/consultationsProvider";
import { useConsultationContext } from "../../context/studentContext";

const C = CONSULTATIONS_STRINGS;

export function StudentContent() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL;

  const {
    loadingLinksFrecuentes,
    linksFrecuentes,
    form,
    sending,
    handleChange,
    handleSubmit,
    handleLinkFrecuenteClick,
  } = useConsultationContext();

  return (
    <SAEPage>
      <HeaderPageStudent
        title={C.headerTitle}
        description={C.headerDescription}
        backgroundImage="images/buildings/inchaurrondo/FrenteVidriado.jpg"
        icon={ContactSupportIcon}
      />
      <TitleBox
        title={C.linktreeTitle}
        description={C.linktreeDescription}
      />

      {loadingLinksFrecuentes ? (
        <Stack alignItems="center" sx={{ mt: 3, mb: 5 }}>
          <SAESpinner size="S" />
        </Stack>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
          {linksFrecuentes.map((link) => {
            const iconOption = getLinkFrecuenteIconByIndex(link.id_index_ico);
            const Icon = iconOption.icon;

            return (
              <Grid key={link.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  component="a"
                  href={link.hipervinculo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => handleLinkFrecuenteClick(event, link)}
                  sx={{
                    alignItems: "center",
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "rgba(17, 53, 101, 0.08)",
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
                    color: "inherit",
                    display: "flex",
                    gap: 1.5,
                    height: "100%",
                    minHeight: 96,
                    p: 2,
                    textDecoration: "none",
                    transition:
                      "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 14px 30px rgba(21, 61, 113, 0.14)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      alignItems: "center",
                      bgcolor: "var(--primary)",
                      borderRadius: 2,
                      color: "var(--textWhite)",
                      display: "flex",
                      flexShrink: 0,
                      height: 46,
                      justifyContent: "center",
                      width: 46,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <SAETypography
                      variant="subtitle1"
                      fontWeight={600}
                      noWrap
                    >
                      {link.titulo}
                    </SAETypography>
                    <SAETypography
                      variant="body2"
                      color="var(--secondary)"
                      noWrap
                    >
                      {link.hipervinculo}
                    </SAETypography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
          {linksFrecuentes.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">
                {C.linktreeNoData}
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      <TitleBox
        title={C.faqsTitle}
        description={C.faqsDescription}
      />

      <Grid container spacing={2.5} alignItems="flex-start" sx={{ mt: 1 }}>
        {CONSULTATION_FAQS.map((faq) => (
          <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
              <Box
                sx={{
                  height: 250,
                  backgroundImage: `url('${baseUrl}${faq.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <CardContent>
                <Chip label={faq.category} size="small" color="primary" />
                <Accordion elevation={0} disableGutters sx={{ mt: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <SAETypography fontWeight={700}>
                      {faq.question}
                    </SAETypography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <SAETypography color="var(--textSecondary)">
                      {faq.answer}
                    </SAETypography>
                    <SAEButton
                      endIcon={<OpenInNewIcon />}
                      onClick={() => navigate(faq.link)}
                      sx={{ mt: 2 }}
                    >
                      {faq.linkLabel}
                    </SAEButton>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box>
        <TitleBox
          title={C.moreFaqsTitle}
          description={C.moreFaqsDescription}
        />

        {QUICK_CONSULTATION_FAQS.map((faq) => (
          <Accordion
            key={faq.id}
            disableGutters
            sx={{
              mb: 1.5,
              borderRadius: "12px !important",
              border: "1px solid rgba(17, 53, 101, 0.08)",
              boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  label={faq.category}
                  size="small"
                  color="var(--chipBackground)"
                />
                <SAETypography variant="subtitle2" fontWeight={700}>
                  {faq.question}
                </SAETypography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <SAETypography color="text.secondary">{faq.answer}</SAETypography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Card sx={{ mt: 5, borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <SAETypography variant="h5" fontWeight={800}>
            {C.sendMailTitle}
          </SAETypography>
          <SAETypography color="var(--textSecondary)" sx={{ mt: 1, mb: 3 }}>
            {C.emailClaration}{SAE_EMAIL}.
          </SAETypography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <SAETextField
                  fullWidth
                  required
                  label={C.formNameLabel}
                  name="user_name"
                  value={form.user_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SAETextField
                  fullWidth
                  required
                  type="email"
                  label={C.formMailLabel}
                  name="user_email"
                  value={form.user_email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <SAETextField
                  fullWidth
                  required
                  label={C.formSubjectLabel}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <SAETextField
                  fullWidth
                  required
                  multiline
                  minRows={5}
                  label={C.formQuestionLabel}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
              <SAEButton
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={sending}
              >
                {sending ? C.sendingButton : C.sendButton}
              </SAEButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </SAEPage>
  );
}

export default function StudentConsultations() {
  return (
    <ConsultationAlumnoProvider>
      <StudentContent />
    </ConsultationAlumnoProvider>
  );
}
