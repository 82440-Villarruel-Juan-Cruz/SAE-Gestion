import { useState, useEffect, useCallback, useMemo } from "react";
import { ScholarshipContext } from "../employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import EditIcon from "@mui/icons-material/Edit";

import {
  ObtenerProyectosInvestigacion,
  ObtenerBecariosCompleto,
  ObtenerServiciosInternos,
  CrearServicioInterno,
  CrearProyectoInvestigacion,
  EditarProyectoInvestigacion,
  EditarServicioInterno,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
  ObtenerUsuariosXLegajo,
  CrearBecarioSAE,
  CrearBecarioEconomica,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
  EditarBecarioSAE,
  EditarBecarioEconomica,
  EditarBecarioInvestigacion,
  EditarBecarioServicio,
  descargarDocumentacionXId,
  listarDocumentacionXLegajo,
} from "../../../api/BecasService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { getFirstRecord, valuesAreEqual } from "../../../utils/util.jsx";
import { BECAS_STRINGS } from "../../../utils/strings/employed.strings";

import {
  ECONOMIC_DOCUMENTS,
  EMPTY_BECARIO,
  EMPTY_PROYECTS,
  EMPTY_SERVICES,
  SCHOLARSHIPS_REQUERID_DOCUMENTS,
} from "../../../utils/common/common.config";
import { SCHOLARSHIP_TYPES } from "../../../utils/common/constants";
import { buildDocumentsFromConfig } from "../../../utils/documents.utils";
import { generateColumns } from "../../../utils/datagrid.utils.jsx";
import { getTodayInputDate } from "../../../utils/date.utils.js";

const BS = BECAS_STRINGS;

