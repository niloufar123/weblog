const moment = require("jalali-moment");

exports.formatDate = (date) => {
    return moment(date).format("YYYY/MM/DD");
};


