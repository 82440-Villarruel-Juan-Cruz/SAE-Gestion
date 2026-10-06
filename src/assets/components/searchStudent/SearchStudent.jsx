import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SAEButton from "../buttons/SAEButton";
import SAETextField from "../inputs/SAETextField";
import { CAREERS } from "../../../utils/common/constants";

const getStudentName = (student = {}) =>
  student.nombre_usuario ??
  student.nombre_becario ??
  student.nombre ??
  student.Nombre ??
  "";

export default function SearchStudent({
  legajo = "",
  disabled = false,
  onLegajoChange,
  onSelectStudent,
  onClearStudent,
  onSearchStudent,
  onError,
  showValidationErrors = false,
  legajoError = "Ingresá un legajo para buscar",
  careerError = "Seleccioná una carrera para buscar",
  required = false,
  autoSearch = false,
}) {
  const isMobile = useMediaQuery("(max-width:932px)");
  const [careerSearch, setCareerSearch] = useState("");
  const [studentSearchLoading, setStudentSearchLoading] = useState(false);
  const [studentSelected, setStudentSelected] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const lastAutoSearchLegajo = useRef("");

  useEffect(() => {
    const normalizedLegajo = String(legajo ?? "")
      .trim()
      .split("@")[0];
    const normalizedSelectedLegajo = String(studentSelected?.legajo ?? "")
      .trim()
      .split("@")[0];

    if (!normalizedLegajo || normalizedSelectedLegajo !== normalizedLegajo) {
      setStudentSelected(null);
    }
  }, [legajo, studentSelected?.legajo]);

  const searchStudent = async ({ validateCareer = true } = {}) => {
    const rawLegajo = String(legajo ?? "").trim();
    const hasFullLegajo = rawLegajo.includes("@");
    const studentId = rawLegajo.split("@")[0];
    const errors = {};

    if (!studentId) {
      errors.legajo = legajoError;
    }

    if (validateCareer && !hasFullLegajo && !careerSearch) {
      errors.career = careerError;
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      onError?.("");
      return;
    }

    try {
      onError?.("");
      setStudentSearchLoading(true);
      setStudentSelected(null);

      const searchLegajo = hasFullLegajo
        ? rawLegajo
        : validateCareer
          ? `${studentId}@${careerSearch}.frc.utn.edu.ar`
          : studentId;
      const student = await onSearchStudent?.(searchLegajo);
      if (!student?.legajo) {
        onError?.("Alumno no encontrado", "error");
        return;
      }
      setStudentSelected(student);
      onSelectStudent?.(student);
    } catch {
      setStudentSelected(null);
      onError?.("Alumno no encontrado", "error");
    } finally {
      setStudentSearchLoading(false);
    }
  };

  useEffect(() => {
    const normalizedLegajo = String(legajo ?? "").trim();

    if (
      !autoSearch ||
      !normalizedLegajo ||
      studentSelected ||
      studentSearchLoading ||
      lastAutoSearchLegajo.current === normalizedLegajo
    ) {
      return;
    }

    lastAutoSearchLegajo.current = normalizedLegajo;
    searchStudent({ validateCareer: false });
    // searchStudent depende del formulario; para autoseleccionar sólo debe
    // dispararse cuando cambia el legajo recibido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearch, legajo, studentSelected, studentSearchLoading]);

  const handleStudentSearch = () => {
    searchStudent();
  };

  const clearStudentSearch = () => {
    if (typeof onClearStudent === "function") {
      onClearStudent();
    }
    setStudentSelected(null);
    setCareerSearch("");
    setFieldErrors({});
    onError?.("");
  };

  const legajoFieldError =
    fieldErrors.legajo || (showValidationErrors ? legajoError : "");
  const careerFieldError =
    fieldErrors.career ||
    (showValidationErrors && !careerSearch ? careerError : "");

  if (studentSelected) {
    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Alumno seleccionado
        </Typography>
        <Typography variant="body1">
          {getStudentName(studentSelected)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {studentSelected.legajo}
        </Typography>
        <SAEButton
          variant="outlined"
          size="small"
          onClick={clearStudentSearch}
          sx={{ mt: 2 }}
        >
          Volver a buscar
        </SAEButton>
      </Box>
    );
  }

  return (
    <Grid container spacing={1} alignItems={{ sm: "center" }}>
      <Grid size={{ xs: 12, md: 3 }}>
        <SAETextField
          label="Legajo"
          value={legajo ?? ""}
          onChange={(event) => {
            setFieldErrors((previous) => ({ ...previous, legajo: "" }));
            onError?.("");
            onLegajoChange?.(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleStudentSearch();
          }}
          required={required}
          disabled={disabled || studentSearchLoading}
          error={Boolean(legajoFieldError)}
          helperText={legajoFieldError}
          fullWidth
        />
      </Grid>
      <Grid
        size={{ xs: 12, md: 1 }}
        my={{ xs: -1, md: 2 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <Typography
          variant="subtitle2"
          alignSelf={"center"}
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            lineHeight: { sm: "56px" },
          }}
        >
          {" "}
          @
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Autocomplete
          options={CAREERS}
          value={
            CAREERS.find((career) => career.value === careerSearch) ?? null
          }
          onChange={(_event, career) => {
            setFieldErrors((previous) => ({ ...previous, career: "" }));
            onError?.("");
            setCareerSearch(career?.value ?? "");
          }}
          getOptionLabel={(career) => career.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disabled={disabled || studentSearchLoading}
          fullWidth
          renderInput={(params) => (
            <SAETextField
              {...params}
              label="Carrera"
              required={required}
              error={Boolean(careerFieldError)}
              helperText={careerFieldError}
            />
          )}
        />
      </Grid>
      <Grid
        size={{ xs: 12, md: 3 }}
        my={{ xs: -1, md: 2 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <Typography
          alignSelf={"center"}
          variant="subtitle1"
          color="text.secondary"
          fontWeight={500}
          whiteSpace="nowrap"
          textAlign={"center"}
        >
          .frc.utn.edu.ar
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 1 }} my={2}>
        {studentSearchLoading && <CircularProgress size={36} sx={{ ml: 1 }} />}
        {!studentSearchLoading && !isMobile && (
          <IconButton
            size="medium"
            onClick={handleStudentSearch}
            disabled={disabled}
            sx={{
              width: 34,
              height: 34,
              color: "#1976d2",
              bgcolor: "#e3f2fd",
              "&:hover": { bgcolor: "#bbdefb" },
            }}
          >
            <SearchIcon fontSize="medium" />
          </IconButton>
        )}
        {!studentSearchLoading && isMobile && (
          <SAEButton
            variant="contained"
            onClick={handleStudentSearch}
            fullWidth
            disabled={disabled}
          >
            Buscar
          </SAEButton>
        )}
      </Grid>
    </Grid>
  );
}
