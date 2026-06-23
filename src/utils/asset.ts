/**
 * Resolve a path to a file in /public against the app's base URL.
 *
 * In dev the base is "/", in production (GitHub Pages) it is "/laoban/".
 * Hardcoded absolute paths like "/assets/logo/logo.png" would 404 on Pages
 * because they skip the base, so every reference to a public asset must go
 * through this helper.
 *
 *   asset('assets/logo/logo.png')  // dev:  /assets/logo/logo.png
 *                                  // prod: /laoban/assets/logo/logo.png
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
