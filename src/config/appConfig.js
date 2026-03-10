export const appConfig = {

  appName: import.meta.env.VITE_APP_NAME,

  apiUrl: import.meta.env.VITE_API_URL,

  sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT),
  
/* MUY IMPORTANTE, SI DESEAMOS AGREGAR UNA VARIABLE EN appConfig.js y consumirlo desde los css*/
themes: {
    light: {
      background: "#EFECE3",
      text: "#1a1a1a",
      navbar:"#1d2d4f",
      primary: "#4A70A9",
      secondary: "#D1DEF1",
      tertiary: "#315282",

      card: "#A2AADB",
      cardHover: "#FADA7A",

      greenButton:"#8BC154",
      greenButtonHover:"#3CA035",
      greenButtonClick:"#6BDA5F",
    },
        /*POR AHORA NO LOS UTILIZAMOS*/
    dark: {
      background: "#1e1e1e",
      text: "#f5f5f5",
      primary: "#948979",
      secondary: "#222831",
      card: "#393E46",
      cardHover: "#DFD0B8",
      reenButton:"#8BC154",
      greenButtonHover:"#3CA035",
      greenButtonClick:"#6BDA5F",
    }
  },

  font: "Georgia, 'Times New Roman', Times, serif"

};