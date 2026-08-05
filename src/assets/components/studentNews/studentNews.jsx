import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  CardMedia,
  CardContent,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton
} from "@mui/material";
import { PressProvider } from "../../../shared/context/providers/pressProvider";
import { usePress } from "../../../shared/context/sharedContext";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Masonry from "@mui/lab/Masonry";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import DocumentPreviewDialog from "../../components/documents/DocumentPreviewDialog";
import NewsPreviewDialog from "./newsPreviewDialog.jsx";
import SAESpinner from "../spinner/SAESpinner";
import TitleBox from "../titleBox";

import { SAETypography } from "../typography/SAETypography";
import { descargarDocumentoPorId } from "../../../api/PrensaService";
import { NEWS_STRINGS } from "../../../utils/strings/shared.strings";
import { PLACEHOLDER_IMAGE } from "../../../utils/common/constants";

const C = NEWS_STRINGS;
const baseUrl = import.meta.env.BASE_URL;
const MAX_DESCRIPTION_PREVIEW_LENGTH = 440;

function ItemNovedad({ item, invertida }) {
  // 1. Inicializar en TRUE si hay portada, sino en FALSE (no hay nada que cargar)
  const { titulo_publicacion, descripcion, fecha_inicio, portada, documentos } = item;
  const [isLoadingImage, setLoadingImage] = useState(!!portada?.id);
  const { handleCardClick } = usePress();
  
  // ... (resto de tus variables y lógica de descripción) ...
  const fullDescription = String(descripcion ?? "").trim();
  const isDescriptionTruncated = fullDescription.length > MAX_DESCRIPTION_PREVIEW_LENGTH;
  const descriptionPreview = isDescriptionTruncated
    ? fullDescription.slice(0, MAX_DESCRIPTION_PREVIEW_LENGTH).trimEnd()
    : fullDescription;

  const [imagenUrl, setImagenUrl] = useState(`${baseUrl}${PLACEHOLDER_IMAGE}`);

  useEffect(() => {
    // Si no hay portada, aseguramos que no esté cargando y usamos placeholder
    if (!portada || !portada.id) {
      setLoadingImage(false); // <--- IMPORTANTE: Forzar fin de carga
      setImagenUrl(`${baseUrl}${PLACEHOLDER_IMAGE}`);
      return;
    }

    // 2. Forzar estado de carga ANTES de cualquier otra cosa
    setLoadingImage(true);
    setImagenUrl(`${baseUrl}${PLACEHOLDER_IMAGE}`); // Opcional: resetear a placeholder mientras carga

    const cargarImagen = async () => {
      try {
        const resultado = await descargarDocumentoPorId(portada.id);
        if (resultado && resultado.datos_documento) {
          setImagenUrl(resultado.datos_documento);
        } else {
           // Si la API responde pero sin datos
           setImagenUrl(`${baseUrl}${PLACEHOLDER_IMAGE}`);
        }
      } catch (error) {
        console.error("Error cargando imagen: ", error);
        setImagenUrl(`${baseUrl}${PLACEHOLDER_IMAGE}`);
      } finally {
        // 3. Siempre finalizar carga
        setLoadingImage(false);
      }
    };

    cargarImagen();
  }, [portada]); // <--- IMPORTANTE: Depender solo del ID para asegurar que cambie

  return (
    <>
      <Card
        onClick={() => handleCardClick({ ...item, imageSrc: imagenUrl })}
        sx={{
          // ... tus estilos ...
          position: "relative",
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
          border: "1px solid rgba(17, 53, 101, 0.08)",
          cursor: { xs: "default", md: "pointer" },
          marginBottom: 3,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: invertida ? "row-reverse" : "row",
          },
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "0 15px 25px rgba(0,0,0,.15)",
          },
          "&:hover .hover-overlay": {
            opacity: 1,
          },
        }}
      >
        {/* Renderizado Condicional */}
        {isLoadingImage ? (
          <Skeleton 
            variant="rectangular"
            animation={false}
            sx={{
              width: { xs: "100%", md: 300 },
              height: { xs: 200, md: "auto" }, // Asegura que coincida con CardMedia
              bgcolor: "grey.900",
              background: "linear-gradient(90deg, #333 25%, #444 50%, #333 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite linear",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }} 
          />
        ) : (
          <CardMedia
            sx={{
              width: { xs: "100%", md: 300 },
              height: { xs: 200, md: "auto" },
              objectFit: "cover",
              // Añade una pequeña transición de opacidad para suavizar la aparición
              opacity: isLoadingImage ? 0 : 1, 
              transition: 'opacity 0.4s ease-in',
            }}
            component="img"
            image={imagenUrl}
            alt={portada?.name ?? "UTN"}
            onError={(e) => {
                // Fallback por si la URL generada falla al renderizar
                e.target.src = `${baseUrl}${PLACEHOLDER_IMAGE}`;
            }}
          />
        )}
        
        <Box sx={{ flex: 1, position: 'relative' }}> 
          {/* Asegura que el Box padre tenga posición relativa para el overlay absoluto */}
          <Box
            sx={{
              position: "absolute",
              inset: 0, // Esto funciona si el padre es relative
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,.55)",
              opacity: 0,
              transition: "all .3s ease",
              cursor: "pointer",
              zIndex: 3,
            }}
            className="hover-overlay"
          >
            <SAETypography
              variant="overline"
              sx={{
                color: "white",
                letterSpacing: 1,
                width: "100px",
                textAlign: "center",
              }}
            >
              {C.showMore}
            </SAETypography>
          </Box>
          
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <SAETypography variant="h6" sx={{ color: "var(--secondary)" }}>
              {titulo_publicacion}
            </SAETypography>
            <SAETypography variant="body2">{fecha_inicio}</SAETypography>
            <SAETypography
              variant="body1"
              sx={{ mt: 1, color: "#5a6f8f", minHeight: 48 }}
            >
              {descriptionPreview}
              {isDescriptionTruncated && <Box component="span"> ...</Box>}
            </SAETypography>

            <Box
              onClick={(event) => event.stopPropagation()}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <DocumentList listadoDocumentos={documentos} />
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
}   

