import { appConfig } from "../config/appConfig";

export const SESSION_EXPIRED_EVENT = "sae:session-expired";

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const HTTP_ERROR_MESSAGES = {
  400: "La solicitud contiene datos inválidos.",
  401: "Tu sesión no es válida o venció. Volvé a iniciar sesión.",
  403: "No tenés permisos para realizar esta acción.",
  404: "No se encontró el recurso solicitado.",
  405: "La operación solicitada no está permitida.",
  408: "La solicitud tardó demasiado tiempo. Intentá nuevamente.",
  409: "La operación genera un conflicto con los datos existentes.",
  413: "El archivo o contenido enviado es demasiado grande.",
  415: "El formato del contenido enviado no es compatible.",
  422: "No se pudieron procesar los datos enviados.",
  429: "Se realizaron demasiadas solicitudes. Esperá unos segundos.",
  500: "Ocurrió un error interno en el servidor.",
  502: "El servidor recibió una respuesta inválida.",
  503: "El servicio no está disponible temporalmente.",
  504: "El servidor tardó demasiado tiempo en responder.",
};

function notifySessionExpired() {
  localStorage.removeItem("session");
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

function getSessionToken() {
  const storedSession = localStorage.getItem("session");
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession);
    if (session.expiration && Date.now() > session.expiration) {
      notifySessionExpired();
      return null;
    }
    return session.token ?? null;
  } catch {
    notifySessionExpired();
    return null;
  }
}

export function resolveApiUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  const baseUrl = appConfig.apiUrl.replace(/\/$/, "");

  const path = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${baseUrl}${path}`;
}

async function parseErrorResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function getErrorMessage(response, errorData) {
  if (errorData?.errors && typeof errorData.errors === "object") {
    return Object.entries(errorData.errors)
      .map(([field, errors]) => `${field}: ${[].concat(errors).join(", ")}`)
      .join(" | ");
  }
  return (
    errorData?.message ||
    errorData?.title ||
    HTTP_ERROR_MESSAGES[response.status] ||
    `Error ${response.status}: ${response.statusText || "Solicitud fallida"}`
  );
}

async function parseResponse(response, responseType) {
  if (response.status === 204) return null;
  if (responseType === "raw") return response;
  if (responseType === "blob") return response.blob();
  if (responseType === "text") return response.text();

  const contentType = (
    response.headers.get("Content-Type") || ""
  ).toLowerCase();

  if (responseType === "auto" && !contentType.includes("json")) {
    return response.blob();
  }

  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return responseType === "json" ? text : new Blob([text]);
  }
}

export async function apiRequest(
  endpoint,
  {
    method = "GET",
    body,
    token,
    auth = true,
    mapper,
    warning = true,
    headers: customHeaders = {},
    signal,
    includeHeaders = false,
    responseType = "json",
  } = {},
) {
  const isFormData = body instanceof FormData;
  const authorizationToken = token ?? (auth ? getSessionToken() : null);

  // Opción 3: Limpiamos customHeaders para evitar que valores 'undefined' rompan la petición
  const cleanCustomHeaders = Object.fromEntries(
    Object.entries(customHeaders).filter((entry) => entry[1] != null)
  );
  const headers = {
    // SÓLO agrega la cabecera si warning es true Y la URL de destino NO es localhost
    ...(warning && !resolveApiUrl(endpoint).includes("localhost")
      ? { "ngrok-skip-browser-warning": "true" }
      : {}),
    ...(!isFormData && body != null
      ? { "Content-Type": "application/json" }
      : {}),
    ...(authorizationToken
      ? { Authorization: `Bearer ${authorizationToken}` }
      : {}),
    ...cleanCustomHeaders, // Aplicamos las cabeceras externas ya saneadas
  };

  const response = await fetch(resolveApiUrl(endpoint), {
    method,
    headers,
    signal,
    mode: "cors", // <-- Fuerza al navegador a validar las reglas CORS correctamente
    body:
      body == null ? undefined : isFormData ? body : JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await parseErrorResponse(response);

    if (auth && response.status === 401) {
      notifySessionExpired();
    }

    throw new ApiError(
      getErrorMessage(response, errorData),
      response.status,
      errorData,
    );
  }

  const data = await parseResponse(response, responseType);
  const result =
    mapper && data != null
      ? Array.isArray(data)
        ? data.map(mapper)
        : mapper(data, response.headers)
      : data;

  return includeHeaders
    ? { data: result, headers: response.headers, status: response.status }
    : result;
}

// Entrada común para los servicios que trabajan con JSON.
export async function RequestAPI(
  endpoint,
  action,
  body = null,
  options = {},
) {
  const method = action.toUpperCase();
  const data = await apiRequest(endpoint, { ...options, method, body });
  if (data == null) return method === "GET" ? [] : {};
  return data;
}

export async function apiGet(endpoint, options = {}) {
  const result = await apiRequest(endpoint, { ...options, method: "GET" });

  if (options.includeHeaders && result?.data == null) {
    return { ...result, data: [] };
  }

  return result ?? [];
}

export function apiPost(endpoint, body, options = {}) {
  return apiRequest(endpoint, { ...options, method: "POST", body });
}

export function apiPut(endpoint, body, options = {}) {
  return apiRequest(endpoint, { ...options, method: "PUT", body });
}

export function apiDelete(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: "DELETE" });
}

// Compatibilidad con los servicios de documentos que ya usan estos helpers.
export function apiPostFile(endpoint, addOns = {}, options = {}) {
  return apiRequest(endpoint, { ...options, ...addOns, method: "POST" });
}

export function apiPutFile(endpoint, addOns = {}, options = {}) {
  return apiRequest(endpoint, { ...options, ...addOns, method: "PUT" });
}

export function apiGetFile(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "GET",
    responseType: "blob",
  });
}

export function apiUploadFile(
  endpoint,
  file,
  { fieldName = "archivo", method = "POST", ...options } = {},
) {
  const formData = file instanceof FormData ? file : new FormData();
  if (!(file instanceof FormData)) formData.append(fieldName, file);
  return apiRequest(endpoint, { ...options, method, body: formData });
}

export function apiDeleteFile(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: "DELETE" });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getFileName(headers, fallback = "documento") {
  const disposition = headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
  if (!match?.[1]) return fallback;
  try {
    return decodeURIComponent(match[1].replace(/"/g, ""));
  } catch {
    return match[1].replace(/"/g, "");
  }
}

export async function apiDownloadDocument(endpoint, { id, ...options } = {}) {
  const response = await apiRequest(endpoint, {
    ...options,
    method: "GET",
    responseType: "auto",
    includeHeaders: true,
  });

  if (!(response.data instanceof Blob)) return response.data;

  const contentType = (
    response.headers.get("Content-Type") ||
    response.data.type ||
    "application/octet-stream"
  ).toLowerCase();

  const extension = contentType.includes("application/pdf")
    ? "pdf"
    : contentType.split("/")[1]?.split(";")[0] || "bin";

  const datosDocumento = URL.createObjectURL(response.data);
  const nombreDocumento = getFileName(response.headers);
  return {
    id,
    nombre_documento: nombreDocumento,
    datos_documento: datosDocumento,
    extension,
  };
}
