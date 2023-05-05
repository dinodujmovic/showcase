# ===============
# Stage 1 - build
# ===============
FROM node:12 as build

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# run tests
RUN npm run test -- --watch=false
# RUN npm run e2e -- --port 4202 // Remove until fixed

# generate build
RUN npm run build -- --prod --output-path=dist

# ===============
# Stage 2 - prod
# ===============
FROM nginx:latest

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./.docker/config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# run nginx
CMD ["nginx", "-g", "daemon off;"]


# ====================================================================
# Manual build/run
# ====================================================================
# docker build -t showcase-angular:prod -f app.production.dockerfile
# docker run -p 80:80 showcase-angular:prod
