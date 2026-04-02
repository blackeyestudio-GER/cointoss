/**
 * Münzflächen: zentriertes **O** (Kopf) und **X** (Zahl), ohne Webfont — nur Pfade.
 */
export const COIN_FACE_SVG_HEADS = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="hG" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#faf6ec"/>
      <stop offset="55%" stop-color="#e3dcc8"/>
      <stop offset="100%" stop-color="#c4b896"/>
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="250" fill="url(#hG)"/>
  <circle cx="256" cy="256" r="226" fill="none" stroke="#8a7a52" stroke-width="8"/>
  <circle cx="256" cy="256" r="208" fill="none" stroke="#b5a882" stroke-width="3" opacity="0.7"/>
  <circle cx="256" cy="256" r="92" fill="none" stroke="#6b5c3a" stroke-width="24"/>
  <circle cx="256" cy="256" r="248" fill="none" stroke="#5c4f35" stroke-width="2" opacity="0.35"/>
</svg>`

export const COIN_FACE_SVG_TAILS = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="tG" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#eef2f8"/>
      <stop offset="50%" stop-color="#cfd6e2"/>
      <stop offset="100%" stop-color="#a8b4c8"/>
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="250" fill="url(#tG)"/>
  <circle cx="256" cy="256" r="226" fill="none" stroke="#5c6b82" stroke-width="8"/>
  <circle cx="256" cy="256" r="208" fill="none" stroke="#8a96ab" stroke-width="3" opacity="0.65"/>
  <g fill="none" stroke="#2f3d52" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M178 178 L334 334"/>
    <path d="M334 178 L178 334"/>
  </g>
  <circle cx="256" cy="256" r="248" fill="none" stroke="#3d4d64" stroke-width="2" opacity="0.35"/>
</svg>`
