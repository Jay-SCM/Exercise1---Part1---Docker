const DataFetch = require('../libraries/DataFetch');
const dataFetch = new DataFetch();


const getAllProducts = (req,res)=>{
    dataFetch.fetchAll(req,res);
}

module.exports = {getAllProducts};