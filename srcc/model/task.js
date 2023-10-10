const mongoose=require('../db/mongoose');

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
        // validate:{
        //     validator(val){
        //         val= val.trim();
        //     }
        // }
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    }
},
{
    timestamps:true
})

const task= mongoose.model('tasks',taskSchema)


// const task1=new user({
//     description:"   Maintain Attendance    ",
//     // completed:false
// })
// task1.save().then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log("My Error:",err);
// })

module.exports=task;