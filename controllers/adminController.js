const multer = require("multer");
const { fileFilter } = require('../utils/multer')
const Blog = require("../models/Blog");
const appRoot = require("app-root-path")
const shortId = require("shortid");
const fs = require('fs')

const sharp = require("sharp");
const RootPath = require("app-root-path");
const uuid = require("uuid").v4;





exports.Deletepost = async (req, res) => {
    try {

        const result = await Blog.findByIdAndRemove(req.params.id);//delete doen't show item deleted
        console.log(result)
        res.redirect("/dashboard")
    } catch (err) {
        res.render("errors/500s")
    }
}
exports.editPost = async (req, res) => {
    let errors = [];


    const thumbnail = req.files ? req.files.thumbnail : {}
    const fileName = `${shortId.generate()}_${thumbnail.name}`
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`



    const post = await Blog.findOne({ _id: req.params.id })
    const { title, status, body } = req.body;
    try {
        if (thumbnail.name) await Blog.postValidation({ ...req.body, thumbnail });
        else await Blog.postValidation({ ...req.body, thumbnail: { name: 'placeholder', size: 0, mimetype: 'image/jpeg' } });




        if (!post) {
            return res.redirect("errors/404")
        } else
            if (post.user.toString() != req.user._id) {
                console.log('posd11111', req.body)

                return res.redirect("/dashboard")

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
                post.thumbnail = thumbnail.name? fileName : post.thumbnail;
                await post.save();
                res.redirect("/dashboard")

            }

    } catch (err) {
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        })

        res.render("private/editPost", {
            pageTitle: "edit post",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: 'req.user.fullname',
            errors: errors,
            post

        })
    }
}

exports.createPost = async (req, res) => {
    let errors = [];
    const thumbnail = req.files ? req.files.thumbnail : {}
    const fileName = `${shortId.generate()}_${thumbnail.name}`
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`

    console.log(thumbnail)
    try {
        req.body = { ...req.body, thumbnail }
        await Blog.postValidation(req.body);
        await sharp(thumbnail.data)
            .jpeg({ quality: 60 })
            .toFile(uploadPath)
            .catch(err => console.log(err))

        await Blog.create({ ...req.body, user: req.user.id, thumbnail: fileName })

        console.log('post body', req.body)
        res.redirect("/dashboard")
    } catch (err) {
        console.log(err)
        // get500(req,res)
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        })

        res.render("private/addPost", {
            pageTitle: "add new post",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: 'req.user.fullname',
            errors: errors

        })
    }
}


exports.uploadImage = (req, res) => {
    // let fileName = `${uuid()}.jpg`;



    const upload = multer(
        {
            limits: { fileSize: 40000000000 },
            //  dest: 'uploads/',
            //  storage:storage,
            fileFilter: fileFilter
        }).single("image")

    upload(req, res, async (err) => {

        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .send("file value should be lower than 4MG")
            }
            res.status(400).send(err);
        } else {
            if (req.fileS) {
                const fileName = `${uuid()}_${req.files.image.name}`

                await sharp(req.files.image.data).jpeg({
                    quality: 60
                })
                    .toFile(`./public/uploads/${fileName}`)
                    .catch(err => console.log(err))

                res.status(200).send(`http://localhost:3000/uploads/${fileName}`)
            } else {

                res.send("please select an image")

            }
        }
    })
};