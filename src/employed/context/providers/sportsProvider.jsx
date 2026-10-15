import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import * as api from "../../../api/DeporteService";
import { ObtenerUsuariosXLegajo } from "../../../api/EmpleadoService.js";
import {
  validateCuil,
  validateFechaNacimiento,
  validateNombreApellido,
} from "../../../utils/validation.utils.js";

import { SportsContext } from "../employedContext";
import { formatHeader } from "../../../utils/datagrid.utils.jsx";
import { getFirstRecord } from "../../../utils/util.jsx";
import { useNotification } from "../../../shared/context/sharedContext";
import { EMPTY_COMPLETE_SCHEDULE } from "../../../utils/common/common.config.js";
import { SPORTS_STRINGS } from "../../../utils/strings/employed.strings.js";
import {
  formatDate,
  normalizeDateInput,
  toApiDateTime,
} from "../../../utils/date.utils.js";
import {
  buildDownloadFileName,
  getDownloadedDocumentName,
} from "../../../utils/documents.utils.js";

//Luis me gano, lo voy a dejar asi hasta que nos de ganas de hacerlo de 0
const generateSportsColumns = (
  data,
  { overrides = {}, actions = null } = {},
) => {
  const sample = Array.isArray(data) ? data[0] : data;

  if (!sample) return actions ? [actions] : [];

  const columns = Object.keys(sample)
    .filter((key) => !overrides[key]?.hidden)
    .map((key) => {
      const normalizedKey = key.toLowerCase();
      const isId =
        normalizedKey === "id" ||
        normalizedKey.startsWith("id_") ||
        normalizedKey.endsWith("_id");
      const isShort = ["estado", "cupo", "duracion"].includes(normalizedKey);

      return {
        field: key,
        headerName: formatHeader(key),
        flex: isId ? 0.4 : 1,
        minWidth: isId || isShort ? 50 : 120,
        maxWidth: isId ? 70 : isShort ? 100 : undefined,
        align: isId || isShort ? "center" : "left",
        headerAlign: isId || isShort ? "center" : "left",
        ...overrides[key],
      };
    });

  if (actions) columns.push(actions);

  return columns;
};

const C = SPORTS_STRINGS;


