#!/bin/bash
echo '=== PetSnap Build 9 ==='
echo 'Installing EAS CLI...'
npm install -g eas-cli --silent
echo 'Starting iOS build...'
export EXPO_TOKEN=4HEWsaWWY6EsQg8akK-I5OuEf9LEmhNEu_aINIsv
npx eas-cli build --platform ios --profile production --non-interactive
echo '=== Build submitted! ==='