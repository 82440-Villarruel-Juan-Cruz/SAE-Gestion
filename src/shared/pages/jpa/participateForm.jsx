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
  CircularProgress,
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
import { isEmpty } from "../../../utils/text.utils";
import { useNotification } from "../../context/sharedContext";

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
            id: "10",
            line: "10",
            color: "orange",
            empresa: "Coniferal",
        },
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
        
        // Corredor 2 (TAMSE - ex ERSA)
        {
            id: "20",
            line: "20",
            color: "red",
            empresa: "TAMSE",
        },
        {
            id: "22",
            line: "20",
            color: "red",
            empresa: "TAMSE",
        },
        {
            id: "26",
            line: "20",
            color: "red",
            empresa: "TAMSE",
        },
        
        // Corredor 3 (TAMSE - ex Aucor/ERSA)
        {
            id: "32",
            line: "30",
            color: "green",
            empresa: "TAMSE",
        },
        
        // Corredor 4 (TAMSE)
        {
            id: "41",
            line: "40",
            color: "blue",
            empresa: "TAMSE",
        },
        {
            id: "42",
            line: "40",
            color: "blue",
            empresa: "TAMSE",
        },
        
        // Corredor 5 (TAMSE - ex Aucor/ERSA)
        {
            id: "50",
            line: "50",
            color: "green",
            empresa: "TAMSE",
        },
        {
            id: "52",
            line: "50",
            color: "green",
            empresa: "TAMSE",
        },
        {
            id: "53",
            line: "50",
            color: "green",
            empresa: "TAMSE",
        },
        
        // Corredor 6 (Coniferal)
        {
            id: "60",
            line: "60",
            color: "orange",
            empresa: "Coniferal",
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
        
        // Corredor 7 (TAMSE - ex ERSA)
        {
            id: "71",
            line: "70",
            color: "red",
            empresa: "TAMSE",
        },
        {
            id: "73",
            line: "70",
            color: "red",
            empresa: "TAMSE",
        },
        {
            id: "75",
            line: "70",
            color: "red",
            empresa: "TAMSE",
        },
        
        // Anillo / Circulares (TAMSE)
        {
            id: "600",
            line: "600",
            color: "blue",
            empresa: "TAMSE",
        },
        {
            id: "601",
            line: "600",
            color: "blue",
            empresa: "TAMSE",
        },
    ];

    const {
        setDialogOpen,
        dialogOpen,
        dialogData,
        handleDataChange,
        closeDialog,
    } = useNotification();

    //Que formulario abre
    const [tabOption, setTabOption] = useState(1);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [isSending,SetSending] = useState(false);
    
    const resetValidation = () => {
        setFieldErrors({});
        setTouchedFields({});
    };

    const handleTabChange = (event,newValue) => {
        setTabOption(newValue);
        resetValidation();
    };
    const validateField = (field, value) => {
      switch (field) {
        case "user_name":
            return isEmpty(value) ? requiredMessage : "";
        case "desc":
            return isEmpty(value) ? requiredMessage : "";
        case "date":
            return isEmpty(value) ? requiredMessage : "";
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
  
    const validate = (data = dialogData) => {

        const fields =
        tabOption === 1
        ? ["user_name", "user_email", "phone", "desc"] //Empresas
        : tabOption === 2? ["user_name", "user_email", "phone", "carrera"] //Estudiantes
        : ["user_name","user_email", "phone", "amount","date"] //Otros

        const errors = fields.reduce((result, field) => {
        const message = validateField(field, data[field], data);
        return message ? { ...result, [field]: message } : result;
        }, {});
        setFieldErrors(errors);
        setTouchedFields(
            fields.reduce((result, field) => ({ ...result, [field]: true }), {}),
        );
        return Object.keys(errors).length === 0;
    };
   
    const handleSendEmail = async () => {
      if (!validate()) return;
        sendEmail();
    };
  
    const sendEmail = (data = dialogData) => {
        SetSending(true);
        sendJPAEmailForm(data) .then(() => {
            setDialogOpen(true);
        })
        .catch((error) => {
            console.error("Error al enviar email:", error);
            console.error(touchedFields)
        })
        .finally(() => {
            SetSending(false); 
        });
    };
    const handleClose = async () => {
        resetValidation();
        closeDialog();
    };    
    //fin mail
    return(
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
                    <TabContext value={tabOption}>
                        <Box
                        sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        px: { xs: 1, md: 3 },
                        }}
                        >
                            <TabList
                            onChange={handleTabChange}
                            variant="scrollable"
                            aria-label="lab API tabs example"
                            scrollButtons="auto"
                            sx={{
                                "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 700,
                                minHeight: 58,
                                },
                            }}
                            >
                                <Tab label="Empresas" value={1}/>
                                <Tab label="Estudiantes" value={2} />
                                <Tab label="Colegios / Municipios / ONG" value={3} />
                            </TabList>
                        </Box>
                        <TabPanel value={1} style={{ padding: 0 }}>
                            <Grid container spacing={2.5} p={{ xs: 2.5, md: 4 }}>
                                <Grid size={{ xs: 12 }}>
                                    <SAETextField
                                        fullWidth
                                        required
                                        id="outlined-required"
                                        value={dialogData?.user_name||""}
                                        label="Nombre de la empresa"
                                        name="user_name"
                                        onChange={(event) =>
                                        handleDataChange("user_name", event.target.value, {
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })
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
                                        value={dialogData?.user_email||""}
                                        name="user_email"
                                        type="email"
                                        onChange={(event) =>
                                        handleDataChange("user_email", event.target.value, {
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })
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
                                        value={dialogData?.phone||""}
                                        label="Teléfono"
                                        name="phone"
                                        type="tel"
                                          onChange={(event) =>
                                            handleDataChange("phone", event.target.value, {
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })
                                        }
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
                                        value={dialogData?.desc||""}
                                        label="Interes con la Facultad"
                                        name="desc"
                                        onChange={(event) =>
                                            handleDataChange("desc", event.target.value, {
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })
                                        }
                                        error={Boolean(fieldErrors.desc)}
                                        helperText={fieldErrors.desc ?? ""}
                                    />
                                    </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={2} style={{ padding: 0 }}>
                            <Grid container spacing={2.5} p={{ xs: 2.5, md: 4 }}>
                                <Grid size={{ xs: 12 }}>
                                <SAETextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Nombre y apellido"
                                    value={dialogData?.user_name||""}
                                    name="user_name"
                                    onChange={(event) =>
                                    handleDataChange("user_name", event.target.value, {
                                            setTouched: setTouchedFields,
                                            setErrors: setFieldErrors,
                                            validateFn: validateField,
                                        })
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
                                            value={dialogData?.user_email||""}
                                            name="user_email"
                                            type="email"
                                            onChange={(event) =>
                                            handleDataChange("user_email", event.target.value, {
                                                    setTouched: setTouchedFields,
                                                    setErrors: setFieldErrors,
                                                    validateFn: validateField,
                                                })
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
                                        value={dialogData?.phone||""}
                                        label="Teléfono"
                                        name="phone"
                                        type="tel"
                                        onChange={(event) =>
                                        handleDataChange("phone", event.target.value, {
                                            setTouched: setTouchedFields,
                                            setErrors: setFieldErrors,
                                            validateFn: validateField,
                                        })
                                        }
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
                                    value={dialogData.carrera || ""}
                                    label="Carrera"
                                    onChange={(event) =>
                                    handleDataChange("carrera", event.target.value, {
                                        setTouched: setTouchedFields,
                                        setErrors: setFieldErrors,
                                        validateFn: validateField,
                                    })}
                                    name="carrera"
                                    error={Boolean(fieldErrors.carrera)}
                                    helperText={fieldErrors.carrera ?? ""}
                                    >
                                    <MenuItem value={"Ingeniería en Sistemas de Información"}>
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
                                
                            </Grid>
                        </TabPanel>
                        <TabPanel value={3} style={{ padding: 0 }}>
                            <Grid container spacing={2.5} p={{ xs: 2.5, md: 4 }}>
                                <Grid size={{ xs: 12 }}>
                                <SAETextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Nombre y apellido"
                                    value={dialogData?.user_name||""}
                                    name="user_name"
                                    onChange={(event) =>
                                    handleDataChange("user_name", event.target.value, {
                                            setTouched: setTouchedFields,
                                            setErrors: setFieldErrors,
                                            validateFn: validateField,
                                        })
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
                                        value={dialogData?.user_email||""}
                                        name="user_email"
                                        type="email"
                                        onChange={(event) =>
                                        handleDataChange("user_email", event.target.value, {
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })
                                        }
                                        error={Boolean(fieldErrors.user_email)}
                                        helperText={fieldErrors.user_email ?? ""}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, lg: 4 }}>
                                    <SAETextField
                                        fullWidth
                                        required
                                        id="outlined-required"
                                        value={dialogData?.phone||""}
                                        label="Teléfono"
                                        name="phone"
                                        type="tel"
                                        onChange={(event) =>
                                        handleDataChange("phone", event.target.value, {
                                            setTouched: setTouchedFields,
                                            setErrors: setFieldErrors,
                                            validateFn: validateField,
                                        })}
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
                                        handleDataChange("amount", event.target.value,{
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })}
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
                                    handleDataChange("date", event.target.value,{
                                                setTouched: setTouchedFields,
                                                setErrors: setFieldErrors,
                                                validateFn: validateField,
                                            })}
                                    error={Boolean(fieldErrors.date)}
                                    helperText={fieldErrors.date ?? ""}
                                />
                                </Grid>
                                
                            </Grid>
                        </TabPanel>
                        <Grid
                            size={{ xs: 12 }}
                            justifyContent="flex-end"
                            display="flex"
                            padding={2}
                            >
                        <SAEButton
                            variant="contained"
                            onClick={handleSendEmail}
                            color="primary"
                            disabled={isSending}
                            endIcon={
                            isSending? 
                            (<CircularProgress size={16} color="inherit" />):
                            <SendRoundedIcon />
                            }                        
                            sx={{
                            width: { xs: "100%", sm: "auto" },
                            px: 5,
                            py: 1.4,
                            }}
                        >
                            {C.participateSend}
                        </SAEButton>
                        </Grid>
                    </TabContext>
                </Box>
          </Paper>
        </Container>
      <Dialog
        open={dialogOpen}
        key="alert-dialog-inscripcion"
        onClose={handleClose}
      >
        <DialogTitle
          id="alert-dialog-title"
          textAlign="center"
          fontWeight={700}
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
            onClick={handleClose}
            style={{ color: "white" }}
          >
            {C.close}
          </SAEButton>
        </DialogActions>
      </Dialog>        
    </Box>
    );
}