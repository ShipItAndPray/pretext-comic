/**
 * Load a font and ensure it is available for canvas rendering.
 */
export async function loadFont(
  fontFamily: string,
  url: string,
  descriptors?: FontFaceDescriptors,
): Promise<void> {
  if (typeof document === 'undefined') return;

  const font = new FontFace(fontFamily, `url(${url})`, descriptors);
  const loaded = await font.load();
  document.fonts.add(loaded);
}

/** Common comic font families that are widely available. */
export const COMIC_FONTS = [
  'Comic Sans MS',
  'Comic Neue',
  'Bangers',
  'Permanent Marker',
  'Patrick Hand',
] as const;

export type ComicFont = (typeof COMIC_FONTS)[number];
