const axios = require("axios");
const Logger = require("./Logger");
const logging = new Logger();

class DataFetch {
  constructor() {}

  fetchAll(req, res) {
    axios.get("https://fakestoreapi.com/products").then((response) => {
      const data = response.data;
      logging.logApiFetchResultArray(data);
      res.status(200);
      res.send(data);
    });
  }

  fetchItem(req, res) {
    const result = req.params;
    const url = `https://fakestoreapi.com/products/${result.id}`;
    axios.get(url).then((response) => {
      const data = response.data;
      logging.logApiFetchResultId(data);
      res.status(200);
      res.json(data);
    });
  }

  fetchCategory(req, res) {
    const result = req.params;
    let url;

    result.type == "women"
      ? (url = "https://fakestoreapi.com/products/category/women's%20clothing")
      : result.type == "men"
      ? (url = "https://fakestoreapi.com/products/category/men's%20clothing")
      : (url = `https://fakestoreapi.com/products/category/${result.type}`);

    axios.get(url).then((response) => {
      const data = response.data;
      logging.logApiFetchResultArray(data);
      res.status(200);
      res.json(data);
    });
  }
}

module.exports = DataFetch;
