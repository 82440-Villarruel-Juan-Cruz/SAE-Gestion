import { useState, useEffect, useCallback, useMemo } from "react";
import { ScholarshipsContext } from "../studentContext";
import {
  AddCircleOutline,
  AttachMoney,
  Diversity3,
  School,
} from "@mui/icons-material";

import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import DocumentCard from "../../../assets/components/documents/DocumentCard";

import {
  ObtenerBecariosXLegajo,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
  listarDocumentacionXLegajo,
  descargarDocumentacionXId,
  eliminarDocumentoEstudiante,
  crearDocumentoEstudiante,
  ObtenerProyectosInvestigacion,
  ObtenerServiciosInternos,
  CrearBecarioEconomica,
  CrearBecarioSAE,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
} from "../../../api/BecasService";

import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { ObtenerPerfilXLegajo } from "../../../api/EstudianteService";
import { mapEstudiante } from "../../../api/formatters/EstudianteFormatters";
import {
  useAuth,
  useNotification,
} from "../../../shared/context/sharedContext";

import {
  SCHOLARSHIPS_REQUERID_DOCUMENTS,
  ECONOMIC_DOCUMENTS,
  ECONOMIC_OPTIONAL_DOCUMENTS,
} from "../../../utils/common/common.config.js";
import { SCHOLARSHIP_STRINGS } from "../../../utils/strings/student.strings";
import {
  SCHOLARSHIPS_STATES,
  SCHOLARSHIP_TYPE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_EXTENSIONS,
} from "../../../utils/common/constants.js";
import {
  createPreviewState,
  isPdfDocument,
  buildDocumentName,
  asignarArchivosADocumentos,
  asignarTiposADocumentos,
  getDocumentDisplayName,
  buildDocumentsFromConfig,
  getDocumentKey,
} from "../../../utils/documents.utils.js";
import {
  getErrorMessage,
  obtenerLegajoDesdeEmail,
} from "../../../utils/util.jsx";

const isValidObjectResponse = (value) =>
  Boolean(value && typeof value === "object" && value.id);

function getAnioBeca(becario = {}) {
  const anioBeca = Number(becario?.anio_beca);

  if (Number.isInteger(anioBeca)) return anioBeca;

  const fechaSolicitud = new Date(becario?.fecha_solicitud);
  if (!Number.isNaN(fechaSolicitud.getTime())) {
    return fechaSolicitud.getFullYear();
  }

  return null;
}

function getEstadoBecaDesdeBecario(becario = {}) {
  const aceptadoInicio = Boolean(becario?.aceptado_inicio);
  const puedePagarle = Boolean(becario?.puede_pagarle);
  const estaActivo = becario?.activo !== false;
  const anioBeca = getAnioBeca(becario);
  const anioActual = new Date().getFullYear();

  if (!estaActivo) return SCHOLARSHIPS_STATES.RECHAZADO;
  if (anioBeca && anioActual > anioBeca) return SCHOLARSHIPS_STATES.FIN_BECADO;

  if (aceptadoInicio && puedePagarle)
    return SCHOLARSHIPS_STATES.ACEPTADO_PAGADO;
  if (aceptadoInicio) return SCHOLARSHIPS_STATES.ACEPTADO_INICIO;

  return SCHOLARSHIPS_STATES.SOLICITADO;
}

