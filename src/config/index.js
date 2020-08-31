const envConfig = require(`./env.${process.env.NODE_ENV}`).default

export default envConfig
