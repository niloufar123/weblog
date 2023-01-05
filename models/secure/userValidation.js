const Yup = require("yup");

 

exports. schema = Yup.object().shape({
    name: Yup.string()
      .required("name is required")
      .min(3, "It should be 3 character")
      .max(255, "It should be 3 character"),
    email: Yup.string().email("email is required").required("email is required"),
    password: Yup.string()
      .min(3, "It should be 3 character")
      .max(255, "It should be 3 character")
      .required("password is required"),
      confirmPassword: Yup.string()
      .required("confirmPassword is required")
      .oneOf([Yup.ref("password"), null],"confirmPassword and password are not equal")
  });