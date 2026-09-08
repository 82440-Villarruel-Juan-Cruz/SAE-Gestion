import React, { useState,useCallback,useEffect } from "react";
import { ObtenerPerfilXLegajo,ModificarPerfilEstudiante } from "../../../api/EstudianteService";
import { listarDocumentacionXLegajo } from "../../../api/BecasService";
import { mapEstudiante, mapResponseDocumento } from "../../../api/formatters/EstudianteFormatters";
import {  useAuth, useNotification,ProfileContext } from "../sharedContext"; 

import { cleanField,cleanNumericField,isEmpty,onlyDigits,sanitizeAddressPart,getInitials } from "../../../utils/text.utils.js";
import {formatCuil,formatDni,formatPhone,parseAddress} from "../../../utils/formatters.utils.js"
import { isValidAddress,isValidEmail,isValidPhone } from "../../../utils/validation.utils.js";
import { PROFILE_REQUIRED_FIELDS } from "../../../utils/common/common.config.js"; 
import { PROFILE_STRINGS } from "../../../utils/strings/student.strings.js"; 

const C = PROFILE_STRINGS;
export const ProfileContextProvider = ({ children, loadDocuments = false }) => {
  const { user } = useAuth();
  const {showNotification} = useNotification();
  const [formError, setFormError] = useState(null);

  //ESTADOS
  const [datosPerfil, setDatosPerfil] = useState({});
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [documentosPerfil, setDocumentosPerfil] = useState([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);

  const fetchDatosPerfil = useCallback(async (legajo) => {
    if (!legajo) return;
    setLoadingPerfil(true);

    try {
      let data = await ObtenerPerfilXLegajo(legajo);
      setDatosPerfil(mapEstudiante(data));
      setSaveAttempted(false);
    } catch {
      setDatosPerfil({});
    } finally {
      setLoadingPerfil(false);
    }
  }, []);

  useEffect(() => {
    fetchDatosPerfil(user?.legajo);
  }, [fetchDatosPerfil, user?.legajo]);

  useEffect(() => {
    const fetchDocumentos = async () => {
      if (!loadDocuments || !user?.legajo) return;
      setLoadingDocumentos(true);

      try {
        const data = await listarDocumentacionXLegajo(user.legajo);
        setDocumentosPerfil(data.map(mapResponseDocumento));
      } catch {
        setDocumentosPerfil([]);
      } finally {
        setLoadingDocumentos(false);
      }
    };

    fetchDocumentos();
  }, [loadDocuments, user?.legajo]);

  const handleChange = useCallback((field, value) => {
    setDatosPerfil((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleMaskedChange = useCallback(
    (field, formatter) => (event) => {
      handleChange(field, formatter(event.target.value));
    },
    [handleChange],
  );

  const handleAddressChange = useCallback(
    (index, value) => {
      const parts = parseAddress(datosPerfil.direccion);
      parts[index] =
        index === 3 ? onlyDigits(value, 6) : sanitizeAddressPart(value);

      const hasAddressData = parts.some((part) => part.trim() !== "");
      handleChange("direccion", hasAddressData ? parts.join(" - ") : "");
    },
    [datosPerfil.direccion, handleChange],
  );

  const handleProfileSave = async () => {
    setSaveAttempted(true);
    setFormError("");

    const camposFaltantes = PROFILE_REQUIRED_FIELDS.filter(
      ([field]) => !cleanField(datosPerfil[field]),
    ).map(([, label]) => label);

    if (camposFaltantes.length > 0) {
      setFormError(`${C.missingFieldMessage} ${camposFaltantes.join(", ")}.`);
      return;
    }

    const email = cleanField(datosPerfil.email);
    const telefono = cleanField(datosPerfil.telefono);
    const direccion = cleanField(datosPerfil.direccion);
    const dni = cleanNumericField(datosPerfil.dni);
    const cuil = cleanNumericField(datosPerfil.cuil);

    if (dni.length !== 8) {
      setFormError(C.DNIRequired);
      return;
    }

    if (cuil.length !== 11) {
      setFormError(C.CUILRequired);
      return;
    }

    if (email && !isValidEmail(email)) {
      setFormError(C.emailRequired);
      return;
    }

    if (telefono && !isValidPhone(telefono)) {
      setFormError(C.phoneRequired);
      return;
    }

    if (direccion && !isValidAddress(direccion)) {
      setFormError(C.completeAdressMessage);
      return;
    }

    setLoadingPerfil(true);
    try {
      const body = {
        legajo: cleanField(datosPerfil.legajo),
        nombres: cleanField(datosPerfil.nombres),
        apellidos: cleanField(datosPerfil.apellidos),
        email,
        telefono,
        fecha_nacimiento: cleanField(datosPerfil.fecha_nacimiento),
        cuil,
        dni,
        direccion,
      };
      await ModificarPerfilEstudiante(datosPerfil.legajo, body);
      showNotification(C.savedProfile,"success")

    } catch {
      showNotification(C.errorProfile,"error")
      //setFormError(err.message || "Ocurrió un error al guardar");
    } finally {
      setLoadingPerfil(false);
    }
  };

  const today = new Date().toLocaleDateString("en-CA");
  const addressParts = parseAddress(datosPerfil.direccion);
  const requiredError = (value) => saveAttempted && isEmpty(value);
  const emailHasError =
    requiredError(datosPerfil.email) ||
    (Boolean(datosPerfil.email) && !isValidEmail(datosPerfil.email));
  const phoneHasError =
    requiredError(datosPerfil.telefono) ||
    (Boolean(datosPerfil.telefono) && !isValidPhone(datosPerfil.telefono));
  const dniHasError =
    requiredError(datosPerfil.dni) ||
    (Boolean(datosPerfil.dni) &&
      onlyDigits(String(datosPerfil.dni), 9).length !== 8);
  const cuilHasError =
    requiredError(datosPerfil.cuil) ||
    (Boolean(datosPerfil.cuil) &&
      onlyDigits(String(datosPerfil.cuil), 12).length !== 11);
  const missingRequiredFields = [
    ["Legajo", datosPerfil.legajo],
    ["Nombres", datosPerfil.nombres],
    ["Apellidos", datosPerfil.apellidos],
    ["DNI", datosPerfil.dni],
    ["CUIL", datosPerfil.cuil],
    ["Fecha de nacimiento", datosPerfil.fecha_nacimiento],
    ["Correo electrónico", datosPerfil.email],
    ["Teléfono", datosPerfil.telefono],
    ["Provincia", addressParts[0]],
    ["Ciudad / Localidad", addressParts[1]],
    ["Nombre de la calle", addressParts[2]],
    ["Altura", addressParts[3]],
  ]
    .filter(([, value]) => isEmpty(value))
    .map(([label]) => label);

  return (
    <ProfileContext.Provider
      value={{
        fetchDatosPerfil,
        user,
        profileInitials: getInitials(user?.nombre),
        datosPerfil,
        loadingPerfil,
        documentosPerfil,
        loadingDocumentos,
        setDatosPerfil,
        handleChange,
        handleMaskedChange,
        handleAddressChange,
        handleProfileSave,
        formatDni,
        formatCuil,
        formatPhone,
        today,
        addressParts,
        requiredError,
        emailHasError,
        phoneHasError,
        dniHasError,
        cuilHasError,
        missingRequiredFields,
        //Valores de error, mostrar mensajes, etc.
        setFormError,
        formError,
        saveAttempted,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
