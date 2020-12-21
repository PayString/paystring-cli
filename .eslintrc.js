module.exports = {
  root: true,

  parser: '@typescript-eslint/parser', // Make ESLint compatible with TypeScript
  parserOptions: {
    // Enable linting rules with type information from our tsconfig
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],

    sourceType: 'module', // Allow the use of imports / ES modules

    ecmaFeatures: {
      impliedStrict: true, // Enable global strict mode
    },
  },

  // Specify global variables that are predefined
  env: {
    node: true, // Enable node global variables & Node.js scoping
    es2020: true, // Add all ECMAScript 2020 globals and automatically set the ecmaVersion parser option to ES2020
  },

  plugins: [],
  extends: [
    '@xpring-eng/eslint-config-mocha',
    '@xpring-eng/eslint-config-base',
  ],

  rules: {
    // linter doesn't seem to understand ESM imports used by jose, even though typescript handles them just fine.
    "node/no-missing-import": ["error", {
      allowModules: ["jose"],
    }],
    "import/no-unresolved": [
      2,
      {
        ignore: [
          'jose'
        ]
      }],
  },
  overrides: [
    {
      "files": ["*cli.ts"],
      "rules": {
        "node/shebang": "off"
      },
    },
    {
      "files": ["src/commands/*.ts"],
      "rules": {
        "class-methods-use-this": "off"
      },
    }],
}
