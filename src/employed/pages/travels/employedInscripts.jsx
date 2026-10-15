import { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Diversity1 } from "@mui/icons-material";

import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";

import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";

import SAEPage from "../../../assets/components/page/SAEPage";
import TitleBox from "../../../assets/components/titleBox";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import SAEDeleteDialog from "../../../assets/components/popUp/SAEDeleteDialog";

import { formatDate } from "../../../utils/date.utils.js";
import { carreras } from "../../../utils/common/constants.js";
import { TRAVEL_STRINGS } from "../../../utils/strings/employed.strings.js";

const C = TRAVEL_STRINGS;
export default function EmployedTravelInscripts() {
  return (
    <TravelProvider>
      <EmployedIncriptsContent />
    </TravelProvider>
  );
}

function EmployedIncriptsContent() {
  const {
    inscriptsTravel,
    loadingInscripts,

    travelData,
    setTravelData,
    fetchInscriptosXTravel,
  } = useTravel();
  const { dialogOpen, dialogType } = useNotification();

  useEffect(() => {
    const saved = localStorage.getItem("selectedTravel");

    if (saved) {
      const parsedData = JSON.parse(saved);
      setTravelData(parsedData);
      fetchInscriptosXTravel(parsedData.id);
    }
  }, [setTravelData, fetchInscriptosXTravel]);

  const headerChips = useMemo(() => {
    if (!travelData) return [];

    const inscriptos = inscriptsTravel?.length ?? 0;
    const cupo = Number(travelData.cantidad_personas) || 0;
    const cupoExcedido = cupo > 0 && inscriptos > cupo;

    return [
      {
        label: travelData.seguro ? C.travelInsurence : C.travelNoInsurence,
        bgcolor: travelData.seguro
          ? "rgba(76,175,80,0.28)"
          : "rgba(211,47,47,0.55)",
        border: "1px solid rgba(255,255,255,0.4)",
      },
      {
        label: `${inscriptos}/${travelData.cantidad_personas}`,
        bgcolor: cupoExcedido
          ? "rgba(207, 80, 61, 0.55)"
          : "rgba(75, 107, 188, 0.55)",
        border: "1px solid rgba(255,255,255,0.4)",
      },
    ];
  }, [inscriptsTravel?.length, travelData]);

  return (
    <SAEPage>
      {travelData && (
        <>
          <HeaderPageEmployed
            header={C.inscriptsManagement}
            title={travelData.nombre}
            description={`Del ${formatDate(travelData.fecha_inicio, "short")} hasta ${formatDate(travelData.fecha_fin, "short")}`}
            backgroundImage="images/headers/consultations.jpg"
            backTo="/Gestion-Viajes"
            chips={headerChips}
            showUserChips={false}
          />
          <Grid container spacing={1}>
            <Grid size={{ xs: 12 }} mt={2}>
              <StudentSearchCard />
              <TitleBox title={C.inscriptsList} />

              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 18px 45px rgba(188, 188, 188, 0.08)",
                  mb: 3,
                  overflow: "hidden",
                  p: 4,
                }}
              >
                {loadingInscripts && (
                  <Stack alignItems="center" width={"100%"} gap={1}>
                    <SAESpinner size="S" />
                  </Stack>
                )}
                <Box>
                  {!loadingInscripts &&
                    inscriptsTravel &&
                    inscriptsTravel.length === 0 && (
                      <Stack alignItems="center" width={"100%"} gap={1}>
                        <Typography variant="body2" noWrap>
                          {C.inscriptsNoData}
                        </Typography>
                      </Stack>
                    )}
                  {!loadingInscripts && inscriptsTravel.length > 0 && (
                    <Stack direction={"column"} spacing={1}>
                      {inscriptsTravel.map((d, i) => (
                        <InscriptosCard datosEstudiante={d} key={i} />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
          {dialogOpen && dialogType === "inscript" && <InscriptDeleteDialog />}
        </>
      )}
      {dialogOpen && dialogType === "documents" && <DocumentsDialog />}
    </SAEPage>
  );
}

function StudentSearchCard() {
  const [legajoSearch, setLegajoSearch] = useState("");
  const [careerSearch, setCareerSearch] = useState("");
  const {
    usuarioSelected,
    setUsuarioSelected,
    loadingUsuario,
    fetchUsuariosXlegajo,
    handleAddIncriptos,
  } = useTravel();
  const { dialogError, setDialogError } = useNotification();

  const normalizedLegajo = legajoSearch.trim();
  const canSearch =
    normalizedLegajo.length > 0 && careerSearch.length > 0 && !loadingUsuario;

  const handleSearch = () => {
    if (!normalizedLegajo) {
      setDialogError(C.errorNoID);
      return;
    }

    if (!careerSearch) {
      setDialogError(C.errorNoDegree);
      return;
    }

    setDialogError("");
    fetchUsuariosXlegajo(`${normalizedLegajo}@${careerSearch}.frc.utn.edu.ar`);
  };

  const handleAddStudent = async () => {
    await handleAddIncriptos();
    setLegajoSearch("");
    setCareerSearch("");
    setDialogError("");
  };

  const handleClear = () => {
    setUsuarioSelected(null);
    setLegajoSearch("");
    setCareerSearch("");
    setDialogError("");
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ color: "black", py: 3, px: { xs: 2.5, md: 4 } }}>
        <Typography
          sx={{
            mb: 2,
            fontWeight: "bold",
            fontSize: { xs: 16, md: 18 },
            opacity: 0.98,
          }}
        >
          {C.inscriptsSearch}
        </Typography>

        {dialogError && !usuarioSelected && (
          <Alert
            severity="warning"
            onClose={() => setDialogError("")}
            sx={{ mb: 2 }}
          >
            {dialogError}
          </Alert>
        )}

        {!usuarioSelected ? (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ md: "flex-start" }}
          >
            <SAETextField
              label={C.studentID}
              value={legajoSearch}
              onChange={(event) => {
                setLegajoSearch(event.target.value.replace(/\D/g, ""));
                if (dialogError) setDialogError("");
              }}
              fullWidth
              disabled={loadingUsuario}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              helperText={C.helperID}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loadingUsuario && (
                      <CircularProgress size={22} color="inherit" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                lineHeight: { md: "56px" },
                display: { xs: "none", md: "block" },
              }}
            >
              @
            </Typography>
            <Autocomplete
              options={carreras}
              value={
                carreras.find((career) => career.value === careerSearch) ?? null
              }
              onChange={(_event, career) => {
                setCareerSearch(career?.value ?? "");
                if (dialogError) setDialogError("");
              }}
              getOptionLabel={(career) => career.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              disabled={loadingUsuario}
              fullWidth
              renderInput={(params) => (
                <SAETextField
                  {...params}
                  label={C.studentDegree}
                  helperText={C.helperDegree}
                />
              )}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minHeight: { md: 56 } }}
            >
              <Typography
                color="text.secondary"
                fontWeight={700}
                whiteSpace="nowrap"
                sx={{ display: { xs: "none", md: "block" } }}
              >
                .frc.utn.edu.ar
              </Typography>
              <IconButton
                onClick={handleSearch}
                disabled={!canSearch}
                aria-label={C.studentSearch}
              >
                <SearchIcon />
              </IconButton>
            </Stack>
          </Stack>
        ) : (
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
            >
              {C.studentSelected}
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {usuarioSelected.nombre_usuario}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {C.studentID}: {usuarioSelected.legajo}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} mt={2} spacing={1.5}>
              <SAEButton
                variant="contained"
                size="small"
                onClick={handleAddStudent}
              >
                {C.studentAdd}
              </SAEButton>
              <SAEButton
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleClear}
              >
                {C.studentSearchAgain}
              </SAEButton>
            </Stack>
          </Box>
        )}
      </Box>
    </Card>
  );
}
function InscriptDeleteDialog() {
  const { handleDeleteInscript, inscriptToDelete } = useTravel();
  const { dialogOpen, dialogSaving, dialogError, setDialogError, closeDialog } =
    useNotification();

  const itemName =
    inscriptToDelete?.nombre_estudiante ||
    inscriptToDelete?.nombre_usuario ||
    inscriptToDelete?.legajo_estudiante ||
    inscriptToDelete?.legajo;

  return (
    <SAEDeleteDialog
      open={dialogOpen}
      entityLabel="Inscripcion"
      itemName={itemName}
      itemId={inscriptToDelete?.legajo_estudiante ?? inscriptToDelete?.legajo}
      itemIdLabel="Legajo"
      onConfirm={handleDeleteInscript}
      onClose={closeDialog}
      loading={dialogSaving}
      error={dialogError}
      onClearError={() => setDialogError("")}
      message={C.inscriptsWarningBody}
    />
  );
}

