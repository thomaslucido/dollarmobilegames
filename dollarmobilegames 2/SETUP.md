# One-time setup (Tom)

About 20 minutes, once. After that, each week's app needs only the 5-minute checklist that
arrives as a GitHub issue (and in Saturday's build-night summary).

## 1. Turn on the web preview (GitHub Pages)
Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**.
Every game plus the privacy and support pages then live at
https://thomaslucido.github.io/dollarmobilegames/ (Apple requires those two URLs).

## 2. Paid apps agreement
App Store Connect > **Business** (Agreements, Tax, and Banking): accept the **Paid Apps**
agreement and add bank and tax info. Paid apps cannot go on sale without it.

## 3. API key for the robot
App Store Connect > **Users and Access > Integrations > App Store Connect API > Team Keys > +**.
Name it `GitHub deploy`, access **Admin** (needed so builds can sign themselves and register
bundle IDs). Download the `.p8` file (Apple lets you download it only once). Note the **Key ID**
and the **Issuer ID** at the top of the page. Your **Team ID** is at developer.apple.com >
Account > Membership details.

## 4. GitHub secrets
Repo **Settings > Secrets and variables > Actions > New repository secret**, four times:

| Name | Value |
|---|---|
| `ASC_KEY_ID` | the Key ID |
| `ASC_ISSUER_ID` | the Issuer ID |
| `ASC_KEY_P8` | open the .p8 in a text editor and paste the whole thing, BEGIN/END lines included |
| `TEAM_ID` | your 10-character Team ID |

Then delete the .p8 from your Downloads folder.

## 5. Kick off the first app
Actions tab > **Prepare next app** > **Run workflow**. It registers the first game's bundle ID
and opens an issue with the weekly checklist. Do the checklist and the Sunday deploy ships it.

## Every week after that
Saturday night's build summary (and a GitHub issue) tells you which game was picked and gives the
checklist: create the app record, privacy "Data Not Collected", age rating 4+, price $0.99.
Do it before Sunday 7am. If you miss it, do it whenever and then run **App Store deploy > Run
workflow** from the Actions tab.
