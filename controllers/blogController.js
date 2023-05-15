const Blog = require("../models/Blog");
const { formatDate } = require('../utils/formatDate');
const { trunCate } = require('../utils/helpers')


exports.getIndex = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 5;
    try {
        const numberOfPosts = await Blog.find({ status: "public" }).countDocuments();

        const posts = await Blog.find({ status: "public" })
            .sort({ createdAt: "desc" })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage);

        res.render("blog", {
            pageTitle: " weblog",
            path: "/",
            posts,
            formatDate,
            trunCate,

            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
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