const Yup=require('yup');

exports.schema=Yup.object().shape({
    title:Yup.string()
    .required("Title is required")
    .min(5,"Title shouldn't be less than 5")
    .max(100,"Title shouldn't be more than 100"),
    body:Yup.string()
    .required("Your post should have body"),
    status:Yup.mixed().oneOf(["public","private"],"please pike up one of the statuses")

})