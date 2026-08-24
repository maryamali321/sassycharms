import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    ignores: ['legacy-static-site/**', 'legacy-nextjs-site/**'],
  },
];

export default config;
