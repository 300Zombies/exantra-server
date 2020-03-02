module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["google"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    "new-cap": ["error", { capIsNew: false }],
    indent: "off",
    "object-curly-spacing": ["error", "always", { objectsInObjects: false }],
  },
};
