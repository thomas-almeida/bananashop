/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  // Configuração para evitar erros de ESM
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  // Desativar verificação de tipo durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desativar verificação de ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuração de saída estática
  output: 'standalone',
};

module.exports = nextConfig;
