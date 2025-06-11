#!/bin/bash

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build the application
npm run build 