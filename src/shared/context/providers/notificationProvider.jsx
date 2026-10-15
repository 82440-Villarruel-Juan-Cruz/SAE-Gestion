import { useState,useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { NotificationContext } from '../sharedContext'; 
import { useDialog } from '../../../utils/dialog';

export const NotificationProvider = ({ children }) => {
  //Creo una sola vez el dialog y todo va a estar usandolo porque esta contenido en el notificationProvider
  const dialogState = useDialog();

  const [config, setConfig] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
    duration: 4000,
  });

  const showNotification = useCallback((message, severity = 'info', duration = 4000) => {
    if(message == "")return;
    setConfig({ open: true, message, severity, duration });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setConfig((prev) => ({ ...prev, open: false }));
  };
  
  return (//dialogState es un array proviste por dialog.js
    <NotificationContext.Provider value={{ showNotification,
    ...dialogState 
    }}>
      {children}
      <Snackbar
        open={config.open}
        autoHideDuration={config.duration}
        onClose={handleClose}
       
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        
      >
        <Alert
         
          onClose={handleClose}
          severity={config.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {config.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};