import { RequestAPI } from './apiClient';

const logDocumentTypesExtensions = (documentTypes) => {
  if (!Array.isArray(documentTypes)) {
    console.log("[TiposDocumento] Respuesta no es un array:", documentTypes);
    return;
  }
  /*
  console.log("[TiposDocumento] Respuesta completa:", documentTypes);
  console.table(
    documentTypes.map((documentType) => ({
      id: documentType.id ?? documentType.id_tipo_documento,
      nombre: documentType.nombre,
      extension: documentType.extension,
    })),
  );*/
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
