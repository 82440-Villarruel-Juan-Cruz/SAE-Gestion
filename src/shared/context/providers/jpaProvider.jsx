import {useState, useEffect ,useCallback} from "react";
import { JPAContext } from "../sharedContext"; 
import { ObtenerEventosPublicos } from "../../../api/JPAService";
import { getTodayInputDate, normalizeDateInput } from "../../../utils/date.utils";

const isTodayOrFutureEvent = (evento) => {
  const eventDate = normalizeDateInput(evento.fecha_evento);
  return eventDate && eventDate >= getTodayInputDate();
};

export function JPAProvider({ children }) {
  const [eventosJPA, setEventosJPA] = useState([]);
  const [loadingEventos, setLodingEventos] = useState(false);

  const fetchEventosSAE = useCallback(async () => {
      setLodingEventos(true);
      try {
          const data = await ObtenerEventosPublicos();
          
          setEventosJPA(data.filter(isTodayOrFutureEvent));
      } catch(error) {
          setEventosJPA([]);
          console.error("Error al traer Eventos:", error);
      }
      finally{
          setLodingEventos(false);
      }
  }, [])
  useEffect(() => { fetchEventosSAE(); }, [fetchEventosSAE]);

  return (
    <JPAContext.Provider
      value={{
        eventosJPA,loadingEventos
      }}
    >
      {children}
    </JPAContext.Provider>
  );
}
