'use strict'

const Store = require('../models/Store');
const User = require("../models/User");
const TicketSystem = require("../models/TicketSystem");
const TicketInmediates = require("../models/TicketInmediates");
const TicketInmediate = require("../models/TicketInmediate");
const TicketPhoto = require("../models/TicketPhoto");
const TicketExternal = require('../models/TicketExternal');
const Email_template = require('../models/Email_template');
const { firestore } = require('../firebase');
const axios = require('axios');
const nodemailer = require('nodemailer');
const Moment = require('moment');
const momentTimeZone = require("moment-timezone");
const cloudinary = require('../cloudinary.config');
//Crea los tickets de traslado de sistema
async function storeTicketSystemTransfer(req, res) {
    let params = req.body;
    let Ticket = new TicketSystem();
    console.log("---------0------------");
    //Se genera en el ticket de la tranferencia
    Ticket.status = 'Pendiente';
    Ticket.store_created = params[0].store_created;
    Ticket.store_asigned = params[0].store_asigned;
    Ticket.fact = params[0].bill
    Ticket.timestamp = Moment().utc();
    //insertamos los productos que se transferiran con el ticket
    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            siz: data.size,
        }
        Ticket.product.push(producto);
    })
    console.log("---------1------------");
    let data_store_asigned = await User.findOne({ store: params[0].store_asigned });
    console.log("---------2------------", data_store_asigned);
    Ticket.save(async (err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if (storedTicket) {
            console.log("---------3------------");
            let result_email = await email(
                params,
                data_store_asigned !== null?data_store_asigned.email:"jrodriguez@corpinto.com",
                params.length > 0? params[0].email:"jrodriguez@corpinto.com",
                'Nuevo Ticket De Traslado Sistema Informática',
                `<table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td align="center" class="section-img">
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://static.vecteezy.com/system/resources/previews/000/511/940/large_2x/currency-exchange-glyph-black-icon-vector.jpg" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            NUEVO TICKET TRASLADO EN SISTEMA
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
                                                        Se ha creado un ticket de traslado de mercaderia unicamente en el sistema de la tienda <b>${params[0].store_created}</b>, 
                                                        por favor dar seguimiento al ticket dentro de la plataforma.
                                                    </div>
                                                    <p>listado de articulos solicitados:</p>
                                                    <table class="table" style="text-align: center" width="90%">
                                                        <thead align="center">
                                                            <tr>
                                                                <th scope="col" width: 20px>UPC</th>
                                                                <th scope="col" width: 20px>ALU</th>
                                                                <th scope="col" width: 20px>TALLA</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody align="center">
                                                        ${params.map(x => {
                    return (
                        `<tr>
                                                                        <td>${x.upc}</td>
                                                                        <td>${x.alu}</td>
                                                                        <td>${x.size}</td>
                                                                    </tr>`
                    )
                })
                }
                                                        </tbody>
                                                    </table>
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
                </table>`
            );
            console.log(result_email);
            console.log("---------4------------");
            return res.status(200).send({ ticket: storedTicket, message: 'Ticket creado exitosamente!' });
        }
    });
}
//Crea los tickets de entragas inmediatas
async function storeTicketInmediates(req, res) {
    let Inmediates = new TicketInmediates();
    let params = JSON.parse(req.body.data);
    let file = req.file;
    let result = await cloudinary.uploader.upload(file.path);
    let address_send = `Nombre: ${params[0].client}, Dirreccion: ${params[0].address}, Celular 1: ${params[0].phone1}, Celular 2: ${params[0].phone2}, Horarios: ${params[0].hours}, Total a cobrar: ${params[0].total};`
    /*let fecha = Moment().utc(); await axios.get('https://us-central1-pruebas-241e9.cloudfunctions.net/app/get-date')
        .then(res => res.data)
        .catch(err => console.log(err)); */

    Inmediates.store_created = params[0].store_created;
    Inmediates.store_asigned = params[0].store_asigned;
    Inmediates.store_asigned = params[0].store_asigned;
    Inmediates.status = 'Pendiente';
    Inmediates.fact = params[0].bill;
    Inmediates.fact_img = result.public_id;
    Inmediates.desc = address_send;
    Inmediates.timestamp = Moment().utc();

    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            siz: data.size,
        }
        Inmediates.product.push(producto);
    })
    let data_store_asigned = await User.findOne({ store: params[0].store_asigned });

    var emailsDefault = [];
    let showUser = await Email_template.find({ template: 'Tickets Inmediatos', status: "Activo" });
    showUser.map((elementos) => {
        return emailsDefault.push(elementos.email)
    });

    if(emailsDefault.length < 0){
        emailsDefault.push("jrodriguez@corpinto.com");
    }

    Inmediates.save(async (err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if (storedTicket) {
            email(
                params,
                emailsDefault,
                //'dlara2017229@gmail.com',
                data_store_asigned.email,
                'Nuevo Ticket Entregas Inmediatas',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información De Envío Inmediato
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
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="http://bienestarspm.uach.cl/wp-content/uploads/2018/08/306470.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            NUEVO TICKET ENTREGAS INMEDIATAS
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
                                                        <b>
                                                            Se solicito un envió inmediato de mercadería por la tienda ${params[0].store_created}. El traslado saldrá de la tienda ${params[0].store_asigned}.<br>
                                                            detalles de traslado: ${address_send}</b><br>
                                                        </b>
                                                        <p>listado de articulos solicitados:</p>
                                                        <table class="table">
                                                            <thead>
                                                                <th scope="col" width: 20px>UPC</th>
                                                                <th scope="col" width: 20px>ALU</th>
                                                                <th scope="col" width: 20px>TALLA</th>
                                                            </thead>
                                                            <tbody>
                                                            ${params.map(x => {
                    return (
                        `<tr>
                                                                            <td>${x.upc}</td>
                                                                            <td>${x.alu}</td>
                                                                            <td>${x.size}</td>
                                                                        </tr>`
                    )
                })
                }
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
            return res.status(200).send({ message: 'Ticket creado exitosamente!', ticekt: storedTicket })
        }
    });
    console.log(Inmediates);
}
//Crea los tickets de retiros de fotografias
async function storeTicketPhotoRetreats(req, res) {
    let params = req.body;
    let Ticket = new TicketPhoto();

    //Se genera en el ticket de la tranferencia
    Ticket.status = 'Pendiente';
    Ticket.store_created = params[0].store_created;
    Ticket.store_asigned = "Pruebas Sistemas";
    Ticket.caurier = params[0].caurier;
    Ticket.timestamp = Moment().utc();

    //insertamos los productos que se transferiran con el ticket
    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            siz: data.size,
        }
        Ticket.product.push(producto);
    })
    let data_store_asigned = await User.findOne({ store: params[0].store_asigned });
    //Se guarda el ticket
    Ticket.save((err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if (storedTicket) {
            email(
                params,
                '',
                params.length > 0? params[0].email:"jrodriguez@corpinto.com",
                'Retiro de Mercaderia para fotografía',
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
                                    <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn.pixabay.com/photo/2016/10/08/18/34/camera-1724286_960_720.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                </td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                    <div style="line-height: 35px">
                                        NUEVO TICKET RETIRO FOTOGRAFÍA
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
                                                <b>Se entrego a André Cifuentes la siguente mercadería para toma de fotos, lo esta retirando ${params[0].caurier}
                                                </b>
                                                <br>
                                                </b>
                                                <p>listado de articulos solicitados:</p>
                                             <table class="table">
                                             <thead align="center">
                                             <tr>
                                                 <th scope="col" width: 20px>UPC</th>
                                                 <th scope="col" width: 20px>ALU</th>
                                                 <th scope="col" width: 20px>TALLA</th>
                                             </tr>
                                         </thead>
                                         <tbody align="center">
                                            ${params.map(x => {
                                                return (
                                                    `<tr>
                                                        <td>${x.upc}</td>
                                                        <td>${x.alu}</td>
                                                        <td>${x.size}</td>
                                                    </tr>`
                                                )
                                            })
                                            }
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
            return res.status(200).send({ ticket: storedTicket, message: 'Ticket creado exitosamente!' });
        }
    });
}
//Crea los tickets de retiros externos
async function storeTicketExternalRetreats(req, res) {
    let params = req.body;
    let Ticket = new TicketExternal();

    //Se genera en el ticket de la tranferencia
    Ticket.store_created = params[0].store_created;
    Ticket.name = params[0].person_retreats;
    Ticket.manager = params[0].person_authorizing;
    Ticket.inv_val = params[0].bill;
    Ticket.status = "Completado";
    Ticket.timestamp = Moment().utc();
    //insertamos los productos que se transferiran con el ticket
    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            siz: data.size,
        }
        Ticket.product.push(producto);
    })

    //Se guarda el ticket
    Ticket.save((err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if (storedTicket) {
            return res.status(200).send({ ticket: storedTicket, message: 'Ticket creado exitosamente!' });
        }
    });
}
//Obtiene todos los tikets de transferincia de sistema
async function getAllTicketsSystemTransfer(req, res) {
    let ticketSystem = await TicketSystem.find({
        status: req.body.status,
        $or: [
            { store_created: req.body.store },
            { store_asigned: req.body.store }
        ]
    }).sort({ timestamp: -1 });

    ticketSystem.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketSystem
    });
}
//Obtiene los tikets creados por el usuario que se trasladan a otra tienda
async function getSystemTransferCreate(req, res) {
    let ticketSystem = await TicketSystem.find({
        status: 'Pendiente',
        $or: [
            //{ store_created: 'Meatpack Web' },
            { store_created: req.body.store },
            //{ sbs: req.body.subs }
        ]
    }).sort({ timestamp: -1 });

    ticketSystem.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketSystem
    });
}
//Obtiene los tikets asignados a la tienda del usuario
async function getSystemTransferAssigned(req, res) {
    let ticketSystem = await TicketSystem.find({
        status: 'Pendiente',
        $or: [
            { store_asigned: req.body.store },
            //{ sbs: req.body.subs }
        ]
    }).sort({ timestamp: -1 });

    ticketSystem.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketSystem
    });
}
//Obtiene todos los tikets de transferincia de sistema
async function getAllTicketsInmediates(req, res) {
    console.log(req.body.status);
    let ticketInmediates = await TicketInmediates.find({
        status: req.body.status,
        $or: [
            { store_created: req.body.store },
            { store_asigned: req.body.store }
        ]
    }).sort({ timestamp: -1 });

    ticketInmediates.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketInmediates
    });
}
//Ontiene los tikets de entrgas inmediatas creados por una tienda
async function getTicketsInmediatesCreated(req, res) {
    let ticketInmediates = await TicketInmediates.find({
        status: 'Pendiente',
        $or: [
            { store_created: req.body.store },
        ]
    }).sort({ timestamp: -1 });

    ticketInmediates.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketInmediates
    });
}
//Ontiene los tikets de entrgas inmediatas asignamdos a una tienda
async function getTicketsInmediatesAssigned(req, res) {
    let ticketInmediates = await TicketInmediates.find({
        status: 'Pendiente',
        $or: [
            { store_asigned: req.body.store }
        ]
    }).sort({ timestamp: -1 });

    ticketInmediates.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketInmediates
    });
}
//Obtiene todos los tikets de retiros de fotografía
async function getAllPhotoRetreats(req, res) {
    let ticketPhotoRetrats = await TicketPhoto.find({
        status: req.body.status,
        $or: [
            { store_created: req.body.store },
            { store_asigned: req.body.store }
        ]
    }).sort({ timestamp: -1 });
    ticketPhotoRetrats.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketPhotoRetrats
    });
}
//Obtiene los tikets de retiros de fotografía pendientes
async function getPhotoRetreats(req, res) {
    let ticketPhotoRetrats = await TicketPhoto.find({
        status: 'Pendiente',
        $or: [
            { store_created: req.body.store },
        ]
    }).sort({ timestamp: -1 });

    ticketPhotoRetrats.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketPhotoRetrats
    });
}
//Obtiene los tikets de retiros externos pednientes
async function getAllExernalRetreats(req, res) {
    let ticketExternal = await TicketExternal.find({
        status: req.body.status,
        $or: [
            { store_created: req.body.store },
        ]
    }).sort({ timestamp: -1 });

    ticketExternal.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketExternal
    });
}
//Obtiene los tikets de retiros externos pednientes
async function getExernalRetreats(req, res) {
    let ticketExternal = await TicketExternal.find({
        store_created: req.body.store,
        status: "Completado"
    }).sort({ timestamp: -1 });
    //console.log(ticketExternal)
    ticketExternal.map((data, i) => {
        let array__ = []
        var iteracion = ""
        for (var j = 0; j <= 3; j++) {
            if (j == 0 || j == 2 || j == 3) {
                if (j == 0) {
                    iteracion = ""
                } else {
                    iteracion = j
                }
                let upc = `upc` + iteracion
                let alu = `alu` + iteracion
                let siz = `siz` + iteracion
                if (data.product.length == 0) {
                    if (data[`${upc}`] != undefined && data[`${alu}`] != undefined && data[`${siz}`] != undefined) {
                        array__.push({ upc: data[`${upc}`], alu: data[`${alu}`], siz: data[`${siz}`] });
                    }
                }
            }
        }
        array__.map(d => {
            let producto = {
                upc: d.upc,
                alu: d.alu,
                siz: d.siz,
            }
            data.product.push(producto)
        })
    })

    return res.status(200).json({
        ticketExternal
    });
}
//Inactiva los tikets de traslados de sistema
async function inactivateTicket(req, res) {
    let ticket_id = req.params.id;
    
    TicketSystem.findByIdAndUpdate(ticket_id, { status: 'Cancelado' }, async (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });

        let data_store_asigned = await User.findOne({ store: inactive.store_asigned });

        if (inactive) {
            let params = [inactive]
            await email(
                params,
                data_store_asigned.email?data_store_asigned.email:"jrodriguez@corpinto.com",
                req.body.email,
                'Ticket Traslado De Sistema Cancelado',
                `<table style="display:none!important;">
                <tr>
                    <td>
                        <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                            Información de Ticket de la plataforma
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
                                    <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-512.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                </td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                    <div style="line-height: 35px">
                                        TICKET TRASLADO DE SISTEMA CANCELADO
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
                                                La tienda <b>${inactive.store_asigned}</b> ha cancelado el ticket de petición de traslado en sistema 
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
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Inactiva los tikets de entrega inmediata
async function inactivateTicketInmediate(req, res) {
    let ticket_id = req.params.id;

    TicketInmediates.findByIdAndUpdate(ticket_id, { status: 'Cancelado' }, async (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });
        if (inactive) {
            let params = [inactive]
            let data_store_asigned = await User.findOne({ store: inactive.store_asigned });
            email(
                params,
                data_store_asigned.email?data_store_asigned.email:"jrodriguez@corpinto.com",
                req.body.email,
                'Ticket Envio Inmediato Cancelado',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información de Ticket de la plataforma
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
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-512.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            TICKET ENVIO INMEDIATO CANCELADO
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
                                                    La tienda <b>${inactive.store_asigned}</b> ha cancelado el ticket de traslado inmediato que solicito.Por favor notificar al mensajero
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
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Inactiva los tikets de fotos retiradas
async function inactivatePhotoRetreats(req, res) {
    let ticket_id = req.params.id;

    TicketPhoto.findByIdAndUpdate(ticket_id, { status: 'Cancelado' }, async (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });
        if (inactive) {
            let data_store_asigned = await User.findOne({ store: inactive.store_asigned });
            email(
                [inactive],
                data_store_asigned.email?data_store_asigned.email:"jrodriguez@corpinto.com",
                req.body.email,
                'Cancelar Retiro Fotografía',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información de Ticket de la plataforma
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
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-512.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            TICKET PARA FOTOS CANCELADO
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
                                                    La tienda <b>${inactive.store_asigned}</b> ha cancelado el ticket de petición de Retiro de mercadería para fotos
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
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Inactiva los tikets de retiros externos
async function inactivateExternalRetreats(req, res) {
    let ticket_id = req.params.id;

    TicketExternal.findByIdAndUpdate(ticket_id, { status: 'Cancelado' }, (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });
        if (inactive) {
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Pasar estado de ticket de pendiente a completado
async function completeTicket(req, res) {
    let ticket_id = req.params.id;
    let retailn = req.body.retailn.retailn;

    TicketSystem.findByIdAndUpdate(ticket_id, { status: 'Completado', retailn: retailn }, async (err, complete) => {
        if (err) return res.status(500).send({ message: "Error al completar ticket" });
        if (complete) {
            let params = [complete];
            let data_store_asigned = await User.findOne({ store: complete.store_asigned });
            await email(
                params,
                data_store_asigned.email?data_store_asigned.email:"jrodriguez@corpinto.com",
                req.body.email,
                'Ticket De Traslado sistema Completado',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información de Ticket de la plataforma
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
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://static.vecteezy.com/system/resources/previews/000/511/940/large_2x/currency-exchange-glyph-black-icon-vector.jpg" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            TICKET TRASLADO DE SISTEMA COMPLETADO
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
                                                        El traslado que solicitaste a la tienda <b>${complete.store_asigned}</b> por el sistema ya fue realizado verificarlo por favor.
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
            return res.status(200).send({ message: 'El ticket se a completado!', ticekt: complete })
        }
    })
}
//Pasar estado de ticket de pendiente a completado
async function completeTicketInmediate(req, res) {
    let ticket_id = req.params.id;

    TicketInmediates.findByIdAndUpdate(ticket_id, { status: 'Completado' }, async (err, complete) => {
        if (err) return res.status(500).send({ message: "Error al completar ticket" });
        if (complete) {
            let params = [complete]
            return res.status(200).send({ message: 'El ticket se a completado!', ticekt: complete })
        }
    })
}
//Pasar estado de ticket de pendiente a completado
function completePhotoRetreats(req, res) {
    let ticket_id = req.params.id;

    TicketPhoto.findByIdAndUpdate(ticket_id, { status: 'Completado' }, (err, complete) => {
        if (err) return res.status(500).send({ message: "Error al completar ticket" });
        return res.status(200).send({ message: 'El ticket se a completado!', ticekt: complete })
    })
}
//Obetener todas las tiendas
async function getStore(req, res) {
    let result = await Store.find();
    return res.json({ result })
}
//Obetener todas las tiendas Activas
async function getStoreActive(req, res) {
    await Store.find({ status: 'Activo' }, (err, result) => {
        if (err) { console.log(err); return 'error' }
        return res.json({ result })
    });
}
//Obetener todas las tiendas Activas
async function getOneStoreActive(req, res) {
    console.log(req.body)
    await Store.find({ status: 'Activo', name: req.body.store }, (err, result) => {
        if (err) { console.log(err); return 'error' }
        return res.json({ result })
    });
}
//Crea un codigo random para los tickets
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
    console.log("---------+1------------");
    let randsend = randomNumber();
    let Moment = require("moment-timezone");
    let hoy = new Date(Moment().tz("America/Guatemala").format());
    //console.log(hoy.format());
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1;
    let yyyy = hoy.getFullYear(); 
    console.log(dd, mm, yyyy);
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();
    console.log("---------+2------------");
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
    console.log("---------+3------------");
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'noreply@corpinto.com', // sender address
        to: reseptor, // list of receivers
        cc: emisor,
        //bcc: 'dlara2017229@gmail.com',
        subject:
            `${titulo} ${data[0].store_created} ${dd}/${mm}/${yyyy} - Ticket ${randsend}`,
        text: "", // plain text body
        html: template, // html body
    }, async function (err, json) {
        console.log("---------+4------------");
        if (err) console.log(`ERROR EN EL ENVÍO: ${err}`);
        if (json) console.log(`CORREO SE ENVIADO EXITOSAMENTE: ${json}`);
    });
}

async function getDataReport(req,res) {
    let query = null,
    traslado_sistema = null,
    entrega_inmediata = null,
    retiro_externo = null,
    tickets_fotografia = null;

    if(req.body.role == "admin"){
        if(req.params.date_start !== req.params.date_end){
            if(req.body.store && req.body.store != "Todas"){
                query = {
                    timestamp:{
                        $gt: Moment(new Date(`${req.params.date_start} 06:00:00`)).format("YYYY-MM-DD HH:MM:ss"),
                        $lt: Moment(new Date(`${req.params.date_end} 06:59:59`)).format("YYYY-MM-DD HH:MM:ss")
                    },
                    store_created: req.body.store
                }
            }else{
                query = {
                    timestamp:{
                        $gt: Moment(new Date(`${req.params.date_start} 06:00:00`)).format("YYYY-MM-DDTHH:MM:ss"),
                        $lt: Moment(new Date(`${req.params.date_end} 06:59:59`)).format("YYYY-MM-DDTHH:MM:ss")
                    }
                }
            }
        }else{
            if(req.body.store && req.body.store !== "Todas"){
                query = {
                    timestamp:{
                        $gte: Moment(new Date(`${req.params.date_start} 06:00:00`)).format("YYYY-MM-DD HH:MM:ss"),
                        $lt: Moment(new Date(`${req.params.date_end} 06:59:59`)).format("YYYY-MM-DD HH:MM:ss")
                    },
                    store_created: req.body.store
                }
            }else{
                query = {
                    timestamp: {
                        $gte: Moment(new Date(`${req.params.date_start} 06:00:00`)).format("YYYY-MM-DD HH:MM:ss"),
                        $lt: Moment(new Date(`${req.params.date_end} 06:59:59`)).format("YYYY-MM-DD HH:MM:ss")
                     },
                }
            }
        }
    }else{
        if(req.params.date_start !== req.params.date_end){
            query = {
                timestamp:{
                    $gt: Moment(new Date(`${req.params.date_start} 06:00:00`)).format("YYYY-MM-DD HH:MM:ss"),
                    $lt: Moment(new Date(`${req.params.date_end} 06:59:59`)).format("YYYY-MM-DD HH:MM:ss")
                },
                store_created: req.body.store
            }
        }else{
            query = {
                timestamp:{
                    $gte: Moment(new Date(`${req.params.date_start} 06:00:00`)).format("YYYY-MM-DD HH:MM:ss"),
                    $lt: Moment(new Date(`${req.params.date_end} 06:59:59`)).format("YYYY-MM-DD HH:MM:ss")
                },
                store_created: req.body.store
            }
        }
    }

    switch (req.body.type) {
        case 'traslado_sistema':
            traslado_sistema = await TicketSystem.find(query);
            break;
        case 'entregas_inmediatas':
            entrega_inmediata = await TicketInmediates.find(query);
            break;
        case 'retiros_externos':
            retiro_externo = await TicketExternal.find(query);
            break;
        case 'tickets_fotografia':
            tickets_fotografia = await TicketPhoto.find(query);
            break;
        default:
            traslado_sistema = await TicketSystem.find(query);
            entrega_inmediata = await TicketInmediates.find(query);
            retiro_externo = await TicketExternal.find(query);
            tickets_fotografia = await TicketPhoto.find(query);
            break;
        }

        let ticketSistemaFinal = [];
        let ticketsInmediateFinal = [];
        let ticketExternoFinal = [];
        let ticketFotoFinal = [];

        traslado_sistema != null ? traslado_sistema.map(item => ticketSistemaFinal.push({...item._doc, timestamp:momentTimeZone(item._doc.timestamp).tz("America/Guatemala").format("DD-MM-YYYY HH:MM:ss")})):null;
        entrega_inmediata != null ? entrega_inmediata.map(item => ticketsInmediateFinal.push({...item._doc, timestamp:momentTimeZone(item._doc.timestamp).tz("America/Guatemala").format("DD-MM-YYYY HH:MM:ss")})):null;
        retiro_externo != null ? retiro_externo.map(item => ticketExternoFinal.push({...item._doc, timestamp:momentTimeZone(item._doc.timestamp).tz("America/Guatemala").format("DD-MM-YYYY HH:MM:ss")})):null;
        tickets_fotografia != null ? tickets_fotografia.map(item => ticketFotoFinal.push({...item._doc, timestamp:momentTimeZone(item._doc.timestamp).tz("America/Guatemala").format("DD-MM-YYYY HH:MM:ss")})):null;
        
        console.log("QUERY", query);

    return res.status(200).json({ data: {
        traslado_sistema: traslado_sistema != null ? ticketSistemaFinal:null,
        entrega_inmediata: entrega_inmediata != null ? ticketsInmediateFinal:null,
        retiro_externo: retiro_externo != null ? ticketExternoFinal: null,
        tickets_fotografia: tickets_fotografia != null ? ticketFotoFinal: null,
        type: req.body.type
    } })
}

async function getTicketsInmediate(req, res) {
    const dataStore = [];
    let result = await TicketInmediates.find({}, {
        upc: 1,
        alu: 1,
        siz: 1,

        upc1: 1,
        alu1: 1,
        siz1: 1,

        upc2: 1,
        alu2: 1,
        siz2: 1,

        upc3: 1,
        alu3: 1,
        siz3: 1,

        upc4: 1,
        alu4: 1,
        siz4: 1,

        upc5: 1,
        alu5: 1,
        siz5: 1,

        upc6: 1,
        alu6: 1,
        siz6: 1,

        upc7: 1,
        alu7: 1,
        siz7: 1,

        upc8: 1,
        alu8: 1,
        siz8: 1,

        upc9: 1,
        alu9: 1,
        siz9: 1,

        upc10: 1,
        alu10: 1,
        siz10: 1,

        upc11: 1,
        alu11: 1,
        siz11: 1,

        upc12: 1,
        alu12: 1,
        siz12: 1,

        upc13: 1,
        alu13: 1,
        siz13: 1,

        upc14: 1,
        alu14: 1,
        siz14: 1,

        upc15: 1,
        alu15: 1,
        siz15: 1,

        upc16: 1,
        alu16: 1,
        siz16: 1,

        upc17: 1,
        alu17: 1,
        siz17: 1,

        upc18: 1,
        alu18: 1,
        siz18: 1,

        upc19: 1,
        alu19: 1,
        siz19: 1,

        upc20: 1,
        alu20: 1,
        siz20: 1,

        upc21: 1,
        alu21: 1,
        siz21: 1,

        upc22: 1,
        alu22: 1,
        siz22: 1,

        upc23: 1,
        alu23: 1,
        siz23: 1,

        upc24: 1,
        alu24: 1,
        siz24: 1,

        upc25: 1,
        alu25: 1,
        siz25: 1,

        upc26: 1,
        alu26: 1,
        siz26: 1,

        upc27: 1,
        alu27: 1,
        siz27: 1,

        upc28: 1,
        alu28: 1,
        siz28: 1,

        upc29: 1,
        alu29: 1,
        siz29: 1,

        upc30: 1,
        alu30: 1,
        siz30: 1,

        upc31: 1,
        alu31: 1,
        siz31: 1,

        upc32: 1,
        alu32: 1,
        siz32: 1,

        upc33: 1,
        alu33: 1,
        siz33: 1,

        upc34: 1,
        alu34: 1,
        siz34: 1,

        upc35: 1,
        alu35: 1,
        siz35: 1,

        upc36: 1,
        alu36: 1,
        siz36: 1,

        upc37: 1,
        alu37: 1,
        siz37: 1,

        upc38: 1,
        alu38: 1,
        siz38: 1,

        upc39: 1,
        alu39: 1,
        siz39: 1,

        upc40: 1,
        alu40: 1,
        siz40: 1,

        upc41: 1,
        alu41: 1,
        siz41: 1,

        upc42: 1,
        alu42: 1,
        siz42: 1,

        upc43: 1,
        alu43: 1,
        siz43: 1,

        upc44: 1,
        alu44: 1,
        siz44: 1,

        upc45: 1,
        alu45: 1,
        siz45: 1,

        upc46: 1,
        alu46: 1,
        siz46: 1,

        upc47: 1,
        alu47: 1,
        siz47: 1,

        upc48: 1,
        alu48: 1,
        siz48: 1,

        upc49: 1,
        alu49: 1,
        siz49: 1,

        upc50: 1,
        alu50: 1,
        siz50: 1,
        fact: 1,
        fact_img: 1,
        desc: 1,
        store_asigned: 1,
        status: 1,
        store_created: 1,
        email_asigned: 1,
        timestamp: 1,
        timestampend: 1
    }).sort({ timestamp: -1 });

    result.map((res) => {
        let fecha = Moment(res.timestamp).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tiendaCreacion": res.store_created,
            "tiendaAsignacion": res.store_asigned,
            "estado": res.status,
            "destino": res.desc,
            "upc": res.upc,
            "alu": res.alu,
            "siz": res.siz,

            "upc1": res.upc1,
            "alu1": res.alu1,
            "siz1": res.siz1,

            "upc2": res.upc2,
            "alu2": res.alu2,
            "siz2": res.siz2,

            "upc3": res.upc3,
            "alu3": res.alu3,
            "siz3": res.siz3,

            "upc4": res.upc4,
            "alu4": res.alu4,
            "siz4": res.siz4,

            "upc4": res.upc4,
            "alu4": res.alu4,
            "siz4": res.siz4,

            "upc4": res.upc4,
            "alu4": res.alu4,
            "siz4": res.siz4,

            "upc5": res.upc5,
            "alu5": res.alu5,
            "siz5": res.siz5,

            "upc6": res.upc6,
            "alu6": res.alu6,
            "siz6": res.siz6,

            "upc7": res.upc7,
            "alu7": res.alu7,
            "siz7": res.siz7,

            "upc8": res.upc8,
            "alu8": res.alu8,
            "siz8": res.siz8,

            "upc9": res.upc9,
            "alu9": res.alu9,
            "siz9": res.siz9,

            "upc10": res.upc10,
            "alu10": res.alu10,
            "siz10": res.siz10,

        })
    })

    return res.json({ dataStore })
}

async function getTicketsInmediateSendFirebase(req, res) {
    const dataStore = [];
    let result = await TicketInmediates.find({
        //timestamp : {"$gte": new Date("2021-01-01T00:00:00.000Z")}
    }, {
        product: 1,
        upc: 1,
        alu: 1,
        siz: 1,

        upc1: 1,
        alu1: 1,
        siz1: 1,

        upc2: 1,
        alu2: 1,
        siz2: 1,

        upc3: 1,
        alu3: 1,
        siz3: 1,

        upc4: 1,
        alu4: 1,
        siz4: 1,

        upc5: 1,
        alu5: 1,
        siz5: 1,

        upc6: 1,
        alu6: 1,
        siz6: 1,

        upc7: 1,
        alu7: 1,
        siz7: 1,

        upc8: 1,
        alu8: 1,
        siz8: 1,

        upc9: 1,
        alu9: 1,
        siz9: 1,

        upc10: 1,
        alu10: 1,
        siz10: 1,

        upc11: 1,
        alu11: 1,
        siz11: 1,

        upc12: 1,
        alu12: 1,
        siz12: 1,

        upc13: 1,
        alu13: 1,
        siz13: 1,

        upc14: 1,
        alu14: 1,
        siz14: 1,

        upc15: 1,
        alu15: 1,
        siz15: 1,

        upc16: 1,
        alu16: 1,
        siz16: 1,

        upc17: 1,
        alu17: 1,
        siz17: 1,

        upc18: 1,
        alu18: 1,
        siz18: 1,

        upc19: 1,
        alu19: 1,
        siz19: 1,

        upc20: 1,
        alu20: 1,
        siz20: 1,

        upc21: 1,
        alu21: 1,
        siz21: 1,

        upc22: 1,
        alu22: 1,
        siz22: 1,

        upc23: 1,
        alu23: 1,
        siz23: 1,

        upc24: 1,
        alu24: 1,
        siz24: 1,

        upc25: 1,
        alu25: 1,
        siz25: 1,

        upc26: 1,
        alu26: 1,
        siz26: 1,

        upc27: 1,
        alu27: 1,
        siz27: 1,

        upc28: 1,
        alu28: 1,
        siz28: 1,

        upc29: 1,
        alu29: 1,
        siz29: 1,

        upc30: 1,
        alu30: 1,
        siz30: 1,

        upc31: 1,
        alu31: 1,
        siz31: 1,

        upc32: 1,
        alu32: 1,
        siz32: 1,

        upc33: 1,
        alu33: 1,
        siz33: 1,

        upc34: 1,
        alu34: 1,
        siz34: 1,

        upc35: 1,
        alu35: 1,
        siz35: 1,

        upc36: 1,
        alu36: 1,
        siz36: 1,

        upc37: 1,
        alu37: 1,
        siz37: 1,

        upc38: 1,
        alu38: 1,
        siz38: 1,

        upc39: 1,
        alu39: 1,
        siz39: 1,

        upc40: 1,
        alu40: 1,
        siz40: 1,

        upc41: 1,
        alu41: 1,
        siz41: 1,

        upc42: 1,
        alu42: 1,
        siz42: 1,

        upc43: 1,
        alu43: 1,
        siz43: 1,

        upc44: 1,
        alu44: 1,
        siz44: 1,

        upc45: 1,
        alu45: 1,
        siz45: 1,

        upc46: 1,
        alu46: 1,
        siz46: 1,

        upc47: 1,
        alu47: 1,
        siz47: 1,

        upc48: 1,
        alu48: 1,
        siz48: 1,

        upc49: 1,
        alu49: 1,
        siz49: 1,

        upc50: 1,
        alu50: 1,
        siz50: 1,
        fact: 1,
        fact_img: 1,
        desc: 1,
        store_asigned: 1,
        status: 1,
        store_created: 1,
        email_asigned: 1,
        timestamp: 1,
        timestampend: 1
    }).sort({ timestamp: -1 });

    result.map((res, numInt) => {
        let fecha = Moment(res.timestamp).format('YYYY-MM-DDT08:00:00.80Z')
        if (res.product && res.product.length > 0) {
            var listProduct = "";
            res.product.map((data, i) => {
                listProduct += `*Alu:${data.alu} UPC:${data.upc} Talla:${data.siz}/`;
            })
            dataStore.push({
                "id": numInt,
                "fechaCreacion": fecha,
                "Dia": Moment(fecha).format('DD'),
                "Mes": Moment(fecha).format('MM'),
                "Año": Moment(fecha).format('YYYY'),
                "tiendaCreacion": res.store_created ? res.store_created : null,
                "tiendaAsignacion": res.store_asigned ? res.store_asigned : null,
                "estado": res.status ? res.status : null,
                "destino": res.desc ? res.desc : null,
                "product": listProduct
            });

        } else {
            let listProduct = "";
            if (res.upc && res.alu && res.siz) {
                listProduct += `*Alu:${res.alu} UPC:${res.upc} Talla:${res.siz}/`;
            }
            if (res.upc1 && res.alu1 && res.siz1) {
                listProduct += `*Alu:${res.alu1} UPC:${res.upc1} Talla:${res.siz1}/`;
            }
            if (res.upc2 && res.alu2 && res.siz2) {
                listProduct += `*Alu:${res.alu2} UPC:${res.upc2} Talla:${res.siz2}/`;
            }
            if (res.upc3 && res.alu3 && res.siz3) {
                listProduct += `*Alu:${res.alu3} UPC:${res.upc3} Talla:${res.siz3}/`;
            }
            if (res.upc4 && res.alu4 && res.siz4) {
                listProduct += `*Alu:${res.alu4} UPC:${res.upc4} Talla:${res.siz4}/`;
            }
            if (res.upc5 && res.alu5 && res.siz5) {
                listProduct += `*Alu:${res.alu5} UPC:${res.upc5} Talla:${res.siz5}/`;
            }
            if (res.upc6 && res.alu6 && res.siz6) {
                listProduct += `*Alu:${res.alu6} UPC:${res.upc6} Talla:${res.siz6}/`;
            }
            if (res.upc7 && res.alu7 && res.siz7) {
                listProduct += `*Alu:${res.alu7} UPC:${res.upc7} Talla:${res.siz7}/`;
            }
            if (res.upc8 && res.alu8 && res.siz8) {
                listProduct += `*Alu:${res.alu8} UPC:${res.upc8} Talla:${res.siz8}/`;
            }
            if (res.upc9 && res.alu9 && res.siz9) {
                listProduct += `*Alu:${res.alu9} UPC:${res.upc9} Talla:${res.siz9}/`;
            }
            if (res.upc10 && res.alu10 && res.siz10) {
                listProduct += `*Alu:${res.alu10} UPC:${res.upc10} Talla:${res.siz10}/`;
            }
            dataStore.push({
                "id": numInt,
                "fechaCreacion": fecha,
                "Dia": Moment(fecha).format('DD'),
                "Mes": Moment(fecha).format('MM'),
                "Año": Moment(fecha).format('YYYY'),
                "tiendaCreacion": res.store_created ? res.store_created : null,
                "tiendaAsignacion": res.store_asigned ? res.store_asigned : null,
                "estado": res.status ? res.status : null,
                "destino": res.desc ? res.desc : null,
                "product": listProduct,
            })
        }
    })

    // dataStore.map(async (doc) => {
    //     try {
    //         await firestore.collection('TicketsInmediate').add(doc);
    //         console.log('Insert new document in TicketsInmediates');
    //     } catch (error) {
    //         console.log(error)
    //     }
    // });


    return res.json({ dataStore })
}

async function getTicketsInmediate2(req, res) {
    const dataStore = [];
    let result = await TicketInmediates.find({
        timestamp: { "$gte": new Date("2021-01-01T00:00:00.000Z") }
    }, {
        product: 1,
        upc: 1,
        alu: 1,
        siz: 1,

        upc1: 1,
        alu1: 1,
        siz1: 1,

        upc2: 1,
        alu2: 1,
        siz2: 1,

        upc3: 1,
        alu3: 1,
        siz3: 1,

        upc4: 1,
        alu4: 1,
        siz4: 1,

        upc5: 1,
        alu5: 1,
        siz5: 1,

        upc6: 1,
        alu6: 1,
        siz6: 1,

        upc7: 1,
        alu7: 1,
        siz7: 1,

        upc8: 1,
        alu8: 1,
        siz8: 1,

        upc9: 1,
        alu9: 1,
        siz9: 1,

        upc10: 1,
        alu10: 1,
        siz10: 1,

        upc11: 1,
        alu11: 1,
        siz11: 1,

        upc12: 1,
        alu12: 1,
        siz12: 1,

        upc13: 1,
        alu13: 1,
        siz13: 1,

        upc14: 1,
        alu14: 1,
        siz14: 1,

        upc15: 1,
        alu15: 1,
        siz15: 1,

        upc16: 1,
        alu16: 1,
        siz16: 1,

        upc17: 1,
        alu17: 1,
        siz17: 1,

        upc18: 1,
        alu18: 1,
        siz18: 1,

        upc19: 1,
        alu19: 1,
        siz19: 1,

        upc20: 1,
        alu20: 1,
        siz20: 1,

        upc21: 1,
        alu21: 1,
        siz21: 1,

        upc22: 1,
        alu22: 1,
        siz22: 1,

        upc23: 1,
        alu23: 1,
        siz23: 1,

        upc24: 1,
        alu24: 1,
        siz24: 1,

        upc25: 1,
        alu25: 1,
        siz25: 1,

        upc26: 1,
        alu26: 1,
        siz26: 1,

        upc27: 1,
        alu27: 1,
        siz27: 1,

        upc28: 1,
        alu28: 1,
        siz28: 1,

        upc29: 1,
        alu29: 1,
        siz29: 1,

        upc30: 1,
        alu30: 1,
        siz30: 1,

        upc31: 1,
        alu31: 1,
        siz31: 1,

        upc32: 1,
        alu32: 1,
        siz32: 1,

        upc33: 1,
        alu33: 1,
        siz33: 1,

        upc34: 1,
        alu34: 1,
        siz34: 1,

        upc35: 1,
        alu35: 1,
        siz35: 1,

        upc36: 1,
        alu36: 1,
        siz36: 1,

        upc37: 1,
        alu37: 1,
        siz37: 1,

        upc38: 1,
        alu38: 1,
        siz38: 1,

        upc39: 1,
        alu39: 1,
        siz39: 1,

        upc40: 1,
        alu40: 1,
        siz40: 1,

        upc41: 1,
        alu41: 1,
        siz41: 1,

        upc42: 1,
        alu42: 1,
        siz42: 1,

        upc43: 1,
        alu43: 1,
        siz43: 1,

        upc44: 1,
        alu44: 1,
        siz44: 1,

        upc45: 1,
        alu45: 1,
        siz45: 1,

        upc46: 1,
        alu46: 1,
        siz46: 1,

        upc47: 1,
        alu47: 1,
        siz47: 1,

        upc48: 1,
        alu48: 1,
        siz48: 1,

        upc49: 1,
        alu49: 1,
        siz49: 1,

        upc50: 1,
        alu50: 1,
        siz50: 1,
        fact: 1,
        fact_img: 1,
        desc: 1,
        store_asigned: 1,
        status: 1,
        store_created: 1,
        email_asigned: 1,
        timestamp: 1,
        timestampend: 1
    }).sort({ timestamp: -1 });

    // let result2 = await firestore.collection('TicketsInmediate').get();

    // result2.docs.map(x => console.log(x.data()))

    result.map((res, numInt) => {
        let fecha = Moment(res.timestamp).format('YYYY-MM-DDT08:00:00.80Z')
        if (res.product && res.product.length > 0) {
            var listProduct = "";
            res.product.map((data, i) => {
                if (data.alu == "VN0A3WLNQTF") console.log(res)
                listProduct += `Alu:${data.alu} UPC:${data.upc} Talla:${data.siz}`;
            })
            let destino = res.desc.replace(",", " ").replace(",", " ").replace(",", " ").replace(",", " ").replace(",", " ");
            dataStore.push({
                "id": numInt,
                "fechaCreacion": fecha,
                "Dia": Moment(fecha).format('MM'),
                "Mes": Moment(fecha).format('DD'),
                "Año": Moment(fecha).format('YYYY'),
                "tiendaCreacion": res.store_created ? res.store_created : null,
                "tiendaAsignacion": res.store_asigned ? res.store_asigned : null,
                "estado": res.status ? res.status : null,
                "destino": res.desc ? destino : null,
                "product": listProduct,
                "factura": res.fact ? res.fact : 0
            });

        } else {
            let listProduct = "";
            let destino = res.desc.replace(",", " ").replace(",", " ").replace(",", " ").replace(",", " ").replace(",", " ");
            if (res.upc && res.alu && res.siz) {
                listProduct += `Alu:${res.alu} UPC:${res.upc} Talla:${res.siz}`;
            }
            if (res.upc1 && res.alu1 && res.siz1) {
                listProduct += `Alu:${res.alu1} UPC:${res.upc1} Talla:${res.siz1}`;
            }
            if (res.upc2 && res.alu2 && res.siz2) {
                listProduct += `Alu:${res.alu2} UPC:${res.upc2} Talla:${res.siz2}`;
            }
            if (res.upc3 && res.alu3 && res.siz3) {
                listProduct += `Alu:${res.alu3} UPC:${res.upc3} Talla:${res.siz3}`;
            }
            if (res.upc4 && res.alu4 && res.siz4) {
                listProduct += `Alu:${res.alu4} UPC:${res.upc4} Talla:${res.siz4}`;
            }
            if (res.upc5 && res.alu5 && res.siz5) {
                listProduct += `Alu:${res.alu5} UPC:${res.upc5} Talla:${res.siz5}`;
            }
            if (res.upc6 && res.alu6 && res.siz6) {
                listProduct += `Alu:${res.alu6} UPC:${res.upc6} Talla:${res.siz6}`;
            }
            if (res.upc7 && res.alu7 && res.siz7) {
                listProduct += `Alu:${res.alu7} UPC:${res.upc7} Talla:${res.siz7}`;
            }
            if (res.upc8 && res.alu8 && res.siz8) {
                listProduct += `Alu:${res.alu8} UPC:${res.upc8} Talla:${res.siz8}`;
            }
            if (res.upc9 && res.alu9 && res.siz9) {
                listProduct += `Alu:${res.alu9} UPC:${res.upc9} Talla:${res.siz9}`;
            }
            if (res.upc10 && res.alu10 && res.siz10) {
                listProduct += `Alu:${res.alu10} UPC:${res.upc10} Talla:${res.siz10}`;
            }
            dataStore.push({
                "id": numInt,
                "fechaCreacion": fecha,
                "Dia": Moment(fecha).format('DD'),
                "Mes": Moment(fecha).format('MM'),
                "Año": Moment(fecha).format('YYYY'),
                "tiendaCreacion": res.store_created ? res.store_created : null,
                "tiendaAsignacion": res.store_asigned ? res.store_asigned : null,
                "estado": res.status ? res.status : null,
                "destino": res.desc ? destino : null,
                "product": listProduct,
                "factura": res.fact ? res.fact : 0
            })
        }
    })

    return res.json({ dataStore })
}


module.exports = {
    storeTicketSystemTransfer,
    storeTicketInmediates,
    getTicketsInmediate,
    getTicketsInmediate2,
    getTicketsInmediateSendFirebase,
    storeTicketPhotoRetreats,
    storeTicketExternalRetreats,
    getAllTicketsSystemTransfer,
    getSystemTransferCreate,
    getSystemTransferAssigned,
    getAllTicketsInmediates,
    getTicketsInmediatesAssigned,
    getTicketsInmediatesCreated,
    getAllPhotoRetreats,
    getPhotoRetreats,
    getAllExernalRetreats,
    getExernalRetreats,
    inactivateTicket,
    inactivateTicketInmediate,
    inactivatePhotoRetreats,
    inactivateExternalRetreats,
    completeTicket,
    completeTicketInmediate,
    completePhotoRetreats,
    getStore,
    getStoreActive,
    getOneStoreActive,
    getDataReport
}
