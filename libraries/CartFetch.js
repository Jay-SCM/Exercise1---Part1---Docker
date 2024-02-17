const axios = require("axios");
const Logger = require("./Logger");
const logging = new Logger();
let cartItems = [];

class CartFetch {
  constructor() {}

  getItems = (req, res) => {
    logging.logCartItems(cartItems);
    res.json(cartItems);
  };

  addItem = (req, res) => {
    const result = req.params;
    axios
      .get(`https://fakestoreapi.com/products/${result.id}`)
      .then((response) => {
        const data = response.data;
        res.status(200);
        res.json(data);
        cartItems.push(data);
        logging.logCartItems(cartItems);
      });
  };

  deleteItem = (req, res) => {
    const result = req.params;
    cartItems = cartItems.filter((item) => item.id != result.id);
    logging.logCartItems(cartItems);
    res.json(cartItems);
  };
}

module.exports = CartFetch;
