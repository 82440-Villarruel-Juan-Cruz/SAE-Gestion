import { useState, useEffect, useCallback, useMemo } from "react";
import { formatDate } from "../../../utils/date.utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNuevaPublicacion } from "../../pages/prensa/useNuevaPublicacion";
import { useDocumentPreview } from "../../../shared/hooks/useDocumentPreview";
import { useNotification } from "../../../shared/context/sharedContext";

import { booleanChip, prioridadChip } from "../../../utils/datagrid.utils.jsx";
import { PressContext } from "../employedContext";
import { PRENSA_STRINGS } from "../../../utils/strings/employed.strings";
import {
  listarDocumentosPorPublicacion,
  listarPublicacionesCompleto,
  eliminarPublicacion,
  descargarDocumentoPorId,
} from "../../../api/PrensaService";

import { EMPTY_PUBLICACION } from "../../../utils/common/common.config";
import {
  generateRows,
  generateColumns,
} from "../../../utils/datagrid.utils.jsx";

const C = PRENSA_STRINGS;

export function PressProvider({ children }) {
  const {
    showNotification,
    dialogData,
    setDialogError,
    setDialogSaving,
    closeDialog,
    openDialog,
  } = useNotification();

  const [publicacionesRows, setPublicacionesRows] = useState([]);
  const [publicacionesLoading, setPublicacionesLoading] = useState(true);

  const fetchPublicaciones = useCallback(async () => {
    setPublicacionesLoading(true);
    try {
      const data = await listarPublicacionesCompleto();
      setPublicacionesRows(generateRows(data));
    } catch (err) {
      console.error(C.errorLoadPublicaciones, err);
      showNotification(C.errorLoadPublicaciones, "error");
      setPublicacionesRows([]);
    } finally {
      setPublicacionesLoading(false);
    }
  }, [showNotification]);

  const publication = useNuevaPublicacion({
    onSuccess: (isEdit) => {
      fetchPublicaciones();
      showNotification(isEdit ? C.snackSaved : C.snackCreated, "success");
    },
    onWarning: (message) => showNotification(message, "warning"),
    onError: (message) => showNotification(message, "error"),
  });

  const openCreatePublicacion = publication.openCreatePublication;

  const openEditPublicacion = useCallback(
    (row) => {
      publication.openEditPublication(row);
    },
    [publication],
  );

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  const handleDeletePublicacion = useCallback(
    (pub) => {
      openDialog("pressPublicationDelete", "delete", pub);
    },
    [openDialog],
  );

  const handlePreviewPublicacion = useCallback(async (pub) => {
    setSelectedPub(pub);
    setLoadingDocs(true);
    setDocumentos([]);
    try {
      const data = await listarDocumentosPorPublicacion(pub.id);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(C.errorLoadDocumentos, err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  const publicacionesActions = useMemo(
    () => [
      {
        icon: VisibilityIcon,
        color: "primary",
        title: "Vista previa",
        onClick: handlePreviewPublicacion,
      },
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar publicación",
        onClick: openEditPublicacion,
      },
      {
        icon: DeleteIcon,
        color: "error",
        title: "Eliminar publicación",
        onClick: handleDeletePublicacion,
      },
    ],
    [handleDeletePublicacion, handlePreviewPublicacion, openEditPublicacion],
  );

  const publicacionesColumns = useMemo(() => {
    return generateColumns(EMPTY_PUBLICACION, publicacionesActions, {
      prioridad: {
        headerName: "Prioridad",
        align: "center",
        headerAlign: "center",
        minWidth: 120,
        flex: 0,
        renderCell: (params) => prioridadChip(params.value),
      },
      no_dar_baja: {
        headerName: "No dar de baja",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
        flex: 0,
        renderCell: (params) => booleanChip(params.value),
      },
      fecha_vigencia: {
        valueFormatter: (value) => formatDate(value, "display"),
      },
      fecha_inicio: {
        valueFormatter: (value) => formatDate(value, "display"),
      },
    });
  }, [publicacionesActions]);

  const [selectedPub, setSelectedPub] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const documentPreview = useDocumentPreview({
    downloadById: descargarDocumentoPorId,
    messages: C.documentPreview,
  });

  const handleClose = () => {
    setSelectedPub(null);
    setDocumentos([]);
  };

  const handleDeleteConfirm = async () => {
    if (!dialogData?.id) return;
    setDialogSaving(true);
    setDialogError("");
    try {
      await eliminarPublicacion(dialogData.id);
      closeDialog();
      await fetchPublicaciones();
      showNotification(C.snackDeleted, "success");
    } catch (err) {
      console.warn("Respuesta del delete:", err);
      setDialogError(err.message || C.snackErrorDelete);
      showNotification(err.message || C.snackErrorDelete, "error");
    } finally {
      setDialogSaving(false);
    }
  };

  return (
    <PressContext.Provider
      value={{
        publicacionesRows,
        publicacionesColumns,
        publicacionesLoading,
        openCreatePublicacion,
        openEditPublicacion,

        selectedPub,
        handleClose,
        loadingDocs,
        documentos,
        handleOpenPreview: documentPreview.openPreview,
        documentPreviewDialogProps: documentPreview.dialogProps,
        ...publication,

        handleDeleteConfirm,
      }}
    >
      {children}
    </PressContext.Provider>
  );
}
