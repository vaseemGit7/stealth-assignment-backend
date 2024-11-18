import express from "express";
import bodyParser from "body-parser";
import productRouter from "./routes/products.js";
import cors from "cors"

const app = express();
const PORT = 5000;

app.use(cors())
app.use(bodyParser.json());

app.listen(PORT, () =>
  console.log(`Server running on the port: http://localhost:${PORT}`)
);

app.get("/", (req, res) => {
  res.send("Hello from homepage");
});

app.use("/products", productRouter);
