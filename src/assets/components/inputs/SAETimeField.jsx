import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

dayjs.extend(customParseFormat);

function parseTime(time) {
  if (!time) return null;
  const timeText = String(time).slice(0, 5);
  const normalizedTime = timeText === "24:00" ? "23:59" : timeText;
  return dayjs(normalizedTime, "HH:mm", true);
}

export default function SAETimeField({
  label,
  value,
  onChange,
  minTime = "12:00", // Valor por defecto si no se pasa
  maxTime = "22:00", // Valor por defecto si no se pasa
  width = 130, // Ancho por defecto
  size = "small",
  fullWidth = false,
  disabled = false,
  error = false,
  helperText = "",
  timeStepsMinutes = 15, //Minutos
  required = false,
  readOnly = false,
}) {
  const textFieldSize = size === "big" ? "medium" : size;
  const redondearMinutos = (dayjsObj) => {
      if (!dayjsObj || !dayjsObj.isValid()) return dayjsObj;

      const minutosActuales = dayjsObj.minute();
      const resto = minutosActuales % timeStepsMinutes;

      // Si no coincide exactamente con el intervalo, redondeamos
      if (resto !== 0) {
        const minutosRedondeados = 
          resto >= timeStepsMinutes / 2
            ? minutosActuales + (timeStepsMinutes - resto) // Redondea hacia arriba
            : minutosActuales - resto;                     // Redondea hacia abajo
            
        return dayjsObj.minute(minutosRedondeados).second(0);
      }
      return dayjsObj.second(0);
    };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        ampm={false}
        // Usamos el formato estricto 'HH:mm' para evitar errores de parseo
        value={parseTime(value)}
        onChange={(nuevoValor) => {

          const valorRedondeado = redondearMinutos(nuevoValor);
          const horaFormateada =
            valorRedondeado && valorRedondeado.isValid()
              ? valorRedondeado.format("HH:mm")
              : "";

          onChange?.(horaFormateada);
        }}

        timeSteps={{ minutes: timeStepsMinutes }}
        minTime={parseTime(minTime)}
        maxTime={parseTime(maxTime)}
        shouldDisableTime={(timeValue, view) => {
          if (view !== "minutes") return false;

          return Number(timeValue) % timeStepsMinutes !== 0;
        }}
        disabled={disabled}
        localeText={{
          cancelButtonLabel: "Volver",
          okButtonLabel: "Confirmar",
        }}
        slotProps={{
          textField: {
            size: textFieldSize,
            fullWidth,
            required,
            error,
            helperText,
            inputProps: {
              readOnly,
            },
            onPaste: readOnly ? (event) => event.preventDefault() : undefined,
            sx: fullWidth ? undefined : { width },
          },
          // Forzar la barra de botones en entornos de escritorio si es necesario
          actionBar: {
            actions: ["cancel", "accept"],
          },
        }}
      />
    </LocalizationProvider>
  );
}
