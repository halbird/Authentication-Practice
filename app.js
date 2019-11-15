var express = require("express"),
    app = express();
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/auth-demo", {useNewUrlParser: true}); //connected to and created demo app DB

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({            
    secret: "Obi is super cute and sweet",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");

passport.serializeUser(User.serializeUser());   
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// ROUTES
app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

// AUTH ROUTES
    // show signup form
app.get("/register", function(req, res){
    res.render("register");
});

    // register logic
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

// LOGIN ROUTES
    // show login form
app.get("/login", function(req, res){
    res.render("login");
});

    // login logic
app.post("/login", passport.authenticate("local", {     
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});

// LOGOUT ROUTES
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


app.listen(3000, function(){
    console.log("server fired up and ready");
});
