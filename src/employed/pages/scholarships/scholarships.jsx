import { useMemo } from "react";
import SchoolIcon from "@mui/icons-material/School";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import SAEPage from "../../../assets/components/page/SAEPage";
import { ScholarshipProvider } from "../../context/providers/scholarshipProvider";
import { useScholarships } from "../../context/employedContext";
import { BECAS_STRINGS } from "../../../utils/strings/employed.strings";
import DialogBecas from "./dialogBecas.jsx";
import DialogProyecto from "./dialogProyecto.jsx";
import DialogServicios from "./dialogServicios.jsx";

const BS = BECAS_STRINGS;

export default function EmployedScholarships() {
  return (
    <ScholarshipProvider>
      <EmployedScholarshipsContent />
    </ScholarshipProvider>
  );
}

function EmployedScholarshipsContent() {
  const {
    proyectosColumns,
    proyectosRows,
    loadingProyectos,
    openCreateProyecto,

    serviciosRows,
    serviciosColumns,
    loadingServicios,
    openCreateServicio,

    becariosRows,
    becariosColumns,
    loadingBecarios,
    openCreateBecario,
  } = useScholarships();

  const sectionConfig = useMemo(
    () => ({
      proyectos: {
        key: "proyectos",
        title: BS.projectDialog.sectionTitle,
        dialog: openCreateProyecto,
        addButton: BS.projectDialog.addButton,
        icon: SchoolIcon,
        rows: proyectosRows,
        columns: proyectosColumns,
        loading: loadingProyectos,
      },
      servicios: {
        key: "servicios",
        title: "Servicios",
        dialog: openCreateServicio,
        addButton: "Nueva Servicio",
        icon: SchoolIcon,
        rows: serviciosRows,
        columns: serviciosColumns,
        loading: loadingServicios,
      },
    }),
    [
      proyectosRows,
      proyectosColumns,
      loadingProyectos,
      openCreateProyecto,
      serviciosRows,
      serviciosColumns,
      loadingServicios,
      openCreateServicio,
    ],
  );

  const becariosConfig = useMemo(
    () => ({
      becarios: {
        key: "becarios",
        title: "Becarios",
        dialog: openCreateBecario,
        addButton: "Nueva becario",
        icon: SchoolIcon,
        rows: becariosRows,
        columns: becariosColumns,
        loading: loadingBecarios,
        initialState: {
          sorting: {
            sortModel: [{ field: "fecha_solicitud", sort: "desc" }],
          },
        },
      },
    }),
    [becariosRows, becariosColumns, loadingBecarios, openCreateBecario],
  );

  const [activeSection] = "proyectos";
  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );

  const [activeSectionBecario] = "becarios";
  const currentSectionBecario = useMemo(
    () => becariosConfig[activeSectionBecario],
    [activeSectionBecario, becariosConfig],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={BS.headerTitle}
        title={BS.headerSubtitle}
        description={BS.headerDescription}
      />

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />

      <SAEDataGrid
        sectionConfig={becariosConfig}
        currentSection={currentSectionBecario}
      />

      <DialogProyecto />
      <DialogServicios />
      <DialogBecas />
    </SAEPage>
  );
}
