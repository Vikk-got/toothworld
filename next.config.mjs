/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'plus.unsplash.com' }
        ],
    },
    // Optimization for faster transitions
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
};

export default nextConfig;
