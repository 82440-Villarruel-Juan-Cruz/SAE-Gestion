import { ApiError, apiRequest } from './apiClient';

const LOGIN_ERROR_MESSAGES = {
  204: 'Usuario no encontrado',
  401: 'Credenciales incorrectas',
  409: 'Conflicto en la sesión',
  500: 'Error interno del servidor',
};

const UPDATE_USER_ERROR_MESSAGES = {
  400: 'Datos inválidos',
  401: 'No autorizado',
  404: 'Usuario no encontrado',
  500: 'Error interno del servidor',
};

function errorResult(error, messages) {
  if (error instanceof ApiError) {
    return {
      success: false,
      message: messages[error.status] ?? error.message ?? 'Respuesta desconocida',
    };
  }

  return {
    success: false,
    message: 'Error de conexión',
    error,
  };
}

export default async function ObtenerTokenJWT(legajo, dominio, password) {
  try {
    const response = await apiRequest(
      `/Usuarios/ObtenerTokenJWT/${encodeURIComponent(legajo)}/${encodeURIComponent(dominio)}/${encodeURIComponent(password)}`,
      {
        auth: false,
        includeHeaders: true,
      },
    );

    if (response.status === 201) {
      return { success: true, data: response.data };
    }

    return {
      success: false,
      message:
        LOGIN_ERROR_MESSAGES[response.status] ?? 'Respuesta desconocida',
    };
  } catch (error) {
    return errorResult(error, LOGIN_ERROR_MESSAGES);
  }
}

export async function ModificarUsuario(id, payload, token) {
  try {
    const response = await apiRequest(
      `/Usuarios/ModificarUsuario/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: payload,
        token,
        includeHeaders: true,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    }

    return {
      success: false,
      message:
        UPDATE_USER_ERROR_MESSAGES[response.status] ??
        'Respuesta desconocida',
    };
  } catch (error) {
    return errorResult(error, UPDATE_USER_ERROR_MESSAGES);
  }
}
