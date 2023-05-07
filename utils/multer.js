const multer=require('multer');
const uuid=require('uuid').v4
exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/")
    },
    filename: function (req, file, cb) {
      cb(null, `${uuid()}_${file.originalname}`)
    }
  })
exports.fileFilter=(req,file,cb)=>{
    if(file.mimetype=="image/jpeg"){
        cb(null,true)
    }else{
        cb("Only jpeg files are accepted",false)
    }
}