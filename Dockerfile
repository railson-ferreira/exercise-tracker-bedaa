FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY public/ ./public/
COPY views/ ./views/
COPY api/ ./api/
COPY index.js .env ./

EXPOSE 80

CMD [ "npm", "start" ]