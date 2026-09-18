import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth, useNotification } from "../../../shared/context/sharedContext";
import {
  obtenerIdDeportista,
  listarDocumentacionXLegajo,
  obtenerHorariosDeportista,
  obtenerTorneosXDeportista,
  crearInscripcionDeporte,
  eliminarInscripcionDeporte,
  descargarDocumentacionXId,
  crearDocumentoEstudiante,
  eliminarDocumentoEstudiante,
  crearDeportista,
} from "../../../api/DeporteService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { SPORTS_STRINGS } from "../../../utils/strings/student.strings.js"; 
import { buildDocumentName, createPreviewState, isPdfDocument } from "../../../utils/documents.utils.js";
import { formatDate } from "../../../utils/date.utils.js";

import { generateColumns } from "../../../utils/datagrid.utils.jsx";

import { filterTournaments, obtenerLegajoDesdeEmail } from "../../../utils/util.jsx"; 

import {SCHOLARSHIPS_STATES , SCHOLARSHIP_TYPE,MAX_FILE_SIZE_BYTES,MAX_FILE_SIZE_MB} from "../../../utils/common/constants.js";
import { SPORTS_REQUIRED_DOCUMENTS } from "../../../utils/common/common.config.js";

import { SportsContext } from "../studentContext";

const C = SPORTS_STRINGS;
const TOURNAMENT_INSCRIPTION_SAMPLE = {
  id: 0,
  nombre_torneo: "",
  fecha_inscripcion: "",
  nombre_deporte: "",
};

