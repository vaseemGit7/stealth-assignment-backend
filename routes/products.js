import express from "express";
import getProducts from "../controllers/products.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);

export default productRouter;
