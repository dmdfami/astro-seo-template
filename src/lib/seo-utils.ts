import siteConfig from '../../site-config.json';

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function generateMetaTitle(title: string): string {
  const fullTitle = title === siteConfig.site.name
    ? title
    : `${title} | ${siteConfig.site.name}`;
  return truncate(fullTitle, 60);
}

export function generateMetaDescription(description: string): string {
  return truncate(description, 160);
}

export function getCanonicalURL(pathname: string): string {
  const cleanPath = pathname.replace(/\/$/, '');
  const cleanSite = siteConfig.site.url.replace(/\/$/, '');
  return cleanPath === '' ? cleanSite : `${cleanSite}${cleanPath}`;
}

export function getOpenGraphImageURL(image?: string): string {
  const site = siteConfig.site.url.replace(/\/$/, '');
  if (!image) return `${site}${siteConfig.site.defaultImage}`;
  if (image.startsWith('http')) return image;
  return `${site}${image}`;
}
