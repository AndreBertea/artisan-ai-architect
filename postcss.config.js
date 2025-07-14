export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
      overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead'],
    },
  },
}
