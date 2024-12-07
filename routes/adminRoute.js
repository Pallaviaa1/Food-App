const express = require('express');
const admin_route = express();
const adminController = require('../controllers/adminController');
const { forgotPasswordValidation, resetPasswordValidation, changePasswordValidations, updateProfileValidation } = require('../helpers/validation');
const { authMiddleWare } = require('../helpers/authJwt');

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (err, file, cb) {
        cb(null, path.join(__dirname, '../public/images'), (err, success) => {
            if (err) {
                console.log(err)
            }
        });
    },
    filename: function (err, file, cb) {
        cb(null, Date.now() + '-' + file.originalname, (err, success) => {
            if (err) {
                console.log(err);
            }
        });
    }
})

var upload = multer({ storage: storage })

admin_route.post('/admin/login', adminController.Login);
admin_route.post('/forgotPassword', forgotPasswordValidation, adminController.forgotPassword);
admin_route.post('/verify-otp', adminController.VerifyOtp);
admin_route.post('/reset-password', resetPasswordValidation, adminController.ResetPassword);
admin_route.post('/admin/changePassword', adminController.AdminChangePassword);
admin_route.post('/admin/profile', adminController.GetProfile);
admin_route.post('/update/admin', upload.single('profile'), updateProfileValidation, adminController.UpdateProfile);

admin_route.get('/visitorlist', adminController.VisitorList);
admin_route.delete('/visitor/:visitorid', adminController.DeleteVisitor);
admin_route.post('/status', adminController.ChangeStatus);

admin_route.get('/hostlist', adminController.HostList);
admin_route.get('/bookinglist', adminController.bookingList);
admin_route.post('/booking/cancel', adminController.CancelBooking);
admin_route.post('/booking/approve', adminController.ApproveBooking);
admin_route.post('/booking/delete', adminController.deleteBooking);

admin_route.post('/user/rating', adminController.Ratings);
admin_route.post('/visitor/ratings', adminController.GetVisitorReview);
admin_route.post('/host/ratings', adminController.GetHostReview);
admin_route.post('/delete/rating', adminController.DeleteRating);

admin_route.post('/payment', adminController.paymentDetails);

admin_route.post('/customer/bookings', adminController.CustomerBookings);

admin_route.post('/invoice/details', adminController.invoiceDetails);

admin_route.post('/sendnotification-all-users', adminController.sendNotification);
admin_route.post('/get-notification', authMiddleWare, adminController.GetNotification);
admin_route.post('/get-notification-list', adminController.GetAdminNotificationList);
admin_route.delete('/delete-notification/:notification_id', adminController.deleteNotification);
admin_route.get('/user-list', adminController.userNameList);
admin_route.post('/update-notification', adminController.updateNotificationSeen);

admin_route.post('/get-country', adminController.GetCountry);
admin_route.post('/get-state', adminController.GetState);
admin_route.post('/get-city', adminController.GetCity);
admin_route.post('/get-area', adminController.GetArea);

admin_route.post('/verify-profile', adminController.AcceptHostProfile);
admin_route.post('/reject-profile', adminController.RejectHostProfile);

admin_route.post('/learn-about-being-host', upload.single('video'), adminController.LearnAboutBeingHost);
admin_route.get('/get-learn-being-host', adminController.GetVideoLearnAboutBeingHost);
admin_route.post('/GetHostingsbyhostId', adminController.GetHostingsbyhostId);

admin_route.post('/hostingApproved', adminController.hostingApproved);

module.exports = admin_route;
