const express = require('express');
const common_route = express();
const commonController = require('../controllers/commonController');
const { authMiddleWare } = require('../helpers/authJwt');

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

common_route.post('/activity', commonController.activityList);
common_route.post('/allergens', commonController.allergensList);
common_route.post('/arealist', commonController.areaList);
common_route.post('/cuisinelist', commonController.cuisineList);
common_route.post('/placelist', commonController.placeList);

common_route.get('/activity', commonController.GetActivity);
common_route.get('/allergens', commonController.GetAllergens);
common_route.get('/arealist', commonController.GetArea);
common_route.get('/cuisinelist', commonController.GetCuisine);
common_route.get('/placelist', commonController.GetPlace);

common_route.put('/activity', commonController.UpdateActivity);
common_route.put('/allergens', commonController.UpdateAllergens);
common_route.put('/arealist', commonController.UpdateArea);
common_route.put('/cuisinelist', commonController.UpdateCuisine);
common_route.put('/placelist', commonController.Updateplace);

common_route.delete('/activity/:id', commonController.DeleteActivity);
common_route.delete('/allergens/:id', commonController.DeleteAllergens);
common_route.delete('/arealist/:id', commonController.DeleteArea);
common_route.delete('/cuisinelist/:id', commonController.DeleteCuisine);
common_route.delete('/placelist/:id', commonController.Deleteplace);

common_route.post('/termsconditions', commonController.termsConditions);
common_route.get('/termsconditions', commonController.GetTerms);

common_route.post('/privacypolicy', commonController.PrivacyPolicy);
common_route.get('/privacypolicy', commonController.GetPrivacy);

common_route.post('/cancel/policy', commonController.CancelationPolicy);
common_route.get('/cancel/policy', commonController.getCancelPolicy);

common_route.post('/booking/require', commonController.bookingRequire);
common_route.get('/booking/require', commonController.GetBookRequire);

common_route.post('/count/all', commonController.countAll);

common_route.post('/send-friend-request', authMiddleWare, commonController.friendRequest);
common_route.post('/accept-friend-request', commonController.acceptRequest);

common_route.post('/send-message', authMiddleWare, commonController.sendMessage );
common_route.post('/get-messages-list', authMiddleWare, commonController.getMessagesList)
common_route.post('/status/chat-back', authMiddleWare, commonController.UpdateChatOnBack );
common_route.post('/status/chat-on-enter', authMiddleWare, commonController.UpdateChatOnEnter);
common_route.post('/get/all-messages', authMiddleWare, commonController.getAllMessages);

common_route.post('/country/list', commonController.countryList);
common_route.get('/country/list', commonController.GetCountry);
common_route.put('/country/list', commonController.UpdateCountry);
common_route.delete('/country/list/:id', commonController.DeleteCountry);

common_route.post('/filter', commonController.filterHosting);
common_route.get('/search', commonController.searchHosting);

common_route.post('/landing/page', upload.array('images[]'), commonController.LandingPgDetails);
common_route.get('/landing/page', commonController.getPgDetails);
common_route.get('/get/landing', commonController.getDetailsLand);
common_route.delete('/delete/images/:id', commonController.DeleteLandImages);

common_route.post('/emirate', commonController.EmirateList);
common_route.get('/emirate', commonController.GetEmirateList);
common_route.put('/emirate', commonController.UpdateEmirate);
common_route.delete('/emirate/:id', commonController.deleteEmirate);

common_route.post('/city', commonController.CityList);
common_route.get('/city', commonController.GetCity);
common_route.put('/city', commonController.UpdateCity);
common_route.delete('/city/:id', commonController.deleteCity);

common_route.post('/interests', commonController.interestsAdd);
common_route.get('/interests', commonController.GetInterest);
common_route.put('/interests', commonController.updateInterest);
common_route.delete('/interests/:id', commonController.deleteInterest);

common_route.post('/promocode', commonController.addPromoCode);
common_route.post('/apply-promo-code', commonController.ApplyPromoCode);
common_route.get('/promocode', commonController.GetPromoList);
common_route.put('/promocode', commonController.EditPromoCode);
common_route.delete('/promocode/:id', commonController.DeletePromoCode);
common_route.post('/promo-code/status', commonController.changePromoStatus);

common_route.post('/find-available-seats', commonController.findAvailableSeat);

common_route.post('/clear-one-notification', commonController.deleteOneNotification);
common_route.post('/clear-all-notification', commonController.DeleteAllNotification);

common_route.post('/user-feedback', commonController.Userfeedback);
common_route.post('/get-feedback', commonController.GetFeedBack);
common_route.delete('/delete-feedback/:feedback_id', commonController.deleteFeedBack);

//AddDishType, GetDishType, updateDishType, deleteDishType

common_route.post('/dish/type', commonController.AddDishType);
common_route.get('/dish/type', commonController.GetDishType);
common_route.put('/dish/type', commonController.updateDishType);
common_route.delete('/dish/type/:id', commonController.deleteDishType);


common_route.post('/get-all-country', commonController.GetAllCountry);
common_route.post('/get-all-state/:country_id', commonController.GetAllState);
common_route.post('/get-all-city/:state_id', commonController.GetAllCity);
common_route.post('/add-area', commonController.AddArea);
common_route.post('/area-list', commonController.AreaList);
common_route.post('/delete-area/:id', commonController.Delete_Area);
common_route.post('/area-status', commonController.changeAreaStatus);

module.exports = common_route;