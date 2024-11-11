const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
var logger = require('morgan');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const flash = require('connect-flash');

const db = require('./config/db.js');

dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Register helpers within the exphbs configuration
const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
        join: function (array, separator) {
            return array.join(separator);
        },
        eq: function (a, b) {
            console.log("Comparing:", a, b); // Logs the values being compared
            return String(a) === String(b);  // Ensures both are strings
        },
        // Define the ifEquals helper
        ifEquals: function (a, b, options) {
            if (a === b) {
                return options.fn(this);  // Run the block of code inside {{#ifEquals}} ... {{/ifEquals}}
            }
            return options.inverse(this);  // Run the block of code inside {{else}} if not equal
        }
    }
});

// Set Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Define routes
app.use('/', adminRoutes);
app.use('/task', taskRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
