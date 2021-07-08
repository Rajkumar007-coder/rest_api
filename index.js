const express = require("express");
const router = require("./src/routers/menRoute");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const config = require("config");
const port = config.get("port");
const host = config.get("host");
require("dotenv").config();
require("./src/db/conn");



const MensRanking = require("./src/models/mensModel");
const UserData = require("./src/models/userModel");

const app = express();
const PORT = process.env.PORT || `${port}`

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Olympics API",
            version: "1.0.0",
            description: "A simple olympic API"
        },
        servers: [
            {

            url: `${host}`
              
          }
        ],
        components: {
            securitySchemes: {
              jwt: {
                type: "http",
                scheme: "bearer",
                in: "header",
                bearerFormat: "JWT"
              },
            }
          }
          ,
          security: [{
            jwt: []
          }]
    },
    apis: ["./src/routers/*.js"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

console.log(specs);

app.use(express.json());

app.use(router);

if (process.env.NODE_ENV == 'development')
{
  module.exports = ("./config/default");
} else if (process.env.NODE_ENV == "production")
{
  module.exports = ("./config/prod");
}

app.listen(PORT, () =>
{
    console.log(`Server running on PORT : ${PORT}`);
});