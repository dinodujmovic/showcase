# ===============
# Run development
# ===============
FROM node:16 as node
LABEL author="Dino Dujmovic"

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
