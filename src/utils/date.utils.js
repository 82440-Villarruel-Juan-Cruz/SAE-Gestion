/**
 * ===========================================================
 * DATE UTILS
 * ===========================================================
 */
/**
 * Formatea el tiempo para poder enviarlo en el body
 * 08:00 -> T08:00:00
 */
export function toApiDateTime(value, fallback = null) {
  if (!value) return fallback;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const text = String(value).trim();

  // Fecha sin hora
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return `${text}T00:00:00`;
  }

  const parsed = new Date(text);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString();
}

/**
 * Convierte una fecha yyyy-MM-dd a ISO usando una hora fija local.
 * Inicio del dia -> 00:00:00
 * Fin del dia    -> 23:59:00
 */
export function toApiDateTimeWithFixedTime(
  value,
  isEndOfDay = false,
  fallback = null,
) {
  if (!value) return fallback;

  const normalizedDate = normalizeDateInput(value);
  if (!normalizedDate) return fallback;

  const [year, month, day] = normalizedDate.split("-").map(Number);
  const date = new Date(
    year,
    month - 1,
    day,
    isEndOfDay ? 23 : 0,
    isEndOfDay ? 59 : 0,
    0,
    0,
  );

  return date.toISOString();
}
/**
 * Formatea una fecha en diferentes formatos.
 *
 * display -> 15/08/2026
 * short   -> 15 agosto
 * input   -> 2026-08-15
 */
export function formatDate(value, format = "display") {
  if (!value) return "";

  let date;

  // Si ya viene yyyy-MM-dd evitamos problemas de zona horaria
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    date = new Date(value.replace(/-/g, "/"));
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "";

  switch (format) {
    case "short":
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
      });

    case "input":
      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

    case "display":
    default:
      return date.toLocaleDateString("es-AR");
  }
}

export function getTodayInputDate() {
  return formatDate(new Date(), "input");
}

export function compareDatesDesc(valueA, valueB) {
  const getTimestamp = (value) => {
    const normalizedDate = normalizeDateInput(value);
    if (!normalizedDate) return Number.NEGATIVE_INFINITY;

    const [year, month, day] = normalizedDate.split("-").map(Number);
    return new Date(year, month - 1, day).getTime();
  };

  return getTimestamp(valueB) - getTimestamp(valueA);
}

/**
 * Normaliza cualquier formato de fecha
 * y devuelve yyyy-MM-dd
 */
export function normalizeDateInput(value) {
  if (!value) return "";

  if (typeof value === "string") {
    // yyyy-MM-dd
    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) return isoDate[0];

    // dd/MM/yyyy
    const localDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (localDate) {
      return `${localDate[3]}-${localDate[2]}-${localDate[1]}`;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Formatea una hora.
 *
 * 08:00     -> 08:00 hs
 * 08:00:00  -> 08:00 hs
 */
export function formatTime(time) {
  if (!time) return "";

  const normalized = String(time).substring(0, 5);

  return `${normalized} hs`;
}

/**
 * Convierte una hora del input HTML
 * al formato utilizado por la API.
 *
 * 08:00 -> 08:00:00
 */
export function toApiTime(time) {
  if (!time) return "";

  const normalized = String(time).replace(/hs/gi, "").trim();

  if (/^\d{2}:\d{2}$/.test(normalized)) return `${normalized}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) return normalized;

  return normalized;
}

/**
 * Convierte una hora proveniente de la API
 * al formato utilizado por los inputs HTML (HH:mm).
 *
 * 08:00:00 -> 08:00
 * 8:00hs   -> 08:00
 * 8:00     -> 08:00
 */
export function toTimeInput(time) {
  if (!time) return "";

  // 1. Limpiamos el texto sacando "hs", espacios y nos quedamos con los primeros 5 caracteres
  const cleanTime = String(time).replace(/hs/gi, "").trim().substring(0, 5);

  // 2. Si el formato quedó como "8:00", padStart le agrega el "0" al principio para que sea "08:00"
  return cleanTime.padStart(5, "0");
}