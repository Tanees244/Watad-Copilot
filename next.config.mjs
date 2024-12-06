/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure environment variables are exposed to the browser
    env: {
      NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    },
    
    // Optional: Add webpack configuration if needed
    webpack: (config, { isServer }) => {
      // Add any specific webpack configurations
      return config;
    },
  
    // Ensure proper output for Amplify deployment
    output: 'standalone'
  };
  
  export default nextConfig;