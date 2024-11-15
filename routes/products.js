import express from "express";
import products from "../database/productsDB.js";

const productRouter = express.Router();

productRouter.get("/", (req, res) => {
  res.send(products);
});

export default productRouter;
