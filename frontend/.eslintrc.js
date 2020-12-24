module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-console': ['warn', { allow: ['tron', 'disableYellowBox'] }],
    'no-use-before-define': 'error',
    'comma-dangle': 'error',
    'import/no-named-as-default': 'off',
    'linebreak-style': 'off',
    'no-underscore-dangle': 'off',
    'react/jsx-filename-extension': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'class-methods-use-this': 'off',
    'max-len': ['error', { code: 150 }],
    'import/prefer-default-export': 'off',
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': ['off', { ignore: ['navigation', 'dispatch', 'nav', 'children', 'scene', 'client'] }],
    'react/forbid-prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'import/no-named-as-default-member': 'off',
  },
};
