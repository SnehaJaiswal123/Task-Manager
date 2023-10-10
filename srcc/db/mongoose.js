const mongoose=require('mongoose');
let url='mongodb+srv://Snehajais:QDCP23mBsgYEzvvF@cluster0.lctmupe.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url)   
.then((db)=>{
    console.log("db connected");
})
.catch((err)=>{
    console.log(err)
})
// C:\Users\sneha\OneDrive\Desktop\node2\db



module.exports=mongoose;