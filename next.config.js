/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['kjlipbbrbwdzqiwvrnpw.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/imovel/novo',
        destination: '/dashboard/imovel/novo',
        permanent: true,
      },
      {
        source: '/imovel/editar/:path*',
        destination: '/dashboard/imovel/editar/:path*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig