import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    ignores: ['legacy-static-site/**'],
  },
];

export default config;
