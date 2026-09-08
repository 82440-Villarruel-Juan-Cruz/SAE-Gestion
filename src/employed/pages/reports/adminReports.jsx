import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";
import SAEPage from "../../../assets/components/page/SAEPage";
import TitleBox from "../../../assets/components/titleBox";

const reportSections = [
  { id: "becas", title: "Becas" },
  { id: "deportes", title: "Deportes" },
  { id: "links-frecuentes", title: "Links Frecuentes" },
  { id: "salud", title: "Salud" },
  { id: "viajes", title: "Viajes" },
];

export default function AdminReport() {
  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Módulo de Reportes"
        title="Reportes y Estadísticas"
        description="Brinda soporte a la toma de decisiones en base a las decisiones."
      />
      <ReportsNav />

      <ReportSection id="becas" title="Estadísticas de Becas">
        <SchoolarshipChart />
      </ReportSection>
      <ReportSection id="deportes" title="Estadísticas de Deportes">
        <SportsChart />
      </ReportSection>
      <ReportSection
        id="links-frecuentes"
        title="Estadísticas de Links Frecuentes"
      >
        <FrequentLinksChart />
      </ReportSection>
      <ReportSection id="salud" title="Estadísticas de Salud">
        <HealthChart />
      </ReportSection>
      <ReportSection id="viajes" title="Estadísticas de Viajes">
        <TravelsChart />
      </ReportSection>
    </SAEPage>
  );
}
const mockData = [
  { id: 0, value: 35, label: "Económica" },
  { id: 1, value: 40, label: "Investigación" },
  { id: 2, value: 15, label: "Servicio" },
];
const lineDataX = ["2021", "2022", "2023", "2024", "2025", "2026"];
const pieData = [
  { id: 0, value: 50, label: "M. Belgrano" },
  { id: 1, value: 15, label: "Progresar" },
  { id: 2, value: 60, label: "Rectorado" },
];

const sportsByDisciplineData = [
  { id: 0, value: 42, label: "Fútbol" },
  { id: 1, value: 36, label: "Básquet" },
  { id: 2, value: 28, label: "Voley" },
  { id: 3, value: 18, label: "Handball" },
  { id: 4, value: 14, label: "Atletismo" },
];

const sportsMonths = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"];
const sportsByCareerData = [
  { career: "Sistemas", deportistas: 34 },
  { career: "Industrial", deportistas: 27 },
  { career: "Mecánica", deportistas: 22 },
  { career: "Civil", deportistas: 19 },
  { career: "Química", deportistas: 14 },
  { career: "Electrónica", deportistas: 12 },
];

const frequentLinksData = [
  { link: "Calendario Académico", views: 1280 },
  { link: "Autogestion", views: 1140 },
  { link: "Becas", views: 820 },
  { link: "Comedor", views: 760 },
  { link: "Deportes", views: 610 },
];

const healthCompletedTurnsData = [
  { turn: "Clínica", completados: 86 },
  { turn: "Psicología", completados: 64 },
  { turn: "Nutrición", completados: 42 },
  { turn: "Odontología", completados: 39 },
  { turn: "Enfermería", completados: 31 },
];

const travelMonths = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"];
const travelsByMonthData = [2, 4, 3, 6, 5, 7];
const travelOccupancyData = [
  { travel: "Carlos Paz", inscriptos: 38, cupo: 45 },
  { travel: "Mendoza", inscriptos: 52, cupo: 60 },
  { travel: "Rosario", inscriptos: 28, cupo: 35 },
  { travel: "Córdoba Norte", inscriptos: 18, cupo: 25 },
];

function ReportsNav() {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mt: 2,
        mb: 1,
        borderRadius: "12px",
        border: "1px solid rgba(21, 61, 113, 0.12)",
      }}
    >
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {reportSections.map((section) => (
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

function SchoolarshipChart() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
            Becarios SAE
          </Typography>
          <PieChart
            series={[
              {
                data: mockData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: {
                  fade: "global",
                  highlight: "item",
                },
                highlighted: {
                  additionalRadius: 12,
                },
              },
            ]}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: -10,
                labelStyle: { fontSize: 13 },
              },
            }}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
            Becarios SAE vs Nacionales
          </Typography>
          <LineChart
            xAxis={[{ data: lineDataX, scaleType: "point" }]}
            series={[
              {
                data: [50, 32, 25, 38, 65, 53],
                label: "Nacional",
                color: "#0288d1",
              },
              {
                data: [25, 27, 35, 21, 18, 26],
                label: "SAE",
                color: "#2e7d32",
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
            Becarios Nacional
          </Typography>
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: {
                  fade: "global",
                  highlight: "item",
                },
                highlighted: {
                  additionalRadius: 12,
                },
              },
            ]}
            width={320}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: -10, // Mismo truco para recortar la distancia lateral de la leyenda
                labelStyle: { fontSize: 13 },
              },
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

function SportsChart() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard
          title="Deportistas por Deporte"
          sx={{ height: 390 }}
          contentSx={{ overflow: "auto" }}
        >
          <PieChart
            series={[
              {
                data: sportsByDisciplineData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: {
                  fade: "global",
                  highlight: "item",
                },
                highlighted: {
                  additionalRadius: 12,
                },
              },
            ]}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: -10,
                labelStyle: { fontSize: 13 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title="Inscripciones por Mes">
          <LineChart
            xAxis={[{ data: sportsMonths, scaleType: "point" }]}
            series={[
              {
                data: [18, 31, 44, 52, 63, 71],
                label: "Altas",
                color: "#1565C0",
              },
              {
                data: [8, 12, 15, 19, 24, 28],
                label: "Bajas",
                color: "#D32F2F",
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title="Deportistas por Carrera">
          <BarChart
            xAxis={[
              {
                data: sportsByCareerData.map((item) => item.career),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: sportsByCareerData.map((item) => item.deportistas),
                label: "Deportistas",
                color: "#2E7D32",
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function FrequentLinksChart() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 8, lg: 5 }}>
        <ReportChartCard title="Vistas por Link">
          <BarChart
            xAxis={[
              {
                data: frequentLinksData.map((item) => item.link),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: frequentLinksData.map((item) => item.views),
                label: "Vistas",
                color: "#1565C0",
              },
            ]}
            width={480}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function HealthChart() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 8, lg: 5 }}>
        <ReportChartCard title="Turnos Completados más Usados">
          <BarChart
            xAxis={[
              {
                data: healthCompletedTurnsData.map((item) => item.turn),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: healthCompletedTurnsData.map((item) => item.completados),
                label: "Turnos completados",
                color: "#2E7D32",
              },
            ]}
            width={480}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function TravelsChart() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title="Viajes por Mes">
          <LineChart
            xAxis={[{ data: travelMonths, scaleType: "point" }]}
            series={[
              {
                data: travelsByMonthData,
                label: "Viajes",
                color: "#1565C0",
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ReportChartCard title="Inscriptos según Cupo">
          <BarChart
            xAxis={[
              {
                data: travelOccupancyData.map((item) => item.travel),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: travelOccupancyData.map((item) => item.inscriptos),
                label: "Inscriptos",
                color: "#2E7D32",
              },
              {
                data: travelOccupancyData.map((item) => item.cupo),
                label: "Cupo",
                color: "#90CAF9",
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </ReportChartCard>
      </Grid>
    </Grid>
  );
}

function ReportChartCard({ title, children }) {
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
      {children}
    </Paper>
  );
}
