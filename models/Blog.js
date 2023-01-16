const mongoos=require("mongoose");

const blogSchema=new mongoos.Schema({
    title:{
        type:String,
        require:true,
        minlength:4,
        maxlength:255,
        trim:true
    },
    body:{
        type:String,
        require:true        
    },
    status:{
        type:String,
        default:"public",
        enum:["public","private"]
    },
    user:{
        type:mongoos.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoos.model("Blog" , blogSchema)