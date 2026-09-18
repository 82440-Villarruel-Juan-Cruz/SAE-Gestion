import { MONTH_NAMES_SHORT } from "./common/constants";

export const formatMonthInput = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getMonthOffset = (monthValue, offset) => {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1);

  return formatMonthInput(date);
};

export const getYearsBetween = (from, to) => {
  const startYear = Number(String(from).slice(0, 4));
  const endYear = Number(String(to).slice(0, 4));

  if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) return [];

  return Array.from(
    { length: Math.max(endYear - startYear + 1, 0) },
    (_, index) => startYear + index,
  );
};

export const getMonthsBetween = (from, to) => {
  const [fromYear, fromMonth] = String(from).split("-").map(Number);
  const [toYear, toMonth] = String(to).split("-").map(Number);

  if (
    !Number.isFinite(fromYear) ||
    !Number.isFinite(fromMonth) ||
    !Number.isFinite(toYear) ||
    !Number.isFinite(toMonth)
  ) {
    return [];
  }

  const months = [];
  const current = new Date(fromYear, fromMonth - 1, 1);
  const last = new Date(toYear, toMonth - 1, 1);

  while (current <= last) {
    months.push({
      key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
      label: `${MONTH_NAMES_SHORT[current.getMonth()]} ${current.getFullYear()}`,
      anio: current.getFullYear(),
      mes: current.getMonth() + 1,
    });
    current.setMonth(current.getMonth() + 1);
  }

  return months;
};

export const formatPeriodLabel = (from, to) => {
  const formatValue = (value) => {
    const [year, month] = String(value).split("-").map(Number);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return "";

    return `${MONTH_NAMES_SHORT[month - 1]} ${year}`;
  };

  const fromLabel = formatValue(from);
  const toLabel = formatValue(to);

  return fromLabel && toLabel ? `${fromLabel} - ${toLabel}` : "";
};

export const sumByName = (items = [], emptyLabel = "Sin nombre") =>
  Object.values(
    items.reduce((result, item) => {
      const name = item.nombre || emptyLabel;
      result[name] = result[name] || { label: name, value: 0 };
      result[name].value += Number(item.cantidad || 0);
      return result;
    }, {}),
  ).map((item, index) => ({ id: index, ...item }));

export const buildYearSeries = (
  items = [],
  years = [],
  labelFallback = "Cantidad",
) => {
  const labels = [...new Set(items.map((item) => item.nombre || labelFallback))];

  return labels.map((label) => ({
    label,
    data: years.map((year) =>
      items
        .filter(
          (item) =>
            Number(item.anio) === year &&
            (item.nombre || labelFallback) === label,
        )
        .reduce((total, item) => total + Number(item.cantidad || 0), 0),
    ),
  }));
};

export const buildMonthSeries = (items = [], months = [], valueKey, label) => ({
  label,
  data: months.map((month) =>
    items
      .filter(
        (item) =>
          Number(item.anio) === month.anio && Number(item.mes) === month.mes,
      )
      .reduce((total, item) => total + Number(item[valueKey] || 0), 0),
  ),
});

export const mapFrequentLinksToChartData = (links = [], emptyLabel) =>
  [...links]
    .sort(
      (first, second) =>
        Number(second.contador_clicks || 0) -
        Number(first.contador_clicks || 0),
    )
    .map((item) => ({
      link: item.titulo || emptyLabel,
      views: Number(item.contador_clicks || 0),
    }));
