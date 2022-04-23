const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({
    no_cer: {type:Number},
    name_cer: {type: String},
    val_cer: {type: Number },
    date_start_cer: {type: Date, default: Date.now},
    date_end_cer: {type: Date },
    num_fact:{type: Number},
    val_fact:{type: Number},
    obs_cer: {type: String },
    meatpack: {type: String },
    sperry: {type: String },
    quiksilver: {type: String },
    guess: {type: String },
    colehaan: {type: String },
    diesel: {type: String },
    status: {type: String},
    store_change:{type:String},
    date_created: {type: Date, default: Date.now},
    date_end: {type: Date, default: Date.now}
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('giftcards',fileSchema)