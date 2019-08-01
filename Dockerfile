FROM node:10-alpine




# Create app directory

WORKDIR /app
# Install app dependencies
COPY package.json .
ADD . .
RUN npm install
ENV FLASK_APP App.jsx
ENV FLASK_RUN_HOST 0.0.0.0

CMD [ "npm", "run", "start" ]