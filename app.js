var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , app               =     express();

var firebase = require('firebase');
firebase.initializeApp({
  serviceAccount: './service.json',
  databaseURL: 'https://eduse-67584.firebaseio.com'
})
var ref = firebase.database().ref('node-client');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'Katakaka', key: 'sid',    resave: true,
   saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));



app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/login', function(req, res){
   res.sendFile(__dirname +'/views/login.html');
});

app.get('/welcome', function(req, res){
   res.sendFile(__dirname +'/views/welcome.html');
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.listen(3000);
