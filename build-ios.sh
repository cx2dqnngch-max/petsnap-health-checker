#!/bin/bash
echo '=== PetSnap iOS Build ==='
echo 'STEP 1: Set Expo token'
export EXPO_TOKEN=4HEWsaWWY6EsQg8akK-I5OuEf9LEmhNEu_aINIsv
echo 'STEP 2: Install packages'
npm install --legacy-peer-deps
echo 'STEP 3: Build iOS (you will be prompted for Apple credentials)'
npx eas-cli build --platform ios --profile production-ios
