const express = require('express');
const visitor_route = express();
const visitorController = require('../controllers/visitorController.js');
const { userRegValidation, userLoginValidation, changePasswordValidations, visitorProfileValidation,
    bookingValidation, forgotPasswordValidation, uresetPasswordValidation } = require('../helpers/validation');
const { authMiddleWare } = require('../helpers/authJwt');

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "identify_document") {
            cb(null, path.join(__dirname, '../public/identification'));
        }
        if (file.fieldname === "profile" || file.fieldname === "picture" || file.fieldname === "photo") {
            cb(null, path.join(__dirname, '../public/images'));
        }
        if (file.fieldname === "trade_license") {
            cb(null, path.join(__dirname, '../public/documents'));
        }
    },
    filename: function (err, file, cb) {
        cb(null, Date.now() + '-' + file.originalname, (err, success) => {
            if (err) {
                console.log(err);
            }
        });
    }
})

/* const fileFilter = (req,file,cb) => {
    if (file.fieldname === "identify_document") {
        ( file.mimetype === 'application/pdf')
        ? cb(null,true)
        : cb(null,false);
    }
} */

var upload = multer({
    storage: storage,
    // fileFilter:fileFilter
}).fields([{ name: 'identify_document' }, { name: 'profile' }, { name: 'picture' }, { name: 'photo' }, { name: 'trade_license' }]);


visitor_route.post('/customer/register', upload, userRegValidation, visitorController.Register);
visitor_route.post('/login', userLoginValidation, visitorController.Login);
visitor_route.post('/accessToken', visitorController.newAccessToken);
visitor_route.delete('/logout', visitorController.logout);

visitor_route.post('/changepassword', authMiddleWare, changePasswordValidations, visitorController.ChangePassword);
visitor_route.post('/update/profile', authMiddleWare, upload, visitorProfileValidation, visitorController.EditProfile);
visitor_route.post('/profile', visitorController.GetProfile);

visitor_route.post('/googlelogin', upload, visitorController.GoogleLogin);
visitor_route.post('/facebooklogin', upload, visitorController.FacebookLogin);
visitor_route.post('/applelogin', upload, visitorController.AppleLogin);

visitor_route.post('/visittohost', authMiddleWare, visitorController.visittohost);

visitor_route.post('/hosting/details', authMiddleWare, visitorController.HostingDetails);

visitor_route.post('/booking', authMiddleWare, upload, bookingValidation, visitorController.Seatbooking);
visitor_route.post('/previousbooking', authMiddleWare, visitorController.PreviousBooking);
visitor_route.post('/upcomingbooking', authMiddleWare, visitorController.upcomingBooking);
visitor_route.post('/cancelbooking', authMiddleWare, visitorController.cancelBooking);

visitor_route.post('/fav/hosting', authMiddleWare, visitorController.favHosting);

visitor_route.post('/nearby/hosts', authMiddleWare, visitorController.NearbyHosts);

visitor_route.post('/change/booking', visitorController.changeBookingDate);

visitor_route.post('/hosting/rating', authMiddleWare, visitorController.giveHostRating);

visitor_route.post('/get/rating', visitorController.getHostingRating);

visitor_route.post('/forgot/password', forgotPasswordValidation, visitorController.forgotPassword);
visitor_route.post('/verify/otp', visitorController.verifyOtp);
visitor_route.post('/reset/password', uresetPasswordValidation, visitorController.UserResetPassword);

visitor_route.post('/transaction/history', authMiddleWare, visitorController.TransactionHistory);

visitor_route.post('/deactivate-profile', visitorController.DeactivateProfile);

visitor_route.post('/document-details', visitorController.GetOfficialDocument);

visitor_route.post('/confirm-payment', visitorController.payment);
visitor_route.post('/upload-document', upload, visitorController.uploadDocumnet);

visitor_route.post('/wallet-payment', visitorController.walletPayment);
visitor_route.post('/get-wallet-amount', visitorController.getWalletAmount);
visitor_route.post('/seat-booking-wallet', visitorController.seatBookingWithWallet);
visitor_route.post('/wallet-history', visitorController.walletHistory);

visitor_route.post('/seat-booking-googlepay', visitorController.seatBookingWithGooglePay);

module.exports = visitor_route;