import { Container, Box, Card,Typography} from "@mui/material";
import { useAuth } from "../../shared/context/sharedContext";
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import DashboardMenu from "../../assets/components/dashboardMenu/DashboardMenu";
import NovedadesEstudiantiles from "../../assets/components/studentNews/studentNews";
import TitleBox from "../../assets/components/titleBox";
import SAEPage from "../../assets/components/page/SAEPage";
import HeaderPageStudent from "../../assets/components/headerPage/headerPageStudent.jsx";
import { MAIN_STRINGS } from "../../utils/strings/student.strings";
import { CalendarEvent } from "../../assets/components/calendarEvent/calendarEvent.jsx";

const C = MAIN_STRINGS;
export default function StudentMain() {
  const { user } = useAuth();
  
  return (
    <SAEPage>
        <HeaderPageStudent
          title={C.headerTitle}
          description={C.headerDescription+user.nombre}
          backgroundImage="images/headers/initial.jpg"
          icon={LightbulbIcon}
        />
        <TitleBox 
          title={C.panelTitle}
          description={C.panelDescription}
        />

        <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
        <TitleBox 
          title={C.eventTitle}
          description={C.eventDescription}
        />
        <CalendarEvent/>
    </SAEPage>
  );
}
