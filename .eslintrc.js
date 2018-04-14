module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "prettier",
    "prettier/flowtype",
    "plugin:flowtype/recommended",
  ],
  "plugins": [
    "flowtype",
    "prettier",
  ],
  "rules": {
    "prettier/prettier": ["error", {
      "singleQuote": true,
      "trailingComma": "all",
      "parser": "flow",
    }],
    "no-console": 0,
  },
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true,
  },
};
