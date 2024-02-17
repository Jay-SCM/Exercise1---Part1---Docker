const Timestamp = require("./Timestamp");
const timestamp = new Timestamp();

class Logger {
  constructor() {}

  logApiFetchResultArray = (data) => {
    console.log(
      `Timestamp: ${timestamp.createTimestamp()}, Data Length: ${data.length}`
    );
  };

  logApiFetchResultId = (data) => {
    console.log(
      `Timestamp: ${timestamp.createTimestamp()}, Data ID: ${data.id}`
    );
  };

  logCartItems = (cartArray) => {
    console.log("********************************************************");
    console.log(`Cart Transaction Timestamp: ${timestamp.createTimestamp()}`);
    cartArray == 0
      ? console.log("No item in the cart.")
      : console.log(
          `Current Cart Item IDs: ${cartArray.map((item) => item.id)}`
        );
    console.log("********************************************************");
  };
}

module.exports = Logger;
