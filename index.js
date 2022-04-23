
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');


//CONECCION A LA BASE DE DATOS
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser:true
}).then(() => {
    console.log('[ DATABASE RUNNING CORRECTLY ]')

    //CREAR SERVIDOR
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'),()=>{
        console.log(`[ THE SERVER IS RUNNING IN THE PORT: '${app.get('port')}' ]`);
    })
}).catch(err => console.log(err));