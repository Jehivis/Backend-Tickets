const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({

    upc: {type: String, default: null},
    alu: {type: String, default: null},
    siz: {type: String, default: null},

    upc1: {type: String, default: null},
    alu1: {type: String, default: null},
    siz1: {type: String, default: null},

    upc2: {type: String, default: null},
    alu2: {type: String, default: null},
    siz2: {type: String, default: null},

    upc3: {type: String, default: null},
    alu3: {type: String, default: null},
    siz3: {type: String, default: null},

    upc4: {type: String, default: null},
    alu4: {type: String, default: null},
    siz4: {type: String, default: null},

    upc5: {type: String, default: null},
    alu5: {type: String, default: null},
    siz5: {type: String, default: null},

    upc6: {type: String, default: null},
    alu6: {type: String, default: null},
    siz6: {type: String, default: null},

    upc7: {type: String, default: null},
    alu7: {type: String, default: null},
    siz7: {type: String, default: null},

    upc8: {type: String, default: null},
    alu8: {type: String, default: null},
    siz8: {type: String, default: null},

    upc9: {type: String, default: null},
    alu9: {type: String, default: null},
    siz9: {type: String, default: null},

    upc10: {type: String, default: null},
    alu10: {type: String, default: null},
    siz10: {type: String, default: null},

    upc11: {type: String, default: null},
    alu11: {type: String, default: null},
    siz11: {type: String, default: null},

    upc12: {type: String, default: null},
    alu12: {type: String, default: null},
    siz12: {type: String, default: null},

    upc13: {type: String, default: null},
    alu13: {type: String, default: null},
    siz13: {type: String, default: null},

    upc14: {type: String, default: null},
    alu14: {type: String, default: null},
    siz14: {type: String, default: null},

    upc15: {type: String, default: null},
    alu15: {type: String, default: null},
    siz15: {type: String, default: null},

    upc16: {type: String, default: null},
    alu16: {type: String, default: null},
    siz16: {type: String, default: null},

    upc17: {type: String, default: null},
    alu17: {type: String, default: null},
    siz17: {type: String, default: null},

    upc18: {type: String, default: null},
    alu18: {type: String, default: null},
    siz18: {type: String, default: null},

    upc19: {type: String, default: null},
    alu19: {type: String, default: null},
    siz19: {type: String, default: null},

    upc20: {type: String, default: null},
    alu20: {type: String, default: null},
    siz20: {type: String, default: null},

    upc21: {type: String, default: null},
    alu21: {type: String, default: null},
    siz21: {type: String, default: null},

    upc22: {type: String, default: null},
    alu22: {type: String, default: null},
    siz22: {type: String, default: null},

    upc23: {type: String, default: null},
    alu23: {type: String, default: null},
    siz23: {type: String, default: null},

    upc24: {type: String, default: null},
    alu24: {type: String, default: null},
    siz24: {type: String, default: null},

    upc25: {type: String, default: null},
    alu25: {type: String, default: null},
    siz25: {type: String, default: null},

    upc26: {type: String, default: null},
    alu26: {type: String, default: null},
    siz26: {type: String, default: null},

    upc27: {type: String, default: null},
    alu27: {type: String, default: null},
    siz27: {type: String, default: null},

    upc28: {type: String, default: null},
    alu28: {type: String, default: null},
    siz28: {type: String, default: null},

    upc29: {type: String, default: null},
    alu29: {type: String, default: null},
    siz29: {type: String, default: null},

    upc30: {type: String, default: null},
    alu30: {type: String, default: null},
    siz30: {type: String, default: null},

    upc31: {type: String, default: null},
    alu31: {type: String, default: null},
    siz31: {type: String, default: null},

    upc32: {type: String, default: null},
    alu32: {type: String, default: null},
    siz32: {type: String, default: null},

    upc33: {type: String, default: null},
    alu33: {type: String, default: null},
    siz33: {type: String, default: null},

    upc34: {type: String, default: null},
    alu34: {type: String, default: null},
    siz34: {type: String, default: null},

    upc35: {type: String, default: null},
    alu35: {type: String, default: null},
    siz35: {type: String, default: null},

    upc36: {type: String, default: null},
    alu36: {type: String, default: null},
    siz36: {type: String, default: null},

    upc37: {type: String, default: null},
    alu37: {type: String, default: null},
    siz37: {type: String, default: null},

    upc38: {type: String, default: null},
    alu38: {type: String, default: null},
    siz38: {type: String, default: null},

    upc39: {type: String, default: null},
    alu39: {type: String, default: null},
    siz39: {type: String, default: null},

    upc40: {type: String, default: null},
    alu40: {type: String, default: null},
    siz40: {type: String, default: null},

    upc41: {type: String, default: null},
    alu41: {type: String, default: null},
    siz41: {type: String, default: null},

    upc42: {type: String, default: null},
    alu42: {type: String, default: null},
    siz42: {type: String, default: null},

    upc43: {type: String, default: null},
    alu43: {type: String, default: null},
    siz43: {type: String, default: null},

    upc44: {type: String, default: null},
    alu44: {type: String, default: null},
    siz44: {type: String, default: null},

    upc45: {type: String, default: null},
    alu45: {type: String, default: null},
    siz45: {type: String, default: null},
    
    upc46: {type: String, default: null},
    alu46: {type: String, default: null},
    siz46: {type: String, default: null},

    upc47: {type: String, default: null},
    alu47: {type: String, default: null},
    siz47: {type: String, default: null},

    upc48: {type: String, default: null},
    alu48: {type: String, default: null},
    siz48: {type: String, default: null},

    upc49: {type: String, default: null},
    alu49: {type: String, default: null},
    siz49: {type: String, default: null},

    upc50: {type: String, default: null},
    alu50: {type: String, default: null},
    siz50: {type: String, default: null},
    fact: {type:String},
    fact_img:{type:String},
    desc:{type:String,default:0},
    store_asigned:{type:String,default:0},
    status: {type: String, default: null},
    store_created: {type: String, default: null},
    email_asigned: {type: String, default: null},
    timestamp:{ type: Date, default: Date.now },
    timestampend:{ type: Date } 

});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('ticket_inmediates',fileSchema)