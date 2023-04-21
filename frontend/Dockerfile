FROM node:16.16.0 as build-stage

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

