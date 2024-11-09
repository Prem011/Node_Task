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

// db
const db = require('./config/db.js');


dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false
    })
);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts')
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/', adminRoutes);
app.use('/task', taskRoutes);
app.use('/user', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
