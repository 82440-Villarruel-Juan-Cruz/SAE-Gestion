//#region Importaciones
import { useState, useCallback, useEffect, useMemo } from "react";
import { Box, IconButton, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  generateColumns,
  generateRows,
} from "../../../utils/datagrid.utils.jsx";
import {
  CrearCurso,
  CrearEspecialidad,
  CrearPersonal,
  ModificarCurso,
  ModificaEspecialidad,
  ModificarPersonal,
  ObtenerCursosMedicos,
  ObtenerEspecialidades,
  ObtenerEstadosTurno,
  ObtenerPersonalMedico,
  EliminarCursoMedico,
  ObtenerHorariosCompleto,
  ObtenerHorariosXCUIL,
  CrearHorario,
  ModificarHorario,
  EliminarHorario,
  ObtenerTurnos,
  RegistrarFalta,
  ObtenerFaltasXCUIL,
  CrearTurnos,
  ModificarTurno,
  ObtenerTurnosActivos,
  ObtenerTurnosFinalizados,
  ObtenerTurnosCancelados,
} from "../../../api/SaludService";
import {
  mapCursoMedico,
  mapHorarioSalud,
  mapPersonalMedico,
  mapEstado,
  mapTurnos,
} from "../../../api/formatters/SaludFormatters";
import { ObtenerUsuariosXLegajo } from "../../../api/EmpleadoService";
import { HealthContext } from "../employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import {
  EMPTY_CURSO,
  EMPTY_ESPECIALIDAD,
  EMPTY_FALTA,
  EMPTY_HORARIO,
  EMPTY_PERSONAL,
  EMPTY_TURNO,
} from "../../../utils/common/common.config.js";
import { compareDatesDesc, toTimeInput } from "../../../utils/date.utils";
import { HEALTH_STRING } from "../../../utils/strings/employed.strings.js";

// #endregion

