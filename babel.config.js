module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [ 
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@components': './src/components'
          },
          extensions: ['.tsx', '.ts', '.js', '.jsx', '.json']
        }
      ],
      'react-native-reanimated/plugin',
    ]
  };
};
