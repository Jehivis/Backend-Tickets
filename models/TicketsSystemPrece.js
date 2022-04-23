'use strict'

const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({

    upc: {type: String },
    alu: {type: String },
    size: {type: String },
    bill: {type: String },
    idTicket: {type: Schema.ObjectId, ref:'ticket_tras_system'},
    timestamp:{ type: Date, default: Date.now },
    timestampend:{ type: Date }

});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('ticket_tras_system_prece',fileSchema)