function wrapSvg(path, viewBox = '0 0 24 24') {
  return `
    <svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${path}
    </svg>
  `.trim();
}

window.SFIcons = {
  backHome: wrapSvg(`
    <path d="M14 6 8 12l6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  `),
  home: wrapSvg(`
    <path d="M4 11.5 12 5l8 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.5 10.7V20h11V10.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.2 20v-5h3.6v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  `),
  profile: wrapSvg(`
    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 21c1.6-3.2 4.4-5 8-5s6.4 1.8 8 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  `),
  community: wrapSvg(`
    <circle cx="7" cy="7.2" r="2.6" fill="currentColor"/>
    <circle cx="17" cy="7.2" r="2.6" fill="currentColor"/>
    <circle cx="12" cy="12" r="2.6" fill="currentColor"/>
    <path d="M3.6 18.6c0-2.2 1.8-4 4-4h2.8c2.2 0 4 1.8 4 4v1.8c0 .3-.2.6-.6.6H4.2c-.3 0-.6-.2-.6-.6v-1.8Z" fill="currentColor"/>
    <path d="M9.6 18.6c0-2.2 1.8-4 4-4h2.8c2.2 0 4 1.8 4 4v1.8c0 .3-.2.6-.6.6h-10c-.3 0-.6-.2-.6-.6v-1.8Z" fill="currentColor"/>
  `),
  watch: wrapSvg(`
    <rect x="7.2" y="2.8" width="9.6" height="5.2" rx="1.2" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="7.2" y="16" width="9.6" height="5.2" rx="1.2" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="6.8" stroke="currentColor" stroke-width="1.6" fill="none"/>
    <path d="M12 9.2V12h2.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="0.8" fill="currentColor"/>
  `),
  shop: wrapSvg(`
    <path d="M5 8h14l-1 13H6L5 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 8a3 3 0 1 1 6 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  `),
};
