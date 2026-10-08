import { useState, useCallback, useEffect, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

import {
  CrearCompra,
  CrearDocumentoCompra,
  CrearInforme,
  DescargarDocumentacionXId,
  EliminarCompra,
  EliminarDocumentoCompra,
  ModificarInforme,
  ObtenerComprasXFecha,
} from "../../../api/CompraService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { PurchaseContext } from "../employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import { useDocumentPreview } from "../../../shared/hooks/useDocumentPreview";
import {
  buildDocumentName,
  getFileExtension,
  getFileName,
  isFile,
  renameFile,
  sanitizeFileNamePart,
  validateDocumentFile,
} from "../../../utils/documents.utils.js";
import { formatDate } from "../../../utils/date.utils.js";
import { generateColumns } from "../../../utils/datagrid.utils.jsx";
import { normalizeCurrencyValue } from "../../../utils/formatters.utils.js";
import {
  PURCHASE_DOCUMENTS,
  EMPTY_PURCHASES,
} from "../../../utils/common/common.config.js";
import { COMPRAS_STRINGS } from "../../../utils/strings/employed.strings.js";
import {
  buildCompraBody,
  buildInformeBody,
  clonePurchase,
  generatePurchaseRows,
  PURCHASE_COLUMNS_SAMPLE,
} from "../../../api/formatters/CompraFormatter.js";

const C = COMPRAS_STRINGS;

const getDefaultPurchaseDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1,
  );

  return {
    fechaDesde: formatDate(firstDayOfMonth, "input"),
    fechaHasta: formatDate(today, "input"),
  };
};

const isRequiredPurchaseDataComplete = (purchase) => {
  const precioSugerido = normalizeCurrencyValue(purchase.precio_sugerido);

  return (
    purchase.id_usuario !== null &&
    purchase.id_usuario !== undefined &&
    purchase.id_usuario !== "" &&
    Boolean(String(purchase.nombre_compra ?? "").trim()) &&
    precioSugerido !== "" &&
    precioSugerido !== null &&
    precioSugerido !== undefined &&
    !Number.isNaN(Number(precioSugerido)) &&
    Boolean(String(purchase.motivo ?? "").trim()) &&
    Boolean(String(purchase.fecha_compra ?? "").trim())
  );
};

const hasInvoiceDocument = (purchase = {}) =>
  (purchase.facturas_documentos || []).length > 0;

const isInformeComplete = (informe = {}) => {
  const precioReal = normalizeCurrencyValue(informe.precio_real);

  return (
    Boolean(String(informe.nro_expediente ?? "").trim()) &&
    precioReal !== "" &&
    precioReal !== null &&
    precioReal !== undefined &&
    !Number.isNaN(Number(precioReal)) &&
    Boolean(String(informe.fecha_licitacion ?? "").trim()) &&
    Boolean(String(informe.fecha_informe ?? "").trim()) &&
    Boolean(String(informe.nombre_solicitante ?? "").trim()) &&
    Boolean(String(informe.nombre_ganador ?? "").trim())
  );
};

