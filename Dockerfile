# 1. Usar una imagen oficial de Node.js como base
FROM node:20-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de definición de paquetes
COPY package*.json ./

# 4. Instalar las dependencias del proyecto
RUN npm install

# 5. Copiar el resto del código fuente de tu aplicación
COPY . .

# 6. Exponer el puerto en el que corre tu aplicación
EXPOSE 3000

# 7. Definir el comando para iniciar la aplicación
CMD ["node", "src/server.js"]
