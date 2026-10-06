import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

const baseUrl = import.meta.env.BASE_URL;

export default function NewsPreviewDialog({
  open,
  onClose,
  title,
  date,
  description,
  imageSrc,
  documents = [],
  documentsLoading = false,
  onPreviewDocument,
}) 
{
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#14325c">
            {title}
          </Typography>
          <Typography color="text.secondary">{date}</Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Cerrar"
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box
            component="img"
            src={imageSrc || `${baseUrl}images/principal/newsGeneric.webp`}
            alt={title || "Noticia"}
            sx={{ borderRadius: 2, maxHeight: 280, objectFit: "cover", width: "100%" }}
          />
          <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {description}
          </Typography>
          {documentsLoading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Cargando documentos...
              </Typography>
            </Stack>
          )}
          {!documentsLoading && documents.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Documentos adjuntos
              </Typography>
              <List dense>
                {documents.map((document, index) => (
                  <ListItem
                    key={document.id ?? index}
                    secondaryAction={
                      <IconButton onClick={() => onPreviewDocument?.(document)}>
                        <VisibilityIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        document.nombre_documento ||
                        document.name ||
                        `Documento ${index + 1}`
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
