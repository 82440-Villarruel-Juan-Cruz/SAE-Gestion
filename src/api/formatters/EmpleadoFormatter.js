export const mapEmpleadoSAE = (empleado) => ({
  id: empleado.id,
  legajo: empleado.legajo,
  nombre_empleado: empleado.nombre_empleado.replace(",","") ,
  id_perfil: empleado.id_perfil,
  nombre_perfil: empleado.nombre_perfil,
  activo: empleado.activo ?? true
});

export const mapHorarioSAE = (horario) => ({
  id: horario.id,
  hora_inicio: horario.hora_inicio,
  hora_fin: horario.hora_fin ,
  dia: horario.dia,
  id_empleado: horario.id_empleado,
  nombre_empleado_atencion : horario.nombre_empleado_atencion.replace(",","") 
});
