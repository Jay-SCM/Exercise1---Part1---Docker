const express = require("express");
const router = express.Router();
const getAllProductsController = require("../controllers/getAllProductsController");
const getCategoryListController = require("../controllers/getCategoryListController");
const getSelectedItemController = require("../controllers/getSelectedItemController");
const cartControllers = require("../controllers/cartControllers");


router.get("/", (req, res) => {
  getAllProductsController.getAllProducts(req, res);
});

router.get("/cart", (req, res) => {
    cartControllers.getCartItems(req,res);
});

router.get("/:type", (req, res) => {
  getCategoryListController.getCetegoryList(req, res);
});

router.get("/item/:id", (req, res) => {
  getSelectedItemController.getSelectedItem(req, res);
});

router.post("/add/:id", (req, res) => {
  cartControllers.postAddItem(req,res);
});

router.post("/delete/:id", (req, res) => {
  cartControllers.postDeleteItem(req,res);
});

module.exports = router;
