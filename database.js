const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser:true
    })
    .then(db => console.log('DB is connect'))
    .catch(err => console.log(err));