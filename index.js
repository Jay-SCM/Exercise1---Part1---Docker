const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

//swagger
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const shopRoutes = require("./routes/shopRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use("/shop", shopRoutes);

app.listen(port, () => {
  console.log(`Port listening at http:localhost:${port}`);
});
