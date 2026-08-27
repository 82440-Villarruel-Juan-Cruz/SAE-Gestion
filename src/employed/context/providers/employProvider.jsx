import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Box, IconButton, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import {
  CrearRegistroUsuario,
  CrearEmpleado,
  ModificarUsuario,
  ObtenerEmpleados,
  ObtenerUsuariosXLegajo,
  ObtenerHorarios,
  BuscarHorariosXEmpleado,
  CrearHorarioEmpleado,
  ModificarHorario,
  EliminarHorario,
} from "../../../api/EmpleadoService";
import {
  obtenerPerfiles,
  obtenerCarreras,
} from "../../../api/HerramientasService";
import {
  mapEmpleadoSAE,
  mapHorarioSAE,
} from "../../../api/formatters/EmpleadoFormatter";

import { EmployContext } from "../employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import {
  generateColumns,
  generateRows,
} from "../../../utils/datagrid.utils.jsx";
import {
  calendarDays,
  carreras as loginCarreras,
} from "../../../utils/common/constants.js";
import {
  EMPTY_FORM,
  EMPTY_EMPLEADO,
  EMPTY_USUARIO,
} from "../../../utils/common/common.config.js";
import { USER_STRINGS } from "../../../utils/strings/employed.strings.js";
import { isEmpty } from "../../../utils/text.utils.js";
import { isTimeAfter } from "../../../utils/validation.utils.js";

const C = USER_STRINGS;

const normalizeCareerValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const mapCareerWithLoginCareer = (backendCareer) => {
  const backendCareerName = normalizeCareerValue(backendCareer?.nombre);
  const loginCareer = loginCarreras.find((career) =>
    backendCareerName.includes(normalizeCareerValue(career.value)),
  );

  return {
    ...backendCareer,
    nombre_carrera: loginCareer?.value ?? "",
  };
};

const isPositiveNumber = (value) =>
  !isEmpty(value) && Number.isFinite(Number(value)) && Number(value) > 0;

const isValidNumber = (value) =>
  !isEmpty(value) && Number.isFinite(Number(value));

