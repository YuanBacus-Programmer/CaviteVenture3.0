/** @type {import('next').NextConfig} */
const nextConfig = {
 
 images: {
   domains: ['source.unsplash.com', 'your-image-domain.com'], 
 },

 env: {
   MONGO_URI: process.env.MONGO_URI, // MongoDB URI exposed to the app
 },

 webpack: (config, { dev, isServer }) => {

   if (!dev && isServer) {
     // This will optimize the size of the server-side bundles
     config.optimization.splitChunks = {
       chunks: 'all',
       minSize: 20000,
       maxSize: 40000,
     };
   }

   // You can add additional Webpack rules or plugin modifications here

   return config;
 },

 async headers() {
   return [
     {
       // Add security headers
       source: '/(.*)',
       headers: [
         {
           key: 'X-Content-Type-Options',
           value: 'nosniff',
         },
         {
           key: 'X-Frame-Options',
           value: 'DENY',
         },
       ],
     },
   ];
 },

 
};

export default nextConfig;