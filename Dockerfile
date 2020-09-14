FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm ci \
 && npm run build

FROM node:14
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/build/final .
CMD [ "node", "app.js", "8080", "mongo", "27017" ]