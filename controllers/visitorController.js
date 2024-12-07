const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { genrateToken, verifyRefreshToken } = require('../helpers/authJwt');
const jwt = require("jsonwebtoken");
const sendMail = require('../helpers/sendMail')
const cheerio = require('cheerio');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, password, confirm_password, phoneNo, address, identify_name, identify_number } = req.body;
    if (password !== confirm_password) {
        return res.status(400).send({
            success: false,
            message: "New password and confirm password doesn't match !"
        })
    }
    var encrypassword = await hashPassword(password);
    try {
        await con.query(`select * from tbl_visitors where email='${email}' and is_deleted='${0}'`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "Email is already exists !"
                })
            }
            else {
                con.query(`select mobile_no from tbl_visitors where mobile_no='${phoneNo}' and is_deleted='${0}'`, (err, result1) => {
                    if (err) throw err;
                    if (result1.length > 0) {
                        if (result1[0].mobile_no.length > 0) {
                            res.status(400).send({
                                success: false,
                                message: "Phone number is already exists !"
                            })
                        }
                        else {
                            if (req.files && req.files.identify_document && req.files.identify_document.length > 0) {
                                let identify_document = req.files.identify_document[0].filename;
                                con.query(`insert into tbl_visitors (first_name, last_name, address, mobile_no, email, password, Identify_name,	Identify_document,  login_type) 
                        values('${firstname}','${lastname}','${address}' ,'${phoneNo}','${email}', '${encrypassword}', '${identify_name}', '${identify_document}','${1}')`, (err, presult) => {
                                    if (err) throw err;
                                    res.status(200).send({
                                        success: true,
                                        message: "Your account has been successfully created !"
                                    })
                                })
                            }
                            else {
                                con.query(`insert into tbl_visitors (first_name, last_name, address, mobile_no, email, password, login_type) 
                        values('${firstname}','${lastname}','${address}' ,'${phoneNo}','${email}', '${encrypassword}', '${1}')`, (err, presult) => {
                                    if (err) throw err;
                                    res.status(200).send({
                                        success: true,
                                        message: "Your account has been successfully created !"
                                    })
                                })
                            }
                        }
                    }
                    else {
                        if (req.files && req.files.identify_document && req.files.identify_document.length > 0) {
                            let identify_document = req.files.identify_document[0].filename;
                            con.query(`insert into tbl_visitors (first_name, last_name, address, mobile_no, email, password, Identify_name,	Identify_document,  login_type) 
                    values('${firstname}','${lastname}','${address}' ,'${phoneNo}','${email}', '${encrypassword}', '${identify_name}', '${identify_document}','${1}')`, (err, presult) => {
                                if (err) throw err;
                                res.status(200).send({
                                    success: true,
                                    message: "Your account has been successfully created !"
                                })
                            })
                        }
                        else {
                            con.query(`insert into tbl_visitors (first_name, last_name, address, mobile_no, email, password, login_type) 
                    values('${firstname}','${lastname}','${address}' ,'${phoneNo}','${email}', '${encrypassword}', '${1}')`, (err, presult) => {
                                if (err) throw err;
                                res.status(200).send({
                                    success: true,
                                    message: "Your account has been successfully created !"
                                })
                            })
                        }
                    }
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

const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { email, password } = req.body;
    try {
        let findUserQuery = "SELECT * FROM tbl_visitors WHERE email = ?";
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
                        var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                        con.query(selectQuery, [data[0].id], (err, result) => {
                            if (err) throw err;
                            var host_type;
                            var document_uploaded;
                            var is_verified = "";
                            if (result.length > 0) {
                                // console.log(result[0].trade_license)
                                is_verified = result[0].is_verified;
                                host_type = 1;
                                if (result[0].trade_license === '' || result[0].trade_license === null) {
                                    document_uploaded = 0;
                                } else {
                                    document_uploaded = 1;
                                }

                            }
                            else {
                                host_type = 0;
                                if (data[0].Identify_document == '' || data[0].Identify_document == null) {
                                    document_uploaded = 0;
                                }
                                else {
                                    document_uploaded = 1;
                                }
                            }
                            if (data[0].status == 1 && data[0].is_deleted == 0) {
                                if (data[0].is_deactivate == 1) {
                                    const updateQuery = `update tbl_visitors set is_deactivate=? where id=?`;
                                    con.query(updateQuery, [0, data[0].id], (err, result) => {
                                        if (err) throw err;
                                    })
                                }
                                Email = data[0].email;
                                mailSubject = 'Login successfully';
                                content = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Login- login successfully</title>
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
                    <p>Your login was successful. Welcome back!</p>
                    <p>If you have any questions or need assistance, feel free to contact us.</p>
                    <p>Thank you!</p>
                    <div class="footer">&copy; 2023 Suppr. All rights reserved. </div>
                    </section>

                    </div>
                </body>
                </html>
                `;
                                sendMail(Email, mailSubject, content);
                                const selectQuery = `select * from tbl_visitors where id=?`;
                                con.query(selectQuery, [data[0].id], (err, userdata1) => {
                                    if (err) throw err;
                                    const user = {
                                        id: data[0].id,
                                        email: data[0].email
                                    };
                                    genrateToken(user).then((userdata) => {
                                        res.status(200).send({
                                            success: true,
                                            message: "Login Successfully !",
                                            data: userdata1[0],
                                            host_type: host_type,
                                            is_verified: is_verified,
                                            document_uploaded: document_uploaded,
                                            token: userdata
                                        })
                                    });
                                })
                            }
                            else {
                                if (data[0].is_deleted == 1) {
                                    res.status(400).send({
                                        success: false,
                                        message: "Your account is deleted by admin !"
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        success: false,
                                        message: "Your account is deactivate by admin !"
                                    })
                                }
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Password is incorrect !"
                        })
                    }
                });
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

const newAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).send({
            success: false,
            message: "Enter Refresh Token !"
        })
    }
    else {
        verifyRefreshToken(refreshToken)
            .then(({ tokenDetails }) => {
                ACCESS_TOKEN_PRIVATE_KEY = "thisismyaccesstoken";
                //console.log(tokenDetails)
                const payload = { id: tokenDetails.id };
                //console.log(payload)
                const accessToken = jwt.sign(
                    payload,
                    ACCESS_TOKEN_PRIVATE_KEY,
                    { expiresIn: "3d" }
                );
                res.status(200).json({
                    success: true,
                    message: "Access token created successfully",
                    accessToken
                });
            })
            .catch((err) => res.status(400).json(err));
    }
}

const logout = async (req, res) => {
    try {
        // Find Token And Remove It from Database
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).send({
                success: false,
                message: "Provide Refresh Token !"
            })
        }
        else {
            await con.query(`select * from usertoken where token = ?`, [refreshToken], (err, result) => {
                if (err) throw err;
                //console.log(result);
                con.query(`update tbl_visitors set first_login='${1}' where id='${result[0].userId}' and first_login='${0}'`, (err, result1) => {
                    if (err) throw err;
                })
            })
            let delTokenQuery = "DELETE FROM usertoken WHERE token = ?";
            con.query(delTokenQuery, [refreshToken], (err, data) => {
                if (err) throw err;
                return res.status(200).send({
                    success: true,
                    message: "You've been signed out!",
                });
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const ChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    var { oldpassword, newpassword, confirmpassword } = req.body;
    try {
        var encrypassword = await hashPassword(newpassword);
        let sql = "Select password from tbl_visitors where id= ?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            bcrypt.compare(oldpassword, data[0].password, (err, password) => {
                if (err) throw err;
                if (password) {
                    if (newpassword !== confirmpassword) {
                        res.status(400).send({
                            success: false,
                            message: "New Password and confirm Password doesn't match !"
                        })
                    }
                    else {
                        let updateQuery = "UPDATE tbl_visitors SET password = ? WHERE id = ?";
                        con.query(updateQuery, [encrypassword, req.user.id], (err, data1) => {
                            if (err) throw err;
                            if (data1.affectedRows < 1) {
                                res.status(400).send({
                                    success: false,
                                    message: "Password Not Changed !"
                                })
                            }
                            else {
                                res.status(200).send({
                                    success: true,
                                    message: "Password has been successfully changed !"
                                })
                            }
                        });
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Old password was entered Incorrectly !"
                    })
                }
            });
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const EditProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, phoneNo, address, identify_name, host_name, about_me, trade_license } = req.body;
    try {
        let sql = "Select * from tbl_visitors where (email = ? OR mobile_no = ?) AND id <> ? AND is_deleted=?";
        await con.query(sql, [email, phoneNo, req.user.id, 0], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                con.query(selectQuery, [req.user.id], (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        let updateQuery = "Update tbl_visitors set first_name=?, last_name=?, email=?, mobile_no=? WHERE id=?";
                        con.query(updateQuery, [firstname, lastname, email, phoneNo, req.user.id], (err, result) => {
                            if (err) throw err;
                            if (result.affectedRows > 0) {
                                if (req.files.profile !== undefined && req.files.trade_license !== undefined) {
                                    //  console.log("both");
                                    let license = req.files.trade_license[0].filename
                                    let profile = req.files.profile[0].filename
                                    let updateQuery = "Update tbl_visitors set profile=? WHERE id=?";
                                    con.query(updateQuery, [profile, req.user.id], (err, result) => {
                                        if (err) throw err;
                                        let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=?, trade_license=? WHERE visitor_id=?";
                                        con.query(updateQuery2, [host_name, about_me, license, req.user.id], (err, result1) => {
                                            if (err) throw err;
                                            res.status(200).send({
                                                success: true,
                                                message: 'Your profile has been successfully updated  !'
                                            })
                                        })
                                    })

                                }
                                else if (req.files.profile) {
                                    //  console.log("profile");
                                    // let trade_license = req.files.trade_license[0].filename;
                                    let profile = req.files.profile[0].filename
                                    let updateQuery = "Update tbl_visitors set profile=? WHERE id=?";
                                    con.query(updateQuery, [profile, req.user.id], (err, result) => {
                                        if (err) throw err;
                                        let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=? WHERE visitor_id=?";
                                        con.query(updateQuery2, [host_name, about_me, req.user.id], (err, result1) => {
                                            if (err) throw err;
                                            res.status(200).send({
                                                success: true,
                                                message: 'Your profile has been successfully updated  !'
                                            })
                                        })
                                    })
                                }
                                else if (req.files.trade_license) {
                                    //  console.log("license");
                                    let license = req.files.trade_license[0].filename
                                    let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=?, trade_license=? WHERE visitor_id=?";
                                    con.query(updateQuery2, [host_name, about_me, license, req.user.id], (err, result1) => {
                                        if (err) throw err;
                                        res.status(200).send({
                                            success: true,
                                            message: 'Your profile has been successfully updated  !'
                                        })
                                    })
                                }
                                else {
                                    //  console.log("hii");
                                    let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=? WHERE visitor_id=?";
                                    con.query(updateQuery2, [host_name, about_me, req.user.id], (err, result1) => {
                                        if (err) throw err;
                                        res.status(200).send({
                                            success: true,
                                            message: 'Your profile has been successfully updated  !'
                                        })
                                    })
                                }
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    msg: "Failed to update profile !"
                                })
                            }
                        })
                    }
                    else {
                        if (Object.keys(req.files).length === 0) {
                            let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?, email=?, mobile_no=?, address=? WHERE id=?";
                            con.query(updateQuery, [firstname, lastname, email, phoneNo, address, req.user.id], (err, result) => {
                                if (err) throw err;
                                res.status(200).send({
                                    success: true,
                                    message: 'Your profile has been successfully updated  !'
                                })
                            })
                        }
                        else {
                            if (req.files.identify_document && req.files.profile) {
                                let identify_document = req.files.identify_document[0].filename;
                                let profile = req.files.profile[0].filename
                                let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?, profile=?, email=?, mobile_no=?, address=?, Identify_name=?, Identify_document=? WHERE id=?";
                                con.query(updateQuery, [firstname, lastname, profile, email, phoneNo, address, identify_name, identify_document, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your profile has been successfully updated  !'
                                    })
                                })
                            }
                            else if (req.files.profile) {
                                let profile = req.files.profile[0].filename;
                                let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?, profile=?, email=?, mobile_no=?, address=? WHERE id=?";
                                con.query(updateQuery, [firstname, lastname, profile, email, phoneNo, address, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    //console.log(result)
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your profile has been successfully updated  !'
                                    })
                                })
                            }
                            else {
                                let identify_document = req.files.identify_document[0].filename;
                                let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?,  email=?, mobile_no=?, address=?, Identify_name=?, Identify_document=? WHERE id=?";
                                con.query(updateQuery, [firstname, lastname, email, phoneNo, address, identify_name, identify_document, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    //console.log(result)
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your profile has been successfully updated !'
                                    })
                                })
                            }
                        }
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Email or phone number already exists !"
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

const GetProfile = async (req, res) => {
    try {
        const { user_id } = req.body;
        let sql = "SELECT * FROM tbl_hosts WHERE visitor_id=?";
        await con.query(sql, [user_id], (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                let sqlQuery = "SELECT * FROM tbl_visitors WHERE id=?";
                con.query(sqlQuery, [user_id], (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        var mobile_number = result[0].mobile_no;

                        // console.log(!mobile_number);
                        if (mobile_number) {
                            var country_code = mobile_number.slice(0, 3);
                            var filtered_mobile_number = mobile_number.slice(3);
                            result[0].country_code = country_code;
                            result[0].mobile_no = filtered_mobile_number;
                        }
                        else {
                            result[0].country_code = "";
                        }

                        // Convert null values to empty strings
                        result = result.map(row => {
                            for (let key in row) {
                                if (row[key] === null) {
                                    row[key] = ''; // Convert null to empty string
                                }
                            }
                            return row;
                        });

                        const isCompleted = result[0].Identify_document ? 1 : 0;

                        res.status(200).send({
                            success: true,
                            data: { ...result[0], is_completed: isCompleted }
                        });
                    } else {
                        res.status(400).send({
                            success: false,
                            message: "User not found!"
                        });
                    }
                });
            } else {
                let sqlQuery = "SELECT first_name, last_name, profile, mobile_no, email, status, login_type, Identify_document FROM tbl_visitors WHERE id=?";
                con.query(sqlQuery, [user_id], (err, resultdata) => {
                    if (err) throw err;
                    if (resultdata.length > 0) {
                        var data = resultdata[0];
                        var host = result[0];
                        var license = '';
                        if (host.trade_license !== '') {
                            license = "http://suppr.me/documents/" + host.trade_license;
                        }
                        var mobile_number = data.mobile_no;
                        var country_code;
                        if (mobile_number) {
                            country_code = mobile_number.slice(0, 3);
                        }
                        const isCompleted = host.trade_license ? 1 : 0;

                        var user = {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            profile: data.profile,
                            country_code: country_code,
                            mobile_no: data.mobile_no.slice(3), // Filtered mobile number
                            email: data.email,
                            status: data.status,
                            login_type: data.login_type,
                            host_name: host.host_name,
                            about_me: host.about_me,
                            trade_license: license,
                            is_completed: isCompleted
                        }
                        res.status(200).send({
                            success: true,
                            data: user
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "User not found!"
                        })
                    }
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


const GoogleLogin = async (req, res) => {
    const user = {
        googleId: req.body.id,
        firstName: req.body.given_name,
        lastName: req.body.family_name,
        email: req.body.email,
        // profilePic: req.files.picture[0].filename,
    };
    try {
        const sql = "select * from tbl_visitors where google_id= ?";
        await con.query(sql, [user.googleId], (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                if (req.files.picture == undefined) {
                    let sql = "insert into tbl_visitors (google_id, first_name, last_name, email, login_type) values (?,?,?,?,?)";
                    con.query(sql, [user.googleId, user.firstName, user.lastName, user.email, 2], (err, data) => {
                        if (err) throw err;
                        let sqlQuery = "select * from tbl_visitors where id= ?";
                        con.query(sqlQuery, [data.insertId], (err, visitor) => {
                            if (err) throw err;
                            var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                            con.query(selectQuery, [visitor[0].id], (err, result) => {
                                var host_type;
                                if (result.length > 0) {
                                    host_type = 1;
                                }
                                else {
                                    host_type = 0;
                                }
                                const user = {
                                    id: visitor[0].id,
                                    login_type: visitor[0].login_type
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Successfully login via google!",
                                        data: visitor[0],
                                        token: userdata,
                                        host_type: host_type
                                    })
                                });
                            })
                        })
                    })
                }
                else {
                    let sql = "insert into tbl_visitors (google_id, first_name, last_name, email, profile, login_type) values (?,?,?,?,?,?)";
                    con.query(sql, [user.googleId, user.firstName, user.lastName, user.email, req.files.picture[0].filename, 2], (err, data) => {
                        if (err) throw err;
                        let sqlQuery = "select * from tbl_visitors where id= ?";
                        con.query(sqlQuery, [data.insertId], (err, visitor) => {
                            if (err) throw err;
                            var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                            con.query(selectQuery, [visitor[0].id], (err, result) => {
                                var host_type;
                                if (result.length > 0) {
                                    host_type = 1;
                                }
                                else {
                                    host_type = 0;
                                }
                                const user = {
                                    id: visitor[0].id,
                                    login_type: visitor[0].login_type
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Successfully login via google!",
                                        data: visitor[0],
                                        token: userdata,
                                        host_type: host_type
                                    })
                                });
                            })

                        })
                    })
                }

            }
            else {
                var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                con.query(selectQuery, [result[0].id], (err, results) => {
                    var host_type;
                    if (results.length > 0) {
                        host_type = 1;
                    }
                    else {
                        host_type = 0;
                    }
                    const user = {
                        id: result[0].id,
                        login_type: result[0].login_type
                    };
                    genrateToken(user).then((userdata) => {
                        res.status(200).send({
                            success: true,
                            message: "Successfully login via google !",
                            data: result[0],
                            token: userdata,
                            host_type: host_type
                        })
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

const FacebookLogin = async (req, res) => {
    var user = {
        facebookId: req.body.id,
        firstName: req.body.name,
        email: req.body.email,
        // profile: req.files.photo[0].filename
    };
    // console.log(req.files.profile == undefined);
    try {
        var sql = "SELECT * FROM tbl_visitors WHERE facebook_id= ?";
        await con.query(sql, user.facebookId, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                if (req.files.photo == undefined) {
                    let sql = "insert into tbl_visitors (facebook_id, first_name, email, login_type) values (?,?,?,?)";
                    con.query(sql, [user.facebookId, user.firstName, user.email, 3], (err, data) => {
                        if (err) throw err;
                        let sqlQuery = "select * from tbl_visitors where id= ?";
                        con.query(sqlQuery, [data.insertId], (err, visitor) => {
                            if (err) throw err;
                            // console.log(visitor);
                            var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                            con.query(selectQuery, [visitor[0].id], (err, result) => {
                                var host_type;
                                if (result.length > 0) {
                                    host_type = 1;
                                }
                                else {
                                    host_type = 0;
                                }
                                const user = {
                                    id: visitor[0].id,
                                    login_type: visitor[0].login_type,
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Successfully login via facebook!",
                                        data: visitor[0],
                                        token: userdata,
                                        host_type: host_type
                                    })
                                });
                            })
                        })
                    })
                }
                else {
                    let sql = "insert into tbl_visitors (facebook_id, first_name, email, profile, login_type) values (?,?,?,?,?)";
                    con.query(sql, [user.facebookId, user.firstName, user.email, req.files.photo[0].filename, 3], (err, data) => {
                        if (err) throw err;
                        let sqlQuery = "select * from tbl_visitors where id= ?";
                        con.query(sqlQuery, [data.insertId], (err, visitor) => {
                            if (err) throw err;
                            // console.log(visitor);
                            var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                            con.query(selectQuery, [visitor[0].id], (err, result) => {
                                var host_type;
                                if (result.length > 0) {
                                    host_type = 1;
                                }
                                else {
                                    host_type = 0;
                                }
                                const user = {
                                    id: visitor[0].id,
                                    login_type: visitor[0].login_type,
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Successfully login via facebook!",
                                        data: visitor[0],
                                        token: userdata,
                                        host_type: host_type
                                    })
                                });
                            })
                        })
                    })
                }
            }
            else {
                //console.log(result[0]);
                var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                con.query(selectQuery, [result[0].id], (err, results) => {
                    // console.log(results);
                    var host_type;
                    if (results.length > 0) {
                        host_type = 1;
                    }
                    else {
                        host_type = 0;
                    }

                    const user = {
                        id: result[0].id,
                        login_type: result[0].login_type
                    };
                    genrateToken(user).then((userdata) => {
                        res.status(200).send({
                            success: true,
                            message: "Successfully login via facebook !",
                            data: result[0],
                            token: userdata,
                            host_type: host_type
                        })
                    });
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.messages
        })
    }
}

const AppleLogin = async (req, res) => {
    try {
        var user = {
            apppleId: req.body.id,
            firstName: req.body.name,
            email: req.body.email,
            // profile: req.files.photo[0].filename
        };
        var sql = "SELECT * FROM tbl_visitors WHERE apple_id= ?";
        await con.query(sql, [user.apppleId], (err, result) => {
            if (err) throw err;
            // console.log(result.length);
            if (result.length < 1) {
                //console.log("hii");
                if (req.files.photo == undefined) {
                    // console.log("hello");
                    let sql = "insert into tbl_visitors (apple_id, first_name, email, login_type) values (?,?,?,?)";
                    con.query(sql, [user.apppleId, user.firstName, user.email, 4], (err, data) => {
                        if (err) throw err;
                        let sqlQuery = "select * from tbl_visitors where id= ?";
                        con.query(sqlQuery, [data.insertId], (err, visitor) => {
                            if (err) throw err;
                            // console.log(visitor);
                            var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                            con.query(selectQuery, [visitor[0]?.id], (err, result) => {
                                var host_type;
                                if (result.length > 0) {
                                    host_type = 1;
                                }
                                else {
                                    host_type = 0;
                                }
                                const user = {
                                    id: visitor[0]?.id,
                                    login_type: visitor[0]?.login_type,
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Successfully login via Apple!",
                                        data: visitor[0],
                                        token: userdata,
                                        host_type: host_type
                                    })
                                });
                            })
                        })
                    })
                }
                else {
                    // console.log("hello1");
                    let sql = "insert into tbl_visitors (apple_id, first_name, email, profile, login_type) values (?,?,?,?,?)";
                    con.query(sql, [user.apppleId, user.firstName, user.email, req.files.photo[0].filename, 4], (err, data) => {
                        // console.log(data);
                        if (err) throw err;
                        let sqlQuery = "select * from tbl_visitors where id= ?";
                        con.query(sqlQuery, [data.insertId], (err, visitor) => {
                            // console.log(visitor);
                            if (err) throw err;

                            var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                            con.query(selectQuery, [visitor[0]?.id], (err, result) => {
                                var host_type;
                                if (result.length > 0) {
                                    host_type = 1;
                                }
                                else {
                                    host_type = 0;
                                }
                                const user = {
                                    id: visitor[0]?.id,
                                    login_type: visitor[0]?.login_type,
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Successfully login via Apple!",
                                        data: visitor[0],
                                        token: userdata,
                                        host_type: host_type
                                    })
                                });
                            })
                        })
                    })
                }
            }
            else {
                //console.log(result[0]);
                var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                con.query(selectQuery, [result[0]?.id], (err, results) => {
                    // console.log(results);
                    var host_type;
                    if (results.length > 0) {
                        host_type = 1;
                    }
                    else {
                        host_type = 0;
                    }

                    const user = {
                        id: result[0].id,
                        login_type: result[0]?.login_type
                    };
                    genrateToken(user).then((userdata) => {
                        res.status(200).send({
                            success: true,
                            message: "Successfully login via Apple !",
                            data: result[0],
                            token: userdata,
                            host_type: host_type
                        })
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

const visittohost = async (req, res) => {
    try {
        const { hostName, aboutme, trade_license } = req.body;
        var sql = "select * from tbl_hosts where visitor_id= ?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "You are already logged in as host!"
                })
            }
            else {
                con.query(`insert into tbl_hosts ( visitor_id, trade_license, host_name, about_me ) 
                            values('${req.user.id}','${trade_license}', '${hostName}', '${aboutme}')`, (err, presult) => {
                    if (err) throw err;
                    if (presult.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "You are successfully become a host!"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to become a host!"
                        })
                    }
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

const HostingDetails = async (req, res) => {
    try {
        await con.query(`select tbl_hosting.*, place_list.place_type, country_list.name as country_name, area_list.area_type, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, 
        tbl_visitors.first_name, tbl_visitors.last_name from tbl_hosting 
        INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_hosting.host_id 
        INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id 
        INNER JOIN area_list on area_list.id=tbl_hosting.area_id
        INNER JOIN country_list on country_list.id=tbl_hosting.country_id
        INNER JOIN place_list on place_list.id=tbl_hosting.place_id`, (err, data) => {
            if (err) throw err;
            //console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No hosts Added yet !"
                })
            }
            else {
                //  console.log(data)
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    // console.log(data[i].activities_id !== null )
                    // console.log(data[i].activities_id )
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

                                cuisine_style.push(type[0]);
                                // console.log(cuisine_style)
                            })

                        });
                    }

                    const activities_type = [];
                    if (data[i].activities_id !== null) {
                        //console.log('hii')
                        const arr1 = data[i].activities_id.split(",");
                        //console.log(arr1)
                        arr1.forEach(data => {
                            // console.log(data)
                            var sql1 = `select * from activities_list where id='${data}'`;
                            con.query(sql1, (err, type) => {
                                if (err) throw err;
                                // console.log(type)
                                activities_type.push(type[0].activity_type);
                                //console.log(area_type)
                            })
                        });
                    }

                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        //console.log(result)
                        var images = [];
                        result.forEach(item => {
                            images.push(item.image);

                        })

                        // console.log(images)
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            //  console.log(response);
                            var rules = [];
                            response.forEach(item => {
                                rules.push(item.rules);
                            })
                            con.query(`select * from hosting_dress where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, dressdata) => {
                                if (err) throw err;
                                //  console.log(response);
                                var dress = [];
                                dressdata.forEach(item => {
                                    dress.push(item.dress_code);
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
                                    //console.log(discount)
                                    /* con.query(`select hosting_menu.*, cuisine_list.cuisine_type from hosting_menu 
                                INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, menudata) => {
                                        if (err) throw err;
                                        //console.log(menudata);
                                        if (menudata.length > 0) {

                                            for (const row of menudata) {
                                                const allergenIds = row.allergens_id.split(',').map(Number);
                                                row.allergen_types = allergenIds;
                                            }
                                            const allergenData = {};

                                            for (const row of menudata) {

                                                for (const allergenId of row.allergen_types) {
                                                    row.allergen_types = [];
                                                    if (!allergenData[allergenId]) {
                                                        //console.log(allergenId);
                                                        // Query the allergen table to get allergen data
                                                        const query = 'select id, name from allergens_list WHERE id = ?';
                                                        con.query(query, [allergenId], (err, results) => {
                                                            if (err) {
                                                                console.error('Error querying allergen table:', err);
                                                            } else {
                                                                if (results.length > 0) {
                                                                    const allergen = results[0];

                                                                    row.allergen_types.push(allergen);
                                                                    //  allergenData[allergenId] = allergen;

                                                                } else {
                                                                    // console.warn(`Allergen with ID ${allergenId} not found`);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            var menus = [];
                                            menudata.forEach(item => {
                                                menus.push(item);
                                            })
                                        } */

                                    const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
                                        INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                        INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id 
                                        where hosting_menu.hosting_id='${data[i].id}' and hosting_menu.host_id='${data[i].host_id}'`;

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
                                        con.query(`select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${data[i].id}'`, (err, find) => {
                                            if (err) throw err;
                                            var is_favorite = 0;
                                            if (find.length > 0) {
                                                is_favorite = 1;
                                            }
                                            con.query(`select heading, description from book_requirement`, (err, requr) => {
                                                if (err) throw err;
                                                con.query(`select heading, description from cancel_policy`, (err, canpolicy) => {
                                                    if (err) throw err;
                                                    var values = {
                                                        id: data[i].id,
                                                        host_id: data[i].host_id,
                                                        form_type: data[i].form_type,
                                                        place_type: data[i].place_type,
                                                        country: data[i].country_name,
                                                        state: data[i].state,
                                                        city: data[i].city,
                                                        street: data[i].street,
                                                        building_name: data[i].building_name,
                                                        flat_no: data[i].flat_no,
                                                        address_document: data[i].address_document,
                                                        lat: data[i].lat,
                                                        lng: data[i].lng,
                                                        area_type: data[i].area_type,
                                                        area_video: data[i].area_video,
                                                        no_of_guests: data[i].no_of_guests,
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
                                                        about_me: data[i].about_me,
                                                        first_name: data[i].first_name,
                                                        last_name: data[i].last_name,
                                                        created_at: data[i].created_at,
                                                        updated_at: data[i].updated_at,
                                                        // data: data[i],
                                                        dress_code: dress,
                                                        cuisine_list: cuisine_style,
                                                        activities_type: activities_type,
                                                        area_images: images,
                                                        rules: rules,
                                                        menus: formattedData,
                                                        //discount: discount,
                                                        time_slots: time,
                                                        is_favorite: is_favorite,
                                                        book_requirement: requr[0],
                                                        cancel_policy: canpolicy[0]
                                                    }
                                                    arr.push(values)
                                                })
                                            })
                                            // console.log(menus)
                                        })
                                    })

                                    /*  }) */
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

const Seatbooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { host_id, hosting_id, booking_date, booking_time, adult, child, pets, amount, promo_code, discount_amount, document_name, paymentId, payment_method } = req.body;
        var payment_id = Date.now().toString(36);
        // console.log(req.user)

        if (req.files.identify_document == undefined) {

            var sql = "insert into tbl_booking ( visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets) values (?,?,?,?,?,?,?, ?)";
            con.query(sql, [req.user.id, host_id, hosting_id, booking_date, booking_time, adult, child, pets], (err, result) => {
                if (err) throw err;
                if (result.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        message: "Reservation failed !"
                    })
                }
                else {
                    // var totalAmount;

                    if (promo_code !== undefined && promo_code !== "" && discount_amount !== undefined && discount_amount !== "") {
                        let updateQuery = "update tbl_payment set booking_id=?, host_id=?, payment_id=?,  promo_code=?, discount_amount=?, payment_method=? where id=?";
                        con.query(updateQuery, [result.insertId, host_id, payment_id, promo_code, discount_amount, payment_method, paymentId], (err, details) => {
                            if (err) throw err;
                            if (details.affectedRows > 0) {
                                res.status(200).send({
                                    success: true,
                                    message: "Reservation completed !"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to store data in database!"
                                })
                            }
                        })
                    }
                    else {

                        let InsertQuery = "update tbl_payment set booking_id=?, host_id=?, payment_id=?, payment_method=? where id=?";
                        con.query(InsertQuery, [result.insertId, host_id, payment_id, payment_method, paymentId], (err, details) => {
                            if (err) throw err;
                            if (details.affectedRows > 0) {
                                res.status(200).send({
                                    success: true,
                                    message: "Reservation completed !"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to store data in database!"
                                })
                            }
                        })
                    }
                }
            })
        }
        else {
            let document = req.files.identify_document[0].filename;
            var sql = "insert into tbl_booking ( visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, document_name, document ) values (?,?,?,?,?,?,?,?,?,?)";
            con.query(sql, [req.user.id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, document_name, document], (err, result) => {
                if (err) throw err;
                if (result.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        message: "Reservation failed !"
                    })
                }
                else {
                    // var totalAmount;

                    if (promo_code !== undefined && promo_code !== "" && discount_amount !== undefined && discount_amount !== "") {
                        let updateQuery = "update tbl_payment set booking_id=?, host_id=?, payment_id=?,  promo_code=?, discount_amount=?, payment_method=? where id=?";
                        con.query(updateQuery, [result.insertId, host_id, payment_id, promo_code, discount_amount, payment_method, paymentId], (err, details) => {
                            if (err) throw err;
                            if (details.affectedRows > 0) {
                                res.status(200).send({
                                    success: true,
                                    message: "Reservation completed !"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to store data in database!"
                                })
                            }
                        })
                    }
                    else {

                        let InsertQuery = "update tbl_payment set booking_id=?, host_id=?, payment_id=?, payment_method=? where id=?";
                        con.query(InsertQuery, [result.insertId, host_id, payment_id, payment_method, paymentId], (err, details) => {
                            if (err) throw err;
                            if (details.affectedRows > 0) {
                                res.status(200).send({
                                    success: true,
                                    message: "Reservation completed !"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to store data in database!"
                                })
                            }
                        })
                    }
                }
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

const PreviousBooking = async (req, res) => {
    /* const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = ("0" + (today.getMinutes())).slice(-2)//today.getMinutes();
    let second = today.getSeconds();
    const date_find = year + "-" + month + "-" + date;
    const time = hours + ":" + minutes + ":" + second;
    const date_time = date_find.concat(' ', time); */

    const today = new Date();
    const date = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const time = today.toISOString().slice(11, 19); // Format: HH:MM:SS
    const date_time = `${date} ${time}`;

    let sqlQuery = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, 
    tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile, place_list.place_type,countries.name as country_id,
    states.name as state,
    cities.name as city, tbl_area.area as area, 
    tbl_hosting.street, tbl_hosting.building_name, tbl_hosting.flat_no
    from tbl_booking 
    INNER JOIN tbl_visitors on tbl_booking.host_id=tbl_visitors.id 
    INNER JOIN tbl_hosting on tbl_booking.hosting_id=tbl_hosting.id 
    INNER JOIN place_list on place_list.id=tbl_hosting.place_id 
    INNER JOIN countries on countries.id=tbl_hosting.country_id
    INNER JOIN states on states.id=tbl_hosting.state
    INNER JOIN cities on cities.id=tbl_hosting.city
    INNER JOIN tbl_area on tbl_area.id=tbl_hosting.area
    where visitor_id=? and 
    CONCAT(booking_date, ' ', booking_time) <= ? and tbl_booking.is_deleted=? 
    ORDER BY CONCAT(booking_date, ' ',booking_time) DESC`;

    try {
        await con.query(sqlQuery, [req.user.id, date_time, 0], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(200).send({
                    success: true,
                    message: "No bookings yet",
                    data: data
                })
            }
            else {
                for (let i = 0; i < data.length; i++) {
                    const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE host_id = ? AND rating_by = ? AND is_deleted = ?`;
                    con.query(hostRatingQuery, [data[i].host_id, 2, 0], (err, hostRatingData) => {
                        if (err) throw err;
                        if (hostRatingData[0].overall_rating !== null) {
                            // Create a unique property for each booking
                            data[i].Rating = ((hostRatingData[0].overall_rating).toFixed(1)).toString();
                        } else {
                            data[i].Rating = "";
                        }
                    });
                }
                setTimeout(() => {
                    res.status(200).send({
                        success: true,
                        data: data
                    })
                }, 1000);
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

const upcomingBooking = async (req, res) => {
    /* const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = ("0" + (today.getMinutes())).slice(-2)//today.getMinutes();
    let second = today.getSeconds();
    const date_find = year + "-" + month + "-" + date;
    const time = hours + ":" + minutes + ":" + second;
    const date_time = date_find.concat(' ', time); */

    const today = new Date();
    const date = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const time = today.toISOString().slice(11, 19); // Format: HH:MM:SS
    const date_time = `${date} ${time}`;

    let sqlQuery = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, 
    tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile, place_list.place_type,countries.name as country_id,
    states.name as state,
    cities.name as city, tbl_area.area as area, 
    tbl_hosting.street, tbl_hosting.building_name, tbl_hosting.flat_no
    from tbl_booking 
    INNER JOIN tbl_visitors on tbl_booking.host_id=tbl_visitors.id 
    INNER JOIN tbl_hosting on tbl_booking.hosting_id=tbl_hosting.id 
    INNER JOIN place_list on place_list.id=tbl_hosting.place_id 
    INNER JOIN countries on countries.id=tbl_hosting.country_id
    INNER JOIN states on states.id=tbl_hosting.state
    INNER JOIN cities on cities.id=tbl_hosting.city
    INNER JOIN tbl_area on tbl_area.id=tbl_hosting.area
    where visitor_id=? and 
    CONCAT(booking_date, ' ', booking_time) >= ? and tbl_booking.is_deleted=? 
    ORDER BY CONCAT(booking_date, ' ',booking_time)`;
    try {
        await con.query(sqlQuery, [req.user.id, date_time, 0], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(200).send({
                    success: true,
                    message: "No bookings yet",
                    data: data
                })
            }
            else {
                for (let i = 0; i < data.length; i++) {
                    const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE host_id = ? AND rating_by = ? AND is_deleted = ?`;
                    con.query(hostRatingQuery, [data[i].host_id, 2, 0], (err, hostRatingData) => {
                        if (err) throw err;
                        if (hostRatingData[0].overall_rating !== null) {
                            // Create a unique property for each booking
                            data[i].Rating = ((hostRatingData[0].overall_rating).toFixed(1)).toString();
                        } else {
                            data[i].Rating = "";
                        }
                    });
                }
                setTimeout(() => {
                    res.status(200).send({
                        success: true,
                        data: data
                    })
                }, 1000);
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

const cancelBooking = async (req, res) => {
    const { booking_id, cancel_reason } = req.body;
    try {
        if (!booking_id || !cancel_reason) {
            res.status(400).send({
                success: false,
                message: "Provide booking id or cancellation reason!"
            });
            return; // Added return statement to exit the function if validation fails
        }

        // Get booking details
        let selectQuery = "SELECT * FROM tbl_booking WHERE id=? AND visitor_id=?";
        await con.query(selectQuery, [booking_id, req.user.id], async (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                res.status(400).send({
                    success: false,
                    message: "Booking not found!"
                });
                return; // Added return statement to exit the function if booking not found
            }

            const booking = result[0];
            if (booking.status === 3) {
                res.status(400).send({
                    success: false,
                    message: "Booking has already been cancelled!"
                });
                return; // Added return statement to exit the function if booking is already cancelled
            }

            const currentDate = new Date();
            const bookingDate = new Date(booking.booking_date);

            // Calculate the difference in days between booking date and cancellation date
            const timeDifference = Math.abs(currentDate.getTime() - bookingDate.getTime());
            const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            let refundPercentage = 0;
            let refundType;  //1=full, 2=20% deducted

            // Apply refund policy based on the difference in days
            if (differenceInDays >= 4) {
                refundPercentage = 100;
                refundType = 1;
            } else {
                refundPercentage = 80; // Assuming 80% refund if cancelled within 4 days
                refundType = 2
            }

            // Update booking status and cancellation details
            const updateQuery = "UPDATE tbl_booking SET status=?, cancellation_reason=?, cancelled_by=?, cancel_date=? WHERE id=? AND visitor_id=?";
            await con.query(updateQuery, [3, cancel_reason, 0, currentDate, booking_id, req.user.id], async (err, data) => {
                if (err) throw err;
                if (data.affectedRows > 0) {
                    // Fetch payment details
                    const paymentQuery = "SELECT * FROM tbl_payment WHERE booking_id=?";
                    await con.query(paymentQuery, [booking_id], async (err, resultData) => {
                        if (err) throw err;
                        const payment = resultData[0];

                        // Calculate refund amount
                        let refundAmount = 0;
                        if (payment.discount_amount !== null) {
                            refundAmount = (refundPercentage / 100) * parseFloat(payment.discount_amount);
                        } else {
                            refundAmount = (refundPercentage / 100) * parseFloat(payment.amount);
                        }
                        //res.send(payment.payment_method)
                        // Perform refund or deduction based on payment method
                        if (payment.payment_method.toLowerCase() == "wallet pay") {
                            const selectQuery = `SELECT total_amount FROM wallet_amount WHERE user_id='${req.user.id}'`;

                            con.query(selectQuery, (err, amountdata) => {
                                if (err) throw err;
                                var previous_amount = amountdata[0].total_amount;
                                var newAmount = parseFloat(previous_amount) + refundAmount;
                                // Update total amount in wallet_amount table

                                const updateQuery = `UPDATE wallet_amount SET total_amount=${newAmount} WHERE user_id='${req.user.id}'`;

                                con.query(updateQuery, (err, updatedata) => {
                                    if (err) throw err;

                                    const sqlQuery = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_id, action_type) 
                                                    VALUES (?, ?, ?, ?)`;

                                    con.query(sqlQuery, [req.user.id, refundAmount, resultData[0].payment_id, "Credit"], (err, result1) => {
                                        if (err) throw err;
                                    });

                                    const currentDate = new Date();
                                    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
                                    const updateQuery = `UPDATE tbl_payment SET payment_status="cancelled", refund_date='${formattedDate}' WHERE booking_id='${booking_id}'`;

                                    con.query(updateQuery, (err, data) => {
                                        if (err) throw err;
                                        // Handle the result if needed
                                    });

                                    let message = "";
                                    if (refundType == 1) {
                                        message = `$${refundAmount} has been refunded to your wallet account`;
                                    } else if (refundType == 2) {
                                        message = `Your amount is deducted 20% because you cancelled booking after free cancellation period expire. $${refundAmount} has been refunded to your wallet account.`;
                                    }

                                    res.status(200).send({
                                        success: true,
                                        message: "Booking cancelled successfully",
                                        refund_message: message
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
                                amount: Math.round(refundAmount * 100), // Amount in cents
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

                                let message = "";
                                if (refundType == 1) {
                                    message = `You have received a full refund of $${refundAmount}. It takes 5-10 business days for the refunded amount to appear in your account.`;
                                } else {
                                    message = `Your amount has been deducted by 20% because you canceled the booking after the free cancellation period has ended. You have received a refund of $${refundAmount}. It takes 5-10 working days for the refunded amount to appear in your account.`;
                                }

                                res.status(200).send({
                                    success: true,
                                    message: "Booking cancelled successfully",
                                    refund_message: message
                                });
                            } else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to process refund via Stripe",
                                    refund_message: ""
                                });
                            }
                        }
                        else {
                            res.status(200).send({
                                success: true,
                                message: "Booking cancelled successfully",
                                refund_message: message
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        message: "Failed to cancel booking"
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const favHosting = async (req, res) => {
    const { hosting_id } = req.body;
    try {
        if (!hosting_id) {
            res.status(400).send({
                success: false,
                message: "Provide hosting id !"
            })
        }
        else {
            let selectQuery = `select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${hosting_id}'`;
            await con.query(selectQuery, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    let DeleteQuery = "delete from fav_hosting where visitor_id=? and hosting_id=?";
                    con.query(DeleteQuery, [req.user.id, hosting_id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Successfully removing from favourite"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Failed to remove from favourite"
                            })
                        }
                    })
                }
                else {
                    let InsertQuery = "insert into fav_hosting (visitor_id, hosting_id) values (?,?)";
                    con.query(InsertQuery, [req.user.id, hosting_id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Successfully add to favourite"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Failed to add favourite"
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
            message: error.message
        })
    }
}

const NearbyHosts = async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        await con.query(`select  tbl_hosting.*, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, 
        tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile, 
        (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) AS distance from tbl_hosting 
        INNER JOIN tbl_visitors 
        ON tbl_visitors.id= tbl_hosting.host_id INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id HAVING distance < 10 ORDER BY distance`, [latitude, longitude, latitude], (err, data) => {
            if (err) throw err;

            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Details not found !"
                })
            }
            else {
                var arr = [];
                for (let i = 0; i < data.length; i++) {
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

                                cuisine_style.push(type[0]);
                                // console.log(cuisine_style)
                            })
                        });
                    }
                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        var images = [];
                        result.forEach(item => {
                            images.push({ image_url: "http://suppr.me/images/" + item.image });
                        })
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            var rules = [];
                            response.forEach(item => {
                                rules.push({ rule: item.rules });
                            })
                            con.query(`select * from hosting_dress where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, dressdata) => {
                                if (err) throw err;
                                //  console.log(response);
                                var dress = [];
                                dressdata.forEach(item => {
                                    dress.push({ type: item.dress_code });
                                })

                                /* con.query(`select * from hosting_menu where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, menudata) => {
                                    if (err) throw err;

                                    var menus = [];
                                    // console.log(menudata)
                                    menudata.forEach(item => {
                                        menus.push(item);
                                    }) */
                                const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
                                    INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                    INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id 
                                    where hosting_menu.hosting_id='${data[i].id}' and hosting_menu.host_id='${data[i].host_id}'`;

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
                                    con.query(`select * from time_slots where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeslots) => {
                                        if (err) throw err;

                                        var time_slots = [];
                                        timeslots.forEach(item => {
                                            time_slots.push(item);
                                        })
                                        /* con.query(`select * from discounts where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, discountData) => {
                                            if (err) throw err;
                                            var discount = [];
                                            discountData.forEach(item => {
                                                discount.push(item);
                                            }) */
                                        con.query(`select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${data[i].id}'`, (err, find) => {
                                            if (err) throw err;
                                            var is_favorite = 0;
                                            if (find.length > 0) {
                                                is_favorite = 1;
                                            }
                                            const listArray = [];
                                            con.query(`select heading, description from book_requirement`, (err, requr) => {
                                                if (err) throw err;
                                                if (requr.length > 0) {
                                                    const htmlString = requr[0].description;
                                                    const $ = cheerio.load(htmlString);


                                                    $('li').each((index, element) => {
                                                        listArray.push({ requr: $(element).text() });
                                                    });
                                                    $('p').each((index, element) => {
                                                        listArray.push({ requr: $(element).text() });
                                                    });
                                                }
                                                // console.log(listArray);
                                                const cancelArray = [];
                                                con.query(`select heading, description from cancel_policy`, (err, canpolicy) => {
                                                    if (err) throw err;
                                                    if (canpolicy.length > 0) {
                                                        const htmlString = canpolicy[0].description;
                                                        const $ = cheerio.load(htmlString);

                                                        $('li').each((index, element) => {
                                                            cancelArray.push({ policy: $(element).text() });
                                                        });
                                                        $('p').each((index, element) => {
                                                            cancelArray.push({ policy: $(element).text() });
                                                        });
                                                    }
                                                    const interests = [];
                                                    con.query(`select * from interest_list where is_deleted='${0}'`, (err, interest) => {
                                                        if (err) throw err;
                                                        interest.forEach((item) => {
                                                            interests.push({ name: item.interest_name })
                                                        })
                                                        var values = {
                                                            id: data[i].id,
                                                            host_id: data[i].host_id,
                                                            place_type: data[i].place_type,
                                                            country: data[i].country,
                                                            state: data[i].state,
                                                            city: data[i].city,
                                                            street: data[i].street,
                                                            building_name: data[i].building_name,
                                                            flat_no: data[i].flat_no,
                                                            address_document: data[i].address_document,
                                                            lat: data[i].lat,
                                                            lng: data[i].lng,
                                                            area_type: data[i].area_type,
                                                            area_video: data[i].area_video,
                                                            no_of_guests: data[i].no_of_guests,
                                                            activities: data[i].activities,
                                                            no_of_courses: data[i].no_of_courses,
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
                                                            about_me: data[i].about_me,
                                                            first_name: data[i].first_name,
                                                            last_name: data[i].last_name,
                                                            profile: data[i].profile,
                                                            created_at: data[i].created_at,
                                                            updated_at: data[i].updated_at,
                                                            // details: data[i],
                                                            cuisine_list: cuisine_style,
                                                            dress_code: dress,
                                                            area_images: images,
                                                            rules: rules,
                                                            menus: formattedData,
                                                            // cuisines: cuisines,
                                                            time_slots: time_slots,
                                                            //discount: discount,
                                                            is_favorite: is_favorite,
                                                            book_requirement: listArray,
                                                            cancel_policy: cancelArray,
                                                            interests: interests,
                                                            distance: data[i].distance
                                                        }
                                                        arr.push(values)
                                                    })
                                                })
                                            })
                                        })
                                        /* }) */
                                    })
                                })
                            })
                        })
                    });
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

