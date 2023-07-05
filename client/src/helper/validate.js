// validate login page username
import toast from "react-hot-toast";
import { authenticate } from "./helper";

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    //check for user exist
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("User does not exist");
    }
  }

  return errors;
}

// validate password
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

/** validate reset password */

export async function resetPasswordValidate(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_password) {
    errors.exist = toast.error("password don't match");
  }
  return errors;
}

// validate register function
export async function registerValidate(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
}

/** validate profile page */
export async function profileValidate(values) {
  const errors = emailVerify({}, values);
  return errors;
}

/***************************************************/

// validate Password
function passwordVerify(errors = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!values.password) {
    errors.password = toast.error("Password is required");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Wrong Password");
  } else if (values.password.length < 8) {
    errors.password = toast.error(
      "password must be more than 8 character long"
    );
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must include a special character");
  }
  return errors;
}

// validate user

function usernameVerify(errors = {}, values) {
  if (!values.username) {
    errors.username = toast.error("Username is required");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid username");
  }
  return errors;
}

/** validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}
