FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 5432

RUN npx tsc

CMD ["node", "./js/index.js"]