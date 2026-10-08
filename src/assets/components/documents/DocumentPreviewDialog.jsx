import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function DocumentPreviewDialog({
  open,
  onClose,
  title,
  imageSrc,
  isPdf,
  loading,
  error,
  onDownload,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const canDownload =
    !!imageSrc && !loading && !error && typeof onDownload === "function";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography
            component="span"
            variant="h6"
            sx={{
              fontWeight: "bold",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Typography>

          <IconButton
            size="small"
            onClick={onDownload}
            disabled={!canDownload}
            aria-label="Descargar documento"
            title="Descargar"
            sx={{ flexShrink: 0 }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Cerrar"
          sx={{ flexShrink: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Typography color="error">{error}</Typography>}

        {!loading && !error && imageSrc && !isPdf && (
          <Box
            component="img"
            src={imageSrc}
            alt={title || "Vista previa del documento"}
            sx={{
              display: "block",
              width: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: 1,
              bgcolor: "grey.100",
            }}
          />
        )}

        {!loading &&
          !error &&
          imageSrc &&
          isPdf &&
          (isSmallScreen ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                py: 4,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">
                Abrí el PDF para visualizarlo o descargalo en tu dispositivo.
              </Typography>

              <Button
                component="a"
                href={imageSrc}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<OpenInNewIcon />}
                fullWidth
              >
                Abrir PDF
              </Button>

              <Button
                onClick={onDownload}
                disabled={!canDownload}
                variant="outlined"
                startIcon={<DownloadIcon />}
                fullWidth
              >
                Descargar
              </Button>
            </Box>
          ) : (
            <Box
              component="iframe"
              src={imageSrc}
              title={title || "Vista previa del PDF"}
              sx={{
                display: "block",
                width: "100%",
                height: "70vh",
                border: 0,
                borderRadius: 1,
                bgcolor: "grey.100",
              }}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
}
