const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sendMail = require('../helpers/sendMail')
const rendomString = require('randomstring');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send({
                success: false,
                msg: 'Please Enter Email or Password !'
            })
        }
        else {
            let findUserQuery = "SELECT * FROM tbl_admin WHERE email = ?";
            await con.query(findUserQuery, [email], (err, data) => {
                if (err) {
                    res.json(err);
                }
                // User found
                if (data.length <= 0) {
                    return res.status(400).send({ success: false, message: "Email does not Exist !" });
                }
                else {
                    bcrypt.compare(password, data[0].password, (err, password) => {
                        if (err) throw err;
                        if (password) {
                            res.status(200).send({
                                success: true,
                                msg: "Admin Login Sucessfully !",
                                data: data[0]
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                pmessage: "Password Incorrect !"
                            })
                        }
                    });
                }
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

/* const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { email } = req.body;
        let sql = "SELECT * FROM tbl_admin WHERE email=?";
        await con.query(sql, [email], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Email doesn't exist !"
                })
            }
            else {
                Email = data[0].email;
                mailSubject = "Forgot Password";
                const randomToken = rendomString.generate();
                content = `<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:29px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:19px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <h3 style="text-align: left;">Hi, ${data[0].first_name}</h3>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    We cannot simply send you your old password. A unique link to reset your
                                                    password has been generated for you. To reset your password, click the
                                                    following link and follow the instructions.
                                                </p>
                                                <a href="https://suppr.me/app/reset-password?token='${randomToken}'"
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                    Password</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                             <td><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">If you did not forgot your password, please ignore this email and have a lovely day.</p></td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                             <td style="padding:0 35px;"> <p style="color:#455056; font-size:13px;line-height:22px; margin:0;">If the above button doesn't work, you can reset your password by clicking the following link, <a href="http://localhost:3001/reset-password?token='${randomToken}'">Reset Password</a></p> 
                                             </td>
                                        </tr>
                                        <tr>
                                            <td style="height:80px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>FoodApp</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>`
                //content = 'Hi ' + data[0].first_name + ', <p> Please click the below button to reset your password. </p> <p> <span style="background: #6495ED; padding: 5px;"> <a style="color: white; text-decoration: none;  font-weight: 600;" href="http://localhost:3001/reset-password?token=' + randomToken + '">Click Here </a> </span> </p>';
                sendMail(Email, mailSubject, content);
                token = randomToken;
                let delTokenQuery = "DELETE FROM resetpassword_token WHERE email = ?";
                con.query(delTokenQuery, [data[0].email], (err, data1) => {
                    if (err) throw err;
                });
                con.query(`insert into resetpassword_token (token, email) values('${token}','${Email}')`, (err, presult) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Check your email a password reset email was sent.",
                        token: token
                    })
                })
            }
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        })
    }
}
 */

/* const ResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { newPassword, confirmPassword } = req.body;
        let password = await hashPassword(newPassword);
        let sql = "Select * from resetpassword_token where token= ?";
        await con.query(sql, [req.query.token], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "This link has been expired !"
                })
            }
            else {
                let sql = "Select * from tbl_admin where email=?";
                con.query(sql, [data[0].email], (err, newdata) => {
                    if (err) throw err;
                    if (newdata.length >= 1) {
                        if (newPassword != confirmPassword) {
                            res.status(400).send({
                                success: false,
                                msg: "new password and confirm password do not match !"
                            })
                        }
                        else {
                            let delTokenQuery = "DELETE FROM resetpassword_token WHERE email = ?";
                            con.query(delTokenQuery, [newdata[0].email], (err, data1) => {
                                if (err) throw err;
                            });
                            let updateQuery = "UPDATE tbl_admin SET password = ? WHERE email = ?";
                            con.query(updateQuery, [password, newdata[0].email], (err, data1) => {
                                if (err) throw err;
                                if (data1.affectedRows < 1) {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Password Not Reset !"
                                    })
                                }
                                else {
                                    res.status(200).send({
                                        success: true,
                                        msg: "Password Reset Successfully  !"
                                    })
                                }
                            });
                        }
                    }
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
} */

function formatTimestamptoDatabaseFormat(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to check for and remove expired OTPs after 1 minute
function checkandRemoveExpiredOTPs() {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 30);

    const formattedOneMinuteAgo = formatTimestamptoDatabaseFormat(oneMinuteAgo);
    const deleteExpiredQuery = 'DELETE FROM tbl_otps WHERE created_at < ?';
    con.query(deleteExpiredQuery, [formattedOneMinuteAgo], (err, result) => {
        if (err) throw err;
    });
}

setInterval(checkandRemoveExpiredOTPs, 60000);

const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { email } = req.body;
        function generateOTP() {
            return Math.floor(1000 + Math.random() * 9000);
        }
        const otp = generateOTP();
        const sqlQuery = `select * from tbl_admin where email=?`;
        await con.query(sqlQuery, [email], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                // console.log(data);
                //const otp = Math.floor(Math.random() * 9) + 1; // Generate a random number between 1 and 9
                Email = data[0].email;
                mailSubject = 'OTP Verification';
                content = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Forgot Password - Reset Your Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            width: 60%;
                            margin: 0 auto;
                            overflow: hidden;
                        }
                        .message {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                        }
                        .otp-box {
                            background-color: #f3fcfd;
                            text-align: center;
                            padding: 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        
                        .otp-code {
                            font-size: 36px;
                            font-weight: bold;
                            color: #333;
                        }
                        header {
                            background: #ffffff;
                            color: #000000;
                        }
                        header::after {
                            content: '';
                            display: table;
                            clear: both;
                        }
                        section {
                            float: left;
                            width: 70%;
                            margin-top: 20px;
                            padding: 20px;
                            background: #ffffff;
                            border-radius: 5px;
                        }
                        section h2 {
                            color: #333;
                        }
                        .footer {
                            float: left;
                            width: 100%;
                            padding: 10px 0;
                            background: #ffffff;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <section>
                            <h2>Dear ${data[0].first_name},</h2>
                            <p>We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
                           <!-- <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</p> -->
                            <div class="otp-box">
                            <div class="otp-code">${otp}</div>
                            </div>
                            <p class="message">This OTP will expire in 30 minutes.</p>
                            <p>If you didn't request a password reset, you can ignore this email.</p>
                            <p>Thank you!</p>
                            <div class="footer">&copy; 2023 FoodApp. All rights reserved. </div>
                        </section>
                    </div>
                </body>
                </html>`;
                sendMail(Email, mailSubject, content);

                let delTokenQuery = "DELETE FROM tbl_otps WHERE email = ?";
                con.query(delTokenQuery, [data[0].email], (err, data1) => {
                    if (err) throw err;
                });

                const sql = 'INSERT INTO tbl_otps (email, otp) VALUES (?, ?)';
                con.query(sql, [email, otp], (err, result) => {
                    if (err) {
                        // console.error(err);
                        res.status(400).json({
                            success: false,
                            message: 'Failed to store OTP'
                        });
                    } else {
                        // console.log('OTP stored in the database');
                        res.status(200).json({
                            success: true,
                            message: 'Your OTP send to the email'
                        });
                    }
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: 'Email address is invalid !'
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const VerifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const otpCheckQuery = 'SELECT * FROM tbl_otps WHERE otp = ?';
        await con.query(otpCheckQuery, [otp], (err, results) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: 'Failed to verify OTP'
                });
            } else if (results.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid OTP'
                });
            }
            else {
                const selectQuery = `select * from tbl_admin where email=?`;
                con.query(selectQuery, [results[0].email], (err, data) => {
                    if (err) throw err;
                    res.status(200).json({
                        success: true,
                        message: 'Verify OTP Successfully',
                        user_id: data[0].id
                    });
                })

            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const ResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { newPassword, confirmPassword } = req.body;
        const { id } = req.query;
        if (newPassword != confirmPassword) {
            res.status(400).send({
                success: false,
                msg: "new password and confirm password do not match !"
            })
        }
        else {
            const sqlQuery = `select * from tbl_admin where id=?`;
            await con.query(sqlQuery, [id], (err, result) => {
                if (err) throw err;
                bcrypt.hash(newPassword, 10, (err, password) => {
                    if (err) throw err;
                    const updateQuery = `update tbl_admin set password =? where id=?`;
                    con.query(updateQuery, [password, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            let delTokenQuery = "DELETE FROM tbl_otps WHERE email = ?";
                            con.query(delTokenQuery, [result[0].email], (err, data1) => {
                                if (err) throw err;
                            });

                            res.status(200).send({
                                success: true,
                                message: 'Password reset successfully !'
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: 'Failed to update password !'
                            })
                        }
                    })
                });
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const AdminChangePassword = async (req, res) => {
    var { id, oldpassword, newpassword, confirmpassword } = req.body;
    try {
        if (!id) {
            res.status(400).send({
                success: false,
                msg: "Plesae Provide id !"
            })
        }
        else if (!oldpassword) {
            res.status(400).send({
                success: false,
                message: "Please enter your old password !"
            })
        }
        else if (!newpassword) {
            res.status(400).send({
                success: false,
                errmsg: "Password must be greater than 6 and contains at least one uppercase letter, one lowercase letter, and one number, and one special character !"
            })
        }
        else {
            var encrypassword = await hashPassword(newpassword);
            let sql = "Select password from tbl_admin where id= ?";
            await con.query(sql, [id], (err, data) => {
                if (err) throw err;
                bcrypt.compare(oldpassword, data[0].password, (err, password) => {
                    if (err) throw err;
                    console.log(password);
                    if (password) {
                        if (newpassword !== confirmpassword) {
                            res.status(400).send({
                                success: false,
                                msg: "New Password and Confirm Password doesn't match !"
                            })
                        }
                        else {
                            let updateQuery = "UPDATE tbl_admin SET password = ? WHERE id = ?";
                            con.query(updateQuery, [encrypassword, id], (err, data1) => {
                                if (err) throw err;
                                if (data1.affectedRows < 1) {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Password Not Changed !"
                                    })
                                }
                                else {
                                    res.status(200).send({
                                        success: true,
                                        msg: "Password has been successfully changed !"
                                    })
                                }
                            });
                        }
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            msg: "Old password Incorrect !"
                        })
                    }
                });
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const GetProfile = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).send({
                success: false,
                msg: 'provide id !'
            })
        }
        else {
            let sql = "select * from tbl_admin where id=?";
            await con.query(sql, [id], (err, data) => {
                if (err) throw err;
                if (data.length < 1) {
                    res.status(400).send({
                        success: false,
                        msg: "Admin not Exist !"
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        data: data[0]
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const UpdateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { id } = req.body;
        var { firstname, lastname, email } = req.body;
        if (req.file == undefined) {
            let sql = "Update tbl_admin set first_name=?, last_name=?, email=? where id=?"
            await con.query(sql, [firstname, lastname, email, id], (err, data) => {
                if (err) throw err;
                if (data.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        msg: "Details not updated !"
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        msg: "Update details successfully"
                    })
                }
            })
        }
        else {
            let sql = "Update tbl_admin set first_name=?, last_name=?, email=?, profile=? where id=?"
            await con.query(sql, [firstname, lastname, email, req.file.filename, id], (err, data) => {
                if (err) throw err;
                if (data.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        msg: "Details not updated !"
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        msg: "Update details successfully"
                    })
                }
            })
        }

    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        })
    }
}

const VisitorList = async (req, res) => {
    try {
        /* var sql = `SELECT *, DATE_FORMAT(created_at, '%d %M %Y') as join_date FROM tbl_visitors AS a WHERE a.id NOT IN (SELECT visitor_id FROM tbl_hosts)  AND a.is_deleted = 0 
        ORDER BY a.created_at DESC`;
        await con.query(sql, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "visitor not found"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
        }) */
        // Get the visitor list
        const visitorListQuery = `SELECT *, DATE_FORMAT(created_at, '%d %M %Y') as join_date FROM tbl_visitors AS a 
            WHERE a.id NOT IN (SELECT visitor_id FROM tbl_hosts) AND a.is_deleted = 0 AND a.is_deactivate = 0 ORDER BY a.created_at DESC`;

        await con.query(visitorListQuery, (err, visitorsData) => {
            if (err) {
                throw err;
            }

            if (visitorsData.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Visitor not found"
                });
            } else {
                // Initialize an array to store ratings for each visitor
                const visitorRatings = [];

                visitorsData.forEach(visitor => {
                    const id = visitor.id;

                    // Determine if the user is a host or a visitor
                    const userIsHostQuery = "SELECT * FROM tbl_hosts WHERE visitor_id = ?";
                    con.query(userIsHostQuery, [id], (err, hostData) => {
                        if (err) {
                            throw err;
                        }

                        if (hostData.length > 0) {
                            // User is a host
                            const hostRatingQuery = `SELECT AVG(rating) AS overall_ratingFROM tbl_rating WHERE host_id = ? AND rating_by = ? AND is_deleted = ?`;

                            con.query(hostRatingQuery, [id, 2, 0], (err, hostRatingData) => {
                                if (err) {
                                    throw err;
                                }

                                visitorRatings.push({
                                    // Assuming there's only one result
                                    //visitor_info: visitor, // Include visitor info
                                    "id": visitor.id,
                                    "first_name": visitor.first_name,
                                    "last_name": visitor.last_name,
                                    "profile": visitor.profile,
                                    "gender": visitor.gender,
                                    "address": visitor.address,
                                    "mobile_no": visitor.mobile_no,
                                    "email": visitor.email,
                                    "password": visitor.password,
                                    "Identify_name": visitor.Identify_name,
                                    "Identify_document": visitor.Identify_document,
                                    "status": visitor.status,
                                    "google_id": visitor.google_id,
                                    "facebook_id": visitor.facebook_id,
                                    "login_type": visitor.login_type,
                                    "is_deleted": visitor.is_deleted,
                                    "created_at": visitor.created_at,
                                    "updated_at": visitor.updated_at,
                                    "join_date": visitor.join_date,
                                    "ratings": hostRatingData[0].overall_rating == null ? hostRatingData[0].overall_rating : hostRatingData[0].overall_rating.toFixed(1)
                                });

                                // Check if this is the last visitor, then send the response
                                if (visitorRatings.length === visitorsData.length) {
                                    res.status(200).send({
                                        success: true,
                                        data: visitorRatings
                                    });
                                }
                            });
                        } else {
                            // User is a visitor
                            const visitorRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE visitor_id = ? AND rating_by = ?`;

                            con.query(visitorRatingQuery, [id, 1], (err, visitorRatingData) => {
                                if (err) {
                                    throw err;
                                }
                                visitorRatings.push({
                                    // Assuming there's only one result
                                    //visitor_info: visitor, // Include visitor info
                                    "id": visitor.id,
                                    "first_name": visitor.first_name,
                                    "last_name": visitor.last_name,
                                    "profile": visitor.profile,
                                    "gender": visitor.gender,
                                    "address": visitor.address,
                                    "mobile_no": visitor.mobile_no,
                                    "email": visitor.email,
                                    "password": visitor.password,
                                    "Identify_name": visitor.Identify_name,
                                    "Identify_document": visitor.Identify_document,
                                    "status": visitor.status,
                                    "google_id": visitor.google_id,
                                    "facebook_id": visitor.facebook_id,
                                    "login_type": visitor.login_type,
                                    "is_deleted": visitor.is_deleted,
                                    "created_at": visitor.created_at,
                                    "updated_at": visitor.updated_at,
                                    "join_date": visitor.join_date,
                                    "ratings": visitorRatingData[0].overall_rating == null ? visitorRatingData[0].overall_rating : visitorRatingData[0].overall_rating.toFixed(1)
                                });
                                // .toFixed(1)
                                // Check if this is the last visitor, then send the response
                                if (visitorRatings.length === visitorsData.length) {
                                    res.status(200).send({
                                        success: true,
                                        data: visitorRatings
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const DeleteVisitor = async (req, res) => {
    try {
        const { visitorid } = req.params;
        var sql = "select is_deleted from tbl_visitors where id=?";
        await con.query(sql, [visitorid], (err, data) => {
            if (err) throw err;
            if (data[0].is_deleted == 1) {
                res.status(400).send({
                    success: false,
                    msg: "User not exist !"
                })
            }
            else {
                var sql = "update tbl_visitors set is_deleted=? where id=?";
                con.query(sql, [1, visitorid], (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "User deleted successfully!"
                    })
                })
            }
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const ChangeStatus = async (req, res) => {
    const { visitorId } = req.body;
    try {
        let sql = "select status from tbl_visitors where id=?";
        await con.query(sql, [visitorId], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                let status;
                if (data[0].status == 1) {
                    status = 0;
                }
                else {
                    status = 1;
                }
                let updateQuery = "update tbl_visitors set status=? where id=?";
                con.query(updateQuery, [status, visitorId], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows < 1) {
                        res.status(400).send({
                            success: false,
                            msg: "User status has not been updated successfully!"
                        })
                    }
                    else {
                        res.status(200).send({
                            success: true,
                            msg: "User status has been updated successfully!"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "user not exist !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const HostList = async (req, res) => {
    try {
        var sql = `
  SELECT tbl_visitors.*, tbl_hosts.*
  FROM tbl_visitors
  INNER JOIN tbl_hosts ON tbl_hosts.visitor_id = tbl_visitors.id
  WHERE EXISTS (
    SELECT * 
    FROM tbl_hosts AS b 
    WHERE tbl_visitors.id = b.visitor_id
  )
  AND tbl_visitors.is_deleted = 0 
  AND tbl_visitors.is_deactivate = 0
  ORDER BY tbl_hosts.created_at DESC
`;

        await con.query(sql, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Hosts not found"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.messages
        })
    }
}

const bookingList = async (req, res) => {
    let sqlQuery = `SELECT tbl_booking.*, tbl_payment.payment_method AS payment_method, 
    tbl_payment.amount AS price, tbl_payment.payment_id, 
    tbl_payment.payment_date, CONCAT(a.first_name, ' ', a.last_name) AS host_name, 
    CONCAT(b.first_name, ' ', b.last_name) AS visitor_name FROM tbl_booking 
    LEFT JOIN tbl_visitors AS a ON tbl_booking.host_id = a.id 
    LEFT JOIN tbl_visitors AS b ON tbl_booking.visitor_id = b.id
    LEFT JOIN tbl_payment ON tbl_booking.id = tbl_payment.booking_id
    WHERE tbl_booking.is_deleted = ? ORDER BY created_at DESC`;
    try {
        await con.query(sqlQuery, [0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Booking list not available !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const CancelBooking = async (req, res) => {
    const { booking_id } = req.body;
    try {
        if (!booking_id) {
            res.status(400).send({
                success: false,
                msg: "Provide booking id !"
            })
        }
        else {
            let sqlQuery = "select * from tbl_booking where id=?"
            await con.query(sqlQuery, [booking_id], (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    if (data[0].status == 3) {
                        res.status(400).send({
                            success: false,
                            msg: "Booking is alrady cancelled !"
                        })
                    }
                    else {
                        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        let updateQuery = "update tbl_booking set status= ?, cancelled_by=?, cancel_date=? where id=?";
                        con.query(updateQuery, [3, 1, currentDate, booking_id], (err, result) => {
                            if (err) throw err;
                            if (result.affectedRows > 0) {
                                const paymentQuery = "SELECT * FROM tbl_payment WHERE booking_id=?";
                                con.query(paymentQuery, [booking_id], async (err, resultData) => {
                                    if (err) throw err;
                                    const payment = resultData[0];
                                    //res.send(payment.payment_method)
                                    // Perform refund or deduction based on payment method
                                    let amount = 0;
                                    if (payment.discount_amount !== null) {
                                        amount = parseFloat(payment.discount_amount);
                                    } else {
                                        amount = parseFloat(payment.amount);
                                    }

                                    if (payment.payment_method.toLowerCase() == "wallet pay") {
                                        const selectQuery = `SELECT total_amount FROM wallet_amount WHERE user_id='${payment.visitor_id}'`;

                                        con.query(selectQuery, (err, amountdata) => {
                                            if (err) throw err;
                                            var previous_amount = amountdata[0].total_amount;
                                            var newAmount = parseFloat(previous_amount) + amount;
                                            // Update total amount in wallet_amount table

                                            const updateQuery = `UPDATE wallet_amount SET total_amount=${newAmount} WHERE user_id='${payment.visitor_id}'`;

                                            con.query(updateQuery, (err, updatedata) => {
                                                if (err) throw err;

                                                const sqlQuery = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_id, action_type) 
                                                    VALUES (?, ?, ?, ?)`;

                                                con.query(sqlQuery, [payment.visitor_id, amount, payment.payment_id, "Credit"], (err, result1) => {
                                                    if (err) throw err;
                                                });

                                                const currentDate = new Date();
                                                const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
                                                const updateQuery = `UPDATE tbl_payment SET payment_status="cancelled", refund_date='${formattedDate}' WHERE booking_id='${booking_id}'`;

                                                con.query(updateQuery, (err, data) => {
                                                    if (err) throw err;
                                                    // Handle the result if needed
                                                });

                                                res.status(200).send({
                                                    success: true,
                                                    message: "Booking cancelled successfully"
                                                });

                                            });
                                        })
                                    } else if (payment.payment_method.toLowerCase() == "online payment") {

                                        // Refund through other payment method
                                        // Code for refunding through other payment method...
                                        //  console.log(refundAmount);
                                        const paymentIntentId = payment.transaction_id;
                                        const stripeRefund = await stripe.refunds.create({
                                            payment_intent: paymentIntentId,
                                            amount: Math.round(amount * 100), // Amount in cents
                                        });
                                        // Check if refund was successful

                                        if (stripeRefund.status === "succeeded") {
                                            //cancelled
                                            // Get the current date and time
                                            const currentDate = new Date();
                                            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
                                            const updateQuery = `UPDATE tbl_payment SET payment_status="cancelled", refund_date='${formattedDate}' WHERE booking_id='${booking_id}'`;

                                            con.query(updateQuery, (err, data) => {
                                                if (err) throw err;
                                                // Handle the result if needed

                                            });


                                            res.status(200).send({
                                                success: true,
                                                message: "Booking cancelled successfully"
                                            });
                                        } else {
                                            res.status(400).send({
                                                success: false,
                                                message: "Failed to process refund via Stripe"
                                            });
                                        }
                                    }
                                    else {
                                        res.status(200).send({
                                            success: true,
                                            message: "Booking cancelled successfully"
                                        });
                                    }
                                });

                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    msg: "Failed to cancel booking !"
                                })
                            }
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Booking not found !"
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const ApproveBooking = async (req, res) => {
    const { booking_id } = req.body;
    try {
        if (!booking_id) {
            res.status(400).send({
                success: false,
                msg: "Provide Booking id !"
            })
        }
        else {
            let sqlQuery = "select * from tbl_booking where id=?";
            await con.query(sqlQuery, [booking_id], (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    if (data[0].status == 1) {
                        res.status(400).send({
                            success: false,
                            msg: "Booking is already accepted !"
                        })
                    }
                    else {
                        let updateQuery = "update tbl_booking set status=? where id =?";
                        con.query(updateQuery, [1, booking_id], (err, result) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                msg: "Approved booking successfully !"
                            })
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Booking not found !"
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const deleteBooking = async (req, res) => {
    const { booking_id } = req.body;
    try {
        if (!booking_id) {
            res.status(400).send({
                success: false,
                msg: "Provide booking id !"
            })
        }
        else {
            let sqlQuery = "select * from tbl_booking where id=?";
            await con.query(sqlQuery, [booking_id], (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    if (data[0].is_deleted == 0) {
                        let updateQuery = "update tbl_booking set is_deleted =? where id=?";
                        con.query(updateQuery, [1, booking_id], (err, result) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                msg: "Booking deleted successfully !"
                            })
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            msg: "Booking is alreday deleted !"
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Booking not found !"
                    })
                }
            })
        }
    }
    catch (error) {
        req.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const Ratings = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            res.status(400).send({
                success: false,
                msg: "Provide user id !"
            })
        }
        else {
            let sql = "select * from tbl_hosts where visitor_id =?";
            await con.query(sql, [id], (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    //host
                    let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where host_id=? and rating_by=? and is_deleted=?";
                    con.query(sqlQuery, [id, 2, 0], (err, data) => {
                        if (err) throw err;
                        if (data[0].overall_rating != null) {
                            let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ' , tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?";
                            con.query(selectQuery, [id, 2, 0], (err, details) => {
                                if (err) throw err;
                                if (details.length > 0) {
                                    original = data[0].overall_rating;
                                    //let overall_rating = Math.round(original * 10) / 10;
                                    let overall_rating = original.toFixed(1);
                                    let result = {
                                        overall_rating: overall_rating,
                                        total_reviews: data[0].total_reviews,
                                        data: details
                                    }
                                    res.status(200).send({
                                        success: true,
                                        response: result
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Rating not found !"
                                    })
                                }
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "rating is not available !"
                            })
                        }
                    })
                }
                else {
                    //visitor
                    let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where visitor_id=? and rating_by=?";
                    con.query(sqlQuery, [id, 1], (err, data) => {
                        if (err) throw err;
                        if (data[0].overall_rating != null) {
                            let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.host_id where visitor_id=? and rating_by=? and tbl_rating.is_deleted=?"
                            con.query(selectQuery, [id, 1, 0], (err, details) => {
                                if (err) throw err;
                                if (details.length > 0) {
                                    original = data[0].overall_rating;
                                    // let overall_rating = Math.round(original * 10) / 10;
                                    let overall_rating = original.toFixed(1);
                                    let result = {
                                        overall_rating: overall_rating,
                                        total_reviews: data[0].total_reviews,
                                        data: details
                                    }

                                    res.status(200).send({
                                        success: true,
                                        response: result
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Rating not found !"
                                    })
                                }
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Rating is not available !"
                            })
                        }
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const GetVisitorReview = async (req, res) => {
    try {
        let selectQuery = "select tbl_rating.*, CONCAT(b.first_name,' ' ,b.last_name) as visitor_name, CONCAT(a.first_name,' ' ,a.last_name) as host_name from tbl_rating INNER JOIN tbl_visitors as a on a.id=tbl_rating.host_id  INNER JOIN tbl_visitors as b on b.id=tbl_rating.visitor_id where rating_by=? and tbl_rating.is_deleted=? ORDER BY created_at DESC";
        await con.query(selectQuery, [1, 0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {

                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Data not found !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const GetHostReview = async (req, res) => {
    try {
        let selectQuery = "select tbl_rating.*, CONCAT(b.first_name,' ' ,b.last_name) as visitor_name, CONCAT(a.first_name,' ' ,a.last_name) as host_name from tbl_rating INNER JOIN tbl_visitors as a on a.id=tbl_rating.host_id  INNER JOIN tbl_visitors as b on b.id=tbl_rating.visitor_id where rating_by=? and tbl_rating.is_deleted=? ORDER BY created_at DESC";
        await con.query(selectQuery, [2, 0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Data not found !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const DeleteRating = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).send({
                success: false,
                msg: "Provide rating id !"
            })
        }
        else {
            var sql = "select is_deleted from tbl_rating where id=?";
            await con.query(sql, [id], (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    if (data[0].is_deleted == 1) {
                        res.status(400).send({
                            success: false,
                            msg: "Rating is already deleted !"
                        })
                    }
                    else {
                        var sql = "update tbl_rating set is_deleted=? where id=?";
                        con.query(sql, [1, id], (err, data) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                msg: "Rating deleted successfully!"
                            })
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Rating not found !"
                    })
                }
            })
        }

    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const paymentDetails = async (req, res) => {
    let sqlQuery = `SELECT tbl_payment.*, DATE_FORMAT(tbl_payment.payment_date, '%d %M %Y') as payment_date, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) AS customer FROM tbl_payment 
    INNER JOIN tbl_visitors ON tbl_visitors.id = tbl_payment.visitor_id
    ORDER BY created_at DESC`;
    try {
        await con.query(sqlQuery, [0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    mag: "Booking list not available !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const CustomerBookings = async (req, res) => {
    const { visitorId } = req.body;
    let sqlQuery = `SELECT tbl_booking.*, SUM(tbl_booking.adult + tbl_booking.child) as no_of_guests,
       tbl_payment.amount as price, CONCAT(a.first_name, ' ', a.last_name) as host_name,
       DATE_FORMAT(tbl_booking.booking_date, '%d %M %Y') as booking_date
       FROM tbl_booking
       INNER JOIN tbl_visitors as a ON tbl_booking.host_id = a.id
       INNER JOIN tbl_payment ON tbl_booking.id = tbl_payment.booking_id
       WHERE tbl_booking.is_deleted = ? AND tbl_booking.visitor_id = '${visitorId}'
       GROUP BY tbl_booking.id, tbl_payment.amount, CONCAT(a.first_name, ' ', a.last_name)  
       ORDER BY booking_date DESC`;
    try {
        await con.query(sqlQuery, [0], (err, data) => {
            if (err) throw err;

            // Create a new array to store modified objects
            const modifiedData = [];

            data.forEach(element => {
                const booking_id = "BK00000" + element.id;
                // Create a new object with the 'booking_id' property
                const modifiedElement = { ...element, booking_id };
                modifiedData.push(modifiedElement);
            });

            if (modifiedData.length > 0) {
                res.status(200).send({
                    success: true,
                    data: modifiedData
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "Booking list not available!"
                });
            }
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const invoiceDetails = async (req, res) => {
    const { booking_id } = req.body;
    var sql = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, a.id as visitor_id, a.mobile_no as customer_phone, a.email as customer_email ,
    CONCAT(a.first_name, ' ', a.last_name) as customer_name,
    CONCAT(b.first_name, ' ', b.last_name) as host_name,
    b.mobile_no as host_phone, b.email as host_email, tbl_hosting.fees_per_person, tbl_hosting.fees_per_group,
    CONCAT(tbl_hosting.flat_no, ', ', tbl_hosting.building_name, ', ', tbl_hosting.street, ', ', tbl_hosting.city, ', ',tbl_hosting.state, ', ', country_list.name) as host_address,
    tbl_payment.payment_id, tbl_payment.amount from tbl_booking
    INNER JOIN tbl_payment on tbl_payment.booking_id=tbl_booking.id
    INNER JOIN tbl_visitors as a on a.id=tbl_booking.visitor_id
    INNER JOIN tbl_visitors as b on b.id=tbl_booking.host_id
    INNER JOIN tbl_hosting on tbl_hosting.id=tbl_booking.hosting_id
    INNER JOIN country_list on country_list.id=tbl_hosting.country_id
     where tbl_booking.id=?`
    await con.query(sql, [booking_id], (err, booking) => {
        if (err) throw err;
        // console.log(booking);
        if (booking.length > 0) {
            var booking_id = "B100000" + booking[0].id
            var customer_id = "C1230000" + booking[0].visitor_id
            var totalPerson = booking[0].adult + booking[0].child + booking[0].pets;
            var totalAmount = (booking[0].adult + booking[0].child + booking[0].pets) * booking[0].fees_per_person;
            var details = {
                booking_id: booking_id,
                booking_date: booking[0].booking_date,
                booking_time: booking[0].booking_time,
                payment_id: booking[0].payment_id,
                host_name: booking[0].host_name,
                host_email: booking[0].host_email,
                host_phone: booking[0].host_phone,
                host_address: booking[0].host_address,
                customer_id: customer_id,
                customer_name: booking[0].customer_name,
                customer_email: booking[0].customer_email,
                customer_phone: booking[0].customer_phone,
                unit_cost: booking[0].fees_per_person,
                no_of_guests: totalPerson,
                total_amount: totalAmount
                // seat reservations
            }
            res.status(200).send({
                success: true,
                data: details
            })
        }
        else {
            res.status(400).send({
                success: false,
                message: "Invoice not available !"
            })
        }

    })
}

const sendNotification = async (req, res) => {
    try {
        const { send_to, user_id, title, message } = req.body;
        // 0 = all, 1= particular
        if (!send_to) {
            res.status(400).send({
                success: false,
                message: "Please select one option"
            })
        }
        else {
            if (send_to == 1) {
                const getUsersSql = 'SELECT id FROM tbl_visitors where is_deleted=?'; // Replace 'users' with your actual users table name
                await con.query(getUsersSql, [0], (err, results) => {
                    if (err) throw err;

                    // Send notifications to each user
                    if (results.length > 0) {
                        const insertNotificationSql = 'INSERT INTO notification_details (title, message, to_send, send_by) VALUES (?, ?, ?, ?)';
                        con.query(insertNotificationSql, [title, message, 1, 1], (err, notification) => {
                            if (err) throw err;
                            results.forEach((user) => {
                                const insertNotificationSql = 'INSERT INTO tbl_notifications (user_id, 	notification_id) VALUES (?, ?)';
                                con.query(insertNotificationSql, [user.id, notification.insertId], (err, result) => {
                                    if (err) throw err;
                                });
                            });
                        });

                        res.status(200).send({
                            success: true,
                            message: 'Notifications sent to all users successfully'
                        });
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: 'User not found'
                        });
                    }

                });
            }
            else {
                if (!user_id) {
                    res.status(400).send({
                        success: false,
                        msg: "Please select any one user"
                    })
                }
                else {
                    const insertNotificationSql = 'INSERT INTO notification_details (title, message, to_send, send_by) VALUES (?, ?, ?, ?)';
                    con.query(insertNotificationSql, [title, message, 2, 1], (err, notification) => {
                        if (err) throw err;
                        const insertNotificationSql = 'INSERT INTO tbl_notifications (user_id, 	notification_id) VALUES (?, ?)';
                        con.query(insertNotificationSql, [user_id, notification.insertId], (err, result) => {
                            if (err) throw err;
                        });
                    });

                    res.status(200).send({
                        success: true,
                        message: 'Notification sent successfully'
                    });
                }

            }
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const updateNotificationSeen = async (req, res) => {
    try {
        const { user_id } = req.body;
        function getLastInsertedNotificationId(user_id, callback) {
            const query = `SELECT tbl_notifications.id FROM tbl_notifications
            INNER JOIN notification_details on notification_details.id=tbl_notifications.notification_id
            WHERE tbl_notifications.user_id = ? and notification_details.is_deleted='${0}' ORDER BY id DESC LIMIT 1`;

            con.query(query, [user_id], (error, results) => {
                if (error) throw error;
                // console.log(results);

                const lastInsertedNotificationId = results.length > 0 ? results[0].id : null;
                callback(lastInsertedNotificationId);
            });
        }

        // Function to update is_seen status for a notification
        function markNotificationAsSeen(user_id, callback) {
            getLastInsertedNotificationId(user_id, (lastInsertedNotificationId) => {
                if (!lastInsertedNotificationId) {
                    // console.log('No notifications found for the user.');
                    callback(false);
                    return;
                }

                const query = 'UPDATE tbl_notifications SET is_seen = 1 WHERE id = ?';

                con.query(query, [lastInsertedNotificationId], (error, results) => {
                    if (error) throw error;

                    const affectedRows = results.affectedRows;

                    callback(affectedRows > 0); // Returns true if the notification was updated, false otherwise
                });
            });
        }
        markNotificationAsSeen(user_id, (notificationUpdated) => {
            if (notificationUpdated) {
                //console.log(`Last notification for user ${user_id} marked as seen.`);
                res.status(200).send({
                    success: true,
                    message: "Last notification marked as seen."
                })
            } else {
                //console.log(`No notifications found or last notification already seen for user ${user_id}.`);
                res.status(400).send({
                    success: false,
                    message: "No notifications found or last notification already seen"
                })
            }
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetAdminNotificationList = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT
                DISTINCT nd.id AS notification_id,
                nd.title,
                nd.message,
                CASE
                    WHEN nd.to_send = 1 THEN '1'
                    WHEN nd.to_send = 2 THEN CONCAT(v.first_name, ' ', v.last_name)
                END AS to_send,
                nd.is_deleted,
                nd.created_at
            FROM
                tbl_notifications n
            LEFT JOIN
                notification_details nd ON nd.id = n.notification_id
            LEFT JOIN
                tbl_visitors v ON n.user_id = v.id
            WHERE nd.is_deleted='${0}' AND nd.send_by='${1}'
            ORDER BY
                nd.created_at DESC;
        `;

        await con.query(sqlQuery, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    message: "",
                    data: data
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "No notifications found",
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

/* const GetNotification = async (req, res) => {
    try {
      const userId = req.user.id;
      const getNotificationsSql = `
        SELECT notifications.id, notifications.user_id, details.title, details.message, notifications.is_seen, notifications.created_at
        FROM tbl_notifications AS notifications
        INNER JOIN notification_details AS details ON notifications.notification_id = details.id
        WHERE notifications.user_id = ? AND details.is_deleted = ? AND notifications.is_deleted = ?
        ORDER BY notifications.created_at DESC;`;
  
      await con.query(getNotificationsSql, [userId, 0, 0], (err, results) => {
        if (err) throw err;
  
        if (results.length > 0) {
          let unseenCount = 0;
          let foundLastSeen = false;
  
          // Iterate through notifications in reverse order
          for (let i = results.length - 1; i >= 0; i--) {
            const notification = results[i];
  
            if (!foundLastSeen && notification.is_seen === 1) {
              foundLastSeen = true; // Mark the last seen notification
            }
  
            if (foundLastSeen && notification.is_seen === 0) {
              unseenCount++; // Count subsequent unseen notifications
            }
          }
  
          res.status(200).json({
            success: true,
            message: "",
            data: results,
            unseenCount: unseenCount
          });
        } else {
          res.status(200).json({
            success: true,
            message: "No notification found",
            data: results,
            unseenCount: 0
          });
        }
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message
      });
    }
  };
 */

/*   const GetNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const getNotificationsSql = `
            SELECT notifications.id, notifications.user_id, details.title, details.message, notifications.is_seen, notifications.created_at
            FROM tbl_notifications AS notifications
            INNER JOIN notification_details AS details ON notifications.notification_id = details.id
            WHERE notifications.user_id = ? AND details.is_deleted = ? AND notifications.is_deleted = ?
            ORDER BY notifications.created_at DESC;`;

        await con.query(getNotificationsSql, [userId, 0, 0], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                let unseenCount = 0;
                let foundLastSeen = false;

                // Check if there are no notifications with is_seen = 1
                const hasNoSeenNotifications = !results.some(notification => notification.is_seen === 1);

                // Iterate through notifications in reverse order
                for (let i = results.length - 1; i >= 0; i--) {
                    const notification = results[i];

                    if (hasNoSeenNotifications) {
                        unseenCount = results.length;
                        break; // Stop the loop if there are no notifications with is_seen = 1
                    }

                    if (!foundLastSeen && notification.is_seen === 1) {
                        foundLastSeen = true; // Mark the last seen notification
                    }

                    if (foundLastSeen && notification.is_seen === 0) {
                        unseenCount++; // Count subsequent unseen notifications
                    }
                }

                res.status(200).json({
                    success: true,
                    message: "",
                    data: results,
                    unseenCount: unseenCount
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No notification found",
                    data: results,
                    unseenCount: 0
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}; */

/* const GetNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const getNotificationsSql = `
            SELECT notifications.id, notifications.user_id, details.title, details.message, notifications.is_seen, notifications.created_at
            FROM tbl_notifications AS notifications
            INNER JOIN notification_details AS details ON notifications.notification_id = details.id
            WHERE notifications.user_id = ? AND details.is_deleted = ? AND notifications.is_deleted = ?
            ORDER BY notifications.created_at DESC;`;

        await con.query(getNotificationsSql, [userId, 0, 0], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                let unseenCount = 0;
                let foundLastSeen = false;

                // Check if the last notification is already seen
                const isLastSeen = results[0].is_seen === 1;

                // Iterate through notifications in reverse order
                for (let i = results.length - 1; i >= 0; i--) {
                    const notification = results[i];

                    if (isLastSeen) {
                        unseenCount = 0; // Set unseenCount to 0 if the last notification is already seen
                        break;
                    }

                    if (!foundLastSeen && notification.is_seen === 1) {
                        foundLastSeen = true; // Mark the last seen notification
                    }

                    if (foundLastSeen && notification.is_seen === 0) {
                        unseenCount++; // Count subsequent unseen notifications
                    }
                }

                res.status(200).json({
                    success: true,
                    message: "",
                    data: results,
                    unseenCount: unseenCount
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No notification found",
                    data: results,
                    unseenCount: 0
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};
 */

const GetNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const getNotificationsSql = `
            SELECT notifications.id, notifications.user_id, details.title, details.message, notifications.is_seen, notifications.created_at
            FROM tbl_notifications AS notifications
            INNER JOIN notification_details AS details ON notifications.notification_id = details.id
            WHERE notifications.user_id = ? AND details.is_deleted = ? AND notifications.is_deleted = ?
            ORDER BY notifications.created_at DESC;`;

        await con.query(getNotificationsSql, [userId, 0, 0], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                let unseenCount = 0;
                let foundLastSeen = false;

                // Iterate through notifications in reverse order
                for (let i = results.length - 1; i >= 0; i--) {
                    const notification = results[i];

                    if (notification.is_seen === 1) {
                        foundLastSeen = true; // Mark the last seen notification
                        unseenCount = 0; // Reset unseenCount when a seen notification is found
                    } else if (foundLastSeen) {
                        unseenCount++; // Count subsequent unseen notifications
                    }
                }

                // If no is_seen=1 found, count all messages
                if (!foundLastSeen) {
                    unseenCount = results.length;
                }

                res.status(200).json({
                    success: true,
                    message: "",
                    data: results,
                    unseenCount: unseenCount
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No notification found",
                    data: results,
                    unseenCount: 0
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;
        var sql = "select is_deleted from notification_details where id=?";
        await con.query(sql, [notification_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This notification is already deleted !"
                    })
                }
                else {
                    var sql = "update notification_details set is_deleted=? where id=?";
                    con.query(sql, [1, notification_id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Notification deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const userNameList = async (req, res) => {
    try {
        const selectQuery = `select id, CONCAT(first_name, ' ', last_name) AS name from tbl_visitors where is_deleted=?`;
        await con.query(selectQuery, [0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "No List Available"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetCountry = async (req, res) => {
    try {
        /* select DISTINCT c.id, c.name, c.shortname, c.phonecode, c.flag_url from tbl_area
        INNER JOIN countries as c on c.id=tbl_area.country_ */
        const sqlQuery = `select DISTINCT c.id, c.name, c.shortname, c.phonecode, c.flag_url from tbl_area
        INNER JOIN countries as c on c.id=tbl_area.country_id`;
        await con.query(sqlQuery, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetState = async (req, res) => {
    try {
        const country_id = req.body.country_id;
        if (!country_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide country_id"
            })
        }
        // console.log(country_id);
        const sqlQuery = `select DISTINCT s.id, s.name from tbl_area
        INNER JOIN states as s on s.id=tbl_area.state_id
        where tbl_area.country_id=?`;
        await con.query(sqlQuery, [country_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const GetCity = async (req, res) => {
    try {
        const state_id = req.body.state_id;
        if (!state_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide state_id"
            })
        }
        // console.log(country_id);
        const sqlQuery = `select DISTINCT c.id, c.name from tbl_area
        INNER JOIN cities as c on c.id=tbl_area.city_id
        where tbl_area.state_id=?`;
        await con.query(sqlQuery, [state_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const GetArea = async (req, res) => {
    try {
        const city_id = req.body.city_id;
        if (!city_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide city_id"
            })
        }
        // console.log(country_id);
        const sqlQuery = `select DISTINCT id, area from tbl_area where city_id=?`;
        await con.query(sqlQuery, [city_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const AcceptHostProfile = async (req, res) => {
    try {
        const { host_id } = req.body;
        if (!host_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide host id"
            })
        }
        await con.query(`select * from tbl_hosts where visitor_id =?`, [host_id], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                const updateQuery = `update tbl_hosts set is_verified=? where visitor_id=?`;
                con.query(updateQuery, [1, host_id], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "Successfully accepted host profile"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to accept host profile"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Host id doesn't exist"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const RejectHostProfile = async (req, res) => {
    try {
        const { host_id } = req.body;
        if (!host_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide host id"
            })
        }
        await con.query(`select * from tbl_hosts where visitor_id =?`, [host_id], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                const updateQuery = `update tbl_hosts set is_verified=? where visitor_id=?`;
                con.query(updateQuery, [2, host_id], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "Successfully reject host profile"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to reject host profile"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Host id doesn't exist"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const LearnAboutBeingHost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please upload video"
            })
        }
        // console.log(req.file.filename);
        await con.query(`select id from how_app_works`, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                con.query(`update how_app_works set video=? where id='${data[0].id}'`, [req.file.filename], (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Video updated successfully"
                    })
                })
            }
            else {
                con.query(`insert into how_app_works (video) values(?)`, [req.file.filename], (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Video uploaded successfully"
                    })
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetVideoLearnAboutBeingHost = async (req, res) => {
    try {
        await con.query(`select * from how_app_works`, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data[0]
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetHostingsbyhostId = async (req, res) => {
    try {
        const { host_id } = req.body;
        if (!host_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide hosting id"
            })
        }
        await con.query(`select * from tbl_hosting
        where tbl_hosting.host_id='${host_id}' and form_type ='${13}' ORDER BY created_at DESC`, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(200).send({
                    success: true,
                    message: "No hosts Added yet !",
                    data: data
                })
            }
            else {
                //res.send(area[0])
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    // console.log(data[i].area_id !== null && data[i].area_id !==0)
                    var area_type;
                    if (data[i].area_id !== 0) {
                        //console.log(data[i].area_id !==0);
                        con.query(`select area_type from area_list where id='${data[i].area_id}'`, (err, area) => {
                            if (err) throw err;
                            if (area.length > 0) {
                                area_type = area[0].area_type;
                            }
                            //area_type = area[0].area_type;
                        })
                    }
                    var place_type;
                    if (data[i].place_id !== 0) {
                        //console.log(data[i].area_id !==0);
                        con.query(`select place_type from place_list where id='${data[i].place_id}'`, (err, place) => {
                            if (err) throw err;
                            if (place.length > 0) {
                                place_type = place[0].place_type;
                            }
                            //area_type = area[0].area_type;
                        })
                    }
                    /*  var country_type;
                     if (data[i].country_id !== 0) {
                         //console.log(data[i].area_id !==0);
                         con.query(`select name from country_list where id='${data[i].country_id}'`, (err, country) => {
                             if (err) throw err;
                             if (country.length > 0) {
                                 country_type = country[0].name;
                             }
                             //area_type = area[0].area_type;
                         })
                     } */

                    const cuisine_style = [];
                    //  console.log(data[i].cuisine_style)
                    if (data[i].cuisine_style !== null) {
                        //console.log('hii')
                        const arr1 = data[i].cuisine_style.split(",");
                        //console.log(arr1)
                        arr1.forEach(data => {
                            // console.log(data)
                            var sql1 = `select id, cuisine_type from cuisine_list where id='${data}'`;
                            con.query(sql1, (err, type) => {
                                if (err) throw err;

                                if (type && type.length > 0) {
                                    cuisine_style.push(type[0]);
                                }
                                // console.log(cuisine_style)
                            })
                        });
                    }


                    //  console.log(cuisine_style)
                    const activities_type = [];
                    if (data[i].activities_id !== null) {
                        // console.log('hii')
                        const arr1 = data[i].activities_id.split(",");
                        //console.log(arr1)
                        arr1.forEach(data => {
                            // console.log(data)
                            var sql1 = `select * from activities_list where id='${data}'`;
                            con.query(sql1, (err, type) => {
                                if (err) throw err;
                                // console.log(type)
                                if (type && type.length > 0) {
                                    activities_type.push(type[0].activity_type);
                                }
                                //console.log(area_type)
                            })
                        });
                    }

                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        //console.log(result)
                        var images;
                        if (result.length > 0) {
                            /* result.forEach(item => {
                                images.push(item.image);
    
                            }) */
                            images = "http://suppr.me/images/" + result[0].image;
                        }
                        else {
                            images = null;
                        }

                        // console.log(images)
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            //  console.log(response);
                            var rules = [];
                            response.forEach(item => {
                                rules.push(item.rules);
                            })
                            //console.log(rules)
                            con.query(`select time_slots.*, cuisine_list.cuisine_type from time_slots INNER JOIN cuisine_list on cuisine_list.id=time_slots.cuisine_id where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeDay) => {
                                if (err) throw err;
                                var time = [];
                                timeDay.forEach(item => {
                                    time.push(item);
                                })
                                //console.log(time)
                                /* con.query(`select * from discounts where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, discountData) => {
                                    if (err) throw err;
                                    var discount = [];
                                    discountData.forEach(item => {
                                        discount.push(item);
                                    }) */

                                const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
        INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
        INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
        where hosting_menu.hosting_id='${data[i].id}'`;

                                con.query(query, (error, results) => {
                                    if (error) {
                                        console.error('Error executing query: ' + error.stack);
                                        return;
                                    }

                                    const formattedData = [];
                                    //console.log(results)
                                    results.forEach((row) => {

                                        // Check if Cuisine already exists in formattedData
                                        const cuisineIndex = formattedData.findIndex((c) => c.Cuisine_id === row.Cuisine_id);
                                        // console.log(cuisineIndex)
                                        if (cuisineIndex === -1) {
                                            // If Cuisine doesn't exist, create a new entry
                                            //console.log(row.Cuisine_id)
                                            formattedData.push({

                                                Cuisine_id: row.Cuisine_id,
                                                no_of_courses: row.no_of_courses,
                                                dishes: [
                                                    {
                                                        name: row.name,
                                                        allegen: row.allegen,
                                                        dish_picture: row.dish_picture,
                                                    },
                                                ],
                                            });

                                        } else {
                                            // If Cuisine exists, add the dish to the existing entry
                                            formattedData[cuisineIndex].dishes.push({
                                                name: row.name,
                                                allegen: row.allegen,
                                                dish_picture: row.dish_picture,
                                            });
                                        }
                                    });
                                    con.query(`select * from hosting_dress where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, dressdata) => {
                                        if (err) throw err;
                                        //  console.log(response);
                                        var dress = [];
                                        dressdata.forEach(item => {

                                            dress.push(item.dress_code);
                                        })
                                        var status = "Incomplete";
                                        if (data[i].form_type == 13) {
                                            status = "Complete";
                                        }
                                        var values = {
                                            id: data[i].id,
                                            host_id: data[i].host_id,
                                            description: data[i].description,
                                            form_type: data[i].form_type,
                                            place_type: place_type,
                                            country: data[i].country_id,
                                            state: data[i].state,
                                            city: data[i].city,
                                            area: data[i].area,
                                            street: data[i].street,
                                            building_name: data[i].building_name,
                                            flat_no: data[i].flat_no,
                                            address_document: data[i].address_document,
                                            lat: data[i].lat,
                                            lng: data[i].lng,
                                            area_type: area_type,
                                            area_video: data[i].area_video,
                                            no_of_guests: data[i].no_of_guests,
                                            dress_code: dress,
                                            fees_per_person: data[i].fees_per_person,
                                            fees_per_group: data[i].fees_per_group,
                                            condition: data[i].conditions,
                                            discount: data[i].discount,
                                            bank_country: data[i].bank_country,
                                            bank_name: data[i].bank_name,
                                            bank_iban: data[i].bank_iban,
                                            bank_swift_code: data[i].bank_swift_code,
                                            account_currency: data[i].account_currency,
                                            host_name: data[i].host_name,
                                            trade_license: data[i].trade_license,
                                            is_approved: data[i].is_approved,
                                            created_at: data[i].created_at,
                                            updated_at: data[i].updated_at,
                                            // data: data[i],
                                            cuisine_list: cuisine_style,
                                            activities_type: activities_type,
                                            area_images: images,
                                            rules: rules,
                                            menus: formattedData,
                                            //discount: discount,
                                            time_slots: time,
                                            status: status
                                        }
                                        arr.push(values)
                                        // console.log(arr);
                                    })
                                })
                            })
                        })
                    })
                }
                setTimeout(function () {
                    res.status(200).send({
                        success: true,
                        data: arr
                    })
                }, 1000)
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const hostingApproved = async (req, res) => {
    const { hosting_id } = req.body;
    if (!hosting_id) {
        return res.status(400).send({
            success: false,
            message: "Please provide hosting id"
        })
    }
    const updateQuery = `update tbl_hosting set is_approved='${1}' where id='${hosting_id}'`;
    await con.query(updateQuery, (err, data) => {
        if (err) throw err;
        res.status(200).send({
            success: true,
            message: "Hosting approved successfully"
        })
    })
}


module.exports = {
    Login, forgotPassword, VerifyOtp, ResetPassword, AdminChangePassword, VisitorList, GetProfile,
    UpdateProfile, DeleteVisitor, ChangeStatus, HostList, bookingList, CancelBooking, ApproveBooking,
    Ratings, deleteBooking, GetVisitorReview, GetHostReview, DeleteRating, paymentDetails, CustomerBookings,
    invoiceDetails, sendNotification, GetNotification, GetAdminNotificationList, deleteNotification, userNameList,
    updateNotificationSeen, GetCountry, GetState, GetCity, GetArea, AcceptHostProfile, RejectHostProfile,
    LearnAboutBeingHost, GetVideoLearnAboutBeingHost, GetHostingsbyhostId, hostingApproved
}