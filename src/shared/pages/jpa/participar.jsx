import {
  Avatar,
  Box,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Tab,
} from "@mui/material";
import { useState } from "react";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";

import HowToRegIcon from "@mui/icons-material/HowToReg";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DirectionsBusOutlinedIcon from "@mui/icons-material/DirectionsBusOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { sendJPAEmailForm } from "../../../api/EmailService";
import { JPA_STRINGS } from "../../../utils/strings/shared.strings";
import { isValidEmail, isValidPhone } from "../../../utils/validation.utils";
import { isEmpty, onlyDigits } from "../../../utils/text.utils";

const C = JPA_STRINGS;
const checkImage = `${import.meta.env.BASE_URL}images/logos/comprobado.png`;
const requiredMessage = "Este campo es obligatorio";
const emailRequiredMessage = "Ingrese el email";
const emailFormatMessage = "Ingrese un email válido";
const phoneRequiredMessage = "Ingrese el teléfono";
const phoneFormatMessage = "Ingrese un teléfono válido";
const amountRequiredMessage = "Ingrese la cantidad";
const amountFormatMessage = "Ingrese una cantidad valida";

export default function SharedJPAParticipar() {
  const colectivos = [
    {
      id: "13",
      line: "10",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "18",
      line: "10",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "19",
      line: "10",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "21",
      line: "20",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "22",
      line: "20",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "26",
      line: "20",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "32",
      line: "30",
      color: "green",
      empresa: "Aucor",
    },
    {
      id: "41",
      line: "40",
      color: "blue",
      empresa: "Tamse",
    },
    {
      id: "52",
      line: "50",
      color: "green",
      empresa: "Aucor",
    },
    {
      id: "53",
      line: "50",
      color: "green",
      empresa: "Aucor",
    },
    {
      id: "66",
      line: "60",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "67",
      line: "60",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "71",
      line: "70",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "73",
      line: "70",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "600",
      line: "600",
      color: "blue",
      empresa: "Tamse",
    },
    {
      id: "601",
      line: "600",
      color: "blue",
      empresa: "Tamse",
    },
  ];

  const [dialog, setDialog] = useState(false);

  const closeDialog = () => {
    setDialog(false);
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case "user_name":
      case "desc":
      case "date":
      case "carrera":
        return isEmpty(value) ? requiredMessage : "";
      case "user_email":
        if (isEmpty(value)) return emailRequiredMessage;
        return isValidEmail(value) ? "" : emailFormatMessage;
      case "phone":
        if (isEmpty(value)) return phoneRequiredMessage;
        return isValidPhone(value) ? "" : phoneFormatMessage;
      case "amount":
        if (isEmpty(value)) return amountRequiredMessage;
        return Number.isInteger(Number(value)) && Number(value) > 0
          ? ""
          : amountFormatMessage;
      default:
        return "";
    }
  };

  const handleFieldChange = (field, value) => {
    setFieldErrors((previous) => ({
      ...previous,
      [field]: validateField(field, value),
    }));
  };

  const handlePhoneChange = (event) => {
    const value = onlyDigits(event.target.value);
    event.target.value = value;
    handleFieldChange("phone", value);
  };

  const validate = (form) => {
    const formData = new FormData(form);
    const fieldsByType = {
      "Colegio / Municipio / ONG": [
        "user_name",
        "user_email",
        "phone",
        "amount",
        "date",
      ],
      Empresas: ["user_name", "user_email", "phone", "desc"],
      Estudiantes: ["user_name", "user_email", "phone", "carrera"],
    };
    const formType = formData.get("form_type");
    const fields = fieldsByType[formType] ?? [];
    const errors = fields.reduce((result, field) => {
      const message = validateField(field, formData.get(field));
      if (message) result[field] = message;
      return result;
    }, {});

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!validate(e.currentTarget)) return;

    sendJPAEmailForm(e.currentTarget)
      .then(() => {
        setDialog(true);
      })
      .catch((error) => {
        console.error("Error al enviar email:", error);
      });
  };
  //fin mail

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFieldErrors({});
  };

  const [carrera, setCarrera] = useState(
    "Ingeniería en Sistemas de Información",
  );

  const handleChangeCombo = (event) => {
    setCarrera(event.target.value);
    handleFieldChange("carrera", event.target.value);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "var(--background)",
        pb: { xs: 6, md: 10 },
        mt: "-90px",
      }}
    >
      <Box
        sx={{
          background: "var(--gradient)",
          color: "white",
          pt: { xs: "126px", md: "150px" },
          pb: { xs: 10, md: 13 },
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            right: -90,
            top: -160,
            bgcolor: "rgba(255,255,255,.09)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: { xs: 52, md: 64 },
                height: { xs: 52, md: 64 },
                bgcolor: "rgba(255,255,255,.16)",
                backdropFilter: "blur(8px)",
              }}
            >
              <HowToRegIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography
                variant="h2"
                fontWeight={900}
                fontSize={{ xs: "2rem", md: "3.5rem" }}
              >
                {C.participateTitle}
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mt: 0.5, maxWidth: { xs: 680, md: 1000 } }}
              >
                {C.participateDescription}
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{ mt: { xs: -6, md: -8 }, position: "relative", zIndex: 1 }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: { xs: 3, md: 5 },
              overflow: "hidden",
              border: "1px solid rgba(18,54,102,.1)",
              boxShadow: "0 18px 45px rgba(18,54,102,.13)",
            }}
          >
            <Grid size={12}>
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#E8EEF5", color: "#123666" }}>
                    <LocationOnOutlinedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>
                      {C.findUsTitle}
                    </Typography>
                    <Typography color="text.secondary">
                      {C.findUsDescription}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <iframe
                title={C.whereFindUs}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1063.1657514756466!2d-64.19445682694611!3d-31.442516265642624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2f66864ac1d%3A0x353cb4569b42a5bb!2sSecretar%C3%ADa%20de%20Asuntos%20Estudiantiles%20(S.A.E.)%20%7C%20U.T.N.%20%E2%80%93%20F.R.C.!5e0!3m2!1ses-419!2sar!4v1725738818372!5m2!1ses-419!2sar"
                loading="lazy"
                width="100%"
                height="340"
                style={{ border: 0, display: "block" }}
              ></iframe>
            </Grid>
            <Grid
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(4, minmax(0, 1fr))",
                  sm: "repeat(8, minmax(0, 1fr))",
                  md: "repeat(16, minmax(0, 1fr))",
                },
                p: { xs: 2, md: 2.5 },
                bgcolor: "#F8FAFD",
                gap: 1,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  gridColumn: "1 / -1",
                  width: "100%",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <DirectionsBusOutlinedIcon color="primary" />
                <Typography fontWeight={700} color="#123666">
                  {C.findUsBus}
                </Typography>
              </Stack>
              {colectivos.map((item, index) => (
                <Chip
                  size="small"
                  className={`colectivo-${item.empresa}`}
                  key={`colectivos${index}`}
                  label={item.id}
                  avatar={<Avatar>{item.line}</Avatar>}
                  variant="outlined"
                  sx={{
                    width: "100%",
                    bgcolor: "white",
                    fontWeight: 700,
                    borderColor: item.color,
                    "& .MuiChip-avatar": {
                      bgcolor: item.color,
                      color: "white",
                      fontWeight: 800,
                    },
                  }}
                />
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: { xs: 3, md: 4 },
            borderRadius: { xs: 3, md: 5 },
            overflow: "hidden",
            border: "1px solid rgba(18,54,102,.1)",
            boxShadow: "0 18px 45px rgba(18,54,102,.1)",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              bgcolor: "#FBFCFE",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              typography: "body1",
            }}
          >
            <Box sx={{ p: { xs: 2.5, md: 4 }, pb: { xs: 1, md: 2 } }}>
              <Typography variant="h4" fontWeight={900} color="var(--primary)">
                {C.howToTitle}
              </Typography>
              <Typography color="text.secondary" mt={0.5}>
                {C.howToDescription}
              </Typography>
            </Box>
            <TabContext value={value}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  px: { xs: 1, md: 3 },
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 700,
                      minHeight: 58,
                    },
                  }}
                >
                  <Tab label="Colegios / Municipios / ONG" value="1" />
                  <Tab label="Empresas" value="2" />
                  <Tab label="Estudiantes" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1" style={{ padding: 0 }}>
                <form onSubmit={sendEmail} noValidate>
                  <input
                    type="hidden"
                    name="subject"
                    value="Participación JPA - Colegio/Municipio/ONG"
                  />

                  <input
                    type="hidden"
                    name="form_type"
                    value="Colegio / Municipio / ONG"
                  />
                  <Grid container spacing={2.5} p={{ xs: 2.5, md: 4 }}>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        fullWidth
                        required
                        label={C.participateName}
                        name="user_name"
                        onChange={(event) =>
                          handleFieldChange("user_name", event.target.value)
                        }
                        error={Boolean(fieldErrors.user_name)}
                        helperText={fieldErrors.user_name ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        fullWidth
                        required
                        label={C.participateEmail}
                        name="user_email"
                        type="email"
                        onChange={(event) =>
                          handleFieldChange("user_email", event.target.value)
                        }
                        error={Boolean(fieldErrors.user_email)}
                        helperText={fieldErrors.user_email ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                      <SAETextField
                        fullWidth
                        required
                        label={C.participatePhone}
                        name="phone"
                        type="tel"
                        onChange={handlePhoneChange}
                        error={Boolean(fieldErrors.phone)}
                        helperText={fieldErrors.phone ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                      <SAETextField
                        fullWidth
                        required
                        label={C.participateQuant}
                        name="amount"
                        type="number"
                        onChange={(event) =>
                          handleFieldChange("amount", event.target.value)
                        }
                        error={Boolean(fieldErrors.amount)}
                        helperText={fieldErrors.amount ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                      <SAETextField
                        fullWidth
                        required
                        label={C.participateDate}
                        name="date"
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        onChange={(event) =>
                          handleFieldChange("date", event.target.value)
                        }
                        error={Boolean(fieldErrors.date)}
                        helperText={fieldErrors.date ?? ""}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      justifyContent="flex-end"
                      display="flex"
                    >
                      <SAEButton
                        variant="contained"
                        type="submit"
                        color="primary"
                        endIcon={<SendRoundedIcon />}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          px: 5,
                          py: 1.4,
                        }}
                      >
                        {C.participateSend}
                      </SAEButton>
                    </Grid>
                  </Grid>
                </form>
              </TabPanel>
              <TabPanel value="2" style={{ padding: 0 }}>
                <form onSubmit={sendEmail} noValidate>
                  <input type="hidden" name="form_type" value="Empresas" />
                  <input
                    type="hidden"
                    name="subject"
                    value="Participación JPA - Empresas"
                  />

                  <Grid container spacing={2.5} p={{ xs: 2.5, md: 4 }}>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Nombre de la empresa"
                        name="user_name"
                        onChange={(event) =>
                          handleFieldChange("user_name", event.target.value)
                        }
                        error={Boolean(fieldErrors.user_name)}
                        helperText={fieldErrors.user_name ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <SAETextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Ingrese el email"
                        name="user_email"
                        type="email"
                        onChange={(event) =>
                          handleFieldChange("user_email", event.target.value)
                        }
                        error={Boolean(fieldErrors.user_email)}
                        helperText={fieldErrors.user_email ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <SAETextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        onChange={handlePhoneChange}
                        error={Boolean(fieldErrors.phone)}
                        helperText={fieldErrors.phone ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 12 }}>
                      <SAETextField
                        multiline
                        fullWidth
                        required
                        id="outlined-required"
                        label="Descripción stand"
                        name="desc"
                        onChange={(event) =>
                          handleFieldChange("desc", event.target.value)
                        }
                        error={Boolean(fieldErrors.desc)}
                        helperText={fieldErrors.desc ?? ""}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      justifyContent="flex-end"
                      display="flex"
                    >
                      <SAEButton
                        variant="contained"
                        type="submit"
                        color="primary"
                        endIcon={<SendRoundedIcon />}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          px: 5,
                          py: 1.4,
                        }}
                      >
                        {C.participateSend}
                      </SAEButton>
                    </Grid>
                  </Grid>
                </form>
              </TabPanel>
              <TabPanel value="3" style={{ padding: 0 }}>
                <form onSubmit={sendEmail} noValidate>
                  <input type="hidden" name="form_type" value="Estudiantes" />
                  <input
                    type="hidden"
                    name="subject"
                    value="Participación JPA - Estudiantes"
                  />
                  <Grid container spacing={2.5} p={{ xs: 2.5, md: 4 }}>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Nombre y apellido"
                        name="user_name"
                        onChange={(event) =>
                          handleFieldChange("user_name", event.target.value)
                        }
                        error={Boolean(fieldErrors.user_name)}
                        helperText={fieldErrors.user_name ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Ingrese el email"
                        name="user_email"
                        type="email"
                        onChange={(event) =>
                          handleFieldChange("user_email", event.target.value)
                        }
                        error={Boolean(fieldErrors.user_email)}
                        helperText={fieldErrors.user_email ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <SAETextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        onChange={handlePhoneChange}
                        error={Boolean(fieldErrors.phone)}
                        helperText={fieldErrors.phone ?? ""}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <SAETextField
                        select
                        fullWidth
                        required
                        id="demo-simple-select"
                        value={carrera}
                        label="Carrera"
                        onChange={handleChangeCombo}
                        name="carrera"
                        error={Boolean(fieldErrors.carrera)}
                        helperText={fieldErrors.carrera ?? ""}
                      >
                        <MenuItem
                          value={"Ingeniería en Sistemas de Información"}
                        >
                          Ingeniería en Sistemas de Información
                        </MenuItem>
                        <MenuItem value={"Ingeniería Industrial"}>
                          Ingeniería Industrial
                        </MenuItem>
                        <MenuItem value={"Ingeniería Mecánica"}>
                          Ingeniería Mecánica
                        </MenuItem>
                        <MenuItem value={"Ingeniería Metalúrgica"}>
                          Ingeniería Metalúrgica
                        </MenuItem>
                        <MenuItem value={"Ingeniería Química"}>
                          Ingeniería Química
                        </MenuItem>
                        <MenuItem value={"Ingeniería Civil"}>
                          Ingeniería Civil
                        </MenuItem>
                        <MenuItem value={"Ingeniería Eléctrica"}>
                          Ingeniería Eléctrica
                        </MenuItem>
                        <MenuItem value={"Ingeniería Electrónica"}>
                          Ingeniería Electrónica
                        </MenuItem>
                      </SAETextField>
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      justifyContent="flex-end"
                      display="flex"
                    >
                      <SAEButton
                        variant="contained"
                        type="submit"
                        color="primary"
                        endIcon={<SendRoundedIcon />}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          px: 5,
                          py: 1.4,
                        }}
                      >
                        {C.participateSend}
                      </SAEButton>
                    </Grid>
                  </Grid>
                </form>
              </TabPanel>
            </TabContext>
          </Box>
        </Paper>
      </Container>
      <Dialog
        open={dialog}
        key="alert-dialog-inscripcion"
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title-1"
        aria-describedby="alert-dialog-description-1"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle
          id="alert-dialog-title"
          textAlign="center"
          fontWeight={800}
        >
          {C.emailSended}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-1">
            {C.emailAclaration}
          </DialogContentText>
          <br />
          <Box display="flex" justifyContent="center">
            <Box
              component="img"
              src={checkImage}
              alt=""
              sx={{ width: 50, height: 50 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <SAEButton
            variant="contained"
            color="primary"
            onClick={closeDialog}
            style={{ color: "white" }}
          >
            {C.close}
          </SAEButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
