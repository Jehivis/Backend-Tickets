'use strict'

const DamagedMerchandise = require('../models/DamagedMerchandise');
const Email_template = require('../models/Email_template');
const cloudinary = require('../cloudinary.config');
const moment = require('moment');
const nodemailer = require('nodemailer');
var currencyFormatter = require('currency-formatter');

async function storeDamagedMerchandise(req,res) {
    let params = JSON.parse(req.body.data);
    let file = req.file;
    let damagedMerchandise = new DamagedMerchandise();
    let currency_format = {
        symbol: 'Q.',//simbolo
        decimal: '.',//punto de los decimales
        thousand: ',', //separador entre miles
        precision: 2, // número de decimales
        format: '%s %v' // %s es el simbolo %v es el valor
    };
    if(params.upc != "" && params.alu != "" && params.size != "" && params.price != "" && params.damaged != "" && file){
        let result = await cloudinary.uploader.upload(file.path);

        damagedMerchandise.upc = params.upc;
        damagedMerchandise.alu = params.alu;
        damagedMerchandise.siz = params.size;
        damagedMerchandise.price = params.price;
        damagedMerchandise.damage = params.damaged;
        damagedMerchandise.store_created = params.store_created;
        damagedMerchandise.image = result.public_id;

        damagedMerchandise.save(async (err, sotredDamaged)=>{
            if(err) return res.status(500).send({ message: 'No se pudo guardar la mercaderia dañada' })
            if(!sotredDamaged) return res.status(404).send({ message: 'Algo salío mal' })
            if(sotredDamaged){
                var emails = [];
                let showUser = await Email_template.find({ template: 'Mercaderia Dañada', status: "Activo" });
                showUser.map((elementos) => {
                    return emails.push(elementos.email)
                });

                var emailsDefault = [];
                let showUserDefault = await Email_template.find({ template: 'Mercaderia Dañada Default', status: "Activo" });
                showUserDefault.map((elementos) => {
                    return emailsDefault.push(elementos.email)
                });
                
                if(emailsDefault.length < 1){
                    emailsDefault.push("jrodriguez@corpinto.com");
                }

                if(emails.length < 1){
                    emails.push("jrodriguez@corpinto.com");
                }

                email(
                    params,
                    emailsDefault,
                    emails,
                    'Mercadería Dañada',
                    `<table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información De Envio Inmediato
                            </div>
                        </td>
                    </tr>
                </table>
                <!-- pre-header end -->
                <!-- header -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- end header -->
                <!-- big image section -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td align="center" class="section-img">
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="${process.env.CLOUD_URL + result.public_id}" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            NUEVO TICKET DE MERCADERÍA DAÑADA
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                            <tr>
                                                <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="container590">
                                            <tr>
                                                <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px; color:black">
                                                    <div style="color:black">
                                                    <b>Se reportó la siguiente mercadería dañada en la tienda ${params.store_created}
                                                    </b>
                                                    <br>
                                                    </b>
                                                    <p><b>DAÑO:</b> ${params.damaged}</p>
                                                 <table class="table">
                                                 <thead align="center">
                                                 <tr>
                                                     <th scope="col">UPC</th>
                                                     <th scope="col">ALU</th>
                                                     <th scope="col">TALLA</th>
                                                     <th scope="col">PRECIO</th>
                                                 </tr>
                                             </thead>
                                             <tbody align="center">
                                                <tr>
                                                    <td>${params.upc}</td>
                                                    <td>${params.alu}</td>
                                                    <td>${params.size}</td>
                                                    <td>${currencyFormatter.format(params.price, currency_format)}</td>
                                                </tr>
                                             </tbody>
                                            </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="hide">
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                    </tr>
                </table>
                <!-- end section -->`
                )
                return res.status(200).send({ message: 'Registro almacenado exitosamente!', damaged: sotredDamaged });
            }
        })
    }else{
        return res.status(500).send({ message : "Faltan datos" })
    }
}

async function getDamageMerchandise(req,res) {
    let message;
    let damagedMerchandise = await DamagedMerchandise.find({
        store_created: req.body.store
    })

    if(!damagedMerchandise){
        message = 'No se encontraron datos';
    }else{
        message = 'Datos encontrados';
    }

    return res.status(200).send({
        damaged : damagedMerchandise
    })
}

async function getDataReport(req, res) {
    let query;
    if(req.body.role == "admin"){
        if(req.params.date_start !== req.params.date_end){
            if(req.body.store && req.body.store != "Todas"){
                query = {
                    timestamp:{
                        $gt:  moment(req.params.date_start).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                        $lt:  moment(req.params.date_end).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    },
                    store_created: req.body.store
                }
            }else{
                query = {
                    timestamp:{
                        $gt:  moment(req.params.date_start).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                        $lt:  moment(req.params.date_end).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    }
                }
            }
        }else{
            if(req.body.store && req.body.store !== "Todas"){
                query = {
                    timestamp:{
                        $gte: moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDT00:00:00.80Z"),
                        $lt: moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDT23:59:59.80Z")
                    },
                    store_created: req.body.store
                }
            }else{
                query = {
                    timestamp: {
                        $gte: moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDT00:00:00.80Z"),
                        $lt: moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDT23:59:59.80Z")
                     },
                }
            }
        }
    }else{
        if(req.params.date_start !== req.params.date_end){
            query = {
                timestamp:{
                    $gt: moment(new Date(req.params.date_start)).format("YYYY-MM-DD"),
                    $lt: moment(new Date(req.params.date_start)).format("YYYY-MM-DD")
                },
                store_created: req.body.store
            }
        }else{
            query = {
                timestamp:{
                    $gte: moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDT00:00:00.80Z"),
                    $lt: moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDT23:59:59.80Z")
                },
                store_created: req.body.store
            }
        }
    }
    await DamagedMerchandise.find(query).exec((err, result) => {
        if(err) return res.status(500).send('Algo salío mal')
        if(!result) return res.status(404).send({ message: 'No existen datos en el rango de fechas especificado' })
        return res.status(200).send({data: result});
    });
}

function randomNumber() {
    const possible = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let ramdomNum = 0;
    for (let i = 0; i < 6; i++) {
        ramdomNum += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return ramdomNum;
}

//Generar Email
async function email(data, reseptor, emisor, titulo, template) {
    let randsend = randomNumber();
    let Moment = require("moment-timezone");
    let hoy = new Date(Moment().tz("America/Guatemala").format());
    //console.log(hoy.format());
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1;
    let yyyy = hoy.getFullYear();

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "noreply@corpinto.com", // generated ethereal user
            pass: "m1$0n@lc0rp!nt0" // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'noreply@corpinto.com', // sender address
        to: reseptor, // list of receivers
        cc: emisor,
        bcc: 'dlara2017229@gmail.com',
        subject:
            `${titulo} ${data.store_created} ${dd}/${mm}/${yyyy} - Ticket ${randsend}`,
        text: "", // plain text body
        html: template, // html body
    }, async function (err, json) {
        if (err) console.log(`ERROR EN EL ENVÍO: ${err}`);
        if (json) console.log(`CORREO SE ENVIADO EXITOSAMENTE: ${json}`);
    });
}

module.exports = {
    storeDamagedMerchandise,
    getDamageMerchandise,
    getDataReport
}