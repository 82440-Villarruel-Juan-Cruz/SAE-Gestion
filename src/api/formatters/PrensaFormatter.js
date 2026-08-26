export const mapPublicacionPublica = (publicacion) => {
  const todosLosArchivos = parseFiles(publicacion.documentos_asociados);
  const portada = todosLosArchivos.length > 0 ? todosLosArchivos[0] : null;
  const documentos = todosLosArchivos.slice(1);
  return {
    id: publicacion.id,
    titulo_publicacion: publicacion.titulo_publicacion,
    descripcion: publicacion.descripcion,
    fecha_inicio: removerHoras(publicacion.fecha_inicio),
    fecha_vigencia: removerHoras(publicacion.fecha_vigencia),
    prioridad: publicacion.prioridad,
    no_dar_baja: publicacion.no_dar_baja,
    visualizaciones: publicacion.visualizaciones,
    portada: portada,
    documentos: documentos,
    ruta_publicacion: "https://www.instagram.com/sae.utn.frc/",
  };
};

function removerHoras(isoString) {
  if (!isoString) return "";
  const [year, month, day] = isoString.split("T")[0].split("-");
  return year + "/" + month + "/" + day; 
}

function parseFiles(filesString) {
  // Validamos que sea un texto útil
  if (!filesString || filesString.length <= 1) return [];
  // Quitamos el último carácter sobrante (como el guion final)
  const limpia = filesString.endsWith("-")
    ? filesString.slice(0, -1)
    : filesString;
  console.log("Limpiado la cadena queda: ",limpia)
  return limpia
    .split("-")
    .filter((item) => item.includes(","))
    .map((item) => {
      const [id, filename] = item.split(",");
      return {
        id: id,
        name: filename || "",
        nombre_documento: filename || "",
        extension: filename?.split(".").pop().toLowerCase() || "",
      };
    });
}
