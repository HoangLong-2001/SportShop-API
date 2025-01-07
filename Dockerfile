FROM node:20.15.1
WORKDIR /user/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./src ./src
COPY ./.env ./
EXPOSE 8080
CMD ["npm", "start"]