export function ScholarshipProvider({ children }) {
  const {
    showNotification,
    openDialog,
    closeDialog,
    dialogData,
    dialogMode,
    setDialogError,
    setDialogSaving,
  } = useNotification();

  //#region Helpers de becarios

  // Busca las becas especificas de un alumno y las normaliza para mostrarlas en tabs.
  async function handleBuscarBecario(legajo) {
    const [becasEconomicas, becasServicios, becasInvestigacion] =
      await Promise.all([
        ObtenerBecariosEconomicaXLegajo(legajo),
        ObtenerBecariosServiciosXLegajo(legajo),
        ObtenerBecariosInvestigacionXLegajo(legajo),
      ]);

    return [
      {
        tipo: SCHOLARSHIP_TYPES.ECONOMICA,
        nombre: BS.scholarshipTypeEconomica,
        datos: getFirstRecord(becasEconomicas),
      },
      {
        tipo: SCHOLARSHIP_TYPES.SERVICIO,
        nombre: BS.scholarshipTypeServicio,
        datos: getFirstRecord(becasServicios),
      },
      {
        tipo: SCHOLARSHIP_TYPES.INVESTIGACION,
        nombre: BS.scholarshipTypeInvestigacion,
        datos: getFirstRecord(becasInvestigacion),
      },
    ].filter((beca) => Boolean(beca.datos));
  }

  // Busca un usuario por legajo antes de crear o asignar una beca.
  async function handleBuscarBecarioPorLegajo(legajo) {
    const becario = await ObtenerUsuariosXLegajo(String(legajo).trim());
    return getFirstRecord(becario);
  }

  // Cruza documentos requeridos de becas con tipos de documento y archivos subidos.
  async function handleBuscarDocumentacionBecario(legajo) {
    const [tiposDocumento, documentosSubidos] = await Promise.all([
      obtenerTiposDocumento(),
      listarDocumentacionXLegajo(legajo),
    ]);

    return {
      common: buildDocumentsFromConfig(
        SCHOLARSHIPS_REQUERID_DOCUMENTS,
        tiposDocumento,
        [],
        documentosSubidos ?? [],
      ),
      economic: buildDocumentsFromConfig(
        ECONOMIC_DOCUMENTS,
        tiposDocumento,
        [],
        documentosSubidos ?? [],
      ),
    };
  }

  // Descarga un documento del alumno para que el dialog pueda previsualizarlo.
  async function handleDescargarDocumentacionBecario(id) {
    return descargarDocumentacionXId(id);
  }

  // La API puede devolver nombres con distintas propiedades segun el endpoint.
  const getNombreBecario = (data = {}) =>
    data.nombre_becario ??
    data.nombre_usuario ??
    data.nombre ??
    data.Nombre ??
    data.legajo ??
    "";

  const normalizePreviousBecarioId = (value) => {
    if (value === null || value === undefined || value === "") return null;

    const numberValue = Number(value);
    if (Number.isNaN(numberValue) || numberValue < 0) return null;

    return value;
  };

  // Arma el payload del registro base SAE, separado de las becas especificas.
  const buildBecarioPayload = (data = {}) => ({
    id: data.id ?? 0,
    legajo: data.legajo,
    nombre_becario: getNombreBecario(data),
    alquila: data.alquila ?? false,
    fecha_solicitud: data.fecha_solicitud ?? null,
    aceptado_inicio: Boolean(data.aceptado_inicio),
    puede_pagarle: Boolean(data.puede_pagarle),
    activo: data.activo ?? true,
    anio_beca: data.anio_beca || new Date().getFullYear(),
    id_becario_previo: normalizePreviousBecarioId(data.id_becario_previo),
  });

  // Version estable para comparar contra el snapshot original del dialog.
  const buildBecarioComparablePayload = (data = {}) => ({
    ...buildBecarioPayload(data),
    fecha_solicitud: data.fecha_solicitud ?? null,
  });

  const getBecaId = (beca = {}) => beca.datos?.id ?? beca.id;

  // Payload comun al crear una beca economica, de servicio o investigacion.
  const buildBecaPayload = (beca = {}) => ({
    modulos_asignados: Number(beca.modulos_asignados ?? 0),
  });

  // Lee ids de relaciones guardadas como objeto o como clave plana del formulario.
  const getRelationId = (data = {}, relationName) =>
    data?.[`${relationName}.id`] ?? data?.[relationName]?.id ?? "";

  // Limpia el payload de edicion para que el backend reciba relaciones anidadas.
  const buildEditableBecaPayload = (beca = {}) => {
    const payload = { ...(beca.datos ?? {}) };

    if (beca.tipo === SCHOLARSHIP_TYPES.SERVICIO) {
      const servicioId = getRelationId(payload, "servicio");
      delete payload["servicio.id"];

      if (servicioId) {
        payload.servicio = { ...(payload.servicio ?? {}), id: servicioId };
      }
    }

    if (beca.tipo === SCHOLARSHIP_TYPES.INVESTIGACION) {
      const proyectoId = getRelationId(payload, "proyecto_investigacion");
      delete payload["proyecto_investigacion.id"];

      if (proyectoId) {
        payload.proyecto_investigacion = {
          ...(payload.proyecto_investigacion ?? {}),
          id: proyectoId,
        };
      }
    }

    return payload;
  };

  // Crea la beca especifica asociada al registro base del becario.
  async function crearBecaParaBecario(becarioId, beca = {}) {
    const payload = buildBecaPayload(beca);

    switch (beca.tipo) {
      case SCHOLARSHIP_TYPES.ECONOMICA:
        await CrearBecarioEconomica(becarioId, payload);
        return;
      case SCHOLARSHIP_TYPES.INVESTIGACION:
        await CrearBecarioInvestigacion(
          becarioId,
          beca["proyecto_investigacion.id"] ?? beca.proyecto_investigacion?.id,
          payload,
        );
        return;
      case SCHOLARSHIP_TYPES.SERVICIO:
        await CrearBecarioServicio(
          becarioId,
          beca["servicio.id"] ?? beca.servicio?.id,
          payload,
        );
        return;
      default:
        return;
    }
  }

  // Edita el registro base solo si cambiaron campos generales del becario.
  async function editarBecarioSiCambio(data = {}, originalData = {}) {
    const payload = buildBecarioPayload(data);
    const currentComparable = buildBecarioComparablePayload(data);
    const originalComparable = buildBecarioComparablePayload(originalData);

    if (valuesAreEqual(currentComparable, originalComparable)) return false;

    await EditarBecarioSAE(payload.id, payload);
    return true;
  }

  // Edita una beca especifica solo cuando difiere del snapshot original.
  async function editarBecaSiCambio(beca = {}, originalBeca = {}) {
    if (!beca?.datos || valuesAreEqual(beca.datos, originalBeca?.datos)) {
      return false;
    }

    const becaId = getBecaId(beca);
    if (!becaId) {
      throw new Error(BS.missingScholarshipId(beca.nombre));
    }

    switch (beca.tipo) {
      case SCHOLARSHIP_TYPES.ECONOMICA:
        await EditarBecarioEconomica(becaId, buildEditableBecaPayload(beca));
        return true;
      case SCHOLARSHIP_TYPES.INVESTIGACION:
        await EditarBecarioInvestigacion(
          becaId,
          buildEditableBecaPayload(beca),
        );
        return true;
      case SCHOLARSHIP_TYPES.SERVICIO:
        await EditarBecarioServicio(becaId, buildEditableBecaPayload(beca));
        return true;
      default:
        return false;
    }
  }

  // Recorre todas las becas visibles y devuelve si hubo al menos una edicion.
  async function editarBecasSiCambiaron(becas = [], originalBecas = []) {
    let huboCambios = false;

    for (const beca of becas) {
      const originalBeca = originalBecas.find(
        (item) =>
          item.tipo === beca.tipo && getBecaId(item) === getBecaId(beca),
      );
      const cambioBeca = await editarBecaSiCambio(beca, originalBeca);

      huboCambios = huboCambios || cambioBeca;
    }

    return huboCambios;
  }

  //#endregion

  // Cargas iniciales de los tres bloques principales de la pantalla:
  // proyectos, servicios y becarios.
  const fetchProyectosInvetigacion = useCallback(async () => {
    setLoadingProyectos(true);
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(data);
    } catch (err) {
      setProyectosRows([]);
      console.error(BS.loadResearchProjectsError, err);
    } finally {
      setLoadingProyectos(false);
    }
  }, []);

  const fetchServiciosInternos = useCallback(async () => {
    setLoadingServicios(true);
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(data);
    } catch (err) {
      setServiciosRows([]);
      console.error(BS.loadInternalServicesError, err);
    } finally {
      setLoadingServicios(false);
    }
  }, []);

  const fetchBecariosCompleto = useCallback(async () => {
    setLoadingBecarios(true);
    try {
      const data = await ObtenerBecariosCompleto();
      setBecariosRows(data);
    } catch (err) {
      setBecariosRows([]);
      console.error(BS.loadScholarshipHoldersError, err);
    } finally {
      setLoadingBecarios(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectosInvetigacion();
    fetchServiciosInternos();
    fetchBecariosCompleto();
  }, [
    fetchProyectosInvetigacion,
    fetchServiciosInternos,
    fetchBecariosCompleto,
  ]);

  //#region Becarios
  const [becariosRows, setBecariosRows] = useState([]);
  const [loadingBecarios, setLoadingBecarios] = useState(true);

  const openEditbecario = useCallback(
    (row) => {
      openDialog("becario", "edit", {
        ...row,
        originalData: JSON.parse(JSON.stringify(row)),
      });
    },
    [openDialog],
  );

  const handleEditBecario = useCallback(
    (row) => {
      openEditbecario(row);
    },
    [openEditbecario],
  );

  const becarioActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar Becario",
        onClick: handleEditBecario,
      },
    ],
    [handleEditBecario],
  );

  const becariosColumns = useMemo(
    () => generateColumns(EMPTY_BECARIO, becarioActions),
    [becarioActions],
  );

  const openCreateBecario = useCallback(() => {
    openDialog("becario", "create", {
      ...EMPTY_BECARIO,
      fecha_solicitud: getTodayInputDate(),
    });
  }, [openDialog]);

  const handleSaveBecario = async () => {
    setDialogSaving(true);
    setDialogError("");
    let mensajeSnackbar = BS.saveDefaultSuccess;
    try {
      if (dialogMode === "create") {
        const nuevoBecario = await CrearBecarioSAE(
          buildBecarioPayload(dialogData),
        );
        await crearBecaParaBecario(nuevoBecario.id, dialogData.beca);
        await fetchBecariosCompleto();
      }
      if (dialogMode === "edit") {
        const cambioBecario = await editarBecarioSiCambio(
          dialogData,
          dialogData.originalData ?? dialogData,
        );
        const cambioBeca = await editarBecasSiCambiaron(
          dialogData.becas ?? [],
          dialogData.originalBecas ?? [],
        );
        const nuevaBeca = Boolean(dialogData.beca?.tipo);

        if (nuevaBeca) {
          await crearBecaParaBecario(dialogData.id, dialogData.beca);
        }

        if (cambioBecario || cambioBeca || nuevaBeca) {
          await fetchBecariosCompleto();
          mensajeSnackbar = BS.saveScholarshipHolderUpdated;
        } else {
          mensajeSnackbar = BS.saveNoChanges;
        }
      }

      showNotification(mensajeSnackbar, "success");
    } catch (err) {
      showNotification(err.message || BS.saveError, "error");
      throw err;
    } finally {
      setDialogSaving(false);
      closeDialog();
    }
  };

  //#endregion

  //#region Proyecto
  const [proyectosRows, setProyectosRows] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const openEditProyecto = useCallback(
    (row) => {
      openDialog("proyectos", "edit", row);
    },
    [openDialog],
  );

  const handleEditProyecto = useCallback(
    (row) => {
      openEditProyecto(row);
    },
    [openEditProyecto],
  );

  const proyectoActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: BS.projectDialog.editAction,
        onClick: handleEditProyecto,
      },
    ],
    [handleEditProyecto],
  );

  const proyectosColumns = useMemo(
    () => generateColumns(EMPTY_PROYECTS, proyectoActions),
    [proyectoActions],
  );

  const openCreateProyecto = useCallback(() => {
    openDialog("proyectos", "create", EMPTY_PROYECTS);
  }, [openDialog]);

  const handleSaveProyecto = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      if (dialogMode === "edit") {
        await EditarProyectoInvestigacion(dialogData.id, dialogData);
      }
      if (dialogMode === "create") {
        await CrearProyectoInvestigacion(dialogData);
      }
      await fetchProyectosInvetigacion();
      showNotification(BS.saveGenericSuccess, "success");
    } catch (err) {
      showNotification(err.message || BS.saveError, "error");
      throw err;
    } finally {
      setDialogSaving(false);
      closeDialog();
    }
  };

  //#endregion

  //#region Servicio
  const [serviciosRows, setServiciosRows] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);

  const openEditServicio = useCallback(
    (row) => {
      openDialog("servicio", "edit", row);
    },
    [openDialog],
  );

  const openCreateServicio = useCallback(() => {
    openDialog("servicio", "create", EMPTY_SERVICES);
  }, [openDialog]);

  const handleEditServicio = useCallback(
    (row) => {
      openEditServicio(row);
    },
    [openEditServicio],
  );

  const servicioActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar Servicio",
        onClick: handleEditServicio,
      },
    ],
    [handleEditServicio],
  );

  const serviciosColumns = useMemo(
    () => generateColumns(EMPTY_SERVICES, servicioActions),
    [servicioActions],
  );

  const handleSaveServicios = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      if (dialogMode === "edit") {
        await EditarServicioInterno(dialogData.id, dialogData);
      }
      if (dialogMode === "create") {
        await CrearServicioInterno(dialogData);
      }
      await fetchServiciosInternos();
      showNotification(BS.saveGenericSuccess, "success");
    } catch (err) {
      showNotification(err.message || BS.saveError, "error");
      throw err;
    } finally {
      setDialogSaving(false);
      closeDialog();
    }
  };

  //#endregion

  return (
    <ScholarshipContext.Provider
      value={{
        handleBuscarBecario,
        handleBuscarBecarioPorLegajo,
        handleBuscarDocumentacionBecario,
        handleDescargarDocumentacionBecario,

        proyectosRows,
        proyectosColumns,
        loadingProyectos,
        openCreateProyecto,
        handleSaveProyecto,

        serviciosRows,
        serviciosColumns,
        loadingServicios,
        openCreateServicio,
        handleSaveServicios,

        becariosRows,
        becariosColumns,
        loadingBecarios,
        openCreateBecario,
        handleSaveBecario,
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
}
