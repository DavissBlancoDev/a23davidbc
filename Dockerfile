# Usamos imagen oficial de Node.js LTS
FROM node:20

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar solo los archivos de dependencias primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev   # omite dependencias de desarrollo si no las necesitas en producción

# Copiar el resto del proyecto
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno opcionales (útil si no las pasas por docker-compose)
# ENV MONGO_URI=mongodb://mongo:27017/nutriwise
# ENV PORT=3000

# Comando para arrancar la app
CMD ["node", "app.js"]
