import { useState, useEffect, useCallback } from "react";
import { TravelContext } from "../studentContext";
import {
  DescargarDocumentacionXId,
  ObtenerViajesXLegajo,
} from "../../../api/TravelService";
import {
  eliminarDocumentoEstudiante,
  listarDocumentacionXLegajo,
} from "../../../api/BecasService";
import { crearDocumentoEstudiante } from "../../../api/DeporteService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { mapViajes } from "../../../api/formatters/ViajeFormatter";
import {
  useAuth,
  useNotification,
} from "../../../shared/context/sharedContext";

import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "../../../utils/common/constants.js";
import { TRIPS_STRINGS } from "../../../utils/strings/student.strings.js";
import { TRAVEL_REQUIRED_DOCUMENTS } from "../../../utils/common/common.config.js";
import { obtenerLegajoDesdeEmail } from "../../../utils/util.jsx";

import {
  buildDocumentName,
  buildDocumentsFromConfig,
  createPreviewState,
  isPdfDocument,
} from "../../../utils/documents.utils.js";
import { mapResponseDocumento } from "../../../api/formatters/EstudianteFormatters.js";
const C = TRIPS_STRINGS;


export const TravelProvider = ({ children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const closePreview = () => {
    setPreview((previous) => ({
      ...previous,
      open: false,
      imageSrc: null, // Limpieza para liberar memoria
    }));
  };


  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [documentosParaMostrar, setDocumentosParaMostrar] = useState(() =>
    TRAVEL_REQUIRED_DOCUMENTS.map((documento) => ({ ...documento })),
  );

  const fetchDocumentos = useCallback(async () => {
    setLoadingDocumentos(true);
    try {
      const documentTypes = await obtenerTiposDocumento();
      const data = await listarDocumentacionXLegajo(user.legajo);
      const perfilDocs = data.map(mapResponseDocumento);

      setDocumentosParaMostrar((previousDocuments) =>
        buildDocumentsFromConfig(
          TRAVEL_REQUIRED_DOCUMENTS,
          documentTypes,
          previousDocuments,
          perfilDocs,
        ),
      );
    } catch (error) {
      console.error("Error cargando documentos:", error);
      // En caso de error, mostramos la lista base (todos como "no subidos")
      setDocumentosParaMostrar(
        TRAVEL_REQUIRED_DOCUMENTS.map((documento) => ({ ...documento })),
      );
    } finally {
      setLoadingDocumentos(false);
    }
  }, [user?.legajo]);
  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const closeDeleteDialog = () => {
    setOpenPopup(false);
    setDocumentoAEliminar(null);
  };

  const [travelsLegajo, setTravelsLegajo] = useState([]);
  const [loadingTravel, setLoadingTravel] = useState(false);

  const fetchTravelsLegajo = useCallback(async (legajo) => {
    if (!legajo) return;
    setLoadingTravel(true);
    try {
      const data = await ObtenerViajesXLegajo(legajo);
      setTravelsLegajo(data.map(mapViajes));
    } catch {
      setTravelsLegajo([]);
    } finally {
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

    const fileExt = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = (item.extension ?? "")
      .split(",")
      .map((value) => value.trim().replace(/^\.+/, "").toLowerCase())
      .filter(Boolean);

    if (!allowedExtensions.includes(fileExt)) {
      // 2. Mostrar mensaje legible (usando .join)
      showNotification(
        `${C.errorExtensionMsg}${allowedExtensions.join(", ")}`,
        "warning",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showNotification(`${C.errorMaxMBMsg}${MAX_FILE_SIZE_MB} MB.`, "warning");
      event.target.value = "";
      return;
    }

    const fileName = buildDocumentName(
      item.formatoNombre,
      {
        idViaje: travelsLegajo[0]?.id ?? "",
        legajo: obtenerLegajoDesdeEmail(user.legajo),
      },
      fileExt,
    );
    const renamedFile = new File([file], fileName, {
      type: file.type,
      lastModified: file.lastModified,
    });

    try {
      setLoadingDocuments(true);
      await crearDocumentoEstudiante(item.id_tipo_documento, renamedFile);
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
    if (!item?.id_archivo) return;

    try {
      setOpenPopup(false);
      setLoadingDocuments(true);
      await eliminarDocumentoEstudiante(item.id_archivo);

      fetchDocumentos();
      showNotification(C.docEliminado, "success");
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      showNotification(C.docEliminadoError, "error");
    } finally {
      setLoadingDocuments(false);
      setDocumentoAEliminar(null);
    }
  };
  return (
    <TravelContext.Provider
      value={{
        travelsLegajo,
        loadingTravel,
        fetchTravelsLegajo,
        TRAVEL_REQUIRED_DOCUMENTS,
        handlePreview,
        preview,
        setPreview,
        openPopup,
        setOpenPopup,
        documentoAEliminar,
        setDocumentoAEliminar,
        requestDeleteDocument,
        handleDelete,
        closePreview,
        closeDeleteDialog,
        handleArchivoChange,
        loadingDocuments,

        loadingDocumentos,
        documentosParaMostrar,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};
