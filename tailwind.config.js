/* The Tailwind configuration — one copy, compiled, instead of the Play CDN.

   PINNED: tailwindcss 3.4.17 (package.json, exact). That is the version
   https://cdn.tailwindcss.com resolved to when this file was written (it redirects to
   /3.4.17), and the version every approved page was reviewed under. Do not move to v4 —
   its preflight and defaults differ — and do not bump v3 without a parity run
   (node build/parity/students.js).

   `theme` is the inline `tailwind.config` the pages carry, verbatim; build/check.js
   compares the two, so they cannot drift while both exist.

   `content` is every page and every generator: a class written only inside a builder's
   template string (or added by a script) is still seen, so the compiled sheet covers
   sections moved between pages without a rebuild — as long as no NEW utility is
   invented on the way. A new utility needs `npm run build:assets`. */
module.exports = {
  content: [
    './site/*.html',
    './build/*.js',
    './build/shell/*.html',
    './build/assets/js/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      colors: {
        orange: { 50:'#FEF4F1',100:'#FDE5E0',200:'#FBC9BF',300:'#F8A392',400:'#F58971',500:'#F36F5A',600:'#DC5A45',700:'#B84431',800:'#8C2E1F',900:'#5D1E13' },
        teal:   { 50:'#E8F8FB',100:'#D3F1F6',200:'#A7E3ED',300:'#6ED7E8',400:'#2CC3DB',500:'#0CA9C3',600:'#0991A8',700:'#06748A',800:'#045566',900:'#023744' },
        mint:   { 50:'#EDFAF4',100:'#DCF5EA',200:'#B3E9D1',400:'#5ED2A0',500:'#3AC184',600:'#2AA46C',700:'#1B7A50' },
        ink:    { 0:'#FFFFFF',50:'#F8F9FB',100:'#F1F2F6',200:'#E5E7EB',300:'#D1D5DB',400:'#9CA3AF',500:'#6B7280',600:'#4B5563',700:'#374151',800:'#1F2937',900:'#111827',950:'#0A0E1A' },
      },
      letterSpacing: { tightest: '-0.035em' },
      boxShadow: {
        'diffuse': '0 1px 2px rgba(0,0,0,.04), 0 20px 40px -15px rgba(0,0,0,.08)',
        'diffuse-lg': '0 2px 6px rgba(0,0,0,.05), 0 32px 64px -16px rgba(0,0,0,.12)',
        'inner-hl': 'inset 0 1px 0 rgba(255,255,255,.45)',
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
    },
  },
};
