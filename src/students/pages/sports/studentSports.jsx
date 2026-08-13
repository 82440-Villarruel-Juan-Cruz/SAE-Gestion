import {
  Card,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Stack,
} from "@mui/material";
import { useMemo } from "react";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";

import DeportesMasonry from "./deportesMasonery";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import DocumentCard from "../../../assets/components/documents/DocumentCard";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import SAEPage from "../../../assets/components/page/SAEPage";
import StudentHeaderPage from "../../../assets/components/headerPage/headerPageStudent.jsx";
import TitleBox from "../../../assets/components/titleBox";

import { SportsProvider as EmployedSportsProvider } from "../../../employed/context/providers/sportsProvider";
import { useSportsContext } from "../../context/studentContext";
import { SportsProvider } from "../../context/providers/sportsProvider";
import SportsCalendar from "../../../employed/pages/sports/sportsCalendar";
import { SPORTS_STRINGS } from "../../../utils/strings/student.strings";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid.jsx";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const C = SPORTS_STRINGS;

function StudentSportsContent() {
  const {
    closeDeleteDialog,
    closePreview,
    documentoAEliminar,
    documentos,
    handleArchivoChange,
    handleDelete,
    handleInscribirClick,
    handlePreview,
    horariosDeportista,
    loadingDocuments,
    loadingSports,
    loadingTournaments,
    openPopup,
    preview,
    requestDeleteDocument,
    subscribedSportIds,
    torneoDeportista,
    torneosColumns,
  } = useSportsContext();

  const sectionConfig = useMemo(
    () => ({
      torneos: {
        key: "torneos",
        title: "Torneos",
        dialog: null,
        icon: EmojiEventsIcon,
        rows: torneoDeportista,
        columns: torneosColumns,
        loading: loadingTournaments,
      },
    }),
    [torneosColumns, torneoDeportista, loadingTournaments],
  );

  return (
    <SAEPage>
      <StudentHeaderPage
        title={C.bigTitle}
        description={C.bigSubtitle}
        backgroundImage="images/carrousel/EntradaUTN.jpg"
        icon={SportsHandballIcon}
      />
      <TitleBox
        title={C.documentationTitle}
        description={C.documentationSubtitle}
      />
      {loadingDocuments ? (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <SAESpinner size="S" />
        </Stack>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {documentos.map((item) => (
            <Grid
              key={item.id_tipo_documento ?? item.nombre}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <DocumentCard
                documento={item}
                onPreview={handlePreview}
                onFileChange={handleArchivoChange}
                onDelete={requestDeleteDocument}
                uploadDisabled={item.subido}
                deleteDisabled={!item.subido}
                notUploadedLabel={C.docStateNotUploaded}
                uploadedLabel={C.docStataUplodaded}
                showRequirement
              />
            </Grid>
          ))}
        </Grid>
      )}
      <TitleBox title={C.sportsTitle} description={C.sportsSubTitle} />
      {loadingSports ? (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <SAESpinner size="S" />
        </Stack>
      ) : horariosDeportista.length > 0 ? (
        <Card
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          }}
        >
          <DeportesMasonry
            deportes={horariosDeportista}
            onInscribirClick={handleInscribirClick}
          />
        </Card>
      ) : null}
      <TitleBox
        title={C.tournamnetsTitle}
        description={C.tournamnetsSubTitle}
      />
      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={sectionConfig.torneos}
      />
      {/* DESPUES HAY QUE HABILITARLO */}
      {!loadingSports && horariosDeportista.length > 0 && (
        <>
          <TitleBox title={C.horariosTitle} description={C.horariosSubTitle} />
          <EmployedSportsProvider>
            <SportsCalendar subscribedSportIds={subscribedSportIds} />
          </EmployedSportsProvider>
        </>
      )}
      {/*Dialog para Borrar Documento*/}
      <Dialog open={openPopup} onClose={closeDeleteDialog}>
        <DialogTitle>{C.deleteDocTitle}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            {C.deleteDocMessage(documentoAEliminar?.archivoNombre)}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <SAEButton onClick={() => handleDelete(documentoAEliminar)} autoFocus>
            {C.deleteDocButton}
          </SAEButton>
        </DialogActions>
      </Dialog>
      <DocumentPreviewDialog
        open={preview.open}
        onClose={closePreview}
        title={preview.title}
        imageSrc={preview.imageSrc}
        isPdf={preview.isPdf}
        loading={preview.loading}
        error={preview.error}
      />
    </SAEPage>
  );
}

export default function StudentSports() {
  return (
    <SportsProvider>
      <StudentSportsContent />
    </SportsProvider>
  );
}