export const AdminUsersProvider = ({ children }) => {
  // Estados globales de Diálogo compartidos por ambas secciones
  const {
    showNotification,
    dialogData,
    dialogType,
    dialogMode,
    dialogError,
    setDialogError,
    setDialogSaving,
    openDialog,
    closeDialog,
  } = useNotification();

  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const resetValidation = () => {
    setFieldErrors({});
    setTouchedFields({});
  };
  const validateField = (field, value, data = dialogData) => {
    switch (true) {
      case field === "id":
        return dialogMode === "edit" && isEmpty(value) ? C.validationID : "";
      case field === "legajo":
        return isEmpty(value) ? C.validationStudentID : "";
      case field.includes("nombre") || field.includes("apellido"):
        return isEmpty(value) ? C.validationNames : "";
      case field === "activo":
        return isEmpty(value) ? C.validationActive : "";
      case field === "id_perfil":
        return isPositiveNumber(value) ? "" : C.validationProfile;
      case field === "nombre_carrera":
        return isEmpty(value) ? C.validationDegree : "";
      case field === "id_especialidad":
        return isPositiveNumber(value) ? "" : C.validationDegree;
      case field === "id_carrera":
        return isPositiveNumber(value) ? "" : C.validationDegree;
      //Exclusivos de horarios:
      case field === "hora_inicio":
        return isEmpty(value) ? C.validationOpeningTime : "";
      case field === "hora_fin":
        if (isEmpty(value)) return C.validationClosingTime;
        return isTimeAfter(value, data.hora_inicio)
          ? ""
          : C.validationClosingTimeAfterOpening;
      case field === "dia":
        return isValidNumber(value) ? "" : C.validationDay;
      case field === "id_empleado":
        return isPositiveNumber(value) ? "" : C.validationEmploy;
      default:
        return data ? C.validationActive : "";
    }
  };
  const validate = (data = dialogData) => {
    const fields =
      dialogType === "empleados"
        ? [
            "id",
            "legajo",
            "nombre_empleado",
            "nombre_usuario",
            "nombres",
            "apellidos",
            "activo",
            "id_perfil",
          ]
        : [
            "id",
            "legajo",
            "nombres",
            "apellidos",
            "activo",
            "id_perfil",
            "nombre_carrera",
            "id_especialidad",
          ]; //Depende el objeto es el tipo de estructura

    const errors = fields.reduce((result, field) => {
      const message = validateField(field, data[field], data);
      return message ? { ...result, [field]: message } : result;
    }, {});
    setFieldErrors(errors);
    setTouchedFields(
      fields.reduce((result, field) => ({ ...result, [field]: true }), {}),
    );
    return Object.keys(errors).length === 0;
  };
  //Hoy se me rompio absolutamente todo en provincia asi que me doy el lujo de duplicar el codigo para hacer codigo menos enrevesado
  //Lo tengo que pedir lo se...
  const validateSchedule = ({ includeId = false } = {}) => {
    const fields = includeId
      ? ["id", "hora_inicio", "hora_fin", "dia"]
      : ["hora_inicio", "hora_fin", "dia"];

    const errors = fields.reduce((result, field) => {
      // CORRECCIÓN 1: Buscamos el valor en 'form', que es el que tiene los datos reales
      const valorActual = form[field];

      // CORRECCIÓN 2: Le pasamos 'form' como tercer parámetro para que actúe como "data"
      const message = validateField(field, valorActual, form);

      return message ? { ...result, [field]: message } : result;
    }, {});

    if (!selectedEmploy?.id) {
      errors.id_empleado = C.validationEmploy;
    }

    setFieldErrors(errors);
    setTouchedFields(
      [...fields, "id_empleado"].reduce(
        (result, field) => ({ ...result, [field]: true }),
        {},
      ),
    );

    return Object.keys(errors).length === 0;
  };

  const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);

  const [perfiles, setPerfiles] = useState([]);
  const fetchPerfiles = useCallback(async () => {
    try {
      const data = await obtenerPerfiles();
      setPerfiles(data);
    } catch {
      setPerfiles([]);
    }
  }, []);

  useEffect(() => {
    fetchPerfiles();
  }, [fetchPerfiles]);

  const [carreras, setCarreras] = useState([]);
  const fetchCarreras = useCallback(async () => {
    try {
      const data = await obtenerCarreras();
      setCarreras(
        Array.isArray(data) ? data.map(mapCareerWithLoginCareer) : [],
      );
    } catch {
      setCarreras([]);
    }
  }, []);

  useEffect(() => {
    fetchCarreras();
  }, [fetchCarreras]);

  // Estados de Notificación

  // --- SECCIÓN EMPLEADOS ---
  const [empleados, setEmpleados] = useState([]);
  const [empleadosRows, setEmpleadosRows] = useState([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  const fetchEmpleados = useCallback(async () => {
    setLoadingEmpleados(true);
    try {
      let data = await ObtenerEmpleados();
      data = data.map(mapEmpleadoSAE);
      setEmpleados(data);
      setEmpleadosRows(generateRows(data));
    } catch {
      setEmpleadosRows([]);
    } finally {
      setLoadingEmpleados(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const openCreateEmpleados = useCallback(() => {
    resetValidation();
    openDialog("empleados", "create", {
      id: "",
      legajo: "",
      nombre_empleado: "",
      nombres: "",
      apellidos: "",
      activo: true,
      id_perfil: "",
      nombre_perfil: "",
    });
  }, [openDialog]);

  const openEditEmpleados = useCallback(
    (row) => {
      resetValidation();
      openDialog("empleados", "edit", {
        id: row.id,
        legajo: row.legajo,
        nombre_empleado: row.nombre_empleado,
        nombres: row.nombres,
        apellidos: row.apellidos,
        activo: row.activo,
        id_perfil: row.id_perfil,
        nombre_perfil: row.nombre_perfil,
      });
    },
    [openDialog],
  );

  const handleEmpleadosSave = async () => {
    if (!validate()) return;
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id } = dialogData;
      let id_nuevo = id === "" ? 0 : id;
      const body = {
        id: id_nuevo,
        legajo: dialogData.legajo,
        nombre_usuario: dialogData.nombre_usuario || dialogData.nombre_empleado,
        id_perfil: dialogData.id_perfil,
        activo: dialogMode === "create" ? true : dialogData.activo,
      }; //Cuando lo doy de alta siempre es activo

      if (dialogMode === "create") {
        await CrearEmpleado(body, dialogData.nombres, dialogData.apellidos);
      } else if (dialogMode === "edit") {
        await ModificarUsuario(id_nuevo, body);
      }
      closeDialog();
      fetchEmpleados();
      showNotification(
        dialogMode === "create" ? C.userCreatedMsg : C.userUpdatedMsg,
        "success",
      );
    } catch (err) {
      setDialogError(err.message || C.userErrorMsg);
    } finally {
      setDialogSaving(false);
      resetValidation();
    }
  };

  // --- SECCIÓN USUARIOS (ESTUDIANTES) ---
  const [estudianteBuscado, setEstudiante] = useState();
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const fetchUsuariosXLegajo = useCallback(async (legajo) => {
    if (!legajo) {
      setEstudiante(null);
      return;
    }
    let data = null;
    setLoadingUsuarios(true);
    try {
      data = await ObtenerUsuariosXLegajo(legajo);
    } catch {
      setEstudiante(null);
    } finally {
      setLoadingUsuarios(false);
    }
    return data;
  }, []);

  useEffect(() => {
    fetchUsuariosXLegajo();
  }, [fetchUsuariosXLegajo]);

  const openCreateUsuarios = useCallback(() => {
    openDialog("usuarios", "create", {
      id: "",
      legajo: "",
      nombre_usuario: "",
      nombres: "",
      apellidos: "",
      id_perfil: 1,
      activo: true,
      id_especialidad: "",
      nombre_carrera: "",
    });
  }, [openDialog]);

  const handleUsuariosSave = async (dataOverride = null) => {
    const isOverrideData =
      dataOverride &&
      typeof dataOverride === "object" &&
      !("nativeEvent" in dataOverride);
    const sourceData = isOverrideData ? dataOverride : dialogData;
    const idEspecialidad =
      sourceData.id_especialidad ?? sourceData.idEspecialidad ?? "";
    const data = {
      ...sourceData,
      id_especialidad: idEspecialidad,
    };
    if (!isOverrideData && !validate(data)) return;
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id } = data;
      let id_nuevo = id === "" ? 0 : id;
      const nombreUsuario =
        data.nombre_usuario ||
        data.nombre_empleado ||
        [data.nombres, data.apellidos].filter(Boolean).join(" ").trim();
      const legajoBase = String(data.legajo ?? "").trim();
      const nombreCarrera = String(data.nombre_carrera ?? "").trim();
      const dominioUsuario =
        nombreCarrera === "frc"
          ? "utn.edu.ar"
          : `${nombreCarrera}.${C.dominio}`;
      const legajoUsuario =
        legajoBase.includes("@") || !nombreCarrera
          ? legajoBase
          : `${legajoBase}@${dominioUsuario}`;
      const usuarioBody = {
        legajo: legajoUsuario,
        nombre_usuario: nombreUsuario,
        id_perfil: data.id_perfil,
        id_especialidad: idEspecialidad,
        activo: data.activo,
      };

      if (isOverrideData || dialogMode === "edit") {
        const body = {
          id: id_nuevo,
          ...usuarioBody,
        };
        await ModificarUsuario(data.id, body);
      } else if (dialogMode === "create") {
        await CrearRegistroUsuario(
          usuarioBody,
          data.nombres,
          data.apellidos,
          idEspecialidad,
        );
        closeDialog();
      }

      showNotification(
        dialogMode === "create" ? C.userCreatedMsg : C.userUpdatedMsg,
        "success",
      );
    } catch (err) {
      if (dialogMode === "create")
        setDialogError(err.message || C.userErrorMsg);
      else showNotification(C.userErrorUpdateMsg, "error");
    } finally {
      setDialogSaving(false);
      resetValidation();
    }
  };

  //---- HORARIOS ---- //
  const [allHorarios, setAllHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(true);

  const [selectedEmploy, setSelectedEmploy] = useState(null);
  const [selectedHorarios, setSelectedHorarios] = useState([]);
  const [selectedHorariosLoading, setSelectedHorariosLoading] = useState(false);
  const [showNuevoForm, setShowNuevoForm] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const handleChangeForm = (field, value, options = {}) => {
    const previousValue = form?.[field];

    // 1. Evita renderizados innecesarios si el valor no cambió
    const emptyEquivalent = isEmpty(previousValue) && isEmpty(value);
    if (previousValue === value || emptyEquivalent) return;

    // 2. Actualiza los datos locales del diálogo
    setForm((prev) => ({ ...prev, [field]: value }));

    // Extraction de los controladores opcionales desde las opciones
    const { setTouched, setErrors, validateFn } = options;

    // 3. Ejecuta la lógica externa solo si se pasaron los controladores
    if (setTouched && setErrors && validateFn) {
      setTouched((previous) => ({ ...previous, [field]: true }));

      setErrors((previous) => {
        const nextData = { ...form, [field]: value };
        return {
          ...previous,
          [field]: validateFn(field, value, nextData),
        };
      });
    }
  };
  const [savingHorario, setSavingHorario] = useState(false);
  const [errorHorario, setErrorHorario] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHorarios = useCallback(async () => {
    setLoadingHorarios(true);
    try {
      let data = await ObtenerHorarios();
      data = data.map(mapHorarioSAE);
      setAllHorarios(data);
    } catch {
      setDialogError(C.scheduleGetError);
      setAllHorarios([]);
    } finally {
      setLoadingHorarios(false);
    }
  }, [setDialogError]);
  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  const fetchHorariosXEmpleado = useCallback(async () => {
    setSelectedHorariosLoading(true);
    setDialogError(null);
    //Todo esto es para que no guarde informacion en las tarjetas
    setForm(EMPTY_FORM);
    setDeleteId(null);
    setEditingId(null);
    try {
      if (selectedEmploy) {
        let data = await BuscarHorariosXEmpleado(selectedEmploy.id);
        data = data.map(mapHorarioSAE);
        setSelectedHorarios(data);
      } else {
        setSelectedHorarios([]);
      }
    } catch {
      setDialogError(C.scheduleGetError);
      setSelectedHorarios([]);
    } finally {
      setSelectedHorariosLoading(false);
    }
  }, [selectedEmploy, setSelectedHorarios, setDialogError]);

  useEffect(() => {
    fetchHorariosXEmpleado();
  }, [fetchHorariosXEmpleado]);

  const handleEmployChange = useCallback(
    (_e, value) => {
      setSelectedEmploy(value);
      setSelectedHorarios([]);
      setShowNuevoForm(false);
      if (value) fetchHorariosXEmpleado(value.id);
    },
    [fetchHorariosXEmpleado],
  );

  const handleHorarioSaved = useCallback(() => {
    if (selectedEmploy) fetchHorariosXEmpleado(selectedEmploy.id);
  }, [selectedEmploy, fetchHorariosXEmpleado]);

  const handleHorarioCreated = useCallback(() => {
    setShowNuevoForm(false);
    if (selectedEmploy) fetchHorariosXEmpleado(selectedEmploy.id);
  }, [selectedEmploy, fetchHorariosXEmpleado]);

  const handleClose = () => {
    setSelectedEmploy(null);
    setSelectedHorarios([]);
    setShowNuevoForm(false);
    setHorariosDialogOpen(false);
  };

  const handleCreateHorario = async () => {
    if (!validateSchedule()) return;
    setSavingHorario(true);
    setErrorHorario("");
    try {
      const body = {
        id: 0,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        dia: form.dia,
        id_empleado: selectedEmploy.id,
        nombre_empleado_atencion: selectedEmploy.nombre_empleado,
      };

      await CrearHorarioEmpleado(body);
      fetchHorarios();
      setShowNuevoForm(false);
      fetchHorariosXEmpleado(selectedEmploy.id);
      setHorariosDialogOpen(false);
    } catch (err) {
      setErrorHorario(err.message || C.userErrorMsg);
    } finally {
      setSavingHorario(false);
      resetValidation();
    }
  };
  const handleEditHorario = async () => {
    if (!validateSchedule({ includeId: true })) return;
    //Son todas cosas que queremos mostrar antes de ejecutar una query asincrona
    setSavingHorario(true);
    setErrorHorario("");

    try {
      const body = {
        id: form.id,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        dia: form.dia,
        id_empleado: selectedEmploy.id,
        nombre_empleado_atencion: selectedEmploy.nombre_empleado,
      };

      await ModificarHorario(form.id, body);
      setEditingId(null);
      fetchHorarios();
      fetchHorariosXEmpleado(selectedEmploy.id);
      setForm(null);
    } catch (err) {
      setErrorHorario(err.message || C.userErrorMsg);
    } finally {
      setSavingHorario(false);
      resetValidation();
    }
  };
  const handleDeleteHorario = async () => {
    if (isPositiveNumber(deleteId)) {
      try {
        await EliminarHorario(deleteId);
        setForm(null);
        setDeleteId(null);
        fetchHorarios();
        fetchHorariosXEmpleado(selectedEmploy.id);
        setConfirmDelete(false);
      } catch (err) {
        setConfirmDelete(false);
        setErrorHorario(err.message || C.userErrorMsg);
      }
    } else {
      showNotification("No se encuentra el ID para eliminar", "error");
    }
  };
  const handleCancelHorario = () => {
    setForm(null);
    setEditingId(null);
    setErrorHorario("");
  };
  // --- COLUMNAS MEMORIZADAS --- //
  /* Se crean los handle con el hook de useCallBack y despues los agregamos a una serie de acciones*/
  const handleOpenEditEmploy = useCallback(
    (row) => {
      openEditEmpleados(row);
    },
    [openEditEmpleados],
  );

  const employActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar Empleado",
        onClick: handleOpenEditEmploy,
      },
    ],
    [handleOpenEditEmploy],
  );

  const empleadosColumns = useMemo(() => {
    return generateColumns(EMPTY_EMPLEADO, employActions);
  }, [employActions]);

  return (
    <EmployContext.Provider
      value={{
        //Valores crudos de los endpoings
        empleados,
        carreras,
        perfiles,
        allHorarios,
        //Valores para las tablas y funciones de guardado Empleados y Usuarios
        empleadosRows,
        empleadosColumns,
        loadingEmpleados,
        openCreateEmpleados,
        estudianteBuscado,
        setEstudiante,
        loadingUsuarios,
        openCreateUsuarios,
        handleUsuariosSave,
        handleEmpleadosSave,
        fetchUsuariosXLegajo,
        //Valores para la seccion de horarios
        loadingHorarios,
        horariosDialogOpen,
        setHorariosDialogOpen,
        selectedHorariosLoading,
        selectedHorarios,
        selectedEmploy,
        setSelectedEmploy,

        handleEmployChange,
        handleHorarioSaved,
        handleHorarioCreated,
        handleClose,
        showNuevoForm,
        setShowNuevoForm,
        form,
        setForm,
        handleChangeForm,
        calendarDays,
        savingHorario,
        errorHorario,
        setErrorHorario,
        handleCreateHorario,
        handleEditHorario,
        handleDeleteHorario,
        handleCancelHorario,
        editingId,
        setEditingId,
        confirmDelete,
        deleteId,
        setDeleteId,
        setConfirmDelete,
        //Valores de error, mostrar mensajes, etc.
        dialogType,
        dialogError,
        fieldErrors,
        touchedFields,
        setFieldErrors,
        setTouchedFields,
        validateField,
      }}
    >
      {children}
    </EmployContext.Provider>
  );
};
