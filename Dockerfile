FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Declaras los ARGs que vas a inyectar desde fuera al construir
ARG VITE_APP_NAME="SAE Gestion"
ARG VITE_SESSION_TIMEOUT=30
ARG VITE_BASE_PATH="/vulcan/dartagnan/" 
ARG VITE_API_BASE_PATH="http://localhost:1986/api"

# Las expones como ENV para que Vite las lea durante el build
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_SESSION_TIMEOUT=$VITE_SESSION_TIMEOUT
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_PATH=$VITE_API_BASE_PATH

# LE PASAS LA BASE A VITE DIRECTAMENTE AQUÍ:
RUN npm run build -- --base=$VITE_BASE_PATH

# Stage 2: Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Usamos la característica de templates de Nginx (Disponible en la imagen oficial)
# Renombraremos tu nginx.conf a nginx.conf.template en tu proyecto
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]