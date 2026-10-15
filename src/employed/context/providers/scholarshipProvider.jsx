import { useState, useEffect, useCallback, useMemo } from "react";
import { Chip } from "@mui/material";
import { ScholarshipContext } from "../employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import EditIcon from "@mui/icons-material/Edit";
import { formatDate } from "../../../utils/date.utils";
import {
  ObtenerProyectosInvestigacion,
  ObtenerBecariosCompleto,
  ObtenerServiciosInternos,
  CrearServicioInterno,
  CrearProyectoInvestigacion,
  EditarProyectoInvestigacion,
  EditarServicioInterno,
  ObtenerBecariosEconomicaXIdBecario,
  ObtenerBecariosServiciosXId,
  ObtenerBecariosInvestigacionXIdBecario,
  ObtenerBecariosXLegajo,
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
import { isEmpty } from "../../../utils/text.utils.js";
import {
  isTimeAfter,
  isValidEmail,
  isValidMinLengthPhone,
  isValidPhone,
  isValidText,
} from "../../../utils/validation.utils.js";

const BS = BECAS_STRINGS;

export function ScholarshipProvider({ children }) {
  const {
    showNotification,
    openDialog,
    closeDialog,
    dialogType,
    dialogData,
    dialogMode,
    handleDataChange,
    setDialogError,
    setDialogSaving,
  } = useNotification();

  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const resetValidation = useCallback(() => {
    setFieldErrors({});
    setTouchedFields({});
  }, []);

  const validateField = useCallback(
    (field, value, data = dialogData) => {
      switch (field) {
        case "nombre_proyecto_investigacion":
          if (isEmpty(value)) return BS.projectDialog.validationName;
          return isValidText(value)
            ? ""
            : BS.projectDialog.validationNameFormat;

        case "centro_investigacion":
          if (isEmpty(value)) return BS.projectDialog.validationResearchCenter;
          return isValidText(value)
            ? ""
            : BS.projectDialog.validationResearchCenterFormat;

        case "nombre":
          if (isEmpty(value)) return BS.serviceDialog.validationName;
          return isValidText(value)
            ? ""
            : BS.serviceDialog.validationNameFormat;

        case "nro_telefono":
          if (isEmpty(value)) return BS.serviceDialog.validationPhoneRequired;
          return isValidPhone(value)
            ? ""
            : BS.serviceDialog.validationPhoneFormat;

        case "nro_interno_telefono":
          return !isEmpty(value) && !isValidMinLengthPhone(value, 2)
            ? BS.serviceDialog.validationInternalPhone
            : "";

        case "email_institucional":
          if (isEmpty(value)) return BS.serviceDialog.validationEmailRequired;
          return isValidEmail(value)
            ? ""
            : BS.serviceDialog.validationEmailFormat;

        case "horario_atencion":
          return isEmpty(value) ? BS.serviceDialog.validationOpeningTime : "";

        case "horario_atencion_final":
          if (isEmpty(value)) return BS.serviceDialog.validationClosingTime;
          return isTimeAfter(value, data.horario_atencion)
            ? ""
            : BS.serviceDialog.validationClosingTimeAfterOpening;

        case "student":
          return dialogMode === "create" && !data.nombre_becario
            ? BS.becarioDialog.validationStudentRequired
            : "";

        case "anio_beca":
          if (!value) return BS.becarioDialog.validationYearRequired;
          return /^\d{4}$/.test(String(value))
            ? ""
            : BS.becarioDialog.validationYear;

        case "fecha_solicitud":
          if (!value) return BS.becarioDialog.validationRequestDateRequired;
          return String(value) > getTodayInputDate()
            ? BS.becarioDialog.validationFutureDate
            : "";

        case "beca": {
          if (dialogMode !== "create" && !data.beca?.tipo) return "";
          if (!data.beca?.tipo) {
            return BS.becarioDialog.validationScholarshipType;
          }

          const existingScholarshipTypes = (data.becas ?? []).map(
            (beca) => beca.tipo,
          );

          return existingScholarshipTypes.includes(data.beca.tipo)
            ? BS.becarioDialog.validationDuplicateScholarship
            : "";
        }

        case "modulos_asignados": {
          if (dialogMode !== "create" && !data.beca?.tipo) return "";

          const modules = data.beca?.modulos_asignados;

          return modules === "" ||
            modules === undefined ||
            Number(modules) > 3
            ? BS.becarioDialog.validationModules
            : "";
        }

        case "proyecto_investigacion.id":
          return data.beca?.tipo === SCHOLARSHIP_TYPES.INVESTIGACION &&
            isEmpty(data.beca?.["proyecto_investigacion.id"])
            ? BS.becarioDialog.validationResearchProject
            : "";

        case "servicio.id":
          return data.beca?.tipo === SCHOLARSHIP_TYPES.SERVICIO &&
            isEmpty(data.beca?.["servicio.id"])
            ? BS.becarioDialog.validationInternalService
            : "";

        default:
          return "";
      }
    },
    [dialogData, dialogMode],
  );

  const getRequiredFields = useCallback((type = dialogType) => {
    const fieldsByType = {
      proyectos: [
        "nombre_proyecto_investigacion",
        "centro_investigacion",
      ],
      servicio: [
        "nombre",
        "nro_telefono",
        "nro_interno_telefono",
        "email_institucional",
        "horario_atencion",
        "horario_atencion_final",
      ],
      becario: [
        "student",
        "anio_beca",
        "fecha_solicitud",
        "beca",
        "proyecto_investigacion.id",
        "servicio.id",
        "modulos_asignados",
      ],
    };

    return fieldsByType[type] || [];
  }, [dialogType]);

  const getDialogFieldValue = useCallback((field, data = dialogData) => {
    if (field === "student") return data.nombre_becario;
    if (field === "beca") return data.beca?.tipo;
    if (field === "modulos_asignados") return data.beca?.modulos_asignados;
    if (field === "proyecto_investigacion.id") {
      return data.beca?.["proyecto_investigacion.id"];
    }
    if (field === "servicio.id") return data.beca?.["servicio.id"];

    return data[field];
  }, [dialogData]);

  const getBecarioDialogErrors = useCallback(
    (data = dialogData) => {
      const errors = {};
      const scholarshipType = data.beca?.tipo;

      if (dialogMode === "create" && !data.nombre_becario) {
        errors.student = BS.becarioDialog.validationStudentRequired;
      }

      if (!data.anio_beca) {
        errors.anio_beca = BS.becarioDialog.validationYearRequired;
      } else if (!/^\d{4}$/.test(String(data.anio_beca))) {
        errors.anio_beca = BS.becarioDialog.validationYear;
      }

      if (!data.fecha_solicitud) {
        errors.fecha_solicitud =
          BS.becarioDialog.validationRequestDateRequired;
      } else if (String(data.fecha_solicitud) > getTodayInputDate()) {
        errors.fecha_solicitud = BS.becarioDialog.validationFutureDate;
      }

      if (dialogMode === "create" || scholarshipType) {
        if (!scholarshipType) {
          errors.beca = BS.becarioDialog.validationScholarshipType;
        } else {
          const existingScholarshipTypes = (data.becas ?? []).map(
            (beca) => beca.tipo,
          );

          if (existingScholarshipTypes.includes(scholarshipType)) {
            errors.beca = BS.becarioDialog.validationDuplicateScholarship;
          }

          const modules = data.beca?.modulos_asignados;
          if (
            modules === "" ||
            modules === undefined ||
            Number(modules) > 3
          ) {
            errors.modulos_asignados = BS.becarioDialog.validationModules;
          }

          if (
            scholarshipType === SCHOLARSHIP_TYPES.INVESTIGACION &&
            isEmpty(data.beca?.["proyecto_investigacion.id"])
          ) {
            errors["proyecto_investigacion.id"] =
              BS.becarioDialog.validationResearchProject;
          }

          if (
            scholarshipType === SCHOLARSHIP_TYPES.SERVICIO &&
            isEmpty(data.beca?.["servicio.id"])
          ) {
            errors["servicio.id"] = BS.becarioDialog.validationInternalService;
          }
        }
      }

      (data.becas ?? []).forEach((beca, index) => {
        const baseKey = `becas.${index}`;
        const datos = beca.datos ?? {};
        const modules = datos.modulos_asignados;

        if (
          modules === "" ||
          modules === undefined ||
          Number(modules) > 3
        ) {
          errors[`${baseKey}.modulos_asignados`] =
            BS.becarioDialog.validationModules;
        }

        if (
          beca.tipo === SCHOLARSHIP_TYPES.INVESTIGACION &&
          isEmpty(
            datos["proyecto_investigacion.id"] ??
            datos.proyecto_investigacion?.id
          )
        ) {
          errors[`${baseKey}.proyecto_investigacion.id`] =
            BS.becarioDialog.validationResearchProject;
        }

        if (
          beca.tipo === SCHOLARSHIP_TYPES.SERVICIO &&
          isEmpty(datos["servicio.id"] ?? datos.servicio?.id)
        ) {
          errors[`${baseKey}.servicio.id`] =
            BS.becarioDialog.validationInternalService;
        }
      });

      return errors;
    },
    [dialogData, dialogMode],
  );

  const validateDialog = useCallback(
    (type = dialogType, data = dialogData) => {
      const fields = getRequiredFields(type);
      const errors =
        type === "becario"
          ? getBecarioDialogErrors(data)
          : fields.reduce((result, field) => {
              const message = validateField(
                field,
                getDialogFieldValue(field, data),
                data,
              );
              return message ? { ...result, [field]: message } : result;
            }, {});

      setFieldErrors(errors);
      setTouchedFields(
        fields.reduce((result, field) => ({ ...result, [field]: true }), {}),
      );

      if (Object.keys(errors).length) {
        setDialogError("Revisá los campos marcados antes de guardar.");
        return false;
      }

      setDialogError("");
      return true;
    },
    [
      dialogData,
      dialogType,
      getBecarioDialogErrors,
      getDialogFieldValue,
      getRequiredFields,
      setDialogError,
      validateField,
    ],
  );

  const handleDialogChange = useCallback(
    (field, value) => {
      const previousValue = dialogData[field];
      const emptyEquivalent = isEmpty(previousValue) && isEmpty(value);

      if (previousValue === value || emptyEquivalent) return;

      const nextData = { ...dialogData, [field]: value };
      const message = validateField(field, value, nextData);

      handleDataChange(field, value);
      setTouchedFields((previous) => ({ ...previous, [field]: true }));
      setFieldErrors((previous) => ({
        ...previous,
        [field]: message,
        ...(field === "horario_atencion" &&
          (touchedFields.horario_atencion_final ||
            !isEmpty(nextData.horario_atencion_final)) && {
            horario_atencion_final: validateField(
              "horario_atencion_final",
              nextData.horario_atencion_final,
              nextData,
            ),
          }),
      }));
    },
    [dialogData, handleDataChange, touchedFields, validateField],
  );

  //#region Helpers de becarios

  // Busca las becas especificas de un becario y las normaliza para mostrarlas en tabs.
  async function handleBuscarBecario(idBecario) {
    const [becasEconomicas, becasServicios, becasInvestigacion] =
      await Promise.all([
        ObtenerBecariosEconomicaXIdBecario(idBecario),
        ObtenerBecariosServiciosXId(idBecario),
        ObtenerBecariosInvestigacionXIdBecario(idBecario),
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

  async function handleBuscarUltimoBecarioPorLegajo(legajo) {
    const becarios = await ObtenerBecariosXLegajo(String(legajo).trim());
    return getLatestBecario(becarios);
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
    if (Number.isNaN(numberValue) || numberValue === -1) return null;

    return numberValue;
  };

  const isNewScholarshipHolder = (value) =>
    value === null || value === undefined || Number(value) === -1;

  const scholarshipHolderTypeColumn = useMemo(
    () => ({
      headerName: "Tipo",
      minWidth: 120,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => {
        const isNew = isNewScholarshipHolder(value);

        return (
          <Chip
            size="small"
            label={isNew ? "Nuevo" : "Renovacion"}
            color={isNew ? "success" : "primary"}
            variant={isNew ? "filled" : "outlined"}
          />
        );
      },
    }),
    [],
  );

  const yesNoColumn = useMemo(
    () => ({
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => {
        const isTrue = Boolean(value);

        return (
          <Chip
            size="small"
            label={isTrue ? "Si" : "No"}
            color={isTrue ? "success" : "default"}
            variant={isTrue ? "filled" : "outlined"}
          />
        );
      },
    }),
    [],
  );

  const normalizeBecarioLegajo = (value) => String(value ?? "").trim();

  const getResponseRecord = (value) => {
    if (Array.isArray(value)) return value[0] ?? null;
    if (Array.isArray(value?.data)) return value.data[0] ?? null;
    if (Array.isArray(value?.becario)) return value.becario[0] ?? null;
    if (Array.isArray(value?.result)) return value.result[0] ?? null;
    return value?.data ?? value?.becario ?? value?.result ?? value ?? null;
  };

  const getResponseRecords = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.becario)) return value.becario;
    if (Array.isArray(value?.result)) return value.result;

    const record = getResponseRecord(value);
    return record ? [record] : [];
  };

  const getLatestBecario = (value) =>
    getResponseRecords(value)
      .filter((becario) => becario?.id)
      .sort((a, b) => {
        const yearDiff = Number(b.anio_beca ?? 0) - Number(a.anio_beca ?? 0);
        if (yearDiff) return yearDiff;

        const dateDiff =
          new Date(b.fecha_solicitud ?? 0) - new Date(a.fecha_solicitud ?? 0);
        if (dateDiff) return dateDiff;

        return Number(b.id ?? 0) - Number(a.id ?? 0);
      })[0] ?? null;

  const getBecarioResponseId = (value) => {
    const record = getResponseRecord(value);
    return (
      record?.id ??
      record?.id_becario ??
      record?.becario?.id ??
      record?.data?.id ??
      null
    );
  };

  // Arma el payload del registro base SAE, separado de las becas especificas.
  const buildBecarioPayload = (data = {}) => {
    const legajo = normalizeBecarioLegajo(data.legajo);

    if (!legajo) {
      throw new Error(BS.becarioDialog.validationStudentRequired);
    }

    return {
      id: data.id ?? 0,
      legajo,
      nombre_becario: getNombreBecario(data),
      alquila: data.alquila ?? false,
      fecha_solicitud: data.fecha_solicitud ?? null,
      aceptado_inicio: Boolean(data.aceptado_inicio),
      puede_pagarle: Boolean(data.puede_pagarle),
      activo: data.activo ?? true,
      anio_beca: data.anio_beca || new Date().getFullYear(),
      id_becario_previo: normalizePreviousBecarioId(data.id_becario_previo),
    };
  };

  // Version estable para comparar contra el snapshot original del dialog.
  const buildBecarioComparablePayload = (data = {}) => ({
    ...buildBecarioPayload(data),
    fecha_solicitud: data.fecha_solicitud ?? null,
  });

  const getBecaId = (beca = {}) => beca.datos?.id ?? beca.id;

  // Payload comun al crear una beca economica, de servicio o investigacion.
  const buildBecaPayload = (beca = {}, becario = {}) => ({
    modulos_asignados: Number(beca.modulos_asignados ?? 0),
    legajo: normalizeBecarioLegajo(becario.legajo),
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

      if (!isEmpty(servicioId)) {
        payload.servicio = { ...(payload.servicio ?? {}), id: servicioId };
      }
    }

    if (beca.tipo === SCHOLARSHIP_TYPES.INVESTIGACION) {
      const proyectoId = getRelationId(payload, "proyecto_investigacion");
      delete payload["proyecto_investigacion.id"];

      if (!isEmpty(proyectoId)) {
        payload.proyecto_investigacion = {
          ...(payload.proyecto_investigacion ?? {}),
          id: proyectoId,
        };
      }
    }

    return payload;
  };

  // Crea la beca especifica asociada al registro base del becario.
  async function crearBecaParaBecario(becarioId, beca = {}, becario = {}) {
    const payload = buildBecaPayload(beca, becario);

    if (!becarioId) {
      throw new Error("No se pudo obtener el id del becario creado");
    }

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
      resetValidation();
      openDialog("becario", "edit", {
        ...row,
        originalData: JSON.parse(JSON.stringify(row)),
      });
    },
    [openDialog, resetValidation],
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
    () =>
      generateColumns(EMPTY_BECARIO, becarioActions, {
        id_becario_previo: scholarshipHolderTypeColumn,
        aceptado_inicio: yesNoColumn,
        puede_pagarle: yesNoColumn,
        alquila: yesNoColumn,
        fecha_solicitud: {
          valueFormatter: (value) => formatDate(value, "display"),
        },
      }),
    [becarioActions, scholarshipHolderTypeColumn, yesNoColumn],
  );

  const openCreateBecario = useCallback(() => {
    resetValidation();
    openDialog("becario", "create", {
      ...EMPTY_BECARIO,
      id_becario_previo: null,
      fecha_solicitud: getTodayInputDate(),
    });
  }, [openDialog, resetValidation]);

  const handleSaveBecario = async () => {
    setDialogSaving(true);
    setDialogError("");
    let mensajeSnackbar = BS.saveDefaultSuccess;
    try {
      if (dialogMode === "create") {
        const previousBecarioId = normalizePreviousBecarioId(
          dialogData.id_becario_previo,
        );
        const previousBecario = previousBecarioId
          ? null
          : await handleBuscarUltimoBecarioPorLegajo(dialogData.legajo);
        const becarioPayload = buildBecarioPayload({
          ...dialogData,
          id_becario_previo: previousBecarioId ?? previousBecario?.id ?? null,
        });

        const nuevoBecario = await CrearBecarioSAE(becarioPayload);
        let becarioId = getBecarioResponseId(nuevoBecario);

        if (!becarioId) {
          const becarioExistente = await ObtenerBecariosXLegajo(
            becarioPayload.legajo,
          );
          becarioId = getBecarioResponseId(becarioExistente);
        }

        await crearBecaParaBecario(becarioId, dialogData.beca, becarioPayload);
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
          await crearBecaParaBecario(
            dialogData.id,
            dialogData.beca,
            buildBecarioPayload(dialogData),
          );
        }

        if (cambioBecario || cambioBeca || nuevaBeca) {
          await fetchBecariosCompleto();
          mensajeSnackbar = BS.saveScholarshipHolderUpdated;
        } else {
          mensajeSnackbar = BS.saveNoChanges;
        }
      }

      showNotification(mensajeSnackbar, "success");
      resetValidation();
      closeDialog();
    } catch (err) {
      showNotification(err.message || BS.saveError, "error");
    } finally {
      setDialogSaving(false);
    }
  };

  //#endregion

  //#region Proyecto
  const [proyectosRows, setProyectosRows] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const openEditProyecto = useCallback(
    (row) => {
      resetValidation();
      openDialog("proyectos", "edit", row);
    },
    [openDialog, resetValidation],
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
    resetValidation();
    openDialog("proyectos", "create", EMPTY_PROYECTS);
  }, [openDialog, resetValidation]);

  const handleSaveProyecto = async () => {
    if (!validateDialog("proyectos")) return;

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
      resetValidation();
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
      resetValidation();
      openDialog("servicio", "edit", row);
    },
    [openDialog, resetValidation],
  );

  const openCreateServicio = useCallback(() => {
    resetValidation();
    openDialog("servicio", "create", EMPTY_SERVICES);
  }, [openDialog, resetValidation]);

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
    if (!validateDialog("servicio")) return;

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
      resetValidation();
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
        fieldErrors,
        setFieldErrors,
        validateField,
        validateDialog,
        handleDialogChange,
        resetValidation,

        handleBuscarBecario,
        handleBuscarBecarioPorLegajo,
        handleBuscarUltimoBecarioPorLegajo,
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
