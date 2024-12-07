const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const { log, error } = require('console');
const cheerio = require('cheerio');
const { create } = require('domain');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

const HostRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, password, confirm_password, phoneNo, hostName, aboutme } = req.body;
    if (password !== confirm_password) {
        return res.status(400).send({
            success: false,
            message: "New password and confirm password doesn't match !"
        })
    }
    var encrypassword = await hashPassword(password);
    try {
        await con.query(`select * from  tbl_visitors where email='${email}' and is_deleted='${0}'`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "Email is already exists"
                })
            }
            else {
                con.query(`select * from  tbl_visitors where mobile_no='${phoneNo}' and is_deleted='${0}'`, (err, result1) => {
                    if (err) throw err;
                    if (result1.length > 0) {
                        res.status(400).send({
                            success: false,
                            message: "Phone number is already exists"
                        })
                    }
                    else {
                        //  console.log(req.files.trade_license);
                        if (req.files.tradelicense == undefined) {
                            var sql = "Insert into tbl_visitors (first_name, last_name, mobile_no, email, password,  login_type) values(?,?,?,?,?,?)";
                            con.query(sql, [firstname, lastname, phoneNo, email, encrypassword, 1], (err, presult) => {
                                if (err) throw err;
                                if (presult.insertId > 0) {
                                    con.query(`insert into tbl_hosts ( visitor_id, host_name, about_me) 
                                    values( '${presult.insertId}', '${hostName}', '${aboutme}')`, (err, presult) => {
                                        if (err) throw err;
                                        if (presult.affectedRows > 0) {
                                            res.status(200).send({
                                                success: true,
                                                message: "Your account has been successfully created !"
                                            })
                                        }
                                        else {
                                            res.status(400).send({
                                                success: false,
                                                message: "Failed to create account !"
                                            })
                                        }
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        success: false,
                                        message: "Failed to create account !"
                                    })
                                }
                            })
                        }
                        else {
                            var sql = "Insert into tbl_visitors (first_name, last_name, mobile_no, email, password,  login_type) values(?,?,?,?,?,?)";
                            con.query(sql, [firstname, lastname, phoneNo, email, encrypassword, 1], (err, presult) => {
                                if (err) throw err;
                                if (presult.insertId > 0) {
                                    con.query(`insert into tbl_hosts ( visitor_id, host_name, about_me, trade_license) 
                                    values( '${presult.insertId}', '${hostName}', '${aboutme}', '${req.files.tradelicense[0].filename}' )`, (err, presult) => {
                                        if (err) throw err;
                                        if (presult.affectedRows > 0) {
                                            res.status(200).send({
                                                success: true,
                                                message: "Your account has been successfully created !"
                                            })
                                        }
                                        else {
                                            res.status(400).send({
                                                success: false,
                                                message: "Failed to create account !"
                                            })
                                        }
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        success: false,
                                        message: "Failed to create account !"
                                    })
                                }
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

const addHosting = async (req, res) => {
    try {
        const { hosting_id, place_id, country_id, state, city, area, street, building_name, flat_no, lat, lng, area_id,
            no_of_guests, activities_id, description, dress_code, rules, cuisine_style,
            fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
            bank_swift_code, account_currency, form_type, condition, discount } = req.body;

        const dishes123 = [
            {
                "Cuisine_id": "15",
                "no_of_courses": "3",
                "dishes": [
                    {
                        "name": "Dish_1",
                        "allegen": "1",
                        "dish_picture": "https://suppr.me/images/1695291550525-image.jpeg"
                    },
                    {
                        "name": "Dish_2",
                        "allegen": "3",
                        "dish_picture": "https://suppr.me/images/1695096992496-Screenshot%202023-08-19%20105118.png"
                    },
                    {
                        "name": "Dish_3",
                        "allegen": "4",
                        "dish_picture": "https://suppr.me/images/1695114108442-3.png"
                    }
                ]
            },
            {
                "Cuisine_id": "16",
                "no_of_courses": "2",
                "dishes": [
                    {
                        "name": "Dish_1",
                        "allegen": "2",
                        "dish_picture": "http://suppr.me/images/1695207351974-Screenshot_20230619_145928_Camera.jpg"
                    },
                    {
                        "name": "Dish_2",
                        "allegen": "3",
                        "dish_picture": "http://suppr.me/images/1695212797344-processed-c2d47711-85b2-4388-b740-9698d1c51a83_IwP6F9Bb-1.jpeg"
                    }
                ]
            }
        ]
        /*
        const time_slot = [
            {
                "day": "monday",
                "cuisine_id": "15",
                "opening_time": "05:00:00",
                "closing_time": "10:00:00",
            },
            {
                "day": "Tuesday",
                "cuisine_id": "16",
                "opening_time": "05:00:00",
                "closing_time": "10:00:00",
            },
            {
                "day": "wednesday",
                "cuisine_id": "15",
                "opening_time": "05:00:00",
                "closing_time": "10:00:00",
            },
        ]
 
        const discounts = [
            {
                "conditions": "monday",
                "discount": "15"
            },
            {
                "conditions": "monday",
                "discount": "15"
            },
            {
                "conditions": "monday",
                "discount": "15"
            },
        ]
 
        const activities = [
            9,
            10,
            11
        ]
 
        const ruless = [
            "rule1",
            "rule2",
            "rule3"
        ]
 
        const cuisines = [
            15,
            16
        ] 
        
        const dress_code=[
            "casual"
        ]
        
        */

        var dishe = req.body.menu_dishes;
        var time = req.body.time_slot;
        // var discount_condi = req.body.discounts;
        // console.log(typeof(activities_id)) 

        let cuisine;
        if (cuisine_style !== undefined && cuisine_style !== '') {
            const cuisineArray = JSON.parse(cuisine_style);
            cuisine = cuisineArray.join(',');
        }

        let activitiy;

        if (activities_id !== undefined && activities_id !== '') {
            const numberArray = JSON.parse(activities_id);
            activitiy = numberArray.join(',');
        }

        let time_data;
        if (time !== undefined && time !== '') {
            time_data = JSON.parse(time);
            //console.log(time_data)
        }

        /*  let discounts_data;
         if (discount_condi !== undefined && discount_condi !== '') {
             discounts_data = JSON.parse(discount_condi);
         } */

        let rules_data;
        if (rules !== undefined && rules !== '') {
            rules_data = JSON.parse(rules);
            // console.log(rules_data);
        }

        let dress_data;
        if (dress_code !== undefined && dress_code !== '') {
            dress_data = JSON.parse(dress_code);
            // console.log(rules_data);
        }

        let address_document;
        if (req.files.address_document !== undefined) {
            address_document = req.files.address_document[0].filename;
        }

        let dish_data;
        if (dishe !== undefined && dishe !== '') {
            dish_data = JSON.parse(dishe);
        }

        /* var data=`${req.body.data}`;
        console.log(data);
        const split_string = data.split(",");
        console.log(split_string)  */

        if (hosting_id == undefined || hosting_id == '') {

            //let address_document = req.files.address_document[0].filename;
            // let area_video = req.files.area_video[0].filename;
            //console.log(place_id === '' || place_id === undefined)
            if (place_id === '' || place_id === undefined) {
                var InsertQuery = `insert into tbl_hosting ( host_id, place_id, form_type) values(?,?,?)`;
                await con.query(InsertQuery, [req.user.id, 0, form_type], (err, result) => {

                    if (err) throw err;
                    let selectQuery = `select * from tbl_hosting where host_id=? and id=?`
                    con.query(selectQuery, [req.user.id, result.insertId], (err, data) => {
                        if (err) throw err;
                        //console.log(data);
                        var status = "Incomplete";
                        if (data[0].form_type == 13) {
                            status = "Complete";
                        }
                        res.status(200).send({
                            success: true,
                            data: data[0],
                            status: status
                        })
                    })
                })
            }
            else {
                var InsertQuery = `insert into tbl_hosting ( host_id, place_id, form_type) values(?,?,?)`;
                await con.query(InsertQuery, [req.user.id, place_id, form_type], (err, result) => {

                    if (err) throw err;

                    if (result.affectedRows > 0) {
                        // console.log(req.files.area_image)
                        let selectQuery = `select tbl_hosting.*, place_list.place_type as place_id from tbl_hosting
                    INNER JOIN place_list on place_list.id=tbl_hosting.place_id where tbl_hosting.host_id=? and tbl_hosting.id=?`
                        con.query(selectQuery, [req.user.id, result.insertId], (err, data) => {
                            if (err) throw err;
                            // console.log(data[0].form_type);
                            var status = "Incomplete";
                            if (data[0].form_type == 13) {
                                status = "Complete";
                            }
                            res.status(200).send({
                                success: true,
                                data: data[0],
                                status: status
                            })

                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to insert details !"
                        })
                    }
                })
            }

        }
        else {
            const menus = [];

            if (form_type !== '' && form_type !== undefined) {
                var UpdateQuery = `update tbl_hosting set form_type=? where id=?`;
                con.query(UpdateQuery, [form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }


            if (place_id !== '' && place_id !== undefined) {
                var UpdateQuery = `update tbl_hosting set place_id=?, form_type=? where id=?`;
                con.query(UpdateQuery, [place_id, form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }


            if (country_id !== '' && country_id !== undefined && state !== '' && state !== undefined && city !== '' && city !== undefined && street !== '' && street !== undefined && building_name !== '' && building_name !== undefined && flat_no !== '' && flat_no !== undefined && address_document !== '' && address_document !== undefined) {

                var UpdateQuery = `update tbl_hosting set country_id=?, state=?, city=?, area=?,
                street=?, building_name=?, flat_no=?, address_document=?, form_type=? where id=?`;
                con.query(UpdateQuery, [country_id, state, city, area, street, building_name,
                    flat_no, address_document, form_type, hosting_id], (err, result) => {
                        if (err) throw err;
                    })
            }

            if (lat !== '' && lat !== undefined && lng !== '' && lng !== undefined) {
                var UpdateQuery = `update tbl_hosting set lat=?, lng=?, form_type=? where id=?`;
                con.query(UpdateQuery, [lat, lng, form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }


            if (area_id !== '' && area_id !== undefined) {
                var UpdateQuery = `update tbl_hosting set area_id=?, form_type=? where id=?`;
                con.query(UpdateQuery, [area_id, form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                    // res.send('area')
                })
            }
            if (description !== '' && description != undefined) {
                var UpdateQuery = `update tbl_hosting set description=?, form_type=? where id=?`;
                con.query(UpdateQuery, [description, form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                    // res.send('area')
                })
            }

            if (req.files.area_image !== undefined) {
                var Query = `delete from hosting_images where hosting_id=?`;
                con.query(Query, [hosting_id], (err, data) => {
                    if (err) throw err;
                });

                let area_images = req.files.area_image;
                area_images.forEach(image => {
                    var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                    con.query(Query, [req.user.id, hosting_id, image.filename], (err, data) => {
                        if (err) throw err;
                        // res.send('image')
                    });
                })
            }
            if (req.files.area_video !== undefined) {
                // console.log(req.files.area_video[0].filename);
                var UpdateQuery = `update tbl_hosting set area_video=? where id=?`;
                con.query(UpdateQuery, [req.files.area_video[0].filename, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }

            // console.log(rules)
            if (rules_data !== undefined) {
                var deleteQuery = `delete from hosting_rules where hosting_id=?`;
                con.query(deleteQuery, [hosting_id], (err, data1) => {
                    if (err) throw err;
                })

                var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;

                var Rules = rules_data;
                // console.log(typeof(Rules));
                Rules.forEach(Rule => {
                    con.query(Query2, [req.user.id, hosting_id, Rule], (err, data1) => {
                        if (err) throw err;
                    })
                })
            }

            if (no_of_guests !== undefined && no_of_guests !== '') {
                var UpdateQuery = `update tbl_hosting set no_of_guests=? where id=?`;
                con.query(UpdateQuery, [no_of_guests, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }

            if (activities_id !== '' && activities_id !== undefined) {
                var UpdateQuery = `update tbl_hosting set activities_id=? where id=?`;
                con.query(UpdateQuery, [activitiy, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }

            /* if (dress_code !== '' && dress_code !== undefined) {
                var UpdateQuery = `update tbl_hosting set dress_code=? where id=?`;
                con.query(UpdateQuery, [dress_code, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            } */

            if (dress_data !== undefined) {

                var deleteQuery = `delete from  hosting_dress where hosting_id=?`;
                con.query(deleteQuery, [hosting_id], (err, data1) => {
                    if (err) throw err;
                })

                var Query2 = `insert into  hosting_dress (host_id, hosting_id, dress_code) values(?,?,?)`;

                var dresses = dress_data;
                // console.log(typeof(Rules));
                dresses.forEach(dress => {
                    con.query(Query2, [req.user.id, hosting_id, dress], (err, data1) => {
                        if (err) throw err;
                    })
                })
            }

            if (cuisine_style !== '' && cuisine_style !== undefined) {
                var UpdateQuery = `update tbl_hosting set cuisine_style=? where id=?`;
                con.query(UpdateQuery, [cuisine, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }
            const formattedData = [];

            if (dish_data !== undefined) {
                const deleteQuery = `DELETE FROM hosting_menu WHERE host_id=? AND hosting_id=?`;

                try {
                    await con.query(deleteQuery, [req.user.id, hosting_id]);
                } catch (error) {
                    console.error("Error deleting existing data:", error);
                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                }

                async function insertData(data) {
                    const dish_pics = req.files.dish_picture || [];

                    if (dish_pics.length === 0) {
                        console.error("No images available for insertion");
                        return res.status(400).json({ success: false, error: "No images available" });
                    }

                    let imageIndex = 0;

                    for (let i = 0; i < data.length; i++) {
                        const cuisine = data[i];
                        console.log(`Inserting dishes for cuisine ${cuisine.Cuisine_id}`);
                        const cuisineId = cuisine.Cuisine_id;
                        const no_of_courses = cuisine.no_of_courses;
                        const dishes = cuisine.dishes;

                        for (let j = 0; j < dishes.length; j++) {
                            const dish = dishes[j];
                            const { dish_type, dish_desc, allegen, name } = dish;

                            if (imageIndex < dish_pics.length) {
                                const dish_pic = dish_pics[imageIndex];

                                const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_type, dish_desc, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                                const values = [
                                    req.user.id,
                                    hosting_id,
                                    cuisineId,
                                    no_of_courses,
                                    dish_type,
                                    dish_desc,
                                    name,
                                    allegen.join(','), // assuming allegen is an array
                                    dish_pic.filename,
                                ];

                                try {
                                    await new Promise((resolve, reject) => {
                                        con.query(query, values, (err, data) => {
                                            if (err) reject(err);
                                            resolve(data);
                                        });
                                    });
                                } catch (error) {
                                    console.error("Error inserting dish data:", error);
                                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                                }

                                imageIndex++;
                            } else {
                                console.error(`No image found for dish ${j + 1} in cuisine ${cuisineId}`);
                                // Handle the case where there is no image for the dish
                            }
                        }
                    }
                }

                await insertData(dish_data);

                /* const deleteQuery = `DELETE FROM hosting_menu WHERE host_id=? AND hosting_id=?`;

                try {
                    await con.query(deleteQuery, [req.user.id, hosting_id]);
                } catch (error) {
                    console.error("Error deleting existing data:", error);
                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                }

                async function insertData(data) {
                    const dish_pics = req.files.dish_picture || [];

                    if (dish_pics.length === 0) {
                        console.error("No images available for insertion");
                        return res.status(400).json({ success: false, error: "No images available" });
                    }

                    let imageIndex = 0;

                    for (let i = 0; i < data.length; i++) {
                        const cuisine = data[i];
                        console.log(`Inserting dishes for cuisine ${cuisine.Cuisine_id}`);
                        const cuisineId = cuisine.Cuisine_id;
                        const no_of_courses = cuisine.no_of_courses;
                        const dishes = cuisine.dishes;

                        for (let j = 0; j < dishes.length; j++) {
                            const dish = dishes[j];
                            const { name, allegen } = dish;

                            if (imageIndex < dish_pics.length) {
                                const dish_pic = dish_pics[imageIndex];

                                //console.log(`Inserting dish ${j + 1} for cuisine ${cuisineId}`);
                                //console.log(`Image filename: ${dish_pic.filename}`);

                                const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                const values = [
                                    req.user.id,
                                    hosting_id,
                                    cuisineId,
                                    no_of_courses,
                                    name,
                                    allegen,
                                    dish_pic.filename,
                                ];

                                try {
                                    await new Promise((resolve, reject) => {
                                        con.query(query, values, (err, data) => {
                                            if (err) reject(err);
                                            resolve(data);
                                        });
                                    });
                                } catch (error) {
                                    //  console.error("Error inserting dish data:", error);
                                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                                }

                                imageIndex++;
                            } else {
                                // console.error(`No image found for dish ${j + 1} in cuisine ${cuisineId}`);
                                // Handle the case where there is no image for the dish
                            }
                        }
                    }
                }

                await insertData(dish_data); */



                const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
        INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
        INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
        where hosting_menu.hosting_id='${hosting_id}'`;

                setTimeout(() => {
                    con.query(query, (error, results) => {
                        if (error) {
                            console.error('Error executing query: ' + error.stack);
                            return;
                        }
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
                        formattedData.forEach((cuisine) => {
                            const dishCount = cuisine.dishes.length;
                            if (dishCount !== cuisine.no_of_courses) {
                                cuisine.status = "not completed yet";
                            } else {
                                cuisine.status = "completed";
                            }
                        });

                    })
                }, 1000);
            }

            if (time_data !== undefined) {
                async function AddData(data) {
                    var deleteQuery2 = `delete from time_slots where hosting_id=?`;
                    con.query(deleteQuery2, [hosting_id], (err, data2) => {
                        if (err) throw err;
                    })
                    for (const time of data) {
                        //console.log(time)
                        const day = time.day;
                        const cuisine_id = time.cuisine_id;
                        //console.log(cuisine_id)
                        const opening_time = time.opening_time;
                        const closing_time = time.closing_time;
                        // console.log(day, cuisine_id, opening_time, closing_time );
                        var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_id, opening_time, closing_time) values(?,?,?,?,?,?)`;
                        con.query(Query2, [req.user.id, hosting_id, day, cuisine_id, opening_time, closing_time], (err, data2) => {
                            if (err) throw err;
                        })
                    }
                }
                AddData(time_data);
            }

            if (fees_per_person !== '' && fees_per_person !== undefined && fees_per_group !== '' && fees_per_group !== undefined) {
                var UpdateQuery = `update tbl_hosting set fees_per_person=?, fees_per_group=? where id=?`;
                con.query(UpdateQuery, [fees_per_person, fees_per_group, hosting_id], (err, result) => {
                    if (err) throw err;

                })
            }

            if (condition !== undefined && condition !== '' && discount !== undefined && discount !== '') {
                function generatePromoCode(length) {
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let promoCode = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        promoCode += characters.charAt(randomIndex);
                    }
                    return promoCode;
                }

                // Usage example:
                /* const promoCode = generatePromoCode(8); // Generates an 8-character promo code
                console.log(promoCode); */
                /* var UpdateQuery1 = `update tbl_hosting set conditions=?, discount=?, promo_code=? where id=?`;
                con.query(UpdateQuery1, [condition, discount, promoCode, hosting_id], (err, result) => {
                    if (err) throw err;
                }) */
                var UpdateQuery1 = `update tbl_hosting set conditions=?, discount=? where id=?`;
                con.query(UpdateQuery1, [condition, discount, hosting_id], (err, result) => {
                    if (err) throw err;
                })
            }

            /* if (discounts_data !== undefined) {
                async function discountData(data) {
                    var deleteQuery3 = `delete from discounts where hosting_id=?`;
                    con.query(deleteQuery3, [hosting_id], (err, data2) => {
                        if (err) throw err;
                    })
                    for (const discounts of data) {
                        //console.log(time)
                        const conditions = discounts.conditions;
                        const discount = discounts.discount;

                        var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                        con.query(Query2, [req.user.id, hosting_id, conditions, discount], (err, data3) => {
                            if (err) throw err;
                        })
                    }
                }
                discountData(discounts_data);
            } */

            if (bank_country !== '' && bank_country !== undefined && bank_name !== '' && bank_name !== undefined && bank_iban !== '' && bank_iban !== undefined && bank_swift_code !== '' && bank_swift_code !== undefined && account_currency !== '' && account_currency !== undefined) {
                var UpdateQuery = `update tbl_hosting set bank_country=?, bank_name=?, bank_iban=?, bank_swift_code=?, account_currency=?, form_type=? where id=?`;
                con.query(UpdateQuery, [bank_country, bank_name, bank_iban,
                    bank_swift_code, account_currency, form_type, hosting_id], (err, result) => {
                        if (err) throw err;
                    })
            }

            con.query(`select * from tbl_hosting where tbl_hosting.host_id='${req.user.id}' and tbl_hosting.id='${hosting_id}'`, (err, data) => {
                if (err) throw err;
                // console.log(data)
                if (data.length < 1) {
                    res.status(400).send({
                        success: false,
                        message: "No hosts Added yet !"
                    })
                }
                else {
                    //res.send(area[0])
                    var status = "Incomplete";
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

                        var country_type;
                        if (data[i].country_id !== 0) {
                            //console.log(data[i].area_id !==0);
                            con.query(`select name from country_list where id='${data[i].country_id}'`, (err, country) => {
                                if (err) throw err;
                                if (country.length > 0) {
                                    country_type = country[0].name;
                                }
                                //area_type = area[0].area_type;
                            })
                        }

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
                        const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
        INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
        INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
        where hosting_menu.hosting_id='${hosting_id}'`;

                        con.query(query, (error, results) => {
                            if (error) {
                                // console.error('Error executing query: ' + error.stack);
                                return;
                            }


                            // console.log(results)
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
                            formattedData.forEach((cuisine) => {
                                const dishCount = cuisine.dishes.length;
                                if (dishCount !== cuisine.no_of_courses) {
                                    cuisine.status = "not completed yet";
                                } else {
                                    cuisine.status = "completed";
                                }
                            });
                        })

                        /* con.query(`select hosting_menu.*, cuisine_list.cuisine_type from hosting_menu 
                                                    INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                                    where hosting_menu.hosting_id='${hosting_id}'`, (err, menudata) => {
                            if (err) throw err;

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
                                                    throw err;
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
                                menus.push(menudata[0]);
                            }
                        }) */
                        //  console.log(cuisine_style)
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
                                            console.log(discountData) */
                                        /* var discount = [];
                                        discountData.forEach(item => {
                                            discount.push(item);
                                        }) */

                                        if (data[0].form_type == 13) {
                                            status = "Complete";
                                        }
                                        var values = {
                                            id: data[i].id,
                                            host_id: data[i].host_id,
                                            form_type: data[i].form_type,
                                            place_type: place_type,
                                            country: country_type,
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
                                            about_me: data[i].about_me,
                                            first_name: data[i].first_name,
                                            last_name: data[i].last_name,
                                            created_at: data[i].created_at,
                                            updated_at: data[i].updated_at,
                                            // data: data[i],
                                            cuisine_list: cuisine_style,
                                            activities_type: activities_type,
                                            area_images: images,
                                            rules: rules,
                                            menus: formattedData,
                                            time_slots: time,
                                        }
                                        arr.push(values)
                                    })
                                    /* }) */
                                })

                            })
                        })
                    }
                    setTimeout(function () {
                        res.status(200).send({
                            success: true,
                            data: arr[0],
                            status: status
                        })
                    }, 2000)
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

const addCuisine = async (req, res) => {
    try {
        const { cuisine_style } = req.body;
        if (!cuisine_style) {
            res.status(400).send({
                success: false,
                message: "Provide cuisine_style details !"
            })
        }
        else {
            // console.log(cuisine_style);
            let cuisine;
            if (cuisine_style !== undefined) {
                //var b = JSON.parse(JSON.stringify(products));
                const cuisineArray = JSON.parse(JSON.stringify(cuisine_style));
                cuisine = cuisineArray.join(',');
            }
            let sql = `insert into cuisine_style (cuisine_type) values(?)`;
            await con.query(sql, (cuisine), (err, data) => {
                if (err) throw err;
                // console.log(data);
                if (data.affectedRows > 0) {
                    res.status(200).send({
                        success: true,
                        insertId: data.insertId
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        insertId: "Failed to add cuisine type !"
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

const getCuisine = async (req, res) => {
    const { hosting_id } = req.body;
    try {
        const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
        INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
        INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
        where hosting_menu.hosting_id='${hosting_id}'`;

        await con.query(query, (error, results) => {
            if (error) {
                console.error('Error executing query: ' + error.stack);
                return;
            }

            const formattedData = [];
            // console.log(results)
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
            formattedData.forEach((cuisine) => {
                const dishCount = cuisine.dishes.length;
                if (dishCount !== cuisine.no_of_courses) {
                    cuisine.status = "not complete yet";
                } else {
                    cuisine.status = "complete";
                }
            });
            res.status(200).send({
                success: true,
                data: formattedData
            })
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetHostings = async (req, res) => {
    try {
        await con.query(`select * from tbl_hosting
        where tbl_hosting.host_id='${req.user.id}' ORDER BY created_at DESC`, (err, data) => {
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

// const UpBookings = async (req, res) => {
//     /* const today = new Date();
//     let date = ("0" + today.getDate()).slice(-2);
//     let month = ("0" + (today.getMonth() + 1)).slice(-2);
//     let year = today.getFullYear();
//     let hours = today.getHours();
//     let minutes = ("0" + (today.getMinutes())).slice(-2)//today.getMinutes();
//     let second = today.getSeconds();
//     const date_find = year + "-" + month + "-" + date;
//     const time = hours + ":" + minutes + ":" + second;
//     const date_time = date_find.concat(' ', time); */
//     const today = new Date();
//     const date = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
//     const time = today.toISOString().slice(11, 19); // Format: HH:MM:SS
//     const date_time = `${date} ${time}`;

//     try {
//         // INNER JOIN tbl_hosting ON tbl_hosting.id= tbl_booking.hosting_id
//         // and tbl_booking.status <> '${2}'
//         let sql = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile from tbl_booking 
//         INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_booking.visitor_id 
//         where tbl_booking.host_id=? and
//         CONCAT(booking_date,' ',booking_time) >= ? and tbl_booking.is_deleted=? and (tbl_booking.status <> ? and  tbl_booking.status <> ?)
//         ORDER BY CONCAT(booking_date, ' ',booking_time)`;
//         await con.query(sql, [req.user.id, date_time, 0, 1, 2], (err, data) => {
//             if (err) throw err;
//             if (data.length < 1) {
//                 res.status(200).send({
//                     success: true,
//                     message: "No bookings yet",
//                     data: data
//                 })
//             }
//             else {
//                 for (let i = 0; i < data.length; i++) {
//                     const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE visitor_id = ? AND rating_by = ? AND is_deleted = ?`;
//                     con.query(hostRatingQuery, [data[i].visitor_id, 1, 0], (err, hostRatingData) => {
//                         if (err) throw err;
//                         if (hostRatingData[0].overall_rating !== null) {
//                             // Create a unique property for each booking
//                             data[i].Rating = ((hostRatingData[0].overall_rating).toFixed(1)).toString();

//                         } else {
//                             data[i].Rating = "";
//                         }
//                     });
//                 }
//                 setTimeout(() => {
//                     res.status(200).send({
//                         success: true,
//                         data: data
//                     })
//                 }, 1000);
//             }
//         })
//     }
//     catch (error) {
//         res.status(500).send({
//             success: false,
//             message: error.message
//         })
//     }
// }

const UpBookings = async (req, res) => {
    const today = new Date();
    const date = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const time = today.toISOString().slice(11, 19); // Format: HH:MM:SS
    const date_time = `${date} ${time}`;

    try {
        let sql = `
        SELECT 
    tbl_booking.*, 
    DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, 
    tbl_visitors.first_name, 
    tbl_visitors.last_name, 
    tbl_visitors.profile,
    CASE 
        WHEN (
            (tbl_booking.is_date_changed = 0 AND CONCAT(booking_date, ' ', booking_time) < '${date_time}') OR
            (tbl_booking.is_date_changed = 1 AND CONCAT(new_booking_date, ' ', new_booking_time) < '${date_time}')
        ) AND tbl_booking.status = 0 THEN 1
        ELSE 0
    END AS is_expired,
    CASE
        WHEN (
            (tbl_booking.is_date_changed = 0 AND CONCAT(booking_date, ' ', booking_time) >= '${date_time}') OR
            (tbl_booking.is_date_changed = 1 AND CONCAT(new_booking_date, ' ', new_booking_time) >= '${date_time}')
        ) THEN 
            CASE 
                WHEN tbl_booking.status = 0 THEN 0
                ELSE tbl_booking.status
            END
        ELSE tbl_booking.status -- Keep the original status if the booking date is expired
    END AS status
FROM 
    tbl_booking 
INNER JOIN 
    tbl_visitors ON tbl_visitors.id = tbl_booking.visitor_id 
WHERE 
    tbl_booking.host_id = ${req.user.id} AND
    tbl_booking.status != 1 AND tbl_booking.status != 2 AND
    (
        (
            (tbl_booking.is_date_changed = 0 AND CONCAT(booking_date, ' ', booking_time) >= '${date_time}') OR
            (tbl_booking.is_date_changed = 1 AND CONCAT(new_booking_date, ' ', new_booking_time) >= '${date_time}')
        ) OR
        (
            tbl_booking.status = 0 AND CONCAT(booking_date, ' ', booking_time) < '${date_time}'
        )
    ) AND 
    tbl_booking.is_deleted = 0 AND 
    (tbl_booking.status != 0 OR tbl_booking.is_apology_send = 0)
ORDER BY 
    CONCAT(
        CASE WHEN tbl_booking.is_date_changed = 0 THEN booking_date ELSE new_booking_date END,
        ' ',
        CASE WHEN tbl_booking.is_date_changed = 0 THEN booking_time ELSE new_booking_time END
    )`
            ;

        const data = await new Promise((resolve, reject) => {
            con.query(sql, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        if (data.length < 1) {
            res.status(200).send({
                success: true,
                message: "No bookings yet",
                data: data
            });
        } else {
            for (let i = 0; i < data.length; i++) {
                const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE visitor_id = ${data[i].visitor_id} AND rating_by = 1 AND is_deleted = 0`;
                const hostRatingData = await new Promise((resolve, reject) => {
                    con.query(hostRatingQuery, (err, hostRatingData) => {
                        if (err) reject(err);
                        resolve(hostRatingData);
                    });
                });
                if (hostRatingData[0].overall_rating !== null) {
                    data[i].Rating = (hostRatingData[0].overall_rating).toFixed(1);
                } else {
                    data[i].Rating = "";
                }
            }
            res.status(200).send({
                success: true,
                data: data
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


const PreBookings = async (req, res) => {
    /* const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = ("0" + (today.getMinutes())).slice(-2);
    let second = today.getSeconds();
    const date_find = year + "-" + month + "-" + date;
    const time = hours + ":" + minutes + ":" + second;
    const date_time = date_find.concat(' ', time); */

    const today = new Date();
    const date = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const time = today.toISOString().slice(11, 19); // Format: HH:MM:SS
    const date_time = `${date} ${time}`;

    try {
        // AND tbl_booking.status <> '${2}'
        let sql = `SELECT tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile FROM tbl_booking
                        INNER JOIN tbl_visitors ON tbl_visitors.id = tbl_booking.visitor_id
                        WHERE host_id = ? AND CONCAT(booking_date, ' ', booking_time) <= ?  AND tbl_booking.is_deleted = ?
                        ORDER BY CONCAT(booking_date, ' ', booking_time) DESC`;

        const data = await query(sql, [req.user.id, date_time, 0]);

        if (data.length < 1) {
            res.status(200).send({
                success: true,
                message: "No bookings yet",
                data: data
            })
        } else {
            // Fetch ratings for each booking

            for (let i = 0; i < data.length; i++) {
                const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE visitor_id = ? AND rating_by = ? AND is_deleted = ?`;
                const hostRatingData = await query(hostRatingQuery, [data[i].visitor_id, 1, 0]);

                if (hostRatingData[0].overall_rating !== null) {
                    // Create a unique property for each booking
                    data[i].Rating = ((hostRatingData[0].overall_rating).toFixed(1)).toString();
                } else {
                    data[i].Rating = "";
                }
            }
            res.status(200).send({
                success: true,
                data: data
            });
        }


    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// Helper function for executing SQL queries
function query(sql, values) {
    return new Promise((resolve, reject) => {
        con.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const AcceptBooking = async (req, res) => {
    const { BookingId } = req.body;
    if (!BookingId) {
        res.status(400).send({
            success: false,
            message: "Provide booking id!"
        })
    }
    else {
        try {
            let sql = "select status from tbl_booking where id=?";
            await con.query(sql, [BookingId], (err, data) => {
                if (err) throw err;
                if (data.length < 1) {
                    res.status(400).send({
                        success: false,
                        message: 'Booking not found !'
                    })
                }
                else {
                    if (data[0].status == 1) {
                        res.status(400).send({
                            success: false,
                            message: "Already accepted this booking !"
                        })
                    }
                    else {
                        let updateQuery = "update tbl_booking set status=? where id=?";
                        con.query(updateQuery, [1, BookingId], (err, result) => {
                            if (err) throw err;
                            if (result.affectedRows > 0) {
                                res.status(200).send({
                                    success: true,
                                    message: "Booking accepted successfully!"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to accepted booking!"
                                })
                            }
                        })
                    }
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
}

const RejectBooking = async (req, res) => {
    try {
        const { BookingId, rejection_reason } = req.body;
        if (!BookingId) {
            res.status(400).send({
                success: false,
                message: "Provide booking id !"
            })
        }
        else {
            let sql = "select status from tbl_booking where id=?";
            await con.query(sql, [BookingId], (err, result) => {
                if (err) throw err;
                if (result.length < 1) {
                    res.status(400).send({
                        success: false,
                        message: 'Booking not found !'
                    })
                }
                else {
                    if (result[0].status == 2) {
                        res.status(400).send({
                            success: false,
                            message: 'Already rejected this booking !'
                        })
                    }
                    else {
                        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        let updateQuery = "update tbl_booking set status=?, cancellation_reason=?, cancelled_by=?, cancel_date=? where id=?";
                        con.query(updateQuery, [2, rejection_reason, 2, currentDate, BookingId], (err, data) => {
                            if (err) throw err;
                            if (data.affectedRows > 0) {

                                const paymentQuery = "SELECT * FROM tbl_payment WHERE booking_id=?";
                                con.query(paymentQuery, [BookingId], async (err, resultData) => {
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
                                    console.log(payment.payment_method);
                                    if (payment.payment_method.toLowerCase() == "wallet pay") {
                                        console.log("hiiiiiiiiii++iiii");
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
                                                const updateQuery = `UPDATE tbl_payment SET payment_status="cancelled", refund_date='${formattedDate}' WHERE booking_id='${BookingId}'`;

                                                con.query(updateQuery, (err, data) => {
                                                    if (err) throw err;
                                                    // Handle the result if needed
                                                });

                                                res.status(200).send({
                                                    success: true,
                                                    message: "Booking rejected!"
                                                })

                                            });
                                        })
                                    } else if (payment.payment_method.toLowerCase() == "online payment") {
                                        console.log("hii");
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
                                            const updateQuery = `UPDATE tbl_payment SET payment_status="cancelled", refund_date='${formattedDate}' WHERE booking_id='${BookingId}'`;

                                            con.query(updateQuery, (err, data) => {
                                                if (err) throw err;
                                                // Handle the result if needed

                                            });


                                            res.status(200).send({
                                                success: true,
                                                message: "Booking rejected!"
                                            })
                                        } else {
                                            res.status(400).send({
                                                success: false,
                                                message: "Failed to process refund via Stripe"
                                            });
                                        }
                                    }
                                    else {
                                        console.log("hiiiiiiiiiiiiii");
                                        res.status(200).send({
                                            success: true,
                                            message: "Booking rejected!"
                                        })
                                    }
                                });

                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to reject booking"
                                })
                            }
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const Ratings = async (req, res) => {
    try {
        const { user_id, rating, review, cleanness, quality_of_food, space, to_host } = req.body;
        let sql = "select * from tbl_hosts where visitor_id =?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                // host
                let selectQuery = `select * from tbl_hosts where visitor_id=?`;
                con.query(selectQuery, [user_id], (err, findHost) => {
                    if (err) throw err;
                    if (findHost.length > 0) {
                        if (to_host == 1) {
                            let InsertQuery = "insert into tbl_rating (host_id, visitor_id, rating, review, rating_by) values(?,?,?,?,?)";
                            con.query(InsertQuery, [user_id, req.user.id, rating, review, 2], (err, data) => {
                                if (err) throw err;
                                if (data.affectedRows > 0) {
                                    const sql = 'INSERT INTO hosting_ratings (visitor_id, hosting_id, cleanness, quality_of_food, space) VALUES (?, ?, ?, ?, ?)';
                                    const values = [req.user.id, user_id, cleanness, quality_of_food, space];

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
                                else {
                                    res.status(400).json({
                                        success: false,
                                        message: 'Failed to submit rating'
                                    });
                                }
                            })
                        }
                        else {
                            let InsertQuery = "insert into tbl_rating (host_id, visitor_id, rating, review, rating_by) values(?,?,?,?,?)";
                            con.query(InsertQuery, [req.user.id, user_id, rating, review, 1], (err, data) => {
                                if (err) throw err;
                                res.status(200).send({
                                    success: true,
                                    message: "Review is successfully submitted"
                                })
                            })
                        }
                    }
                    else {
                        let InsertQuery = "insert into tbl_rating (host_id, visitor_id, rating, review, rating_by) values(?,?,?,?,?)";
                        con.query(InsertQuery, [req.user.id, user_id, rating, review, 1], (err, data) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                message: "Review is successfully submitted"
                            })
                        })
                    }
                })

            }
            else {
                // visitor
                let InsertQuery = "insert into tbl_rating (host_id, visitor_id, rating, review, rating_by) values(?,?,?,?,?)";
                con.query(InsertQuery, [user_id, req.user.id, rating, review, 2], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows > 0) {
                        const sql = 'INSERT INTO hosting_ratings (visitor_id, hosting_id, cleanness, quality_of_food, space) VALUES (?, ?, ?, ?, ?)';
                        const values = [req.user.id, user_id, cleanness, quality_of_food, space];

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
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Failed to submit rating'
                        });
                    }
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

// get host rating given by visitor and visitor rating given by host

const getRating = async (req, res) => {
    try {
        let sql = "select * from tbl_hosts where visitor_id =?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                //host
                let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where host_id=? and rating_by=? and is_deleted=?";
                con.query(sqlQuery, [req.user.id, 2, 0], (err, data) => {
                    if (err) throw err;
                    if (data[0].overall_rating != null) {
                        let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ' , tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?";
                        con.query(selectQuery, [req.user.id, 2, 0], (err, details) => {
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
                                    message: "Rating not found !"
                                })
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Rating is not available !"
                        })
                    }
                })
            }
            else {
                //visitor
                let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where visitor_id=? and rating_by=? and is_deleted=?";
                con.query(sqlQuery, [req.user.id, 1, 0], (err, data) => {
                    if (err) throw err;
                    if (data[0].overall_rating != null) {
                        let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.host_id where visitor_id=? and rating_by=? and tbl_rating.is_deleted=?"
                        con.query(selectQuery, [req.user.id, 1, 0], (err, details) => {
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
                                    message: "Rating not found !"
                                })
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Rating is not available !"
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

// my ratings (hosts & visitors) for others

const MyRatings = async (req, res) => {
    try {
        let sql = "select * from tbl_hosts where visitor_id =?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                // hosts
                let sqlQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_visitors.profile, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?"
                con.query(sqlQuery, [req.user.id, 1, 0], (err, data) => {
                    if (err) throw err;
                    if (data.length > 0) {
                        const details = [];
                        data.forEach(item => {
                            // console.log(item);
                            details.push({
                                "rating": (item.rating).toString(),
                                "review": item.review,
                                "Name": item.Name,
                                "profile": item.profile,
                                "created_at": item.created_at
                            })
                        })
                        setTimeout(() => {
                            res.status(200).send({
                                success: true,
                                data: details
                            })
                        }, 500);
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Rating is not available !"
                        })
                    }
                })
            }
            else {
                // visitor
                let sqlQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_visitors.profile, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.host_id where visitor_id=? and rating_by=? and tbl_rating.is_deleted=?"
                con.query(sqlQuery, [req.user.id, 2, 0], (err, data) => {
                    if (err) throw err;
                    if (data.length > 0) {
                        const details = [];
                        data.forEach(item => {
                            // console.log(item);
                            details.push({
                                "rating": (item.rating).toString(),
                                "review": item.review,
                                "Name": item.Name,
                                "profile": item.profile,
                                "created_at": item.created_at
                            })
                        })
                        setTimeout(() => {
                            res.status(200).send({
                                success: true,
                                data: details
                            })
                        }, 500);
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Rating is not available !"
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

const add_Hosting = async (req, res) => {
    try {
        const { hosting_id, place_id, country_id, state, city, street, building_name, flat_no, lat, lng, area_id,
            no_of_guests, activities_id, dress_code, rules, cuisine_style,
            fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
            bank_swift_code, account_currency, form_type } = req.body;

        var dishe = req.body.menu_dishes;
        var time = req.body.time_slot;
        var discount_condi = req.body.discounts;
        // console.log(typeof(activities_id)) 

        let cuisine;
        if (cuisine_style !== undefined && cuisine_style !== '') {
            const cuisineArray = JSON.parse(cuisine_style);
            cuisine = cuisineArray.join(',');
        }

        let activitiy;
        if (activities_id !== undefined && activities_id !== '') {
            const numberArray = JSON.parse(activities_id);
            activitiy = numberArray.join(',');
        }

        let time_data;
        if (time !== undefined && time !== '') {
            time_data = JSON.parse(time);
            //console.log(time_data)
        }

        let discounts_data;
        if (discount_condi !== undefined && discount_condi !== '') {
            discounts_data = JSON.parse(discount_condi);
        }

        let rules_data;
        if (rules !== undefined && rules !== '') {
            rules_data = JSON.parse(rules);
            // console.log(rules_data);
        }

        let address_document;
        if (req.files.address_document !== undefined) {
            address_document = req.files.address_document[0].filename;
        }

        let dish_data;
        if (dishe !== undefined && dishe !== '') {
            dish_data = JSON.parse(dishe);
        }
        /* var data=`${req.body.data}`;
        console.log(data);
        const split_string = data.split(",");
        console.log(split_string) */

        if (hosting_id == undefined || hosting_id == '') {

            //let address_document = req.files.address_document[0].filename;
            // let area_video = req.files.area_video[0].filename;

            var InsertQuery = `insert into tbl_hosting ( host_id, place_id, form_type) values(?,?,?)`;
            await con.query(InsertQuery, [req.user.id, place_id, form_type], (err, result) => {

                if (err) throw err;

                if (result.affectedRows > 0) {
                    // console.log(req.files.area_image)
                    let selectQuery = `select * from tbl_hosting where host_id=? and id=?`
                    con.query(selectQuery, [req.user.id, result.insertId], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            data: data[0]
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Failed to insert details !"
                    })
                }
            })
        }
        else {
            const menus = [];
            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, form_type=? where id=?`;
            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                flat_no, address_document, form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {

                        if (lat !== '' || lng !== '') {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, form_type=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, form_type, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }


                        if (area_id !== '') {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, form_type=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, form_type, hosting_id], (err, result) => {
                                    if (err) throw err;
                                    // res.send('area')
                                })
                        }
                        if (req.files.area_image !== undefined) {
                            var Query = `delete from hosting_images where hosting_id=?`;
                            con.query(Query, [hosting_id], (err, data) => {
                                if (err) throw err;
                            });

                            let area_images = req.files.area_image;
                            area_images.forEach(image => {
                                var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                                con.query(Query, [req.user.id, hosting_id, image.filename], (err, data) => {
                                    if (err) throw err;
                                    // res.send('image')
                                });
                            })
                        }

                        // console.log(rules)
                        if (rules_data !== undefined && no_of_guests !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })

                            var deleteQuery = `delete from hosting_rules where hosting_id=?`;
                            con.query(deleteQuery, [hosting_id], (err, data1) => {
                                if (err) throw err;
                            })

                            var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;

                            var Rules = rules_data;
                            // console.log(typeof(Rules));
                            Rules.forEach(Rule => {
                                con.query(Query2, [req.user.id, hosting_id, Rule], (err, data1) => {
                                    if (err) throw err;
                                })
                            })
                        }

                        if (activities_id !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        if (dress_code !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        if (cuisine_style !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=?, cuisine_style=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, cuisine, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }
                        if (dish_data !== undefined) {
                            async function insertData(data) {
                                for (const cuisine of data) {
                                    const cuisineId = cuisine.Cuisine_id;
                                    const no_of_courses = cuisine.no_of_courses;
                                    const dishes = cuisine.dishes; // Adjust based on cuisine type
                                    // console.log(data);

                                    const deleteQuery = `delete from hosting_menu where host_id=? and hosting_id=?`;
                                    await con.query(deleteQuery, [req.user.id, hosting_id], (err, result) => {
                                        if (err) throw err;
                                    })
                                    for (const dish of dishes) {
                                        const { name, allegen, dish_picture } = dish;
                                        //console.log(dish_picture);
                                        async function imageUrlToBase64(url) {
                                            try {
                                                const response = await fetch(url);

                                                const blob = await response.arrayBuffer();

                                                const contentType = response.headers.get('content-type');

                                                const base64String = `data:${contentType};base64,${Buffer.from(
                                                    blob,
                                                ).toString('base64')}`;

                                                return base64String;
                                            } catch (err) {
                                                console.log(err);
                                            }
                                        }

                                        imageUrlToBase64(dish_picture).then(base64String => {
                                            // console.log(base64String);
                                            // let img_url = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
                                            let img_url = base64String;
                                            var matches = img_url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
                                                response = {};

                                            if (matches.length !== 3) {
                                                return new Error('Invalid input string');
                                            }

                                            response.type = matches[1];

                                            //console.log(typeof(Number(matchValue)))
                                            response.data = new Buffer.from(matches[2], 'base64');
                                            // console.log(response);
                                            let decodedImg = response;
                                            let imageBuffer = decodedImg.data;
                                            let type = decodedImg.type;
                                            let extension = mime.getExtension(type);
                                            let fileName = Date.now() + '-' + "image." + extension;
                                            try {
                                                fs.writeFileSync("./public/images/" + fileName, imageBuffer, 'utf8');
                                                //return res.send({ "status": "success" });
                                            } catch (e) {
                                                console.log(e);
                                            }
                                            // console.log(fileName);

                                            const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                            const values = [req.user.id, hosting_id, cuisineId, no_of_courses, name, allegen, fileName];
                                            con.query(query, values, (err, data) => {
                                                if (err) throw err;
                                                // console.log(data.insertId)
                                                if (data.insertId > 0) {
                                                    /* con.query(`select hosting_menu.*, cuisine_list.cuisine_type from hosting_menu 
                                                    INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                                    where hosting_menu.id='${data.insertId}'`, (err, menudata) => {
                                                        if (err) throw err;
                                                        //console.log(menudata)
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
                                                                                throw err;
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
                                                            menus.push(menudata[0]);
                                                        }
                                                    }) */
                                                }
                                            });
                                        });
                                    }
                                }
                            }
                            insertData(dish_data);
                        }

                        if (time_data !== undefined) {
                            async function AddData(data) {
                                var deleteQuery2 = `delete from time_slots where hosting_id=?`;
                                con.query(deleteQuery2, [hosting_id], (err, data2) => {
                                    if (err) throw err;
                                })
                                for (const time of data) {
                                    //console.log(time)
                                    const day = time.day;
                                    const cuisine_id = time.cuisine_id;
                                    //console.log(cuisine_id)
                                    const opening_time = time.opening_time;
                                    const closing_time = time.closing_time;
                                    var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_id, opening_time, closing_time) values(?,?,?,?,?,?)`;
                                    con.query(Query2, [req.user.id, hosting_id, day, cuisine_id, opening_time, closing_time], (err, data2) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            AddData(time_data);
                        }

                        if (fees_per_person !== undefined && fees_per_group !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?,
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=?, cuisine_style=?, fees_per_person=?, fees_per_group=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, cuisine, fees_per_person, fees_per_group, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        if (discounts_data !== undefined) {
                            async function discountData(data) {
                                var deleteQuery3 = `delete from discounts where hosting_id=?`;
                                con.query(deleteQuery3, [hosting_id], (err, data2) => {
                                    if (err) throw err;
                                })
                                for (const discounts of data) {
                                    //console.log(time)
                                    const conditions = discounts.conditions;
                                    const discount = discounts.discount;

                                    var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                                    con.query(Query2, [req.user.id, hosting_id, conditions, discount], (err, data3) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            discountData(discounts_data);
                        }

                        if (bank_country !== undefined && bank_name !== undefined && bank_iban !== undefined && bank_swift_code !== undefined && account_currency !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, 
                                activities_id=?, dress_code=?, cuisine_style=?, fees_per_person=?, 
                                fees_per_group=?, bank_country=?, bank_name=?, bank_iban=?, bank_swift_code=?, account_currency=?, form_type=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, cuisine, fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
                                bank_swift_code, account_currency, form_type, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        con.query(`select tbl_hosting.*, tbl_hosting.area_id,  place_list.place_type, country_list.name as country_name from tbl_hosting
        INNER JOIN country_list on country_list.id=tbl_hosting.country_id
        INNER JOIN place_list on place_list.id=tbl_hosting.place_id
        where tbl_hosting.host_id='${req.user.id}' and tbl_hosting.id='${hosting_id}'`, (err, data) => {
                            if (err) throw err;
                            // console.log(data)
                            if (data.length < 1) {
                                res.status(400).send({
                                    success: false,
                                    message: "No hosts Added yet !"
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
                                    //  console.log(cuisine_style)
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
                                            //console.log(rules)
                                            con.query(`select time_slots.*, cuisine_list.cuisine_type from time_slots INNER JOIN cuisine_list on cuisine_list.id=time_slots.cuisine_id where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeDay) => {
                                                if (err) throw err;
                                                var time = [];
                                                timeDay.forEach(item => {
                                                    time.push(item);
                                                })
                                                //console.log(time)
                                                con.query(`select * from discounts where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, discountData) => {
                                                    if (err) throw err;
                                                    var discount = [];
                                                    discountData.forEach(item => {
                                                        discount.push(item);
                                                    })
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
                                                        area_type: area_type,
                                                        area_video: data[i].area_video,
                                                        no_of_guests: data[i].no_of_guests,
                                                        dress_code: data[i].dress_code,
                                                        fees_per_person: data[i].fees_per_person,
                                                        fees_per_group: data[i].fees_per_group,
                                                        bank_country: data[i].bank_country,
                                                        bank_name: data[i].bank_name,
                                                        bank_iban: data[i].bank_iban,
                                                        bank_swift_code: data[i].bank_swift_code,
                                                        account_currency: data[i].account_currency,
                                                        host_name: data[i].host_name,
                                                        trade_license: data[i].trade_license,
                                                        created_at: data[i].created_at,
                                                        updated_at: data[i].updated_at,
                                                        // data: data[i],
                                                        cuisine_list: cuisine_style,
                                                        activities_type: activities_type,
                                                        area_images: images,
                                                        rules: rules,
                                                        menus: form,
                                                        discount: discount,
                                                        time_slots: time,
                                                    }
                                                    arr.push(values)
                                                })
                                            })

                                        })
                                    })
                                }
                                setTimeout(function () {
                                    res.status(200).send({
                                        success: true,
                                        data: arr[0]
                                    })
                                }, 2000)
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "failed to update details !"
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

const HostingById = async (req, res) => {
    const { hosting_id } = req.body;
    const formattedData = [];
    /* select tbl_hosting.*, tbl_hosts.host_name, countries.name as country_id, states.name as state,                                                                                                                                                                                                                                                  tbl_hosts.trade_license, tbl_hosts.about_me, 
        cities.name as city, tbl_area.area as area, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile
         from tbl_hosting
    INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id
    INNER JOIN countries on countries.id=tbl_hosting.country_id
    INNER JOIN states on states.id=tbl_hosting.state
    INNER JOIN cities on cities.id=tbl_hosting.city
    INNER JOIN tbl_area on tbl_area.id=tbl_hosting.area
    INNER JOIN tbl_visitors on tbl_visitors.id=tbl_hosts.visitor_id
    where tbl_hosting.id='${hosting_id}' */
    con.query(`select tbl_hosting.*, tbl_hosts.host_name, countries.name as country_name, countries.id as country_id, states.name as state, states.id as state_id,                                                                                                                                                                                                                                                  tbl_hosts.trade_license, tbl_hosts.about_me, 
    cities.name as city, cities.id as city_id, tbl_area.area as area, tbl_area.id as area_id, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile
     from tbl_hosting
INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id
INNER JOIN countries on countries.id=tbl_hosting.country_id
INNER JOIN states on states.id=tbl_hosting.state
INNER JOIN cities on cities.id=tbl_hosting.city
INNER JOIN tbl_area on tbl_area.id=tbl_hosting.area
INNER JOIN tbl_visitors on tbl_visitors.id=tbl_hosts.visitor_id
    where tbl_hosting.host_id='${req.user.id}' and tbl_hosting.id='${hosting_id}'`, (err, data) => {
        if (err) throw err;
        // console.log(data)
        if (data.length < 1) {
            res.status(400).send({
                success: false,
                message: "No hosts Added yet !"
            })
        }
        else {
            //res.send(data[0].form_type)
            if (data[0].form_type != 13) {
                con.query(`select * from tbl_hosting where tbl_hosting.host_id='${req.user.id}' and tbl_hosting.id='${hosting_id}'`, (err, datas) => {
                    if (err) throw err;
                    // console.log(data)
                    if (datas.length < 1) {
                        res.status(400).send({
                            success: false,
                            message: "No hosts Added yet !"
                        })
                    }
                    else {
                        //res.send(area[0])
                        var arr = [];
                        const formattedData = [];
                        for (let i = 0; i < datas.length; i++) {
                            // console.log(data[i].area_id !== null && data[i].area_id !==0)
                            var area_type;
                            if (datas[i].area_id !== 0) {
                                //console.log(data[i].area_id !==0);
                                con.query(`select area_type from area_list where id='${datas[i].area_id}'`, (err, area) => {
                                    if (err) throw err;
                                    if (area.length > 0) {
                                        area_type = area[0].area_type;
                                    }
                                    //area_type = area[0].area_type;
                                })
                            }
                            var place_type;
                            if (datas[i].place_id !== 0) {
                                //console.log(data[i].area_id !==0);
                                con.query(`select place_type from place_list where id='${datas[i].place_id}'`, (err, place) => {
                                    if (err) throw err;
                                    if (place.length > 0) {
                                        place_type = place[0].place_type;
                                    }
                                    //area_type = area[0].area_type;
                                })
                            }
                            else {
                                place_type = null;
                            }

                            var country_type;
                            if (datas[i].country_id !== 0) {
                                //console.log(data[i].area_id !==0);
                                con.query(`select name from country_list where id='${datas[i].country_id}'`, (err, country) => {
                                    if (err) throw err;
                                    if (country.length > 0) {
                                        country_type = country[0].name;
                                    }
                                    //area_type = area[0].area_type;
                                })
                            }

                            const cuisine_style = [];
                            if (datas[i].cuisine_style !== null) {
                                const arr1 = datas[i].cuisine_style.split(",");

                                var sql1 = `SELECT * FROM cuisine_list`;
                                con.query(sql1, (err, allCuisines) => {
                                    if (err) throw err;

                                    allCuisines.forEach(cuisine => {
                                        const is_selected = arr1.includes(String(cuisine.id)) ? 1 : 0;
                                        cuisine_style.push({
                                            id: cuisine.id,
                                            cuisines: cuisine.cuisine_type,
                                            is_selected: is_selected
                                        });
                                    });

                                    // Now activities_type array contains all the records from activities_list with is_selected flag
                                    //console.log(activities_type);
                                });
                            }
                            /* const cuisine_style = [];
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
                            } */
                            var status = "Incomplete";
                            const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
            INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
            INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
            where hosting_menu.hosting_id='${hosting_id}'`;

                            con.query(query, (error, results) => {
                                if (error) {
                                    console.error('Error executing query: ' + error.stack);
                                    return;
                                }


                                // console.log(results)
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
                                formattedData.forEach((cuisine) => {
                                    const dishCount = cuisine.dishes.length;
                                    if (dishCount !== cuisine.no_of_courses) {
                                        cuisine.status = "not completed yet";
                                    } else {
                                        cuisine.status = "completed";
                                    }
                                });
                            })
                            //  console.log(cuisine_style)
                            /* const activities_type = [];
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
                                        activities_type.push({activities:type[0].activity_type});
                                        //console.log(area_type)
                                    })
                                });
                            } */

                            const activities_type = [];
                            if (datas[i].activities_id !== null) {
                                const arr1 = datas[i].activities_id.split(",");

                                var sql1 = `SELECT * FROM activities_list`;
                                con.query(sql1, (err, allActivities) => {
                                    if (err) throw err;

                                    allActivities.forEach(activity => {
                                        const is_selected = arr1.includes(String(activity.id)) ? 1 : 0;
                                        activities_type.push({
                                            id: activity.id,
                                            activities: activity.activity_type,
                                            is_selected: is_selected
                                        });
                                    });

                                    // Now activities_type array contains all the records from activities_list with is_selected flag
                                    //console.log(activities_type);
                                });
                            }

                            con.query(`select * from hosting_images where hosting_id='${datas[i].id}' and host_id='${datas[i].host_id}'`, (err, result) => {
                                if (err) throw err;
                                //console.log(result)
                                var images = [];
                                result.forEach(item => {
                                    images.push({ id: item.id, image: "http://suppr.me/images/" + item.image });

                                })
                                /* var images;
                                if (result.length > 0) {
                                    // result.forEach(item => {
                                    //     images.push(item.image);
            
                                    // })
                                    images = "http://suppr.me/images/" + result[0].image;
                                }
                                else {
                                    images = null;
                                } */
                                // console.log(images)
                                con.query(`select * from hosting_rules where hosting_id='${datas[i].id}'and host_id='${datas[i].host_id}'`, (err, response) => {
                                    if (err) throw err;
                                    //  console.log(response);
                                    var rules = [];
                                    response.forEach(item => {
                                        rules.push(item.rules);
                                    })
                                    con.query(`select * from hosting_dress where hosting_id='${datas[i].id}'and host_id='${datas[i].host_id}'`, (err, dressdata) => {
                                        if (err) throw err;
                                        //  console.log(response);
                                        var dress = [];
                                        dressdata.forEach(item => {
                                            dress.push(item.dress_code);
                                        })
                                        //console.log(rules)
                                        con.query(`select time_slots.*, cuisine_list.cuisine_type from time_slots INNER JOIN cuisine_list on cuisine_list.id=time_slots.cuisine_id where hosting_id='${datas[i].id}' and host_id='${datas[i].host_id}'`, (err, timeDay) => {
                                            if (err) throw err;
                                            var time = [];
                                            timeDay.forEach(item => {
                                                time.push(item);
                                            })

                                            if (datas[0].form_type == 13) {
                                                status = "Complete";
                                            }
                                            var values = {
                                                id: data[i].id,
                                                host_id: data[i].host_id,
                                                form_type: data[i].form_type,
                                                place_id: data[i].place_id,
                                                place_type: place_type,
                                                country: data[i].country_id,
                                                country_name: data[i].country_name,
                                                state_id: data[i].state_id,
                                                state: data[i].state,
                                                city_id: data[i].city_id,
                                                city: data[i].city,
                                                area_id: data[i].area_id,
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
                                                about_me: data[i].about_me,
                                                first_name: data[i].first_name,
                                                last_name: data[i].last_name,
                                                created_at: data[i].created_at,
                                                updated_at: data[i].updated_at,
                                                // data: data[i],
                                                cuisine_list: cuisine_style,
                                                activities_type: activities_type,
                                                area_images: images,
                                                description: data[i].description,
                                                rules: rules,
                                                menus: formattedData,
                                                time_slots: time,

                                            }
                                            arr.push(values)
                                        })

                                    })

                                })
                            })
                        }
                        setTimeout(function () {
                            res.status(200).send({
                                success: true,
                                data: arr[0],
                                status: status
                            })
                        }, 2000)
                    }
                })
            }
            else {
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    var status = "Incomplete";
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
                    else {
                        place_type = null
                    }

                    var country_type;
                    if (data[i].country_id !== 0) {
                        //console.log(data[i].area_id !==0);
                        con.query(`select name from country_list where id='${data[i].country_id}'`, (err, country) => {
                            if (err) throw err;
                            if (country.length > 0) {
                                country_type = country[0].name;
                            }
                            //area_type = area[0].area_type;
                        })
                    }

                    /* const cuisine_style = [];
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
                    } */

                    const cuisine_style = [];
                    if (data[i].cuisine_style !== null) {
                        const arr1 = data[i].cuisine_style.split(",");

                        var sql1 = `SELECT * FROM cuisine_list`;
                        con.query(sql1, (err, allCuisines) => {
                            if (err) throw err;

                            allCuisines.forEach(cuisine => {
                                const is_selected = arr1.includes(String(cuisine.id)) ? 1 : 0;
                                cuisine_style.push({
                                    id: cuisine.id,
                                    cuisines: cuisine.cuisine_type,
                                    is_selected: is_selected
                                });
                            });

                            // Now activities_type array contains all the records from activities_list with is_selected flag
                            //console.log(activities_type);
                        });
                    }

                    const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
where hosting_menu.hosting_id='${hosting_id}'`;

                    con.query(query, (error, results) => {
                        if (error) {
                            console.error('Error executing query: ' + error.stack);
                            return;
                        }


                        // console.log(results)
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
                        formattedData.forEach((cuisine) => {
                            const dishCount = cuisine.dishes.length;
                            if (dishCount !== cuisine.no_of_courses) {
                                cuisine.status = "not completed yet";
                            } else {
                                cuisine.status = "completed";
                            }
                        });
                    })

                    /* const activities_type = [];
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
                    } */

                    const activities_type = [];
                    if (data[i].activities_id !== null) {
                        const arr1 = data[i].activities_id.split(",");

                        var sql1 = `SELECT * FROM activities_list`;
                        con.query(sql1, (err, allActivities) => {
                            if (err) throw err;

                            allActivities.forEach(activity => {
                                const is_selected = arr1.includes(String(activity.id)) ? 1 : 0;
                                activities_type.push({
                                    id: activity.id,
                                    activities: activity.activity_type,
                                    is_selected: is_selected
                                });
                            });

                            // Now activities_type array contains all the records from activities_list with is_selected flag
                            console.log(activities_type);
                        });
                    }
                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        // console.log(result)
                        var images = [];
                        result.forEach(item => {
                            images.push({ id: item.id, image: "http://suppr.me/images/" + item.image });

                        })
                        //var images;
                        // if (result.length > 0) {
                        //     /* result.forEach(item => {
                        //         images.push(item.image);

                        //     }) */
                        //     images = "http://suppr.me/images/" + result[0].image;
                        // }
                        // else {
                        //     images = null;
                        // }
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
                                        console.log(discountData) */
                                    /* var discount = [];
                                    discountData.forEach(item => {
                                        discount.push(item);
                                    }) */
                                    if (data[0].form_type == 13) {
                                        status = "Complete";
                                    }
                                    var values = {
                                        id: data[i].id,
                                        host_id: data[i].host_id,
                                        form_type: data[i].form_type,
                                        place_id: data[i].place_id,
                                        place_type: place_type,
                                        country: data[i].country_id,
                                        country_name: data[i].country_name,
                                        state_id: data[i].state_id,
                                        state: data[i].state,
                                        city_id: data[i].city_id,
                                        city: data[i].city,
                                        area_id: data[i].area_id,
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
                                        about_me: data[i].about_me,
                                        first_name: data[i].first_name,
                                        last_name: data[i].last_name,
                                        created_at: data[i].created_at,
                                        updated_at: data[i].updated_at,
                                        // data: data[i],
                                        cuisine_list: cuisine_style,
                                        activities_type: activities_type,
                                        area_images: images,
                                        description: data[i].description,
                                        rules: rules,
                                        menus: formattedData,
                                        time_slots: time,
                                    }
                                    arr.push(values)
                                })
                                /* }) */
                            })

                        })
                    })
                }
                setTimeout(function () {
                    res.status(200).send({
                        success: true,
                        data: arr[0],
                        status: status
                    })
                }, 2000)
            }

        }
    })
}

const deleteHosting = async (req, res) => {
    try {
        const { hosting_id } = req.body;
        const sqlQuery = `Delete from tbl_hosting where id=?`;
        await con.query(sqlQuery, [hosting_id], (err, data) => {
            if (err) throw err;
            //console.log(data);
            if (data.affectedRows > 0) {
                const sql1 = `delete from hosting_images where hosting_id=?`;
                con.query(sql1, [hosting_id], (err, data1) => {
                    if (err) throw err;
                })

                const sql2 = `delete from hosting_menu where hosting_id=?`;
                con.query(sql2, [hosting_id], (err, data2) => {
                    if (err) throw err;
                })

                const sql3 = `delete from hosting_rules where hosting_id=?`;
                con.query(sql3, [hosting_id], (err, data3) => {
                    if (err) throw err;
                })

                const sql4 = `delete from time_slots where hosting_id=?`;
                con.query(sql4, [hosting_id], (err, data4) => {
                    if (err) throw err;
                })

                const sql5 = `delete from hosting_dress where hosting_id=?`;
                con.query(sql5, [hosting_id], (err, data4) => {
                    if (err) throw err;
                })

                res.status(200).send({
                    success: true,
                    message: "Data Deleted successfully !"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Failed to delete hosting"
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

const exploreList = async (req, res) => {
    try {
        const currentUserID = req.user.id;
        await con.query(`select tbl_hosting.*, place_list.place_type, country_list.name as country_name, area_list.area_type, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, 
        tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile from tbl_hosting 
        INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_hosting.host_id 
        INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id 
        INNER JOIN area_list on area_list.id=tbl_hosting.area_id
        INNER JOIN country_list on country_list.id=tbl_hosting.country_id
        INNER JOIN place_list on place_list.id=tbl_hosting.place_id
        WHERE tbl_hosting.host_id <> ${currentUserID} and tbl_hosting.form_type='${13}'`, (err, data) => {
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

                    var country_type;
                    if (data[i].country_id !== 0) {
                        //console.log(data[i].area_id !==0);
                        con.query(`select name from country_list where id='${data[i].country_id}'`, (err, country) => {
                            if (err) throw err;
                            if (country.length > 0) {
                                country_type = country[0].name;
                            }
                            //area_type = area[0].area_type;
                        })
                    }

                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        //console.log(result)
                        var images = [];
                        result.forEach(item => {
                            images.push({ "img_url": "http://suppr.me/images/" + item.image });

                        })

                        // console.log(images)

                        con.query(`select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${data[i].id}'`, (err, find) => {
                            if (err) throw err;
                            var is_favorite = 0;

                            if (find.length > 0) {
                                is_favorite = 1;
                            }
                            var hostRating;
                            const userIsHostQuery = "SELECT * FROM tbl_hosts WHERE visitor_id = ?";
                            con.query(userIsHostQuery, [data[i].host_id], (err, hostData) => {
                                if (err) throw err;

                                if (hostData.length > 0) {
                                    // User is a host
                                    const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE host_id = ? AND rating_by = ? AND is_deleted = ?`;

                                    con.query(hostRatingQuery, [data[i].host_id, 2, 0], (err, hostRatingData) => {
                                        if (err) {
                                            throw err;
                                        }
                                        //hostRating= hostRatingData[0].overall_rating;
                                        // hostRating =rating.toString();
                                        // Check if there's an overall_rating value in the result
                                        if (hostRatingData[0].overall_rating !== null) {
                                            // Convert the rating to a string
                                            hostRating = ((hostRatingData[0].overall_rating).toFixed(1)).toString();
                                        } else {
                                            hostRating = "";
                                        }
                                    })
                                }
                                else {
                                    hostRating = "";
                                }
                            })

                            setTimeout(() => {
                                var values = {
                                    id: data[i].id,
                                    host_id: data[i].host_id,
                                    description: data[i].description,
                                    place_type: place_type,
                                    country: country_type,
                                    state: data[i].state,
                                    city: data[i].city,
                                    street: data[i].street,
                                    building_name: data[i].building_name,
                                    flat_no: data[i].flat_no,
                                    fees_per_person: data[i].fees_per_person,
                                    fees_per_group: data[i].fees_per_group,
                                    host_name: data[i].host_name,
                                    about_me: data[i].about_me,
                                    first_name: data[i].first_name,
                                    last_name: data[i].last_name,
                                    profile: data[i].profile,
                                    created_at: data[i].created_at,
                                    updated_at: data[i].updated_at,
                                    cuisine_list: cuisine_style,
                                    area_images: images,
                                    is_favorite: is_favorite,
                                    rating: hostRating
                                }
                                arr.push(values)
                            }, 100)

                        })
                    })
                    // console.log(menus)
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

const expHostingById = async (req, res) => {
    try {
        const { hosting_id, user_id } = req.body;
        const formattedData = [];
        const finalResponse = [];
        con.query(`select tbl_hosting.*, tbl_hosts.host_name, countries.name as country_id, states.name as state,                                                                                                                                                                                                                                                  tbl_hosts.trade_license, tbl_hosts.about_me, 
        cities.name as city, tbl_area.area as area, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile
         from tbl_hosting
    INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id
    INNER JOIN countries on countries.id=tbl_hosting.country_id
    INNER JOIN states on states.id=tbl_hosting.state
    INNER JOIN cities on cities.id=tbl_hosting.city
    INNER JOIN tbl_area on tbl_area.id=tbl_hosting.area
    INNER JOIN tbl_visitors on tbl_visitors.id=tbl_hosts.visitor_id
    where tbl_hosting.id='${hosting_id}'`, (err, data) => {
            if (err) throw err;
            // console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No hosts Added yet !"
                })
            }
            else {
                // console.log(data);
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

                    /* var country_type;
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

                                cuisine_style.push(type[0]);
                                // console.log(cuisine_style)
                            })
                        });
                    }


                    /* const query = `SELECT hosting_menu.*, hosting_menu.dish_name AS name, cuisine_list.cuisine_type AS Cuisine_id, dish_types.type AS dish_type, GROUP_CONCAT(allergens_list.name) AS allergens
                FROM hosting_menu
                INNER JOIN cuisine_list ON cuisine_list.id = hosting_menu.cuisine_id
                INNER JOIN allergens_list ON FIND_IN_SET(allergens_list.id, hosting_menu.allergens_id) > 0
                INNER JOIN dish_types ON dish_types.id = hosting_menu.dish_type
                WHERE hosting_menu.hosting_id = '${hosting_id}'
                GROUP BY hosting_menu.id, dish_types.type, hosting_menu.dish_name`;

                    con.query(query, (error, results) => {
                        if (error) throw err;

                        results.forEach((row) => {
                            // Check if Cuisine already exists in formattedData
                            const cuisineIndex = formattedData.findIndex((c) => c.Cuisine_id === row.Cuisine_id);

                            if (cuisineIndex === -1) {
                                // If Cuisine doesn't exist, create a new entry
                                formattedData.push({
                                    Cuisine_id: row.Cuisine_id,
                                    no_of_courses: row.no_of_courses,
                                    dishes: [
                                        {
                                            dish_type: row.dish_type,
                                            dish: [
                                                {
                                                    name: row.name,
                                                    dish_desc: row.dish_desc, // Add dish description if available
                                                    allergens: row.allergens, // Use the concatenated allergens string
                                                    dish_picture: row.dish_picture,
                                                },
                                            ],
                                        },
                                    ],
                                });
                            } else {
                                // If Cuisine exists, check if dish_type exists
                                const dishTypeIndex = formattedData[cuisineIndex].dishes.findIndex(
                                    (dish) => dish.dish_type === row.dish_type
                                );

                                if (dishTypeIndex === -1) {
                                    // If dish_type doesn't exist, create a new entry
                                    formattedData[cuisineIndex].dishes.push({
                                        dish_type: row.dish_type,
                                        dish: [
                                            {
                                                name: row.name,
                                                dish_desc: row.dish_desc, // Add dish description if available
                                                allergens: row.allergens, // Use the concatenated allergens string
                                                dish_picture: row.dish_picture,
                                            },
                                        ],
                                    });
                                } else {
                                    // If dish_type exists, add the dish to the existing entry
                                    formattedData[cuisineIndex].dishes[dishTypeIndex].dish.push({
                                        name: row.name,
                                        dish_desc: row.dish_desc, // Add dish description if available
                                        allergens: row.allergens, // Use the concatenated allergens string
                                        dish_picture: row.dish_picture,
                                    });
                                }
                            }
                        });

                        // Now formattedData should have the desired structure
                        //  console.log(JSON.stringify(formattedData, null, 2));
                    }); */

                    const query = `SELECT hosting_menu.*, hosting_menu.dish_name AS name, cuisine_list.cuisine_type AS Cuisine_id, dish_types.type AS dish_type, GROUP_CONCAT(allergens_list.name) AS allergens
    FROM hosting_menu
    INNER JOIN cuisine_list ON cuisine_list.id = hosting_menu.cuisine_id
    INNER JOIN allergens_list ON FIND_IN_SET(allergens_list.id, hosting_menu.allergens_id) > 0
    INNER JOIN dish_types ON dish_types.id = hosting_menu.dish_type
    WHERE hosting_menu.hosting_id = '${hosting_id}'
    GROUP BY hosting_menu.id, dish_types.type, hosting_menu.dish_name`;

                    con.query(query, (error, results) => {
                        if (error) throw err;

                        // Define an array to store the final response


                        results.forEach((row) => {
                            // Check if dish_type already exists in finalResponse
                            const dishTypeIndex = finalResponse.findIndex((d) => d.dish_type === row.dish_type);

                            if (dishTypeIndex === -1) {
                                // If dish_type doesn't exist, create a new entry
                                finalResponse.push({
                                    dish_type: row.dish_type,
                                    dish: [
                                        {
                                            name: row.name,
                                            dish_desc: row.dish_desc,
                                            allergens: row.allergens,
                                            dish_picture: row.dish_picture,
                                        },
                                    ],
                                });
                            } else {
                                // If dish_type exists, add the dish to the existing entry
                                finalResponse[dishTypeIndex].dish.push({
                                    name: row.name,
                                    dish_desc: row.dish_desc,
                                    allergens: row.allergens,
                                    dish_picture: row.dish_picture,
                                });
                            }
                        });

                        // Now finalResponse should have the desired structure
                        //   console.log(JSON.stringify(finalResponse, null, 2));
                    });


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
                                activities_type.push({ type: type[0].activity_type });
                                //console.log(area_type)
                            })
                        });
                    }

                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        // console.log(result)
                        var images = "http://suppr.me/images/" + result[0].image;
                        /* result.forEach(item => {
                            images.push({ img_url: "https://suppr.me/images/" + item.image });

                        }) */
                        // console.log(images)
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            //  console.log(response);
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
                                //console.log(rules)
                                con.query(`select time_slots.*, cuisine_list.cuisine_type from time_slots INNER JOIN cuisine_list on cuisine_list.id=time_slots.cuisine_id where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeDay) => {
                                    if (err) throw err;
                                    var time = [];
                                    timeDay.forEach(item => {
                                        time.push(item);
                                    })
                                    con.query(`select * from fav_hosting where visitor_id='${user_id}' and hosting_id='${data[i].id}'`, (err, find) => {
                                        if (err) throw err;
                                        var is_favorite = 0;
                                        if (find.length > 0) {
                                            is_favorite = 1;
                                        }
                                        var hostRating = "";
                                        var host_review = [];
                                        var rating = {
                                            cleanness: "0",
                                            quality_of_food: "0",
                                            space: "0"
                                        };
                                        const userIsHostQuery = "SELECT * FROM tbl_hosts WHERE visitor_id = ?";
                                        con.query(userIsHostQuery, [data[i].host_id], (err, hostData) => {
                                            if (err) throw err;

                                            if (hostData.length > 0) {
                                                // User is a host
                                                const hostRatingQuery = `SELECT AVG(rating) AS overall_rating FROM tbl_rating WHERE host_id = ? AND rating_by = ? AND is_deleted = ?`;

                                                con.query(hostRatingQuery, [data[i].host_id, 2, 0], (err, hostRatingData) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ' , tbl_visitors.last_name) as Name, tbl_visitors.profile, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?";
                                                    con.query(selectQuery, [data[i].host_id, 2, 0], (err, details) => {
                                                        if (err) throw err;
                                                        if (details.length > 0) {
                                                            hostRating = ((hostRatingData[0].overall_rating).toFixed(1)).toString();
                                                            host_review = details;
                                                            const sql = `SELECT IFNULL(CONCAT(FORMAT((AVG(cleanness) / 5) * 100, 0), '%'), 0) AS cleanness,
        IFNULL(CONCAT(FORMAT((AVG(quality_of_food) / 5) * 100, 0), '%'), 0) AS quality_of_food,
        IFNULL(CONCAT(FORMAT((AVG(space) / 5) * 100, 0), '%'), 0) AS space
        FROM hosting_ratings WHERE hosting_id = ?`;

                                                            con.query(sql, [hosting_id], (err, data) => {
                                                                if (err) throw err;

                                                                rating = {
                                                                    cleanness: data[0].cleanness,
                                                                    quality_of_food: data[0].quality_of_food,
                                                                    space: data[0].space,
                                                                };
                                                            })
                                                        }
                                                    })

                                                })
                                            }
                                            else {
                                                hostRating = null;
                                            }
                                        })
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

                                                    setTimeout(() => {
                                                        var values = {
                                                            id: data[i].id,
                                                            host_id: data[i].host_id,
                                                            description: data[i].description,
                                                            place_type: place_type,
                                                            country: data[0].country_id,
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
                                                            about_me: data[i].about_me,
                                                            first_name: data[i].first_name,
                                                            last_name: data[i].last_name,
                                                            profile: "http://suppr.me/images/" + data[i].profile,
                                                            created_at: data[i].created_at,
                                                            updated_at: data[i].updated_at,
                                                            // data: data[i],
                                                            cuisine_list: cuisine_style,
                                                            activities_type: activities_type,
                                                            area_images: images,
                                                            rules: rules,
                                                            menus: finalResponse,
                                                            time_slots: time,
                                                            is_favorite: is_favorite,
                                                            rating: hostRating,
                                                            host_review: host_review,
                                                            cleanness: rating.cleanness,
                                                            quality_of_food: rating.quality_of_food,
                                                            space: rating.space,
                                                            book_requirement: listArray,
                                                            cancel_policy: cancelArray,
                                                            interests: interests
                                                        }
                                                        arr.push(values)
                                                    }, 100)
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                setTimeout(function () {
                    res.status(200).send({
                        success: true,
                        data: arr[0]
                    })
                }, 2000)
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

const RatingsReviews = async (req, res) => {
    try {
        const { host_id, hosting_id } = req.body;
        let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where host_id=? and rating_by=? and is_deleted=?";
        con.query(sqlQuery, [host_id, 2, 0], (err, data) => {
            if (err) throw err;
            if (data[0].overall_rating != null) {
                let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ' , tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?";
                con.query(selectQuery, [host_id, 2, 0], (err, details) => {
                    if (err) throw err;
                    if (details.length > 0) {
                        original = data[0].overall_rating;
                        //let overall_rating = Math.round(original * 10) / 10;
                        let overall_rating = original.toFixed(1);
                        const sql = `SELECT IFNULL(CONCAT(FORMAT((AVG(cleanness) / 5) * 100, 0), '%'), null) AS cleanness,
        IFNULL(CONCAT(FORMAT((AVG(quality_of_food) / 5) * 100, 0), '%'), null) AS quality_of_food,
        IFNULL(CONCAT(FORMAT((AVG(space) / 5) * 100, 0), '%'), null) AS space
        FROM hosting_ratings WHERE hosting_id = ?`;

                        con.query(sql, [hosting_id], (err, data) => {
                            if (err) throw err;

                            var rating = {
                                cleanness: data[0].cleanness,
                                quality_of_food: data[0].quality_of_food,
                                space: data[0].space,
                            };

                            let result = {
                                overall_rating: overall_rating,
                                total_reviews: data[0].total_reviews,
                                data: details,
                                hosting_rating: rating
                            }

                            res.status(200).send({
                                success: true,
                                response: result
                            })
                        });
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
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetHostingsDetails = async (req, res) => {
    try {
        const { hosting_id } = req.body;
        con.query(`select * from tbl_hosting where tbl_hosting.host_id='${req.user.id}' and tbl_hosting.id='${hosting_id}'`, (err, data) => {
            if (err) throw err;
            // console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No hosts Added yet !"
                })
            }
            else {
                //res.send(area[0])
                var arr = [];
                const formattedData = [];
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
                    else {
                        place_type = null;
                    }

                    var country_type;
                    if (data[i].country_id !== 0) {
                        //console.log(data[i].area_id !==0);
                        con.query(`select name from country_list where id='${data[i].country_id}'`, (err, country) => {
                            if (err) throw err;
                            if (country.length > 0) {
                                country_type = country[0].name;
                            }
                            //area_type = area[0].area_type;
                        })
                    }

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
                    const query = `select hosting_menu.*, hosting_menu.dish_name as name, cuisine_list.cuisine_type as Cuisine_id, allergens_list.name as allegen from hosting_menu 
    INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
    INNER JOIN allergens_list on allergens_list.id=hosting_menu.allergens_id
    where hosting_menu.hosting_id='${hosting_id}'`;

                    con.query(query, (error, results) => {
                        if (error) {
                            console.error('Error executing query: ' + error.stack);
                            return;
                        }


                        // console.log(results)
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
                        formattedData.forEach((cuisine) => {
                            const dishCount = cuisine.dishes.length;
                            if (dishCount !== cuisine.no_of_courses) {
                                cuisine.status = "not completed yet";
                            } else {
                                cuisine.status = "completed";
                            }
                        });
                    })
                    //  console.log(cuisine_style)
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
                                    var status = "Incomplete";
                                    if (data[0].form_type == 13) {
                                        status = "Complete";
                                    }
                                    var values = {
                                        id: data[i].id,
                                        host_id: data[i].host_id,
                                        form_type: data[i].form_type,
                                        place_type: place_type,
                                        country: country_type,
                                        state: data[i].state,
                                        city: data[i].city,
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
                                        about_me: data[i].about_me,
                                        first_name: data[i].first_name,
                                        last_name: data[i].last_name,
                                        created_at: data[i].created_at,
                                        updated_at: data[i].updated_at,
                                        // data: data[i],
                                        cuisine_list: cuisine_style,
                                        activities_type: activities_type,
                                        area_images: images,
                                        rules: rules,
                                        menus: formattedData,
                                        time_slots: time,
                                        status: status
                                    }
                                    arr.push(values)
                                })

                            })

                        })
                    })
                }
                setTimeout(function () {
                    res.status(200).send({
                        success: true,
                        data: arr[0]
                    })
                }, 2000)
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

const getTimeSlot = async (req, res) => {
    try {
        const { hosting_id } = req.body;

        const allDays = ["Every day", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const result = allDays.map(day => {
            return {
                day: day,
                is_selected: 0,
                opening_time: '',
                closing_time: '',
                cuisines_id: '',
                cuisines_type: '',
                cuisines_selected: 0,
                cuisine_list: []
            };
        });

        const hostingDetails = await new Promise((resolve, reject) => {
            con.query(`
                SELECT cuisine_style
                FROM tbl_hosting
                WHERE id = '${hosting_id}'`, (err, rows) => {
                if (err) reject(err);
                resolve(rows && rows.length > 0 ? rows[0].cuisine_style : '');
            });
        });
        const hostingCuisineIds = hostingDetails.split(',').map(Number);

        const defaultCuisineId = 15; // Change this to the actual ID of the default cuisine
        const defaultCuisineType = await getCuisineTypeById(defaultCuisineId);

        // ... (previous code remains unchanged)

        // ... (previous code remains unchanged)

        // ... (previous code remains unchanged)

        for (const dayEntry of result) {
            // ... (previous code remains unchanged)

            // Include all available cuisines for each day
            for (const id of hostingCuisineIds) {
                const cuisineType = await getCuisineTypeById(id);
                const isCuisineSelectedForTimeSlot = await isCuisineSelectedForDay(hosting_id, dayEntry.day, id);
                dayEntry.cuisine_list.push({
                    id: id,
                    cuisines: cuisineType,
                    is_selected: isCuisineSelectedForTimeSlot ? 1 : 0
                });
            }

            // Set cuisines_type only when is_selected is 1
            const selectedCuisine = dayEntry.cuisine_list.find(cuisine => cuisine.is_selected === 1);
            dayEntry.cuisines_type = selectedCuisine ? selectedCuisine.cuisines : '';

            // Set cuisines_selected to 1 only if at least one cuisine is selected in the list
            if (dayEntry.cuisine_list.some(cuisine => cuisine.is_selected === 1)) {
                dayEntry.cuisines_selected = 1;
            }

            // ... (rest of the code remains unchanged)
        }

        // Update with the selected time slot information
        for (const day of allDays) {
            const dayEntry = result.find(entry => entry.day.toUpperCase() === day.toUpperCase());
            if (dayEntry) {
                const timeSlotInfo = await getTimeSlotInfo(hosting_id, day);
                dayEntry.is_selected = timeSlotInfo ? 1 : 0;

                if (dayEntry.is_selected) {
                    dayEntry.cuisines_id = timeSlotInfo.cuisine_id;
                    dayEntry.opening_time = timeSlotInfo.opening_time;
                    dayEntry.closing_time = timeSlotInfo.closing_time;
                }

                if (dayEntry.day !== "Every day" && dayEntry.is_selected) {
                    let isDaySelected = false;
                    for (const id of hostingCuisineIds) {
                        const cuisineType = await getCuisineTypeById(id);
                        const isCuisineSelectedForTimeSlot = await isCuisineSelectedForDay(hosting_id, day, id);
                        // Check if the cuisine with this id is already present in the cuisine_list
                        const existingCuisineIndex = dayEntry.cuisine_list.findIndex(cuisine => cuisine.id === id);
                        if (existingCuisineIndex === -1) {
                            dayEntry.cuisine_list.push({
                                id: id,
                                cuisines: cuisineType,
                                is_selected: isCuisineSelectedForTimeSlot ? 1 : 0
                            });
                        } else {
                            // Update is_selected if the cuisine is already present
                            dayEntry.cuisine_list[existingCuisineIndex].is_selected = isCuisineSelectedForTimeSlot ? 1 : 0;
                        }
                        if (isCuisineSelectedForTimeSlot) {
                            isDaySelected = true;
                        }
                    }

                    // Set cuisines_type only when is_selected is 1
                    const selectedCuisine = dayEntry.cuisine_list.find(cuisine => cuisine.is_selected === 1);
                    dayEntry.cuisines_type = selectedCuisine ? selectedCuisine.cuisines : '';
                    dayEntry.cuisines_selected = dayEntry.cuisine_list.length > 0 ? 1 : 0;

                    // Set is_selected to 1 if at least one cuisine is selected for the day
                    dayEntry.is_selected = isDaySelected ? 1 : 0;
                }
            }
        }

        // Check if all days have at least one cuisine selected
        const allDaysSelected = result.slice(1).every(day => day.cuisine_list.length > 0 && day.cuisine_list.some(cuisine => cuisine.is_selected === 1));

        // Set "Every day" to selected if all other days have at least one cuisine selected
        result[0].is_selected = allDaysSelected ? 1 : 0;

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// ... (rest of the code remains the same)


const getTimeSlotInfo = async (hosting_id, day) => {
    return new Promise((resolve, reject) => {
        con.query(`
            SELECT cuisine_id, opening_time, closing_time
            FROM time_slots
            WHERE hosting_id = '${hosting_id}' AND day = '${day}'`, (err, rows) => {
            if (err) reject(err);
            resolve(rows && rows.length > 0 ? rows[0] : null);
        });
    });
};

// Function to get cuisine type by ID from cuisine_list table
const getCuisineTypeById = async (id) => {
    return new Promise((resolve, reject) => {
        con.query(`
            SELECT id, cuisine_type
            FROM cuisine_list
            WHERE id = '${id}'`, (err, rows) => {
            if (err) reject(err);
            resolve(rows && rows.length > 0 ? rows[0].cuisine_type : '');
        });
    });
};

const isCuisineSelectedForDay = async (hosting_id, day, cuisine_id) => {
    return new Promise((resolve, reject) => {
        con.query(`
            SELECT COUNT(*) AS count
            FROM time_slots
            WHERE hosting_id = '${hosting_id}' AND day = '${day}' AND cuisine_id = '${cuisine_id}'`, (err, rows) => {
            if (err) reject(err);
            resolve(rows && rows.length > 0 && rows[0].count > 0);
        });
    });
};


const changeMenus = async (req, res) => {
    const { hosting_id, dish_data } = req.body;
    try {
        if (dish_data !== undefined) {

            async function insertData(data) {
                for (const cuisine of data) {
                    const cuisineId = cuisine.Cuisine_id;
                    const no_of_courses = cuisine.no_of_courses;
                    const dishes = cuisine.dishes; // Adjust based on cuisine type
                    // console.log(dishes.length);

                    const deleteQuery = `delete from hosting_menu where host_id=? and hosting_id=?`;
                    await con.query(deleteQuery, [req.user.id, hosting_id], (err, result) => {
                        if (err) throw err;
                    })
                    for (const dish of dishes) {
                        const { name, allegen, dish_picture } = dish;
                        //console.log(dish_picture);
                        async function imageUrlToBase64(url) {
                            try {
                                const response = await fetch(url);

                                const blob = await response.arrayBuffer();

                                const contentType = response.headers.get('content-type');

                                const base64String = `data:${contentType};base64,${Buffer.from(
                                    blob,
                                ).toString('base64')}`;

                                return base64String;
                            } catch (err) {
                                console.log(err);
                            }
                        }

                        imageUrlToBase64(dish_picture).then(base64String => {
                            // console.log(base64String);
                            // let img_url = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
                            let img_url = base64String;
                            var matches = img_url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
                                response = {};

                            if (matches.length !== 3) {
                                return new Error('Invalid input string');
                            }

                            response.type = matches[1];

                            //console.log(typeof(Number(matchValue)))
                            response.data = new Buffer.from(matches[2], 'base64');
                            // console.log(response);
                            let decodedImg = response;
                            let imageBuffer = decodedImg.data;
                            let type = decodedImg.type;
                            let extension = mime.getExtension(type);
                            let fileName = Date.now() + '-' + "image." + extension;
                            try {
                                fs.writeFileSync("./public/images/" + fileName, imageBuffer, 'utf8');
                                //return res.send({ "status": "success" });
                            } catch (e) {
                                console.log(e);
                            }
                            // console.log(fileName);

                            const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                            const values = [req.user.id, hosting_id, cuisineId, no_of_courses, name, allegen, fileName];
                            con.query(query, values, (err, data) => {
                                if (err) throw err;
                            });
                        });
                    }
                }
                res.status(200).send({
                    success: true,
                    message: "Successfully update menu"
                })
            }
            await insertData(dish_data);
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const SendApologyToVisitor = async (req, res) => {
    try {
        const { user_id, visitor_id, message } = req.body;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                message: "Provide user id !"
            })
        }
        if (!visitor_id) {
            return res.status(400).send({
                success: false,
                message: "Provide visitor id !"
            })
        }
        if (!message) {
            return res.status(400).send({
                success: false,
                message: "Please enter message !"
            })
        }
        const insertNotificationSql = 'INSERT INTO notification_details (title, message, send_by) VALUES (?, ?, ?)';
        await con.query(insertNotificationSql, ["Send Apology for not Responed", message, 2], (err, notification) => {
            if (err) throw err;
            const insertNotificationSql = 'INSERT INTO tbl_notifications (user_id, sender_id, notification_id) VALUES (?, ?, ?)';
            con.query(insertNotificationSql, [visitor_id, user_id, notification.insertId], (err, result) => {
                if (err) throw err;
            });
        });

        res.status(200).send({
            success: true,
            message: 'Notification sent successfully'
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const uploadHostingImage = async (req, res) => {
    try {
        const { host_id, hosting_id } = req.body;
        if (!host_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide host id"
            })
        }
        if (!hosting_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide hosting id"
            })
        }
        if (req.files.area_image !== undefined) {
            var Query = `delete from hosting_images where hosting_id=?`;
            con.query(Query, [hosting_id], (err, data) => {
                if (err) throw err;
            });
            
            let area_images = req.files.area_image;
            console.log(area_images);
            area_images.forEach(image => {
                var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                con.query(Query, [host_id, hosting_id, image.filename], (err, data) => {
                    if (err) throw err;
                    // res.send('image')
                    
                });
            })
            res.status(200).send({
                success: true,
                message: "Images uploaded successfully"
            })
        }
        else
        {
            res.status(400).send({
                success: false,
                message: "Please select at least one image"
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

const DeleteHostingImages = async (req, res) => {
    try {
        const { image_id } = req.body;
        if (!image_id) {
            return res.status(400).send({
                success: false,
                message: "Please provide image id"
            })
        }
        const deleteQuery = `delete from hosting_images where id=?`;
        await con.query(deleteQuery, [image_id], (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    message: "image deleted successfully"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Failed to delete images"
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

module.exports = {
    HostRegister, addHosting, GetHostings, UpBookings, PreBookings, AcceptBooking, RejectBooking,
    Ratings, getRating, MyRatings, add_Hosting, addCuisine, getCuisine, HostingById,
    deleteHosting, exploreList, expHostingById, RatingsReviews, GetHostingsDetails, getTimeSlot, changeMenus, 
    SendApologyToVisitor, uploadHostingImage, DeleteHostingImages
}
