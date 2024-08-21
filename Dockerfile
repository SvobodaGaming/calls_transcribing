FROM node:20-slim

EXPOSE ${PORT}

WORKDIR /usr/src/app

COPY . ./

RUN npm install --no-fund

CMD npm run start