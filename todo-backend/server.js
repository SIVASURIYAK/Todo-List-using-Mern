//Using Express
const express = require('express');
    const mongoose = require('mongoose');
    const cors=require('cors');

//Create an instance of Express 
const app = express();
app.use(express.json());
app.use(cors());


/*Define a route 
app.get('/',(req,res) =>{
    res.send("Hello World!")
})*/


//Sample in memory storage for todo items 
//let todos=[];

//Connecting mongoDB 
mongoose .connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB connected!');
})
.catch((err)=>{
    console.log('error');
})
//creating schema
const todoSchema=new mongoose.Schema({
    title: {
        required: true,
        type: String 
    },
    description:String 
})
//Creating model
const todoModel=mongoose.model('Todo',todoSchema);
//Create a new route for Todo item
app.post('/todos',async (req, res) => {
    // Log incoming request body
    console.log("Request body:", req.body);

    const { title, description } = req.body;
    /*const newTodo = {
       id: todos.length + 1,
        title,
        description
    };
    todos.push(newTodo);

    // Log updated todos array
    console.log("Updated todos array:", todos);*/
    try{
        const newTodo=new todoModel({title,description})
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error)
    {
        console.log(error)
        res.status(500).json({message: error.message});
    }
    
   
});
//Get all items
app.get('/todos',async (req,res)=>{
    try{
       const todos=await todoModel.find();
       res.json(todos);
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message: error.message});
        }
    
})
//update todo item 
app.put("/todos/:id",async (req,res)=>{
    try{
    const { title, description } = req.body;
    const id=req.params.id;
   const updatedTodo=await todoModel.findByIdAndUpdate(
        id,
    {title,description} ,
    {new: true}
   )
   if(!updatedTodo)
   {
    return res.status(404).json({message:"Todonot found"})
   }
   res.json(updatedTodo)
}catch(error)
{
    console.log(error)
    res.status(500).json({message: error.message});

}
})
//Delete a todo item
app.delete("/todos/:id",async (req, res) =>{
    try{
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();

}
catch(error)
{
    console.log(error)
    res.status(500).json({message: error.message});

}
})

//Start as server 
const port =process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("Server is listening to port "+port);
})
