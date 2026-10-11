import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_3pfadf8';
const EMAILJS_PUBLIC_KEY = 'HPmcidnqVsJvSzXbn';
const EMAILJS_TEMPLATES = ['template_generico', 'template_q5q7k6a'];

const sendToConfiguredTemplates = (send) =>
  Promise.all(
    EMAILJS_TEMPLATES.map((templateId) =>
      send(templateId, {
        publicKey: EMAILJS_PUBLIC_KEY,
      }),
    ),
  );

export function sendJPAEmailForm(formData) {

  return sendToConfiguredTemplates((templateId, options) =>
    emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      {
        form_type: 'Inscripción / Participación JPA',
        user_name: formData.user_name || '-',
        user_email: formData.user_email || '-',
        phone: formData.phone || '-',
        desc: formData.desc || '-',
        amount: formData.amount || '-',
        date: formData.date || '-',
        carrera: formData.carrera || '-',
      },
      options,
    ),
  );
}

export function sendConsultationEmail({
  user_name,
  user_email,
  subject,
  message,
  legajo,
}) {
  return sendToConfiguredTemplates((templateId, options) =>
    emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      {
        form_type: 'Consulta SAE',
        user_name: user_name,
        user_email: user_email,
        subject: subject,
        message: message,
        desc: '-',
        legajo: legajo || '-',
        phone: '-',
        amount: '-',
        date: new Date().toLocaleDateString('es-AR'),
        carrera: '-',
      },
      options,
    ),
  );
}
