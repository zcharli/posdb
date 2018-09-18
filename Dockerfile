FROM node:8.7

ADD ./ /app

WORKDIR app

RUN npm install

CMD npm start

ENV PORT 80

EXPOSE 80
