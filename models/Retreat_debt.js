const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({

    name: {type:String},
    total_debt: {type: Number,default:0},
    date_created:{ type: Date, default: Date.now } ,
    update_created:{ type: Date, default: Date.now } ,
    status:{type:String, default:'Activo'},
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('retreat_debt',fileSchema)