const C = HEALTH_STRING;
const CANCELLED_TURN_STATUS_ID = 2;
const getEmptyHorarioForm = () => ({
  ...EMPTY_HORARIO,
  dia: 1,
  activo: true,
});
const parseHorarioMinutes = (time) => {
  const [hours, minutes] = String(time ?? "")
    .slice(0, 5)
    .split(":")
    .map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const validateHorarioRange = ({ dia, hora_inicio, hora_fin } = {}) => {
  if (dia === null || dia === undefined || dia === "") {
    return "Seleccioná un día.";
  }
  if (!hora_inicio) return "Ingresá la hora de inicio.";
  if (!hora_fin) return "Ingresá la hora de fin.";

  const startMinutes = parseHorarioMinutes(hora_inicio);
  const endMinutes = parseHorarioMinutes(hora_fin);

  if (
    startMinutes !== null &&
    endMinutes !== null &&
    endMinutes <= startMinutes
  ) {
    return "La hora de fin debe ser posterior al inicio.";
  }

  return "";
};

const sortTurnosByFechaAtencionDesc = (turnos) =>
  [...turnos].sort((a, b) =>
    compareDatesDesc(a?.fecha_atencion, b?.fecha_atencion),
  );

const hasTurnValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const hasCompleteTurnDataForMove = (turno) =>
  [
    turno?.legajo,
    turno?.paciente,
    turno?.asunto,
    turno?.cuil_medico,
    turno?.fecha_atencion,
    turno?.hora_atencion,
  ].every(hasTurnValue);

const canMoveTurnToState = (turno, nextStateId) =>
  nextStateId === CANCELLED_TURN_STATUS_ID || hasCompleteTurnDataForMove(turno);

const getEmptyTurnForm = () => ({
  ...EMPTY_TURNO,
  cuil_medico: "",
  id_especialidad: null,
  especialista: "",
});

export const HealthUsersProvider = ({ children }) => {
  //#region Importaciones Notificacion

  const {
    showNotification,
    openDialog,
    dialogData,
    dialogMode,
    setDialogOpen,
    setDialogData,
    setDialogError,
    setDialogSaving,
  } = useNotification();

  //#endregion

  // Estados globales de Diálogo compartidos por ambas secciones
  const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);
  // Estados de Notificación

  //ESTADOS
  const [estadosTurno, setEstados] = useState([]);
  const fetchEstadosTurno = useCallback(async () => {
    try {
      const data = await ObtenerEstadosTurno();

      setEstados(data.map(mapEstado));
    } catch {
      setEstados([]);
    }
  }, []);

  useEffect(() => {
    fetchEstadosTurno();
  }, [fetchEstadosTurno]);

  // TURNOS MEDICOS
  const [allTurnos, setAllTurnos] = useState([]);
  const [pendienteTurnos, setPendienteTurnos] = useState([]); //ID:0
  const [asignadoTurnos, setAsignadosTurnos] = useState([]); //ID:1
  const [enCursoTurnos, setEnCursoTurnos] = useState([]); //ID:2
  const [finalizadoTurnos, setFinalizadoTurnos] = useState([]); //ID:3
  const [canceladoTurnos, setCanceladoTurnos] = useState([]); //ID:4
  const [reprogramadoTurnos, setReprogramadoTurnos] = useState([]); //ID:5
  const [loadingTurnos, setLoadingTurnos] = useState(false);

  //Para visuaizar los turnos pasados
  const [loadingNoActivos, setLoadingNoActivos] = useState(false);
  const [noActivosRows, setNoActivosRows] = useState([]);

  const openCreateTurnos = useCallback(() => {
    setUsuarioSelected(null);
    openDialog("turnos", "create", getEmptyTurnForm());
  }, [openDialog]);

  const openEditTurnos = useCallback(
    (row) => {
      openDialog("turnos", "edit", row);
    },
    [openDialog],
  );

  const fetchTurnosFinalizados = useCallback(async () => {
    setLoadingNoActivos(true);
    try {
      let data = await ObtenerTurnosFinalizados();
      setNoActivosRows(generateRows(data.map(mapTurnos)));
    } catch {
      setNoActivosRows([]);
    } finally {
      setLoadingNoActivos(false);
    }
  }, []);

  const fetchTurnosCancelados = useCallback(async () => {
    setLoadingNoActivos(true);
    try {
      let data = await ObtenerTurnosCancelados();
      setNoActivosRows(generateRows(data.map(mapTurnos)));
    } catch {
      setNoActivosRows([]);
    } finally {
      setLoadingNoActivos(false);
    }
  }, []);

  const openShowNoActivos = useCallback(
    (type) => {
      setNoActivosRows([]);
      if (type === "cancelados") fetchTurnosCancelados();
      else fetchTurnosFinalizados();
    },
    [fetchTurnosCancelados, fetchTurnosFinalizados],
  );

  const fetchTurnosMedicos = useCallback(async () => {
    setLoadingTurnos(true);
    try {
      let data = await ObtenerTurnosActivos();
      data = data.map(mapTurnos);
      console.log("Fetched turnos:", data); // Debugging line

      setAllTurnos(sortTurnosByFechaAtencionDesc(data));

      // 1. Crear arrays temporales vacíos
      const pendientes = [];
      const asignados = [];
      const enCurso = [];
      const finalizados = [];
      const cancelados = [];
      const reprogramados = []; //No los deberia setear a finalizado y cancelado

      data.forEach((turno) => {
        // Reemplaza 'turno.idEstado' por la propiedad real de tu objeto (ej. turno.estadoId)
        switch (turno.id_estado_turno) {
          case 0:
            pendientes.push(turno);
            break;
          case 1:
            asignados.push(turno);
            break;
          case 2:
            cancelados.push(turno);
            break;
          case 3:
            enCurso.push(turno);
            break;
          case 4:
            finalizados.push(turno);
            break;
          case 5:
            reprogramados.push(turno);
            break;
          default:
            break; // Por si llega un ID desconocido
        }
      });
      setPendienteTurnos(sortTurnosByFechaAtencionDesc(pendientes));
      setAsignadosTurnos(sortTurnosByFechaAtencionDesc(asignados));
      setEnCursoTurnos(sortTurnosByFechaAtencionDesc(enCurso));
      setFinalizadoTurnos(sortTurnosByFechaAtencionDesc(finalizados));
      setCanceladoTurnos(sortTurnosByFechaAtencionDesc(cancelados));
      setReprogramadoTurnos(sortTurnosByFechaAtencionDesc(reprogramados));
    } catch {
      setPendienteTurnos([]);
      setAsignadosTurnos([]);
      setEnCursoTurnos([]);
      setFinalizadoTurnos([]);
      setCanceladoTurnos([]);
      setReprogramadoTurnos([]);
    } finally {
      setLoadingTurnos(false);
    }
  }, []);

  useEffect(() => {
    fetchTurnosMedicos();
  }, [fetchTurnosMedicos]);

  const [usuarioSelected, setUsuarioSelected] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(false);

  const fetchUsuariosXlegajo = useCallback(
    async (legajo) => {
      if (!legajo) return; // Evita buscar si está vacío
      setLoadingUsuario(true);
      setUsuarioSelected(null);
      try {
        const data = await ObtenerUsuariosXLegajo(legajo);
        if (data && data.legajo) {
          setUsuarioSelected(data);
        } else {
          setUsuarioSelected(null);
          setDialogError("Usuario No encontrado");
        }
      } catch {
        setUsuarioSelected(null);
        setDialogError("Usuario No encontrado");
      } finally {
        setLoadingUsuario(false);
      }
    },
    [setDialogError],
  );

  useEffect(() => {
    fetchUsuariosXlegajo();
  }, [fetchUsuariosXlegajo]);

  // SON LAS FUNCIONES PARA EL CONTRO LE TURNOS

  // Envolvemos handleValidation en useCallback para que no cambie en cada render
  const handleValidation = useCallback(() => {
    if (dialogData.id_estado_turno >= 0 && dialogMode) {
      if (dialogMode === "edit" && (!dialogData?.id || dialogData.id < 0))
        return false;
      if (
        dialogData?.legajo?.trim() === "" ||
        dialogData?.asunto?.trim() === ""
      )
        return false;

      // Validaciones para estados específicos (Asignado, En Curso, Finalizado, Reprogramado)
      if ([1, 2, 3, 5].includes(dialogData.id_estado_turno)) {
        if (
          !dialogData?.cuil_medico?.trim() ||
          !dialogData?.fecha_atencion?.trim() ||
          !dialogData?.hora_atencion?.trim()
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }, [dialogData, dialogMode]);

  const handleTurnosChangeState = useCallback(
    async (id_turno_raw, id_estado_nuevo) => {
      setDialogError("");

      // 1. Forzar que el ID sea siempre numérico para evitar fallas de tipos
      const id_turno = Number(id_turno_raw);

      try {
        const foundTurn = allTurnos.find((item) => item.id === id_turno);

        // Validaciones iniciales
        if (!foundTurn || foundTurn.id_estado_turno === id_estado_nuevo) return;

        if (!canMoveTurnToState(foundTurn, id_estado_nuevo)) {
          showNotification(C.turnsMoveMissingData, "warning", 3500);
          return;
        }

        const nombreActual = estadosTurno.find(
          (item) => item.id_estado_turno === id_estado_nuevo,
        );

        // 2. Construir el objeto de actualización de forma INMUTABLE (con copia)
        const turnoActualizado = {
          ...foundTurn,
          id_estado_turno: id_estado_nuevo,
          estado: nombreActual.estado_turno,
        };

        const body = {
          id: id_turno,
          cuil_medico: foundTurn.cuil_medico,
          especialista: foundTurn.especialista,
          legajo: foundTurn.legajo,
          paciente: foundTurn.paciente,
          fecha_solicitud: foundTurn.fecha_solicitud
            ? `${foundTurn.fecha_solicitud}T00:00:00`
            : new Date(),
          fecha_atencion: foundTurn.fecha_atencion
            ? `${foundTurn.fecha_atencion}T00:00:00`
            : new Date(),
          hora_atencion:
            foundTurn.hora_atencion?.trim() === ""
              ? null
              : foundTurn.hora_atencion?.trim(),
          asunto: foundTurn.asunto,
          estadosTurno: {
            id: id_estado_nuevo,
            estado_turno: "indiferente",
          },
        };

        // Helper corregido para usar comparaciones numéricas estrictas (id_turno)
        const actualizarListaPorEstado = (estado, operacion, turno) => {
          const selector =
            operacion === "sacar"
              ? (prev) => prev.filter((t) => t.id !== id_turno)
              : (prev) => sortTurnosByFechaAtencionDesc([...prev, turno]);

          switch (estado) {
            case 0:
              setPendienteTurnos(selector);
              break;
            case 1:
              setAsignadosTurnos(selector);
              break;
            case 2:
              setCanceladoTurnos(selector);
              break;
            case 3:
              setEnCursoTurnos(selector);
              break;
            case 4:
              setFinalizadoTurnos(selector);
              break;
            case 5:
              setReprogramadoTurnos(selector);
              break;
            default:
              console.warn(`Estado no reconocido: ${estado}`);
          }
        };

        const estadoAnterior = foundTurn.id_estado_turno;

        // 3. CAMBIO VISUAL OPTIMISTA (Usando el objeto inmutable nuevo)
        actualizarListaPorEstado(estadoAnterior, "sacar");
        actualizarListaPorEstado(id_estado_nuevo, "agregar", turnoActualizado);

        // Actualizar la lista global en memoria
        setAllTurnos((prev) =>
          sortTurnosByFechaAtencionDesc(
            prev.map((t) => (t.id === id_turno ? turnoActualizado : t)),
          ),
        );

        // 4. PETICIÓN A LA API
        try {
          await ModificarTurno(id_turno, body);
          showNotification("Turno Actualizado!", "success");
        } catch {
          // REVERTIMOS SI FALLA LA API (Devolvemos el foundTurn original)
          actualizarListaPorEstado(id_estado_nuevo, "sacar");
          actualizarListaPorEstado(estadoAnterior, "agregar", foundTurn);
          setAllTurnos((prev) =>
            sortTurnosByFechaAtencionDesc(
              prev.map((t) => (t.id === id_turno ? foundTurn : t)),
            ),
          );

          showNotification(
            "Error al guardar en el servidor. El cambio fue revertido.",
            "error",
          );
        }
      } catch (err) {
        setDialogError(err.message || "Ocurrió un error al guardar");
        showNotification("Ocurrió un error al guardar", "error", 2000);
      }
    },
    [
      allTurnos,
      estadosTurno,
      setDialogError,
      setPendienteTurnos,
      setAsignadosTurnos,
      setEnCursoTurnos,
      setFinalizadoTurnos,
      setCanceladoTurnos,
      setReprogramadoTurnos,
      setAllTurnos,
      showNotification,
    ],
  );
  const handleTurnosSave = useCallback(async () => {
    setDialogSaving(true);
    setDialogError("");

    try {
      if (dialogMode === "create" && !usuarioSelected) {
        setDialogError("Sin paciente asignado");
        setDialogSaving(false);
        return;
      }
      if (dialogData.id_estado_turno === 1 && !handleValidation()) {
        setDialogError(C.turnsMoveMissingData);
        setDialogSaving(false);
        return;
      }

      const id_nuevo = dialogData.id === "" ? 0 : Number(dialogData.id);
      const hoy = new Date();
      const ISO = hoy.toLocaleDateString("sv-SE");

      // Construcción del objeto que se enviará al servidor
      const body = {
        id: id_nuevo,
        cuil_medico:
          String(dialogData.cuil_medico ?? "").trim() === ""
            ? null
            : dialogData.cuil_medico,
        especialista: dialogData.especialista,
        legajo:
          dialogMode === "create" ? usuarioSelected.legajo : dialogData.legajo,
        paciente:
          dialogMode === "create"
            ? usuarioSelected.nombre_usuario
            : dialogData.paciente,
        fecha_solicitud:
          dialogMode === "create"
            ? `${ISO}T00:00:00`
            : dialogData.fecha_solicitud
              ? `${dialogData.fecha_solicitud}T00:00:00`
              : new Date(),
        fecha_atencion: dialogData.fecha_atencion
          ? `${dialogData.fecha_atencion}T00:00:00`
          : null,
        hora_atencion:
          dialogData.hora_atencion.trim() === ""
            ? null
            : dialogData.hora_atencion.trim(),
        asunto: dialogData.asunto,
        estadosTurno: {
          id: dialogData.id_estado_turno,
          estado_turno: "indiferente",
        },
      };

      // Helper para inyectar/remover turnos de los estados locales de React
      const actualizarListaPorEstado = (estado, operacion, turno) => {
        const selector =
          operacion === "sacar"
            ? (prev) => prev.filter((t) => t.id !== turno.id)
            : (prev) => sortTurnosByFechaAtencionDesc([...prev, turno]);

        switch (estado) {
          case 0:
            setPendienteTurnos(selector);
            break;
          case 1:
            setAsignadosTurnos(selector);
            break;
          case 2:
            setCanceladoTurnos(selector);
            break;
          case 3:
            setEnCursoTurnos(selector);
            break;
          case 4:
            setFinalizadoTurnos(selector);
            break;
          case 5:
            setReprogramadoTurnos(selector);
            break;
          default:
            console.warn(`Estado no reconocido: ${estado}`);
        }
      };

      if (dialogMode === "create") {
        console.log("Creando turno con body:", body); // Debugging line
        // 1. Guardamos en la base de datos primero (para obtener el ID real que autogenera el backend)
        const respuestaBackend = await CrearTurnos(body);

        // Si tu backend retorna el objeto creado con su ID, usalo. Si no, usa el body.
        const turnoCreadoCompleto = {
          ...body,
          ...(respuestaBackend?.data ?? respuestaBackend ?? {}),
          id:
            respuestaBackend?.data?.id ??
            respuestaBackend?.id ??
            body.id ??
            Date.now(),
          especialista:
            respuestaBackend?.data?.especialista ??
            respuestaBackend?.especialista ??
            body.especialista,
        };
        turnoCreadoCompleto.id_estado_turno = dialogData.id_estado_turno; // Asegurar propiedad para lógica local

        // 2. Insertamos en el estado local de React de forma instantánea sin hacer FETCH
        actualizarListaPorEstado(
          dialogData.id_estado_turno,
          "agregar",
          turnoCreadoCompleto,
        );
        setAllTurnos((prev) =>
          sortTurnosByFechaAtencionDesc([...prev, turnoCreadoCompleto]),
        );
      } else if (dialogMode === "edit") {
        // En edición conocemos el ID anterior, buscamos el estado viejo antes de actualizarlo
        const turnoPrevio = allTurnos.find((t) => t.id === id_nuevo);
        const estadoAnterior = turnoPrevio
          ? turnoPrevio.id_estado_turno
          : dialogData.id_estado_turno;
        const isStateChange = estadoAnterior !== dialogData.id_estado_turno;
        const nextTurnData = {
          ...turnoPrevio,
          ...dialogData,
        };

        if (
          isStateChange &&
          !canMoveTurnToState(nextTurnData, dialogData.id_estado_turno)
        ) {
          setDialogError(C.turnsMoveMissingData);
          showNotification(C.turnsMoveMissingData, "warning", 3500);
          return;
        }

        const nombreActual = estadosTurno.find(
          (item) => item.id_estado_turno === dialogData.id_estado_turno,
        );
        const turnoModificadoCompleto = {
          ...dialogData,
          id_estado_turno: dialogData.id_estado_turno,
          estado: nombreActual.estado_turno,
        };

        // 1. Actualización en memoria (Sacamos del estado viejo, agregamos al nuevo)
        actualizarListaPorEstado(estadoAnterior, "sacar", { id: id_nuevo });
        actualizarListaPorEstado(
          dialogData.id_estado_turno,
          "agregar",
          turnoModificadoCompleto,
        );
        setAllTurnos((prev) =>
          sortTurnosByFechaAtencionDesc(
            prev.map((t) => (t.id === id_nuevo ? turnoModificadoCompleto : t)),
          ),
        );

        // 2. Guardamos en la base de datos en segundo plano
        try {
          await ModificarTurno(id_nuevo, body);
        } catch (apiError) {
          console.error("Error al modificar, revirtiendo estado...", apiError);
          // Si la API falla, hacemos el rollback (retorno al estado original en UI)
          actualizarListaPorEstado(dialogData.id_estado_turno, "sacar", {
            id: id_nuevo,
          });
          if (turnoPrevio) {
            actualizarListaPorEstado(estadoAnterior, "agregar", turnoPrevio);
            setAllTurnos((prev) =>
              sortTurnosByFechaAtencionDesc(
                prev.map((t) => (t.id === id_nuevo ? turnoPrevio : t)),
              ),
            );
          }
          throw apiError; // Lanza el error al catch principal para disparar el DialogError
        }
      }

      // Éxito: Limpieza de formulario y feedback visual
      setDialogOpen(false);
      setDialogData(getEmptyTurnForm());
      showNotification(
        dialogMode === "create" ? "Turno Creado!" : "Turno Actualizado!",
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  }, [
    dialogMode,
    dialogData,
    usuarioSelected,
    allTurnos,
    estadosTurno,
    handleValidation,
    setPendienteTurnos,
    setAsignadosTurnos,
    setEnCursoTurnos,
    setFinalizadoTurnos,
    setCanceladoTurnos,
    setReprogramadoTurnos,
    setAllTurnos,
    setDialogOpen,
    setDialogData,
    setDialogError,
    setDialogSaving,
    showNotification,
  ]);

  // SECCION ESPECIALIDADES
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadesActivas, setEspecialidadesActivas] = useState([]);
  const [especialidadesRows, setEspecialidadesRows] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

  const fetchEspecialidades = useCallback(async () => {
    setLoadingEspecialidades(true);
    try {
      let data = await ObtenerEspecialidades();
      setEspecialidades(data);
      setEspecialidadesActivas(data.filter((esp) => esp.activo));
      setEspecialidadesRows(generateRows(data));
    } catch {
      setEspecialidadesRows([]);
    } finally {
      setLoadingEspecialidades(false);
    }
  }, []);

  useEffect(() => {
    fetchEspecialidades();
  }, [fetchEspecialidades]);

  const openCreateEspecialidades = useCallback(() => {
    openDialog("especialidades", "create", EMPTY_ESPECIALIDAD);
  }, [openDialog]);

  const openEditEspecialidades = useCallback(
    (row) => {
      openDialog("especialidades", "edit", row);
    },
    [openDialog],
  );

  const handleEspecialidadesSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id } = dialogData;
      let id_nuevo = id === "" ? 0 : id;
      const body = {
        id: id_nuevo,
        nombre: dialogData.nombre,
        descripcion: dialogData.descripcion,
        activo: dialogMode === "create" ? true : dialogData.activo,
      };

      if (dialogMode === "create") {
        await CrearEspecialidad(body);
      } else if (dialogMode === "edit") {
        await ModificaEspecialidad(id_nuevo, body);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_ESPECIALIDAD);
      fetchEspecialidades();
      showNotification(
        dialogMode === "create"
          ? "Especialidad creada!"
          : "Especialidad modificada correctamente",
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };

  // --------- SECCION PERSONAL MEDICO -----------
  const [personal, setPersonal] = useState([]);
  const [personalRows, setPersonalRows] = useState([]);
  const [loadingPersonal, setLoadingPersonal] = useState(false);

  const fetchPersonal = useCallback(async () => {
    setLoadingPersonal(true);
    try {
      let data = await ObtenerPersonalMedico();
      data = data.map(mapPersonalMedico);
      setPersonal(data);
      setPersonalRows(generateRows(data));
    } catch {
      setPersonalRows([]);
    } finally {
      setLoadingPersonal(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonal();
  }, [fetchPersonal]);

  const [cuilFaltas, SetCuilFaltas] = useState(null);
  const [faltasRows, setFaltasRows] = useState([]);
  const [loadingFaltas, setLoadingFaltas] = useState([]);

  const fetchFaltas = useCallback(async () => {
    setLoadingFaltas(true);
    try {
      if (cuilFaltas) {
        let data = await ObtenerFaltasXCUIL(cuilFaltas);
        setFaltasRows(generateRows(data));
      } else {
        setFaltasRows([]);
      }
    } catch {
      setFaltasRows([]);
    } finally {
      setLoadingFaltas(false);
    }
  }, [cuilFaltas]);

  useEffect(() => {
    fetchFaltas();
  }, [fetchFaltas]);

  const openCreatePersonal = useCallback(() => {
    openDialog("personal", "create", EMPTY_PERSONAL);
  }, [openDialog]);

  const openEditPersonal = useCallback(
    (row) => {
      openDialog("personal", "edit", row);
    },
    [openDialog],
  );

  const openEditRegist = useCallback(
    (row) => {
      openDialog("personal", "faltas", {
        cuil: row.cuil,
        fecha_alta: null,
        observacion: "",
      });
      SetCuilFaltas(row.cuil);
      fetchFaltas();
    },
    [fetchFaltas, openDialog],
  );

  const handlePersonalSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      //Utilizo este handler para todo, separo en los body para personal y las faltas
      if (dialogMode == "faltas" && cuilFaltas) {
        const body = { id: 0, ...dialogData }; //Hago un body exactamente igual al anterior
        await RegistrarFalta(body);
        setDialogData(EMPTY_FALTA);
        fetchFaltas();
        showNotification("Falta registrada al personal");
      } else {
        const body = {
          cuil: dialogData.cuil,
          nombre: dialogData.nombre,
          apellido: dialogData.apellido,
          presta_servicio: dialogMode === "create" ? true : dialogData.activo,
          especialidad: {
            id: dialogData.id_especialidad,
            nombre: dialogData.especialidad,
            descripcion: "string",
            activo: true,
          },
        };

        if (dialogMode === "create") {
          await CrearPersonal(body);
        } else if (dialogMode === "edit") {
          await ModificarPersonal(dialogData.cuil, body);
        }
        setDialogOpen(false);
        setDialogData(EMPTY_PERSONAL);
        fetchPersonal();
        showNotification(
          dialogMode === "create"
            ? "Personal creado!"
            : "Personal modificado correctamente",
        );
      }
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };
  // --------- SECCION CURSOS MEDICOS -----------
  const [cursos, setCursos] = useState([]);
  const [cursosRows, setCursosRows] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);

  const fetchCursos = useCallback(async () => {
    setLoadingCursos(true);
    try {
      let data = await ObtenerCursosMedicos();
      setCursos(data);
      setCursosRows(generateRows(data.map(mapCursoMedico)));
    } catch {
      setCursosRows([]);
    } finally {
      setLoadingCursos(false);
    }
  }, []);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const openCreateCurso = useCallback(() => {
    openDialog("cursos", "create", EMPTY_CURSO);
  }, [openDialog]);

  const openEditCurso = useCallback(
    (row) => {
      openDialog("cursos", "edit", row);
    },
    [openDialog],
  );
  const openDeleteCurso = useCallback(
    (row) => {
      openDialog("cursos", "delete", row);
    },
    [openDialog],
  );

  const handleCursoSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id } = dialogData;
      let id_nuevo = id === "" ? 0 : id;
      const body = {
        id: id_nuevo,
        nombre_curso: dialogData.nombre_curso,
        nombre_docente: dialogData.nombre_docente,
        fecha_inicio: dialogData.fecha_inicio
          ? `${dialogData.fecha_inicio}T00:00:00`
          : new Date(),
        fecha_fin: dialogData.fecha_fin
          ? `${dialogData.fecha_fin}T00:00:00`
          : new Date(),
        cupo_maximo: Number(dialogData.cupo_maximo),
        activo: dialogMode === "create" ? true : dialogData.activo,
      };

      if (dialogMode === "create") {
        await CrearCurso(body);
      } else if (dialogMode === "edit") {
        await ModificarCurso(dialogData.id, body);
      } else {
        await EliminarCursoMedico(dialogData.id);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_CURSO);
      fetchCursos();
      showNotification(
        dialogMode === "create"
          ? "Curso creado!"
          : dialogMode === "delete"
            ? "Curso eliminado correctamente"
            : "Curso modificado correctamente",
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };
  //---- HORARIOS ---- //
  const [allHorarios, setAllHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(true);

  const [selectedEmploy, setSelectedEmploy] = useState(null);
  const [selectedHorarios, setSelectedHorarios] = useState([]);
  const [selectedHorariosLoading, setSelectedHorariosLoading] = useState(false);
  const [showNuevoForm, setShowNuevoForm] = useState(false);

  const [form, setForm] = useState(getEmptyHorarioForm);
  const handleChangeForm = (field, value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const [savingHorario, setSavingHorario] = useState(false);
  const [errorHorario, setErrorHorario] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHorarios = useCallback(async () => {
    setLoadingHorarios(true);
    try {
      let data = await ObtenerHorariosCompleto();
      data = data.map(mapHorarioSalud);
      setAllHorarios(data);
    } catch {
      setDialogError("Error recuperando los horarios");
      setAllHorarios([]);
    } finally {
      setLoadingHorarios(false);
    }
  }, [setDialogError]);
  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  const fetchHorariosXEmpleado = useCallback(async (cuil = selectedEmploy?.cuil) => {
    setSelectedHorariosLoading(true);
    setDialogError(null);
    //Todo esto es para que no guarde informacion en las tarjetas
    setForm(getEmptyHorarioForm());
    setDeleteId(null);
    setEditingId(null);
    try {
      if (cuil) {
        let data = await ObtenerHorariosXCUIL(cuil);
        data = data.map(mapHorarioSalud);
        setSelectedHorarios(data);
      } else {
        setSelectedHorarios([]);
      }
    } catch {
      setDialogError("Error recuperando los horarios");
      setSelectedHorarios([]);
    } finally {
      setSelectedHorariosLoading(false);
    }
  }, [selectedEmploy?.cuil, setSelectedHorarios, setDialogError]);

  useEffect(() => {
    fetchHorariosXEmpleado();
  }, [fetchHorariosXEmpleado]);

  const handleEmployChange = useCallback(
    (_e, value) => {
      setSelectedEmploy(value);

      setShowNuevoForm(false);
    },
    [],
  );

  const handleHorarioSaved = useCallback(() => {
    if (selectedEmploy) fetchHorariosXEmpleado(selectedEmploy.cuil);
  }, [selectedEmploy, fetchHorariosXEmpleado]);

  const handleHorarioCreated = useCallback(() => {
    setShowNuevoForm(false);
    if (selectedEmploy) fetchHorariosXEmpleado(selectedEmploy.cuil);
  }, [selectedEmploy, fetchHorariosXEmpleado]);

  const handleClose = () => {
    setSelectedEmploy(null);
    setSelectedHorarios([]);
    setShowNuevoForm(false);
    setHorariosDialogOpen(false);
  };

  const handleCreateHorario = async () => {
    const validationMessage = validateHorarioRange(form);
    if (!selectedEmploy || validationMessage) {
      setErrorHorario(
        !selectedEmploy ? "Seleccioná un empleado." : validationMessage,
      );
      return;
    }

    setSavingHorario(true);
    setErrorHorario("");
    try {
      const body = {
        id: 0,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        dia: form.dia,
        cuil_especialista: selectedEmploy.cuil,
        especialista: selectedEmploy.nombre,
        activo: true,
        especialidad: {
          id: 0,
          nombre: "",
          descripcion: "",
          activo: true,
        },
      };

      await CrearHorario(body);

      fetchHorarios();
      fetchHorariosXEmpleado(selectedEmploy.cuil);
      setShowNuevoForm(false);
    } catch (err) {
      setErrorHorario(err.message || "Error al crear");
    } finally {
      setSavingHorario(false);
    }
  };
  const handleEditHorario = async () => {
    const validationMessage = validateHorarioRange(form);
    if (!selectedEmploy || validationMessage) {
      setErrorHorario(
        !selectedEmploy ? "Seleccioná un empleado." : validationMessage,
      );
      return;
    }

    //Son todas cosas que queremos mostrar antes de ejecutar una query asincrona
    setSavingHorario(true);
    setErrorHorario("");

    try {
      const body = {
        id: form.id,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        dia: form.dia,
        cuil_especialista: selectedEmploy.cuil,
        especialista: selectedEmploy.nombre,
        activo: true,
        especialidad: {
          id: 0,
          nombre: "",
          descripcion: "",
          activo: true,
        },
      };

      await ModificarHorario(form.id, body);
      setEditingId(null);
      fetchHorarios();
      fetchHorariosXEmpleado(selectedEmploy.cuil);
      setForm(getEmptyHorarioForm());
    } catch (err) {
      setErrorHorario(err.message || "Error al guardar");
    } finally {
      setSavingHorario(false);
    }
  };
  const handleDeleteHorario = async () => {
    try {
      await EliminarHorario(deleteId);
      setForm(getEmptyHorarioForm());
      setDeleteId(null);
      fetchHorarios();
      fetchHorariosXEmpleado(selectedEmploy.cuil);
      setConfirmDelete(false);
    } catch (err) {
      setConfirmDelete(false);
      setErrorHorario(err.message || "Error al crear");
    }
  };
  const handleCancelHorario = () => {
    setForm(getEmptyHorarioForm());
    setEditingId(null);
    setErrorHorario("");
  };

  // ------------ COLUMNAS ----------- //

  const noActivosColumns = useMemo(() => {
    return generateColumns(EMPTY_TURNO, [], {
      hora_atencion: {
        renderCell: (params) => toTimeInput(params.value),
      },
    });
  }, []);

  //Especialidad//
  const handleEditEspecialidades = useCallback(
    (row) => {
      openEditEspecialidades(row);
    },
    [openEditEspecialidades],
  );

  const especialidadesActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar Especialidad",
        onClick: handleEditEspecialidades,
      },
    ],
    [handleEditEspecialidades],
  );

  const especialidadesColumns = useMemo(() => {
    return generateColumns(EMPTY_ESPECIALIDAD, especialidadesActions);
  }, [especialidadesActions]);

  //Faltas//
  const faltasColumns = useMemo(() => {
    return generateColumns(EMPTY_FALTA, []);
  }, []);

  //Personal//

  const handleEditPersonal = useCallback(
    (row) => {
      openEditPersonal(row);
    },
    [openEditPersonal],
  );

  const handleEditRegist = useCallback(
    (row) => {
      openEditRegist(row);
    },
    [openEditRegist],
  );

  const personalActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar Personal",
        onClick: handleEditPersonal,
      },
      {
        icon: EditNoteIcon,
        color: "primary",
        title: "Registrar Falta",
        onClick: handleEditRegist,
      },
    ],
    [handleEditPersonal, handleEditRegist],
  );

  const personalColumns = useMemo(() => {
    return generateColumns(EMPTY_PERSONAL, personalActions);
  }, [personalActions]);

  //Cursos//
  const handleEditCurso = useCallback(
    (row) => {
      openEditCurso(row);
    },
    [openEditCurso],
  );

  const handleDeleteCurso = useCallback(
    (row) => {
      openDeleteCurso(row);
    },
    [openDeleteCurso],
  );

  const cursosActions = useMemo(
    () => [
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar Curso",
        onClick: handleEditCurso,
      },
      {
        icon: DeleteIcon,
        color: "primary",
        title: "Eliminar Curso",
        onClick: handleDeleteCurso,
      },
    ],
    [handleEditCurso, handleDeleteCurso],
  );

  const cursosColumns = useMemo(() => {
    return generateColumns(EMPTY_CURSO, cursosActions);
  }, [cursosActions]);

  return (
    <HealthContext.Provider
      value={{
        //Faltas
        cuilFaltas,
        SetCuilFaltas,
        faltasRows,
        faltasColumns,
        loadingFaltas,
        // ABM de Turnos
        estadosTurno,
        pendienteTurnos,
        asignadoTurnos,
        enCursoTurnos,
        reprogramadoTurnos,
        loadingTurnos,
        noActivosRows,
        noActivosColumns,
        //Probablemente no se usen
        finalizadoTurnos,
        canceladoTurnos, //Listados de turnos

        openCreateTurnos,
        openEditTurnos,
        handleTurnosSave,
        handleTurnosChangeState, //Operaciones
        setUsuarioSelected,
        usuarioSelected,
        loadingUsuario,
        fetchUsuariosXlegajo, //Usuarios para nuevo turno

        fetchTurnosFinalizados,
        fetchTurnosCancelados,
        loadingNoActivos,
        openShowNoActivos, // Para los turnos que esten ya finalizados o cancelados
        // ABM de Especialidades
        especialidades,
        especialidadesActivas,
        especialidadesRows,
        especialidadesColumns,
        loadingEspecialidades,
        openCreateEspecialidades,
        openEditEspecialidades,
        handleEspecialidadesSave,
        //ABM de Personal
        personal,
        personalRows,
        personalColumns,
        loadingPersonal,
        openCreatePersonal,
        openEditPersonal,
        handlePersonalSave,
        //ABM de Cursos
        cursos,
        cursosRows,
        cursosColumns,
        loadingCursos,
        openCreateCurso,
        openEditCurso,
        handleCursoSave,
        //Horarios
        horariosDialogOpen,
        setHorariosDialogOpen,
        setShowNuevoForm,
        setEditingId,
        setDeleteId,
        allHorarios,
        loadingHorarios,
        selectedEmploy,
        selectedHorarios,
        selectedHorariosLoading,
        setSelectedEmploy, //General
        showNuevoForm,
        form,
        setForm,
        handleChangeForm, //Formularios
        savingHorario,
        errorHorario,
        setErrorHorario,
        editingId,
        confirmDelete,
        deleteId, //Datos de formulario
        handleEmployChange,
        handleHorarioSaved,
        handleHorarioCreated,
        handleClose,
        handleCreateHorario,
        handleEditHorario,
        handleDeleteHorario,
        handleCancelHorario, //Acciones en el dialog
        //Valores de error, mostrar mensajes, etc.
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