export function ScholarshipsProvider({ children }) {
  const { setDialogOpen } = useNotification();
  const isEconomicOptionalDocument = (documento) =>
    documento.required === false;
  const { showNotification } = useNotification();
  const C = SCHOLARSHIP_STRINGS;
  // Devuelve el icono visual para cada tipo de beca sin mezclar JSX dentro de la
  // respuesta normalizada de la API.
  const getBecaIcon = (tipoBeca) => {
    switch (tipoBeca) {
      case SCHOLARSHIP_TYPE.ECONOMICA:
        return <AttachMoney fontSize="large" />;
      case SCHOLARSHIP_TYPE.SERVICIO:
        return <Diversity3 fontSize="large" />;
      case SCHOLARSHIP_TYPE.INVESTIGACION:
        return <School fontSize="large" />;
      default:
        return null;
    }
  };
  const REQUIRED_PROFILE_FIELDS = [
    ["legajo", "Legajo", (value) => String(value).trim() !== ""],
    ["nombres", "Nombres", (value) => String(value).trim() !== ""],
    ["apellidos", "Apellidos", (value) => String(value).trim() !== ""],
    ["dni", "DNI", (value) => String(value).replace(/\D/g, "").length === 8],
    ["cuil", "CUIL", (value) => String(value).replace(/\D/g, "").length === 11],
    [
      "fecha_nacimiento",
      "Fecha de nacimiento",
      (value) => String(value).trim() !== "",
    ],
    [
      "email",
      "Correo electrónico",
      (value) => /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(value).trim()),
    ],
    [
      "telefono",
      "Teléfono",
      (value) => String(value).replace(/\D/g, "").length === 12,
    ],
    [
      "direccion",
      "Dirección",
      (value) => {
        const parts = String(value).split(/\s+-\s+/);
        return parts.length === 4 && parts.every((part) => part.trim() !== "");
      },
    ],
  ];
  const getMissingProfileFields = (profile) =>
    REQUIRED_PROFILE_FIELDS.filter(([field, , isValid]) => {
      const value = profile?.[field];
      return value === null || value === undefined || !isValid(value);
    }).map(([, label]) => label);

  const { user } = useAuth();
  const [perfilEstudiante, setPerfilEstudiante] = useState(null);
  const camposPerfilFaltantes = getMissingProfileFields(perfilEstudiante);
  const perfilIncompleto = camposPerfilFaltantes?.length > 0;

  // Becario base del sistema SAE. Es distinto de la beca específica.
  // Primero se necesita este registro para después crear económica/servicio/investigación.
  const [becarioActual, setBecarioActual] = useState(null);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  // Lista normalizada de becas para pintar las cards.
  const [misBecas, setMisBecas] = useState([]);

  const [documentos, setDocumentos] = useState(SCHOLARSHIPS_REQUERID_DOCUMENTS); // lista general de documentos cargados
  const [documentosEconomica, setDocumentosEconomica] = useState(
    ECONOMIC_DOCUMENTS.concat(ECONOMIC_OPTIONAL_DOCUMENTS),
  ); // documentos específicos para beca económica

  const [preview, setPreview] = useState(createPreviewState());

  const [cbu, setCbu] = useState("");
  const [cbuGuardado, setCbuGuardado] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

  const cargarPerfilEstudiante = useCallback(async () => {
    const legajo = user?.legajo ?? user?.email;
    if (!legajo) {
      setPerfilEstudiante(null);
      return;
    }

    try {
      const perfil = await ObtenerPerfilXLegajo(legajo);
      setPerfilEstudiante(mapEstudiante(perfil));
    } catch {
      setPerfilEstudiante(null);
    }
  }, [user?.email, user?.legajo]);

  // Carga los proyectos disponibles para la beca de investigación.

  // Normaliza las respuestas de la API porque vienen como objeto único o como {} cuando no existe beca.
  // Trae tipos de documento para completar id_tipo_documento y extension en las
  // configuraciones locales.
  const cargarTiposDocumento = useCallback(async () => {
    try {
      const data = await obtenerTiposDocumento();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
      return [];
    }
  }, []);

  // Metodo compartido con ScholarshipsForm. Guarda en base y sincroniza las dos
  // listas locales porque un tipo de documento puede verse en mas de una seccion.
  const subirDocumentoEstudiante = useCallback(
    async (idTipoDocumento, archivo) => {
      const documentoGuardado = await crearDocumentoEstudiante(
        idTipoDocumento,
        archivo,
      );

      setDocumentos((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(idTipoDocumento)
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre: documentoGuardado.nombre_documento,
                subido: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(idTipoDocumento)
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre: documentoGuardado.nombre_documento,
                subido: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      return documentoGuardado;
    },
    [],
  );

  // Cada endpoint devuelve una forma distinta. Aca se arma una lista unica para
  // renderizar las cards de "Mis Becas".
  const normalizarBecas = useCallback(
    (economica, servicio, investigacion) => {
      return [
        isValidObjectResponse(economica) && {
          ...economica,
          tipoBeca: SCHOLARSHIP_TYPE.ECONOMICA,
          iconBeca: getBecaIcon(SCHOLARSHIP_TYPE.ECONOMICA),
          fechaSolicitud: economica.becario?.fecha_solicitud,
          estado: getEstadoBecaDesdeBecario(economica.becario),
        },
        isValidObjectResponse(servicio) && {
          ...servicio,
          tipoBeca: SCHOLARSHIP_TYPE.SERVICIO,
          iconBeca: getBecaIcon(SCHOLARSHIP_TYPE.SERVICIO),
          fechaSolicitud: servicio.becario?.fecha_solicitud,
          estado: getEstadoBecaDesdeBecario(servicio.becario),
          servicio:
            servicio.servicio?.nombre ?? servicio.servicio ?? C.emptyValue,
        },
        isValidObjectResponse(investigacion) && {
          ...investigacion,
          tipoBeca: SCHOLARSHIP_TYPE.INVESTIGACION,
          iconBeca: getBecaIcon(SCHOLARSHIP_TYPE.INVESTIGACION),
          fechaSolicitud: investigacion.becario?.fecha_solicitud,
          estado: getEstadoBecaDesdeBecario(investigacion.becario),
          proyecto_investigacion:
            investigacion.proyecto_investigacion
              ?.nombre_proyecto_investigacion ??
            investigacion.proyecto_investigacion?.centro_investigacion ??
            C.emptyValue,
        },
      ].filter(Boolean);
    },
    [C],
  );

  // Carga el becario base y las becas asociadas al usuario logueado.
  const cargarMisBecas = useCallback(
    async ({ showLoading = true } = {}) => {
      if (!user?.email) return;

      try {
        if (showLoading) setLoadingScholarships(true);
        const becario = await ObtenerBecariosXLegajo(user.email);

        if (!isValidObjectResponse(becario)) {
          setBecarioActual(null);
          setMisBecas([]);
          return;
        }

        setBecarioActual(becario);

        const [economica, servicio, investigacion] = await Promise.all([
          ObtenerBecariosEconomicaXLegajo(user.email),
          ObtenerBecariosServiciosXLegajo(user.email),
          ObtenerBecariosInvestigacionXLegajo(user.email),
        ]);

        setMisBecas(normalizarBecas(economica, servicio, investigacion));
      } catch (error) {
        console.error("Error al cargar becario y becas", error);
        setBecarioActual(null);
        setMisBecas([]);
        showNotification(C.loadScholarshipsError, "error");
      } finally {
        if (showLoading) setLoadingScholarships(false);
      }
    },
    [normalizarBecas, showNotification, user?.email, C],
  );

  // Carga directa desde "Mis Documentos". El formulario usa el mismo servicio,
  // pero maneja su propio estado local mientras el dialog esta abierto.
  const handleArchivoChange = async (e, item) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extensionArchivo = `.${file.name.split(".").pop().toLowerCase()}`;

    const extensionesPermitidas = item.extension
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      alert(C.uploadAllowedExtensions(item.extension));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(C.uploadMaxSize(MAX_FILE_SIZE_MB));
      e.target.value = "";
      return;
    }

    const nuevoNombre = buildDocumentName(
      item.formatoNombre,
      {
        legajo: obtenerLegajoDesdeEmail(user.legajo ?? user.email),
      },
      extensionArchivo,
    );

    const archivoRenombrado = new File([file], nuevoNombre, {
      type: file.type,
      lastModified: file.lastModified,
    });

    let archivoGuardado;

    try {
      setLoadingDocuments(true);
      archivoGuardado = await crearDocumentoEstudiante(
        item.id_tipo_documento,
        archivoRenombrado,
      );
      showNotification(C.uploadSuccess, "success");
    } catch (error) {
      showNotification("Error al subir el archivo: " + error, "error");
    } finally {
      setLoadingDocuments(false);
    }

    if (!archivoGuardado) {
      e.target.value = "";
      return;
    }

    setDocumentos((prev) =>
      prev.map((doc) =>
        Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
          ? {
              ...doc,
              archivo: archivoGuardado,
              archivoNombre: archivoGuardado.nombre_documento,
              subido: true,
              id_archivo: archivoGuardado.id,
            }
          : doc,
      ),
    );

    setDocumentosEconomica((prev) =>
      prev.map((doc) =>
        Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
          ? {
              ...doc,
              archivo: archivoGuardado,
              archivoNombre: archivoGuardado.nombre_documento,
              subido: true,
              id_archivo: archivoGuardado.id,
            }
          : doc,
      ),
    );
    e.target.value = "";
  };

  const handleCbuChange = (e) => {
    setCbu(e.target.value.replace(/\D/g, "").slice(0, 22));
  };

  const handleGuardarCbu = () => {
    if (cbu.length !== 22) {
      showNotification(C.cbuInvalid, "warning");
      return;
    }

    setCbuGuardado(true);
    showNotification(C.cbuSavedSuccess, "success");
  };

  const hasEconomica = misBecas.some(
    (b) => b.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA,
  );

  // Abre el Dialog para solicitar una beca nueva.
  // Si ya existe Becario SAE, precarga sus datos; si no, usa datos del usuario logueado.
  const handleAgregarBeca = () => {
    if (perfilIncompleto) {
      showNotification(C.incompleteProfileMessage, "warning");
      return;
    }

    setDialogOpen(true);
  };

  // Borra despues de confirmar en el dialog. Si la API responde bien, limpia el
  // documento en ambas listas para mantener la pantalla sincronizada.
  async function handleDelete(item) {
    try {
      setOpenPopup(false);

      setLoadingDocuments(true);

      await eliminarDocumentoEstudiante(item.id_archivo);

      showNotification(C.docEliminado, "success");

      setDocumentos((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : doc,
        ),
      );

      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : doc,
        ),
      );
    } catch (error) {
      showNotification("Error al eliminar el documento: " + error, "error");
    } finally {
      setLoadingDocuments(false);
    }
  }
  const closePreview = () => {
    setPreview((previous) => ({
      ...previous,
      open: false,
      imageSrc: null, // Limpieza para liberar memoria
    }));
  };

  // Descarga el archivo por id y delega la visualizacion al dialog compartido.
  async function handlePreview(id, nombre) {
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
      setPreview((prev) => ({
        ...prev,
        loading: false,
        error: C.previewLoadError,
      }));
    }
  }

  // Solo abre la confirmacion; la eliminacion real ocurre en handleDelete.
  async function DeleteDocument(document) {
    setOpenPopup(true);
    setDocumentoAEliminar(document);
  }

  // Primer paso de documentos: cruzar configuracion local con tipos reales.
  const ObtenerTipoDocumentos = useCallback(async () => {
    try {
      const data = await cargarTiposDocumento();
      if (!data || data.length === 0) return;

      let docsConId = [];

      setDocumentos((prev) => {
        docsConId = asignarTiposADocumentos(prev, data);

        return docsConId;
      });

      setDocumentosEconomica((prev) => asignarTiposADocumentos(prev, data));

      return docsConId;
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
      return [];
    }
  }, [cargarTiposDocumento]);

  // Segundo paso de documentos: marcar como subidos los archivos que ya existen
  // para el legajo del estudiante.
  const ObtenerDocumentosEstudiante = useCallback(
    async (documentosBase) => {
      try {
        const data = await listarDocumentacionXLegajo(user?.email);
        if (!data || data.length === 0) return;

        setDocumentos((prev) =>
          asignarArchivosADocumentos(
            documentosBase.length > 0 ? documentosBase : prev,
            data,
          ),
        );

        setDocumentosEconomica((prev) =>
          asignarArchivosADocumentos(prev, data),
        );
      } catch (error) {
        console.error("Error al obtener documentos del estudiante", error);
      }
    },
    [user?.email],
  );

  // Carga inicial: becario/becas, tipos de documento y archivos del estudiante.
  // El orden importa porque los archivos se asignan usando id_tipo_documento.
  useEffect(() => {
    if (!user?.email) return;

    const inicializarPantalla = async () => {
      setLoadingScholarships(true);
      setLoadingDocuments(true);

      const loadScholarships = Promise.all([
        cargarMisBecas({ showLoading: false }),
        cargarPerfilEstudiante(),
      ]).finally(() => setLoadingScholarships(false));

      const loadDocuments = (async () => {
        try {
          const documentosConTipo = await ObtenerTipoDocumentos();
          await ObtenerDocumentosEstudiante(documentosConTipo);
        } catch (error) {
          console.error("Error al cargar documentos de becas", error);
        } finally {
          setLoadingDocuments(false);
        }
      })();

      await Promise.all([loadScholarships, loadDocuments]);
    };

    inicializarPantalla();
  }, [
    user?.email,
    cargarMisBecas,
    cargarPerfilEstudiante,
    ObtenerTipoDocumentos,
    ObtenerDocumentosEstudiante,
  ]);

  const datosPerfil = user?.datosPerfil ?? {};
  const userLegajo = datosPerfil.legajo;
  const userNombreCompleto = datosPerfil.nombres;
  const userApellido = datosPerfil.apellidos;
  const userDniCompleto = datosPerfil.dni;
  const userFechaNacimiento = datosPerfil.fecha_nacimiento;
  const userTelefonoCompleto = datosPerfil.telefono;
  const userMailCompleto = datosPerfil.email;
  const userDomicilioCompleto = datosPerfil.direccion;
  const userEmail = user?.email;
  const userNombre = user?.nombre;
  const userDni = user?.dni;
  const userTelefono = user?.telefono;
  const userDomicilio = user?.domicilio;
  const becarioId = becarioActual?.id;
  const becarioLegajo = becarioActual?.legajo;
  const becarioNombre = becarioActual?.nombre_becario;
  const becarioAlquila = becarioActual?.alquila;
  const becarioFechaSolicitud = becarioActual?.fecha_solicitud;
  const becarioAceptadoInicio = becarioActual?.aceptado_inicio;
  const becarioPuedePagarle = becarioActual?.puede_pagarle;
  const becarioActivo = becarioActual?.activo;
  const becarioAnioBeca = becarioActual?.anio_beca;
  const becarioPrevioId = becarioActual?.id_becario_previo;

  // Base del formulario: perfil completo, becario existente y usuario logueado,
  // en ese orden de prioridad.
  const initialFormBeca = useMemo(
    () => ({
      id: becarioId ?? 0,
      legajo: userLegajo ?? becarioLegajo ?? userEmail ?? "",
      nombre_becario: becarioNombre ?? userNombreCompleto ?? userNombre ?? "",
      nombre: userNombreCompleto ?? userNombre ?? "",
      apellido: userApellido ?? "",
      dni: userDniCompleto ?? userDni ?? "",
      fechaNacimiento: userFechaNacimiento ?? "",
      telefono: userTelefonoCompleto ?? userTelefono ?? "",
      email: userMailCompleto ?? userEmail ?? "",
      domicilio: userDomicilioCompleto ?? userDomicilio ?? "",
      alquila: becarioAlquila ?? true,
      fecha_solicitud: becarioFechaSolicitud ?? "",
      aceptado_inicio: becarioAceptadoInicio ?? false,
      puede_pagarle: becarioPuedePagarle ?? false,
      activo: becarioActivo ?? true,
      anio_beca: becarioAnioBeca ?? new Date().getFullYear(),
      id_becario_previo: becarioPrevioId ?? null,
      tipoBeca: "",
      beca: null,
      descripcionSituacion: "",
    }),
    [
      userLegajo,
      becarioLegajo,
      userEmail,
      becarioNombre,
      userNombreCompleto,
      userNombre,
      becarioId,
      userApellido,
      userDniCompleto,
      userDni,
      userFechaNacimiento,
      userTelefonoCompleto,
      userTelefono,
      userMailCompleto,
      userDomicilioCompleto,
      userDomicilio,
      becarioAlquila,
      becarioFechaSolicitud,
      becarioAceptadoInicio,
      becarioPuedePagarle,
      becarioActivo,
      becarioAnioBeca,
      becarioPrevioId,
    ],
  );
  const [formBeca, setFormBeca] = useState(initialFormBeca);
  const [saving, setSaving] = useState(false);
  const [proyectosRows, setProyectosRows] = useState([]);
  const [serviciosRows, setServiciosRows] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);

  const [uploadingDocumentoId, setUploadingDocumentoId] = useState(null);
  const [documentoEconomicoOpcionalId, setDocumentoEconomicoOpcionalId] =
    useState("");

  // Combos dependientes del tipo de beca. Se cargan al abrir el dialog para no
  // pedir datos mientras el formulario esta cerrado.
  const cargarProyectosInvestigacion = useCallback(async () => {
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(Array.isArray(data) ? data : []);
    } catch {
      setProyectosRows([]);
    }
  }, []);

  const cargarServiciosInternos = useCallback(async () => {
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(Array.isArray(data) ? data : []);
    } catch {
      setServiciosRows([]);
    }
  }, []);

  const cargarTiposDocumentoFormulario = useCallback(async () => {
    try {
      const data = await cargarTiposDocumento();
      setTiposDocumento(Array.isArray(data) ? data : []);
    } catch {
      setTiposDocumento([]);
    }
  }, [cargarTiposDocumento]);

  useEffect(() => {
    if (!open) return;
    setFormBeca(initialFormBeca);

    cargarProyectosInvestigacion();
    cargarServiciosInternos();
    cargarTiposDocumentoFormulario();
  }, [
    initialFormBeca,
    cargarProyectosInvestigacion,
    cargarServiciosInternos,
    cargarTiposDocumentoFormulario,
  ]);

  // Los requeridos vienen resueltos por Scholarships. El form los copia para
  // poder reflejar cargas y borrados sin mutar props.
  useEffect(() => {
    if (!open) return;
    setDocumentosRequeridos(documentos);
  }, [documentos]);

  // Los documentos economicos dependen del tipo seleccionado. Se reconstruyen
  // mezclando configuracion, tipos de documento y archivos ya subidos.
  useEffect(() => {
    // Condición de salida para evitar ejecuciones innecesarias
    if (!formBeca?.tipoBeca || !tiposDocumento) return;

    setDocumentosEconomica((prev) =>
      formBeca.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA
        ? buildDocumentsFromConfig(
            prev, // <-- Pasamos 'prev' en lugar de 'documentosEconomica'
            tiposDocumento,
            prev,
            documentos,
          )
        : [],
    );
    // Eliminamos 'documentosEconomica' de las dependencias
  }, [formBeca.tipoBeca, tiposDocumento, documentos]);

  const documentosEconomicaVisibles = documentosEconomica.filter(
    (documento) =>
      documento.required ||
      documento.visible ||
      Boolean(getDocumentDisplayName(documento)),
  );

  const documentosEconomicosOpcionalesDisponibles = documentosEconomica.filter(
    (documento) =>
      isEconomicOptionalDocument(documento) &&
      !documento.visible &&
      !getDocumentDisplayName(documento),
  );

  // Agregar un opcional solo lo vuelve visible: el documento ya existe en la
  // lista base, asi evitamos duplicados.
  const handleAgregarDocumentoEconomico = () => {
    if (!documentoEconomicoOpcionalId) return;

    setDocumentosEconomica((prev) =>
      prev.map((documento) =>
        getDocumentKey(documento) === documentoEconomicoOpcionalId
          ? { ...documento, visible: true }
          : documento,
      ),
    );
    setDocumentoEconomicoOpcionalId("");
  };

  const handleClose = () => {
    if (saving) return;
    else setSaving(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormBeca((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "tipoBeca" ? { beca: null } : {}),
    }));
  };

  // Carga inmediata del archivo: valida formato y tamano, renombra segun
  // formatoNombre, sube por el metodo del padre y actualiza la card local.
  const handleDocumentoChange = async (
    e,
    documentoId,
    documentos,
    setDocumentos,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const selectedDocument = documentos.find(
      (doc) => getDocumentKey(doc) === documentoId,
    );
    if (!selectedDocument) return;

    const extensionArchivo = `.${file.name.split(".").pop().toLowerCase()}`;
    const extensionesPermitidas = (
      selectedDocument.extension ?? DEFAULT_ACCEPTED_EXTENSIONS
    )
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      showNotification(
        C.uploadAllowedExtensions(selectedDocument.extension),
        "warning",
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showNotification(C.uploadMaxSize(MAX_FILE_SIZE_MB), "warning");
      e.target.value = "";
      return;
    }

    const nombreArchivo = selectedDocument.formatoNombre
      ? buildDocumentName(
          selectedDocument.formatoNombre,
          {
            legajo: obtenerLegajoDesdeEmail(
              formBeca.legajo ?? user?.legajo ?? user?.email,
            ),
          },
          extensionArchivo,
        )
      : file.name;

    const archivoRenombrado = new File([file], nombreArchivo, {
      type: file.type,
      lastModified: file.lastModified,
    });

    if (!selectedDocument.id_tipo_documento) {
      showNotification(
        C.documentTypeNotFound(selectedDocument.nombre),
        "error",
      );
      e.target.value = "";
      return;
    }

    try {
      setUploadingDocumentoId(documentoId);

      const documentoGuardado = await subirDocumentoEstudiante(
        selectedDocument.id_tipo_documento,
        archivoRenombrado,
      );

      setDocumentos((prev) =>
        prev.map((doc) =>
          getDocumentKey(doc) === documentoId
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre:
                  documentoGuardado.nombre_documento ?? nombreArchivo,
                subido: true,
                visible: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      showNotification(C.uploadSuccess, "success");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      showNotification(getErrorMessage(error, C.uploadError), "error");
    } finally {
      setUploadingDocumentoId(null);
      e.target.value = "";
    }
  };

  // Limpieza solo local para archivos que todavia no tienen id en base.
  const clearDocumentoLocal = (documentoId, setDocumentos) => {
    setDocumentos((prev) =>
      prev.map((doc) =>
        getDocumentKey(doc) === documentoId
          ? {
              ...doc,
              archivo: null,
              archivoNombre: "",
              subido: false,
              id_archivo: null,
            }
          : doc,
      ),
    );
  };

  // Si el documento ya esta guardado delega al padre para confirmar y borrar en
  // base; si no, limpia el estado local.
  const handleDocumentoDelete = (item, setDocumentos) => {
    if (item.id_archivo) {
      documentoAEliminar?.(item);
      return;
    }

    clearDocumentoLocal(getDocumentKey(item), setDocumentos);
  };

  const handleDocumentoEconomicoDelete = (item) => {
    if (item.id_archivo) {
      documentoAEliminar?.(item);
      return;
    }

    if (isEconomicOptionalDocument(item)) {
      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          getDocumentKey(doc) === getDocumentKey(item)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
                visible: false,
              }
            : doc,
        ),
      );
      return;
    }

    clearDocumentoLocal(getDocumentKey(item), setDocumentosEconomica);
  };

  // Reglas previas al guardado: tipo de beca, opcion asociada, documentos
  // obligatorios y descripcion economica cuando corresponde.
  const validarFormulario = () => {
    if (!formBeca.tipoBeca) {
      showNotification(C.validationSelectScholarshipType, "warning");
      return false;
    }

    if (
      (formBeca.tipoBeca === SCHOLARSHIP_TYPE.INVESTIGACION ||
        formBeca.tipoBeca === SCHOLARSHIP_TYPE.SERVICIO) &&
      !formBeca.beca?.id
    ) {
      showNotification(C.validationSelectScholarshipOption, "warning");
      return false;
    }

    const documentosFaltantes = [
      ...documentosRequeridos,
      ...documentosEconomicaVisibles,
    ].filter((doc) => (doc.required ?? true) && !doc.archivo && !doc.subido);

    if (documentosFaltantes.length > 0) {
      showNotification(
        C.validationAttachDocuments(
          documentosFaltantes.map((doc) => doc.nombre).join(", "),
        ),
        "warning",
      );
      return false;
    }

    if (
      formBeca.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA &&
      !formBeca.descripcionSituacion.trim()
    ) {
      showNotification(C.validationDescribeEconomicSituation, "warning");
      return false;
    }

    return true;
  };

  // Respaldo para archivos seleccionados localmente que no pasaron por la carga
  // inmediata antes de guardar la solicitud.
  const subirDocumentosRequeridos = async () => {
    const documentosConArchivo = [
      ...documentosRequeridos,
      ...documentosEconomicaVisibles,
    ].filter((doc) => isSelectedFile(doc.archivo));

    await Promise.all(
      documentosConArchivo.map((doc) => {
        if (!doc.id_tipo_documento) {
          throw new Error(C.documentTypeNotFound(doc.nombre));
        }

        return subirDocumentoEstudiante(doc.id_tipo_documento, doc.archivo);
      }),
    );
  };
  const isSelectedFile = (archivo) => {
    return archivo instanceof File || archivo instanceof Blob;
  };
  // La beca especifica necesita un becario SAE. Si existe se reutiliza; si no,
  // se crea antes de avanzar.
  const crearBecarioSiNoExiste = async () => {
    if (becarioActual?.id) return becarioActual;

    const payloadBecario = {
      id: 0,
      legajo: user.datosPerfil.legajo,
      nombre_becario:
        user.datosPerfil.nombres + " " + user.datosPerfil.apellidos,
      alquila: formBeca.alquila,
      fecha_solicitud: new Date().toISOString(),
      aceptado_inicio: false,
      puede_pagarle: false,
      activo: true,
      anio_beca: new Date().getFullYear(),
      id_becario_previo: null,
    };

    const nuevoBecario = await CrearBecarioSAE(payloadBecario);
    setBecarioActual(nuevoBecario);
    return nuevoBecario;
  };

  // Cada tipo de beca usa un endpoint distinto, pero devuelve un mensaje comun
  // para mostrar al final del guardado.
  const crearBecaSegunTipo = async (becarioId) => {
    switch (formBeca.tipoBeca) {
      case SCHOLARSHIP_TYPE.ECONOMICA:
        await CrearBecarioEconomica(becarioId);
        return C.createEconomicScholarshipSuccess;
      case SCHOLARSHIP_TYPE.INVESTIGACION:
        await CrearBecarioInvestigacion(becarioId, formBeca.beca.id);
        return C.createInvestigationScholarshipSuccess;
      case SCHOLARSHIP_TYPE.SERVICIO:
        await CrearBecarioServicio(becarioId, formBeca.beca.id);
        return C.createServiceScholarshipSuccess;
      default:
        throw new Error(C.invalidScholarshipType);
    }
  };

  // Flujo completo del boton Guardar: valida, crea/reutiliza becario, crea la
  // beca, sube pendientes, refresca Scholarships y cierra el dialog.
  const handleDialogSave = async () => {
    if (camposPerfilFaltantes.length > 0) {
      showNotification(
        `Completá tu perfil antes de solicitar una beca. Faltan: ${camposPerfilFaltantes.join(", ")}.`,
        "warning",
      );
      return;
    }

    if (!validarFormulario()) return;

    try {
      setSaving(true);
      const becario = await crearBecarioSiNoExiste();
      const mensaje = await crearBecaSegunTipo(becario.id);
      await subirDocumentosRequeridos();
      await cargarMisBecas();
      setSaving(false);
      showNotification(mensaje, "success");
    } catch (err) {
      console.error("Error al crear la beca", err);
      showNotification(C.createScholarshipError, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScholarshipsContext.Provider
      value={{
        closePreview,
        perfilEstudiante,
        camposPerfilFaltantes,
        perfilIncompleto,
        becarioActual,
        loadingScholarships,
        loadingDocuments,
        misBecas,
        documentos,
        documentosEconomica,
        preview,
        cbu,
        cbuGuardado,
        openPopup,
        documentoAEliminar,
        cargarPerfilEstudiante,
        cargarTiposDocumento,
        subirDocumentoEstudiante,
        normalizarBecas,
        getBecaIcon,
        cargarMisBecas,
        handleArchivoChange,
        setDocumentos,
        setDocumentosEconomica,
        handleCbuChange,
        handleGuardarCbu,
        hasEconomica,
        handleAgregarBeca,
        handleDelete,
        handlePreview,
        DeleteDocument,
        ObtenerTipoDocumentos,
        ObtenerDocumentosEstudiante,
        setBecarioActual,
        setOpenPopup,

        documentosEconomicosOpcionalesDisponibles,
        handleAgregarDocumentoEconomico,
        handleChange,
        handleDocumentoChange,
        handleDocumentoDelete,
        setDocumentoAEliminar,
        proyectosRows,
        serviciosRows,

        setFormBeca,
        handleClose,
        saving,
        datosPerfil,
        formBeca,
        documentosRequeridos,
        setDocumentosRequeridos,
        documentosEconomicaVisibles,
        handleDialogSave,
        handleDocumentoEconomicoDelete,
        uploadingDocumentoId,
      }}
    >
      {children}
    </ScholarshipsContext.Provider>
  );
}
