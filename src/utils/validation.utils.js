import { isEmpty, onlyDigits } from "./text.utils";

export const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(value).trim());

export const isValidPhone = (value = "") => {
  const digits = onlyDigits(value);
  return digits.length >= 10 && digits.length <= 15;
};

export const isValidMinLengthPhone = (value = "", minLength = 8) =>
  onlyDigits(value).length >= minLength;

export const isValidHyperlink = (value = "") => {
  try {
    const url = new URL(String(value).trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const isTimeAfter = (endTime = "", startTime = "") => {
  if (!startTime || !endTime) return true;

  const toMinutes = (time) => {
    const [hours, minutes] = String(time).slice(0, 5).split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  if (startMinutes === null || endMinutes === null) return true;

  return endMinutes > startMinutes;
};

export const isValidAddress = (value = "") => {
  const parts = String(value).split(/\s+-\s+/);

  return (
    parts.length === 4 &&
    parts.every((part) => part.trim() !== "") &&
    /^\d+$/.test(parts[3])
  );
};

export const isValidCbu = (value = "") => onlyDigits(value).length === 22;

export const isValidCuit = (value = "") => {
  // 1. Extraemos solo los números
  const digits = String(value).replace(/\D/g, "");

  // 2. Si el usuario está escribiendo y no llegó a los 11 dígitos, 
  // no lo consideramos inválido aún (evita que titile en rojo desde cero)
  if (digits.length < 11) return true; 
  if (digits.length > 11) return false;

  // 3. Pesos oficiales del algoritmo Módulo 11
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  
  const sum = weights.reduce(
    (total, weight, index) => total + Number(digits[index]) * weight,
    0,
  );
  
  const remainder = sum % 11;
  let checkDigit;

  // 4. Casos especiales del algoritmo de ARCA (ex-AFIP)
  if (remainder === 0) {
    checkDigit = 0;
  } else if (remainder === 1) {
    // Si el resto es 1, el CUIT original muta su prefijo a 23.
    // El dígito verificador pasa a ser 9 o 4 según el género original.
    const prefix = digits.substring(0, 2);
    if (prefix === "23") {
      // Permitimos que pase tanto 9 como 4 si el prefijo ya cambió a 23
      checkDigit = Number(digits[10]); 
    } else {
      checkDigit = 9; // Valor por defecto para remanentes mapeados
    }
  } else {
    checkDigit = 11 - remainder;
  }

  // 5. Comparamos contra el último dígito ingresado
  return checkDigit === Number(digits[10]);
};

export const isValidText = (value = "") => {
  const text = String(value ?? "").trim();
  const allowedSpecialChars = `.,;:()"'°ºª&/_+#-`;

  return (
    /\p{L}/u.test(text) &&
    /^[\p{L}\p{N}\s.,;:()"'°ºª&/_+#-]+$/u.test(text) &&
    !new RegExp(`[${allowedSpecialChars.replace("-", "\\-")}]{2,}`, "u").test(
      text,
    )
  );
};

export const hasRealDocumentName = (value) => {
  if (!value) return false;

  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return false;

  return !new Set(["documento", "archivo", "file", "document"]).has(normalized);
};
// ------------------------- COSAS DE LUIS QUE NO TENGO GANAS DE LIMPIAR POR AHORA ----------------------- //
export function validateCuil(raw) {
  const digits = raw.replace(/[-\s]/g, "");
  if (!/^\d{11}$/.test(digits)) return false;
  const series = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = series.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  const rem = 11 - (sum % 11);
  const check = rem === 11 ? 0 : rem;
  if (rem === 10) return false;
  return check === Number(digits[10]);
}

export function validateNombreApellido(value, label) {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!value.trim()) return `${label} es obligatorio`;
  if (value.trim().length < 2) return "Debe tener al menos 2 caracteres";
  if (!nameRegex.test(value.trim()))
    return "Solo se permiten letras y espacios";
  return null;
}

export function validateFechaNacimiento(value) {
  if (!value) return "La fecha de nacimiento es obligatoria";
  const birth = new Date(value);
  const today = new Date();
  const age =
    today.getFullYear() -
    birth.getFullYear() -
    (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
      ? 1
      : 0);
  if (birth >= today) return "La fecha debe ser anterior a hoy";
  if (age < 18) return "El docente debe ser mayor de 18 años";
  if (age > 100) return "La fecha ingresada no es válida";
  return null;
}

export function validateDocente(data, mode) {
  const errors = {};

  if (mode === "create") {
    if (!data.cuil.trim()) {
      errors.cuil = "El CUIL es obligatorio";
    } else if (!validateCuil(data.cuil.trim())) {
      errors.cuil = "El CUIL ingresado no es válido";
    }
  }

  const nombresError = validateNombreApellido(data.nombres, "El nombre");
  if (nombresError) errors.nombres = nombresError;

  const apellidosError = validateNombreApellido(data.apellidos, "El apellido");
  if (apellidosError) errors.apellidos = apellidosError;

  const fechaError = validateFechaNacimiento(data.fecha_nacimiento);
  if (fechaError) errors.fecha_nacimiento = fechaError;

  return errors;
}

export function validateEspacio(data) {
  const errors = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = "Debe tener al menos 2 caracteres";
  }

  if (!data.domicilio.trim()) {
    errors.domicilio = "El domicilio es obligatorio";
  } else if (data.domicilio.trim().length < 5) {
    errors.domicilio = "Ingresá un domicilio válido";
  }

  if (data.url_maps.trim()) {
    try {
      const url = new URL(data.url_maps.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.url_maps = "La URL debe comenzar con http:// o https://";
      }
    } catch {
      errors.url_maps = "La URL ingresada no es válida";
    }
  }

  return errors;
}

export function validateDeportista(data, mode) {
  const errors = {};

  if (mode === "create") {
    if (!data.legajo.toString().trim()) {
      errors.legajo = "El legajo es obligatorio";
    } else if (!String(data.nombre_deportista ?? "").trim()) {
      errors.legajo = "Seleccioná un alumno mediante el buscador";
    }
    /*else if (!/^[a-zA-Z0-9]+$/.test(data.legajo.toString().trim())) {
      errors.legajo = "El legajo solo puede contener letras y números";
    }*/
  }
  else{
    if (data.vencimiento_ficha) {
      const fecha = new Date(data.vencimiento_ficha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (fecha < today) {
        errors.vencimiento_ficha = "La ficha ya está vencida";
      }
    } else {
      errors.vencimiento_ficha = "El vencimiento de ficha es obligatorio";
    }
  }


  return errors;
}

export function validateDeporte(data) {
  const errors = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre del deporte es obligatorio";
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = "Debe tener al menos 2 caracteres";
  }

  return errors;
}

export const isBooleanValid = (value) => {
  // Retorna true solo si el valor es explícitamente true o false
  return typeof value === "boolean";
};

export const isEndDateBeforeStartDate = (startDate, endDate) =>
    !isEmpty(startDate) && !isEmpty(endDate) && String(endDate)< String(startDate);

export const isPositiveNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0;
};