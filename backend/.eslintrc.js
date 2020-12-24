module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    'no-use-before-define': 'error',
    'no-unused-vars': 'warn',
    "indent": ["error", 2],
  }
};