const changeBookingDate = async (req, res) => {
    const { booking_id, booking_date, booking_time } = req.body;
    console.log(req.body);
    try {
        let updateQuery = `update tbl_booking set new_booking_date=?, new_booking_time=?, is_date_changed=?, status=? where id=?`;
        await con.query(updateQuery, [booking_date, booking_time, 1, 0, booking_id], (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    message: "Booking date changed successfully !"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Failed to changed booking date !"
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

const giveHostRating = async (req, res) => {
    try {
        const { hosting_id, cleanness, quality_of_food, space } = req.body;

        const sql = 'INSERT INTO hosting_ratings (visitor_id, hosting_id, cleanness, quality_of_food, space) VALUES (?, ?, ?, ?, ?)';
        const values = [req.user.id, hosting_id, cleanness, quality_of_food, space];

        con.query(sql, values, (err, result) => {

            if (err) throw err;
            if (result.affectedRows > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Rating submitted successfully'
                });

            } else {
                res.status(400).json({
                    success: false,
                    message: 'Failed to submit rating'
                });
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

const getHostingRating = async (req, res) => {
    try {
        const { hosting_id } = req.body;

        const sql = `SELECT IFNULL(CONCAT(FORMAT((AVG(cleanness) / 5) * 100, 0), '%'), null) AS cleanness,
        IFNULL(CONCAT(FORMAT((AVG(quality_of_food) / 5) * 100, 0), '%'), null) AS quality_of_food,
        IFNULL(CONCAT(FORMAT((AVG(space) / 5) * 100, 0), '%'), null) AS space
        FROM hosting_ratings WHERE hosting_id = ?`;

        await con.query(sql, [hosting_id], (err, data) => {
            if (err) throw err;

            var rating = {
                cleanness: data[0].cleanness,
                quality_of_food: data[0].quality_of_food,
                space: data[0].space,
            };

            res.status(200).send({
                success: true,
                ratings: rating,
            });
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// Function to check for and remove expired OTPs after 1 minute
function formatTimestampToDatabaseFormat(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to check for and remove expired OTPs after 1 minute
function checkAndRemoveExpiredOTPs() {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 5);

    const formattedOneMinuteAgo = formatTimestampToDatabaseFormat(oneMinuteAgo);
    const deleteExpiredQuery = 'DELETE FROM tbl_otps WHERE created_at < ?';
    con.query(deleteExpiredQuery, [formattedOneMinuteAgo], (err, result) => {
        if (err) throw err;
    });
}

setInterval(checkAndRemoveExpiredOTPs, 60000);


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
        const sqlQuery = `select * from tbl_visitors where email=?`;
        await con.query(sqlQuery, [email], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
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
                            <p class="message">This OTP will expire in 5 minutes.</p>
                            <p>If you didn't request a password reset, you can ignore this email.</p>
                            <p>Thank you!</p>
                            <div class="footer">&copy; 2023 Suppr. All rights reserved. </div>
                        </section>
                    </div>
                </body>
                </html>
                `;
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

const verifyOtp = async (req, res) => {
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
                const selectQuery = `select * from tbl_visitors where email=?`;
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

const UserResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { user_id, newpassword } = req.body;
        const sqlQuery = `select * from tbl_visitors where id=?`;
        await con.query(sqlQuery, [user_id], (err, result) => {
            if (err) throw err;
            bcrypt.hash(newpassword, 10, (err, password) => {
                if (err) throw err;
                const updateQuery = `update tbl_visitors set password =? where id=?`;
                con.query(updateQuery, [password, user_id], (err, data) => {
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
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

// SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC

const TransactionHistory = async (req, res) => {
    try {
        const sqlQuery = `SELECT *, DATE_FORMAT(tbl_payment.payment_date, '%d %M %Y') as payment_date FROM tbl_payment WHERE visitor_id = ? ORDER BY created_at DESC`;
        await con.query(sqlQuery, [req.user.id], (err, details) => {
            if (err) throw err;
            if (details.length > 0) {
                res.status(200).send({
                    success: true,
                    message: "",
                    data: details
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "No history found",
                    data: details
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

const DeactivateProfile = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            message: "Please provide user id "
        })
    }
    try {
        const sqlQuery = `select is_deactivate from tbl_visitors where id=?`;
        await con.query(sqlQuery, [user_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deactivate == 1) {
                    res.status(400).send({
                        success: false,
                        message: "Your account is alreday deactivated"
                    })
                }
                else {
                    const updateQuery = `update tbl_visitors set is_deactivate=? where id=?`;
                    con.query(updateQuery, [1, user_id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Your account has been successfully deactivated"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Failed to deactivate profile"
                            })
                        }
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "User does not exist"
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

const GetOfficialDocument = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide user id"
            })
        }
        const selectQuery = `select Identify_name, Identify_document from tbl_visitors where id=?`;
        await con.query(selectQuery, [user_id], (err, data) => {
            if (err) throw err;
            //  console.log(data);
            if (data.length > 0) {
                if (data[0].Identify_document == '') {
                    res.status(200).send({
                        success: true,
                        message: "No document found",
                        document: data[0]
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        message: "Document are already updated",
                        document: data[0]
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "User id doesn't exist"
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

const payment = async (req, res) => {
    try {
        const type = req.body.type;
        const paymentIntentId = req.body.paymentIntentId;
        const user_id = req.body.user_id;
        const email = req.body.email;
        const status = req.body.status;
        const host_id = req.body.host_id;
        const hosting_id = req.body.hosting_id;
        const booking_date = req.body.booking_date;
        const booking_time = req.body.booking_time;
        const adult = req.body.adult;
        const child = req.body.child;
        const pets = req.body.pets;
        const amount = req.body.amount;
        const promo_code = req.body.promo_code;
        const discount_amount = req.body.discount_amount;
        const paymentId = req.body.paymentId;
        const payment_method = req.body.payment_method;
        // console.log(req.body);
        // console.log(user_id);
        // console.log(email);
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        var payment_id = Date.now().toString(36);
        var error;
        if (paymentIntent.last_payment_error !== null) {
            error = paymentIntent.last_payment_error.message;
        }
        /* const query = 'INSERT INTO tbl_payment (visitor_id, amount, transaction_id, receipt_email, payment_status) VALUES (?, ?, ?, ?, ?)';
        const values = [user_id, paymentIntent.amount / 100, paymentIntent.id, email, status];
        con.query(query, values, (error, results, fields) => {
            if (error) {
                console.error('Error storing payment in MySQL:', error);
                res.status(500).json({ success: false, error: error.message });
                return;
            }
            console.log('Payment stored in MySQL');
            res.status(200).send({ success: true, data: paymentIntent, payment_id: results.insertId });
        }); */
        if (type == 1) {
            var sql = "insert into tbl_booking ( visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets) values (?,?,?,?,?,?,?, ?)";
            con.query(sql, [user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets], (err, result) => {
                if (err) throw err;
                if (result.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        message: "Reservation failed !"
                    })
                }
                else {
                    // var totalAmount;

                    if (promo_code !== undefined && promo_code !== "" && discount_amount !== undefined && discount_amount !== "") {
                        let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, transaction_id, amount, receipt_email, promo_code, discount_amount, payment_method, payment_status, payment_mode) values (?,?,?,?,?,?,?,?,?,?,?,?)";
                        con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, paymentIntent.id, paymentIntent.amount / 100, email, promo_code, discount_amount, payment_method, status, "Test mode"], (err, details) => {
                            if (err) throw err;
                            console.log('Payment stored in MySQL');
                            res.status(200).send({ success: true, payment_status: status, paymentIntent_error: error });
                        })
                    }
                    else {

                        let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, transaction_id, amount, receipt_email, payment_method, payment_status, payment_mode) values (?,?,?,?,?,?,?,?,?,?)";
                        con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, paymentIntent.id, paymentIntent.amount / 100, email, payment_method, status, "Test mode"], (err, details) => {
                            if (err) throw err;
                            console.log('Payment stored in MySQL');
                            res.status(200).send({ success: true, payment_status: status, paymentIntent_error: error });
                        })
                    }
                }
            })
        }
        else {
            if (promo_code !== undefined && promo_code !== "" && discount_amount !== undefined && discount_amount !== "") {
                let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, transaction_id, amount, receipt_email, promo_code, discount_amount, payment_method, payment_status, payment_mode) values (?,?,?,?,?,?,?,?,?,?,?,?)";
                con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, paymentIntent.id, paymentIntent.amount / 100, email, promo_code, discount_amount, payment_method, status, "Test mode"], (err, details) => {
                    if (err) throw err;
                    console.log('Payment stored in MySQL');
                    res.status(200).send({ success: true, payment_status: status, paymentIntent_error: paymentIntent.last_payment_error });
                })
            }
            else {

                let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, transaction_id, amount, receipt_email, payment_method, payment_status, payment_mode) values (?,?,?,?,?,?,?,?,?,?)";
                con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, paymentIntent.id, paymentIntent.amount / 100, email, payment_method, status, "Test mode"], (err, details) => {
                    if (err) throw err;
                    console.log('Payment stored in MySQL');
                    res.status(200).send({ success: true, payment_status: status, paymentIntent_error: paymentIntent.last_payment_error });
                })
            }
        }
    } catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const uploadDocumnet = async (req, res) => {
    try {
        const { user_id, Identify_name } = req.body;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide user_id"
            })
        }
        if (!req.files.identify_document) {
            return res.status(400).send({
                success: false,
                message: "Please provide identify_document"
            })
        }
        const selectQuery = `select * from tbl_hosts where visitor_id='${user_id}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                let document = req.files.identify_document[0].filename;
                con.query(`update tbl_hosts set trade_license='${document}' where visitor_id='${user_id}'`, (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "Document uploaded successfully"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to upload document"
                        })
                    }
                })
            }
            else {
                let document = req.files.identify_document[0].filename;
                con.query(`update tbl_visitors set Identify_name='${Identify_name}', Identify_document='${document}' where id='${user_id}'`, (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "Document uploaded successfully"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to upload document"
                        })
                    }
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

const walletPayment = async (req, res) => {
    try {
        const type = req.body.type;
        const paymentIntentId = req.body.paymentIntentId;
        const user_id = req.body.user_id;
        const status = req.body.status;
        const amount = req.body.amount;
        const payment_method = req.body.payment_method;

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        //  console.log(paymentIntent);
        var payment_id = Date.now().toString(36);
        var error;

        if (paymentIntent.last_payment_error !== null) {
            error = paymentIntent.last_payment_error.message;
        }

        // Retrieve total amount from database
        if (type == 1) {
            const selectQuery = `SELECT total_amount FROM wallet_amount WHERE user_id='${user_id}'`;
            const data = await con.query(selectQuery, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    var previous_amount = data[0].total_amount;
                    var newAmount = parseFloat(previous_amount) + parseFloat(paymentIntent.amount / 100);
                    // Update total amount in wallet_amount table
                    const updateQuery = `UPDATE wallet_amount SET total_amount=${newAmount} WHERE user_id='${user_id}'`;
                    con.query(updateQuery, (err, updatedata) => {
                        if (err) throw err;
                    });

                    // Insert payment record into wallet_pay table
                    const sql = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_method, payment_status, transaction_id, currency, payment_mode, payment_id, action_type) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    con.query(sql, [user_id, paymentIntent.amount / 100, payment_method, status, paymentIntent.id, paymentIntent.currency, "Test Mode", payment_id, "Credit"], (err, result1) => {
                        if (err) throw err;
                    });

                    res.status(200).send({ success: true, payment_status: status, paymentIntent_error: paymentIntent.last_payment_error });
                } else {
                    // If no record found, insert new record into wallet_amount table
                    const insertQuery = `INSERT INTO wallet_amount (user_id, total_amount, currency) VALUES (?, ?, ?)`;
                    con.query(insertQuery, [user_id, paymentIntent.amount / 100, paymentIntent.currency], (err, insertData) => {
                        if (err) throw err;
                    });

                    // Insert payment record into wallet_pay table
                    const sql = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_method, payment_status, currency, transaction_id, payment_mode, payment_id, action_type) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    con.query(sql, [user_id, paymentIntent.amount / 100, payment_method, status, paymentIntent.currency, paymentIntent.id, "Test Mode", payment_id, "Credit"]), (err, data1) => {
                        if (err) throw err;
                    };

                    res.status(200).send({ success: true, payment_status: status, paymentIntent_error: paymentIntent.last_payment_error });
                }
            });
        }
        else {
            const sql = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_method, payment_status, transaction_id, currency, payment_mode, payment_id, action_type) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            con.query(sql, [user_id, paymentIntent.amount / 100, payment_method, status, paymentIntent.id, paymentIntent.currency, "Test Mode", payment_id, "Credit"]), (err, data1) => {
                if (err) throw err;
            };

            res.status(200).send({ success: true, payment_status: status, paymentIntent_error: paymentIntent.last_payment_error });
        }

    } catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getWalletAmount = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide user_id"
            });
        }

        var total_amount = "0"; // Initialize outside the query callback

        await con.query(`SELECT total_amount FROM wallet_amount WHERE user_id='${user_id}'`, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                total_amount = data[0].total_amount; // Assign value here
                res.status(200).send({
                    success: true,
                    total_amount: total_amount
                });
            } else {
                res.status(200).send({
                    success: true,
                    total_amount: total_amount
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

const seatBookingWithWallet = async (req, res) => {
    try {
        const { user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, amount,
            promo_code, discount_amount, payment_method } = req.body;

        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide user_id"
            });
        } if (!host_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide host_id"
            });
        }
        var payment_id = Date.now().toString(36);
        if (promo_code !== undefined && promo_code !== "" && discount_amount !== undefined && discount_amount !== "") {
            con.query(`select * from wallet_amount where user_id='${user_id}'`, (err, amountdata) => {
                if (err) throw err;
                // res.send(amountdata)
                if (amountdata.length > 0) {

                    if (parseFloat(amountdata[0].total_amount) >= parseFloat(discount_amount)) {
                        var previous_amount = amountdata[0].total_amount;
                        // console.log(typeof(amount));
                        var newAmount = parseFloat(previous_amount) - parseFloat(discount_amount);
                        // console.log(typeof (newAmount));
                        // console.log(newAmount);
                        const updateQuery = `UPDATE wallet_amount SET total_amount=${newAmount} WHERE user_id='${user_id}'`;
                        con.query(updateQuery, (err, updatedata) => {
                            if (err) throw err;
                        })

                        const sql = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_method, payment_status, currency, payment_mode, payment_id, action_type) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                        con.query(sql, [user_id, discount_amount, payment_method, "successed", "usd", "Test Mode", payment_id, "Debit"]), (err, data1) => {
                            if (err) throw err;
                        };
                        var sqlQuery = "insert into tbl_booking (visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets) values (?,?,?,?,?,?,?,?)";
                        con.query(sqlQuery, [user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets], (err, result) => {
                            if (err) throw err;

                            let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, amount, promo_code, discount_amount, payment_method, payment_status) values (?,?,?,?,?,?,?,?,?)";
                            con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, amount, promo_code, discount_amount, payment_method, "succeeded"], (err, details) => {
                                if (err) throw err;

                            })
                        })
                        res.status(200).send({
                            success: true,
                            message: "Reservation completed !",
                            message1: "Hello, Your reservation has been successfully completed! We're excited to welcome you on your booking date for your Reservation. If you have any questions or need further assistance, feel free to contact us. See you soon!"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Insufficient amount in your wallet",
                            message1: ""
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Insufficient amount in your wallet",
                        message1: ""
                    })
                }
            })
        }
        else {
            con.query(`select * from wallet_amount where user_id='${user_id}'`, (err, amountdata) => {
                if (err) throw err;
                if (amountdata.length > 0) {
                    //  console.log(amountdata[0].total_amount);
                    if (parseFloat(amountdata[0].total_amount) >= parseFloat(amount)) {
                        var previous_amount = amountdata[0].total_amount;
                        // console.log(typeof(amount));
                        var newAmount = parseFloat(previous_amount) - parseFloat(amount);
                        // console.log(typeof (newAmount));
                        // console.log(newAmount);
                        const updateQuery = `UPDATE wallet_amount SET total_amount=${newAmount} WHERE user_id='${user_id}'`;
                        con.query(updateQuery, (err, updatedata) => {
                            if (err) throw err;
                        });

                        // Insert payment record into wallet_pay table
                        const sqlQuery = `INSERT INTO wallet_pay (user_id, wallet_amount, payment_method, payment_status, currency, payment_id, action_type) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        con.query(sqlQuery, [user_id, amount, payment_method, "succeeded", "usd", payment_id, "Debit"], (err, result1) => {
                            if (err) throw err;
                        });
                        var sql = "insert into tbl_booking ( visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets) values (?,?,?,?,?,?,?, ?)";
                        con.query(sql, [user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets], (err, result) => {
                            if (err) throw err;
                            let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, amount,  payment_method, payment_status) values (?,?,?,?,?,?,?)";
                            con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, amount, payment_method, "succeeded"], (err, details) => {
                                if (err) throw err;

                            })
                        })
                        res.status(200).send({
                            success: true,
                            message: "Reservation completed !",
                            message1: "Hello, Your reservation has been successfully completed! We're excited to welcome you on your booking date for your Event/Reservation. If you have any questions or need further assistance, feel free to contact us. See you soon!"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Insufficient amount in your wallet",
                            message1: ""
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Insufficient amount in your wallet",
                        message1: ""
                    })
                }
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

const walletHistory = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide user_id"
            });
        }
        await con.query(`select * from wallet_pay where user_id='${user_id}' ORDER BY payment_date DESC;`, (err, data) => {
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
                    message: "Transaction history is not available"
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

const seatBookingWithGooglePay = async (req, res) => {
    try {
        const { user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, amount,
            promo_code, discount_amount, payment_method, token, payment_status } = req.body;

        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide user_id"
            });
        } if (!host_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide host_id"
            });
        }
        var payment_id = Date.now().toString(36);
        if (promo_code !== undefined && promo_code !== "" && discount_amount !== undefined && discount_amount !== "") {
            var sqlQuery = "insert into tbl_booking (visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets) values (?,?,?,?,?,?,?,?)";
            con.query(sqlQuery, [user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets], (err, result) => {
                if (err) throw err;

                let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, transaction_id, amount, promo_code, discount_amount, payment_method, payment_status) values (?,?,?,?,?,?,?,?,?,?)";
                con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, token, amount, promo_code, discount_amount, payment_method, payment_status], (err, details) => {
                    if (err) throw err;

                })
            })
            res.status(200).send({
                success: true,
                message: "Reservation completed !"
            })
        }
        else {
            var sql = "insert into tbl_booking ( visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets) values (?,?,?,?,?,?,?, ?)";
            con.query(sql, [user_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets], (err, result) => {
                if (err) throw err;
                let insertQuery = "Insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, transaction_id, amount,  payment_method, payment_status) values (?,?,?,?,?,?,?,?)";
                con.query(insertQuery, [result.insertId, user_id, host_id, payment_id, token, amount, payment_method, payment_status], (err, details) => {
                    if (err) throw err;

                })
            })
            res.status(200).send({
                success: true,
                message: "Reservation completed !"
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


module.exports = {
    Register, Login, newAccessToken, logout, ChangePassword, EditProfile, GetProfile,
    GoogleLogin, FacebookLogin, AppleLogin, visittohost, Seatbooking, PreviousBooking, upcomingBooking, cancelBooking,
    favHosting, HostingDetails, NearbyHosts, changeBookingDate, giveHostRating, getHostingRating,
    forgotPassword, UserResetPassword, verifyOtp, TransactionHistory, DeactivateProfile, GetOfficialDocument,
    payment, uploadDocumnet, walletPayment, getWalletAmount, seatBookingWithWallet, walletHistory, seatBookingWithGooglePay
}
