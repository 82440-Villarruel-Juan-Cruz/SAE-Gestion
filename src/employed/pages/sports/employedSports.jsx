import { useMemo, useState } from "react";
import { Box, Card, Stack, Typography } from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEPage from "../../../assets/components/page/SAEPage";

import SportsCalendar from "./sportsCalendar.jsx";
import GestionarHorariosDialog from "./gestionarHorariosDialog.jsx";
import TorneoFormDialog from "./torneoFormDialog.jsx";
import SportsEntityDialog from "./sportsEntityDialog.jsx";
import SportsDocsDialog from "./sportsDocsDialog.jsx";

import { SportsProvider } from "../../context/providers/sportsProvider";
import { useSports } from "../../context/employedContext";

import { SPORTS_STRINGS } from "../../../utils/strings/employed.strings";

const C = SPORTS_STRINGS;
export default function EmployedSports() {
  return (
    <SportsProvider>
      <EmployedSportsContent />
    </SportsProvider>
  );
}

function EmployedSportsContent() {
  const [scheduleRefreshKey, setScheduleRefreshKey] = useState(0);
  const {
    torneosRows,
    loadingTorneos,
    torneoFormOpen,
    setTorneoFormOpen,
    fetchTorneos,
    profesoresRows,
    loadingProfesores,
    espaciosRows,
    loadingEspacios,
    deportistasRows,
    loadingDeportistas,
    deportesRows,
    loadingDeportes,
    horariosDialogOpen,
    setHorariosDialogOpen,
    openCreateDocente,
    openCreateEspacio,
    openCreateDeportista,
    openCreateDeporte,
    profesoresColumns,
    espaciosColumns,
    deportistasColumns,
    deportesColumns,
    torneosColumns,
    crearTorneo,
  } = useSports();

  const handleSchedulesDialogClose = () => {
    setHorariosDialogOpen(false);
    setScheduleRefreshKey((key) => key + 1);
  };

  const gestionSectionConfig = useMemo(
    () => ({
      profesores: {
        title: "Profesores",
        icon: SchoolIcon,
        rows: profesoresRows,
        columns: profesoresColumns,
        loading: loadingProfesores,
        dialog: openCreateDocente,
        addButton: "Nuevo docente",
      },
      espacios: {
        title: "Espacios Deportivos",
        icon: FitnessCenterIcon,
        rows: espaciosRows,
        columns: espaciosColumns,
        loading: loadingEspacios,
        dialog: openCreateEspacio,
        addButton: "Nuevo espacio",
      },
      deportistas: {
        title: "Deportistas",
        icon: GroupsIcon,
        rows: deportistasRows,
        columns: deportistasColumns,
        loading: loadingDeportistas,
        dialog: openCreateDeportista,
        addButton: "Nuevo deportista",
      },
      deportes: {
        title: "Deportes",
        icon: SportsSoccerIcon,
        rows: deportesRows,
        columns: deportesColumns,
        loading: loadingDeportes,
        dialog: openCreateDeporte,
        addButton: "Nuevo deporte",
      },
    }),
    [
      profesoresRows,
      profesoresColumns,
      loadingProfesores,
      openCreateDocente,
      espaciosRows,
      espaciosColumns,
      loadingEspacios,
      openCreateEspacio,
      deportistasRows,
      deportistasColumns,
      loadingDeportistas,
      openCreateDeportista,
      deportesRows,
      deportesColumns,
      loadingDeportes,
      openCreateDeporte,
    ],
  );

  const torneosSectionConfig = useMemo(
    () => ({
      torneos: {
        title: "Torneos",
        icon: EmojiEventsIcon,
        rows: torneosRows,
        columns: torneosColumns,
        loading: loadingTorneos,
        dialog: () => setTorneoFormOpen(true),
        addButton: "Nuevo Torneo",
      },
    }),
    [torneosRows, torneosColumns, loadingTorneos, setTorneoFormOpen],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.headerTitle}
        title={C.headerMainSubtitle}
        description={C.headerMainDescription}
      />

      <SAEDataGrid
        sectionConfig={gestionSectionConfig}
        currentSection={gestionSectionConfig.profesores}
      />

      <SAEDataGrid
        sectionConfig={torneosSectionConfig}
        currentSection={torneosSectionConfig.torneos}
      />

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Box
          sx={{
            background: "var(--gradient)",
            color: "white",
            px: 3,
            py: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ScheduleIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {C.scheduleTitle}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {C.scheduleSubtitle}
                </Typography>
              </Box>
            </Stack>
            <SAEButton
              variant="contained"
              startIcon={<ScheduleIcon />}
              onClick={() => setHorariosDialogOpen(true)}
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.4)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
            >
              {C.scheduleManageButton}
            </SAEButton>
          </Stack>
        </Box>
        <SportsCalendar key={scheduleRefreshKey} embedded />
      </Card>

      <SportsEntityDialog />
      <SportsDocsDialog />

      <GestionarHorariosDialog
        open={horariosDialogOpen}
        onClose={handleSchedulesDialogClose}
      />

      <TorneoFormDialog
        open={torneoFormOpen}
        onClose={() => setTorneoFormOpen(false)}
        onSave={async (body) => {
          await crearTorneo(body);
          fetchTorneos();
        }}
        mode="create"
      />
    </SAEPage>
  );
}
