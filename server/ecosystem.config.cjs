// const { calcPath, getEnvVariables } = require("./helpers.js");
// console.log("===============>", getEnvVariables());
module.exports = {
  apps: [
    {
      name: "Academy back",
      script: "./server.js",
      interpreter: "node",
      node_args: "-r dotenv/config",
      // env: getEnvVariables(),
      watch:true
    },
  ],
};


