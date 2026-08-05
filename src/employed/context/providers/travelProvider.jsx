import {useState, useEffect,useCallback,useMemo,useRef} from "react";
import { IconButton, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from '@mui/icons-material/Folder';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import { ObtenerUsuariosXLegajo } from "../../../api/EmpleadoService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { ObtenerEmpresas,ObtenerViajesActivos,ObtenerInscriptosViaje, EliminarInscriptosViaje, CrearInscriptoViaje, 
    ModificarInscripto, CrearEmpresa, ModificarEmpresa, CrearViaje, ModificarViaje, ObtenerDocumentacionViaje, 
    DescargarDocumentacionXId, EliminarDocumentoViaje, 
    CrearDocumentoViaje,
    listarDocumentacionXLegajo,
    ObtenerViajesXFecha} from "../../../api/TravelService";

import { mapViajes } from "../../../api/formatters/ViajeFormatter";
import { generateRows,generateColumns } from "../../../utils/datagrid.utils.jsx";
import { normalizeCurrencyValue } from "../../../utils/formatters.utils.js";

import { useNotification } from "../../../shared/context/sharedContext";
import { TravelContext } from "../employedContext";
import { cleanObjectFields } from "../../../utils/util.jsx";
import { isEmpty } from "../../../utils/text.utils.js";

import { TRAVEL_STRINGS } from "../../../utils/strings/employed.strings.js";
import { EMPTY_DOCUMENTACION_ESTUDIANTE,EMPTY_DOCUMENTACION_VIAJE,EMPTY_VIAJES_FORM,EMPTY_VIAJES,EMPTY_BUSSINESS } from "../../../utils/common/common.config.js";
import { formatDate, toApiDateTime } from "../../../utils/date.utils.js";
import { isValidCbu, isValidCuit, isValidEmail, isValidPhone } from "../../../utils/validation.utils.js";
 
const C = TRAVEL_STRINGS;
const checkAndCleanDialogData = (data) => cleanObjectFields(data);
const isPositiveNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0;
};
const isValidTravelPlace = (value = "") => {
    const parts = String(value).split(/\s+-\s+/);
    return parts.length === 3 && parts.every((part) => !isEmpty(part));
};

