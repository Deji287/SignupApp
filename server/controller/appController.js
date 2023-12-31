import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

import UserModel from "../model/user.model.js";
import ENV from "../config.js";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    const exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ msg: "User does not exist" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    //check for existing user
    const existingUsername = (req, res) => {
      UserModel.findOne({ username })
        .then((user) => {
          if (user) {
            return res
              .status(404)
              .send({ error: "Please use a unique username" });
          }
        })
        .catch((err) => {
          return res.status(401).send({ err });
        });
    };
    const existingEmail = (req, res) => {
      UserModel.findOne({ email })
        .then((em) => {
          if (em) {
            return res.status(404).send({ error: "Please use a unique email" });
          }
        })
        .catch((err) => {
          return res.status(402).send({ err });
        });
    };

    Promise.all([existingUsername, existingEmail])
      .then(() => {
        if (password) {
          bcrypt.hash(password, 10).then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
              profile: profile || "",
              email,
            });

            // return save result as a response
            user
              .save()
              .then((result) => {
                res.status(201).send({ msg: "User Registered Successfully" });
              })
              .catch((error) => res.status(500).send({ error }));
          });
        }
      })
      .catch((error) => {
        return res.status(501).send({ error: "Enable to hashed password" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordChecked) => {
            if (!passwordChecked)
              return res.status(400).send({ error: "Don't have Password" });

            //create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
              msg: "Login Successful",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(401).send({ error: "Invalid Username" });

    UserModel.findOne({ username })
      .then((user) => {
        if (!user) {
          return res.status(501).send({ error: "Couldn't find user" });
        }

        /** remove password from user */
        //mongoose return unnecessary data with object so convert it into json
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;

      //update the data

      UserModel.updateOne({ _id: userId }, body)
        .then((data) => {
          return res.status(201).send({ msg: "Record Updated" });
        })
        .catch((error) => {
          return res.status(401).send({ error });
        });
    } else {
      return res.status(401).send({ error: "User Not Found" });
    }
  } catch (error) {
    return res.status(401).status(401).send({ error });
  }
}

// /** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  console.log("hi");
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; //reset the OTP value
    req.app.locals.resetSession = true; // start the session for reset password
    return res.status(201).send({ msg: "Verified successfully" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
}

// // successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(404).send({ error: "session expired" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(404).send({ error: "Session expired" });

    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword }
              )
                .then((data) => {
                  req.app.locals.resetSession = false;
                  return res.status(201).send({ msg: "Record Updated" });
                })
                .catch((err) => {
                  res.status(401).send({ err });
                });
            })
            .catch((err) => {
              return res
                .status(500)
                .send({ error: "Enable to hashed password" });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not Found" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
