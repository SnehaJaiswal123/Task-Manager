const Task=require('./task')
const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const secretkey="gfijfbgf488grfrbj"

const { default: isEmail } = require('validator/lib/isEmail')
const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    age:{
        type:Number,
        validate:{
            validator(val){
                if(val<10){
                    throw new Error("not eligible")
                }
            }
        }     
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator(val){
                if(!isEmail(val)){
                    throw new Error("Enter valid email")
                }
            }
        },
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},
{
    timestamps:true
})

userSchema.methods.genauthtoken=async function(){
    console.log("get auth called");
    const user1=this
    const token=jwt.sign({_id:user1._id.toString()},secretkey)
    console.log(token);
    user1.tokens=user1.tokens.concat({token})
    user1.save()
    return token;
}

userSchema.virtual('tasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON= function(){
    const userObject=this.toObject()

    delete userObject.password;
    delete userObject.tokens;
    return userObject
}


userSchema.statics.findByCredentials=async function(email,password){
        console.log("login credentials fun called");
        const gotuser=await user.findOne({email:email})
        if(!gotuser){
            throw new Error("Invalid Email")
        }
       const isMatch=await bcrypt.compare(password,gotuser.password)
       console.log(isMatch);
        if(!isMatch){
            throw new Error("Invalid Password")
        }
        return gotuser
}

userSchema.pre('save',async function(next){
    console.log("pre function called");
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
        console.log("password hashed");
        }
    next()
})

userSchema.pre('remove',async function(next){
    await Task.deleteMany({owner:this._id})
    next()
})
const user= mongoose.model('users',userSchema)



// const user1=new user({
//     name:"snehaa",
//     age:2
// })
// user1.save().then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log("My Error:",err);
// })

module.exports=user