FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV EXPO_PORT=8081
ENV EXPO_HOST=lan
EXPOSE 8081

CMD ["sh", "-c", "npx expo start --web --host ${EXPO_HOST} --port ${EXPO_PORT}"]
