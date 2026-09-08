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
import { generateColumns,generateRows} from "../../../utils/datagrid.utils.jsx";

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
    setDialogOpen,
    setDialogData,
    setDialogError,
    setDialogSaving,
  } = useNotification();

  // Estados globales de Diálogo

  const [deleteId, setDeleteId] = useState(null);

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
    openDialog("linkFrecuentes","create",EMPTY_LINKFRECUENTE);
  }, [openDialog]);

  const openDeleteLinksFrecuentes = useCallback((row) => {
    openDialog("linkFrecuentes","delete",row);
  }, [openDialog]);

  const handleCopyLinkFrecuente = useCallback(async (hipervinculo) => {
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
  }, [showNotification]);

    const handleCopyLink = useCallback((link) => {
        handleCopyLinkFrecuente(link);
    }, [handleCopyLinkFrecuente]);

    const handleDeleteLink = useCallback((row) => {
        openDeleteLinksFrecuentes(row);
    }, [openDeleteLinksFrecuentes]);

    const consultationActions = useMemo(() => [{
        icon: ContentCopyIcon,
        color: "primary",
        title: "Copiar Link",
        onClick: handleCopyLink, 
    },{
        icon: DeleteIcon,
        color: "primary",
        title: "Eliminar Link",
        onClick: handleDeleteLink, 
    }
  ], [handleDeleteLink,handleCopyLink]);

    const linksFrecuentesColumns = useMemo(() => {
      return generateColumns(EMPTY_LINKFRECUENTE, consultationActions);
    }, [consultationActions]); 

  const handleLinksFrecuentesSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      if (!isValidHyperlink(dialogData.hipervinculo)) {
        throw new Error(C.errorLink);
      }
      if(isEmpty(dialogData.titulo)){
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
        throw new Error(
          C.errorNoUpdate,
        );
      }
      setDialogOpen(false);
      setDialogData(EMPTY_LINKFRECUENTE);
      fetchLinksFrecuentes();
      showNotification(
        dialogMode === "create"
          ? C.creationMsg
          :C.updateMSg,"success"
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
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
