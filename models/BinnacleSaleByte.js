'use strict'
const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema({
    sale_daily: { type: Number, default: 0 },
    daily_goal: { type: Number, default: 0 },
    year_before_sale: { type: Number, default: 0 },
    manager: { type: String, default: "" },
    compilance_manager: { type: Number, default: 0 },
    people_totals: { type: Number, default: 0 },
    sales_totals: { type: Number, default: 0 },
    diff: { type: Number, default: 0 },
    //System
    fac_sis_from: { type: String, default: "-" },
    fac_sis_to: { type: String, default: "-" },
    total_sis: { type: Number, default: 0 },
    //manual
    fac_man_from: { type: String, default: "-" },
    fac_man_to: { type: String, default: "-" },
    total_man: { type: Number, default: 0 },
    //note credir 
    fact_nt_c_f: { type: String, default: "-" },
    fact_nt_c_to: { type: String, default: "-" },
    fact_nt_c: { type: Number, default: 0 },
    //Method
    total_on: { type: Number, default: 0 },
    cash_quetzales: { type: Number, default: 0 },
    cash_dolares: { type: Number, default: 0 },
    credomatic: { type: Number, default: 0 },
    visa: { type: Number, default: 0 },
    visaOnline: { type: Number }, default: 0,
    visaDolares: { type: Number, default: 0 },
    masterCard: { type: Number, default: 0 },
    credicuotas: { type: Number, default: 0 },
    visaCuotas: { type: Number, default: 0 },
    fact_send_CE_from: { type: String, default: "-" },
    fact_send_CE_to: { type: String, default: "-" },
    fact_send_CEV: { type: Number, default: 0 },
    note_credit: { type: Number, default: 0 },

    //tickets
    date_ticket_cash_quetzales: { type: Date, default: Date.now },
    ticket_quetzales: { type: Number, default: 0 },
    date_ticket_cash_dollars: { type: Date, default: Date.now },
    ticket_dollars: { type: Number, default: 0 },
    missing: { type: Number, default: 0 },
    box_square: { type: Number, default: 0 },
    diference: { type: Number, default: 0 },
    numb_send_cash_value: { type: Number, default: 0 },
    lifeMilesNum: { type: String, default: "-" },
    lifeMilesVa: { type: Number, default: 0 },
    extIva: { type: Number, default: 0 },
    loyalty: { type: Number, default: 0 },
    Authorized_Expenditure_v: { type: Number, default: 0 },
    retreats: { type: Number, default: 0 },
    cashBackVa: { type: Number, default: 0 },
    giftcard: { type: Number, default: 0 },
    obs_method: { type: String, default: "-" },
    store_creat: { type: String, default: "-" },
    fact: { type: String, default: "-" },
    date_created: { type: String, default: "" },
    date_update_conta: { type: Date },
    vendors: [
        {
            sale: { type: Number, default: 0 },
            name: { type: String, default: "" },
        }
    ],
    vendorsDescount: [
        {
            sale: { type: Number, default: 0 },
            name: { type: String, default: "" },
        }
    ],
});

fileSchema.virtual('uniqueId')
    .get(function () {
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('binnacle_sale_byte', fileSchema)