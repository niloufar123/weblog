
exports.fileFilter=(req,file,cb)=>{
    if (file.mimetype == "image/jpeg") {
        cb(null, true);
    } else{
        cb("Only jpeg files are accepted",false)
    }
}