function DocumentsDialog() {
  const [deletingDocument, setDeletingDocument] = useState(false);
  const {
    downloadingDocId,
    handlePreviewDoc,
    handleDownloadDoc,
    previewOpen,
    setPreviewOpen,
    previewTitle,
    previewSrc,
    previewIsPdf,
    loadingPreview,
    previewError,
    previewDocRef,
    openPopup,
    setOpenPopup,
    documentoAEliminar,
    requestDeleteDocument,
    handleDelete,
    docsInscript,
    loadingInscriptDocs,
    setSeletedInscripts,
  } = useTravel();
  const { dialogOpen, dialogError, closeDialog } = useNotification();

  const handleClose = () => {
    setSeletedInscripts(null);
    closeDialog();
  };

  const handleConfirmDelete = async () => {
    setDeletingDocument(true);
    try {
      await handleDelete();
    } finally {
      setDeletingDocument(false);
    }
  };

  return (
    <>
      <DocumentPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
        imageSrc={previewSrc}
        isPdf={previewIsPdf}
        loading={loadingPreview}
        error={previewError}
        onDownload={() =>
          previewDocRef &&
          handleDownloadDoc(
            previewDocRef.id,
            previewDocRef.nombre_documento,
            previewDocRef.extension,
          )
        }
      />

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            {C.travelDocs} {/*seletedInscripts.nombre_estudiante*/}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error">{dialogError}</Alert>}
          {loadingInscriptDocs && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <SAESpinner size="S" />
            </Box>
          )}

          {!loadingInscriptDocs && docsInscript.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              {C.travelNoDocs}
            </Typography>
          )}
          {!loadingInscriptDocs && docsInscript.length > 0 && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {docsInscript.map((doc, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {doc.nombre_documento.replace(/_/g, " ")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.extension?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title={C.travelShowDocs}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewDoc(doc)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={C.travelDownloadDocs}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDoc(
                            doc.id,
                            doc.nombre_documento,
                            doc.extension,
                          )
                        }
                        disabled={downloadingDocId === doc.id}
                      >
                        {downloadingDocId === doc.id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <DownloadIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={C.delete}>
                      <IconButton
                        size="small"
                        onClick={() => requestDeleteDocument(doc)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={handleClose}
            startIcon={<CloseIcon />}
          >
            {C.travelClose}
          </SAEButton>
        </DialogActions>
      </Dialog>
      <SAEDeleteDialog
        open={openPopup}
        entityLabel="Documento"
        itemName={documentoAEliminar?.nombre_documento}
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenPopup(false)}
        loading={deletingDocument}
      />
    </>
  );
}
function InscriptosCard({ datosEstudiante }) {
  const [loadingCard, setLoadingCard] = useState(false);
  const [estudiante, setDatosEstudiante] = useState(datosEstudiante);

  const { handleUpdateInscriptos, handleClickRemove, openSeeDocInscript } =
    useTravel();
  const handleInscriptosChange = async (field, value) => {
    const updatedStudent = { ...estudiante, [field]: value };
    setDatosEstudiante(updatedStudent);
    setLoadingCard(true);
    await handleUpdateInscriptos(updatedStudent);
    setLoadingCard(false);
  };

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        boxShadow: "none",
        transition: ".2s",
        "&:hover": {
          borderColor: "#1976d2",
          boxShadow: "0 4px 12px rgba(25,118,210,.15)",
        },
      }}
    >
      <CardContent>
        {loadingCard && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255, 255, 255, 0.7)", // Fondo blanco semitransparente
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2, //
              borderRadius: 3,
              backdropFilter: "blur(2px)",
            }}
          >
            <SAESpinner size="S" />
          </Box>
        )}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#E3F2FD",
                color: "#1976d2",
              }}
            >
              <Diversity1 />
            </Avatar>

            <Box>
              <Typography fontWeight={600}>
                {estudiante.nombre_estudiante}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {C.studentID} {estudiante.legajo_estudiante}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction={{ xs: "row", md: "row" }}
            spacing={{ xs: 0, md: 4 }}
            alignItems="center"
          >
            <Switch
              checked={estudiante.documentacion_presentada}
              onChange={(e) =>
                handleInscriptosChange(
                  "documentacion_presentada",
                  e.target.checked,
                )
              }
              color="primary"
            />
            <Chip
              color={estudiante.documentacion_presentada ? "success" : "error"}
              sx={{
                width: { xs: 80, md: 200 },
                fontWeight: "bold",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%", // Asegura que el contenedor use todo el espacio
                  textAlign: "center", // Centra el texto dentro del chip
                },
              }}
              label={
                <>
                  <Box
                    component="span"
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    {estudiante.documentacion_presentada
                      ? "Correcto"
                      : "A Revisar"}
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    {estudiante.documentacion_presentada
                      ? C.inscriptsReviewed
                      : C.inscriptsNoReviewed}
                  </Box>
                </>
              }
            />
            <Tooltip title={C.travelShowDocs}>
              <IconButton onClick={() => openSeeDocInscript(estudiante)}>
                <FolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={C.studentsDelete}>
              <IconButton
                onClick={() => handleClickRemove(estudiante)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
