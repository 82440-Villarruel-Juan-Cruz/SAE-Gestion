import { useMemo, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { SAETypography } from "../typography/SAETypography";
import SAETextField from "../inputs/SAETextField";
import SAEButton from "../buttons/SAEButton";

const DEFAULT_LOCALE_TEXT = {
  noRowsLabel: "No hay registros activos",
  noResultsOverlayLabel: "No se encontraron resultados",
  paginationRowsPerPage: "Filas por página:",
  paginationDisplayedRows: ({ from, to, count }) =>
    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
  columnMenuLabel: "Menú",
  columnMenuAriaLabel: (columnName) => `Menú de ${columnName}`,
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuManageColumns: "Administrar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar columna",
  columnMenuUnsort: "Quitar orden",
  columnMenuSortAsc: "Ordenar de forma ascendente",
  columnMenuSortDesc: "Ordenar de forma descendente",
  filterPanelAddFilter: "Agregar filtro",
  filterPanelRemoveAll: "Quitar filtros",
  filterPanelDeleteIconLabel: "Eliminar",
  filterPanelLogicOperator: "Operador lógico",
  filterPanelOperator: "Operador",
  filterPanelOperatorAnd: "Y",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Columnas",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Valor del filtro",
  filterOperatorContains: "contiene",
  filterOperatorDoesNotContain: "no contiene",
  filterOperatorEquals: "es igual a",
  filterOperatorDoesNotEqual: "es distinto de",
  filterOperatorStartsWith: "empieza con",
  filterOperatorEndsWith: "termina con",
  filterOperatorIsEmpty: "está vacío",
  filterOperatorIsNotEmpty: "no está vacío",
  filterOperatorIsAnyOf: "es cualquiera de",
};

export default function SAEDataGrid({
  sectionConfig,
  currentSection,
  beforeSearch = null,
  onSectionChange,
}) {
  const firstKey = Object.keys(sectionConfig)[0] || "";
  const [internalActiveSectionKey, setInternalActiveSectionKey] =
    useState(firstKey);
  const [busquedaGestion, setBusquedaGestion] = useState("");

  const currentSectionKey = currentSection?.key || currentSection;
  const activeSectionKey =
    currentSectionKey && sectionConfig[currentSectionKey]
      ? currentSectionKey
      : internalActiveSectionKey;

  const currentConfig = sectionConfig[activeSectionKey];

  const rowsGestionFiltradas = useMemo(() => {
    if (!currentConfig?.rows) return [];

    const term = busquedaGestion.trim().toLowerCase();
    if (!term) return currentConfig.rows;

    return currentConfig.rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [currentConfig, busquedaGestion]);

  const handleSectionChange = (key) => {
    setInternalActiveSectionKey(key);
    setBusquedaGestion("");
    onSectionChange?.(key);
  };

  if (!currentConfig) return null;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: "var(--gradient)",
          color: "white",
          px: 3,
          pt: 0,
          pb: 0,
        }}
      >
        <Stack
          direction="row"
          overflow={{ xs: "scroll", sm: "hidden" }}
          spacing={0}
        >
          {Object.entries(sectionConfig).map(([key, section]) => (
            <Box
              key={key}
              onClick={() => handleSectionChange(key)}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2.5,
                py: 1.5,
                cursor: "pointer",
                fontWeight: activeSectionKey === key ? 700 : 500,
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color:
                  activeSectionKey === key
                    ? "white"
                    : "rgba(255,255,255,0.6)",
                borderBottom:
                  activeSectionKey === key
                    ? "3px solid white"
                    : "3px solid transparent",
                transition: "all 0.15s",
                "&:hover": {
                  color: "white",
                  borderBottomColor: "rgba(255,255,255,0.4)",
                },
              }}
            >
              <SAETypography
                sx={{
                  fontWeight: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  color: "inherit",
                  lineHeight: 1,
                }}
              >
                {section.title}
              </SAETypography>
            </Box>
          ))}
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ py: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {currentConfig.icon && <currentConfig.icon sx={{ fontSize: 30 }} />}
            <SAETypography variant="h6" fontWeight={700}>
              {currentConfig.title}
            </SAETypography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
          >
            {beforeSearch}
            <SAETextField
              placeholder="Búsqueda..."
              size="small"
              value={busquedaGestion}
              onChange={(event) => setBusquedaGestion(event.target.value)}
              sx={{
                width: { xs: "100%", sm: 240, md: 220 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& input::placeholder": {
                  color: "rgba(255,255,255,0.7)",
                  opacity: 1,
                },
                "& .MuiInputAdornment-root svg": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            {currentConfig.dialog && currentConfig.addButton && (
              <SAEButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={currentConfig.dialog}
                sx={{
                  whiteSpace: "nowrap",
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                }}
              >
                {currentConfig.addButton}
              </SAEButton>
            )}
          </Stack>
        </Stack>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rowsGestionFiltradas}
            columns={currentConfig.columns}
            loading={currentConfig.loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
              ...currentConfig.initialState,
            }}
            localeText={{
              ...DEFAULT_LOCALE_TEXT,
              ...currentConfig.localeText,
            }}
            sx={{ borderRadius: 0, border: "none" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
