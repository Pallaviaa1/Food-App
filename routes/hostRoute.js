const express = require('express');

const host_route = express();
const hostController = require('../controllers/hostController');
const { hostRegValidation } = require('../helpers/validation');
const { authMiddleWare } = require('../helpers/authJwt');

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "tradelicense" || file.fieldname === "address_document") {
            cb(null, path.join(__dirname, '../public/documents'));
        }
        if (file.fieldname === "profile" || file.fieldname === "area_video" || file.fieldname ==="area_image" || file.fieldname ==="dish_picture") {
            cb(null, path.join(__dirname, '../public/images'));
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
}).fields([{ name: 'tradelicense' }, { name: 'profile' }, { name: 'address_document'}, { name: 'area_video'}, { name: 'area_image'}, { name: 'dish_picture'}]);

host_route.post('/host/register',upload,   hostRegValidation, hostController.HostRegister);
host_route.put('/addhosting', authMiddleWare, upload, hostController.addHosting);
host_route.get('/hostingdetails', authMiddleWare, hostController.GetHostings);

host_route.post('/upbookings', authMiddleWare, hostController.UpBookings);
host_route.post('/prebookings', authMiddleWare, hostController.PreBookings);
host_route.post('/accept', hostController.AcceptBooking);
host_route.post('/reject', hostController.RejectBooking);

host_route.post('/rating', authMiddleWare, hostController.Ratings);
host_route.get('/rating', authMiddleWare, hostController.getRating);
host_route.post('/myratings', authMiddleWare, hostController.MyRatings);

/// new

host_route.post('/add/hosting', authMiddleWare, upload, hostController.add_Hosting );

host_route.post('/add/cuisine', hostController.addCuisine);
host_route.post('/get/cuisine', hostController.getCuisine);

host_route.post('/get/hosting', authMiddleWare, hostController.HostingById);
host_route.delete('/delete/hosting', hostController.deleteHosting);

host_route.post('/explore/hosting', authMiddleWare, hostController.exploreList);
host_route.post('/explore/details', hostController.expHostingById);

host_route.post('/ratings/reviews', hostController.RatingsReviews);

//// new

host_route.post('/hostings-details', authMiddleWare, hostController.GetHostingsDetails);
host_route.post('/time-slot', hostController.getTimeSlot);

host_route.post('/change-menus', authMiddleWare, hostController.changeMenus);

host_route.post('/send-apology', hostController.SendApologyToVisitor);
host_route.post('/upload-hosting-image', upload, hostController.uploadHostingImage);
host_route.delete('/delete-images', hostController.DeleteHostingImages);

module.exports = host_route;