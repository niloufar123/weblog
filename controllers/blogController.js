const Blog = require("../models/Blog");
const { formatDate } = require('../utils/formatDate');
const { trunCate } = require('../utils/helpers')


exports.getIndex = async (req, res) => {
    try {
        const posts = await Blog.find({ status: "public" }).sort({ createdAt: "desc" });

        res.render("blog", {
            pageTitle: " weblog",
            path: "/",
            posts,
            formatDate,
            trunCate
        })
    } catch (err) {
        console.log(err)
        res.render("errors/500");
    }
}

exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate("user")

        if (!post) return res.redirect("errors/404")
        
            res.render("private/post", {
                pageTitle: post.title,
                path: "/dashboard/post",
              
                post,
                formatDate,
                

            })
        
    } catch (err) {
        console.log(err)
        res.render("errors/500");
    }

}