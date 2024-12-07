const { promises } = require('fs');
const con = require('../config/database');
const { log } = require('console');

const activityList = async (req, res) => {
    try {
        const { activity_type } = req.body;
        var selectQuery = `select * from activities_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into activities_list (activity_type) values ('${activity_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Activity added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].activity_type === activity_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into activities_list (activity_type) values ('${activity_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Activity added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Activity is already exist !"
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

const allergensList = async (req, res) => {
    try {
        const { name } = req.body;
        var selectQuery = `select * from allergens_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into allergens_list (name) values ('${name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Allergen added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into allergens_list (name) values ('${name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Allergen added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Allergen is already exist !"
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

const areaList = async (req, res) => {
    try {
        const { area_type } = req.body;
        var selectQuery = `select * from area_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into area_list(area_type) values ('${area_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Area added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].area_type === area_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into area_list (area_type) values ('${area_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Area added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Area is already exist !"
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

const cuisineList = async (req, res) => {
    try {
        const { cuisine_type } = req.body;
        var selectQuery = `select * from cuisine_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into cuisine_list (cuisine_type) values ('${cuisine_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Cuisine added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].cuisine_type === cuisine_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into cuisine_list (cuisine_type) values ('${cuisine_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Cuisine added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Cuisine is already exist !"
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

const placeList = async (req, res) => {
    try {
        const { place_type } = req.body;
        var selectQuery = `select * from place_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into place_list (place_type) values ('${place_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Place added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].place_type === place_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into place_list (place_type) values ('${place_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Place added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Place is already exist !"
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

const GetActivity = async (req, res) => {
    try {
        var selectQuery = `select * from activities_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetAllergens = async (req, res) => {
    try {
        var selectQuery = `select * from allergens_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetArea = async (req, res) => {
    try {
        var selectQuery = `select * from area_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetCuisine = async (req, res) => {
    try {

        var selectQuery = `select * from cuisine_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetPlace = async (req, res) => {
    try {
        var selectQuery = `select * from place_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const UpdateActivity = async (req, res) => {
    const { id, activity_type } = req.body;
    if (!id || !activity_type) {
        res.status(400).send({
            success: false,
            message: "Provide id or activity_type"
        })
    }
    else {
        try {
            let sql = "Select * from activities_list where LOWER(activity_type)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [activity_type, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Activity is already exist !"
                    })
                }
                else {
                    let updateQuery = "update activities_list set activity_type=? where id=?";
                    con.query(updateQuery, [activity_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const UpdateAllergens = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).send({
            success: false,
            message: "Provide id or name !"
        })
    }
    else {
        try {
            let sql = "Select * from allergens_list where LOWER(name)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [name, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Allergens is already exist !"
                    })
                }
                else {
                    let updateQuery = "update allergens_list set name=? where id=?";
                    con.query(updateQuery, [name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const UpdateArea = async (req, res) => {
    const { id, area_type } = req.body;
    if (!id || !area_type) {
        res.status(400).send({
            success: false,
            message: "Provide id and area_type !"
        })
    }
    else {
        try {
            let sql = "Select * from area_list where LOWER(area_type)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [area_type, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Area type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update area_list set area_type=? where id=?";
                    con.query(updateQuery, [area_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const UpdateCuisine = async (req, res) => {
    const { id, cuisine_type } = req.body;
    if (!id || !cuisine_type) {
        res.status(400).send({
            success: false,
            message: "Provide id or cuisine_type !"
        })
    }
    else {
        try {
            let sql = "Select * from cuisine_list where LOWER(cuisine_type)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [cuisine_type, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Cuisine type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update cuisine_list set cuisine_type=? where id=?";
                    con.query(updateQuery, [cuisine_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const Updateplace = async (req, res) => {
    const { id, place_type } = req.body;
    if (!id || !place_type) {
        res.status(400).send({
            success: false,
            message: "Provide id or place_type !"
        })
    }
    else {
        try {
            let sql = "Select * from place_list where LOWER(place_type)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [place_type, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Place type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update place_list set place_type=? where id=?";
                    con.query(updateQuery, [place_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const DeleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from activities_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Activity is already deleted !"
                    })
                }
                else {
                    var sql = "update activities_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Activity deleted successfully!"
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

const DeleteAllergens = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from allergens_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Allergens is already deleted !"
                    })
                }
                else {
                    var sql = "update allergens_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Allergens deleted successfully!"
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

const DeleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from area_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Area is already deleted !"
                    })
                }
                else {
                    var sql = "update area_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Area deleted successfully!"
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

const DeleteCuisine = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from cuisine_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Cuisine is already deleted !"
                    })
                }
                else {
                    var sql = "update cuisine_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Cuisine deleted successfully!"
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

const Deleteplace = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from place_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Place is already deleted !"
                    })
                }
                else {
                    var sql = "update place_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Place deleted successfully!"
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

const termsConditions = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "Please enter heading or description !"
            })
        }
        else {
            let sql = "select * from terms_conditions";
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let updateQuery = "update terms_conditions set heading=?, description=? where id=?";
                    con.query(updateQuery, [heading, description, data[0].id], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update terms and conditions successfully !"
                        })
                    })
                }
                else {
                    let InsertQuery = "insert into terms_conditions (heading, description) values (?,?)";
                    con.query(InsertQuery, [heading, description], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Add details successfully !"
                        })
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

const GetTerms = async (req, res) => {
    try {
        let selectQuery = "select * from terms_conditions";
        await con.query(selectQuery, (err, data) => {
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
                    message: "Data not found!"
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

const PrivacyPolicy = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "Enter heading or description !"
            })
        }
        else {
            let sql = "select * from privacy_policy";
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let updateQuery = "update privacy_policy set heading =?, description=? where id=?";
                    con.query(updateQuery, [heading, description, data[0].id], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update Data Successfully !"
                        })
                    })
                }
                else {
                    let InsertQuery = "insert into privacy_policy (heading, description) values (?,?)";
                    con.query(InsertQuery, [heading, description], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Add Data Successfully !"
                        })
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

const GetPrivacy = async (req, res) => {
    try {
        let selectQuery = "select * from privacy_policy";
        await con.query(selectQuery, (err, data) => {
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
                    message: "Data not found!"
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

const CancelationPolicy = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "All fields are required !"
            })
        }
        else {
            let sql = `select * from cancel_policy`;
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let update = `update cancel_policy set heading=?, description=? where id=?`;
                    con.query(update, [heading, description, data[0].id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update cancellation policy successfully !"
                        })
                    })
                }
                else {
                    let insert = `insert into cancel_policy (heading, description) values(?,?)`;
                    con.query(insert, [heading, description], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Add details successfully !"
                        })
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

const getCancelPolicy = async (req, res) => {
    try {
        let sqlQuery = `select * from cancel_policy`;
        await con.query(sqlQuery, (err, data) => {
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
                    message: "Data not found !"
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

const bookingRequire = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "All fields are required !"
            })
        }
        else {
            sql = `select * from book_requirement`;
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let updateQuery = `update book_requirement set heading=?, description=? where id=?`;
                    con.query(updateQuery, [heading, description, data[0].id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update booking requirement successfully !"
                        })
                    })
                }
                else {
                    let selectQuery = `insert into book_requirement (heading, description) values(?,?)`;
                    con.query(selectQuery, [heading, description], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Details added successfully !"
                        })
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

const GetBookRequire = async (req, res) => {
    try {
        let sqlQuery = `select * from book_requirement`;
        await con.query(sqlQuery, (err, data) => {
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
                    message: "Details not found !"
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

const countAll = async (req, res) => {
    try {
        let sqlQuery = `SELECT COUNT(*) as no_of_visitors 
                FROM tbl_visitors 
                WHERE NOT EXISTS (
                    SELECT * 
                    FROM tbl_hosts 
                    WHERE tbl_hosts.visitor_id = tbl_visitors.id
                )
                AND tbl_visitors.is_deleted = 0 
                AND tbl_visitors.is_deactivate = 0`;

        await con.query(sqlQuery, (err, visitors) => {
            if (err) throw err;
            let query = `SELECT COUNT(*) as no_of_hosts 
             FROM tbl_hosts 
             WHERE visitor_id IN (
                 SELECT id 
                 FROM tbl_visitors 
                 WHERE is_deleted = 0 
                 AND is_deactivate = 0
             )`;

            con.query(query, (err, hosts) => {
                if (err) throw err;
                let query1 = `SELECT COUNT(*) as no_of_bookings from tbl_booking Where is_deleted='${0}'`;
                con.query(query1, (err, bookings) => {
                    if (err) throw err;
                    let query2 = `SELECT COUNT(*) as cancel_orders from tbl_booking where status='${3}' and is_deleted='${0}'`;
                    con.query(query2, (err, cancel) => {
                        if (err) throw err;
                        let details = {
                            no_of_visitors: visitors[0].no_of_visitors,
                            no_of_hosts: hosts[0].no_of_hosts,
                            no_of_booking: bookings[0].no_of_bookings,
                            cancel_booking: cancel[0].cancel_orders
                        }
                        res.status(200).send({
                            success: true,
                            details
                        })
                    })
                })
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

const friendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        let sqlQuery = `select * from friend_requests where sender_id=? and receiver_id=? and status=?`;
        await con.query(sqlQuery, [req.user.id, receiverId, 'pending'], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                const query = 'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)';
                con.query(query, [req.user.id, receiverId], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).json({
                            success: true,
                            message: 'Friend request sent'
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Error sending friend request'
                        });
                    }
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "you have already sent a request"
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

const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        let sqlQuery = `select * from friend_requests where status=? and id=?`;
        await con.query(sqlQuery, ['accepted', requestId], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                const query = 'UPDATE friend_requests SET status = ? WHERE id = ?';
                con.query(query, ['accepted', requestId], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).json({
                            success: true,
                            message: 'Friend request accepted !'
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Error accepting friend request !'
                        });
                    }
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "You have already accept the friend request !"
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

/* try {
        const { sender_id, receiver_id, message_text } = req.body;
        var sender=sender_id;
        var receiver=receiver_id;
        // console.log(req.user.id);
       // console.log(receiver_id);
        if(receiver_id == req.user.id)
        {
            
            sender=receiver_id;
            receiver=sender_id;
        }
        const newMessage = {
            sender_id: sender, // Replace with the sender's user ID
            receiver_id: receiver, // Replace with the receiver's user ID
            message_text: message_text,
        };
        await con.query(`select on_chat from tbl_messages where sender_id='${newMessage.sender_id}' and receiver_id = '${newMessage.receiver_id}' ORDER BY send_date DESC LIMIT 1`, (err, details) => {
            if (err) throw err;
           // console.log(details);
            if (details.length > 0) {
                if (details[0].on_chat == 1) {
                    
                    con.query(`INSERT INTO tbl_messages SET sender_id='${newMessage.sender_id}', receiver_id='${newMessage.receiver_id}', message_text='${newMessage.message_text}', is_seen='${1}', on_chat='${1}'`, (error, updateResults) => {
                        if (error) throw error;
                        if (updateResults.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Message has been successfully sent"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Message failed to send"
                            })
                        }
                    });
                }
                else {
                    con.query('INSERT INTO tbl_messages SET ?', newMessage, (error, results) => {
                        if (error) throw error;
                        if (results.affectedRows > 0) {
                            // if(results.insertId)
                            res.status(200).send({
                                success: true,
                                message: "Message has been successfully sent"
                            })

                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Message failed to send"
                            })
                        }
                    });
                }
            }
            else {
                con.query('INSERT INTO tbl_messages SET ?', newMessage, (error, results) => {
                    if (error) throw error;
                    if (results.affectedRows > 0) {
                        // if(results.insertId)
                        res.status(200).send({
                            success: true,
                            message: "Message has been successfully sent"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Message failed to send"
                        })
                    }
                });
            }
        })

    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    } */

const sendMessage = async (req, res) => {
    try {
        const { receiver_id, message_text } = req.body;
        const newMessage = {
            sender_id: req.user.id, // Replace with the sender's user ID
            receiver_id: receiver_id, // Replace with the receiver's user ID
            message_text: message_text,
            //is_seen: 1,
            //on_chat:1
        };
        await con.query(`select on_chat from tbl_messages where sender_id='${newMessage.sender_id}' and receiver_id = '${newMessage.receiver_id}' ORDER BY send_date DESC LIMIT 1`, (err, details) => {
            if (err) throw err;
            console.log(details);
            if (details.length > 0) {
                if (details[0].on_chat == 1) {
                    con.query(`INSERT INTO tbl_messages SET sender_id='${newMessage.sender_id}', receiver_id='${newMessage.receiver_id}', message_text='${newMessage.message_text}', is_seen='${1}', on_chat='${1}'`, (error, updateResults) => {
                        if (error) throw error;
                        if (updateResults.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Message has been successfully sent"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Message failed to send"
                            })
                        }
                    });
                }
                else {
                    con.query('INSERT INTO tbl_messages SET ?', newMessage, (error, results) => {
                        if (error) throw error;
                        if (results.affectedRows > 0) {
                            // if(results.insertId)
                            res.status(200).send({
                                success: true,
                                message: "Message has been successfully sent"
                            })

                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Message failed to send"
                            })
                        }
                    });
                }
            }
            else {
                con.query('INSERT INTO tbl_messages SET ?', newMessage, (error, results) => {
                    if (error) throw error;
                    if (results.affectedRows > 0) {
                        // if(results.insertId)
                        res.status(200).send({
                            success: true,
                            message: "Message has been successfully sent"
                        })

                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Message failed to send"
                        })
                    }
                });
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

/* const sendMessage = async (req, res) => {
    try {
        const { receiver_id, message_text } = req.body;
        const sender_id = req.user.id;

        // Check if the chat is already on
        const [details] = await new Promise((resolve, reject) => {
            con.query('SELECT on_chat FROM tbl_messages WHERE sender_id=? AND receiver_id=? ORDER BY send_date DESC LIMIT 1', [sender_id, receiver_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        let query;
        let values;

        if (details.length > 0 && details[0].on_chat === 1) {
            // Update existing chat
            query = 'INSERT INTO tbl_messages SET sender_id=?, receiver_id=?, message_text=?, is_seen=?, on_chat=?';
            values = [sender_id, receiver_id, message_text, 1, 1];
        } else {
            // Start a new chat
            query = 'INSERT INTO tbl_messages SET sender_id=?, receiver_id=?, message_text=?, is_seen=?, on_chat=?';
            values = [sender_id, receiver_id, message_text, 1, 1];
        }

        // Execute the query
        const results = await new Promise((resolve, reject) => {
            con.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (results.affectedRows > 0) {
            res.status(200).send({
                success: true,
                message: "Message has been successfully sent"
            });
        } else {
            res.status(400).send({
                success: false,
                message: "Message failed to send"
            });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}; */


const getMessagesList = async (req, res) => {
    try {
        /* const query = `SELECT * FROM tbl_messages
            WHERE (sender_id = ? OR receiver_id = ?)
            AND send_date = (SELECT MAX(send_date) FROM tbl_messages WHERE sender_id = ? OR receiver_id = ?)`;
        con.query(query, [req.user.id, req.user.id, req.user.id, req.user.id], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.status(200).json({
                    success: true,
                    messages: results
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'No messages found'
                });
            }
        }); */
        /* const userId = req.user.id; // Replace with the ID of the current user

        const query = `SELECT 
                CASE
                    WHEN sender_id = ? THEN receiver_id
                    WHEN receiver_id = ? THEN sender_id
                END AS other_user_id,
                MAX(send_date) AS latest_send_date
            FROM tbl_messages
            WHERE (sender_id = ? OR receiver_id = ?)
            GROUP BY other_user_id`;

        con.query(query, [userId, userId, userId, userId], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                const latestMessages = [];

                results.forEach((result) => {
                    const otherUserId = result.other_user_id;
                    const latestSendDate = result.latest_send_date;

                    const getMessageQuery = `
                        SELECT * FROM tbl_messages
                        WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
                        AND send_date = ?
                    `;

                    con.query(
                        getMessageQuery,
                        [userId, otherUserId, otherUserId, userId, latestSendDate],
                        (err, messageResults) => {
                            if (err) throw err;

                            latestMessages.push(messageResults[0]);
                            // {
                               // user_id: otherUserId,
                               // latest_message: messageResults[0],
                           // } 

                            if (latestMessages.length === results.length) {
                                res.status(200).json({
                                    success: true,
                                    messages: latestMessages,
                                });
                            }
                        }
                    );
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'No messages found',
                });
            }
        }); */
        const userId = req.user.id; // Replace with the ID of the current user

        const query = `SELECT CASE
            WHEN sender_id = ? THEN receiver_id
            WHEN receiver_id = ? THEN sender_id
            END AS other_user_id,
            MAX(send_date) AS latest_send_date FROM tbl_messages
            WHERE (sender_id = ? OR receiver_id = ?) GROUP BY other_user_id ORDER BY latest_send_date DESC`;

        await con.query(query, [userId, userId, userId, userId], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                const latestMessages = [];
                // console.log(results);
                results.forEach((result) => {
                    const otherUserId = result.other_user_id;
                    const latestSendDate = result.latest_send_date;

                    /* const getMessageQuery = `SELECT m.*, u.profile AS sender_profile, 
                    CONCAT(u.first_name, ' ' , u.last_name) as sender_name, u.id as sent_to
                    FROM tbl_messages m
                    LEFT JOIN tbl_visitors u ON ((m.sender_id = u.id AND m.sender_id !='${req.user.id}') 
                    OR (m.receiver_id = u.id AND m.receiver_id !='${req.user.id}'))
                    WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
                    AND send_date = ?`;

                    con.query(
                        getMessageQuery,
                        [userId, otherUserId, otherUserId, userId, latestSendDate],
                        (err, messageResults) => {
                            if (err) throw err;

                            latestMessages.push(messageResults[0]);

                            if (latestMessages.length === results.length) {
                                res.status(200).json({
                                    success: true,
                                    message: "Message List",
                                    data: latestMessages,
                                });
                            }
                        }
                    ); */
                    const getMessageQuery = `
    SELECT m.*, u.profile AS sender_profile, 
    CONCAT(u.first_name, ' ' , u.last_name) as sender_name, u.id as sent_to,
    CASE
        WHEN m.sender_id = ? THEN 1
        ELSE m.is_seen
    END AS is_seen
    FROM tbl_messages m
    LEFT JOIN tbl_visitors u ON ((m.sender_id = u.id AND m.sender_id != '${req.user.id}') 
    OR (m.receiver_id = u.id AND m.receiver_id != '${req.user.id}'))
    WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
    AND send_date = ?
`;

                    con.query(
                        getMessageQuery,
                        [userId, userId, otherUserId, otherUserId, userId, latestSendDate],
                        (err, messageResults) => {
                            if (err) throw err;

                            latestMessages.push(messageResults[0]);

                            if (latestMessages.length === results.length) {
                                res.status(200).json({
                                    success: true,
                                    message: "Message List",
                                    data: latestMessages,
                                });
                            }
                        }
                    );

                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No messages found',
                    data: results
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

const UpdateChatOnBack = async (req, res) => {
    try {
        const { message_id, receiver_id } = req.body
        if (receiver_id == req.user.id) {
            //res.send("hii")
            const query = 'UPDATE tbl_messages SET on_chat = ? WHERE id = ?';
            await con.query(query, [0, message_id], (err, result) => {
                if (err) throw err;
                res.status(200).send({
                    success: true,
                    message: "Chat status updated successfully"
                })
            });
        }
        else {
            res.status(200).send({
                success: true,
                message: "Chat status updated successfully"
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

const UpdateChatOnEnter = async (req, res) => {
    try {
        const { message_id, receiver_id } = req.body
        if (receiver_id == req.user.id) {
            const query = 'UPDATE tbl_messages SET on_chat = ?, is_seen =? WHERE id = ?';
            await con.query(query, [1, 1, message_id], (err, result) => {
                if (err) throw err;
                res.status(200).send({
                    success: true,
                    message: "Chat status updated successfully"
                })
            });
        }
        else {
            res.status(200).send({
                success: true,
                message: "Chat status updated successfully"
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

// const getAllMessages = async (req, res) => {
//     /*  try {
//          const { sender_id, receiver_id } = req.body;
//          const query = `SELECT m.*, u.profile AS sender_profile, CONCAT(u.first_name, ' ' , u.last_name) as sender_name FROM tbl_messages m
//              LEFT JOIN tbl_visitors u ON ((m.sender_id = u.id AND m.sender_id !='${req.user.id}') OR (m.receiver_id = u.id AND m.receiver_id !='${req.user.id}'))
//              WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
//              ORDER BY send_date`;

//          await con.query(query, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
//              if (err) throw err;
//              // console.log(results);
//              if (results.length > 0) {
//                  res.status(200).send({
//                      success: true,
//                      messages: "All Messages",
//                      data: results
//                  });
//              }
//              else {
//                  res.status(400).json({
//                      success: false,
//                      message: 'No messages found',
//                      data: results
//                  });
//              }
//          })
//      } catch (error) {
//          res.status(500).send({
//              success: false,
//              message: error.message
//          })
//      } */
//     try {
//         const { sender_id, receiver_id } = req.body;
//         const query = `SELECT m.*, u.profile AS sender_profile, CONCAT(u.first_name, ' ' , u.last_name) as sender_name FROM tbl_messages m
//             LEFT JOIN tbl_visitors u ON ((m.sender_id = u.id AND m.sender_id !='${req.user.id}') OR (m.receiver_id = u.id AND m.receiver_id !='${req.user.id}'))
//             WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
//             ORDER BY send_date`;

//         const getLastMessageQuery = `
//             SELECT id, receiver_id
//             FROM tbl_messages
//             WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
//             ORDER BY send_date DESC
//             LIMIT 1`;

//         await con.query(query, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
//             if (err) throw err;
//             // console.log(results);
//             if (results.length > 0) {
//                 con.query(getLastMessageQuery, [sender_id, receiver_id, receiver_id, sender_id], (err, lastMessageResult) => {
//                     if (err) throw err;
//                     res.status(200).send({
//                         success: true,
//                         messages: "All Messages",
//                         last_messagesId: lastMessageResult[0].id.toString(),
//                         last_receiverId: lastMessageResult[0].receiver_id.toString(),
//                         data: results
//                     });
//                 });
//             }
//             else {
//                 res.status(200).json({
//                     success: true,
//                     message: 'No messages found',
//                     last_messagesId: "",
//                     last_receiverId: "",
//                     data: results
//                 });
//             }
//         })
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: error.message
//         })
//     }
// }


const getAllMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.body;

        const query = `
            SELECT m.*, u.profile, CONCAT(u.first_name, ' ', u.last_name) as sender_name
            FROM tbl_messages m
            LEFT JOIN tbl_visitors u ON m.sender_id = u.id
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY send_date`;

        const getLastMessageQuery = `
            SELECT id, receiver_id
            FROM tbl_messages
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY send_date DESC
            LIMIT 1`;

        await con.query(query, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                con.query(getLastMessageQuery, [sender_id, receiver_id, receiver_id, sender_id], (err, lastMessageResult) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        messages: "All Messages",
                        last_messagesId: lastMessageResult[0].id.toString(),
                        last_receiverId: lastMessageResult[0].receiver_id.toString(),
                        data: results
                    });
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No messages found',
                    last_messagesId: "",
                    last_receiverId: "",
                    data: results
                });
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}




const countryList = async (req, res) => {
    try {
        const { country_name } = req.body;
        var selectQuery = `select * from country_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into country_list (name) values ('${country_name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Country added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === country_name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into country_list (name) values ('${country_name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Country added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Country is already exist !"
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

const GetCountry = async (req, res) => {
    try {
        var selectQuery = `select * from country_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const UpdateCountry = async (req, res) => {
    const { id, country_name } = req.body;
    if (!id || !country_name) {
        res.status(400).send({
            success: false,
            message: "Provide id and country_name !"
        })
    }
    else {
        try {
            let sql = "Select * from country_list where LOWER(name)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [country_name, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Country is already exist !"
                    })
                }
                else {
                    let updateQuery = "update country_list set name=? where id=?";
                    con.query(updateQuery, [country_name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const DeleteCountry = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from country_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Country is already deleted !"
                    })
                }
                else {
                    var sql = "update country_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Country deleted successfully!"
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

const LandingPgDetails = async (req, res) => {
    try {
        const { heading, sub_heading } = req.body;

        if (!heading && !sub_heading) {
            return res.status(400).send({
                success: false,
                message: "Please provide heading or sub-heading!"
            });
        }
        const data = await queryAsync("SELECT * FROM landing_page");
        if (data.length > 0) {
            const updateQuery = "UPDATE landing_page SET heading=?, sub_heading=? WHERE id=?";
            const updateResult = await queryAsync(updateQuery, [heading, sub_heading, data[0].id]);

            if (updateResult.affectedRows > 0) {
                let images = req.files;
                //console.log(images[0])
                /* if (images.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Please provide images!"
                    });
                } */

                // Insert new images
                const promises = images.map(image => {
                    const sqlQuery1 = "INSERT INTO landing_images (landing_id, images) VALUES (?, ?)";
                    return queryAsync(sqlQuery1, [data[0].id, image.filename]);
                });

                await Promise.all(promises);

                return res.status(200).send({
                    success: true,
                    message: "Update Details successfully!"
                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    message: "Failed to Update data"
                });
            }
        } else {
            const sqlQuery = "INSERT INTO landing_page (heading, sub_heading) VALUES (?, ?)";
            const inserted = await queryAsync(sqlQuery, [heading, sub_heading]);

            if (inserted.affectedRows > 0) {
                let images = req.files;
                if (images.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Please provide images!"
                    });
                }

                const promises = images.map(image => {
                    const sqlQuery1 = "INSERT INTO landing_images (landing_id, images) VALUES (?, ?)";
                    return queryAsync(sqlQuery1, [inserted.insertId, image.filename]);
                });

                await Promise.all(promises);

                return res.status(200).send({
                    success: true,
                    message: "Data inserted successfully!"
                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    message: "Failed to insert data"
                });
            }
        }
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const DeleteLandImages = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteQuery = `delete from landing_images where id=?`;
        await con.query(deleteQuery, [id], (err, data) => {
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

// Example function to execute SQL queries asynchronously using a promise
function queryAsync(sql, values) {
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

const getDetailsLand = async (req, res) => {
    try {
        const sql = `select * from landing_page`;
        con.query(sql, (err, details) => {
            if (err) throw err;
            if (details.length > 0) {
                const sql1 = `select * from landing_images where landing_id=?`;
                con.query(sql1, [details[0].id], (err, images) => {
                    if (err) throw err;
                    const arr_img = [];
                    images.forEach(img => {
                        arr_img.push({ id: img.id, img_url: "http://suppr.me/images/" + img.images });
                    });

                    var data = {
                        heading: details[0].heading,
                        sub_heading: details[0].sub_heading,
                        images: arr_img
                    };

                    res.status(200).send({
                        success: true,
                        data: data
                    });
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                });
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

/* const getPgDetails = async (req, res) => {
    try {
        const sql = `select * from landing_page`;
        con.query(sql, (err, details) => {
            if (err) throw err;
            if (details.length > 0) {
                const sql1 = `select * from landing_images where landing_id=?`;
                con.query(sql1, [details[0].id], (err, images) => {
                    if (err) throw err;
                    const arr_img = [];
                    images.forEach(img => {
                        arr_img.push({ img_url: "http://suppr.me/images/" + img.images });
                    });

                    var data = {
                        heading: details[0].heading,
                        sub_heading: details[0].sub_heading,
                        images: arr_img
                    };

                    res.status(200).send({
                        success: true,
                        data: data
                    });
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                });
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
} */

const getPgDetails = async (req, res) => {
    try {
        const sql = `select * from landing_page`;
        con.query(sql, (err, details) => {
            if (err) throw err;
            if (details.length > 0) {
                const sql1 = `select * from landing_images where landing_id=?`;
                con.query(sql1, [details[0].id], (err, images) => {
                    if (err) throw err;
                    const arr_img = [];
                    images.forEach(img => {
                        arr_img.push({ img_url: "http://suppr.me/images/" + img.images });
                    });

                    // Remove <p> tags from sub_heading
                    const subHeadingWithoutTags = details[0].sub_heading.replace(/<\/?p>/g, '');

                    var data = {
                        heading: details[0].heading,
                        sub_heading: subHeadingWithoutTags,
                        images: arr_img
                    };

                    res.status(200).send({
                        success: true,
                        data: data
                    });
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                });
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


const EmirateList = async (req, res) => {
    try {
        const { name } = req.body;
        var selectQuery = `select * from emirate_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into emirate_list (name) values ('${name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Emirate added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into emirate_list (name) values ('${name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Emirate added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Emirate is already exist !"
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

const GetEmirateList = async (req, res) => {
    try {
        var selectQuery = `select * from emirate_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const UpdateEmirate = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).send({
            success: false,
            message: "Provide id or name"
        })
    }
    else {
        try {
            let sql = "Select * from emirate_list where LOWER(name)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [name, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Emirate is already exist !"
                    })
                }
                else {
                    let updateQuery = "update emirate_list set name=? where id=?";
                    con.query(updateQuery, [name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const deleteEmirate = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from emirate_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Emirate is already deleted !"
                    })
                }
                else {
                    var sql = "update emirate_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Emirate deleted successfully!"
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

const CityList = async (req, res) => {
    try {
        const { name } = req.body;
        var selectQuery = `select * from city_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into city_list (name) values ('${name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "City added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into city_list (name) values ('${name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "City added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "City is already exist !"
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

const GetCity = async (req, res) => {
    try {
        var selectQuery = `select * from city_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const UpdateCity = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).send({
            success: false,
            message: "Provide id or name"
        })
    }
    else {
        try {
            let sql = "Select * from city_list where LOWER(name)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [name, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This City is already exist !"
                    })
                }
                else {
                    let updateQuery = "update city_list set name=? where id=?";
                    con.query(updateQuery, [name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from city_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This City is already deleted !"
                    })
                }
                else {
                    var sql = "update city_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "City deleted successfully!"
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

const filterHostings = async (req, res) => {
    try {
        const { emirate, area, date, cuisine } = req.body;
        const { latitude, longitude, user_id } = req.body;
        function convertDateToDay(dateString) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date(dateString); // Parse the date string

            // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
            const dayIndex = date.getDay();

            // Use the day index to retrieve the day name from the array
            const dayName = daysOfWeek[dayIndex];

            return dayName;
        }

        let sql = `SELECT DISTINCT tbl_hosting.*, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile,
        tbl_hosts.host_name, tbl_hosts.about_me,
        (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) AS distance
FROM tbl_hosting 
INNER JOIN time_slots ON tbl_hosting.id = time_slots.hosting_id
INNER JOIN tbl_visitors ON tbl_visitors.id = tbl_hosting.host_id 
INNER JOIN tbl_hosts ON tbl_hosts.visitor_id = tbl_hosting.host_id
INNER JOIN cuisine_list ON cuisine_list.id = time_slots.cuisine_id
WHERE 1 AND form_type='${13}' AND tbl_hosting.host_id <> ${user_id}
AND (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) < 10`;

        if (emirate) {
            sql += ` AND state = '${emirate}'`;
        }

        if (area) {
            sql += ` AND city = '${area}'`;
        }

        if (date) {
            const dayName = convertDateToDay(date);
            sql += ` AND time_slots.day IN ('${dayName}')`;
        }

        if (cuisine) {
            sql += ` AND cuisine_list.cuisine_type IN ('${cuisine}')`;
        }

        sql += ` ORDER BY distance;`;

        // Example usage:
        con.query(
            sql,
            [latitude, longitude, latitude, latitude, longitude, latitude], (err, data) => {
                if (err) throw err;

                // Return the filtered results
                if (data.length < 1) {
                    res.status(400).send({
                        success: false,
                        message: "Data not found !"
                    })
                }
                else {
                    //res.send(data)
                    /*  console.log(data);
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
                                                         host_profile: data[i].profile,
                                                         created_at: data[i].created_at,
                                                         updated_at: data[i].updated_at,
                                                         // data: data[i],
                                                         dress_code: dress,
                                                         cuisine_list: cuisine_style,
                                                         activities_type: activities_type,
                                                         area_images: images,
                                                         rules: rules,
                                                         menus: formattedData,
                                                         time_slots: time,
                                                         book_requirement: requr[0],
                                                         cancel_policy: canpolicy[0]
                                                     }
                                                     arr.push(values)
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
                             data: arr
                         })
                     }, 1000) */
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

                            con.query(`select * from fav_hosting where visitor_id='${user_id}' and hosting_id='${data[i].id}'`, (err, find) => {
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
                                        lat: data[i].lat,
                                        lng: data[i].lng,
                                        cuisine_list: cuisine_style,
                                        area_images: images,
                                        is_favorite: is_favorite,
                                        rating: hostRating,
                                        distance: data[i].distance.toString()
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
            });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const filterHosting = async (req, res) => {
    try {
        const { country, emirate, city, area, date, cuisine } = req.body;
        const { latitude, longitude, user_id } = req.body;

        // Helper function to convert an array to a SQL IN clause
        function arrayToSqlInClause(arr) {
            return arr.map(value => `'${value}'`).join(', ');
        }

        function convertDateToDay(dateString) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date(dateString); // Parse the date string

            // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
            const dayIndex = date.getDay();

            // Use the day index to retrieve the day name from the array
            const dayName = daysOfWeek[dayIndex];

            return dayName;
        }

        let sql = `
            SELECT DISTINCT tbl_hosting.*, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile,
            tbl_hosts.host_name, tbl_hosts.about_me, countries.name as country_id, states.name as state,
            cities.name as city, tbl_area.area as area,
            (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) AS distance
            FROM tbl_hosting
            INNER JOIN countries ON tbl_hosting.country_id = countries.id
            INNER JOIN states ON tbl_hosting.state = states.id
            INNER JOIN cities ON tbl_hosting.city = cities.id
            INNER JOIN tbl_area ON tbl_hosting.area = tbl_area.id
            INNER JOIN time_slots ON tbl_hosting.id = time_slots.hosting_id
            INNER JOIN tbl_visitors ON tbl_visitors.id = tbl_hosting.host_id 
            INNER JOIN tbl_hosts ON tbl_hosts.visitor_id = tbl_hosting.host_id
            INNER JOIN cuisine_list ON cuisine_list.id = time_slots.cuisine_id
            WHERE 1 AND form_type='${13}' AND tbl_hosting.host_id <> ${user_id} AND is_approved='${1}'
            AND (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) < 10`;

        /*  if (Array.isArray(country) && country.length > 0) {
             sql += ` AND countries.name IN (${arrayToSqlInClause(country)})`;
         } */
        if (country) {
            sql += ` AND countries.name = '${country}'`;
        }
        if (emirate) {
            sql += ` AND states.name  = '${emirate}'`;
        }
        if (city) {
            sql += ` AND cities.name = '${city}'`;
        }
        if (area) {
            sql += ` AND tbl_area.area = '${area}'`;
        }

        if (date) {
            const dayName = convertDateToDay(date);
            sql += ` AND time_slots.day = '${dayName}'`;
        }
        if (cuisine) {
            sql += ` AND cuisine_list.cuisine_type = '${cuisine}'`;
        }

        sql += ` ORDER BY distance;`;

        con.query(
            sql,
            [latitude, longitude, latitude, latitude, longitude, latitude], (err, data) => {
                if (err) throw err;

                // Return the filtered results
                if (data.length < 1) {
                    res.status(200).send({
                        success: false,
                        message: "Data not found !"
                    })
                }
                else {
                    //res.send(data)
                    /*  console.log(data);
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
                                                         host_profile: data[i].profile,
                                                         created_at: data[i].created_at,
                                                         updated_at: data[i].updated_at,
                                                         // data: data[i],
                                                         dress_code: dress,
                                                         cuisine_list: cuisine_style,
                                                         activities_type: activities_type,
                                                         area_images: images,
                                                         rules: rules,
                                                         menus: formattedData,
                                                         time_slots: time,
                                                         book_requirement: requr[0],
                                                         cancel_policy: canpolicy[0]
                                                     }
                                                     arr.push(values)
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
                             data: arr
                         })
                     }, 1000) */
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

                        con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                            if (err) throw err;
                            //console.log(result)
                            var images = [];
                            result.forEach(item => {
                                images.push({ "img_url": "http://suppr.me/images/" + item.image });

                            })

                            // console.log(images)

                            con.query(`select * from fav_hosting where visitor_id='${user_id}' and hosting_id='${data[i].id}'`, (err, find) => {
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
                                        place_type: place_type,
                                        country: data[i].country_id,
                                        state: data[i].state,
                                        city: data[i].city,
                                        area: data[i].area,
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
                                        lat: data[i].lat,
                                        lng: data[i].lng,
                                        cuisine_list: cuisine_style,
                                        area_images: images,
                                        is_favorite: is_favorite,
                                        rating: hostRating,
                                        distance: data[i].distance.toString()
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
            });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const searchHosting = async (req, res) => {
    try {
        const { query } = req.query;

        let sql = `SELECT tbl_hosting.*, tbl_visitors.first_name, tbl_visitors.last_name, tbl_visitors.profile,
        tbl_hosts.host_name, tbl_hosts.about_me FROM tbl_hosting 
        INNER JOIN time_slots ON tbl_hosting.id = time_slots.hosting_id
        INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_hosting.host_id 
        INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id
        INNER JOIN cuisine_list on cuisine_list.id=time_slots.cuisine_id
        WHERE 1`;

        const params = [];

        if (query) {
            sql += `
            AND (
              state LIKE ? OR
              city LIKE ? OR
              time_slots.day LIKE ? OR
              cuisine_list.cuisine_type LIKE ?
            )`;
            params.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
        }

        // Example usage:

        await con.query(sql, params, (err, data) => {
            if (err) throw err;

            // Return the filtered results
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found!"
                });
            }
            else {
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
                                                    host_profile: data[i].profile,
                                                    created_at: data[i].created_at,
                                                    updated_at: data[i].updated_at,
                                                    // data: data[i],
                                                    dress_code: dress,
                                                    cuisine_list: cuisine_style,
                                                    activities_type: activities_type,
                                                    area_images: images,
                                                    rules: rules,
                                                    menus: formattedData,
                                                    time_slots: time,
                                                    book_requirement: requr[0],
                                                    cancel_policy: canpolicy[0]
                                                }
                                                arr.push(values)
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
                        data: arr
                    })
                }, 1000)
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

const interestsAdd = async (req, res) => {
    try {
        const { interest_name } = req.body;
        var selectQuery = `select * from interest_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into interest_list (interest_name) values ('${interest_name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Interest added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].interest_name === interest_name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into interest_list (interest_name) values ('${interest_name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Interest added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Interest is already exist !"
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

const GetInterest = async (req, res) => {
    try {
        var selectQuery = `select * from interest_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const deleteInterest = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from interest_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Interest is already deleted !"
                    })
                }
                else {
                    var sql = "update interest_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Interest deleted successfully!"
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

const updateInterest = async (req, res) => {
    const { id, interest_name } = req.body;
    if (!id || !interest_name) {
        res.status(400).send({
            success: false,
            message: "Provide id or interest_name"
        })
    }
    else {
        try {
            let sql = "Select * from interest_list where LOWER(interest_name)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [interest_name, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Interest is already exist !"
                    })
                }
                else {
                    let updateQuery = "update interest_list set interest_name=? where id=?";
                    con.query(updateQuery, [interest_name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const addPromoCode = async (req, res) => {
    const { coupon_name, coupon_code, discount_type, discount, start_date, end_date, free_coupon } = req.body;
    try {
        if (!coupon_name) {
            res.status(400).send({
                success: false,
                msg1: "Plesae enter coupon name !"
            })
        }
        else if (!coupon_code) {
            res.status(400).send({
                success: false,
                msg2: "Please enter coupon code!"
            })
        }
        else if (!start_date) {
            res.status(400).send({
                success: false,
                msg3: "Please select start date"
            })
        }
        else if (!end_date) {
            res.status(400).send({
                success: false,
                msg4: "Please select end date"
            })
        }
        else if (free_coupon == 0 && !discount_type) {
            res.status(400).send({
                success: false,
                msg5: "Please enter discount_type !"
            })
        }
        else if (free_coupon == 0 && !discount) {
            res.status(400).send({
                success: false,
                msg6: "Please enter discount value !"
            })
        }
        else {
            if (free_coupon == 1) {
                const InsertQuery = `INSERT INTO coupons (coupon_name, coupon_code, start_date, end_date, free_coupon) VALUES (?, ?, ?, ?, ?)`;
                await con.query(InsertQuery, [coupon_name, coupon_code, start_date, end_date, free_coupon], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "promo code inserted successfully !"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to insert promo code !"
                        })
                    }
                })
            }
            else {
                const InsertQuery = `INSERT INTO coupons (coupon_name, coupon_code, discount_type, discount, start_date, end_date, free_coupon) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                await con.query(InsertQuery, [coupon_name, coupon_code, discount_type, discount, start_date, end_date, free_coupon], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "promo code inserted successfully !"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to insert promo code !"
                        })
                    }
                })
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

const GetPromoList = async (req, res) => {
    try {
        const selectQuery = `select * from coupons where is_deleted=? ORDER BY created_at DESC`;
        await con.query(selectQuery, [0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    promo_code: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Promo code not found !"
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

const EditPromoCode = async (req, res) => {
    const { coupon_id, coupon_name, coupon_code, discount_type, discount, start_date, end_date, free_coupon } = req.body;
    try {
        if (!coupon_name) {
            res.status(400).send({
                success: false,
                msg1: "Plesae enter coupon name !"
            })
        }
        else if (!coupon_code) {
            res.status(400).send({
                success: false,
                msg2: "Please enter coupon code!"
            })
        }
        else if (!start_date) {
            res.status(400).send({
                success: false,
                msg3: "Please select start date"
            })
        }
        else if (!end_date) {
            res.status(400).send({
                success: false,
                msg4: "Please select end date"
            })
        }
        else if (free_coupon == 0 && !discount_type) {
            res.status(400).send({
                success: false,
                msg5: "Please enter discount_type !"
            })
        }
        else if (free_coupon == 0 && !discount) {
            res.status(400).send({
                success: false,
                msg6: "Please enter discount value !"
            })
        }
        else {
            if (free_coupon == 1) {
                const updatequery = `update coupons set coupon_name=?, coupon_code=?, discount_type=?, discount=?, start_date=?, end_date=?, free_coupon=? where id=?`;
                await con.query(updatequery, [coupon_name, coupon_code, null, null, start_date, end_date, free_coupon, coupon_id], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "Update promo code successfully !"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to update promo code !"
                        })
                    }
                })
            }
            else {
                const updateQuery = `update coupons set coupon_name=?, coupon_code=?, discount_type=?, discount=?, start_date=?, end_date=?, free_coupon=? where id=?`
                await con.query(updateQuery, [coupon_name, coupon_code, discount_type, discount, start_date, end_date, free_coupon, coupon_id], (err, update_promo) => {
                    if (err) throw err;
                    if (update_promo.affectedRows > 0) {
                        res.status(200).send({
                            success: true,
                            message: "Update promo code successfully !"
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to update promo code !"
                        })
                    }
                })
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

const DeletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from coupons where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "Promo code is already deleted !"
                    })
                }
                else {
                    var sql = "update coupons set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Promo code deleted successfully!"
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

const ApplyPromoCode = async (req, res) => {
    try {
        const { promo_code, original_price, total_guests } = req.body;
        const sqlQuery = `SELECT * FROM coupons WHERE coupon_code = ? and status=? and is_deleted=?`;
        await con.query(sqlQuery, [promo_code, 1, 0], (err, data) => {
            if (err) throw err;
            if (data.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Coupon not found'
                });
            }
            else {
                const coupon = data[0];
                const currentDate = new Date();
                if (coupon.start_date && coupon.end_date) {
                    const startDate = new Date(coupon.start_date);
                    const endDate = new Date(coupon.end_date);

                    if (currentDate < startDate || currentDate > endDate) {
                        res.status(400).json({
                            success: false,
                            message: 'Coupon is not valid for the current date'
                        });
                        return;
                    }

                    let discountedPrice = original_price;
                    // Apply the discount based on the coupon's discount_type
                    if (coupon.discount_type === 'percentage') {
                        discountedPrice = original_price - (original_price * (coupon.discount / 100));
                    } else if (coupon.discount_type === 'fixed') {
                        discountedPrice = original_price - coupon.discount;
                        if (discountedPrice < 0) {
                            discountedPrice = 0;
                        }
                    }
                    else if (coupon.free_coupon === 1) {
                        discountedPrice = 0;
                    }

                    var price_per_person = (discountedPrice / total_guests).toFixed(1);
                    if (price_per_person == Infinity) {
                        price_per_person = "0"
                    }
                    res.status(200).json({
                        success: true,
                        message: 'Apply promo code successfully',
                        discounted_price: discountedPrice.toString(),
                        price_per_person: price_per_person
                    });
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

const changePromoStatus = async (req, res) => {
    const { promocode_id } = req.body;
    try {
        let sql = "select status from coupons where id=?";
        await con.query(sql, [promocode_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                let status;
                if (data[0].status == 1) {
                    status = 0;
                }
                else {
                    status = 1;
                }
                let updateQuery = "update coupons set status=? where id=?";
                con.query(updateQuery, [status, promocode_id], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows < 1) {
                        res.status(400).send({
                            success: false,
                            msg: "Status has not been updated successfully!"
                        })
                    }
                    else {
                        res.status(200).send({
                            success: true,
                            msg: "Status has been updated successfully!"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Promo code not exist !"
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

/* const findAvailableSeat = async (req, res) => {
    let totalSeats;
    const { hosting_id } = req.body;
 
    // Function to get the total number of seats
    async function getTotalSeats() {
        return new Promise((resolve, reject) => {
            con.query(`SELECT no_of_guests FROM tbl_hosting WHERE id='${hosting_id}'`, (err, seat) => {
                if (err) {
                    reject(err);
                }
                if (seat.length > 0) {
                    totalSeats = seat[0].no_of_guests;
                    resolve();
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Details not found!"
                    });
                }
            });
        });
    }
 
    // Function to get booked dates and the number of booked seats
    async function getBookedDates() {
        return new Promise((resolve, reject) => {
            const sqlQuery = `SELECT booking_date, SUM(adult + child + pets) AS booked_seats FROM tbl_booking where hosting_id='${hosting_id}' GROUP BY booking_date`;
            con.query(sqlQuery, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const bookedDates = results.map(row => ({
                        date: row.booking_date,
                        bookedSeats: row.booked_seats,
                    }));
                    resolve(bookedDates);
                }
            });
        });
    }
 
    // Function to get the selected days from time_slots table and convert them to day numbers
    async function getSelectedDays() {
        return new Promise((resolve, reject) => {
            const sqlQuery = `SELECT DISTINCT day FROM time_slots WHERE hosting_id='${hosting_id}'`;
            con.query(sqlQuery, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const selectedDays = results.map(row => row.day);
                    const dayNumbers = selectedDays.map(day => {
                        const normalizedDay = day.toLowerCase();
                        const daysMap = {
                            monday: 1,
                            tuesday: 2,
                            wednesday: 3,
                            thursday: 4,
                            friday: 5,
                            saturday: 6,
                            sunday: 7,
                        };
                        return daysMap[normalizedDay];
                    });
                    resolve(dayNumbers);
                }
            });
        });
    }
 
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    try {
        await getTotalSeats();
        const currentDate = new Date();
        const targetYear = currentDate.getFullYear();
 
        // Get booked dates, calculate available seats for the selected days
        const bookedDates = await getBookedDates();
        const selectedDays = await getSelectedDays();
 
        const availableSeatsByYear = [];
 
        for (let year = targetYear; year <= targetYear + 1; year++) {
            const availableSeatsByMonth = [];
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month, 1);
                const monthName = monthNames[month]; // Get the month name
                const monthData = {};
 
                while (date.getMonth() === month) {
                    const day = date.getDay(); // Get the day number (0 for Sunday, 1 for Monday, etc.)
 
                    if (selectedDays.includes(day)) {
                        const formattedDate = date.toISOString().split('T')[0];
                        const bookedSeatsOnDate = bookedDates.find(item => item.date.toISOString().split('T')[0] === formattedDate);
                        const dayOfMonth = date.getDate();
                        const bookedSeats = bookedSeatsOnDate ? bookedSeatsOnDate.bookedSeats : 0;
                        const availableSeats = totalSeats - bookedSeats;
 
                        monthData[dayOfMonth] = availableSeats;
                    }
 
                    date.setDate(date.getDate() + 1);
                }
                availableSeatsByMonth.push({ [monthName]: monthData });
            }
            availableSeatsByYear.push({ year: availableSeatsByMonth });
        }
 
        // Respond with the available seats data, years, and months in each year array
        res.status(200).json({
            success: true,
            availableSeatsByYear
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}; */

const findAvailableSeat = async (req, res) => {
    let totalSeats;
    const { hosting_id, booking_date } = req.body; // Get hosting_id and booking_date from req.body

    // Function to get the total number of seats
    async function getTotalSeats() {
        return new Promise((resolve, reject) => {
            con.query(`SELECT no_of_guests FROM tbl_hosting WHERE id='${hosting_id}'`, (err, seat) => {
                if (err) {
                    reject(err);
                }
                if (seat.length > 0) {
                    totalSeats = seat[0].no_of_guests;
                    resolve();
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Details not found!"
                    });
                }
            });
        });
    }

    // Function to get the number of booked seats for the specified date
    async function getBookedSeatsForDate() {
        return new Promise((resolve, reject) => {
            con.query(`SELECT SUM(adult + child + pets) AS booked_seats FROM tbl_booking WHERE hosting_id='${hosting_id}' AND booking_date='${booking_date}' AND status<>'${3}'`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const bookedSeats = result[0].booked_seats || 0;
                    resolve(bookedSeats);
                }
            });
        });
    }

    try {
        await getTotalSeats();
        const bookedSeats = await getBookedSeatsForDate();
        var availableSeats = totalSeats - bookedSeats;

        // Respond with the available seats for the specified date
        if (availableSeats <= 0) {
            availableSeats = 0;
            res.status(200).json({
                success: true,
                availableSeats
            });
        }
        else {
            res.status(200).json({
                success: true,
                availableSeats
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteOneNotification = async (req, res) => {
    try {
        const { notification_id } = req.body;
        var sql = "select is_deleted from tbl_notifications where id=?";
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
                    var sql = "update tbl_notifications set is_deleted=? where id=?";
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

const DeleteAllNotification = async (req, res) => {
    try {
        const { user_id } = req.body;
        var sql = "update tbl_notifications set is_deleted=? where user_id=?";
        await con.query(sql, [1, user_id], (err, data) => {
            if (err) throw err;
            // console.log(data);
            if (data.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    message: "Notifications cleared successfully!"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Failed to  clear Notifications"
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

const Userfeedback = async (req, res) => {
    try {
        const { user_id, rating, feedbackType, feedback } = req.body;

        if (!user_id || !rating || !feedbackType || !feedback) {
            return res.status(400).json({
                success: false,
                error: 'user_id, rating, feedback type, and feedback are required'
            });
        }

        const query = 'INSERT INTO tbl_feedback (user_id, rating, feedback_type, feedback) VALUES (?, ?, ?, ?)';
        const values = [user_id, rating, feedbackType.toLowerCase(), feedback];

        await con.query(query, values, (err, results) => {
            if (err) throw err;
            if (results.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Feedback submitted successfully'
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to submit Feedback'
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

const GetFeedBack = async (req, res) => {
    try {
        const selectQuery = `select tbl_feedback.*, CONCAT(tbl_visitors.first_name,' ',tbl_visitors.last_name) as user_name from tbl_feedback
        INNER JOIN tbl_visitors on tbl_visitors.id=tbl_feedback.user_id
        WHERE tbl_feedback.is_deleted='${0}'
        ORDER BY created_at DESC`;
        await con.query(selectQuery, (err, data) => {
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
                    message: "No Notification found"
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

const deleteFeedBack = async (req, res) => {
    try {
        const { feedback_id } = req.params;
        const selectQuery = `select is_deleted from tbl_feedback where id=?`;
        await con.query(selectQuery, [feedback_id], (err, feedback) => {
            if (err) throw err;
            if (feedback.length > 0) {
                if (feedback[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "Feedback is already deleted"
                    })
                }
                else {
                    const updateQuery = `update tbl_feedback set is_deleted=? where id=?`;
                    con.query(updateQuery, [1, feedback_id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Feedback deleted sucessfully"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Failed to delete feedback"
                            })
                        }
                    })
                }
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

const AddDishType = async (req, res) => {
    try {
        const { dish_type } = req.body;
        if (!dish_type) {
            res.status(400).send({
                success: false,
                message: "Please enter dish type"
            })
        }
        else {
            var selectQuery = `select * from dish_types where is_deleted='${0}'`;
            await con.query(selectQuery, (err, data) => {
                if (err) throw err;
                if (data.length < 1) {
                    var sql = `insert into dish_types (type) values ('${dish_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Dish type added successfully !"
                        })
                    })
                }
                else {
                    let checking = false;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].type === dish_type) {
                            checking = true;
                            break;
                        }
                    }
                    if (checking == false) {
                        var sql = `insert into dish_types (type) values ('${dish_type}')`;
                        con.query(sql, (err, data) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                message: "Dish type added successfully !"
                            })
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Dish type is already exist !"
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


const GetDishType = async (req, res) => {
    try {
        var selectQuery = `select * from dish_types where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const updateDishType = async (req, res) => {
    const { id, dish_type } = req.body;
    if (!id || !dish_type) {
        res.status(400).send({
            success: false,
            message: "Provide id or dish_type"
        })
    }
    else {
        try {
            let sql = "Select * from dish_types where LOWER(type)=LOWER(?) AND id <> ? AND is_deleted=?";
            await con.query(sql, [dish_type, id, 0], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Dish type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update dish_types set type=? where id=?";
                    con.query(updateQuery, [dish_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const deleteDishType = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from dish_types where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Dish type is already deleted !"
                    })
                }
                else {
                    var sql = "update dish_types set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Dish type deleted successfully!"
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

const GetAllCountry = async (req, res) => {
    try {
        const sqlQuery = `select id, name from countries`;
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

const GetAllState = async (req, res) => {
    try {
        const country_id = req.params.country_id;
        // console.log(country_id);
        const sqlQuery = `SELECT id, name FROM states WHERE country_id = ?`;

        await con.query(sqlQuery, [country_id], (err, data) => {
            if (err) throw err;

            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
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

const GetAllCity = async (req, res) => {
    try {
        const state_id = req.params.state_id;
        // console.log(country_id);
        const sqlQuery = `SELECT id, name FROM cities WHERE state_id = ?`;

        await con.query(sqlQuery, [state_id], (err, data) => {
            if (err) throw err;

            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Data not found"
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const AddArea = async (req, res) => {
    try {
        const { area, country_id, state_id, city_id } = req.body;
        if (!country_id) {
            return res.status(400).send({
                success: false,
                message: "Please select country"
            });
        }
        if (!state_id) {
            return res.status(400).send({
                success: false,
                message: "Please state country"
            });
        }
        if (!city_id) {
            return res.status(400).send({
                success: false,
                message: "Please city country"
            });
        }
        if (!area) {
            return res.status(400).send({
                success: false,
                message: "Please area country"
            });
        }
        const InsertQuery = `insert into tbl_area ( area, country_id, state_id, city_id ) values (?,?,?,?)`;
        await con.query(InsertQuery, [area, country_id, state_id, city_id], (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                return res.status(200).send({
                    success: true,
                    message: "Area aaded successfully"
                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    message: "Failed to aad area"
                });
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

const AreaList = async (req, res) => {
    try {
        const selectQuery = `select tbl_area.*, c.name as country, s.name as state, ci.name as city from tbl_area
        INNER JOIN countries as c on c.id=tbl_area.country_id
        INNER JOIN states as s on s.id=tbl_area.state_id
        INNER JOIN cities as ci on ci.id=tbl_area.city_id
        where tbl_area.is_deleted=?`;
        await con.query(selectQuery, [0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    message: "",
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "No list available"
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

const Delete_Area = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from tbl_area where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Area is already deleted !"
                    })
                }
                else {
                    var sql = "update tbl_area set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Area deleted successfully!"
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

const changeAreaStatus = async (req, res) => {
    const { area_id } = req.body;
    try {
        let sql = "select is_active from tbl_area where id=?";
        await con.query(sql, [area_id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                let is_active;
                if (data[0].is_active == 1) {
                    is_active = 0;
                }
                else {
                    is_active = 1;
                }
                let updateQuery = "update tbl_area set is_active=? where id=?";
                con.query(updateQuery, [is_active, area_id], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows < 1) {
                        res.status(400).send({
                            success: false,
                            msg: "Status has not been updated successfully!"
                        })
                    }
                    else {
                        res.status(200).send({
                            success: true,
                            msg: "Status has been updated successfully!"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Promo code not exist !"
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


module.exports = {
    activityList, allergensList, areaList, cuisineList, placeList, GetActivity, GetAllergens,
    GetArea, GetCuisine, GetPlace, UpdateActivity, UpdateAllergens, UpdateArea, UpdateCuisine, Updateplace,
    DeleteActivity, DeleteAllergens, DeleteArea, DeleteCuisine, Deleteplace, termsConditions, GetTerms,
    PrivacyPolicy, GetPrivacy, CancelationPolicy, getCancelPolicy, bookingRequire, GetBookRequire, countAll,
    friendRequest, acceptRequest, sendMessage, getMessagesList, UpdateChatOnBack, UpdateChatOnEnter, countryList, GetCountry, UpdateCountry, DeleteCountry,
    filterHosting, searchHosting, LandingPgDetails, getPgDetails, EmirateList, GetEmirateList, UpdateEmirate, deleteEmirate,
    CityList, GetCity, UpdateCity, deleteCity, getDetailsLand, DeleteLandImages, interestsAdd, GetInterest,
    deleteInterest, updateInterest, addPromoCode, ApplyPromoCode, findAvailableSeat, GetPromoList, EditPromoCode,
    DeletePromoCode, changePromoStatus, getAllMessages, deleteOneNotification, DeleteAllNotification, Userfeedback,
    GetFeedBack, deleteFeedBack, AddDishType, GetDishType, updateDishType, deleteDishType, GetAllCountry,
    GetAllState, GetAllCity, AddArea, AreaList, Delete_Area, changeAreaStatus
}
