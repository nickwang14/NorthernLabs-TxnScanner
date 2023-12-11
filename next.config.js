require('dotenv').config();
const withImages = require('next-images')

module.exports = withImages({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/transactions',
        permanent: true,
      },
    ]
  },
  images: {
    path: '/assets/icons',
  },
})
