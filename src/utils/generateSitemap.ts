import { supabase } from "@/integrations/supabase/client";

export async function generateSitemap() {
  const { data: properties } = await supabase
    .from('properties')
    .select('property_code, city, neighborhood, title, updated_at')
    .eq('status', 'active');

  const baseUrl = 'https://wesleyreis.com.br';
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${properties?.map(property => {
    const slug = `${property.city.toLowerCase()}/${property.neighborhood.toLowerCase()}/${property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `
  <url>
    <loc>${baseUrl}/imovel/${property.property_code}/${slug}</loc>
    <lastmod>${property.updated_at?.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('')}
</urlset>`;

  return xml;
}
