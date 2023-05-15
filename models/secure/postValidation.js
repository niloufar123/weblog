const Yup=require('yup');

exports.schema=Yup.object().shape({
    title:Yup.string()
    .required("Title is required")
    .min(5,"Title shouldn't be less than 5")
    .max(100,"Title shouldn't be more than 100"),
    body:Yup.string()
    .required("Your post should have body"),
    status:Yup.mixed().oneOf(["public","private"],"please pike up one of the statuses"),
    thumbnail:Yup.object().shape({
        name:Yup.string().required("thumbnail is required"),
        size:Yup.number().max(3000000,"image shouldn't be more than 3 MG"),
        mimetype:Yup.mixed().oneOf(["image/jpeg","image/png"],
        "Only png and jpeg extensions are supported")
    })

})


