const { check } = require('express-validator');

exports.userRegValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    check('password', 'Please enter your password').not().isEmpty()
]
exports.userLoginValidation = [
    check('email', 'please enter email').not().isEmpty(),
    check('password', 'please enter password').not().isEmpty(),
]

exports.hostRegValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    check('password', 'Please enter your password').not().isEmpty(),
    check('phoneNo', 'please enter a valid Phone Number').not().isEmpty(),
]

exports.forgotPasswordValidation = [
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false })
]

exports.resetPasswordValidation = [
    check('newPassword', 'Please enter your new password').not().isEmpty(),
]

exports.uresetPasswordValidation = [
    check('newpassword', 'Please enter your new password').not().isEmpty(),
]

exports.changePasswordValidations = [
    check('oldpassword', 'Please enter your old password').not().isEmpty(),
    check('newpassword', 'Please enter your new password').not().isEmpty()
]

exports.visitorProfileValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false })
]

exports.updateProfileValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false })
]

exports.UserAddvalidation = [
    check('name', 'please provide name').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false })
]

exports.bookingValidation = [
    check('host_id', 'please provide host_id').not().isEmpty(),
    check('hosting_id', 'please provide hosting_id').not().isEmpty(),
    check('booking_date', 'please provide booking_date').not().isEmpty()
]

/* check('identify_document').custom((value, { req }) => {
    if (req.files.identify_document[0].mimetype === 'application/pdf') {
        return true;
    }
    else {
        return false;
    }
}).withMessage('Please upload documnet only pdf format') */

// line-of-code 10525