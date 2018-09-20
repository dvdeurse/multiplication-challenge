const presets = [
  ["@babel/env", {
    targets: {
      edge: "17",
      firefox: "60",
      chrome: "50",
      safari: "11.1",
      ie: "11"
    },
    useBuiltIns: "usage"
  }]
];

module.exports = { presets };
