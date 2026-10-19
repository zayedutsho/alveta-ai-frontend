import assets from '../content/figma-assets.json';

/** Original SVG root dimensions and PNG metadata captured during the Figma asset audit. */
export function figmaAsset(name: string) {
  if (!Object.hasOwn(assets, name)) throw new Error(`Unknown Figma asset: ${name}`);
  return assets[name as keyof typeof assets];
}
