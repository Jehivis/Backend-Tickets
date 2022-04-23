const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({
    upc: { type: String },
    alu: { type: String },
    siz: { type: String ,default:0 },
    price: { type: String,default:0 },
    damage:{ type:String,default:0 },
    store_created: { type: String },
    image: { type: String },
    timestamp:{ type: Date, default: Date.now },
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('damaged_merchandise',fileSchema)