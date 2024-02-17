const DataFetch = require("../libraries/DataFetch");
const dataFetch = new DataFetch();

const getSelectedItem = (req, res) => {
  dataFetch.fetchItem(req, res);
};

module.exports = { getSelectedItem };
