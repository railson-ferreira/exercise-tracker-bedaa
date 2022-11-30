require('dotenv').config()

var listener = require("./api/index").listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});