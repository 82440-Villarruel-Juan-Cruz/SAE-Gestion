import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Box, IconButton, Chip, Tooltip, Typography } from "@mui/material";
import { ConsultationContext } from "../employedContext";
import {
  CrearLinkFrecuentes,
  EliminarLinkFrecuentes,
  BuscarLinkFrecuentes,
} from "../../../api/EmpleadoService";

import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { LINK_FRECUENTE_ICONS } from "../../../utils/util.jsx";
import { isValidHyperlink } from "../../../utils/validation.utils.js";
import {
  generateColumns,
  generateRows,
} from "../../../utils/datagrid.utils.jsx";

import { useNotification } from "../../../shared/context/sharedContext";
import { EMPTY_LINKFRECUENTE } from "../../../utils/common/common.config.js";
import { CONSULTATIONS_STRINGS } from "../../../utils/strings/employed.strings.js";
import { mapLinks } from "../../../api/formatters/ConsultationFormatters.js";
import { isEmpty } from "../../../utils/text.utils.js";

const C = CONSULTATIONS_STRINGS;
export const ConsultationProvider = ({ children }) => {
  const {
    showNotification,
    openDialog,
    dialogData,
    dialogMode,
    handleDataChange,
    setDialogOpen,
    setDialogData,
    setDialogError,
    setDialogSaving,
  } = useNotification();

  // Estados globales de Diálogo

  const [deleteId, setDeleteId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const resetValidation = useCallback(() => {
    setFieldErrors({});
  }, []);

  const validateField = useCallback((field, value) => {
    switch (field) {
      case "titulo":
        return isEmpty(value) ? C.errorName : "";
      case "hipervinculo":
        if (isEmpty(value)) return C.errorRequiredLink;
        return isValidHyperlink(value) ? "" : C.errorLink;
      default:
        return "";
    }
  }, []);

  const validateDialog = useCallback(
    (data = dialogData) => {
      const fields = ["titulo", "hipervinculo"];
      const errors = fields.reduce((result, field) => {
        const message = validateField(field, data[field]);
        if (message) result[field] = message;
        return result;
      }, {});

      setFieldErrors(errors);
      setDialogError("");
      return Object.keys(errors).length === 0;
    },
    [dialogData, setDialogError, validateField],
  );

  const handleDialogChange = useCallback(
    (field, value) => {
      handleDataChange(field, value);
      setFieldErrors((previous) => ({
        ...previous,
        [field]: validateField(field, value),
      }));
    },
    [handleDataChange, validateField],
  );

  //Secciones linksFrecuentes
  //const [linksFrecuentes,setLinksFrecuentes] = useState([]);
  const [linksFrecuentesRows, setLinksFrecuentesRows] = useState([]);
  const [loadingLinksFrecuentes, setLoadingLinksFrecuentes] = useState(false);

  const fetchLinksFrecuentes = useCallback(async () => {
    setLoadingLinksFrecuentes(true);
    try {
      let data = await BuscarLinkFrecuentes();
      //setLinksFrecuentes(data);
      setLinksFrecuentesRows(generateRows(data.map(mapLinks)));
    } catch {
      setLinksFrecuentesRows([]);
    } finally {
      setLoadingLinksFrecuentes(false);
    }
  }, []);

  useEffect(() => {
    fetchLinksFrecuentes();
  }, [fetchLinksFrecuentes]);

  const openCreatelinksFrecuentes = useCallback(() => {
    resetValidation();
    openDialog("linkFrecuentes", "create", EMPTY_LINKFRECUENTE);
  }, [openDialog, resetValidation]);

  const openDeleteLinksFrecuentes = useCallback(
    (row) => {
      openDialog("linkFrecuentes", "delete", row);
    },
    [openDialog],
  );

  const handleCopyLinkFrecuente = useCallback(
    async (hipervinculo) => {
      if (!hipervinculo) {
        showNotification(C.errorNoLink, "warning", 2000);
        return;
      }
      try {
        await navigator.clipboard.writeText(hipervinculo);
        showNotification(C.copyLinkMsg, "success", 2000);
      } catch {
        showNotification(C.errorCopyLink, "error", 2000);
      } finally {
        // setSnackbarOpen(true);
      }
    },
    [showNotification],
  );

  const handleCopyLink = useCallback(
    (link) => {
      handleCopyLinkFrecuente(link.hipervinculo);
    },
    [handleCopyLinkFrecuente],
  );

  const handleDeleteLink = useCallback(
    (row) => {
      openDeleteLinksFrecuentes(row);
    },
    [openDeleteLinksFrecuentes],
  );

  const consultationActions = useMemo(
    () => [
      {
        icon: ContentCopyIcon,
        color: "primary",
        title: "Copiar Link",
        onClick: handleCopyLink,
      },
      {
        icon: DeleteIcon,
        color: "error",
        title: "Eliminar Link",
        onClick: handleDeleteLink,
      },
    ],
    [handleDeleteLink, handleCopyLink],
  );

  const linksFrecuentesColumns = useMemo(() => {
    return generateColumns(EMPTY_LINKFRECUENTE, consultationActions);
  }, [consultationActions]);

  const handleLinksFrecuentesSave = async () => {
    if (!validateDialog()) return;

    setDialogSaving(true);
    setDialogError("");
    try {
      if (!isValidHyperlink(dialogData.hipervinculo)) {
        throw new Error(C.errorLink);
      }
      if (isEmpty(dialogData.titulo)) {
        throw new Error(C.errorName);
      }
      const { id } = dialogData;
      let id_nuevo = id === "" ? 0 : id;
      const body = {
        id: id_nuevo,
        titulo: dialogData.titulo ?? "Sin Título",
        id_index_ico: Number(dialogData.id_index_ico) || 0,
        hipervinculo: dialogData.hipervinculo,
        contador_clicks: Number(dialogData.contador_clicks) || 0,
        activo: dialogMode === "create" ? true : dialogData.activo,
      };

      if (dialogMode === "create") {
        await CrearLinkFrecuentes(body);
      } else if (dialogMode === "edit") {
        throw new Error(C.errorNoUpdate);
      }
      resetValidation();
      setDialogOpen(false);
      setDialogData(EMPTY_LINKFRECUENTE);
      fetchLinksFrecuentes();
      showNotification(
        dialogMode === "create" ? C.creationMsg : C.updateMSg,
        "success",
      );
    } catch (err) {
      setDialogError(err.message || C.errorMsg);
      //showNotification(C.errorMsg, "error", 2000);
    } finally {
      setDialogSaving(false);
    }
  };

  const handleLinksFrecuenteDelete = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      await EliminarLinkFrecuentes(deleteId ?? dialogData.id);
      setDeleteId(null);
      fetchLinksFrecuentes();
      setDialogOpen(false);
      setDialogData(EMPTY_LINKFRECUENTE);
      showNotification(C.deleteMsg, "warning");
    } catch (err) {
      setDialogError(err.message);
    } finally {
      setDialogSaving(false);
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        // ABM Link Frecuentes
        linksFrecuentesRows,
        linksFrecuentesColumns,
        loadingLinksFrecuentes,
        openCreatelinksFrecuentes,
        handleLinksFrecuentesSave,
        handleLinksFrecuenteDelete,
        linksFrecuentesIcons: LINK_FRECUENTE_ICONS,
        fieldErrors,
        setFieldErrors,
        validateField,
        validateDialog,
        handleDialogChange,
        resetValidation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
