const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: {type:String , unique:true, lowercase: true, required: true},
    password: {type: String,required:true},
    name:{type: String, required:true},
    change_date:{type: String, required:true},
    status: {type:String,default: 'Active',required:true},
    store: {type:String,required:true},
    type:{type:String,default:'user'}

},{
    timestamps:true
});

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt)=> {
        if(err){
        next(err)
        }
        bcrypt.hash(user.password,salt,null,(err,hash)=> {
            if(err){
                next(err)
            }
            user.password = hash; 
            next();
        })
    })
});

userSchema.methods.comparisonPassword = function(password,cb){
    bcrypt.compare(password,this.password,(err, equal)=> {
        if(err){
            return cb(err);
        }

        cb(null, equal)
    })
}

module.exports = model('users',userSchema);