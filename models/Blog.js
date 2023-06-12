const mongoos=require("mongoose");
const {schema}=require("./secure/postValidation")

const blogSchema=new mongoos.Schema({
    title:{
        type:String,
        require:true,
        minlength:5,
        maxlength:100,
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
    thumbnail:{
        type:String,
        require:true,
        

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

blogSchema.index({title:"text"})

blogSchema.statics.postValidation=function (body) {
    console.log('schema blody: ',body)
    return schema.validate(body,{abortEarly:false})
}
module.exports=mongoos.model("Blog" , blogSchema)