import { useCallback, useMemo, useState } from "react";

import {
  ObtenerEstadisticasBecas,
  ObtenerEstadisticasDeportes,
  ObtenerEstadisticasSalud,
  ObtenerEstadisticasViaje,
} from "../../../api/ReporteService";
import { BuscarLinkFrecuentes } from "../../../api/EmpleadoService";
import { useNotification } from "../../../shared/context/sharedContext";
import { ReportsContext } from "../employedContext";

const emptyReports = {
  becas: {
    yearXType: [],
    yearXState: [],
    yearXRenovation: [],
  },
  deportes: {
    inscripcionesDeportistas: [],
    torneosXDeporte: [],
  },
  salud: {
    turnosXEspecialista: [],
  },
  viajes: {
    viajesXMesAnio: [],
  },
  linksFrecuentes: [],
};

const getYearFromMonth = (monthValue) => Number(String(monthValue).slice(0, 4));

const getDateRangeFromMonths = (from, to) => {
  const [fromYear] = String(from).split("-").map(Number);
  const [toYear, toMonth] = String(to).split("-").map(Number);
  const lastDay = new Date(toYear, toMonth, 0).getDate();

  return {
    startDate: `${from}-01`,
    endDate: `${to}-${String(lastDay).padStart(2, "0")}`,
    startYear: fromYear,
    endYear: toYear,
  };
};

export function ReportsProvider({ children }) {
  const { showNotification } = useNotification();
  const [reports, setReports] = useState(emptyReports);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState("");

  const fetchReports = useCallback(
    async ({ from, to }) => {
      if (!from || !to) return;

      const fallbackRange = {
        startYear: getYearFromMonth(from),
        endYear: getYearFromMonth(to),
        startDate: `${from}-01`,
        endDate: `${to}-01`,
      };
      const { startYear, endYear, startDate, endDate } =
        getDateRangeFromMonths(from, to) || fallbackRange;

      setLoadingReports(true);
      setReportsError("");

      try {
        const [becas, deportes, salud, viajes, linksFrecuentes] = await Promise.all([
          ObtenerEstadisticasBecas(startYear, endYear),
          ObtenerEstadisticasDeportes(startYear, endYear),
          ObtenerEstadisticasSalud(startDate, endDate),
          ObtenerEstadisticasViaje(startDate, endDate),
          BuscarLinkFrecuentes(),
        ]);

        setReports({
          becas: { ...emptyReports.becas, ...(becas || {}) },
          deportes: { ...emptyReports.deportes, ...(deportes || {}) },
          salud: { ...emptyReports.salud, ...(salud || {}) },
          viajes: { ...emptyReports.viajes, ...(viajes || {}) },
          linksFrecuentes: Array.isArray(linksFrecuentes)
            ? linksFrecuentes
            : [],
        });
      } catch (error) {
        setReports(emptyReports);
        setReportsError(error.message || "No se pudieron cargar los reportes");
        showNotification(
          error.message || "No se pudieron cargar los reportes",
          "error",
        );
      } finally {
        setLoadingReports(false);
      }
    },
    [showNotification],
  );

  const value = useMemo(
    () => ({
      reports,
      loadingReports,
      reportsError,
      fetchReports,
    }),
    [fetchReports, loadingReports, reports, reportsError],
  );

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
}
