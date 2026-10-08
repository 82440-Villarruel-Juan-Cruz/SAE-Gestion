import { useCallback, useMemo, useState } from "react";

import {
  getDocumentExtension,
  getDocumentId,
  getDocumentName,
  getFileExtension,
  getFileName,
  getImageSource,
  isFile,
  isPreviewableDocument,
} from "../../utils/documents.utils";
import { DOCUMENT_PREVIEW_DEFAULT_MESSAGES } from "../../utils/common/constants";

import { INITIAL_PREVIEW } from "../../utils/common/common.config";

export function useDocumentPreview({ downloadById, messages = {} }) {
  const text = useMemo(
    () => ({ ...DOCUMENT_PREVIEW_DEFAULT_MESSAGES, ...messages }),
    [messages],
  );
  const [preview, setPreview] = useState(INITIAL_PREVIEW);

  const closePreview = useCallback(() => {
    setPreview(INITIAL_PREVIEW);
  }, []);

  const openPreview = useCallback(
    async (document, titleOverride = "") => {
      if (isFile(document)) {
        const title = titleOverride || getFileName(document, text.fallbackTitle);
        const previewDocument = {
          nombre_documento: getFileName(document, text.fallbackName),
          extension: getFileExtension(document),
        };

        setPreview({
          open: true,
          loading: true,
          doc: null,
          title,
          error: "",
        });

        if (!isPreviewableDocument(previewDocument)) {
          setPreview((currentPreview) => ({
            ...currentPreview,
            loading: false,
            error: text.notSupported,
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = () =>
          setPreview({
            open: true,
            loading: false,
            doc: {
              ...previewDocument,
              datos_documento: reader.result,
            },
            title,
            error: "",
          });
        reader.onerror = () =>
          setPreview((currentPreview) => ({
            ...currentPreview,
            loading: false,
            error: text.loadError,
          }));
        reader.readAsDataURL(document);
        return;
      }

      const documentId = getDocumentId(document);
      const title =
        titleOverride || getDocumentName(document, text.fallbackTitle);

      setPreview({
        open: true,
        loading: true,
        doc: null,
        title,
        error: "",
      });

      if (!documentId) {
        setPreview((currentPreview) => ({
          ...currentPreview,
          loading: false,
          error: text.noId,
        }));
        return;
      }

      try {
        const downloadedResponse = await downloadById(documentId);
        const downloadedDocument = Array.isArray(downloadedResponse)
          ? downloadedResponse[0]
          : downloadedResponse;
        const previewDocument = {
          ...document,
          ...(downloadedDocument ?? {}),
        };

        if (
          !isPreviewableDocument(previewDocument) &&
          !isPreviewableDocument(document)
        ) {
          setPreview((currentPreview) => ({
            ...currentPreview,
            loading: false,
            error: text.notSupported,
          }));
          return;
        }

        setPreview({
          open: true,
          loading: false,
          doc: previewDocument,
          title,
          error: "",
        });
      } catch (error) {
        console.error("Error al descargar documento:", error);
        setPreview((currentPreview) => ({
          ...currentPreview,
          loading: false,
          error: text.loadError,
        }));
      }
    },
    [downloadById, text],
  );

  const downloadPreview = useCallback(() => {
    if (!preview.doc) return;

    const imageSource = getImageSource(preview.doc);
    if (!imageSource) return;

    const extension = getDocumentExtension(preview.doc);
    const fileName = getDocumentName(
      preview.doc,
      preview.title || text.fallbackName,
    );
    const downloadName = fileName.includes(".")
      ? fileName
      : `${fileName}.${extension || "jpg"}`;

    const link = document.createElement("a");
    link.href = imageSource;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [preview.doc, preview.title, text.fallbackName]);

  const dialogProps = useMemo(
    () => ({
      open: preview.open,
      onClose: closePreview,
      title: getDocumentName(preview.doc, preview.title || text.fallbackTitle),
      imageSrc: preview.doc ? getImageSource(preview.doc) : "",
      isPdf: getDocumentExtension(preview.doc) === "pdf",
      loading: preview.loading,
      error: preview.error,
      onDownload: downloadPreview,
    }),
    [closePreview, downloadPreview, preview, text.fallbackTitle],
  );

  return {
    preview,
    openPreview,
    closePreview,
    downloadPreview,
    dialogProps,
  };
}
