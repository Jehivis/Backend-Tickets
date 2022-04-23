const BinnacleSaleByteBefore = require('../models/BinnacleSaleByteBefore');
let Moment = require("moment-timezone");
let hoy = Moment().tz("America/Guatemala")._d;
const changeNameStore = async (req, res)=>{

    try {
        const datos = await BinnacleSaleByteBefore.find({store_creat: req.body.store});
            datos.map(async (item)=>{
               await BinnacleSaleByteBefore.findByIdAndUpdate(item._id,{ store_creat: req.body.storeChange},(err, inactive)=>{
                   if(err) console.log("Fallo el id: " + item._id)
                    console.log("Existo al ingresar id: " + item._id);           
               });
            });    
        res.status(200).send('Migracion Completa')
    } catch (error) {
        res.status(500).send('Error en migracion')
    }
    
};

const getDateBefore = async (req, res)=>{

    try {
        let beforeDay = Moment(hoy, 'DD-MM-YYYY').subtract(1,'days').format();

        res.status(200).json(beforeDay)
    } catch (error) {
        res.status(500).send('Error en migracion')
    }
    
};

module.exports ={
    changeNameStore,
    getDateBefore
}