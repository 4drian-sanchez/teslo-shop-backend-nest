
# 1. Dependencias de desarrollo (para build y tests)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --force-lockfile

# 2. Testing
FROM node:22-alpine AS testing
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run test


# 3. Builder (Compilación)
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Dependencias de producción (Solo lo necesario para ejecutar)
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm install --prod --frozen-lockfile

# 5. Imagen ligera para prodruccion
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD [ "node", "dist/main" ]


#==========
# Modo Dev
#==========
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "start:dev" ]