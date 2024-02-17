const CartFetch = require("../libraries/CartFetch");
const cartFetch = new CartFetch();

const getCartItems = (req, res) => {
  cartFetch.getItems(req, res);
};

const postAddItem = (req, res) => {
  cartFetch.addItem(req, res);
};

const postDeleteItem = (req, res) => {
  cartFetch.deleteItem(req, res);
};

module.exports = { getCartItems, postAddItem, postDeleteItem };
