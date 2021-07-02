const express = require("express");
require("./src/db/conn");
const router = require("./src/routers/menRoute");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


const MensRanking = require("./src/models/mensModel");

const app = express();
const PORT = process.env.PORT | 8000;



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

                url: "http://localhost:8000"
            }
        ],
    },
    apis: ["./src/routers/*.js"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

console.log(specs);

app.use(express.json());

app.use(router);




app.listen(PORT, () =>
{
    console.log(`Server running on PORT : ${PORT}`);
});