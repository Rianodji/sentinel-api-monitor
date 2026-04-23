# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./
RUN npm install

# On copie le reste du code et on build
COPY . .
RUN npm run build

# Étape 2 : Run
FROM node:20-alpine

WORKDIR /app

# On ne récupère que le nécessaire du builder pour une image légère
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Commande pour lancer l'app en prod
CMD ["node", "dist/main"]