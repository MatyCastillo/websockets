import express from "express";
import CartContainer from "../classes/CartContainer.js";
import upload from "../services/upload.js";
import { io } from "../app.js";
import { authMiddleware } from "../utils.js";

const router = express.Router();
const cartContainer = new CartContainer();
//POST
router.post("/", (req, res) => {
  let newCart = req.body;
  cartContainer.save(newCart).then((result) => {
    res.send(result);
  });
});
router.post("/:cartid/productos", (req, res) => {
  let cartID = parseInt(req.params.cartid);
  let productsID = req.body.ids;
  cartContainer.addProducts(cartID, productsID).then((result) => {
    res.send(result);
  });
});
//GETS
router.get("/:id/productos", (req, res) => {
  let id = parseInt(req.params.id);
  cartContainer.getProductsInCartById(id).then((result) => {
    res.send(result.products);
  });
});
//DELETE
router.delete("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  cartContainer.deleteById(id).then((result) => {
    res.send(result);
  });
});
router.delete("/:id/productos/:id_prod", (req, res) => {
  let cartId = parseInt(req.params.id);
  let productId = parseInt(req.params.id_prod);
  cartContainer.deleteProductById(cartId, productId).then((result) => {
    res.send(result);
  });
});

export default router;
