const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
//const { engine }=require('express-handlebars');
const session=require('express-session');

var mysql2 = require('mysql2/promise');
var MySQLStore = require('express-mysql-session')(session);

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
/* const authRoutes=require('./routes/auth'); */
const errorController=require('./controllers/error');
const mongoConnect=require('./util/database').mongoConnect;
const User=require('./models/user');

const app=express();

/* var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'node-complete'
};

var connection = mysql2.createPool(options);
var sessionStore = new MySQLStore({}, connection); */

/* app.engine('hbs',engine({
  extname: 'hbs',
  defaultLayout: 'main-layout',
  layoutsDir: 'views/layouts/'
})); */
/* db.execute("SELECT * FROM products")
.then((result)=>{
  console.log(result[0],result[1]);
}).catch((error)=>{
  console.log(error);
}); */

app.set('view engine','ejs');
//app.set('view engine','hbs');
//app.set('view engine','pug');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
/* app.use(session({
         secret:'my secret',
         resave:false,
         store:sessionStore,
         saveUninitialized:true
        })); */

app.use((req,res,next)=>{
  User.findById('62b1eaf10bc946e533e1f9a2')
  .then(user=>{
    req.user=new User(user.name,user.email,user.cart,user._id);
    next();
  })
  .catch(error=>{
    console.log(error);
  });
});
app.use('/admin',adminRoutes);
app.use(shopRoutes);
/* app.use(authRoutes); */



app.use(errorController.get404Page);
mongoConnect(()=>{
  //console.log(client);
  app.listen(3000);
})