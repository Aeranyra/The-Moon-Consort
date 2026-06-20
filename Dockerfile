FROM node:22-slim

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy the rest of the source
COPY . .

CMD ["node", "src/index.js"]
