/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
    eslint: {
        // ESLint warning about parser serialization is non-fatal
        // See: https://github.com/vercel/next.js/discussions/47553
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
