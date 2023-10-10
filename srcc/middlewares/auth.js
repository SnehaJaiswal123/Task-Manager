const jwt=require('jsonwebtoken')
const User=require('../model/user')

const auth = async (req, res, next) => {
  try{
    const token= req.header('Authorization')
    const decode=jwt.verify(token,"gfijfbgf488grfrbj")
    // console.log(decode);
    const user=await User.findOne({_id:decode._id,"tokens.token":token})
    // console.log(user);
    if(!user){
        console.log("User authentication failed");
        return res.status(401).send("User authentication failed")     
    }
    req.user=user
    req.token=token
    next();
  }
  catch(e){
    console.log(e);
      res.status(500).send(e)
      
  }
}


module.exports=auth