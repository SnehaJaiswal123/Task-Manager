const express=require('express');
const router=express.Router();
const Task=require('../model/task')
const auth=require('../middlewares/auth');
// const { findById } = require('../model/user');

router.post('/task',auth,async(req,res)=>{
    const newtask=new Task({
        ...req.body,
        owner:req.user._id
    })
    await newtask.save()
    res.send(newtask)
    // await newtask.populate('owner').execPopulate()
    // console.log(newtask.owner)
    // res.send(newtask,newtask.owner)
    // .then((result)=>{
    //     console.log("task created");
    //     res.status(201).send(newtask)
    // }).catch((e)=>{
    //     console.log(e);
    //     res.send(e)
    // })      
})


router.get('/mytask',auth,async(req,res)=>{
    const match={}
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    try{
        await req.user.populate({
            path:'tasks',
            // match,
            // this.options
        })
        console.log("success");
        console.log(req.user.tasks);
        res.send(req.user.tasks)
    //   const result=await Task.find()
    //         if(!result){
    //             res.status(404).send("not found")        
    //         }
    //         res.status(200).send(result)
    }
    catch(e){
        console.log("error");
        console.log(e);
        res.status(500).send(e)
    }
     
})

router.get('/task/:id',auth,async(req,res)=>{
    // const id=req.params.id
    try{
        console.log("task");
        const task=await Task.find({_id:req.params.id,owner:req.user._id})
        if(!task){
           return res.status(404).send("no task found")
        }
        res.send(task)

    //    const result= await task.findById(req.params.id)
    //     if(!result){
    //         res.status(404).send("not found")
    //         return;
    //     }
    //     res.send(result)
    }
    catch(e){
        console.log("error");
        console.log(e);
        res.status(400).send(e)
    }
})

router.patch('/task/:id',auth,async(req,res)=>{
    const allowedUpdates=["description","completed"]
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

        const taskToUpdate=await Task.find({_id:req.params.id,owner:req.user._id})
        if(!taskToUpdate){
            return res.send("cannot found task")
        }
        const taskToUpdate1=taskToUpdate[0]
        updates.forEach((update)=>{
            taskToUpdate1[update]=req.body[update]
        })
        await taskToUpdate1.save();
        res.send(taskToUpdate1)
        console.log(taskToUpdate1);
    }
    catch(e){
        res.status(400).send(e)
        console.log(e);
    }
})

router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const mytask=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        console.log(mytask);
        if(!mytask){
           return res.status(404).send("task not found")
        }
        res.send({message:"deleted","task":mytask})
    }
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports=router;