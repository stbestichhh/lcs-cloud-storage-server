# Build for produciton
FROM node:21-alpine3.18 as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production
FROM node:21-alpine3.18

# App env
ENV PORT=9110
ENV HOST="localhost"
ENV SECRET_KEY="supersecret"
ENV DB_NAME="lcs_user_repository"

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 9110

CMD ["node", "dist/index.js", "--log", "server"]