export function TravelProvider({ children }){
    const navigate = useNavigate();
    const {
        showNotification,
        setDialogOpen,
        dialogType,
        setDialogType,
        dialogMode,
        setDialogMode,
        dialogData,
        setDialogSaving,
        setDialogError,
        openDialog,
        closeDialog
    } = useNotification();

    const [fieldErrors, setFieldErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    const resetValidation = useCallback(() => {
        setFieldErrors({});
        setTouchedFields({});
    }, []);
    const validateField = (field, value, data = dialogData) => {

        switch (true) {
            case field === "id":
                return dialogMode === "edit" && isEmpty(value) ? C.validationID:"";
           case field === "nombre":
                return isEmpty(value)? C.validationName:"";
            case field === "contacto":
                return isEmpty(value) || !isValidPhone(value) ? C.validationPhone : "";                   
            case field === "activo":
                return isEmpty(value)? C.validationActive:"";
            case field === "email":
                return !isValidEmail(value)? C.validationEmail:"";
            case  field === "cuit":
                return !isValidCuit(value) ? C.validationCuil : "";
            case  field === "cbu":
                return !isValidCbu(value) ? C.validationCBU : "";

            //Valores exclusivos de viaje
            case field === "fecha_inicio":
                return  isEmpty(value) ? C.validationDate:"";
            case field === "fecha_fin":
                return  isEmpty(value) ? C.validationDate:"";
            case field === "seguro":
                return  typeof value === "boolean" ? "" : C.validationActive;
            case field === "origen":
                return  isEmpty(value) || !isValidTravelPlace(value) ? C.validationPlace:"";
            case field === "destino":
                return  isEmpty(value) || !isValidTravelPlace(value)? C.validationPlace:"";
            case field === "cantidad_personas":
                return  isEmpty(value) || !isPositiveNumber(value) ? C.validationQuant:""; 

            case field === "id_empresa_viaje":
                return  isEmpty(value) || !isPositiveNumber(value) ? C.validationBuss:"";
            case field === "costo_aproximado":
                return  isEmpty(value) || !isPositiveNumber(value) ? C.validationCost:"";
            case field === "motivo":
                return  isEmpty(value) ? C.validationMotive:""; 
                
            default:
                return data?C.validationActive:"";
        }

    };
    const validate = () => {

        const fields = dialogType === "bussiness"? 
        ["id","nombre","contacto","email","cuit","cbu","activo"]:
        ["id","nombre","fecha_inicio","fecha_fin","seguro","origen","destino","cantidad_personas","id_empresa_viaje","costo_aproximado","motivo"];//Depende el objeto es el tipo de estructura

        const errors = fields.reduce((result, field) => {
            const message = validateField(field, dialogData[field]);
            return message ? { ...result, [field]: message } : result;
        }, {});
        setFieldErrors(errors);
        setTouchedFields(
            fields.reduce((result, field) => ({ ...result, [field]: true }), {}),
        );
        return Object.keys(errors).length === 0;
    };

    const [travelData, setTravelData] = useState(null);

    const [inscriptsTravel,setInscriptsTravel] = useState(null);
    const [loadingInscripts,setLoadingInscripts] = useState(false);
    const fetchInscriptosXTravel = useCallback(async (idViaje) => {
        
        if (!idViaje) return; 
        setLoadingInscripts(true);
        try {
            const data = await ObtenerInscriptosViaje(idViaje);
            setInscriptsTravel(data);
        } catch {
            setInscriptsTravel([]);
            setDialogError(C.errorNoInscFound)
        }
        finally{
            setLoadingInscripts(false)
        }
    }, [setDialogError])
    
    useEffect(() => { fetchInscriptosXTravel(); }, [fetchInscriptosXTravel]);

    const [bussiness, setBussiness] = useState([]);
    const [bussinessRows, setBussinessRows] = useState([]);
    const [loadingBussiness, setLoadingBussiness] = useState(true);
    const fetchBussiness = useCallback(async () => {
        setLoadingBussiness(true);
        try {
            const data = await ObtenerEmpresas(); 
            setBussiness(data);
            setBussinessRows(generateRows(data));
        } catch {
            setBussiness([]);
            setBussinessRows([]);
        } finally {
            setLoadingBussiness(false);
        }
    }, []);
    useEffect(() => {
        fetchBussiness();
    }, [fetchBussiness]);

    const openCreateBussiness = () => {
        resetValidation();
        openDialog("bussiness", "create", EMPTY_BUSSINESS);
    };

    const openEditBussiness = useCallback((row) => {
        resetValidation();
        openDialog("bussiness", "edit", row);
    }, [openDialog, resetValidation]);

    const handleOpenEditBussiness = useCallback((row) => {
    openEditBussiness(row);
    }, [openEditBussiness]);

    const handleBussinessSave  = async () => {
        if(!validate())return;
        setDialogSaving(true);
        setDialogError("");
        try {
            const { isValid, cleanedData } = checkAndCleanDialogData(dialogData);

            // Si el booleano es falso, cortamos la ejecución aquí
            if (!isValid) {
                setDialogError(C.errorSavingBuss);
                return; 
            }


            const { id, ...rest } = cleanedData;
            let id_nuevo = id ===""? 0:id;
            
            const body = {
                    ...rest,
                    id: id_nuevo
                };
                
            if (dialogMode === "create")
            {
                await CrearEmpresa(body);
            }
            else{
                await ModificarEmpresa(id_nuevo,body);
            }
            await fetchBussiness();
            closeDialog();
            showNotification(dialogMode === "create"? C.businessCreated:C.businessEdited,"success");
        }
        catch (err) {
            setDialogError(err.message || C.errorSavingBuss);
            //showNotification(err.message || "Ocurrió un error al guardar", "error");
        } finally {
            setDialogSaving(false);
            resetValidation();
        }
    };
    const [travels, setTravels] = useState([]); 
    const [travelsRows, setTravelsRows] = useState([]);
    const [loadingTravels, setLoadingTravels] = useState(true);
    const fetchTravels = useCallback(async () => {
        setLoadingTravels(true);
        try {
             let data = await ObtenerViajesActivos(); 
             data = data.map(mapViajes);
             setTravels(data);
            const datosLimpios = data.map(viaje => {
            const { motivo, id_empresa, ...resto } = viaje;
                if(motivo!==id_empresa)//Lo puse porque no me gusta que salga el error de variable no usada
                    return resto;
            });
            setTravelsRows(generateRows(datosLimpios));
        } catch {
            setTravels([]);
            setTravelsRows([]);
        } finally {
            setLoadingTravels(false);
        }
    }, []);
    useEffect(() => {
        fetchTravels();
    }, [fetchTravels]);

    const openCreateTravels = () => {
        resetValidation();
        openDialog("travels", "create", EMPTY_VIAJES_FORM);
    };

    const openEditTravels = useCallback((row) => {
        const viajeEncontrado = travels.find(viaje => viaje.id === Number(row.id));
        if(!viajeEncontrado) return;

        resetValidation();
        openDialog("travels", "edit", viajeEncontrado);
    }, [openDialog, resetValidation, travels]);

    const fetchDocsXTravel = useCallback(async (row) => {
            setLoadingViajeDocs(true);
            try {
                const data = await ObtenerDocumentacionViaje(row.id);
                setDocsViajeList(data);
            } catch {
                setDocsViajeList([]);
            } finally {
                setLoadingViajeDocs(false);
            }
        }, []);
        useEffect(() => {
            fetchDocsXTravel();
        }, [fetchDocsXTravel]);

    const [docsViaje, setDocsViaje] = useState("");
    const [docsViajeList, setDocsViajeList] = useState([]);
    const [loadingViajeDocs, setLoadingViajeDocs] = useState(false);
    const [downloadingDocId, setDownloadingDocId] = useState(null);

    const openSeeDocTravels = useCallback(async(row) => {
        //Es personalizado
        setDialogOpen(true);
        setLoadingViajeDocs(true);
        setDocsViaje(row);
        setDialogError("");
        setDialogType("documents");
        try {
            await fetchDocsXTravel(row);

        } catch (err) {
            setDialogError(err.message || C.errorSavingDocs);
        } finally {
            setLoadingViajeDocs(false);
        }
        
    }, [fetchDocsXTravel, setDialogError, setDialogOpen, setDialogType]);
    
    const handleTravelSave  = async () => {
        if(!validate())return;
        setDialogSaving(true);
        setDialogError("");
        try {
            const { isValid, cleanedData } = checkAndCleanDialogData(dialogData);

            // Si el booleano es falso, cortamos la ejecución aquí
            if (!isValid) {
                setDialogError(C.errorSavingTravel);
                return; 
            }

            const { id,seguro, ...rest } = cleanedData;
            let id_nuevo = id ===""? 0:id;
            
            const body = {
                    ...rest,
                    id: id_nuevo,
                    costo_aproximado: normalizeCurrencyValue(rest.costo_aproximado),
                    seguro_confirmado:seguro,
                    fecha_inicio:formatDate(cleanedData.fecha_inicio,"input"),
                    fecha_fin: formatDate(cleanedData.fecha_fin,"input")
                };

            if (dialogMode === "create")
            {
                await CrearViaje(body);
            }
            else{
                await ModificarViaje(id_nuevo,body);
            }
            await fetchTravels();
            closeDialog();
            showNotification(dialogMode === "create"? C.travelCreated:C.travelEdited);
        }
        catch (err) {
            setDialogError(err.message || C.errorSavingTravel);
        } finally {
            setDialogSaving(false);
            resetValidation();
        }
    };

    const openInscripTravels = useCallback((row) => {
        localStorage.setItem("selectedTravel", JSON.stringify(row));
        navigate("/Gestion-Viajes/Inscriptos");
        
    }, [navigate]);
    const handleOpenEditTravels = useCallback((row) => {
    openEditTravels(row);
    }, [openEditTravels]);

    const handleOpenSeeDocTravels = useCallback((row) => {
    openSeeDocTravels(row);
    }, [openSeeDocTravels]);

    const handleOpenInscripTravels = useCallback((row) => {
    openInscripTravels(row);
    }, [openInscripTravels]);

    const bussinessActions = useMemo(() => [{
    icon: EditIcon,
    color: "primary",
    title: "Editar Empresa",
    onClick: handleOpenEditBussiness, 
    }], [handleOpenEditBussiness]);

    const travelsActions = useMemo(() => [
    {
        icon: EditIcon,
        color: "primary",
        title: "Editar Viaje",
        onClick: handleOpenEditTravels,
    },
    {
        icon: FolderIcon,
        color: "primary",
        title: "Documentacion",
        onClick: handleOpenSeeDocTravels,
    },
    {
        icon: Diversity3Icon,
        color: "primary",
        title: "Inscriptos",
        onClick: handleOpenInscripTravels,
    }
    ], [handleOpenEditTravels, handleOpenSeeDocTravels, handleOpenInscripTravels]);
    
    const bussinessColumns = useMemo(() => {
    return generateColumns(EMPTY_BUSSINESS, bussinessActions);
    }, [ bussinessActions]); 

    const travelsColumns = useMemo(() => {
    return generateColumns(EMPTY_VIAJES, travelsActions);
    }, [ travelsActions]);

    const [usuarioSelected,setUsuarioSelected] = useState(null);
    const [loadingUsuario,setLoadingUsuario] = useState(false);

    const fetchUsuariosXlegajo = useCallback(async (legajo) => {
        
        if (!legajo) return; // Evita buscar si está vacío
        setLoadingUsuario(true);
        setUsuarioSelected(null);
        try {
            const data = await ObtenerUsuariosXLegajo(legajo);
            if(data && data.legajo){
                setUsuarioSelected(data);
            }
            else{
                setUsuarioSelected(null);
                setDialogError(C.errorUserNF);
            }
        } catch(error) {
            setUsuarioSelected(null);
            setDialogError(error.message||C.errorUserNF)
        }
        finally{
            setLoadingUsuario(false);
        }
    }, [setDialogError])
    
    useEffect(() => { fetchUsuariosXlegajo(); }, [fetchUsuariosXlegajo]);

    const handleAddIncriptos  = async () => {
        
        if(travelData && usuarioSelected){
            setLoadingInscripts(true);
            try {
                
                const body = {
                    id: 0,
                    id_viaje: travelData.id,
                    legajo_estudiante: usuarioSelected.legajo,
                    nombre_estudiante: "",
                    documentacion_presentada: false
                };
                await CrearInscriptoViaje(body);
                setUsuarioSelected(null);
                await fetchInscriptosXTravel(travelData.id);
                showNotification(C.inscriptsCreated,"success");
                setLoadingInscripts(false);
        }
            catch (err) {
                showNotification(err.message || C.errorSavingTravel, "error");
            } finally {
                setDialogSaving(false);
            }
        };
    }

    const [inscriptToDelete,setInscriptToDelete] = useState(null);

    const handleClickRemove  = useCallback((estudiante) =>{
        //Personalizado
        setInscriptToDelete(estudiante);
        setDialogType("inscript");
        setDialogMode("delete");
        setDialogError("");
        setDialogOpen(true);        
    }, [setDialogError, setDialogMode, setDialogOpen, setDialogType]);
 
    const handleDeleteInscript  = async () => {
        if(travelData&&inscriptToDelete){
            setDialogSaving(true);
            setDialogError("");
            try {
                let res = await EliminarInscriptosViaje(inscriptToDelete.id);
                if(res.ok){
                    await fetchInscriptosXTravel(travelData.id);
                    setDialogOpen(false);
                    setUsuarioSelected(null);
                    showNotification(C.inscriptsDeleted,"success");
                }
                else{
                    setDialogError(C.errorInscDelete);

                }
            }
            catch (err) {
                setDialogError(err.message || C.errorSavingTravel);
               // showNotification(err.message || "Ocurrió un error al guardar", "error");
            } finally {
                setDialogSaving(false);
            }
        }
        else{
            setDialogError(C.errorSavingTravel);
        }
    };  
    const handleUpdateInscriptos = async (estudiante) => {
        if(travelData && estudiante?.id){
            setDialogSaving(true);
            setDialogError("");
            try {
                await ModificarInscripto(estudiante.id,estudiante);
                
                setUsuarioSelected(null);
                showNotification(C.inscriptsUpdated,"success");
            }
            catch (err) {
                setDialogError(err.message || C.errorSavingTravel);
                //showNotification(err.message || "Ocurrió un error al guardar", "error");
            } finally {
                setDialogSaving(false);
            }
        }
        else{
            setDialogError(C.errorSavingTravel);
        }
    };
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewSrc, setPreviewSrc] = useState(null);
    const [previewIsPdf, setPreviewIsPdf] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [previewError, setPreviewError] = useState("");
    const [previewDocRef, setPreviewDocRef] = useState(null);

    const handlePreviewDoc = useCallback(async (doc) => {
        setPreviewTitle(doc.nombre_documento);
        setPreviewSrc(null);
        setPreviewError("");
        setPreviewIsPdf(false);
        setPreviewDocRef(doc);
        setLoadingPreview(true);
        setPreviewOpen(true);
        try {
        const data = await DescargarDocumentacionXId(doc.id);
        const fetched = Array.isArray(data) ? data[0] : data;
        const ext = (fetched.extension || doc.extension || "").toLowerCase();
        // Si datos_documento ya es un dataURL (comienza con data:), usarlo como está
        // Si no, es base64, convertirlo a dataURL
        let src = fetched.datos_documento;
        if (!src.startsWith("data:")) {
            const mimeMap = {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
            };
            const mime = mimeMap[ext] || "application/octet-stream";
            src = `data:${mime};base64,${src}`;
        }
        setPreviewSrc(src);
        setPreviewIsPdf(ext === "pdf");
        } catch (err) {
            setDialogError(C.errorInscriptsDoc);
            setPreviewError(err.message || C.errorInscriptsDoc);
        } finally {
        setLoadingPreview(false);
        }
    }, [setDialogError]);

    const handleDownloadDoc = useCallback(
        async (id, nombreDocumento, extension) => {
        setDownloadingDocId(id);
        try {
            const data = await DescargarDocumentacionXId(id);
            const doc = Array.isArray(data) ? data[0] : data;
            let base64 = doc.datos_documento;

            // Si es un dataURL (comienza con data:), extraer la parte base64
            if (base64.startsWith("data:")) {
            base64 = base64.split(",")[1];
            }

            const byteChars = atob(base64);
            const byteArray = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
            byteArray[i] = byteChars.charCodeAt(i);
            }
            const blob = new Blob([byteArray]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${doc.nombre_documento || nombreDocumento}.${doc.extension || extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error al descargar documento:", err);
            setDialogError(C.errorInscriptsDoc);
        } finally {
            setDownloadingDocId(null);
        }
        },
        [setDialogError],
    );
    const [openPopup, setOpenPopup] = useState(false);
    const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
    
    const requestDeleteDocument = (documento) => {
        setDocumentoAEliminar(documento);
        setOpenPopup(true);
    };

    const handleDelete = async () => {
        try {
            if(!documentoAEliminar)return;
            await EliminarDocumentoViaje(documentoAEliminar.id);
            setOpenPopup(false);
            setLoadingViajeDocs(true);
            await fetchDocsXTravel(docsViaje);

            showNotification(C.inscriptsDocsDeleted,"success ");
        } catch  {

            showNotification(C.errorInscDocDelete, "error");
            
        } finally {
            setLoadingViajeDocs(false);
        }
    };
    const [selectedTypeDoc,setTypeDoc] = useState(null);
    const [travelNewFile, setTravelNewFile] = useState(null);
    const fileInputRef = useRef(null);
    const [documentTypes,setDocumentTypes]= useState(null);

    const fetchTiposDocumento = useCallback(async () => {
        try {
            const data = await obtenerTiposDocumento();
            setDocumentTypes(data);
        } catch {
            console.log("No se pudieron recuperar los tipos de Documento");
            setDocumentTypes(null);
        }
    }, [])

    useEffect(() => { fetchTiposDocumento(); }, [fetchTiposDocumento]);

    const handleArchivoChange = async (idType) => {
        const documentType = documentTypes.find(type => type.id === Number(idType.id));
        if(!documentType) return;

        if (!docsViaje||!travelNewFile || !documentType) return;

        const extension = `.${travelNewFile.name.split(".").pop().toLowerCase()}`;
        const allowedExtensions = (documentType.extension ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase());

        if (!allowedExtensions.includes(extension)) {
            showNotification(`${C.onlyExtensions} ${documentType.extension}`, "warning");
            return;
        }
        const fileName =`${documentType.nombre.replace(/\s/g, "_")}${extension}`

        const renamedFile = new File([travelNewFile], fileName, {
            type: travelNewFile.type,
            lastModified: travelNewFile.lastModified,
        });

        try {
            setLoadingViajeDocs(true);
        
        const savedFile = await CrearDocumentoViaje(
            docsViaje.id,
            documentType.id,
            renamedFile,
        );

            await fetchDocsXTravel(docsViaje);
        
            showNotification(`${savedFile.nombre_documento} ${C.inscriptsDocsUpload}`,"success");
            setTravelNewFile(null);
            setTypeDoc(null);

        } catch (error) {
            console.error("Error al subir el archivo:", error);
            showNotification(C.errorInscUpload, "error");
        } finally {
            setLoadingViajeDocs(false);
        }
    };
    const [seletedInscripts, setSeletedInscripts] =useState(null);
    const [docsInscript, setDocsInscript] = useState("");
    const [loadingInscriptDocs, setLoadingInscriptDocs] = useState(false);

    const fetchDocsXInscript = useCallback(async (row) => {
            setLoadingInscriptDocs(true);
            try {
                const data = await listarDocumentacionXLegajo(row.legajo_estudiante);
                setDocsInscript(data);
            } catch {
                setDocsInscript([]);
            } finally {
                setLoadingInscriptDocs(false);
            }
        }, []);
        useEffect(() => {
            fetchDocsXTravel();
        }, [fetchDocsXTravel]);

    const openSeeDocInscript = useCallback(async(row) => {
        //Personalizado
        setDialogOpen(true);
        setSeletedInscripts(row);
        setDialogError("");
        setDialogType("documents");
        try {
            await fetchDocsXInscript(row);

        } catch (err) {
            
            setDialogError(err.message ||C.errorSavingDocs);
        }
    }, [fetchDocsXInscript, setDialogError, setDialogOpen, setDialogType]);

    const [oldTravelsRows, setOldTravelsRows] = useState([]);
    const [loadingOldTravels, setLoadingOldTravels] = useState(true);

    const fetchTravelsXDate = useCallback(async (desde,hasta) => {
        if(isEmpty(desde)||isEmpty(hasta))return;
        setLoadingOldTravels(true);
        try {
            let data = await ObtenerViajesXFecha(toApiDateTime(desde),toApiDateTime(hasta)); 
            data = data.map(mapViajes);
            const datosLimpios = data.map(viaje => {
                const copiaViaje = { ...viaje }; 
                delete copiaViaje.motivo;
                delete copiaViaje.id_empresa;
                return copiaViaje;
            });
            datosLimpios.sort((a, b) => {
                return new Date(b.fecha_fin) - new Date(a.fecha_fin);
            });

            setOldTravelsRows(generateRows(datosLimpios));
        } catch {

            setOldTravelsRows([]);
        } finally {
            setLoadingOldTravels(false);
        }
    }, []);
    useEffect(() => {
        fetchTravelsXDate();
    }, [fetchTravelsXDate]);
    return (
    <TravelContext.Provider
        value={{
        bussiness,bussinessRows, setBussinessRows,
        loadingBussiness, setLoadingBussiness,bussinessColumns,
        fetchBussiness,openCreateBussiness,handleBussinessSave,

        travels,travelsRows, setTravelsRows,
        loadingTravels, setLoadingTravels,travelsColumns,
        fetchTravels,openCreateTravels,handleTravelSave,

        usuarioSelected,setUsuarioSelected,loadingUsuario,fetchUsuariosXlegajo,
        inscriptsTravel,setInscriptsTravel,loadingInscripts,fetchInscriptosXTravel,

        handleAddIncriptos,handleDeleteInscript,handleUpdateInscriptos,handleClickRemove,

        docsInscript,loadingInscriptDocs,openSeeDocInscript,seletedInscripts, setSeletedInscripts,

        travelData, setTravelData,documentTypes,selectedTypeDoc,setTypeDoc,

        docsViaje,docsViajeList,loadingViajeDocs,downloadingDocId,setDownloadingDocId,
        openPopup,setOpenPopup,documentoAEliminar,requestDeleteDocument,handleDelete,
        
        travelNewFile, setTravelNewFile,fileInputRef,handleArchivoChange,

        fetchTravelsXDate,oldTravelsRows,loadingOldTravels,

        handlePreviewDoc,handleDownloadDoc,
        previewOpen,setPreviewOpen,
        previewTitle, setPreviewTitle,
        previewSrc, setPreviewSrc,
        previewIsPdf, setPreviewIsPdf,
        loadingPreview, setLoadingPreview,
        previewError, setPreviewError,
        previewDocRef, setPreviewDocRef,

        fieldErrors, setFieldErrors,touchedFields, setTouchedFields,resetValidation,validate,validateField
        }}
    >
        {children}
    </TravelContext.Provider>
    );
}
