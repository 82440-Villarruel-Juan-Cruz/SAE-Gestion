export const mapPersonalMedico = (empleado) => ({
  cuil: empleado.cuil,
  nombre: empleado.nombre,
  apellido: empleado.apellido,
  id_especialidad: empleado.especialidad.id ,
  especialidad: empleado.especialidad.nombre,
  activo:empleado.presta_servicio
});

export const mapCursoMedico = (cursoMedico) => ({
    id: cursoMedico.id,
    nombre_curso: cursoMedico.nombre_curso,
    nombre_docente:cursoMedico.nombre_docente,
    fecha_inicio: removerHoras(cursoMedico.fecha_inicio),
    fecha_fin: removerHoras(cursoMedico.fecha_fin),
    cupo_maximo: cursoMedico.cupo_maximo,
    activo: cursoMedico.activo
});
export const mapHorarioSalud = (horario) => ({
  id: horario.id,
  hora_inicio: horario.hora_inicio,
  hora_fin: horario.hora_fin ,
  dia: horario.dia,
  cuil_especialista: horario.cuil_especialista,
  especialista : horario.especialista.replace(",",""),
  activo: true,
  id_especialidad:horario.especialidad.id,
  nombre_especialidad:horario.especialidad.nombre,
  descripcion_especialidad:horario.especialidad.descripcion
});

export const mapEstado = (turno) => ({
  id_estado_turno: turno.id,
  estado_turno: turno.estado_turno
});

export const mapTurnos = (turno) => ({
  id: turno.id,
  cuil_medico: turno.cuil_medico,
  especialista: turno.especialista.replace(",",""),
  legajo: turno.legajo,
  paciente: turno.paciente.replace(",",""),
  fecha_solicitud: removerHoras(turno.fecha_solicitud),
  fecha_atencion:removerHoras(turno.fecha_atencion),
  hora_atencion: turno.hora_atencion,
  asunto: turno.asunto,
  id_estado_turno: turno.estadosTurno.id,
  estado: turno.estadosTurno.estado_turno
});

export const mapTurnosPaciente = (turno) => ({
  id: turno.id,
  especialista: turno.especialista.replace(",",""),
  fecha_solicitud: removerHoras(turno.fecha_solicitud),
  fecha_atencion:removerHoras(turno.fecha_atencion),
  hora_atencion: turno.hora_atencion,
  asunto: turno.asunto,
  id_estado_turno: turno.estadosTurno.id,
  estado: turno.estadosTurno.estado_turno
});


function removerHoras(isoString) {
    if (!isoString) return "";  
    const [year, month, day] = isoString.substring(0, 10).split("-");
    return year+'-'+month+'-'+day;
}
