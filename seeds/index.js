const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const axios = require('axios');
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: '70PFuImbaY-3XYOrpGz5487vrhsOqoTP-YRP_K6ON-s',
                collections: 1114848,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}


const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const ranPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '667fa8b6e154692cfdd0e306',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum labore dolor quod nesciunt, placeat non recusandae totam delectus, asperiores voluptatum in cupiditate consectetur impedit excepturi itaque laboriosam assumenda quidem. Debitis.',
            price: ranPrice,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ],
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dojrzgfle/image/upload/v1719774221/YelpCamp/dtrmdovivqnjhh9harei.webp',
                    filename: 'YelpCamp/dtrmdovivqnjhh9harei',

                },
                {
                    url: 'https://res.cloudinary.com/dojrzgfle/image/upload/v1719774447/YelpCamp/gvc6nkdhybkaoyg2kcgh.jpg',
                    filename: 'YelpCamp/gvc6nkdhybkaoyg2kcgh',

                }
            ]
        })
        await camp.save();

    }
}
seedDB()
    .then(() => {
        mongoose.connection.close();
    })




