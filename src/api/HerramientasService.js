import { RequestAPI } from './apiClient';

const logDocumentTypesExtensions = (documentTypes) => {
  if (!Array.isArray(documentTypes)) {
    
    return;
  }
 
}

export async function obtenerTiposDocumento() {
  const documentTypes = await RequestAPI('/Herramientas/ObtenerTiposDocumento', 'GET');
  logDocumentTypesExtensions(documentTypes);
  return documentTypes;
}

export function obtenerPerfiles() {
  return RequestAPI('/Herramientas/ObtenerPerfiles', 'GET');
}

export function obtenerCarreras() {
  return RequestAPI('/Herramientas/ObtenerCarreras', 'GET');
}
