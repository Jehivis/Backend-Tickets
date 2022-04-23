const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({

    daily_goal: {type: String,default:0},
    year_before_sale:{type:String},
    hamachi:{type:String},
    tras:{type:String},
    process_in:{type:String},
    process_out:{type:String},
    send_received:{type:String},
    vendor_number:{type:Number},
    store_created:{type:String},
    date_created:{ type: Date}
    
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('binnacle_dailies',fileSchema)