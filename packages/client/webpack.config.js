const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');

const analyze = process.argv.includes('--analyze');

const plugins = [
  new MiniCssExtractPlugin({ filename: '[name].css' }),
  new ProvidePlugin({
    React: 'react',
  }),
];

if (analyze) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  entry: './src/index.ts',
  externals: [
    {
      '@heroicons/react/20/solid': {
        commonjs: '@heroicons/react',
      },
    },
    'next/link',
    'next/router',
    { 'react-dom': 'ReactDOM' },
    'react-toastify',
    { react: 'React' },
    'swr',
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins,
  resolve: {
    extensions: ['.tsx', '.ts', '...'],
    fallback: {
      crypto: false,
    },
  },
};
