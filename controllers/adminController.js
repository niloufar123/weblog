const multer = require("multer");
const { fileFilter } = require('../utils/multer')
const Blog = require("../models/Blog");
const appRoot = require("app-root-path")
const shortId = require("shortid");
const fs = require('fs')

const sharp = require("sharp");
const RootPath = require("app-root-path");
const { error } = require("console");





exports.Deletepost = async (req, res,next) => {
    try {

         const post=await Blog.findByIdAndRemove(req.params.id);//delete doen't show item deleted
        const filePath=`${appRoot}/public/uploads/thumbnails/${post.thumbnail}`
        
        fs.unlink(filePath, async (err) => {
            if (err){
                const error = new Error({ message: "There is an error in the cleanup" })
                error.statusCode = 400;
                throw error
                }
            else{

                res.status(200).json({message:"post is deleted successfuly"})
            }
           
        })
    } catch (err) {
        next(err)
    }
}
exports.editPost = async (req, res, next) => {

    const thumbnail = req.files ? req.files.thumbnail : {}
    const fileName = `${shortId.generate()}_${thumbnail.name}`
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`



    const post = await Blog.findOne({ _id: req.params.id })

    try {
        if (thumbnail.name) await Blog.postValidation({ ...req.body, thumbnail });
        else await Blog.postValidation({ ...req.body, thumbnail: { name: 'placeholder', size: 0, mimetype: 'image/jpeg' } });




        if (!post) {

            const error = new Error({ message: "this post doesn't exist" })
            error.statusCode = 404;
            throw error
        } else
            if (post.user.toString() != req.userId) {
                const error = new Error({ message: "You do not have permission to edit the post" })
                error.statusCode = 401;
                throw error

            }
            else {
                if (thumbnail.name) {
                    fs.unlink(`${RootPath}/public/uploads/thumbnails/${post.thumbnail}`, async (err) => {
                        if (err) console.log(err)
                        else {
                            await sharp(thumbnail.data)
                                .jpeg({ quality: 60 })
                                .toFile(uploadPath)
                                .catch(err => console.log(err))
                        }
                    })
                }




                const { title, status, body } = req.body;
                post.title = title;
                post.body = body;
                post.status = status;
                post.thumbnail = thumbnail.name ? fileName : post.thumbnail;
                await post.save();
                res.status(200).json({message:"your post is edited"})

            }

    } catch (err) {
        next(err)
    }
}

exports.createPost = async (req, res, next) => {

    const thumbnail = req.files ? req.files.thumbnail : {}
    const fileName = `${shortId.generate()}_${thumbnail.name}`
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`

    try {
        req.body = { ...req.body, thumbnail }
        await Blog.postValidation(req.body);
        await sharp(thumbnail.data)
            .jpeg({ quality: 60 })
            .toFile(uploadPath)
            .catch(err => console.log(err))
        await Blog.create({ ...req.body, user: req.userId, thumbnail: fileName })
        res.status(200).json({ message: "new post is created" })

    } catch (err) {
        next(err)
    }
}


exports.uploadImage = (req, res) => {
    

    const upload = multer(
        {
            limits: { fileSize: 40000000000 },
            fileFilter: fileFilter
        }).single("image")

    upload(req, res, async (err) => {

        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res
                    .status(422)
                    .json({error:"file value should be lower than 4MG"})
            }
            console.log('err',err)
            res.status(400).json({error:err});
        } else {
            if (req.files) {
                const fileName = `${shortId.generate()}_${req.files.image.name}`

                await sharp(req.files.image.data).jpeg({
                    quality: 60
                })
                    .toFile(`./public/uploads/${fileName}`)
                    .catch(err => console.log(err))

                res.status(200).json({message:`http://localhost:3000/uploads/${fileName}`})
            } else {

                res.status(400).json({error:"please select an image"})

            }
        }
    })
};


exports.handleDashSearch = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 2;

    console.log('page===>', req.body)

    try {
        const numberOfPosts = await Blog.find({ user: req.user._id, $text: { $search: req.body.search } }).countDocuments();
        const blogs = await Blog.find({ user: req.user.id, $text: { $search: req.body.search } })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage)
        res.render("private/blogs", {
            pageTitle: "admin ~ dashboard",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,


            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),

        })
    } catch (error) {
        console.log(error)
        get500(req, res)
    }


}