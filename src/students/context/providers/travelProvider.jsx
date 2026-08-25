import { useState,useEffect,useCallback } from "react";
import { TravelContext } from "../studentContext";
import { DescargarDocumentacionXId, ObtenerViajesXLegajo } from "../../../api/TravelService";
import { eliminarDocumentoEstudiante, listarDocumentacionXLegajo } from "../../../api/BecasService";
import { crearDocumentoEstudiante } from "../../../api/DeporteService";
import { mapViajes } from "../../../api/formatters/ViajeFormatter";
import { useAuth, useNotification } from "../../../shared/context/sharedContext";

import { MAX_FILE_SIZE_BYTES,MAX_FILE_SIZE_MB } from "../../../utils/common/constants.js";
import { TRIPS_STRINGS } from "../../../utils/strings/student.strings.js";
import { TRAVEL_REQUIRED_DOCUMENTS } from "../../../utils/common/common.config.js";

import { buildDocumentName, createPreviewState,isPdfDocument} from "../../../utils/documents.utils.js";
import { mapResponseDocumento } from "../../../api/formatters/EstudianteFormatters.js";
const C = TRIPS_STRINGS;

export const TravelProvider = ({ children }) => {
    const { user } = useAuth();
    const {showNotification} = useNotification();

  const closePreview = () => {
      setPreview((previous) => ({
        ...previous,
        open: false,
        imageSrc: null, // Limpieza para liberar memoria
      }));
  };

const mergeDocuments = (requiredDocs, profileDocs) => {
  return requiredDocs.map((reqDoc) => {
    // Buscar el documento correspondiente en la data del perfil
    const uploadedDoc = profileDocs.find(
      (pDoc) =>
        Number(pDoc.id_tipo_documento) === Number(reqDoc.id_tipo_documento),
    );
    // Si existe en el perfil, fusionamos los datos; si no, mantenemos el estado base
    if (uploadedDoc) {
      
      return {
        ...reqDoc, // Mantiene nombre, descripción, template, required, etc.
        subido: true, // Marca como subido
        archivo: uploadedDoc.archivo, // URL o blob del archivo
        nombre_documento: uploadedDoc.nombre_documento || reqDoc.archivoNombre,
        id_archivo: uploadedDoc.id, // ID necesario para borrar
        fechaSubida: uploadedDoc.fecha_subida,
      };
    }

    // Si no está subido, devuelve el objeto base (subido: false)
    return reqDoc;
  });
};

  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [documentosParaMostrar, setDocumentosParaMostrar] = useState(TRAVEL_REQUIRED_DOCUMENTS);

  const fetchDocumentos =  useCallback(async () => {
      setLoadingDocumentos(true);
      try {
        const data = await listarDocumentacionXLegajo(user.legajo);
        const perfilDocs = data.map(mapResponseDocumento);
        const listaActualizada = mergeDocuments(TRAVEL_REQUIRED_DOCUMENTS, perfilDocs);

        setDocumentosParaMostrar(listaActualizada,perfilDocs);

      } catch (error) {
        console.error("Error cargando documentos:", error);
        // En caso de error, mostramos la lista base (todos como "no subidos")
        setDocumentosParaMostrar(TRAVEL_REQUIRED_DOCUMENTS);

      } finally {
        setLoadingDocumentos(false);
      }
    }, [user?.legajo]);
  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

    const closeDeleteDialog = () => setOpenPopup(false);

    const [travelsLegajo,setTravelsLegajo] = useState([]);
    const [loadingTravel,setLoadingTravel] = useState(false);

    const fetchTravelsLegajo = useCallback(async (legajo) => {
        if(!legajo)return;
        setLoadingTravel(true);
        try {
            const data = await ObtenerViajesXLegajo(legajo);    
            setTravelsLegajo(data.map(mapViajes));
        } catch {
            setTravelsLegajo([]);
        } 
        finally{
            setLoadingTravel(false);
        }
    }, []);

    useEffect(() => {
        fetchTravelsLegajo();
    }, [fetchTravelsLegajo]);
    const [preview, setPreview] = useState(createPreviewState());
    const [openPopup, setOpenPopup] = useState(false);
    const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

    const handlePreview = async (id, nombre) => {
        setPreview({
        open: true,
        loading: true,
        title: nombre,
        imageSrc: null,
        isPdf: false,
        error: null,
        });

        try {
        const data = await DescargarDocumentacionXId(id);
        setPreview({
            open: true,
            loading: false,
            title: nombre,
            imageSrc: data.datos_documento,
            isPdf: isPdfDocument(data),
            error: null,
        });
        } catch {
        setPreview((previous) => ({
            ...previous,
            loading: false,
            error: C.errorLoadingDocuments,
        }));
        }
    };


  const [loadingDocuments, setLoadingDocuments] = useState(true);

 const handleArchivoChange = async (event, item) => {
     const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = TRAVEL_REQUIRED_DOCUMENTS.map((doc) => 
        doc.extension.replace(/^\.+/, "").toLowerCase()
      );

      if (!allowedExtensions.includes(fileExt)) {
        // 2. Mostrar mensaje legible (usando .join)
        showNotification(
          `${C.errorExtensionMsg} Extensiones permitidas: ${allowedExtensions.join(", ")}`, 
          "warning"
        );
        event.target.value = "";
        return;
      }
 
     if (file.size > MAX_FILE_SIZE_BYTES) {
       showNotification(
         `${C.errorMaxMBMsg}${MAX_FILE_SIZE_MB} MB.`,
         "warning",
       );
       event.target.value = "";
       return;
     }
 
     const fileName = buildDocumentName(
       item.formatoNombre,
       { legajo: user.legajo },
       fileExt,
     );
     const renamedFile = new File([file], fileName, {
       type: file.type,
       lastModified: file.lastModified,
     });
 
     try {
       setLoadingDocuments(true);
        await crearDocumentoEstudiante(
         item.id_tipo_documento,
         renamedFile,
       );
      fetchDocumentos();
       showNotification(C.savedFile);
     } catch (error) {
       console.error("Error al subir el archivo:", error);
       showNotification(C.errorFile, "error");
     } finally {
       setLoadingDocuments(false);
       event.target.value = "";
     }
   };
    const requestDeleteDocument = (documento) => {
        setDocumentoAEliminar(documento);
        setOpenPopup(true);
    };

  const handleDelete = async (item) => {
      try {
        setOpenPopup(false);
        setLoadingDocuments(true);
        await eliminarDocumentoEstudiante(item.id_archivo);

        fetchDocumentos();
        showNotification(C.docEliminado,"success");
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
        showNotification(C.docEliminadoError, "error");
      } finally {
        setLoadingDocuments(false);
      }
    };
    return (
    <TravelContext.Provider
        value={{
            travelsLegajo,loadingTravel,fetchTravelsLegajo,
            TRAVEL_REQUIRED_DOCUMENTS,
            handlePreview,preview,setPreview,openPopup,setOpenPopup,
            documentoAEliminar,setDocumentoAEliminar,requestDeleteDocument,handleDelete,
            closePreview,closeDeleteDialog,
            handleArchivoChange,loadingDocuments,

            loadingDocumentos,documentosParaMostrar
        }}
    >
        {children}
    </TravelContext.Provider>
    );
}