export function SportsProvider({ children, autoLoad = true }) {
  const navigate = useNavigate();
  const {
    showNotification,
    dialogOpen,
    dialogType,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    setDialogSaving,
    handleDataChange,
    openDialog,
    closeDialog,
  } = useNotification();

  const [torneosRows, setTorneosRows] = useState([]);
  const [profesoresRows, setProfesoresRows] = useState([]);
  const [espaciosRows, setEspaciosRows] = useState([]);
  const [deportistasRows, setDeportistasRows] = useState([]);
  const [deportesRows, setDeportesRows] = useState([]);
  const [loadingTorneos, setLoadingTorneos] = useState(false);
  const [loadingProfesores, setLoadingProfesores] = useState(false);
  const [loadingEspacios, setLoadingEspacios] = useState(false);
  const [loadingDeportistas, setLoadingDeportistas] = useState(false);
  const [loadingDeportes, setLoadingDeportes] = useState(false);
  const [torneoFormOpen, setTorneoFormOpen] = useState(false);
  const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);

  const [dialogFieldErrors, setDialogFieldErrors] = useState({});

  const [docsDialogOpen, setDocsDialogOpen] = useState(false);
  const [docsLegajo, setDocsLegajo] = useState("");
  const [docsList, setDocsList] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState("");
  const [downloadingDocId, setDownloadingDocId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewIsPdf, setPreviewIsPdf] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewDocRef, setPreviewDocRef] = useState(null);

  const load = useCallback(async (setter, loading, request, map = (x) => x) => {
    loading(true);
    try {
      setter((await request()).map(map));
    } catch {
      setter([]);
    } finally {
      loading(false);
    }
  }, []);
  const fetchProfesores = useCallback(
    () =>
      load(
        setProfesoresRows,
        setLoadingProfesores,
        api.obtenerDocentesDeportivos,
        (x, i) => ({ ...x, id: x.cuil || i }),
      ),
    [load],
  );
  const fetchEspacios = useCallback(
    () =>
      load(setEspaciosRows, setLoadingEspacios, api.obtenerEspaciosDeportivos),
    [load],
  );
  const fetchTorneos = useCallback(
    () => load(setTorneosRows, setLoadingTorneos, api.obtenerTorneosDeportivos),
    [load],
  );
  const fetchDeportistas = useCallback(
    () =>
      load(setDeportistasRows, setLoadingDeportistas, api.obtenerDeportistas),
    [load],
  );
  const fetchDeportes = useCallback(
    () =>
      load(setDeportesRows, setLoadingDeportes, api.obtenerDeportesCompleto),
    [load],
  );

  useEffect(() => {
    if (!autoLoad) return;
    fetchProfesores();
    fetchEspacios();
    fetchTorneos();
    fetchDeportistas();
    fetchDeportes();
  }, [
    autoLoad,
    fetchDeportes,
    fetchDeportistas,
    fetchEspacios,
    fetchProfesores,
    fetchTorneos,
  ]);

  const open = useCallback(
    (type, mode, data) => {
      setDialogFieldErrors({});
      openDialog(type, mode, data);
    },
    [openDialog],
  );
  const openCreateDocente = useCallback(
    () => open("docente", "create", EMPTY_COMPLETE_SCHEDULE.docente),
    [open],
  );
  const openCreateEspacio = useCallback(
    () => open("espacio", "create", EMPTY_COMPLETE_SCHEDULE.espacio),
    [open],
  );
  const openCreateDeportista = useCallback(
    () => open("deportista", "create", EMPTY_COMPLETE_SCHEDULE.deportista),
    [open],
  );
  const openCreateDeporte = useCallback(
    () => open("deporte", "create", EMPTY_COMPLETE_SCHEDULE.deporte),
    [open],
  );
  const openEditDocente = useCallback(
    (x) =>
      open("docente", "edit", {
        cuil: x.cuil,
        nombres: x.nombres,
        apellidos: x.apellidos,
        activo: x.activo,
        fecha_nacimiento: normalizeDateInput(x.fecha_nacimiento),
      }),
    [open],
  );
  const openEditEspacio = useCallback(
    (x) =>
      open("espacio", "edit", {
        id: x.id,
        nombre: x.nombre,
        domicilio: x.domicilio,
        activo: x.activo,
        url_maps: x.url_maps,
      }),
    [open],
  );
  const openEditDeportista = useCallback(
    (x) =>
      open("deportista", "edit", {
        id: x.id,
        legajo: x.legajo,
        vencimiento_ficha: normalizeDateInput(x.vencimiento_ficha),
        habilitado_deporte: x.habilitado_deporte,
      }),
    [open],
  );
  const openEditDeporte = useCallback(
    (x) =>
      open("deporte", "edit", { id: x.id, nombre: x.nombre, activo: x.activo }),
    [open],
  );

  const openDocsDialog = useCallback(async (legajo) => {
    setDocsLegajo(legajo);
    setDocsList([]);
    setDocsError("");
    setLoadingDocs(true);
    setDocsDialogOpen(true);
    try {
      setDocsList(await api.listarDocumentacionXLegajo(legajo));
    } catch (e) {
      setDocsError(e.message || C.er);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  const handlePreviewDoc = useCallback(async (doc) => {
    setPreviewTitle(doc.nombre_documento);
    setPreviewSrc(null);
    setPreviewError("");
    setPreviewIsPdf(false);
    setPreviewDocRef(doc);
    setLoadingPreview(true);
    setPreviewOpen(true);
    try {
      const response = await api.descargarDocumentacionXId(doc.id);
      const data = Array.isArray(response) ? response[0] : response;
      const ext = (data.extension || doc.extension || "").toLowerCase();
      let src = data.datos_documento;
      if (!src.startsWith("data:") && !src.startsWith("blob:")) {
        const mime =
          {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
          }[ext] || "application/octet-stream";
        src = `data:${mime};base64,${src}`;
      }
      setPreviewSrc(src);
      setPreviewIsPdf(ext === "pdf");
    } catch (e) {
      setPreviewError(e.message || C.errorNoDocs);
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  const handleDownloadDoc = useCallback(async (id, name, extension) => {
    setDownloadingDocId(id);
    try {
      const response = await api.descargarDocumentacionXId(id);
      const data = Array.isArray(response) ? response[0] : response;
      let base64 = data.datos_documento;
      if (base64.startsWith("blob:")) {
        const anchor = document.createElement("a");
        const documentName = getDownloadedDocumentName(
          data.nombre_documento,
          name,
        );
        anchor.href = base64;
        anchor.download = buildDownloadFileName(
          documentName,
          name,
          data.extension || extension,
        );
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        return;
      }
      if (base64.startsWith("data:")) base64 = base64.split(",")[1];
      const chars = atob(base64);
      const bytes = Uint8Array.from(chars, (char) => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes]));
      const anchor = document.createElement("a");
      const documentName = getDownloadedDocumentName(
        data.nombre_documento,
        name,
      );
      anchor.href = url;
      anchor.download = buildDownloadFileName(
        documentName,
        name,
        data.extension || extension,
      );
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingDocId(null);
    }
  }, []);

  const validateField = useCallback(
    (field, value, data = dialogData) => {
      const text = String(value ?? "").trim();

      switch (field) {
        case "cuil":
          if (dialogMode !== "create") return "";
          if (!text) return "El CUIL es obligatorio";
          return validateCuil(text) ? "" : "El CUIL ingresado no es válido";

        case "nombres":
          return validateNombreApellido(text, "El nombre") || "";

        case "apellidos":
          return validateNombreApellido(text, "El apellido") || "";

        case "fecha_nacimiento":
          return validateFechaNacimiento(value) || "";

        case "nombre":
          if (!text) {
            return dialogType === "deporte"
              ? "El nombre del deporte es obligatorio"
              : "El nombre es obligatorio";
          }
          return text.length < 2 ? "Debe tener al menos 2 caracteres" : "";

        case "domicilio":
          if (!text) return "El domicilio es obligatorio";
          return text.length < 5 ? "Ingresá un domicilio válido" : "";

        case "url_maps":
          if (!text) return "";
          try {
            const url = new URL(text);
            return ["http:", "https:"].includes(url.protocol)
              ? ""
              : "La URL debe comenzar con http:// o https://";
          } catch {
            return "La URL ingresada no es válida";
          }

        case "legajo":
          if (dialogMode !== "create") return "";
          if (!text) return "El legajo es obligatorio";
          return String(data.nombre_deportista ?? "").trim()
            ? ""
            : "Seleccioná un alumno mediante el buscador";

        case "vencimiento_ficha": {
          if (dialogMode === "create") return "";
          if (!value) return "El vencimiento de ficha es obligatorio";
          const fecha = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return fecha < today ? "La ficha ya está vencida" : "";
        }

        default:
          return "";
      }
    },
    [dialogData, dialogMode, dialogType],
  );

  const getRequiredFields = useCallback(
    (type, mode = dialogMode) => {
      const fieldsByType = {
        docente:
          mode === "create"
            ? ["cuil", "nombres", "apellidos", "fecha_nacimiento"]
            : ["nombres", "apellidos", "fecha_nacimiento"],
        espacio: ["nombre", "domicilio", "url_maps"],
        deportista:
          mode === "create" ? ["legajo"] : ["vencimiento_ficha"],
        deporte: ["nombre"],
      };

      return fieldsByType[type] || [];
    },
    [dialogMode],
  );

  const validateDialog = useCallback(
    (type) => {
      const errors = getRequiredFields(type).reduce((acc, field) => {
        const message = validateField(field, dialogData[field], dialogData);
        if (message) acc[field] = message;
        return acc;
      }, {});

      setDialogFieldErrors(errors);

      if (Object.keys(errors).length) {
        setDialogError("Revisá los campos marcados antes de guardar.");
        return false;
      }

      setDialogError("");
      return true;
    },
    [dialogData, getRequiredFields, setDialogError, validateField],
  );

  const handleDialogChange = useCallback(
    (field, value) => {
      const nextData = { ...dialogData, [field]: value };
      const message = validateField(field, value, nextData);

      handleDataChange(field, value);
      setDialogFieldErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        if (message) {
          nextErrors[field] = message;
        } else {
          delete nextErrors[field];
        }

        if (
          field === "nombre_deportista" &&
          String(value ?? "").trim() &&
          currentErrors.legajo
        ) {
          delete nextErrors.legajo;
        } else if (field === "nombre_deportista" && currentErrors.legajo) {
          const legajoError = validateField(
            "legajo",
            nextData.legajo,
            nextData,
          );
          if (legajoError) {
            nextErrors.legajo = legajoError;
          } else {
            delete nextErrors.legajo;
          }
        }

        return nextErrors;
      });
    },
    [dialogData, handleDataChange, validateField],
  );

  const buscarAlumnoPorLegajo = useCallback(async (legajo) => {
    const alumno = await ObtenerUsuariosXLegajo(String(legajo).trim());
    return getFirstRecord(alumno);
  }, []);

  const executeSave = useCallback(async () => {
    setDialogSaving(true);
    try {
      if (dialogType === "docente") {
        const body = {
          ...dialogData,
          fecha_nacimiento: toApiDateTime(dialogData.fecha_nacimiento),
        };
        await (dialogMode === "create"
          ? api.crearDocenteDeportivo(body)
          : api.modificarDocenteDeportivo(dialogData.cuil, body));
        await fetchProfesores();
        showNotification(
          dialogMode === "create" ? C.teacherCreated : C.teacherUpdated,
          "success",
        );
      } else if (dialogType === "espacio") {
        await (dialogMode === "create"
          ? api.crearEspacioDeportivo(dialogData)
          : api.modificarEspacioDeportivo(dialogData.id, dialogData));
        await fetchEspacios();
        showNotification(
          dialogMode === "create" ? C.placeCreated : C.placeUpdated,
          "success",
        );
      } else if (dialogType === "deportista") {
        const body = {
          ...dialogData,
          vencimiento_ficha:
            dialogMode === "create"
              ? new Date()
              : toApiDateTime(dialogData.vencimiento_ficha),
          habilitado_deporte:
            dialogMode === "create" ? false : dialogData.habilitado_deporte,
        };
        //console.log("deportista",body);
        await (dialogMode === "create"
          ? api.crearDeportista(body)
          : api.modificarDeportista(dialogData.id, body));
        await fetchDeportistas();
        showNotification(
          dialogMode === "create" ? C.sportsmanCreated : C.sportsmanUpdated,
          "success",
        );
      } else {
        await (dialogMode === "create"
          ? api.crearDeporte(dialogData)
          : api.modificarDeporte(dialogData.id, dialogData));
        await fetchDeportes();
        showNotification(
          dialogMode === "create" ? C.sportsCreated : C.sportsUpdated,
          "success",
        );
      }
      closeDialog();
    } catch (e) {
      setDialogError(e.message || C.errorSave);
      showNotification(e.message || C.errorSave, "error");
    } finally {
      setDialogSaving(false);
    }
  }, [
    dialogData,
    dialogMode,
    dialogType,
    fetchDeportes,
    fetchDeportistas,
    fetchEspacios,
    fetchProfesores,
    showNotification,
    closeDialog,
    setDialogError,
    setDialogSaving,
  ]);

  const handleDialogSave = useCallback(() => {
    if (validateDialog(dialogType)) executeSave();
  }, [dialogType, executeSave, validateDialog]);

  //#region Inscripcion a Deportes

  const [deportistasInscriptos, setDeportistasInscriptos] = useState([]);
  const [loadingInscriptos, setLoadingInscriptos] = useState(false);

  const fetchDeportistasXDeporte = useCallback(
    async (idDeporte) => {
      if (!idDeporte) return; // Evita buscar si está vacío
      setLoadingInscriptos(true);
      try {
        const data = await api.ObtenerDeportistasXDeporte(idDeporte);
        if (data) {
          setDeportistasInscriptos(data);
        } else {
          setDialogError("ERROR: Ocurrio un error buscando a los deportistas");
        }
      } catch {
        setDeportistasInscriptos(null);
        setDialogError("Usuario No encontrado");
      } finally {
        setLoadingInscriptos(false);
      }
    },
    [setDialogError],
  );

  useEffect(() => {
    fetchDeportistasXDeporte();
  }, [fetchDeportistasXDeporte]);

  //#endregion

  const booleanColumn = (yes = C.active, no = C.inactive) => ({
    width: 120,
    flex: 0,
    renderCell: ({ value }) => (
      <Chip
        size="small"
        label={value ? yes : no}
        color={value ? "success" : "default"}
      />
    ),
  });
  const actionColumn = (renderCell, width = 120) => ({
    field: "acciones",
    headerName: "Acciones",
    width,
    minWidth: width,
    maxWidth: width,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }}
      >
        {renderCell(params)}
      </Stack>
    ),
  });

  const profesoresColumns = useMemo(
    () =>
      generateSportsColumns(profesoresRows, {
        overrides: {
          id: { hidden: true },
          cuil: { headerName: "CUIL", width: 150, flex: 0 },
          activo: booleanColumn(),
          fecha_nacimiento: {
            headerName: "Fecha de nacimiento",
            width: 170,
            flex: 0,
            valueFormatter: formatDate,
          },
        },
        actions: actionColumn(({ row }) => (
          <IconButton
            size="small"
            onClick={() => openEditDocente(row)}
            sx={{ color: "var(--primary)" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [openEditDocente, profesoresRows],
  );
  const espaciosColumns = useMemo(
    () =>
      generateSportsColumns(espaciosRows, {
        overrides: { activo: booleanColumn() },
        actions: actionColumn(({ row }) => (
          <IconButton
            size="small"
            onClick={() => openEditEspacio(row)}
            sx={{ color: "var(--primary)" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [espaciosRows, openEditEspacio],
  );
  const deportistasColumns = useMemo(
    () =>
      generateSportsColumns(deportistasRows, {
        overrides: {
          habilitado_deporte: booleanColumn("Sí", "No"),
          vencimiento_ficha: {
            headerName: "Venc. ficha",
            width: 140,
            flex: 0,
            valueFormatter: formatDate,
          },
        },
        actions: actionColumn(
          ({ row }) => (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                size="small"
                onClick={() => openEditDeportista(row)}
                sx={{ color: "var(--primary)" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                title="Ver documentación"
                onClick={() => openDocsDialog(row.legajo)}
                sx={{ color: "var(--primary)" }}
              >
                <FolderOpenIcon fontSize="small" />
              </IconButton>
            </Stack>
          ),
          140,
        ),
      }),
    [deportistasRows, openDocsDialog, openEditDeportista],
  );
  const deportesColumns = useMemo(
    () =>
      generateSportsColumns(deportesRows, {
        overrides: { activo: booleanColumn() },
        actions: actionColumn(({ row }) => (
          <IconButton
            size="small"
            onClick={() => openEditDeporte(row)}
            sx={{ color: "var(--primary)" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [deportesRows, openEditDeporte],
  );
  const torneosColumns = useMemo(
    () =>
      generateSportsColumns(torneosRows, {
        overrides: {
          fecha_inicio: {
            width: 120,
            flex: 0,
          },
          fecha_fin: {
            width: 120,
            flex: 0,
          },
          fecha_limite_inscripcion: {
            width: 180,
            flex: 0,
          },
          cupo_jugadores: { headerName: "Cupo", width: 80, flex: 0 },
          activo: booleanColumn(),
        },
        actions: actionColumn(({ row }) => (
          <IconButton
            size="small"
            onClick={() => navigate(`/Gestion-Torneos/${row.id}`)}
            sx={{ color: "var(--primary)" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [navigate, torneosRows],
  );

  const value = {
    torneosRows,
    loadingTorneos,
    torneoFormOpen,
    setTorneoFormOpen,
    fetchTorneos,
    profesoresRows,
    loadingProfesores,
    espaciosRows,
    loadingEspacios,
    deportistasRows,
    loadingDeportistas,
    deportesRows,
    loadingDeportes,
    dialogOpen,
    dialogType,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    dialogFieldErrors,
    horariosDialogOpen,
    setHorariosDialogOpen,
    docsDialogOpen,
    setDocsDialogOpen,
    docsLegajo,
    docsList,
    loadingDocs,
    docsError,
    downloadingDocId,
    previewOpen,
    setPreviewOpen,
    previewTitle,
    previewSrc,
    previewIsPdf,
    loadingPreview,
    previewError,
    previewDocRef,
    closeDialog,
    openCreateDocente,
    openEditDocente,
    openCreateEspacio,
    openEditEspacio,
    openCreateDeportista,
    openEditDeportista,
    openCreateDeporte,
    openEditDeporte,
    openDocsDialog,
    handlePreviewDoc,
    handleDownloadDoc,
    handleDialogChange,
    handleDialogSave,
    buscarAlumnoPorLegajo,
    profesoresColumns,
    espaciosColumns,
    deportistasColumns,
    deportesColumns,
    torneosColumns,
    obtenerTorneosDeportivos: api.obtenerTorneosDeportivos,
    crearTorneo: api.crearTorneo,
    obtenerTorneoXId: api.obtenerTorneoXId,
    modificarTorneo: api.modificarTorneo,
    obtenerDeportistasXTorneo: api.obtenerDeportistasXTorneo,
    obtenerDeportistasXDeporte: api.ObtenerDeportistasXDeporte,
    crearInscripcionTorneo: api.crearInscripcionTorneo,
    eliminarInscripcionTorneo: api.eliminarInscripcionTorneo,
    obtenerDeportistas: api.obtenerDeportistas,
    obtenerDeportesActivos: api.obtenerDeportesActivos,
    obtenerHorariosXDeporte: api.obtenerHorariosXDeporte,
    crearHorarioDeportivo: api.crearHorarioDeportivo,
    modificarHorarioDeportivo: api.modificarHorarioDeportivo,
    eliminarHorarioDeportivo: api.eliminarHorarioDeportivo,
    obtenerDocentesDeportivos: api.obtenerDocentesDeportivos,
    obtenerEspaciosDeportivos: api.obtenerEspaciosDeportivos,
    obtenerDeportesCompleto: api.obtenerDeportesCompleto,

    loadingInscriptos,
    deportistasInscriptos,
    fetchDeportistasXDeporte,
  };
  return (
    <SportsContext.Provider value={value}>{children}</SportsContext.Provider>
  );
}
