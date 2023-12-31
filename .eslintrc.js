module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: [
    'tsdoc',
    'import',
    'unused-imports',
  ],
  extends: [
    'es/node',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/lines-between-class-members': ['error', { exceptAfterSingleLine: true }],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',

    'no-constant-condition': 'off',

    'array-bracket-spacing': ['error', 'never'],
    'class-methods-use-this': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'import/no-unresolved': 'off',
    'lines-around-comment': 'off',
    'no-duplicate-imports': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    'padding-line-between-statements': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'sort-imports': 'off',
    'strict': 'off',
    'unicorn/import-style': 'off',
    'prefer-named-capture-group': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      parser: 'espree',
    },
  ],
};
