const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({
    name: {type:String},
    debt: {type: String,default:0},
    type:{type:String},
    date_created:{ type: Date, default: Date.now }
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('binnacle',fileSchema)