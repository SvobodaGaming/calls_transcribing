FROM node:20-slim

EXPOSE ${PORT}

WORKDIR /usr/src/app

COPY . ./

CMD npm run start