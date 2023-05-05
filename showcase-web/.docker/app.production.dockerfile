# ===============
# Stage 1 - build
# ===============
FROM node:16 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --output-path=dist

# ===============
# Stage 2 - prod
# ===============
FROM nginx:latest

# copy artifact build from the 'build environment'
COPY --from=build /app/dist/showcase /usr/share/nginx/html
COPY ./.docker/config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# run nginx
CMD ["nginx", "-g", "daemon off;"]


# ====================================================================
# Manual build/run
# ====================================================================
# docker build -t showcase-angular:prod -f app.production.dockerfile
# docker run -p 80:80 showcase-angular:prod
