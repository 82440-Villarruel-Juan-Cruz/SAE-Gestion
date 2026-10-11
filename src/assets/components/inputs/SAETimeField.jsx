import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { timeToMinutes } from "../../../utils/schedule.utils";

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
  const minMinutes = timeToMinutes(minTime);
  const maxMinutes = timeToMinutes(maxTime);

  const isSelectableTime = (time) => {
    const parsedTime = parseTime(time);

    if (!parsedTime?.isValid()) return false;

    const minutes = timeToMinutes(parsedTime.format("HH:mm"));

    return (
      minutes !== null &&
      (minMinutes === null || minutes >= minMinutes) &&
      (maxMinutes === null || minutes <= maxMinutes) &&
      parsedTime.minute() % timeStepsMinutes === 0
    );
  };

  const preventTextEdition = (event) => {
    if (!readOnly) return;

    const allowedKeys = [
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "Escape",
      "Tab",
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        ampm={false}
        // Usamos el formato estricto 'HH:mm' para evitar errores de parseo
        value={parseTime(value)}
        onChange={(nuevoValor) => {
          const horaFormateada =
            nuevoValor && nuevoValor.isValid() ? nuevoValor.format("HH:mm") : "";

          if (horaFormateada && !isSelectableTime(horaFormateada)) return;

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
            onKeyDown: preventTextEdition,
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
