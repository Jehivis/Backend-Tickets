const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({

    name: {type:String},
    price: {type: Number,default:0},
    descount: {type: Number,default:0},
    price_f: {type: Number,default:0},
    upc: {type: String },
    alu: {type: String },
    size: {type: String },
    description: {type: String },
    filename: {type: String ,default:0},
    date_created:{ type: Date, default: Date.now } ,
    store:{type:String},
    sbs:{type:String},
    status:{type:String,default:'Pendiente'},
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('retreat',fileSchema)