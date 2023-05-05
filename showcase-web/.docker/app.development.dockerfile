# ===============
# Run development
# ===============
FROM node:12 as node
LABEL author="Dino Dujmovic"

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200 49153
CMD npm run start -- --host 0.0.0.0 --poll 500

# ====================================================================
# Manual build/run
# ===================================================================
# docker build -t showcase-angular:dev -f app.development.dockerfile .
# Mac
# docker run -v /$(pwd):/app -v /app/node_modules -p 4201:4200 --rm showcase-angular:dev
# Windows PowerShell
# docker run -v %cd%:/app -v /app/node_modules -p 4201:4200 --rm showcase-angular:dev
# Windows CMD
# docker run -v %cd%:/app -v /app/node_modules -p 4201:4200 --rm showcase-angular:dev
