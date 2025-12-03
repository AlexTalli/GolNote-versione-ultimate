const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add alias to resolve wa-sqlite.wasm correctly
  config.resolve.alias = {
    ...config.resolve.alias,
    './wa-sqlite/wa-sqlite.wasm': path.resolve(__dirname, 'node_modules/wa-sqlite/dist/wa-sqlite.wasm'),
  };

  // Add rule to handle .wasm files
  config.module.rules.push({
    test: /\.wasm$/,
    type: 'asset/resource',
  });

  // Configure development server for SharedArrayBuffer support
  if (config.devServer) {
    config.devServer.headers = {
      ...config.devServer.headers,
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    };
  }

  return config;
};