module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-env',
      '@babel/typescript'
    ],
    plugins: [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread"
    ]
  };
};
