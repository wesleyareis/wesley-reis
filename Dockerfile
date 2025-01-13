# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar arquivos do projeto
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 viteuser

# Copiar apenas os arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Configurar permissões
RUN chown -R viteuser:nodejs /app
USER viteuser

# Configurar porta e host
EXPOSE 8080
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Iniciar aplicação
CMD ["npm", "run", "preview"]