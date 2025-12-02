const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        zlib: 'browserify-zlib',
        querystring: 'querystring-es3',
      };
    }
    return config;
  },
};

export default nextConfig;
