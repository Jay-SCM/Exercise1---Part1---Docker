const { DateTime } = require("luxon");

class Timestamp {
    constructor(){}

    createTimestamp() {
        const timestamp = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
        return timestamp;
      }
}

module.exports = Timestamp;