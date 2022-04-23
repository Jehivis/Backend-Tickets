'use strict'
const nodemailer = require('nodemailer');
const BinnacleSaleByte = require('../models/BinnacleSaleByte');
const BinnacleSaleByteBefore = require('../models/BinnacleSaleByteBefore');
const BinnacleDailies = require('../models/Binnacle_daily');
var currencyFormatter = require('currency-formatter');
const Email_template = require('../models/Email_template');
const { auth, db, firestore } = require('../firebase');
let Moment = require("moment-timezone");
let momentToday = require("moment");
let hoy = Moment().tz("America/Guatemala")._d;
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1;
let yyyy = hoy.getFullYear();
//Obtiene los colaboradores

async function getBinnacleSale(req, res) {
    console.log("Reporte");
    const dataStore = [];
    var salesNew
    if (req.body.type === 'admin') {
        salesNew = await BinnacleSaleByte.find({
            date_created: req.body.dateStart
        }, { _id: 1, date_created: 1, store_creat: 1, sale_daily: 1, manager: 1, year_before_sale: 1, daily_goal: 1, fact: 1 });
    } else {
        salesNew = await BinnacleSaleByte.find({
            date_created: req.body.dateStart,
            store_creat: req.body.store
        }, { _id: 1, date_created: 1, store_creat: 1, sale_daily: 1, manager: 1, year_before_sale: 1, daily_goal: 1, fact: 1 });
    }


    salesNew.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "id": res._id,
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diff,
            "date": res.date_created
        })
    })
    dataStore.reverse()
    return res.json({ dataStore });
}

//Obtiene los datos de venta por el id
async function getBinnacleSaleById(req, res) {

    const salesNew = await BinnacleSaleByte.find({
        _id: req.body._id
    });

    return res.json({ salesNew });
}
//Obtiene los colaboradores date_created: { $regex: dateSales },
async function getBinnacleSaleReport(req, res) {
    const dataStore = [];
    let salesNew = await BinnacleSaleByte.find({
        date_created: { $regex: "2020-08" },
    });

    let salesBefore_2020 = await BinnacleSaleByteBefore.find({
        date_created: { $gte: "2020-01-01T19:02:12.501+00:00", $lt: "2020-08-18T19:02:12.501+00:00" },
    });

    salesNew.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "total_personas": res.people_totals,
            "total_vendores": res.sales_totals,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diff,

            "factura_sistema_de": res.fac_sis_from,
            "factura_sistema_hasta": res.fac_sis_to,
            "total_sistema": res.total_sis,

            "factura_manual_de": res.fac_man_from,
            "factura_manual_hasta": res.fac_man_to,
            "total_manual": res.total_man,

            "nota_credito_de": res.fact_nt_c_f,
            "nota_credito_hasta": res.fact_nt_c_to,
            "nota_credito_total": res.fact_nt_c,

            "total_online": res.total_on,

            "efectivo_quetzales": res.cash_quetzales,
            "efectivo_dolares": res.cash_dolares,

            "credomatic": res.credomatic,
            "visa": res.visa,
            "visa_dolares": res.visaDolares,
            "masterCard": res.masterCard,
            "crediCuotas": res.credicuotas,
            "visaCuotas": res.visaCuotas,

            "factura_send_contra_entrega_desde": res.fact_send_CE_from,
            "factura_send_contra_entrega_hasta": res.fact_send_CE_to,
            "factura_send_contra_entrega_total": res.fact_send_CEV,

            "nota_de_credito": res.note_credit,
            "ticket_quetzales": res.ticket_quetzales,
            "missing": res.missing,
            "cuadre_de_caja": res.box_square,
            "Numero_de_envio_en_efectivo": res.numb_send_cash_value,
            "Numero_Life_Miles": res.lifeMilesNum,
            "Numero_Life_Miles_Valor": res.lifeMilesVa,
            "Execto_iva": res.extIva,
            "Loyalty": res.loyalty,
            "Gasto_Autorizado": res.Authorized_Expenditure_v,
            "Retiros": res.retreats,
            "Cashback_valor": res.cashBackVa,
            "Giftcard": res.giftcard,
            "Observacion_Metodos": res.obs_method,
            "Factores_que_afectaron_venta": res.fact
        })
    })

    salesBefore_2020.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "total_personas": res.people_totals,
            "total_vendores": res.sales_totals,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diff,

            "factura_sistema_de": res.fac_sis_from,
            "factura_sistema_hasta": res.fac_sis_to,
            "total_sistema": res.total_sis,

            "factura_manual_de": res.fac_man_from,
            "factura_manual_hasta": res.fac_man_to,
            "total_manual": res.total_man,

            "nota_credito_de": res.fact_nt_c_f,
            "nota_credito_hasta": res.fact_nt_c_to,
            "nota_credito_total": res.fact_nt_c,

            "total_online": res.total_on,

            "efectivo_quetzales": res.cash_quetzales,
            "efectivo_dolares": res.cash_dolares,

            "credomatic": res.credomatic,
            "visa": res.visa,
            "visa_dolares": res.visaDolares,
            "masterCard": res.masterCard,
            "crediCuotas": res.credicuotas,
            "visaCuotas": res.visaCuotas,

            "factura_send_contra_entrega_desde": res.fact_send_CE_from,
            "factura_send_contra_entrega_hasta": res.fact_send_CE_to,
            "factura_send_contra_entrega_total": res.fact_send_CEV,

            "nota_de_credito": res.note_credit,
            "ticket_quetzales": res.ticket_quetzales,
            "missing": res.missing,
            "cuadre_de_caja": res.box_square,
            "Numero_de_envio_en_efectivo": res.numb_send_cash_value,
            "Numero_Life_Miles": res.lifeMilesNum,
            "Numero_Life_Miles_Valor": res.lifeMilesVa,
            "Execto_iva": res.extIva,
            "Loyalty": res.loyalty,
            "Gasto_Autorizado": res.Authorized_Expenditure_v,
            "Retiros": res.retreats,
            "Cashback_valor": res.cashBackVa,
            "Giftcard": res.giftcard,
            "Observacion_Metodos": res.obs_method,
            "Factores_que_afectaron_venta": res.fact
        })
    })
    return res.json({ dataStore });
}

//----------------------------------------------------------------
// -------------------------  API POR FECHA TI ---------------------------

