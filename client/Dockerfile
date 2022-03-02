# Pull latest official node image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3001
EXPOSE 3001

# Start the React app
CMD ["npm", "start"]


