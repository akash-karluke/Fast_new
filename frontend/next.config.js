/** @type {import('next').NextConfig} */

const path = require("path");
// const { config } = require('process');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;


module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

// module.exports = {
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//   },
// }

// // module.exports = {
// //   sassOptions: {
// //     includePaths: [path.join(__dirname, 'styles')],
// //   },
// // }
