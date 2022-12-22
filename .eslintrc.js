module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-useless-escape': 0
  },
  parserOptions: {
    'ecmaVersion': 6
  },
};