export function SportsProvider({ children }) {
  const { user } = useAuth();
  const {showNotification} = useNotification();
  const [documentos, setDocumentos] = useState(() =>
    SPORTS_REQUIRED_DOCUMENTS.map((documento) => ({ ...documento })),
  );
  const [deportista, setDeportista] = useState(null);
  const [horariosDeportista, setHorariosDeportista] = useState([]);
  const [torneoDeportista, setTorneoDeportista] = useState([]);
  const [busquedaTorneos, setBusquedaTorneos] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [preview, setPreview] = useState(createPreviewState());
  const [openPopup, setOpenPopup] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

  const closePreview = () => {
      setPreview((previous) => ({
        ...previous,
        open: false,
        imageSrc: null, // Limpieza para liberar memoria
      }));
  };

  const closeDeleteDialog = () => setOpenPopup(false);

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
      const data = await descargarDocumentacionXId(id);
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
        error: "No se pudo cargar el documento",
      }));
    }
  };

  const handleArchivoChange = async (event, item) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = `.${file.name.split(".").pop().toLowerCase()}`;
    const allowedExtensions = (item.extension ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase());

    if (!allowedExtensions.includes(extension)) {
      showNotification(
        `Formato no válido. Formatos permitidos: ${item.extension}`,
        "warning",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showNotification(
        `El archivo no puede superar los ${MAX_FILE_SIZE_MB} MB.`,
        "warning",
      );
      event.target.value = "";
      return;
    }

    const fileName = buildDocumentName(
      item.formatoNombre,
      { legajo: obtenerLegajoDesdeEmail(user.legajo) },
      extension,
    );
    const renamedFile = new File([file], fileName, {
      type: file.type,
      lastModified: file.lastModified,
    });

    try {
      setLoadingDocuments(true);
      const savedFile = await crearDocumentoEstudiante(
        item.id_tipo_documento,
        renamedFile,
      );
      setDocumentos((previous) =>
        previous.map((documento) =>
          Number(documento.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...documento,
                archivo: savedFile,
                archivoNombre: savedFile.nombre_documento,
                subido: true,
                id_archivo: savedFile.id,
              }
            : documento,
        ),
      );
      showNotification("Archivo subido con éxito");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      showNotification("Error al subir el archivo", "error");
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
      setDocumentos((previous) =>
        previous.map((documento) =>
          Number(documento.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...documento,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : documento,
        ),
      );
      showNotification(C.docEliminado,"success");
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      showNotification(C.docEliminadoError, "error");
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadSportsmanSchedules = async (sportsman) => {
    const data = await obtenerHorariosDeportista(sportsman.id);
    setHorariosDeportista(data);
    return data;
  };

  const loadTournamentsForSportsman = useCallback(
    async (sportsman) => {
      setLoadingTournaments(true);
      try {
        if (!sportsman?.id) {
          setTorneoDeportista([]);
          return;
        }

        const tournaments = await obtenerTorneosXDeportista(sportsman.id);
        setTorneoDeportista(Array.isArray(tournaments) ? tournaments : []);
      } catch (error) {
        console.error("Error al cargar torneos:", error);
        showNotification(C.erroLoadTournaments, "error");
      } finally {
        setLoadingTournaments(false);
      }
    },
    [showNotification],
  );

  const requiredDocumentsUploaded = () =>
    documentos
      .filter((documento) => documento.required)
      .every((documento) => documento.subido);

  const getOrCreateSportsman = async () => {
    //console.log(deportista);
    if (deportista?.id) return deportista;

    const body = {
      legajo: user?.email ?? user?.legajo ?? "",
      nombre_deportista: user?.nombre ?? "",
      vencimiento_ficha: null,
      habilitado_deportado: true,
      habilitado_deporte: true,
    };

    const createdSportsman = await crearDeportista(body);
    const sportsman = createdSportsman?.id
      ? createdSportsman
      : await obtenerIdDeportista(body.legajo);
    setDeportista(sportsman);
    return sportsman;
  };

  const handleInscribirClick = async (card) => {
    try {
      setLoadingSports(true);
      let currentSportsman = deportista;
      let missingRequiredDocuments = false;
      if (card.esta_inscripto) {
        await eliminarInscripcionDeporte(card.id_inscripcion);
      } else {
        missingRequiredDocuments =
          loadingDocuments || !requiredDocumentsUploaded();
        currentSportsman = await getOrCreateSportsman();
        await crearInscripcionDeporte(card.id_deporte, currentSportsman.id);
      }
      const successMessage = card.esta_inscripto
        ? C.successUnsuscription
        : C.successInsncription;
      showNotification(
        missingRequiredDocuments
          ? `${successMessage}. Recordá subir toda la documentación obligatoria.`
          : successMessage,
        missingRequiredDocuments ? "warning" : "success",
      );
      await loadSportsmanSchedules(currentSportsman);
      setLoadingSports(false);
      await loadTournamentsForSportsman(currentSportsman);
    } catch (error) {
      console.error("Error al manejar la inscripción:", error);
      showNotification(C.errorHandleSucscription, "error");
    } finally {
      setLoadingSports(false);
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    const initialize = async () => {
      setLoadingDocuments(true);
      setLoadingSports(true);
      setLoadingTournaments(true);

      const loadDocuments = async () => {
        try {
          const documentTypes = await obtenerTiposDocumento();
          const typedDocuments = SPORTS_REQUIRED_DOCUMENTS.map((documento) => {
            const match = documentTypes?.find(
              (type) =>
                type.nombre.trim().toLowerCase() ===
                documento.nombre.trim().toLowerCase(),
            );
            return match
              ? {
                  ...documento,
                  id_tipo_documento: match.id,
                  extension: match.extension,
                }
              : { ...documento };
          });

          //console.log("[DeportesDocumentos] Tipos filtrados:", typedDocuments);
          console.table(
            typedDocuments.map((documento) => ({
              nombre: documento.nombre,
              id_tipo_documento: documento.id_tipo_documento,
              extension: documento.extension,
            })),
          );

          const uploadedDocuments = await listarDocumentacionXLegajo(
            user.email,
          );
          const documentsWithUploads = typedDocuments.map((documento) => {
              const uploaded = uploadedDocuments?.find(
                (item) =>
                  Number(item.id_tipo_documento) ===
                  Number(documento.id_tipo_documento),
              );
              return uploaded
                ? {
                    ...documento,
                    subido: true,
                    archivo: uploaded,
                    archivoNombre: uploaded.nombre_documento,
                    id_archivo: uploaded.id,
                    extension: uploaded.extension ?? documento.extension,
                  }
                : documento;
            });
          /*
          console.log(
            "[DeportesDocumentos] Lista final con extensiones:",
            documentsWithUploads,
          );
          console.table(
            documentsWithUploads.map((documento) => ({
              nombre: documento.nombre,
              id_tipo_documento: documento.id_tipo_documento,
              extension: documento.extension,
              subido: Boolean(documento.subido),
            })),
          );*/
          setDocumentos(documentsWithUploads);
          
        } catch (error) {
          console.error("Error al cargar documentos deportivos:", error);
          showNotification(C.errotLoadDocumentsType, "error");
        } finally {
          setLoadingDocuments(false);
        }
      };

      const loadSportsAndTournaments = async () => {
        try {
          const sportsman = await obtenerIdDeportista(user.email);
          setDeportista(sportsman);
          if (sportsman) await loadSportsmanSchedules(sportsman);
          await loadTournamentsForSportsman(sportsman);
        } catch (error) {
          console.error("Error al cargar deportes del estudiante:", error);
          showNotification(C.errorLoadSports, "error");
        } finally {
          setLoadingSports(false);
        }
      };

      await Promise.all([loadDocuments(), loadSportsAndTournaments()]);
    };

    initialize();
  }, [user?.email, loadTournamentsForSportsman, showNotification]);

  const rowsTorneosFiltradas = useMemo(
    () => filterTournaments(torneoDeportista, busquedaTorneos),
    [torneoDeportista, busquedaTorneos],
  );

  const subscribedSportIds = useMemo(
    () =>
      horariosDeportista
        .filter((horario) => horario.esta_inscripto)
        .map((horario) => horario.id_deporte),
    [horariosDeportista],
  );
  const tournamentsColumns = useMemo(() => {
    return generateColumns(TOURNAMENT_INSCRIPTION_SAMPLE, [], {
      fecha_inscripcion: {
        headerName: "Fecha Inscripción",
        valueFormatter: formatDate,
      },
    });
  }, []);

  return (
    <SportsContext.Provider
      value={{
        busquedaTorneos,
        closeDeleteDialog,
        closePreview,
        documentoAEliminar,
        documentos,
        handleArchivoChange,
        handleDelete,
        handleInscribirClick,
        handlePreview,
        horariosDeportista,
        loadingDocuments,
        loadingSports,
        loadingTournaments,
        openPopup,
        preview,
        requestDeleteDocument,
        rowsTorneosFiltradas,
        setBusquedaTorneos,
        subscribedSportIds,
        torneoDeportista,
        torneosColumns: tournamentsColumns,
      }}
    >
      {children}
    </SportsContext.Provider>
  );
}
