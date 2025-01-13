# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependências com cache limpo
COPY package*.json ./
RUN npm cache clean --force && npm ci

# Copiar arquivos do projeto
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 viteuser && \
    chown -R viteuser:nodejs /app

# Copiar apenas os arquivos necessários
COPY --from=builder --chown=viteuser:nodejs /app/dist ./dist
COPY --from=builder --chown=viteuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=viteuser:nodejs /app/node_modules ./node_modules

# Mudar para usuário não-root
USER viteuser

# Expor porta
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1

# Iniciar aplicação
CMD ["npm", "run", "preview"]