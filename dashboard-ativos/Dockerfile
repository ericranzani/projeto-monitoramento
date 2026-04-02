# Estágio 1: Build do Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Estágio 2: Servir com Nginx (servidor web leve)
FROM nginx:alpine
COPY --from=build /app/dist/dashboard-ativos/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]