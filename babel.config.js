// For jest only
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "14",
        },
        useBuiltIns: "usage",
        corejs: "3.9",
      },
    ],
    "@babel/preset-typescript",
  ],
};
