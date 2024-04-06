const express= require('express')
const app = express();
app.use(express.json())
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport= require('passport')
const User = require('./models/User')
const cors = require("cors")

const authRoutes = require('./routes/auth')
const songRoutes = require('./routes/song')
const playlistRoutes = require('./routes/playlist')
require("dotenv").config();
app.use(cors())

const PORT = process.env.PORT || 4000



const connectWithDb = require('./config/database');
connectWithDb();



// JWT 
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findOne({ _id: jwt_payload.identifier });
        if (user) {  
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));


app.get('/',(req,res)=>{
    console.log('hello')
    res.send('Hello World')
})

app.listen(PORT,()=>{
    console.log(`Server started successfully at PORT ${PORT}`)
})


app.use("/auth",authRoutes);
app.use("/song",songRoutes);
app.use("/playlist",playlistRoutes)