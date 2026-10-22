import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      'MCC/**',
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'next-env.d.ts',
      'scripts/**',
      'tests/**',
    ],
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react/display-name': 'off',
      '@next/next/no-img-element': 'warn',
    },
  },
];

export default eslintConfig;
