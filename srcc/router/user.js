const express=require('express');
const router=express.Router();
const User=require('../model/user')
const Task=require('../model/task')
const auth=require('../middlewares/auth')

router.get('/users',auth,async(req,res)=>{
    try{
        const allusers=await User.find()
        console.log("allusers");
        res.send(allusers)

        // user.find().then((result)=>{
        //     console.log(result);
        //     res.status(200).send(result)
        
        // }).catch((e)=>{
        //     console.log(e);
        //     res.status(500).send(e)
        // })
    }
    catch(e){
        res.status(500).send(e)
        console.log(e);
    }
})

router.get('/user/me',auth,async (req,res)=>{
    try{
        // const user1=await User.findById(req.params.id)
        // if(!user1){
        //     res.status(404).send("not found")
        //     return;
        // }
        console.log(req.user);
        await User.findByIdAndDelete(req.user._id)
        console.log(req.user);
        res.status(200).send(req.user)
    }
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/user',async(req,res)=>{   
    try{
       const myuser=await User(req.body)
       const token=await myuser.genauthtoken()
        res.status(201).send({user:myuser,token})

    } 
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }   
})



router.patch('/user/me',auth,async(req,res)=>{
    const allowedUpdates=["name","age","password","email"]
    const updates=Object.keys(req.body)
    const allowed=updates.every((updates)=>{
        return allowedUpdates.includes(updates)
    })
    if(!allowed){
        return res.status(400).send("Updates not allowed")
    }
    try{
        // const myuser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!myuser){
        //     console.log("user not found");
        //     return res.status(404).send("user not found")
        // }

        const updatedUser=await User.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true})
        res.send(updatedUser)
    }
    catch(e){
        res.status(400).send(e)
        console.log(e);
    }
})


router.delete('/user',auth,async(req,res)=>{
    try{
        await Task.deleteMany({owner:req.user._id})
        const myuser=await User.findByIdAndDelete(req.user._id)
        // await req.user.remove()
        if(!myuser){
           return res.status(404).send("user not found")

        }
        res.send(req.user)
    }
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})


router.post('/user/login',async(req,res)=>{
    try{
        const userli=await User.findByCredentials(req.body.email,req.body.password)
        const token=await userli.genauthtoken()
        res.status(200).send({userli,token})
    }
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return req.token!==token.token
        })
        await req.user.save();
          res.send(req.user)
         console.log(req.token);
    }
    catch(e){
        console.log(e);
        res.send(e)
    }
})

router.post('/user/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        req.user.save()
        res.send(req.user)
    }
    catch(e){
        console.log(e);
        res.send(e)
    }
})
module.exports=router;
