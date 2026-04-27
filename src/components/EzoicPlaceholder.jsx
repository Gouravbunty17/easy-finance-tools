// Deprecated. Use EzoicAd instead — it's already used everywhere else in the
// codebase, includes the "Advertisement" label required by ad networks, and
// re-fires showAds on SPA route changes via useLocation.
//
// This file is kept temporarily as an empty re-export shim so any stray
// import does not break the build. Safe to delete once no imports reference it.
export { default } from "./EzoicAd";
