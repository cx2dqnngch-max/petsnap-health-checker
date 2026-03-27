#!/bin/bash
echo '=== PetSnap Build and Submit ==='
git checkout app.json
git pull
echo '=== Installing EAS CLI ==='
npm install -g eas-cli --silent
echo '=== Building and auto-submitting to Apple ==='
export EXPO_TOKEN=4HEWsaWWY6EsQg8akK-I5OuEf9LEmhNEu_aINIsv
npx eas-cli build --platform ios --profile production --non-interactive --auto-submit
echo '=== Done! Build submitted to Apple ==='