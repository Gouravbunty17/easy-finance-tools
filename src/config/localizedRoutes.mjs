export const LOCALE_PAIRS = Object.freeze([
  ["/", "/fr"],
  ["/tools", "/fr/outils"],
  ["/tools/mortgage-calculator", "/fr/outils/calculateur-hypothecaire"],
]);
const pairs = new Map(LOCALE_PAIRS.flatMap(([en,fr])=>[[en,{en,fr}],[fr,{en,fr}]]));
export function normalizedPath(path="/") {
 const raw=String(path||"/").split(/[?#]/)[0];
 return raw==="/"?"/":raw.replace(/\/+$/,"")||"/";
}
export function isFrenchRoute(path="/") {
 const value=normalizedPath(path);
 return value==="/fr"||value.startsWith("/fr/");
}
export function getLanguageSwitchPath(path="/") {
 const value=normalizedPath(path),pair=pairs.get(value);
 return isFrenchRoute(value)?(pair?.en||"/"):(pair?.fr||"/fr");
}
export function getLanguageAlternates(path="/") {
 const pair=pairs.get(normalizedPath(path));
 if(!pair)return [];
 const origin="https://easyfinancetools.com";
 return [{language:"en-CA",href:origin+pair.en},{language:"fr-CA",href:origin+pair.fr}];
}
