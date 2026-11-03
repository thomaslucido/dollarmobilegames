// Run on the macOS runner after `npx cap add ios`: iPhone-only, portrait, export compliance,
// display name and team id. Usage: TEAM_ID=XXXX node scripts/configure-ios.mjs
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
const plistPath = 'ios/App/App/Info.plist';
let plist = readFileSync(plistPath, 'utf8');
const setKey = (key, xml) => {
  const re = new RegExp(`<key>${key}</key>\\s*(<array>[\\s\\S]*?</array>|<[^>]+/>|<string>[^<]*</string>)`);
  plist = re.test(plist) ? plist.replace(re, `<key>${key}</key>\n\t${xml}`) : plist.replace(/<dict>/, `<dict>\n\t<key>${key}</key>\n\t${xml}`);
};
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
setKey('CFBundleDisplayName', `<string>${esc(process.env.DISPLAY_NAME || process.env.APP_NAME || 'Game')}</string>`);
setKey('ITSAppUsesNonExemptEncryption', '<false/>');
setKey('UIRequiresFullScreen', '<true/>');
setKey('UIStatusBarHidden', '<true/>');
setKey('UIViewControllerBasedStatusBarAppearance', '<false/>');
setKey('UISupportedInterfaceOrientations', '<array>\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t</array>');
plist = plist.replace(/\s*<key>UISupportedInterfaceOrientations~ipad<\/key>\s*<array>[\s\S]*?<\/array>/, '');
writeFileSync(plistPath, plist);

const pbxPath = 'ios/App/App.xcodeproj/project.pbxproj';
let pbx = readFileSync(pbxPath, 'utf8');
pbx = pbx.replace(/TARGETED_DEVICE_FAMILY = "?[0-9,]+"?;/g, 'TARGETED_DEVICE_FAMILY = 1;');
if (process.env.TEAM_ID) {
  pbx = pbx.replace(/DEVELOPMENT_TEAM = [A-Z0-9]*;\n/g, '');
  pbx = pbx.replace(/(PRODUCT_BUNDLE_IDENTIFIER = [^;]+;)/g, `$1\n\t\t\t\tDEVELOPMENT_TEAM = ${process.env.TEAM_ID};`);
}
pbx = pbx.replace(/CODE_SIGN_STYLE = Manual;/g, 'CODE_SIGN_STYLE = Automatic;');
writeFileSync(pbxPath, pbx);
console.log('iOS project configured (iPhone only, portrait, no encryption, team', process.env.TEAM_ID || 'unset', ')');

// App privacy manifest (declares no tracking, no data collection, UserDefaults reason CA92.1).
// Fastfile adds it to the Xcode target's resources.
copyFileSync('ios-extras/PrivacyInfo.xcprivacy', 'ios/App/App/PrivacyInfo.xcprivacy');

// Game Center (games with "gameCenter": true in www/games.json): local Capacitor plugin + entitlement.
// The Swift files are added to the App target by the Fastfile.
import { readFileSync as rf, existsSync as ex } from 'node:fs';
const gcSlug = process.env.SLUG;
const gcGame = gcSlug ? JSON.parse(rf('www/games.json', 'utf8')).find((g) => g.slug === gcSlug) : null;
if (gcGame && gcGame.gameCenter) {
  for (const f of ['GameCenterPlugin.swift', 'GameViewController.swift', 'App.entitlements']) copyFileSync(`ios-extras/gamecenter/${f}`, `ios/App/App/${f}`);
  const sbPath = 'ios/App/App/Base.lproj/Main.storyboard';
  if (ex(sbPath)) {
    let sb = readFileSync(sbPath, 'utf8');
    sb = sb.replace(/customClass="CAPBridgeViewController" customModule="Capacitor"/, 'customClass="GameViewController" customModule="App" customModuleProvider="target"');
    if (!sb.includes('GameViewController')) throw new Error('Could not point Main.storyboard at GameViewController');
    writeFileSync(sbPath, sb);
  }
  let p2 = readFileSync(pbxPath, 'utf8');
  if (!p2.includes('CODE_SIGN_ENTITLEMENTS')) p2 = p2.replace(/(PRODUCT_BUNDLE_IDENTIFIER = [^;]+;)/g, '$1\n\t\t\t\tCODE_SIGN_ENTITLEMENTS = App/App.entitlements;');
  writeFileSync(pbxPath, p2);
  console.log('Game Center enabled for', gcSlug);
}
