#!/bin/bash

echo "Installing Sharp for Vercel deployment..."

# Install Sharp with explicit platform targeting
pnpm add sharp --platform=linux --arch=x64

# Verify Sharp installation
node -e "console.log('Sharp version:', require('sharp').versions)"

echo "Sharp installation complete!" 