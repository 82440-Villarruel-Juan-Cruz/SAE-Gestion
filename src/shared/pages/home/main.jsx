import { Box, Container, Typography, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import NovedadesEstudiantiles from "../../../assets/components/studentNews/studentNews";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAEPage from "../../../assets/components/page/SAEPage";

import { MAIN_STRINGS } from "../../../utils/strings/shared.strings";

const C = MAIN_STRINGS;
const baseUrl = import.meta.env.BASE_URL;

export default function Main() {
  return (
    <>
      <SAEHero />
      <Box
        px={
          "2vw" //Poniendo la SAE Page queda muy chico y no me gusta
        }
      >
        <NovedadesEstudiantiles />
      </Box>
    </>
  );
}

function SAEHero() {
  const MotionImg = motion.img;
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "100px"  },
        pb: {xs:4},
        minHeight: {xs:"none",md:"calc(100vh - 90px)"},
        background: "var(--gradient)",
        overflow: "hidden",
        position: "relative",
        isolation: "isolate",
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          py={{ xs: 0, md: 4 }}
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* ---------------- MOBILE ---------------- */}

          <Box
            display={{ xs: "block", md: "none" }}
            sx={{
              mb: 3,
              textAlign: "center",
            }}
          >
            <MotionImg
              src={`${baseUrl}images/principal/mobileSAE.svg`}
              alt="Secretaría"
              initial={{
                opacity: 0,
                x: -80,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 1,
              }}
              style={{
                width: "80%",
                maxWidth: "520px",
              }}
            />
          </Box>

          {/* ---------------- DESKTOP ---------------- */}

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "75%",
            }}
          >
            {/* Texto SAE Desktop */}

            <Box
              sx={{
                display: "block",
                flex: 1,
                textAlign: "right",
              }}
            >
              <MotionImg
                src={`${baseUrl}saeLogo.svg`}
                alt="Secretaría"
                initial={{
                  opacity: 0,
                  x: -80,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: "100%",
                  maxWidth: "520px",
                }}
              />
            </Box>
            {/* Divider Desktop */}

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                bgcolor: "rgba(255,255,255,.85)",
                width: "4px",
                borderRadius: 3,
              }}
            />
            {/* Logo SAE */}

            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <MotionImg
                src={`${baseUrl}images/principal/desktopSAE.svg`}
                alt="SAE"
                initial={{
                  opacity: 0,
                  x: 80,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: "100%",
                  maxWidth: "600px",
                }}
              />
            </Box>
          </Stack>

          {/* ---------------- DESCRIPCIÓN ---------------- */}

          <Typography
            variant="caption"
            sx={{
              my:{xs:3,md:5},
              maxWidth: {xs:"95%", md:"60vw"},
              fontSize:{xs:"inherit",md:"1rem"},
              textAlign: "center",
              color: "var(--textWhite)",
              opacity: 0.9,
            }}
          >
            {C.mainDescription}
          </Typography>

          {/* ---------------- BOTONES ---------------- */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
              width: "100%"
            }}
          >
            <SAEButton
              onClick={() => navigate("/JPA")}
              variant="contained"
              size="large"
              startIcon={<SchoolOutlinedIcon />}
              sx={{
                width: {xs:300,md:340},
                py: 1.6,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",

                background: "var(--secondary)",
              }}
            >
              {C.meetUsButton}
            </SAEButton>

            <SAEButton
              onClick={() => navigate("/login")}
              variant="contained"
              size="large"
              startIcon={
                <Box
                  component="img"
                  src={`${baseUrl}logoUTN.svg`}
                  alt="UTN Logo"
                  
                  sx={{
                    width: 22,
                    height: 24,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              }
              sx={{
                width: {xs:300,md:340},
                py: 1.6,
                borderRadius: 2,
                textTransform: "none",
                color: "white",
                background: "#6FA958",
                fontWeight: 700,
                fontSize: "1rem",

                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.08)",
                },
              }}
            >
              {C.logButton}
            </SAEButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
