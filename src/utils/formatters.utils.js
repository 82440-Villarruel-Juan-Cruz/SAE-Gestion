import { onlyDigits } from "./text.utils";

/* ==========================================================
 * DOCUMENTOS
 * ========================================================== */

const format11DigitDocument = (value = "") => {
  const digits = onlyDigits(value, 11);

  return [digits.slice(0, 2), digits.slice(2, 10), digits.slice(10)]
    .filter(Boolean)
    .join("-");
};

export const buildEmployeeLegajo = (legajo) => {
  const legajoBase = String(legajo ?? "").trim();
  return legajoBase.includes("@") ? legajoBase : `${legajoBase}@${"utn.frc.edu.ar"}`;
};

export const normalizeCareerValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
/**
 * DNI
 * 12345678 -> 12.345.678
 */
export const formatDni = (value = "") =>
  onlyDigits(value, 8).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * CUIT
 */
export const formatCuit = (value = "") => format11DigitDocument(value);

/**
 * CUIL
 */
export const formatCuil = (value = "") => format11DigitDocument(value);

/**
 * CBU
 */
export const formatCbu = (value = "") => onlyDigits(value, 22);

/* ==========================================================
 * TELEFONO
 * ========================================================== */

/**
 * +54 351 123-4567
 */
export const formatPhone = (value = "") => {
  const digits = onlyDigits(value, 12);

  if (!digits) return "";

  const country = digits.slice(0, 2);
  const area = digits.slice(2, 5);
  const first = digits.slice(5, 8);
  const second = digits.slice(8);

  let phone = `+${country}`;

  if (area) phone += ` ${area}`;
  if (first) phone += ` ${first}`;
  if (second) phone += `-${second}`;

  return phone;
};

/* ==========================================================
 * DIRECCION
 * ========================================================== */

export const parseAddress = (value = "") => {
  let parts = String(value).split(" - ");

  if (parts.length < 4) {
    parts = String(value).split(/\s+-\s+/);
  }

  return [...parts, "", "", ""].slice(0, 4);
};

/* ==========================================================
 * BOOLEAN
 * ========================================================== */

export const formatBoolean = (value) =>
  typeof value === "boolean" ? (value ? "Sí" : "No") : value;

/* ==========================================================
 * CURRENCY
 * ========================================================== */

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * $ 12.500,00
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const number = Number(value);

  return Number.isNaN(number) ? "" : currencyFormatter.format(number);
};

/**
 * 12500 -> 12.500,00
 */
export const formatCurrencyInput = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const number = Number(value);

  if (Number.isNaN(number)) return "";

  return number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * "$12.500,30" -> 12500.30
 */
export const parseCurrencyInput = (value) => {
  const normalized = String(value)
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (!normalized) return "";

  const number = Number(normalized);

  return Number.isNaN(number) ? "" : number;
};

/**
 * Acepta string o number.
 */
export const normalizeCurrencyValue = (value) =>
  typeof value === "string" ? parseCurrencyInput(value) : value;

/**
 * Convierte texto en formato para input.
 */
export const formatCurrencyInputFromText = (value) =>
  formatCurrencyInput(parseCurrencyInput(value));

export const getCurrencyValue = (field, value, focusedField = "") => {
  if (focusedField === field) {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return String(value).replace(".", ",");

    return value;
  }

  return formatCurrencyInput(value);
};

export const handleCurrencyInputChange = (field, value, onChange) => {
  onChange(field, sanitizeCurrencyInput(value));
};

export const handleCurrencyBlur = (
  field,
  value,
  onChange,
  clearFocusedField = () => {},
) => {
  onChange(field, normalizeCurrencyValue(value));
  clearFocusedField("");
};

/**
 * Permite únicamente números y una coma decimal.
 */
export const sanitizeCurrencyInput = (value) => {
  const clean = String(value).replace(/[^\d,.]/g, "");

  const [integer, ...decimals] = clean.split(",");

  return decimals.length === 0 ? integer : `${integer},${decimals.join("")}`;
};
