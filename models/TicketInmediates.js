'use strict'

const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({

    product: [
        {
            upc: {type: String },
            alu: {type: String },
            siz: {type: String },
        }
    ],

    upc: {type: String },
    alu: {type: String },
    siz: {type: String },

    upc1: {type: String },
    alu1: {type: String },
    siz1: {type: String },

    upc2: {type: String },
    alu2: {type: String },
    siz2: {type: String },

    upc3: {type: String },
    alu3: {type: String },
    siz3: {type: String },

    upc4: {type: String },
    alu4: {type: String },
    siz4: {type: String },

    upc5: {type: String },
    alu5: {type: String },
    siz5: {type: String },

    upc6: {type: String },
    alu6: {type: String },
    siz6: {type: String },

    upc7: {type: String },
    alu7: {type: String },
    siz7: {type: String },

    upc8: {type: String },
    alu8: {type: String },
    siz8: {type: String },

    upc9: {type: String },
    alu9: {type: String },
    siz9: {type: String },

    upc10: {type: String },
    alu10: {type: String },
    siz10: {type: String },

    upc11: {type: String },
    alu11: {type: String },
    siz11: {type: String },

    upc12: {type: String },
    alu12: {type: String },
    siz12: {type: String },

    upc13: {type: String },
    alu13: {type: String },
    siz13: {type: String },

    upc14: {type: String },
    alu14: {type: String },
    siz14: {type: String },

    upc15: {type: String },
    alu15: {type: String },
    siz15: {type: String },

    upc16: {type: String },
    alu16: {type: String },
    siz16: {type: String },

    upc17: {type: String },
    alu17: {type: String },
    siz17: {type: String },

    upc18: {type: String },
    alu18: {type: String },
    siz18: {type: String },

    upc19: {type: String },
    alu19: {type: String },
    siz19: {type: String },

    upc20: {type: String },
    alu20: {type: String },
    siz20: {type: String },

    upc21: {type: String },
    alu21: {type: String },
    siz21: {type: String },

    upc22: {type: String },
    alu22: {type: String },
    siz22: {type: String },

    upc23: {type: String },
    alu23: {type: String },
    siz23: {type: String },

    upc24: {type: String },
    alu24: {type: String },
    siz24: {type: String },

    upc25: {type: String },
    alu25: {type: String },
    siz25: {type: String },

    upc26: {type: String },
    alu26: {type: String },
    siz26: {type: String },

    upc27: {type: String },
    alu27: {type: String },
    siz27: {type: String },

    upc28: {type: String },
    alu28: {type: String },
    siz28: {type: String },

    upc29: {type: String },
    alu29: {type: String },
    siz29: {type: String },

    upc30: {type: String },
    alu30: {type: String },
    siz30: {type: String },

    upc31: {type: String },
    alu31: {type: String },
    siz31: {type: String },

    upc32: {type: String },
    alu32: {type: String },
    siz32: {type: String },

    upc33: {type: String },
    alu33: {type: String },
    siz33: {type: String },

    upc34: {type: String },
    alu34: {type: String },
    siz34: {type: String },

    upc35: {type: String },
    alu35: {type: String },
    siz35: {type: String },

    upc36: {type: String },
    alu36: {type: String },
    siz36: {type: String },

    upc37: {type: String },
    alu37: {type: String },
    siz37: {type: String },

    upc38: {type: String },
    alu38: {type: String },
    siz38: {type: String },

    upc39: {type: String },
    alu39: {type: String },
    siz39: {type: String },

    upc40: {type: String },
    alu40: {type: String },
    siz40: {type: String },

    upc41: {type: String },
    alu41: {type: String },
    siz41: {type: String },

    upc42: {type: String },
    alu42: {type: String },
    siz42: {type: String },

    upc43: {type: String },
    alu43: {type: String },
    siz43: {type: String },

    upc44: {type: String },
    alu44: {type: String },
    siz44: {type: String },

    upc45: {type: String },
    alu45: {type: String },
    siz45: {type: String },

    upc46: {type: String },
    alu46: {type: String },
    siz46: {type: String },

    upc47: {type: String },
    alu47: {type: String },
    siz47: {type: String },

    upc48: {type: String },
    alu48: {type: String },
    siz48: {type: String },

    upc49: {type: String },
    alu49: {type: String },
    siz49: {type: String },

    upc50: {type: String },
    alu50: {type: String },
    siz50: {type: String },

    fact: {type:String},
    fact_img:{type:String},
    desc:{type:String,default:0},
    store_asigned:{type:String,default:0},
    status: {type: String},
    store_created: {type: String },
    email_asigned: {type: String },
    timestamp:{ type: Date },
    timestampend:{ type: Date }

});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('ticket_inmediate',fileSchema)