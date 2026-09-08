import { useMemo, useState } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import utnLogo from "../../../assets/utn.png";
import { SAETypography } from "../../../assets/components/typography/SAETypography";
import SAEPage from "../../../assets/components/page/SAEPage";

export default function ComponentLab() {
  const [viewerMode, setViewerMode] = useState(null);

  const logoDataUrl = useMemo(() => {
    return utnLogo;
  }, []);

  const demoPdfDataUrl = useMemo(() => {
    return "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFsgMyAwIFIgXSAvQ291bnQgMSA+PgplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbMCAwIDMwMCAxNDRdIC9Db250ZW50cyA0IDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiA+PgplbmRvYmoKNCAwIG9iago8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKNzIgNzIgVGQKKFRlc3QgUERGIC0gU0FFIExhYikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjQzIDAwMDAwIG4gCjAwMDAwMDAzNDggMDAwMDAgbiAKdHJhaWxlcgo8PCAvUm9vdCAxIDAgUiAvU2l6ZSA2ID4+CnN0YXJ0eHJlZgo0MjQKJSVFT0Y=";
  }, []);

  return (
    <SAEPage>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Laboratorio de Componentes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Ruta de pruebas visuales para spinners, botones SAE y visualizadores.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Variantes de Spinner
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={4} sx={{ mb: 5 }}>
        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">Anillo + PNG L</Typography>
          <SAESpinner size="L" />
        </Stack>
        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">Anillo + PNG M</Typography>
          <SAESpinner size="M" />
        </Stack>
        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">Anillo + PNG S</Typography>
          <SAESpinner size="S" />
        </Stack>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={4} sx={{ mb: 5 }}>
        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Anillo + PNG girando
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 96,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress size={96} thickness={3.8} />
            <Box
              component="img"
              src={utnLogo}
              alt="UTN girando"
              sx={{
                width: 44,
                height: 44,
                objectFit: "contain",
                position: "absolute",
                animation: "spinLogo 1.2s linear infinite",
                "@keyframes spinLogo": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Stack>

        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Anillo + PNG girando
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 96,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress size={79} thickness={3.8} />
            <Box
              component="img"
              src={utnLogo}
              alt="UTN girando"
              sx={{
                width: 40,
                height: 40,
                objectFit: "contain",
                position: "absolute",
                animation: "spinLogo 1.2s linear infinite",
                "@keyframes spinLogo": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Stack>

        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Anillo + PNG girando
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 96,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress size={66} thickness={3.8} />
            <Box
              component="img"
              src={utnLogo}
              alt="UTN girando"
              sx={{
                width: 35,
                height: 35,
                objectFit: "contain",
                position: "absolute",
                animation: "spinLogo 1.2s linear infinite",
                "@keyframes spinLogo": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Stack>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={4} sx={{ mb: 5 }}>
        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Solo PNG girando L
          </Typography>
          <Box
            sx={{
              width: 96,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              component="img"
              src={utnLogo}
              alt="UTN solo girando L"
              sx={{
                width: 52,
                height: 52,
                objectFit: "contain",
                animation: "spinLogoOnly 1.1s linear infinite",
                "@keyframes spinLogoOnly": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Stack>

        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Solo PNG girando M
          </Typography>
          <Box
            sx={{
              width: 96,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              component="img"
              src={utnLogo}
              alt="UTN solo girando M"
              sx={{
                width: 44,
                height: 44,
                objectFit: "contain",
                animation: "spinLogoOnly 1.1s linear infinite",
                "@keyframes spinLogoOnly": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Stack>

        <Stack alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Solo PNG girando S
          </Typography>
          <Box
            sx={{
              width: 96,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              component="img"
              src={utnLogo}
              alt="UTN solo girando"
              sx={{
                width: 42,
                height: 42,
                objectFit: "contain",
                animation: "spinLogoOnly 1.1s linear infinite",
                "@keyframes spinLogoOnly": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Variantes SAEButton
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 5 }}>
        <SAEButton variant="contained">Contained</SAEButton>
        <SAEButton variant="contained" color="error">
          Contained Error
        </SAEButton>
        <SAEButton variant="outlined">Outlined Blanco</SAEButton>
        <SAEButton variant="outlined" color="success">
          Outlined Success
        </SAEButton>
        <SAEButton variant="text">Text</SAEButton>
        <SAEButton variant="contained" disabled>
          Disabled
        </SAEButton>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Visualizadores
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 5 }}>
        <SAEButton variant="contained" onClick={() => setViewerMode("image")}>
          Ver imagen
        </SAEButton>
        <SAEButton
          variant="contained"
          color="success"
          onClick={() => setViewerMode("pdf")}
        >
          Ver PDF
        </SAEButton>
        <SAEButton variant="outlined" onClick={() => setViewerMode("loading")}>
          Ver loading
        </SAEButton>
        <SAEButton
          variant="outlined"
          color="error"
          onClick={() => setViewerMode("error")}
        >
          Ver error
        </SAEButton>
      </Stack>

      <Divider sx={{ my: 4 }} />
      <Stack direction={"column"} gap={2}>
        <SAETypography variant="h1">
          Titulos H1 en la UTN FRC (negrita)
        </SAETypography>
        <SAETypography variant="h2">
          H2 para los subtitulos
        </SAETypography>
        <SAETypography variant="h3">
          Para los indecisos h3
        </SAETypography>
        <SAETypography variant="h4">
          El menos usado h4
        </SAETypography>
        <SAETypography variant="h5" fontWeight="bold">
          También usado poco, usemos bold
        </SAETypography>
        <SAETypography variant="h6">
           Para algunas cosas no muy grandes
        </SAETypography>

        <SAETypography variant="body1">
          Esto es para los textos que son muuuuuy largos como los lorem ipsum que ponés cuando estás sin ideas o como cuando describís todo lo que puede hacer la aplicación de SAE Gestión.
        </SAETypography>
        <SAETypography variant="body2">
          Esto es una variante para decir BOCA YO TE AMO y esas cosas que no te animás porque estás mojado por la vida. A veces los problemas nos parecen más de lo que realmente son, es difícil no tratar de medirse con todos los demás
        </SAETypography>
        <SAETypography variant="subtitle1">
          Esto son simplemente subtítulos
        </SAETypography>
        <SAETypography variant="subtitle2">
          El subtitulo 2 para probar
        </SAETypography>
        <SAETypography variant="button">
          Ojala los botones se cambiaran solos
        </SAETypography>
        <SAETypography variant="caption">
          Hey esto es una caption
        </SAETypography>
        <SAETypography variant="overline">
          No se que es un overline
        </SAETypography>
        <SAETypography variant="quote" fontWeight={"bold"} >
          Es acaso un hombre prisionero de su destino
        </SAETypography>
        <SAETypography variant="quote">
          O el navegante en un mar de opciones
        </SAETypography>
      </Stack>
      <Divider sx={{ mb: 4 }}/>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Variantes SAETextField
      </Typography>
      <Stack sx={{ mb: 5, maxWidth: 640 }} gap={2}>
        <SAETextField label="Default" placeholder="Escribi algo" />
        <SAETextField label="Con valor" value="Texto de ejemplo" />
        <SAETextField label="Con helper" helperText="Este es un helper text" />
        <SAETextField
          label="Error"
          error
          helperText="Mensaje de error de prueba"
        />
        <SAETextField
          label="Multiline"
          multiline
          minRows={3}
          placeholder="Comentario..."
        />
        <SAETextField label="Disabled" value="Campo deshabilitado" disabled />
      </Stack>

      <DocumentPreviewDialog
        open={viewerMode === "image"}
        onClose={() => setViewerMode(null)}
        title="Visualizador de imagen"
        imageSrc={logoDataUrl}
        isPdf={false}
        loading={false}
        error=""
        onDownload={() => {}}
      />

      <DocumentPreviewDialog
        open={viewerMode === "pdf"}
        onClose={() => setViewerMode(null)}
        title="Visualizador de PDF"
        imageSrc={demoPdfDataUrl}
        isPdf
        loading={false}
        error=""
        onDownload={() => {}}
      />

      <DocumentPreviewDialog
        open={viewerMode === "loading"}
        onClose={() => setViewerMode(null)}
        title="Visualizador cargando"
        imageSrc=""
        isPdf={false}
        loading
        error=""
        onDownload={() => {}}
      />

      <DocumentPreviewDialog
        open={viewerMode === "error"}
        onClose={() => setViewerMode(null)}
        title="Visualizador con error"
        imageSrc=""
        isPdf={false}
        loading={false}
        error="No se pudo cargar el archivo de prueba."
        onDownload={() => {}}
      />
    </SAEPage>
  );
}
