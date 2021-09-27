
FROM node:12.16.3

WORKDIR /app

COPY node/src/web ./web
COPY node/src/database ./database
COPY node/package.json ./

RUN npm install

EXPOSE 80

CMD ["node", "./web/app.js"]