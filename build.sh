#!/bin/bash
export EXPO_TOKEN=4HEWsaWWY6EsQg8akK-I5OuEf9LEmhNEu_aINIsv
echo 'Logged in to Expo...'
npx eas-cli build --platform android --profile production
