# Usamos una imagen oficial de Node.js
FROM node:20

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero (para aprovechar cache de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de la app
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "app.js"]
