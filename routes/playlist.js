const express = require('express');
const router = express.Router()
const passport = require('passport')
const Playlist = require('../models/Playlist')
const User = require('../models/User')
const Song = require('../models/Song')

router.post('/create',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const currentUser= req.user;
    const {name,thumbnail,songs} = req.body;
    if(!name || !thumbnail || !songs){
        res.status(301).json({
            error:"Insufficient data in creating playlist"
        })
    }
    const playlistData = {
        name,thumbnail,songs,
        owner:currentUser._id,
        collaborators:[]
    } 
    const playlist = await Playlist.create(playlistData)
    return res.status(200).json(playlist)
})

router.get("/get/playlist/:playlistId",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const playlistId = req.params.playlistId
    const playlist = await Playlist.findOne({_id:playlistId}).populate("songs");
    if(!playlist){
        return res.status(301).json({
            error:"Invalid Playlist Id"
        })
    }
    return res.status(200).json(playlist)
})

router.get("/get/me",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const artistId = req.user._id
    if(!artistId){
        return res.status(304).json({
            status:304,
            error:"Invalid Artist Id"
        })
    }
    const playlists = await Playlist.find({owner:artistId}).populate("owner");
    return res.status(200).json({data:playlists})
})

router.get("/get/artist/:artistId",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const artistId = req.params.artistId
    const artist = await User.findOne({_id:artistId})
    if(!artist){
        return res.status(304).json({
            error:"Invalid Artist Id"
        })
    }
    const playlists = await Playlist.find({owner:artistId});
    return res.status(200).json(playlists)
})

router.post("/add/song",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const currentUser=req.user;
    const {playlistId,songId} = req.body;
    const playlist = await Playlist.findOne({_id:playlistId})


    if(!playlist){
        return res.status(304).json({
            status:304,
            error:"Playlist not exist"
        })
    }

    const alreadyExist = playlist.songs.some(song => song.equals(songId))
    
    if(alreadyExist){
        return res.status(401).json({
            status:401,
            error:"Song already exist"
        })
    }

    // they both are ids, we cant compare like them
    // console.log(playlist.owner)
    // console.log(currentUser._id)
    // we use equals to compare ids
    
    if(!playlist.owner.equals( currentUser._id) && !playlist.collaborators.includes(currentUser._id)){
        return res.status(400).json({
            error:"Not allowed"
        })
    }

    const song = await Song.findOne({_id:songId})

    if(!song){
        return res.status(400).json({
            error:"Song does not exist"
        })
    }

    playlist.songs.push(songId);
    await playlist.save()

    return res.status(200).json(playlist)
})




module.exports = router;