const hasInformeData = (informe = {}) =>
  [
    informe.nro_expediente,
    informe.precio_real,
    informe.fecha_licitacion,
    informe.fecha_informe,
    informe.nombre_solicitante,
    informe.nombre_ganador,
  ].some(
    (value) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

export function PurchaseProvider({ children }) {
  const {
    showNotification,
    dialogData,
    dialogType,
    dialogMode,
    setDialogData,
    setDialogError,
    setDialogSaving,
    handleDataChange,
    closeDialog,
    openDialog,
  } = useNotification();

  const [purchasesRows, setPurchaseRows] = useState([]);
  const [loadingPurchase, setLoadingPurchase] = useState(true);

  const [purchaseDocumentTypes, setPurchaseDocumentTypes] = useState(() =>
    PURCHASE_DOCUMENTS.map((documentType) => ({ ...documentType })),
  );

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const documentTypes = await obtenerTiposDocumento();
        setPurchaseDocumentTypes(
          PURCHASE_DOCUMENTS.map((documento) => {
            const match = documentTypes?.find(
              (type) =>
                type.nombre.trim().toLowerCase() ===
                documento.nombre.trim().toLowerCase(),
            );

            return match
              ? {
                  ...documento,
                  id_tipo_documento: match.id,
                  extension: match.extension ?? documento.extension,
                }
              : { ...documento };
          }),
        );
      } catch (error) {
        setDialogError(error.message || C.loadDocumentTypesError);
      }
    };

    fetchDocumentTypes();
  }, []);

  const fetchPurchases = useCallback(
    async (fechaDesde, fechaHasta) => {
      const defaultRange = getDefaultPurchaseDateRange();
      const from = fechaDesde || defaultRange.fechaDesde;
      const to = fechaHasta || defaultRange.fechaHasta;

      setLoadingPurchase(true);
      try {
        const data = await ObtenerComprasXFecha(
          from,
          to,
          purchaseDocumentTypes,
        );
        const purchases = Array.isArray(data) ? data : [];

        setPurchaseRows(generatePurchaseRows(purchases));
      } catch {
        setPurchaseRows([]);
      } finally {
        setLoadingPurchase(false);
      }
    },
    [purchaseDocumentTypes],
  );

  const openCreatePurchases = useCallback(() => {
    openDialog("purchases", "create", clonePurchase());
  }, [openDialog]);

  const openEditDocs = useCallback(
    (row) => {
      openDialog("docs", "docs", clonePurchase(row));
    },
    [openDialog],
  );

  const handleOpenEditDocs = useCallback(
    (row) => {
      openEditDocs(row);
    },
    [openEditDocs],
  );

  const openDeletePurchase = useCallback(
    (row) => {
      openDialog("purchaseDelete", "delete", clonePurchase(row));
    },
    [openDialog],
  );

  const handleDeletePurchase = useCallback(
    async (fechaDesde, fechaHasta) => {
      const idCompra = dialogData.id;
      if (!idCompra) {
        setDialogError(C.deleteMissingId);
        return;
      }

      try {
        setDialogSaving(true);
        await EliminarCompra(idCompra);
        await fetchPurchases(fechaDesde, fechaHasta);
        closeDialog();
        showNotification(C.deleteSuccess, "success");
      } catch (error) {
        setDialogError(error.message || C.deleteError);
        showNotification(error.message || C.deleteError, "error");
      } finally {
        setDialogSaving(false);
      }
    },
    [
      dialogData,
      closeDialog,
      fetchPurchases,
      setDialogError,
      setDialogSaving,
      showNotification,
    ],
  );

  const [focusedCurrencyField, setFocusedCurrencyField] = useState("");
  const {
    dialogProps: preview,
    closePreview,
    openPreview,
  } = useDocumentPreview({
    downloadById: DescargarDocumentacionXId,
  });

  const handlePreview = useCallback(
    (documentOrId, nombre) => {
      const document =
        typeof documentOrId === "object"
          ? documentOrId
          : { id: documentOrId, nombre_documento: nombre };

      return openPreview(document, nombre);
    },
    [openPreview],
  );

  const handleInformeTecnicoChange = useCallback((field, value) => {
    setDialogData((prev) => ({
      ...prev,
      informe: {
        ...(prev.informe || {}),
        [field]: value,
      },
    }));
  }, []);

  const handleEmpleadoChange = useCallback(
    (_event, empleado) => {
      handleDataChange("id_usuario", empleado?.id ?? null);
      handleDataChange("nombre_usuario", empleado?.nombre_empleado ?? "");
    },
    [handleDataChange],
  );

  const isPurchaseDataComplete = useMemo(
    () => isRequiredPurchaseDataComplete(dialogData),
    [dialogData],
  );

  const handleFacturaChange = useCallback(
    (event, documentType) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      if (!isRequiredPurchaseDataComplete(dialogData)) {
        setDialogError(C.documentValidation.incompletePurchaseData);
        event.target.value = "";
        return;
      }

      const compraName = sanitizeFileNamePart(dialogData.nombre_compra);
      const existingCount = dialogData.facturas_documentos?.length || 0;
      const renamedFiles = [];

      for (const [index, file] of files.entries()) {
        const validationError = validateDocumentFile(
          file,
          documentType,
          C.documentValidation,
        );
        if (validationError) {
          setDialogError(validationError);
          event.target.value = "";
          return;
        }

        const extension = getFileExtension(file);
        const fileName = buildDocumentName(
          documentType.formatoNombre,
          {
            nombreCompra: compraName,
            nro: existingCount + index + 1,
          },
          extension,
        );
        renamedFiles.push(renameFile(file, fileName));
      }

      setDialogData((prev) => ({
        ...prev,
        facturas_documentos: [
          ...(prev.facturas_documentos || []),
          ...renamedFiles,
        ],
      }));
      setDialogError("");
      event.target.value = "";
    },
    [dialogData],
  );

  const handleInformePdfChange = useCallback(
    (event, documentType) => {
      const file = event.target.files?.[0] || null;
      if (!file) return;

      if (!isRequiredPurchaseDataComplete(dialogData)) {
        setDialogError(C.documentValidation.incompletePurchaseData);
        event.target.value = "";
        return;
      }

      const validationError = validateDocumentFile(
        file,
        documentType,
        C.documentValidation,
      );
      if (validationError) {
        setDialogError(validationError);
        event.target.value = "";
        return;
      }

      const compraName = sanitizeFileNamePart(dialogData.nombre_compra);
      const extension = getFileExtension(file);
      const fileName = buildDocumentName(
        documentType.formatoNombre,
        { nombreCompra: compraName },
        extension,
      );

      handleInformeTecnicoChange("documento_pdf", renameFile(file, fileName));
      setDialogError("");
      event.target.value = "";
    },
    [dialogData, handleInformeTecnicoChange],
  );

  const handleRemoveFactura = useCallback(
    async (indexToRemove) => {
      const factura = dialogData.facturas_documentos?.[indexToRemove];
      const idDocumento = factura?.id;

      try {
        if (idDocumento) await EliminarDocumentoCompra(idDocumento);
        setDialogData((prev) => ({
          ...prev,
          facturas_documentos: (prev.facturas_documentos || []).filter(
            (_file, index) => index !== indexToRemove,
          ),
        }));
        setDialogError("");
      } catch (error) {
        setDialogError(
          error.message || C.documentValidation.deleteInvoiceError,
        );
      }
    },
    [dialogData.facturas_documentos],
  );

  const handleDeletePurchaseDocument = useCallback(
    async (documentType) => {
      try {
        if (documentType.key === "facturas") {
          const facturas = dialogData.facturas_documentos || [];
          await Promise.all(
            facturas
              .map((document) => document?.id)
              .filter(Boolean)
              .map((idDocumento) => EliminarDocumentoCompra(idDocumento)),
          );
          setDialogData((prev) => ({
            ...prev,
            facturas_documentos: [],
          }));
          setDialogError("");
          return;
        }

        const idDocumento = dialogData.informe?.documento_pdf?.id;
        if (idDocumento) await EliminarDocumentoCompra(idDocumento);
        handleInformeTecnicoChange("documento_pdf", null);
        setDialogError("");
      } catch (error) {
        setDialogError(error.message || C.deleteDocumentError);
      }
    },
    [
      dialogData.facturas_documentos,
      dialogData.informe?.documento_pdf,
      handleInformeTecnicoChange,
    ],
  );

  const purchaseDocuments = useMemo(
    () =>
      purchaseDocumentTypes.map((documentType) => {
        if (documentType.key === "facturas") {
          const facturas = dialogData.facturas_documentos || [];

          return {
            ...documentType,
            subido: facturas.length > 0,
            documentos: facturas,
            id_archivo: facturas.length === 1 ? facturas[0]?.id : null,
            archivoNombre:
              facturas.length === 1
                ? getFileName(facturas[0])
                : facturas.length > 1
                  ? C.attachedInvoices(facturas.length)
                  : "",
          };
        }

        const informe = dialogData.informe?.documento_pdf;

        return {
          ...documentType,
          subido: Boolean(informe),
          documentos: informe ? [informe] : [],
          id_archivo: informe?.id ?? null,
          archivoNombre: getFileName(informe),
        };
      }),
    [
      dialogData.facturas_documentos,
      dialogData.informe?.documento_pdf,
      purchaseDocumentTypes,
    ],
  );

  const handlePurchasesSave = useCallback(
    async (purchaseData = dialogData, fechaDesde, fechaHasta) => {
      setDialogSaving(true);
      setDialogError("");
      try {
        const purchaseToSave = clonePurchase(purchaseData);

        let idCompra = purchaseToSave.id;

        if (dialogMode === "create") {
          const createdPurchase = await CrearCompra(
            buildCompraBody(purchaseToSave),
          );
          idCompra = createdPurchase?.id ?? idCompra;
        }

        if (!idCompra) {
          throw new Error(C.saveMissingPurchaseId);
        }

        const facturaDocumentType = purchaseDocumentTypes.find(
          (documentType) => documentType.key === "facturas",
        );
        const informeDocumentType = purchaseDocumentTypes.find(
          (documentType) => documentType.key === "informe",
        );

        const informe = purchaseToSave.informe || {};
        if (isInformeComplete(informe)) {
          const informeBody = buildInformeBody(purchaseToSave, idCompra);
          const nroExpediente =
            informe.nro_expediente ?? informe.nroExpediente ?? null;

          if (dialogMode === "docs" && nroExpediente) {
            await ModificarInforme(nroExpediente, informeBody);
          } else {
            await CrearInforme(informeBody);
          }
        }

        await Promise.all(
          (purchaseToSave.facturas_documentos || [])
            .filter(isFile)
            .map((file) => {
              if (!facturaDocumentType?.id_tipo_documento) {
                throw new Error(C.saveMissingInvoiceType);
              }

              return CrearDocumentoCompra(
                idCompra,
                facturaDocumentType.id_tipo_documento,
                file,
              );
            }),
        );

        if (isFile(purchaseToSave.informe?.documento_pdf)) {
          if (!informeDocumentType?.id_tipo_documento) {
            throw new Error(C.saveMissingReportType);
          }

          await CrearDocumentoCompra(
            idCompra,
            informeDocumentType.id_tipo_documento,
            purchaseToSave.informe.documento_pdf,
          );
        }

        closeDialog();
        const purchaseDate = purchaseToSave.fecha_compra;
        const refreshFrom =
          purchaseDate && (!fechaDesde || purchaseDate < fechaDesde)
            ? purchaseDate
            : fechaDesde;
        const refreshTo =
          purchaseDate && (!fechaHasta || purchaseDate > fechaHasta)
            ? purchaseDate
            : fechaHasta;

        await fetchPurchases(refreshFrom, refreshTo);
        showNotification(
          dialogMode === "create"
            ? C.saveSuccessCreate
            : dialogMode === "docs"
              ? C.saveSuccessDocs
              : C.saveSuccessUpdate,
          "success",
        );
      } catch (err) {
        setDialogError(err.message || C.saveError);
        showNotification(err.message || C.saveError, "error");
      } finally {
        setDialogSaving(false);
      }
    },
    [
      dialogData,
      dialogMode,
      closeDialog,
      fetchPurchases,
      purchaseDocumentTypes,
      setDialogError,
      setDialogSaving,
      showNotification,
    ],
  );

  const handlePurchaseDialogSave = useCallback(
    (fechaDesde, fechaHasta) => {
      if (
        dialogType === "purchases" &&
        !isRequiredPurchaseDataComplete(dialogData)
      ) {
        setDialogError(C.saveRequiredPurchaseData);
        return;
      }

      if (dialogMode === "create" && !hasInvoiceDocument(dialogData)) {
        setDialogError(C.saveRequiredInvoice);
        return;
      }

      if (
        dialogMode === "require-complete-informe" &&
        hasInformeData(dialogData.informe) &&
        !isInformeComplete(dialogData.informe)
      ) {
        setDialogError(C.saveRequiredReport);
        return;
      }

      handlePurchasesSave(
        {
          ...dialogData,
          precio_sugerido: normalizeCurrencyValue(dialogData.precio_sugerido),
          informe: {
            ...(dialogData.informe || {}),
            precio_real: normalizeCurrencyValue(
              dialogData.informe?.precio_real,
            ),
          },
        },
        fechaDesde,
        fechaHasta,
      );
    },
    [dialogData, dialogMode, dialogType, handlePurchasesSave],
  );

  const [warningOpen, setWarningOpen] = useState(false);

  const handleConfirmWithoutInforme = useCallback(
    (fechaDesde, fechaHasta) => {
      setWarningOpen(false);
      handlePurchaseDialogSave(fechaDesde, fechaHasta);
    },
    [handlePurchaseDialogSave],
  );

  const handleSavePurchase = useCallback(
    (fechaDesde, fechaHasta) => {
      if (
        dialogMode === "create" &&
        isPurchaseDataComplete &&
        (dialogData.facturas_documentos || []).length > 0 &&
        !isInformeComplete(dialogData.informe)
      ) {
        setWarningOpen(true);
        return;
      }

      handlePurchaseDialogSave(fechaDesde, fechaHasta);
    },
    [
      dialogData.facturas_documentos,
      dialogData.informe,
      dialogMode,
      handlePurchaseDialogSave,
      isPurchaseDataComplete,
    ],
  );

  const purchaseActions = useMemo(
    () => [
      {
        icon: FolderIcon,
        title: C.actionViewDocuments,
        onClick: handleOpenEditDocs,
      },
      {
        icon: DeleteIcon,
        title: C.actionDeletePurchase,
        onClick: openDeletePurchase,
      },
    ],
    [handleOpenEditDocs, openDeletePurchase],
  );

  const purchasesColumns = useMemo(
    () =>
      generateColumns(PURCHASE_COLUMNS_SAMPLE, purchaseActions, {
        fecha_compra: {
          valueFormatter: (value) => formatDate(value, "display"),
        },
      }),
    [purchaseActions],
  );

  return (
    <PurchaseContext.Provider
      value={{
        purchasesRows,
        purchasesColumns,
        loadingPurchase,
        fetchPurchases,
        openCreatePurchases,
        handleDeletePurchase,
        handlePurchasesSave,
        handlePurchaseDialogSave,
        handleSavePurchase,
        handleConfirmWithoutInforme,
        warningOpen,
        setWarningOpen,
        handleDialogChange: handleDataChange,
        handleInformeTecnicoChange,
        handleEmpleadoChange,
        focusedCurrencyField,
        setFocusedCurrencyField,
        isPurchaseDataComplete,
        isInformeReady: isInformeComplete(dialogData.informe),
        purchaseDocuments,
        handleFacturaChange,
        handleInformePdfChange,
        handleRemoveFactura,
        handleDeletePurchaseDocument,
        preview,
        closePreview,
        handlePreview,
        getDefaultPurchaseDateRange,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}
