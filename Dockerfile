# Use the official Node.js image as the base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Make uploads dir
RUN mkdir -p /uploads
RUN mkdir /app/.next


# Copy package.json and package-lock.json
COPY package*.json ./

# Make a user node & group

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build


# Expose the port the app runs on
EXPOSE 3000

# Switch to user node
RUN chown -R node:node /app
RUN chown -R node:node /uploads
USER node

# Start the Next.js application
CMD ["npm", "start"]