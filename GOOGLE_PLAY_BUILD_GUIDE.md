# Google Play Build Guide — PetSnap Health Checker

## What you need before building
1. A free **Expo account** — sign up at https://expo.dev
2. **Node.js 18+** installed on your computer (or use the Replit shell directly)
3. Your RevenueCat Android key is already embedded: `goog_rUpYppRKQLklLXIvOkNrYxeTWIZ`

---

## Step 1 — Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2 — Log in to Expo

```bash
eas login
```
Enter your Expo email and password when prompted.

## Step 3 — Link this project to your Expo account

Run this from inside the `artifacts/petsnap` folder:
```bash
eas init
```
This generates a real `projectId` and replaces `YOUR_EAS_PROJECT_ID` in `app.json`.

## Step 4 — Build the .aab for Google Play (signed, production)

```bash
eas build --platform android --profile production
```

- EAS auto-generates a signing keystore for you (save it when prompted!)
- Build takes ~15–25 minutes on Expo's servers
- You get a download link for the `.aab` when it finishes
- **Save the keystore** — you need it for every future update

## Step 5 — Build a .apk to test on your phone

```bash
eas build --platform android --profile production-apk
```

Same as above, produces a `.apk` you can sideload directly.

---

## Submitting to Google Play

1. Go to https://play.google.com/console
2. Create a new app → "PetSnap Health Checker" → App → Free → App contains purchases → Create app
3. Fill in Store Listing (use the text in STORE_LISTING.md)
4. Upload your `.aab` under Release → Internal Testing → Create new release
5. Review → Roll out to Internal Testing

---

## Bundle identifier
`com.petsnap.healthchecker`

## RevenueCat keys embedded
- Android (production): `goog_rUpYppRKQLklLXIvOkNrYxeTWIZ`
- iOS (production): `appl_LPfOpOJxjyRDYXmhPTfasrTPNAu`
- Test/dev: `test_wISiEQSaCDnQbnkelTuLwXjGDYR`
