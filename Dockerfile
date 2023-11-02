FROM node:18.17
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install
EXPOSE 6900
CMD [ "yarn", "start" ]