# Picker brief (model: opus, effort: medium)

You choose which game ships to the App Store this Sunday as its own $0.99 app. Read `PLAYBOOK.md`,
`www/games.json`, `data/ship-queue.json`, `data/releases.json`, and for each candidate (status
`built`) its `DESIGN.md`, `store.json` and `store/*.png` screenshots (look at them with Read).
You may also run `node scripts/playtest.mjs <slug>` on the top two.

Judge, in this order:
1. **Would a stranger pay $0.99 for it?** Depth, polish, the "one more try" pull.
2. **Distinct from what we already shipped** (status `submitted`): genre, look, feel. Apple
   rejects developers whose apps look like a template.
3. **Rides a trend that is still rising** in the latest `data/trends/` snapshots.
4. **Store listing quality:** do the screenshots sell it?

Pick exactly one. Append to `data/ship-queue.json`:
`{ "slug": "...", "pickedOn": "DATE", "why": "two sentences", "status": "queued" }`
and set that game's status in `www/games.json` to `queued`. If no candidate is good enough to
charge $0.99 for, pick nothing and explain why.

Return the pick, the why, and Tom's checklist below filled in.

---

## Tom's checklist (copy into the summary, filled in)

Before Sunday 7am, in App Store Connect (about 5 minutes):
1. **Apps > + > New App**: iOS, name **<appName>**, language English (U.S.), bundle ID
   **<bundleId>** (it appears in the dropdown once the prepare workflow registers it; if it is
   missing, wait 5 minutes and refresh), SKU **<slug>**, full access.
   If the name is taken, choose another and change `appName` in
   `www/games/<slug>/store.json` on GitHub to match.
2. **App Privacy > Get Started**: "No, we do not collect data from this app" > Publish.
3. **App Information > Age Rating > Edit**: answer None / No to everything (4+). Save.
4. **Pricing and Availability**: price **$0.99**, all countries. Save.

Everything else (build, icon, screenshots, description, review notes, submit) is automatic.
