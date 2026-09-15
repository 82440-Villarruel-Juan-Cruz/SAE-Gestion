import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Delete, FileUpload, OpenInNew } from "@mui/icons-material";
import SAEButton from "../buttons/SAEButton";

const getDocumentPreviewId = (documento) =>
  documento?.id_archivo ??
  documento?.id_documento ??
  documento?.id ??
  null;

const getDocumentDisplayName = (documento) =>
  [
    documento.archivoNombre,
    documento.nombre_documento,
  ].find((value) => typeof value === "string" && value.trim()) ?? "";

export default function DocumentCard({
  documento,
  onFileChange,
  onDelete,
  onPreview,
  uploadDisabled = false,
  deleteDisabled = false,
  showRequirement = false,
  showActions = true,
  notUploadedLabel = "No subido",
  uploadedLabel = "Subido",
  requiredLabel = "Requerido",
  optionalLabel = "Opcional",
  withoutFileLabel = "Sin archivo",
  documents,
  getDocumentName,
  getDocumentId,
  onDeleteDocument,
}) {
  const previewId = getDocumentPreviewId(documento);
  const displayName = getDocumentDisplayName(documento);
  const handlesMultipleDocuments =
    Boolean(documento.multiple) && Array.isArray(documents);
  const hasMultipleDocuments =
    handlesMultipleDocuments && documents.length > 1;
  const singleDocument =
    handlesMultipleDocuments && documents.length === 1 ? documents[0] : null;
  const description =
    documento.descripcion ||
    (documento.extension
      ? `Formatos permitidos: ${documento.extension}`
      : withoutFileLabel);
  const extensionText = documento.extension
    ? `Extensiones: ${documento.extension}`
    : "";

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 6,
        width: "100%",
        maxWidth: { xs: "100%", sm: 357 },
        mx: { xs: "auto", sm: 0 },
        minWidth: 0,
        flexDirection: "column",
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
        display: "flex",
        "&:hover": {
          backgroundColor: "#f1f5fb",
          borderColor: "rgba(17, 53, 101, 0.2)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack sx={{ flexGrow: 1, gap: 1.25 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.25, gap: 1, flexWrap: "wrap" }}
          >
            <Chip
              variant={!documento.subido ? "filled" : "outlined"}
              label={!documento.subido ? notUploadedLabel : uploadedLabel}
              color={!documento.subido ? "grey" : "success"}
            />
            {showRequirement && (
              <Chip
                variant={!documento.required ? "outlined" : "filled"}
                label={documento.required ? requiredLabel : optionalLabel}
                color={documento.required ? "error" : "warning"}
              />
            )}
          </Stack>
          <Typography variant="subtitle1">
            <strong>{documento.nombre}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          {extensionText && (
            <Typography variant="caption" color="text.secondary">
              {extensionText}
            </Typography>
          )}

          {documento.externalUrl && (
            <SAEButton
              component="a"
              href={documento.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNew />}
              sx={{ alignSelf: "flex-start", minWidth: 0, px: 0 }}
            >
              {documento.externalUrlLabel || "Abrir documento"}
            </SAEButton>
          )}

          {!hasMultipleDocuments &&
            (previewId || singleDocument ? (
              <SAEButton
                onClick={() =>
                  onPreview?.(previewId || singleDocument, displayName)
                }
                sx={{
                  minWidth: 0,
                  justifyContent: "flex-start",
                  mt: 0.5,
                  width: "100%",
                }}
              >
                {displayName.length > 35
                  ? `${displayName.slice(0, 35)}...`
                  : displayName}
              </SAEButton>
            ) : (
              <Box
                sx={{
                  mt: 0.5,
                  px: 1.75,
                  py: 0.9,
                  minHeight: 36,
                  width: "100%",
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                }}
              >
                <Typography variant="body2" noWrap>
                  {displayName || withoutFileLabel}
                </Typography>
              </Box>
            ))}
          {hasMultipleDocuments && (
            <Stack spacing={0.75} sx={{ mt: 1 }}>
              {documents.map((document, index) => {
                const name =
                  getDocumentName?.(document) || `Documento ${index + 1}`;
                const id = getDocumentId?.(document);

                return (
                  <Stack
                    key={`${name}-${id ?? index}`}
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                  >
                    <SAEButton
                      onClick={() => onPreview?.(id || document, name)}
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        justifyContent: "flex-start",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </SAEButton>
                    {showActions && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteDocument?.(index, document)}
                        aria-label={`Eliminar ${name}`}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          )}
          {showActions && (
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
                mt: "auto",
                pt: 1.5,
                "& > button, & > label": {
                  flex: { xs: "1 1 140px", sm: "0 0 auto" },
                },
              }}
            >
              <SAEButton
                component="label"
                variant="contained"
                startIcon={<FileUpload />}
                disabled={uploadDisabled}
                sx={{ display: { xs: "inline-flex", sm: "none" } }}
              >
                Subir
                <input
                  type="file"
                  hidden
                  accept={documento.extension}
                  multiple={Boolean(documento.multiple)}
                  onChange={(event) => onFileChange?.(event, documento)}
                />
              </SAEButton>
              <IconButton
                component="label"
                size="small"
                color="primary"
                disabled={uploadDisabled}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
                aria-label="Subir documento"
              >
                <FileUpload />
                <input
                  type="file"
                  hidden
                  accept={documento.extension}
                  multiple={Boolean(documento.multiple)}
                  onChange={(event) => onFileChange?.(event, documento)}
                />
              </IconButton>

              {!hasMultipleDocuments && (
                <>
                  <SAEButton
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    disabled={deleteDisabled}
                    onClick={() => onDelete?.(documento)}
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                  >
                    Eliminar
                  </SAEButton>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={deleteDisabled}
                    onClick={() => onDelete?.(documento)}
                    sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    aria-label="Eliminar documento"
                  >
                    <Delete />
                  </IconButton>
                </>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
