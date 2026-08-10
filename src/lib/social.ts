/**
 * The hotel's social channels, in the order they should be shown.
 *
 * URLs are edited in Keystatic under Site settings. Any channel left blank is
 * simply absent from the side menu and the socials page: an icon linking
 * nowhere is worse than one fewer icon.
 *
 * Names are brand names, so they are not translated.
 */
export const SOCIAL_KEYS = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x'] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
};

export type SocialLink = { key: SocialKey; label: string; href: string };

/** The channels that actually have a URL set, in `SOCIAL_KEYS` order. */
export function socialLinks(settings: any): SocialLink[] {
  const social = settings?.social ?? {};
  return SOCIAL_KEYS.flatMap((key) => {
    const href = typeof social[key] === 'string' ? social[key].trim() : '';
    return href ? [{ key, label: SOCIAL_LABELS[key], href }] : [];
  });
}
