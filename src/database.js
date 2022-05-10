const mongoose = require('mongoose');
const URI = process.env.URI;
require('dotenv').config();

const clientDB = mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((res) => {
        console.log('DataBase is connected');
        return res.connection.getClient();
    })
    .catch(err => console.error(err));

module.exports = clientDB;