export function NovedadesContent() {
  const {
    isLoading,
    novedades,
    selectedPub,
    loadingSelectedDocuments,
    handleClose,
    handleOpenPreview,
  } = usePress();
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  const totalPaginas = Math.ceil(novedades.length / itemsPorPagina);

  const novedadesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return novedades.slice(inicio, fin);
  }, [paginaActual, novedades]);

  const irPaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const irPaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <Box sx={{ pb: 4 }}>
      <TitleBox title={C.title} description={C.description} />
      <Box sx={{ mt: 1 }}>
        {isLoading && (
          <Stack alignItems="center" width={"100%"} gap={1}>
            <SAESpinner size="S" />
          </Stack>
        )}
        {!isLoading && novedadesPaginadas.length > 0 && (
          <>
            <Stack>
              {novedadesPaginadas.map((item, i) => (
                <ItemNovedad
                  key={item.id}
                  item={item}
                  invertida={i % 2 === 0}
                />
              ))}
            </Stack>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                {paginaActual} de {totalPaginas}
              </Typography>

              <IconButton
                onClick={irPaginaAnterior}
                disabled={paginaActual === 1}
              >
                <ChevronLeftIcon />
              </IconButton>

              <IconButton
                onClick={irPaginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </>
        )}
        {!isLoading && novedadesPaginadas.length === 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <SAETypography variant="h6">{C.noData}</SAETypography>
          </Box>
        )}
      </Box>

      <NewsPreviewDialog
        open={!!selectedPub}
        onClose={handleClose}
        title={selectedPub?.titulo_publicacion}
        date={selectedPub?.fecha_inicio}
        description={selectedPub?.descripcion}
        imageSrc={selectedPub?.imageSrc}
        documents={selectedPub?.documentos || []}
        documentsLoading={loadingSelectedDocuments}
        onPreviewDocument={handleOpenPreview}
      />
    </Box>
  );
}

export function DocumentList(listadoDocumentos) {
  const {
    previewOpen,
    previewDoc,
    previewDocName,
    previewLoading,
    previewError,
    handleOpenPreview,
    handleClosePreview,
    handleDownloadPreview,
    handleDownload,
    getDocumentName,
    getImageSource,
    getDocumentExtension,
  } = usePress();
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 5 }}>
        {listadoDocumentos.listadoDocumentos?.length > 0 && (
          <Box
            sx={{
              display: "block",
              alignItems: "center",
              gap: 1,
              mt: 2,
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {C.documentsSubtitle}
            </Typography>
            <List dense>
              {listadoDocumentos.listadoDocumentos.map((doc, i) => (
                <ListItem key={doc.id}>
                  <ListItemIcon
                    sx={{
                      minWidth: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <InsertDriveFileIcon />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      doc.name ||
                      doc.nombre_documento ||
                      doc.titulo_publicacion ||
                      `Documento ${i + 1}`
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleOpenPreview(doc)}
                    aria-label={C.showDocumentButton}
                    title="Ver documento"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(doc)}
                    aria-label={C.downloadDocumentButton}
                    title="Descargar documento"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
      <DocumentPreviewDialog
        open={previewOpen}
        onClose={handleClosePreview}
        title={getDocumentName(previewDoc, previewDocName || "Vista previa")}
        imageSrc={previewDoc ? getImageSource(previewDoc) : ""}
        isPdf={getDocumentExtension(previewDoc) === "pdf"}
        loading={previewLoading}
        error={previewError}
        onDownload={handleDownloadPreview}
      />
    </div>
  );
}
// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function NovedadesEstudiantiles() {
  return (
    <PressProvider>
      <NovedadesContent />
    </PressProvider>
  );
}
