import toast from "react-hot-toast";
import { authenticate } from "./helper";

//valid login page username
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    // check for user existance
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("User doesn't exist");
    }
  }

  return errors;
}
//password validate
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

//validate reset password
export async function resetPasswordValidate(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password dont match");
  }
  return errors;
}

export async function registerValidate(values) {
  const errors = usernameVerify({}, values);
  passwordVerify({}, values);
  emailVerify({}, values);

  return errors;
}
//validate profile page
export async function profileValidate(values) {
  const errors = emailVerify({}, values);

  return errors;
}

/******************************************************** */

//validate password
function passwordVerify(errors = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!values.password) {
    errors.password = toast.error("password is required");
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must include a special character");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Invalid password");
  } else if (values.password.length < 8) {
    errors.password = toast.error(
      "Password must be more than 8 character long"
    );
  }
  return errors;
}

// validate user
function usernameVerify(errors = {}, values) {
  if (!values.username) {
    errors.username = toast.error("username is required");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid username");
  }
  return errors;
}

function emailVerify(errors = {}, values) {
  let specialKey = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!values.email) {
    errors.email = toast.error("Email Required");
  } else if (values.email.includes(" ")) {
    errors.email = toast.error("Wrong Email");
  } else if (!specialKey.test(values.email)) {
    errors.email = toast.error("Invalid email address");
  }
  return errors;
}
