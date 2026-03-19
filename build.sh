#!/bin/bash
export EXPO_TOKEN=4HEWsaWWY6EsQg8akK-I5OuEf9LEmhNEu_aINIsv
echo 'Installing dependencies...'
npm install
echo 'Starting build...'
npx eas-cli build --platform android --profile production
