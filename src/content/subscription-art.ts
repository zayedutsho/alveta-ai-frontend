/** Original decorative connector slots, relative to Figma 1286:1264 (1200 × 496). */
export const subscriptionConnectors = [
  { node: '1286:1272', asset: 'subscription-vector8', x: 421.5, y: 269, w: 115, h: 52.5, offsetX: 0, offsetY: -.75, transform: 'rotate(180deg)' },
  { node: '1286:1273', asset: 'subscription-vector7', x: 297, y: 327.5, w: 121.75, h: 58.5, offsetX: -.75, offsetY: -.75, transform: 'rotate(180deg)' },
  { node: '1286:1274', asset: 'subscription-line70', x: 191, y: 250, w: 172, h: 0, offsetX: 0, offsetY: -1.5, transform: 'rotate(180deg)' },
  { node: '1286:1275', asset: 'subscription-line71', x: 336, y: 250, w: 150, h: 0, offsetX: 0, offsetY: -1.5, transform: 'rotate(180deg)' },
  { node: '1286:1270', asset: 'subscription-vector13', x: 423.5, y: 190, w: 62.5, h: 44, offsetX: 0, offsetY: -.75, transform: 'scaleX(-1)' },
  { node: '1286:1271', asset: 'subscription-vector14', x: 294, y: 112, w: 121.75, h: 61, offsetX: -.75, offsetY: -.75, transform: 'scaleX(-1)' },
  { node: '1286:1305', asset: 'subscription-vector9', x: 714, y: 181.5, w: 115, h: 52.5, offsetX: 0, offsetY: -.75, transform: 'none' },
  { node: '1286:1306', asset: 'subscription-vector10', x: 831.75, y: 117, w: 99.25, h: 58.5, offsetX: -.75, offsetY: -.75, transform: 'none' },
  { node: '1286:1307', asset: 'subscription-vector6', x: 757.5, y: 269, w: 196, h: 117, offsetX: 0, offsetY: -.75, transform: 'scaleY(-1)' },
  { node: '1286:1308', asset: 'subscription-vector11', x: 714, y: 269, w: 115, h: 52.5, offsetX: 0, offsetY: -.75, transform: 'scaleY(-1)' },
  { node: '1286:1309', asset: 'subscription-vector12', x: 831.75, y: 327.5, w: 88.25, h: 58.5, offsetX: -.75, offsetY: -.75, transform: 'scaleY(-1)' },
  { node: '1286:1310', asset: 'subscription-line74', x: 874, y: 253, w: 171, h: 0, offsetX: 0, offsetY: -1.5, transform: 'none' },
  { node: '1286:1311', asset: 'subscription-line75', x: 770, y: 253, w: 131, h: 0, offsetX: 0, offsetY: -1.5, transform: 'none' },
];

/** Centerlines follow the original SVG fragments, ordered from offer to provider. */
export const subscriptionNetworks = [
  { id: 'chatgpt', fragments: [4, 5], path: 'M486 234 H482.238 C459.204 234 438.259 220.651 427.851 199.34 L403.61 146.786 C393.665 125.31 372.153 112 348.486 112 H292.512', color: '#1154D4' },
  { id: 'claude', fragments: [6, 7], path: 'M714 234 H765.94 C788.628 234 809.323 221.044 819.91 200.214 L843.625 150.909 C853.763 129.916 875.019 117 898.331 117 H927', color: '#B5388C' },
  { id: 'grok', fragments: [2, 3], path: 'M486 250.75 H190.512', color: '#2EB67D' },
  { id: 'gemini', fragments: [11, 12], path: 'M770 252.25 H1010', color: '#1154D4' },
  { id: 'deepseek', fragments: [0, 1], path: 'M536.5 269 H484.56 C461.872 269 441.177 281.956 430.59 302.786 L406.125 351.341 C396.238 371.815 375.507 386 352.77 386 H294.512', color: '#4285F4' },
  { id: 'kimi', fragments: [8, 9, 10], path: 'M757.5 269 H765.845 C788.869 269 809.862 282.175 819.875 302.909 L843.625 352.091 C853.638 372.825 874.631 386 897.655 386 H927', color: '#007BB5' },
];

export const subscriptionProviderSlots: Record<string, { x: number; y: number; node: string }> = {
  chatgpt: { x: 143, y: 79, node: '1286:1295' },
  grok: { x: 41, y: 219, node: '1286:1276' },
  deepseek: { x: 145, y: 354, node: '1286:1286' },
  claude: { x: 927, y: 81, node: '1286:1362' },
  gemini: { x: 1010, y: 221, node: '1286:1327' },
  kimi: { x: 927, y: 353, node: '1286:1312' },
};
