/** @type {import('next').NextConfig} */
const nextConfig = {
    // Increase server-side rendering timeout
    httpAgentOptions: {
      keepAlive: true,
    },
    
    // Webpack configuration
    webpack: (config, { isServer }) => {
      // Increase timeout for server-side requests
      if (isServer) {
        config.resolve.fallback = { fs: false, net: false, tls: false };
      }
      return config;
    },
  
    // Environment variables
    env: {
      NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    },
  
    // Deployment output
    output: 'standalone'
  };
  
  export default nextConfig;