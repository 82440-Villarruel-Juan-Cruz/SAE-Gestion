import { Alert, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEPage from "../../../assets/components/page/SAEPage";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import TitleBox from "../../../assets/components/titleBox";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import { ReportsProvider } from "../../context/providers/reportsProvider.jsx";
import { useReports } from "../../context/employedContext.js";
import { REPORT_STRINGS } from "../../../utils/strings/employed.strings.js";
import {
  buildMonthSeries,
  buildYearSeries,
  formatMonthInput,
  formatPeriodLabel,
  getMonthOffset,
  getMonthsBetween,
  getYearsBetween,
  mapFrequentLinksToChartData,
  sumByName,
} from "../../../utils/reports.utils.js";

const C = REPORT_STRINGS;

export default function AdminReport() {
  return (
    <ReportsProvider>
      <AdminReportContent />
    </ReportsProvider>
  );
}

function AdminReportContent() {
  const { reports, loadingReports, reportsError, fetchReports } = useReports();
  const periodLimits = useMemo(() => {
    const today = new Date();
    const maxMonth = formatMonthInput(today);
    const minFromMonth = formatMonthInput(
      new Date(today.getFullYear() - 3, today.getMonth(), 1),
    );

    return { maxMonth, minFromMonth };
  }, []);

  const [period, setPeriod] = useState({
    from: getMonthOffset(periodLimits.maxMonth, -5),
    to: periodLimits.maxMonth,
  });

  const years = useMemo(
    () => getYearsBetween(period.from, period.to),
    [period.from, period.to],
  );
  const months = useMemo(
    () => getMonthsBetween(period.from, period.to),
    [period.from, period.to],
  );

  useEffect(() => {
    fetchReports(period);
  }, [fetchReports, period]);

  const handlePeriodChange = (field, value) => {
    setPeriod((current) => {
      const next = { ...current, [field]: value };

      if (!value) return next;

      if (field === "from" && next.to && value > next.to) {
        next.to = value;
      }

      if (field === "to" && next.from && value < next.from) {
        next.from = value;
      }

      return next;
    });
  };

  return (
    <SAEPage>
      <HeaderPageEmployed
        header={C.header}
        title={C.title}
        description={C.description}
      />
      <ReportsControls
        period={period}
        minFromMonth={periodLimits.minFromMonth}
        maxMonth={periodLimits.maxMonth}
        onChange={handlePeriodChange}
      />
      {loadingReports ? (
        <Stack alignItems="center" sx={{ my: 3 }}>
          <SAESpinner size="S" />
        </Stack>
      ) : null}
      {reportsError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {reportsError}
        </Alert>
      ) : null}

      {!loadingReports ? (
        <>
          <ReportSection id="becas" title={C.sectionTitles.scholarships}>
            <SchoolarshipChart data={reports.becas} years={years} />
          </ReportSection>
          <ReportSection id="deportes" title={C.sectionTitles.sports}>
            <SportsChart data={reports.deportes} years={years} />
          </ReportSection>
          <ReportSection
            id="links-frecuentes"
            title={C.sectionTitles.frequentLinks}
          >
            <FrequentLinksChart data={reports.linksFrecuentes} />
          </ReportSection>
          <ReportSection id="salud" title={C.sectionTitles.health}>
            <HealthChart data={reports.salud} months={months} period={period} />
          </ReportSection>
          <ReportSection id="viajes" title={C.sectionTitles.travels}>
            <TravelsChart data={reports.viajes} months={months} />
          </ReportSection>
        </>
      ) : null}
    </SAEPage>
  );
}

