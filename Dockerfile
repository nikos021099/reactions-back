FROM node:latest

WORKDIR /app

COPY . ./

RUN yarn
RUN yarn add --global @nestjs/cli

RUN yarn run build

CMD ["yarn", "run", "start:prod"]