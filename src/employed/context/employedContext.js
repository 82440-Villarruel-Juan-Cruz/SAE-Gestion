import { createContext, useContext } from "react";

export const HealthContext = createContext(null);
export const JPAContext = createContext(null);
export const EmployContext = createContext(null);
export const ScholarshipContext = createContext(null);
export const PressContext = createContext(null);
export const TravelContext = createContext(null);
export const PurchaseContext = createContext(null);
export const ConsultationContext = createContext(null);
export const SportsContext = createContext(null);
export const ReportsContext = createContext(null);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth debe usarse dentro de un HealthProvider");
  }
  return context;
};
export const useJPA = () => {
  const context = useContext(JPAContext);
  if (!context) {
    throw new Error("useJPA debe usarse dentro de un JPAProvider");
  }
  return context;
};

export const useEmploy = () => {
  const context = useContext(EmployContext);
  if (!context) {
    throw new Error("useEmploy debe usarse dentro de un EmployProvider");
  }
  return context;
};

export const useScholarships = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error(
      "useScholarships debe usarse dentro de un ScholarshipProvider",
    );
  }
  return context;
};

export const usePress = () => {
  const context = useContext(PressContext);
  if (!context) {
    throw new Error("usePress debe usarse dentro de un PressProvider");
  }
  return context;
};

export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error(
      "useConsultations debe usarse dentro de un ConsultationProvider",
    );
  }
  return context;
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel debe usarse dentro de un TravelProvider');
  }
  return context;
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase debe usarse dentro de un PurchaseProvider');
  }
  return context;
};

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error("useSports debe usarse dentro de un SportsProvider");
  }
  return context;
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports debe usarse dentro de un ReportsProvider");
  }
  return context;
};
