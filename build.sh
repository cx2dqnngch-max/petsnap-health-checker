#!/bin/bash
echo '=== STEP 1: Setting Expo token ==='
export EXPO_TOKEN=4HEWsaWWY6EsQg8akK-I5OuEf9LEmhNEu_aINIsv
echo '=== STEP 2: Installing packages (2 mins) ==='
npm install --legacy-peer-deps
echo '=== STEP 3: Starting EAS build ==='
npx eas-cli build --platform android --profile production
