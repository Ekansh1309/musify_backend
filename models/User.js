const mongoose= require('mongoose')

const User = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        private:true,
    },
    email:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    likedSongs:{
        type:Array,
        default:[],
    },
    likedPlaylist:{
        type:Array,
        default:[]
    },
    subscribedArtists:{
        type:Array,
        default:[]
    }
})

const UserModel = mongoose.model("User",User)

module.exports = UserModel

