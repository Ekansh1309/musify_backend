const express = require('express');
const router = express.Router();
const passport = require('passport')
const Song = require('../models/Song')
const User = require('../models/User')

// idhar user ho skta hai
router.post('/create', passport.authenticate("jwt",{session:false}) ,async(req,res)=>{
    const {name,thumbnail,track,duration} = req.body;
    if(!name || !thumbnail || !track){
        return res.status(301).json({
            status:301,
            error:"Insufficient details to create song"
        })
    }
    const artist = req.user._id;
    const songDetails = {name,thumbnail,track,artist,duration};
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong)
})

// session means tumne ek baar login kr diya, toh tumhara backend tumhare login ko store krke rakhega
// so basically session humko loggedin rakhne ke liye use hota hai

router.get('/get/mysongs',passport.authenticate('jwt', {session:false}), async(req,res)=>{
    const currentUser = req.user;

    const songs = await Song.find({artist:currentUser._id}).populate("artist")
    return res.status(200).json({
        data:songs
    })
})


router.get('/get/artist/:artistId',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const {artistId} = req.params;
    const artist = await User.findOne({_id:artistId});
    // find returns array
    console.log(artist)
    if(!artist){
        return res.status(301).json({
            error:"Artist does not exist"
        })
    }
    const songs = await Song.find({artist:artistId});
    return res.status(200).json({
        data:songs
    })
})

router.get(
    "/get/songname/:songName",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const {songName} = req.params;
        const songs = await Song.find({name: songName}).populate("artist");
        return res.status(200).json({data: songs});
    }
);



module.exports = router
