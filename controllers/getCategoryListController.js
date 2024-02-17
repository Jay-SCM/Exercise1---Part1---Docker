const DataFetch = require("../libraries/DataFetch");
const dataFetch = new DataFetch();

const getCetegoryList = (req,res) =>{
    dataFetch.fetchCategory(req,res);
}

module.exports = {getCetegoryList};

