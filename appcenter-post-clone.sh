#!/usr/bin/env bash

#install NodeJS
brew install node@12

# Install pre-requisites
npm install -g @angular/cli@9 @ionic/cli typescript@'>=3.6.4 <3.9.0'

# Install node_modules
npm install

# Build Capacitor
npm run build-capacitor