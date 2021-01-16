module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    globals : {
        wx:true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        semi: [2, "always"],
        quotes: [2, "double"],
        indent: ["error", 4],
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        camelcase: 0,
        "no-irregular-whitespace": ["error", { "skipComments": true }],
        "no-tabs" : 0
    }
};