async function getBinnacleSaleReportDate(req, res) {
    const { dateIn, dateOut } = req.params;
    if(momentToday(dateIn, 'YYYY-MM-DD',true).isValid() && momentToday(dateOut, 'YYYY-MM-DD',true).isValid()){
        if (new Date(dateIn) <=new Date(dateOut)) {
            const fechasDatos = [];
            //console.log(`Datos -------------- ${dateIn}- ${dateOut}`);
            const DayIn = Moment(dateIn).format('DD');
            const DayOut = Moment(dateOut).format('DD');
            const MothIn = Moment(dateIn).format('MM');
            const MonthOut = Moment(dateOut).format('MM');
            const YearIn = Moment(dateIn).format('YYYY');
            const YearOut = Moment(dateOut).format('YYYY');

            if (YearIn == YearOut) {
                console.log("Mismo Año");
                var monthDay = 0;
                if (MothIn == MonthOut) {
                    console.log("Mismo Mes");
                    for (var d = DayIn; d <= DayOut; d++) {
                        //console.log(`--${MothIn}-${j}`)
                        //console.log(Moment(new Date(`${YearOut}-${MothIn < 10?"0"+parseInt(MothIn):parseInt(MothIn)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD'));
                        fechasDatos.push({ date_created: { $regex: Moment(new Date(`${YearOut}-${MothIn < 10 ? "0" + parseInt(MothIn) : parseInt(MothIn)}-${d < 10 ? "0" + parseInt(d) : (d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD') } })
                    }
                } else {
                    console.log("Distinto Mes");
                    for (var m = MothIn; m <= MonthOut; m++) {
                        monthDay++;
                        const DayStart = monthDay == 1 ? parseInt(DayIn) : 1;
                        const DayEnd = m == MonthOut ? parseInt(DayOut) : new Date(YearOut, m, 0).getDate();
                        console.log(DayStart, DayEnd, m)
                        for (var d = DayStart; d <= DayEnd; d++) {
                            //console.log(`${YearOut}-${m < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)
                            //console.log(Moment(new Date(`${YearOut}-${m < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD'));
                            fechasDatos.push({ date_created: { $regex: Moment(new Date(`${YearOut}-${m < 10 ? "0" + parseInt(m) : parseInt(m)}-${d < 10 ? "0" + parseInt(d) : (d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD') } })
                        }
                    }
                }
            } else {
                console.log("Distinto Año");
                var diferens = 0;
                for (var yb = YearIn; yb <= YearOut; yb++) {
                    diferens++;
                }
                //console.log("Distinto Año");
                var monthDay = 0;
                var monthDefault = 0;
                var monthFinish = 0;
                var yearDefault = 0;

                for (var y = YearIn; y <= YearOut; y++) {
                    //console.log(`este es el año ${y}`);
                    yearDefault++;
                    monthDefault = yearDefault == 1 ? MothIn : 1;
                    monthFinish = yearDefault == diferens ? MonthOut : 12;
                    //console.log(`este es el año ${y} y sus meses son ${monthDefault} - ${monthFinish}`);
                    for (var m = monthDefault; m <= monthFinish; m++) {
                        //console.log(`este mes es----${y}/${m}`);
                        monthDay++;
                        const DayStart = monthDay == 1 ? DayIn : 1;
                        const DayEnd = m == MonthOut ? y == YearOut ? DayOut : new Date(y, m, 0).getDate() : new Date(y, m, 0).getDate();
                        //console.log("Dia que muere----",y,'-----', m,'----',MonthOut,'----',DayEnd)
                        //  console.log(`este es el dia ${DayStart} - ${DayEnd}`)
                        for (var d = DayStart; d <= DayEnd; d++) {
                            //console.log(Moment(new Date(`${y}-${parseInt(m) < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD'));
                            //console.log(new Date(`${y}-${parseInt(m) < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`),"-------------------------",`${y}-${m < 10?"0"+m:m}-0${d}T19:02:12.501+00:00`)
                            fechasDatos.push({ date_created: { $regex: Moment(new Date(`${y}-${parseInt(m) < 10 ? "0" + parseInt(m) : parseInt(m)}-${d < 10 ? "0" + parseInt(d) : (d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD') } })
                        }
                    }
                }
            }
            var query = { $or: fechasDatos }
            let salesNew = await BinnacleSaleByte.find(query, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1 });

            let salesBefore_2020 = await BinnacleSaleByteBefore.find({
                date_created: { $gte: `${dateIn}T19:02:12.501+00:00`, $lt: `${dateOut}T19:02:12.501+00:00` },
            }, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1 });

            const dataStore = [];
            salesNew.map((res) => {
                let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
                dataStore.push({
                    "fechaCreacion": fecha,
                    "Dia": Moment(fecha).format('DD'),
                    "Mes": Moment(fecha).format('MM'),
                    "Año": Moment(fecha).format('YYYY'),
                    "tienda": res.store_creat,
                    "ventas": res.sale_daily,
                    "metas": res.daily_goal,
                    "venta_año_anterior": res.year_before_sale,
                    "total_personas": res.people_totals,
                    "total_vendores": res.sales_totals,
                    "manager": res.manager,
                    "fact": res.fact,
                    "diferencia": res.diff,
                    "date": res.date_created
                })
            })

            salesBefore_2020.map((res) => {
                let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
                dataStore.push({
                    "fechaCreacion": fecha,
                    "Dia": Moment(fecha).format('DD'),
                    "Mes": Moment(fecha).format('MM'),
                    "Año": Moment(fecha).format('YYYY'),
                    "tienda": res.store_creat,
                    "ventas": res.sale_daily,
                    "metas": res.daily_goal,
                    "venta_año_anterior": res.year_before_sale,
                    "total_personas": res.people_totals,
                    "total_vendores": res.sales_totals,
                    "manager": res.manager,
                    "fact": res.fact,
                    "diferencia": res.diffy,
                    "date": res.date_created
                })
            })

            return res.json({ dataStore });
        } else {
            return res.json('Error, En la fecha');
        }
    } else {
        return res.status(400).json({ message: "Error, fechas en formato incorrecto" });
    }

}

async function getBinnacleSaleMethodReportDate(req, res) {
    const { dateIn, dateOut } = req.params;
    if(momentToday(dateIn, 'YYYY-MM-DD',true).isValid() && momentToday(dateOut, 'YYYY-MM-DD',true).isValid()){
        if (new Date(dateIn) <=new Date(dateOut)) {
            const fechasDatos = [];
            //console.log(`Datos -------------- ${dateIn}- ${dateOut}`);
            const DayIn = Moment(dateIn).format('DD');
            const DayOut = Moment(dateOut).format('DD');
            const MothIn = Moment(dateIn).format('MM');
            const MonthOut = Moment(dateOut).format('MM');
            const YearIn = Moment(dateIn).format('YYYY');
            const YearOut = Moment(dateOut).format('YYYY');

            if (YearIn == YearOut) {
                console.log("Mismo Año");
                var monthDay = 0;
                if (MothIn == MonthOut) {
                    console.log("Mismo Mes");
                    for (var d = DayIn; d <= DayOut; d++) {
                        //console.log(`--${MothIn}-${j}`)
                        //console.log(Moment(new Date(`${YearOut}-${MothIn < 10?"0"+parseInt(MothIn):parseInt(MothIn)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD'));
                        fechasDatos.push({ date_created: { $regex: Moment(new Date(`${YearOut}-${MothIn < 10 ? "0" + parseInt(MothIn) : parseInt(MothIn)}-${d < 10 ? "0" + parseInt(d) : (d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD') } })
                    }
                } else {
                    console.log("Distinto Mes");
                    for (var m = MothIn; m <= MonthOut; m++) {
                        monthDay++;
                        const DayStart = monthDay == 1 ? parseInt(DayIn) : 1;
                        const DayEnd = m == MonthOut ? parseInt(DayOut) : new Date(YearOut, m, 0).getDate();
                        console.log(DayStart, DayEnd, m)
                        for (var d = DayStart; d <= DayEnd; d++) {
                            //console.log(`${YearOut}-${m < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)
                            //console.log(Moment(new Date(`${YearOut}-${m < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD'));
                            fechasDatos.push({ date_created: { $regex: Moment(new Date(`${YearOut}-${m < 10 ? "0" + parseInt(m) : parseInt(m)}-${d < 10 ? "0" + parseInt(d) : (d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD') } })
                        }
                    }
                }
            } else {
                console.log("Distinto Año");
                var diferens = 0;
                for (var yb = YearIn; yb <= YearOut; yb++) {
                    diferens++;
                }
                //console.log("Distinto Año");
                var monthDay = 0;
                var monthDefault = 0;
                var monthFinish = 0;
                var yearDefault = 0;

                for (var y = YearIn; y <= YearOut; y++) {
                    //console.log(`este es el año ${y}`);
                    yearDefault++;
                    monthDefault = yearDefault == 1 ? MothIn : 1;
                    monthFinish = yearDefault == diferens ? MonthOut : 12;
                    //console.log(`este es el año ${y} y sus meses son ${monthDefault} - ${monthFinish}`);
                    for (var m = monthDefault; m <= monthFinish; m++) {
                        //console.log(`este mes es----${y}/${m}`);
                        monthDay++;
                        const DayStart = monthDay == 1 ? DayIn : 1;
                        const DayEnd = m == MonthOut ? y == YearOut ? DayOut : new Date(y, m, 0).getDate() : new Date(y, m, 0).getDate();
                        //console.log("Dia que muere----",y,'-----', m,'----',MonthOut,'----',DayEnd)
                        //  console.log(`este es el dia ${DayStart} - ${DayEnd}`)
                        for (var d = DayStart; d <= DayEnd; d++) {
                            //console.log(Moment(new Date(`${y}-${parseInt(m) < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD'));
                            //console.log(new Date(`${y}-${parseInt(m) < 10?"0"+parseInt(m):parseInt(m)}-${d<10?"0"+parseInt(d):(d)}T19:02:12.501+00:00`),"-------------------------",`${y}-${m < 10?"0"+m:m}-0${d}T19:02:12.501+00:00`)
                            fechasDatos.push({ date_created: { $regex: Moment(new Date(`${y}-${parseInt(m) < 10 ? "0" + parseInt(m) : parseInt(m)}-${d < 10 ? "0" + parseInt(d) : (d)}T19:02:12.501+00:00`)).format('YYYY-MM-DD') } })
                        }
                    }
                }
            }
            var query = { $or: fechasDatos }
            let salesNew = await BinnacleSaleByte.find(query);

            let salesBefore_2020 = await BinnacleSaleByteBefore.find({
                date_created: { $gte: `${dateIn}T19:02:12.501+00:00`, $lt: `${dateOut}T19:02:12.501+00:00` },
            });

            const dataStore = [];
            
            salesNew.map((res) => {
                let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
                dataStore.push({
                    "fechaCreacion": fecha,
                    "Dia": Moment(fecha).format('DD'),
                    "Mes": Moment(fecha).format('MM'),
                    "Año": Moment(fecha).format('YYYY'),
                    "tienda": res.store_creat,
                    "ventas": res.sale_daily,
                    "metas": res.daily_goal,
                    "venta_año_anterior": res.year_before_sale,
                    "total_personas": res.people_totals,
                    "total_vendores": res.sales_totals,
                    "manager": res.manager,
                    "fact": res.fact,
                    "diferencia": res.diff,
        
                    "factura_sistema_de": res.fac_sis_from,
                    "factura_sistema_hasta": res.fac_sis_to,
                    "total_sistema": res.total_sis,
        
                    "factura_manual_de": res.fac_man_from,
                    "factura_manual_hasta": res.fac_man_to,
                    "total_manual": res.total_man,
        
                    "nota_credito_de": res.fact_nt_c_f,
                    "nota_credito_hasta": res.fact_nt_c_to,
                    "nota_credito_total": res.fact_nt_c,
        
                    "total_online": res.total_on,
        
                    "efectivo_quetzales": res.cash_quetzales,
                    "efectivo_dolares": res.cash_dolares,
        
                    "credomatic": res.credomatic,
                    "visa": res.visa,
                    "visa_dolares": res.visaDolares,
                    "masterCard": res.masterCard,
                    "crediCuotas": res.credicuotas,
                    "visaCuotas": res.visaCuotas,
        
                    "factura_send_contra_entrega_desde": res.fact_send_CE_from,
                    "factura_send_contra_entrega_hasta": res.fact_send_CE_to,
                    "factura_send_contra_entrega_total": res.fact_send_CEV,
        
                    "nota_de_credito": res.note_credit,
                    "ticket_quetzales": res.ticket_quetzales,
                    "missing": res.missing,
                    "cuadre_de_caja": res.box_square,
                    "Numero_de_envio_en_efectivo": res.numb_send_cash_value,
                    "Numero_Life_Miles": res.lifeMilesNum,
                    "Numero_Life_Miles_Valor": res.lifeMilesVa,
                    "Execto_iva": res.extIva,
                    "Loyalty": res.loyalty,
                    "Gasto_Autorizado": res.Authorized_Expenditure_v,
                    "Retiros": res.retreats,
                    "Cashback_valor": res.cashBackVa,
                    "Giftcard": res.giftcard,
                    "Observacion_Metodos": res.obs_method,
                    "Factores_que_afectaron_venta": res.fact
                })
            })
        
            salesBefore_2020.map((res) => {
                let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
                dataStore.push({
                    "fechaCreacion": fecha,
                    "Dia": Moment(fecha).format('DD'),
                    "Mes": Moment(fecha).format('MM'),
                    "Año": Moment(fecha).format('YYYY'),
                    "tienda": res.store_creat,
                    "ventas": res.sale_daily,
                    "metas": res.daily_goal,
                    "venta_año_anterior": res.year_before_sale,
                    "total_personas": res.people_totals,
                    "total_vendores": res.sales_totals,
                    "manager": res.manager,
                    "fact": res.fact,
                    "diferencia": res.diff,
        
                    "factura_sistema_de": res.fac_sis_from,
                    "factura_sistema_hasta": res.fac_sis_to,
                    "total_sistema": res.total_sis,
        
                    "factura_manual_de": res.fac_man_from,
                    "factura_manual_hasta": res.fac_man_to,
                    "total_manual": res.total_man,
        
                    "nota_credito_de": res.fact_nt_c_f,
                    "nota_credito_hasta": res.fact_nt_c_to,
                    "nota_credito_total": res.fact_nt_c,
        
                    "total_online": res.total_on,
        
                    "efectivo_quetzales": res.cash_quetzales,
                    "efectivo_dolares": res.cash_dolares,
        
                    "credomatic": res.credomatic,
                    "visa": res.visa,
                    "visa_dolares": res.visaDolares,
                    "masterCard": res.masterCard,
                    "crediCuotas": res.credicuotas,
                    "visaCuotas": res.visaCuotas,
        
                    "factura_send_contra_entrega_desde": res.fact_send_CE_from,
                    "factura_send_contra_entrega_hasta": res.fact_send_CE_to,
                    "factura_send_contra_entrega_total": res.fact_send_CEV,
        
                    "nota_de_credito": res.note_credit,
                    "ticket_quetzales": res.ticket_quetzales,
                    "missing": res.missing,
                    "cuadre_de_caja": res.box_square,
                    "Numero_de_envio_en_efectivo": res.numb_send_cash_value,
                    "Numero_Life_Miles": res.lifeMilesNum,
                    "Numero_Life_Miles_Valor": res.lifeMilesVa,
                    "Execto_iva": res.extIva,
                    "Loyalty": res.loyalty,
                    "Gasto_Autorizado": res.Authorized_Expenditure_v,
                    "Retiros": res.retreats,
                    "Cashback_valor": res.cashBackVa,
                    "Giftcard": res.giftcard,
                    "Observacion_Metodos": res.obs_method,
                    "Factores_que_afectaron_venta": res.fact
                })
            })

            return res.json({ dataStore });
        } else {
            return res.json('La fecha inicial no puede ser mayor');
        }
    } else {
        return res.status(400).json({ message: "Error, fechas en formato incorrecto" });
    }

}


async function getBinnacleSaleReportBefore(req, res) {
    console.log(req.body);
    const dataStore = [];
    let dateInic = req.params.id + "-01-01T19:02:12.501+00:00"
    let dateFin = req.params.id + "-12-31T19:02:12.501+00:00"
    console.log(dateInic, dateFin)
    let salesBefore = await BinnacleSaleByteBefore.find({
        date_created: { $gte: dateInic, $lt: dateFin },
    });

    salesBefore.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "total_personas": res.people_totals,
            "total_vendores": res.sales_totals,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diff,

            "factura_sistema_de": res.fac_sis_from,
            "factura_sistema_hasta": res.fac_sis_to,
            "total_sistema": res.total_sis,

            "factura_manual_de": res.fac_man_from,
            "factura_manual_hasta": res.fac_man_to,
            "total_manual": res.total_man,

            "nota_credito_de": res.fact_nt_c_f,
            "nota_credito_hasta": res.fact_nt_c_to,
            "nota_credito_total": res.fact_nt_c,

            "total_online": res.total_on,

            "efectivo_quetzales": res.cash_quetzales,
            "efectivo_dolares": res.cash_dolares,

            "credomatic": res.credomatic,
            "visa": res.visa,
            "visa_dolares": res.visaDolares,
            "masterCard": res.masterCard,
            "crediCuotas": res.credicuotas,
            "visaCuotas": res.visaCuotas,

            "factura_send_contra_entrega_desde": res.fact_send_CE_from,
            "factura_send_contra_entrega_hasta": res.fact_send_CE_to,
            "factura_send_contra_entrega_total": res.fact_send_CEV,

            "nota_de_credito": res.note_credit,
            "ticket_quetzales": res.ticket_quetzales,
            "missing": res.missing,
            "cuadre_de_caja": res.box_square,
            "Numero_de_envio_en_efectivo": res.numb_send_cash_value,
            "Numero_Life_Miles": res.lifeMilesNum,
            "Numero_Life_Miles_Valor": res.lifeMilesVa,
            "Execto_iva": res.extIva,
            "Loyalty": res.loyalty,
            "Gasto_Autorizado": res.Authorized_Expenditure_v,
            "Retiros": res.retreats,
            "Cashback_valor": res.cashBackVa,
            "Giftcard": res.giftcard,
            "Observacion_Metodos": res.obs_method,
            "Factores_que_afectaron_venta": res.fact
        })
    })

    return res.json({ dataStore });
}

async function getBinnacleSaleReportTotal(req, res) {
    const dataStore = [];
    let salesNew = await BinnacleSaleByte.find({
        //date_created: { $regex: "2020" }
        date_created: { $in: [/^2020/i, /^2021/, /^2022/] }
    }, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1 });

    let salesBefore_2020 = await BinnacleSaleByteBefore.find({
        date_created: { $gte: "2018-01-01T19:02:12.501+00:00", $lt: "2020-08-18T19:02:12.501+00:00" },
    }, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1 });

    
    salesNew.map((res) => {
        let beforeDay = Moment(hoy, 'DD-MM-YYYY').subtract(1,'days').format();
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "total_personas": res.people_totals,
            "total_vendores": res.sales_totals,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diff,
            "date": res.date_created,
            "diaAnterior": beforeDay
        })
    })

    salesBefore_2020.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "total_personas": res.people_totals,
            "total_vendores": res.sales_totals,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diffy,
            "date": res.date_created
        })
    })

    return res.json({ dataStore });
}

async function getBinnacleSaleReportTotalSendFirebase(req, res) {
    const dataStore = [];
    let salesNew = await BinnacleSaleByte.find({
        date_created: { $in: [/^2020/i, /^2021/, /^2022/] }
    }, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1 });

    let salesBefore_2020 = await BinnacleSaleByteBefore.find({
        date_created: { $gte: "2015-01-01T19:02:12.501+00:00", $lt: "2020-08-18T19:02:12.501+00:00" },
    }, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1 });

    salesNew.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily ? res.sale_daily : 0,
            "metas": res.daily_goal ? res.daily_goal : 0,
            "venta_año_anterior": res.year_before_sale ? res.year_before_sale : 0,
            "total_personas": res.people_totals ? res.people_totals : 0,
            "total_vendores": res.sales_totals ? res.sales_totals : 0,
            "manager": res.manager,
            "fact": res.fact ? res.fact : 0,
            "diferencia": res.diffy ? res.diffy : 0,
            "date": res.date_created
        })
    })

    salesBefore_2020.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily ? res.sale_daily : 0,
            "metas": res.daily_goal ? res.daily_goal : 0,
            "venta_año_anterior": res.year_before_sale ? res.year_before_sale : 0,
            "total_personas": res.people_totals ? res.people_totals : 0,
            "total_vendores": res.sales_totals ? res.sales_totals : 0,
            "manager": res.manager,
            "fact": res.fact ? res.fact : 0,
            "diferencia": res.diffy ? res.diffy : 0,
            "date": res.date_created
        })
    })

    dataStore.map(async (doc) => {
        try {
            await firestore.collection('BinnacleSale').add(doc);
            console.log('Insert new document in BinnacleSale');
        } catch (error) {
            console.log(error)
        }
    });

    return res.json({ dataStore });
}

async function setBinnacleSalesCreate(req, res) {
    let params = req.body;
    let sale = new BinnacleSaleByte();
    let currency_format = {
        symbol: 'Q.',//simbolo
        decimal: '.',//punto de los decimales                   
        thousand: ',', //separador entre miles
        precision: 2, // número de decimales
        format: '%s %v' // %s es el simbolo %v es el valor
    };
    if (params.dateStoreDefault) {
        sale.date_created = Moment(params.dateStoreDefault).format('YYYY-MM-DD');
        var dateEmail = Moment(params.dateStoreDefault).format('DD/MM/YYYY')
    } else {
        sale.date_created = require("moment-timezone")
            .tz("America/Guatemala")
            .format("YYYY-MM-DD");
        var dateEmail = Moment().tz('America/Guatemala').format('DD/MM/YYYY')
    }


    sale.store_creat = params.storeDefault;
    sale.sale_daily = params.sales.venta_diaria;
    sale.daily_goal = params.sales.meta;
    sale.year_before_sale = params.sales.venta_anterior;
    sale.manager = params.sales.encargado;
    sale.fact = params.sales.factoresDeVenta;
    //sale.compilance_manager = params.sales.;
    sale.people_totals = params.sales.no_personas;
    sale.sales_totals = params.sales.no_ventas;
    sale.diff = params.sales.faltante;
    //System
    sale.fac_sis_from = params.sales.facturas_sis_desde;
    sale.fac_sis_to = params.sales.facturas_sis_hasta;
    sale.total_sis = params.sales.facturas_sis_total;
    //manual
    sale.fac_man_from = params.sales.facturas_man_desde;
    sale.fac_man_to = params.sales.facturas_man_hasta;
    sale.total_man = params.sales.facturas_man_total;
    //COD
    sale.fact_send_CE_from = params.sales.facturas_cod_desde;
    sale.fact_send_CE_to = params.sales.facturas_cod_hasta;
    sale.fact_send_CEV = params.sales.facturas_cod_total;
    //note credito
    sale.fact_nt_c_f = params.sales.facturas_nota_desde;
    sale.fact_nt_c_to = params.sales.facturas_nota_hasta;
    sale.fact_nt_c = params.sales.facturas_nota_total;
    //Method
    sale.cash_quetzales = params.sales.efectivoQuetzales;
    sale.cash_dolares = params.sales.efectivoQuetzalesDolares;
    sale.credomatic = params.sales.credomatic;
    sale.visa = params.sales.visa;
    sale.visaOnline = params.sales.visaOnline;
    sale.visaDolares = params.sales.visaDolares;
    sale.masterCard = params.sales.masterCard;
    sale.credicuotas = params.sales.credicuotas;
    sale.visaCuotas = params.sales.visaCuotas;
    sale.numb_send_cash_value = params.sales.valorEnvioEfectivo;
    sale.lifeMilesNum = params.sales.lifeMilesNumber;
    sale.lifeMilesVa = params.sales.lifeMilesValor;
    sale.extIva = params.sales.exencionIva;
    sale.loyalty = params.sales.loyalty;
    sale.Authorized_Expenditure_v = params.sales.gastosAutorizados;
    sale.retreats = params.sales.retirosMercaderia;
    sale.total_on = params.sales.ventaEnLinea;
    sale.note_credit = params.sales.notaDeCredito;
    sale.missing = params.sales.faltante;
    sale.box_square = params.sales.cuadreDeCaja;
    sale.diference = params.sales.diferencia;
    sale.cashBackVa = params.sales.cashback;
    sale.giftcard = params.sales.giftcard;
    sale.obs_method = params.sales.observaciones;
    sale.ticket_quetzales = "";
    sale.date_ticket_cash_quetzales = Date.now();
    sale.date_ticket_cash_dollars = Date.now();
    sale.ticket_dollars = "";
    sale.ticket_quetzales = "";
    sale.date_update_conta = Date.now();
    sale.vendors = [];

    params.vendors.map(res => {
        let vendors = {
            name: res.nombre,
            sale: res.venta
        }
        sale.vendors.push(vendors);
    })

    sale.vendorsDescount = [];

    params.vendorsDescount.map(res => {
        let vendorsDescount = {
            name: res.nombre,
            sale: res.venta
        }
        sale.vendorsDescount.push(vendorsDescount);
    })

    var emailValid = false
    //Trae los emails para el correo
    var emails = [];
    let showUserInfo = await Email_template.find({ template: "Venta Diaria", status: "Activo" });
    showUserInfo.map((elementos) => {
        return emails.push(elementos.email)
    });

    var emailsDefault = [];
    let showUser = await Email_template.find({ template: "Venta Diaria Default", status: "Activo" });
    showUser.map((elementos) => {
        return emailsDefault.push(elementos.email)
    });

    await sale.save(async (err, sale) => {
        if (err) return res.status(500).send({ valid: false });
        if (sale) {
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
            transporter.sendMail({
                from: '"Datos de venta" <noreply@corpinto.com>', // sender address
                to: emailsDefault,
                cc: emails,
                subject: `Dato de venta diaria ${dateEmail}`,
                text: "", // plain text body
                html: `<table border="0" align="left" width="590" cellpadding="0" cellspacing="0" class="container590">
                   
                <tr>
                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center"
                        style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;"
                        class="main-header">


                        <div style="line-height: 35px">

                            <span style="color: #5caad2;">${sale.store_creat}</span> Venta ${currencyFormatter.format(sale.sale_daily, currency_format)}

                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="left">
                        <table border="0" width="400" align="left" cellpadding="0" cellspacing="0"
                            class="container590">
                            <tr>
                                <td align="left" style="color:black">

                                    <b style="color:black">Meta:</b><p>${currencyFormatter.format(sale.daily_goal, currency_format)}</p><br>
                                    <b style="color:black">Venta Año Anterior:</b><p>${currencyFormatter.format(sale.year_before_sale, currency_format)}</p><br>
                                    <b style="color:black">Encargado:</b><p>${sale.manager}</p><br>
                                    <b style="color:black">Clíentes:</b><p>${sale.people_totals}</p><br>
                                    <b style="color:black">Ventas:</b><p>${sale.sales_totals}</p><br>
                                    <b style="color:black">Total de los vendedores:</b><br>
                                    ${sale.vendors.map((x, i) => {
                    return (
                        `<p style="color:black">
                                                    <b style="color:black">
                                                        ${i + 1} Vendedor:</b> 
                                                            ${x.name} 
                                                    <b style="color:black">
                                                        Venta:</b> 
                                                            ${currencyFormatter.format(x.sale, currency_format)}
                                                </p>`
                    )
                })
                    }
                                   
                                    ${sale.vendorsDescount.map((x, i) => {
                        return (
                            `
                                                ${i === 0 ? `<b style="color:black">Total Descuento Vendedores:</b><br>` : ``
                            }
                                                <p style="color:black"><b style="color:black">${i + 1}. Vendedor:</b> ${x.name} <b style="color:black">Descuento:</b> Q. ${x.sale}</p>`
                        )
                    })
                    }
                                    <b style="color:black">Factores que afectaron la venta:</b> <h2 for="" style="color:black">${sale.fact}</h2>

                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>




            </table>`, // html body
            }, async function (err, json) {
                if (err) console.log("Error en el Mensaje!")
                if (json) { console.log("Mensaje Enviado!") }
            });

        }
        emailValid = true
        console.log("1")
    });

    return res.json({ status: true, message: 'Dato de venta creado exitosamente!', color: "green" });
}

/*Actualiza el dato de venta*/
async function setBinnacleSalesUpdate(req, res) {
    console.log("Entro Al upadate");
    let params = req.body;
    var fecha;
    console.log("Esta fecha llego", params.dateStoreDefault);
    if (params.dateStoreDefault) {
        fecha = Moment(params.dateStoreDefault).format('YYYY-MM-DD');
    } else {
        fecha = require("moment-timezone")
            .tz("America/Guatemala")
            .format("YYYY-MM-DD");
    }

    var vendorsArray = [];

    params.vendors.map(res => {
        let vendors = {
            name: res.nombre,
            sale: res.venta
        }
        return vendorsArray.push(vendors);
    })

    var vendorsDescountArray = [];

    params.vendorsDescount.map(res => {
        let vendorsDescount = {
            name: res.nombre,
            sale: res.venta
        }
        return vendorsDescountArray.push(vendorsDescount);
    })


    const dataSale = {
        store_creat: params.storeDefault,
        sale_daily: params.sales[0].venta_diaria,
        daily_goal: params.sales[0].meta,
        year_before_sale: params.sales[0].venta_anterior,
        manager: params.sales[0].encargado,
        fact: params.sales[0].factoresDeVenta,
        //compilance_manager : params.sales[0].,
        people_totals: params.sales[0].no_personas,
        sales_totals: params.sales[0].no_ventas,
        diff: params.sales[0].faltante,
        //System
        fac_sis_from: params.sales[0].facturas_sis_desde,
        fac_sis_to: params.sales[0].facturas_sis_hasta,
        total_sis: params.sales[0].facturas_sis_total,
        //manual
        fac_man_from: params.sales[0].facturas_man_desde,
        fac_man_to: params.sales[0].facturas_man_hasta,
        total_man: params.sales[0].facturas_man_total,
        //COD
        fact_send_CE_from: params.sales[0].facturas_cod_desde,
        fact_send_CE_to: params.sales[0].facturas_cod_hasta,
        fact_send_CEV: params.sales[0].facturas_cod_total,
        //note credito
        fact_nt_c_f: params.sales[0].facturas_nota_desde,
        fact_nt_c_to: params.sales[0].facturas_nota_hasta,
        fact_nt_c: params.sales[0].facturas_nota_total,
        //Method
        cash_quetzales: params.sales[0].efectivoQuetzales,
        cash_dolares: params.sales[0].efectivoQuetzalesDolares,
        credomatic: params.sales[0].credomatic,
        visa: params.sales[0].visa,
        visaOnline: params.sales[0].visaOnline,
        visaDolares: params.sales[0].visaDolares,
        masterCard: params.sales[0].masterCard,
        credicuotas: params.sales[0].crediCuotas,
        visaCuotas: params.sales[0].visaCuotas,
        numb_send_cash_value: params.sales[0].valorEnvioEfectivo,
        lifeMilesNum: params.sales[0].lifeMilesNumber,
        lifeMilesVa: params.sales[0].lifeMilesValor,
        extIva: params.sales[0].exencionIva,
        loyalty: params.sales[0].loyalty,
        Authorized_Expenditure_v: params.sales[0].gastosAutorizados,
        retreats: params.sales[0].retirosMercaderia,
        total_on: params.sales[0].ventaEnLinea,
        note_credit: params.sales[0].notaDeCredito,
        missing: params.sales[0].faltante,
        box_square: params.sales[0].cuadreDeCaja,
        diference: params.sales[0].diferencia,
        cashBackVa: params.sales[0].cashback,
        giftcard: params.sales[0].giftcard,
        obs_method: params.sales[0].observaciones,
        ticket_quetzales: "",
        date_ticket_cash_quetzales: Date.now(),
        date_ticket_cash_dollars: Date.now(),
        ticket_dollars: "",
        ticket_quetzales: "",
        date_update_conta: Date.now(),
        date_created: fecha,
        vendors: vendorsArray,
        vendorsDescount: vendorsDescountArray
    }

    BinnacleSaleByte.findByIdAndUpdate(req.body.sales[0].id, dataSale, (err, result) => {
        //console.log(req.body.sales[0].id, dataSale, datosUpdate);
        if (err) console.log("ERROR", err);
        console.log("RESULT", result)
        return res.json({ status: true, message: 'Dato de venta actualizado exitosamente!', color: "green" });
    });
}


/* Valida si existe un dato de venta anterior*/
async function validationDataSale(req, res) {
/*     console.log(req.body)
    let dateValid;
    if (req.body.dateStart) {
        dateValid = Moment(req.body.dateStart).format('YYYY-MM-DD')
    } else {
        var mm_f = 0;
        if (mm > 9) {
            mm_f = mm
        } else {
            mm_f = "0" + mm
        }
        
        dateValid = yyyy + "-" + mm_f + "-" + dd;
    } */

    var momenthoy = Moment().tz("America/Guatemala").format("yyyy-MM-DD");
    var yesterday = momentToday(momenthoy).subtract(1, 'd');
    var tomorrow = momentToday(momenthoy).add(1, 'd');
    var durationYesterday = momentToday.duration(yesterday.diff(req.body.dateStart)).asDays();
    var durationTomorrow = momentToday.duration(tomorrow.diff(req.body.dateStart)).asDays();

    if(durationYesterday != 0  && durationYesterday != -1 &&  durationTomorrow != 0 &&  durationTomorrow != 1  ){
        return res.status(200).json({ error: true, message: "Fecha fuera de rangos permitido. Unicamente puede ser de un dia anterior y un dia posterior a la fecha actual." });
    }
    console.log(req.body.dateStart);
    let salesNew = await BinnacleSaleByte.find({
        date_created: { $regex: req.body.dateStart }, store_creat: req.body.StoreDefault, manager: req.body.manager
    }, { date_created: 1, store_creat: 1, sale_daily: 1, manager: 1, year_before_sale: 1 });
    console.log(salesNew.length);
    if(salesNew.length > 0){
        return res.status(200).json({ error: true, message: "Ya cuenta con un dato de venta en esta fecha."})
    }

    return res.status(200).json({ error: false });
}

/* Eliminar Dato de venta*/
async function deleteDataSale(req, res) {

    var myquery = { _id: req.body.id };
    var deleteaccion
    const remove = await BinnacleSaleByte.deleteOne(myquery);

    if (remove) {
        deleteaccion = { "response": true }
    } else {
        deleteaccion = { "response": false }
    }
    return res.json(deleteaccion);
}

/*
Modulo de ejecucion
*/
async function getBinnacleDailies(req, res) {
    let binnacleDailies = await BinnacleDailies.find({ store_created: req.body.store });
    binnacleDailies.reverse()
    return res.json({ binnacleDailies });
}
/*  Crear ejecucion*/
async function creatBinnacleDailies(req, res) {
    let params = req.body;
    let daily = new BinnacleDailies();

    daily.daily_goal = params.dataBi[0].meta
    daily.year_before_sale = params.dataBi[0].beforesales
    daily.hamachi = params.dataBi[0].hamachi
    daily.tras = params.dataBi[0].recepTrans
    daily.process_in = params.dataBi[0].processIn
    daily.process_out = params.dataBi[0].processOut
    daily.send_received = params.dataBi[0].sendReceived
    daily.vendor_number = params.dataBi[0].vendorsCount
    daily.store_created = params.store
    daily.date_created = require("moment-timezone")
        .tz("America/Guatemala")
    var responseData = "";
    await daily.save(async (err) => {
        console.log("test")
        if (err) {
            responseData = false
            return res.json(responseData);
        } else {
            responseData = true
            return res.json(responseData);
        }
    });
}
/* Eliminar ejecucion*/
async function deleteBinnacleDailies(req, res) {

    var myquery = { _id: req.body.id };
    var deleteaccion
    const remove = await BinnacleDailies.deleteOne(myquery);

    if (remove) {
        deleteaccion = { "response": true }
    } else {
        deleteaccion = { "response": false }
    }

    return res.json(deleteaccion);
}

async function getDataReport(req, res) {
    let inicio = req.params.date_start.split("-");
    let anio_inicial = parseInt(inicio[0])
    let mes_inicial = parseInt(inicio[1])
    let dia_inicial = parseInt(inicio[2])
    let final = req.params.date_end.split("-")
    let anio_final = parseInt(final[0])
    let mes_final = parseInt(final[1])
    let dia_final = parseInt(final[2])
    let array_fechas = [];
    let query;
    if (req.params.date_start !== req.params.date_end) {
        for (let anio = anio_inicial; anio <= anio_final; anio++) {
            for (let mes = mes_inicial; mes <= mes_final; mes++) {
                for (let dia = dia_inicial; dia <= 31; dia++) {
                    array_fechas.push({ date_created: `${anio}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}` });
                }
            }
        }
    } else {
        array_fechas.push({ date_created: `${anio_inicial}-${mes_inicial < 10 ? '0' + mes_inicial : mes_inicial}-${dia_inicial < 10 ? '0' + dia_inicial : dia_inicial}` });
    }
    if (req.body.role == "admin") {
        if (req.body.store && req.body.store != "Todas") {
            query = {
                $or: array_fechas,
                store_creat: req.body.store
            }
        } else {
            query = { $or: array_fechas }
        }
    } else {
        query = {
            $or: array_fechas,
            store_creat: req.body.store
        }
    }
    console.log(query)
    let dataStore = [];
    let salesNew = await BinnacleSaleByte.find(query, { _id: 1, date_created: 1, store_creat: 1, sale_daily: 1, manager: 1, year_before_sale: 1, daily_goal: 1, fact: 1 });

    salesNew.map((res) => {
        let fecha = Moment(res.date_created).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
            "id": res._id,
            "fechaCreacion": fecha,
            "Dia": Moment(fecha).format('DD'),
            "Mes": Moment(fecha).format('MM'),
            "Año": Moment(fecha).format('YYYY'),
            "tienda": res.store_creat,
            "ventas": res.sale_daily,
            "metas": res.daily_goal,
            "venta_año_anterior": res.year_before_sale,
            "manager": res.manager,
            "fact": res.fact,
            "diferencia": res.diff,
            "date": res.date_created
        })
    })
    dataStore.reverse()
    return res.json({ data: dataStore });
}

async function getDataReportMethods(req, res) {
    let query;
    let inicio = req.params.date_start.split("-");
    let anio_inicial = parseInt(inicio[0])
    let mes_inicial = parseInt(inicio[1])
    let dia_inicial = parseInt(inicio[2])
    let final = req.params.date_end.split("-")
    let anio_final = parseInt(final[0])
    let mes_final = parseInt(final[1])
    let dia_final = parseInt(final[2])
    let array_fechas = [];

    if (req.params.date_start !== req.params.date_end) {
        for (let anio = anio_inicial; anio <= anio_final; anio++) {
            for (let mes = mes_inicial; mes <= mes_final; mes++) {
                for (let dia = dia_inicial; dia <= 31; dia++) {
                    array_fechas.push({ date_created: `${anio}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}` });
                }
            }
        }
        query = {
            $or: array_fechas,
            store_creat: req.body.store
        }
    } else {
        query = {
            date_created: `${anio_inicial}-${mes_inicial < 10 ? '0' + mes_inicial : mes_inicial}-${dia_inicial < 10 ? '0' + dia_inicial : dia_inicial}`,
            store_creat: req.body.store
        }
    }

    console.log(query)
    let salesNew = await BinnacleSaleByte.find(query, {
        _id: 1,
        date_created: 1,
        store_creat: 1,
        sale_daily: 1,
        manager: 1,
        cash_quetzales: 1,
        cash_dolares: 1,
        credomatic: 1,
        visa: 1,
        visaOnline: 1,
        visaDolares: 1,
        masterCard: 1,
        credicuotas: 1,
        visaCuotas: 1,
        numb_send_cash_value: 1,
        lifeMilesNum: 1,
        lifeMilesVa: 1,
        extIva: 1,
        loyalty: 1,
        Authorized_Expenditure_v: 1,
        retreats: 1,
        total_on: 1,
        note_credit: 1,
        diff: 1,
        box_square: 1,
        diference: 1,
        cashBackVa: 1,
        giftcard: 1
    });


    salesNew.reverse()
    return res.json({ data: salesNew });
}

async function getDataReportDailies(req, res) {
    let query;
    if (req.body.role == "admin") {
        if (req.params.date_start !== req.params.date_end) {
            if (req.body.store && req.body.store != "Todas") {
                query = {
                    date_created: {
                        $gt: Moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                        $lt: Moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    },
                    store_created: req.body.store
                }
            } else {
                query = {
                    date_created: {
                        $gt: Moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                        $lt: Moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    }
                }
            }
        } else {
            if (req.body.store && req.body.store !== "Todas") {
                query = {
                    date_created: {
                        $gte: Moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDT00:00:00.80Z"),
                        $lt: Moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDT23:59:59.80Z")
                    },
                    store_created: req.body.store
                }
            } else {
                query = {
                    date_created: {
                        $gte: Moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDT00:00:00.80Z"),
                        $lt: Moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDT23:59:59.80Z")
                    },
                }
            }
        }
    } else {
        if (req.params.date_start !== req.params.date_end) {
            query = {
                date_created: {
                    $gt: Moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    $lt: Moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                },
                store_created: req.body.store
            }
        } else {
            query = {
                date_created: {
                    $gte: Moment(new Date(req.params.date_start)).utcOffset('+00:00').format("YYYY-MM-DDT00:00:00.80Z"),
                    $lt: Moment(new Date(req.params.date_end)).utcOffset('+00:00').format("YYYY-MM-DDT23:59:59.80Z")
                },
                store_created: req.body.store
            }
        }
    }
    await BinnacleDailies.find(query).exec((err, result) => {
        console.log(err);
        if (err) return res.status(500).send('Algo salío mal')
        if (!result) return res.status(404).send({ message: 'No existen datos en el rango de fechas especificado' })
        return res.status(200).send({ data: result });
    });
}

module.exports = {
    deleteDataSale,
    getBinnacleSale,
    getBinnacleSaleById,
    getBinnacleSaleReport,
    getBinnacleSaleReportDate,
    getBinnacleSaleMethodReportDate,
    getBinnacleSaleReportBefore,
    getBinnacleSaleReportTotal,
    getBinnacleSaleReportTotalSendFirebase,
    validationDataSale,
    setBinnacleSalesCreate,
    setBinnacleSalesUpdate,
    creatBinnacleDailies,
    deleteBinnacleDailies,
    getBinnacleDailies,
    getDataReport,
    getDataReportMethods,
    getDataReportDailies
}
