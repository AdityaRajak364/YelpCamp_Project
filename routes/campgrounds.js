const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campground')
const flash = require('connect-flash');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage })


//1.CAMPGROUND INDEX
router.get('/', catchAsync(campgrounds.index));
// 3.CREATING NEW CAMPGROUND ROUTE
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// 2.SHOW ROUTE
router.get('/:id', catchAsync(campgrounds.showCampground));
// 4.EDIT AND UPDATE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));
// 5.DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
module.exports = router;