import { formatTime, toTimeInput } from "./date.utils";

export const normalizeTimeValue = (value) => toTimeInput(value);

export const timeToMinutes = (value) => {
  const normalized = normalizeTimeValue(value);
  const [hours, minutes] = normalized.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  return hours * 60 + minutes;
};

export const getSchedulesForDay = (schedules = [], day) =>
  schedules.filter((schedule) => Number(schedule.dia) === Number(day));

export const getDayScheduleBounds = (schedules = [], day) => {
  const daySchedules = getSchedulesForDay(schedules, day);

  const starts = daySchedules
    .map((schedule) => normalizeTimeValue(schedule.hora_inicio))
    .filter(Boolean)
    .sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

  const ends = daySchedules
    .map((schedule) => normalizeTimeValue(schedule.hora_fin))
    .filter(Boolean)
    .sort((a, b) => timeToMinutes(b) - timeToMinutes(a));

  return {
    minTime: starts[0] ?? "00:00",
    maxTime: ends[0] ?? "23:59",
  };
};

export const isTimeRangeInsideSchedules = (
  schedules = [],
  day,
  startTime,
  endTime,
) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    return false;
  }

  return getSchedulesForDay(schedules, day).some((schedule) => {
    const scheduleStart = timeToMinutes(schedule.hora_inicio);
    const scheduleEnd = timeToMinutes(schedule.hora_fin);

    return (
      scheduleStart !== null &&
      scheduleEnd !== null &&
      startMinutes >= scheduleStart &&
      endMinutes <= scheduleEnd
    );
  });
};

export const formatTimeRange = (startTime, endTime) =>
  `${formatTime(startTime)} a ${formatTime(endTime)}`;

export const formatScheduleRange = (schedule, getDayLabel) =>
  `${getDayLabel(schedule.dia)}: ${formatTimeRange(
    schedule.hora_inicio,
    schedule.hora_fin,
  )}`;

export const formatAvailabilityRange = (availability, getDayLabel) => {
  const startTime = availability.hora_desde ?? availability.hora;
  const endTime = availability.hora_hasta;

  return endTime
    ? `${getDayLabel(availability.dia)} - ${formatTimeRange(startTime, endTime)}`
    : `${getDayLabel(availability.dia)} - ${formatTime(startTime)}`;
};