function ReportsControls({ period, minFromMonth, maxMonth, onChange }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mt: 2,
        mb: 2,
        borderRadius: "12px",
        border: "1px solid rgba(21, 61, 113, 0.12)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
      >
        <Stack
          spacing={1}
          sx={{ flexShrink: 0, width: { xs: "100%", md: "auto" } }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <SAETextField
              label={C.filters.from}
              type="month"
              value={period.from}
              onChange={(event) => onChange("from", event.target.value)}
              fullWidth
              sx={{ minWidth: { sm: 150 } }}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: minFromMonth,
                  max: period.to || maxMonth,
                },
              }}
            />
            <SAETextField
              label={C.filters.to}
              type="month"
              value={period.to}
              onChange={(event) => onChange("to", event.target.value)}
              fullWidth
              sx={{ minWidth: { sm: 150 } }}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: period.from || minFromMonth,
                  max: maxMonth,
                },
              }}
            />
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems="center"
        >
          {C.sections.map((section) => (
            <Box
              key={section.id}
              component="a"
              href={`#${section.id}`}
              sx={{
                px: 1.75,
                py: 0.8,
                borderRadius: "8px",
                color: "var(--primary)",
                border: "1px solid rgba(21, 61, 113, 0.22)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.15s",
                "&:hover": {
                  bgcolor: "var(--primary)",
                  color: "white",
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "inherit",
                }}
              >
                {section.title}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function ReportSection({ id, title, children }) {
  return (
    <Box id={id} sx={{ scrollMarginTop: 96 }}>
      <TitleBox title={title} />
      {children}
    </Box>
  );
}

function SchoolarshipChart({ data, years }) {
  const typeSeries = useMemo(
    () => buildYearSeries(data.yearXType, years, C.series.type),
    [data.yearXType, years],
  );
  const stateSeries = useMemo(
    () => buildYearSeries(data.yearXState, years, C.series.state),
    [data.yearXState, years],
  );
  const renovationSeries = useMemo(
    () => buildYearSeries(data.yearXRenovation, years, C.series.renovation),
    [data.yearXRenovation, years],
  );
  const yearLabels = years.map(String);

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.scholarshipsByTypeYear}>
          <BarChart
            xAxis={[{ data: yearLabels, scaleType: "band" }]}
            series={typeSeries}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.scholarshipsByStateYear}>
          <BarChart
            xAxis={[{ data: yearLabels, scaleType: "band" }]}
            series={stateSeries}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.scholarshipsRenovationsYear}>
          <BarChart
            xAxis={[{ data: yearLabels, scaleType: "band" }]}
            series={renovationSeries}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function SportsChart({ data, years }) {
  const inscriptionsSeries = useMemo(
    () =>
      buildYearSeries(
        data.inscripcionesDeportistas,
        years,
        C.series.inscriptions,
      ),
    [data.inscripcionesDeportistas, years],
  );
  const tournamentsSeries = useMemo(
    () => buildYearSeries(data.torneosXDeporte, years, C.series.tournaments),
    [data.torneosXDeporte, years],
  );
  const yearLabels = years.map(String);

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.sportsPlayersBySportYear}>
          <BarChart
            xAxis={[{ data: yearLabels, scaleType: "band" }]}
            series={inscriptionsSeries}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.sportsInscriptionsBySportYear}>
          <BarChart
            xAxis={[{ data: yearLabels, scaleType: "band" }]}
            series={inscriptionsSeries}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.sportsTournamentsBySportYear}>
          <BarChart
            xAxis={[{ data: yearLabels, scaleType: "band" }]}
            series={tournamentsSeries}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function FrequentLinksChart({ data }) {
  const linksData = useMemo(
    () => mapFrequentLinksToChartData(data, C.noTitle),
    [data],
  );

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 8, lg: 5 }}>
        <ReportChartCard title={C.charts.frequentLinksViews}>
          <BarChart
            xAxis={[
              {
                data: linksData.map((item) => item.link),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: linksData.map((item) => item.views),
                label: C.series.clicks,
                color: "#1565C0",
              },
            ]}
            width={480}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function HealthChart({ data, months, period }) {
  const turnsBySpecialist = useMemo(
    () => sumByName(data.turnosXEspecialista, C.noName),
    [data.turnosXEspecialista],
  );
  const turnsByMonth = useMemo(
    () =>
      buildMonthSeries(
        data.turnosXEspecialista,
        months,
        "cantidad",
        C.series.turns,
      ),
    [data.turnosXEspecialista, months],
  );
  const periodLabel = useMemo(
    () => formatPeriodLabel(period.from, period.to),
    [period.from, period.to],
  );

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard
          title={C.charts.healthTurnsBySpecialist}
          subtitle={periodLabel ? C.period(periodLabel) : ""}
        >
          <BarChart
            xAxis={[
              {
                data: turnsBySpecialist.map((item) => item.label),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: turnsBySpecialist.map((item) => item.value),
                label: C.series.turns,
                color: "#2E7D32",
              },
            ]}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.healthTurnsByMonth}>
          <LineChart
            xAxis={[{ data: months.map((month) => month.label), scaleType: "point" }]}
            series={[turnsByMonth]}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function TravelsChart({ data, months }) {
  const travelsByMonth = useMemo(
    () =>
      buildMonthSeries(
        data.viajesXMesAnio,
        months,
        "cantidad",
        C.series.travels,
      ),
    [data.viajesXMesAnio, months],
  );
  const studentsByMonth = useMemo(
    () =>
      buildMonthSeries(
        data.viajesXMesAnio,
        months,
        "cantidad_estudiantes",
        C.series.students,
      ),
    [data.viajesXMesAnio, months],
  );

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.travelsByMonth}>
          <LineChart
            xAxis={[{ data: months.map((month) => month.label), scaleType: "point" }]}
            series={[travelsByMonth]}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title={C.charts.travelStudentsByMonth}>
          <BarChart
            xAxis={[{ data: months.map((month) => month.label), scaleType: "band" }]}
            series={[studentsByMonth]}
            width={400}
            height={300}
            slotProps={bottomLegendProps}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

const bottomLegendProps = {
  legend: {
    direction: "row",
    position: { vertical: "bottom", horizontal: "center" },
    padding: 0,
    labelStyle: { fontSize: 12 },
  },
};

function ReportChartCard({ title, subtitle, children }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "25px",
      }}
    >
      <Typography variant="h6" color="var(--primary)" gutterBottom>
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: -0.5, mb: 1 }}
        >
          {subtitle}
        </Typography>
      ) : null}
      {children}
    </Paper>
  );
}
