module.exports = {
  rules: {      
    "linebreak-style": [0, "unix"],
    semi: [2, "always"],
    "no-unused-vars": [0],
    "no-console": "off",
    "no-undef": "off"
  },
  env: {
    es6: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module",
  },
};
