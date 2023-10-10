require('./srcc/db/mongoose')
const userrouter=require('./srcc/router/user')
const taskrouter=require('./srcc/router/task')

const express=require('express')
const app=express();

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

app.listen(2000,()=>{
    console.log("server is running");
})

// const task=require('../TaskApp/srcc/model/task')
// const user=require('../TaskApp/srcc/model/user')

// const main=async function(){
    // const mtask= await task.findById("64b70615113242f9077c33e8")
    // await mtask.populate('owner')
    // console.log(mtask.owner);

    // const muser= await user.findById("64b5b19d2466a7a1ddb0df23")
    // console.log(muser);
//     await muser.populate('tasks')
//     console.log(muser.tasks); 
// }

// main();






// task.findByIdAndDelete('6495fd2f89b63975587c9198')
// .then(()=>{
//     console.log("deleted");
// return task.countDocuments({completed:false})
//     // task.find({completed:true})
// }).then((counts)=>{
//     console.log(counts);
// }).catch((e)=>{
//     console.log(e);
// })

// const deltncount=async(id)=>{
//   await user.findByIdAndDelete(id)
//   return await user.count({age:22})
// }
// deltncount('649613c27366b908d01f9342').then((res)=>{
//       console.log(res);
// }).catch((e)=>{
//     console.log(e);
// })
    
