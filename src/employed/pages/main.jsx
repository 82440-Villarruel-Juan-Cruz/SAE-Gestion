import { Stack } from "@mui/material";

import DashboardMenu from "../../assets/components/dashboardMenu/DashboardMenu";
import TitleBox from "../../assets/components/titleBox";
import HeaderPageEmployed from "../../assets/components/headerPage/headerPageEmployed.jsx";
import SAESpinner from "../../assets/components/spinner/SAESpinner";

import { useAuth } from "../../shared/context/sharedContext";
import { CalendarEvent } from "../../assets/components/calendarEvent/calendarEvent";
import { EmployedCalendar } from "./users/employedCalendar.jsx";
import { AdminUsersProvider } from "../context/providers/employProvider";

import { JPAProvider } from "../context/providers/jpaProvider";
import { useJPA } from "../context/employedContext";
import SAEPage from "../../assets/components/page/SAEPage"; 

import { MAIN_STRINGS } from "../../utils/strings/employed.strings";
const C = MAIN_STRINGS;

export default function EmployedMain() {
  return (
    <JPAProvider>
      <EmployedContent />
    </JPAProvider>
  );
}
function EmployedContent() {
  const { user } = useAuth();
  const { eventosSAE, loadingEventosSAE } = useJPA();
  return (
    <SAEPage>
      <HeaderPageEmployed
        hideBackButton={true}
        header={C.headerTitle}
        title={`${C.headerSubtitle} ${user?.nombre ? `${user.nombre.replace(",","")}` : C.headerNoName}`}
        description={C.headerDescription}
      />
      <TitleBox
        title={C.panelTitle}
        description={C.panelDescription}
      />
      <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
      <TitleBox
        title={C.scheduleTitle}
        description={C.scheduleDescription}
      />

      <AdminUsersProvider>
        <EmployedCalendar legajoEmpleado={user.legajo} />
      </AdminUsersProvider>
       <TitleBox
        title={C.eventsTitle}
        description={C.eventsDescription}
      />
        {loadingEventosSAE && (
          <Stack alignItems="center" width={"100%"} gap={1}>
            <SAESpinner size="S" />
          </Stack>
        )}
        {!loadingEventosSAE && eventosSAE && (
          <CalendarEvent events={eventosSAE} />
        )}
    </SAEPage>
  );
}
