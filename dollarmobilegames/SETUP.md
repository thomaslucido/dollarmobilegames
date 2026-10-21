# One-time setup (Tom)

Everything else runs on its own. These steps need your Apple and GitHub logins, so only you can
do them. About 30 minutes total.

## 1. Turn on the web preview (GitHub Pages)
Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**.
The arcade, every game, and the privacy/support pages then live at
https://thomaslucido.github.io/dollarmobilegames/ (Apple needs those two URLs).

## 2. Paid apps agreement
App Store Connect > **Business** (Agreements, Tax, and Banking): accept the **Paid Apps**
agreement and add bank and tax info. In-app purchases cannot go on sale without it.

## 3. Register the bundle ID and create the app
1. developer.apple.com > Certificates, IDs & Profiles > **Identifiers > +** > App IDs > App.
   Bundle ID (explicit): `com.thomaslucido.dollararcade`. Description: Dollar Arcade.
   In-App Purchase is on by default. Register.
2. App Store Connect > **Apps > + > New App**: platform iOS, name **Dollar Arcade**
   (if taken, pick another and put it in `fastlane/metadata/en-US/name.txt`), language
   English (U.S.), bundle ID from step 1, SKU `dollararcade`, full access.

## 4. API key for the robot
App Store Connect > **Users and Access > Integrations > App Store Connect API > Team Keys > +**.
Name it `GitHub deploy`, access **Admin** (needed so the build can sign itself).
Download the `.p8` file (Apple only lets you download it once). Note the **Key ID** and the
**Issuer ID** at the top of the page. Your **Team ID** is at developer.apple.com > Account >
Membership details.

## 5. GitHub secrets
Repo **Settings > Secrets and variables > Actions > New repository secret**, four times:

| Name | Value |
|---|---|
| `ASC_KEY_ID` | the Key ID |
| `ASC_ISSUER_ID` | the Issuer ID |
| `ASC_KEY_P8` | open the .p8 in a text editor and paste the whole thing, BEGIN/END lines included |
| `TEAM_ID` | your 10-character Team ID |

Then delete the .p8 from your Downloads folder.

## 6. The first release (one time only)
The first deploy builds and uploads version 1.0 but does not submit it, because Apple requires
a human to fill a few forms for a brand-new app and to submit the first in-app purchase alongside
it. When the Actions run says "First release uploaded":

1. **App Privacy**: Get Started > "No, we do not collect data from this app" > Publish.
2. **Pricing and Availability**: price Free, all countries.
3. **App Information**: category Games > Casual (secondary: Puzzle). Content Rights: does not
   contain third-party content. Age rating questionnaire: answer None/No to everything (4+).
4. **Version 1.0 page**: confirm the build is selected and screenshots are there. In the
   **In-App Purchases** section, click + and add every game listed. Fill **App Review
   Information** (your name, phone, email; no sign-in needed).
5. **Add for Review > Submit**.

After Apple approves 1.0, every Tuesday and Sunday deploy is fully automatic, including new
in-app purchases.

## Running things by hand
GitHub **Actions** tab:
- **App Store deploy > Run workflow** ships now (tick *force* to ship without new games).
- **Nightly chart snapshot > Run workflow** grabs the charts now.
