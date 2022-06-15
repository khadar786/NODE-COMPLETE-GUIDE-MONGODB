const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
//const { engine }=require('express-handlebars');
const session=require('express-session');

var mysql2 = require('mysql2/promise');
var MySQLStore = require('express-mysql-session')(session);

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const authRoutes=require('./routes/auth');
const errorController=require('./controllers/error');
const sequelize=require('./util/database');
const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-item');
const Order=require('./models/order');
const OrderItem=require('./models/order-item');
const app=express();

var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'node-complete'
};

var connection = mysql2.createPool(options);
var sessionStore = new MySQLStore({}, connection);

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
app.use(session({
         secret:'my secret',
         resave:false,
         store:sessionStore,
         saveUninitialized:true
        }));

app.use((req,res,next)=>{
  User.findByPk(1)
  .then(user=>{
    req.user=user;
    next();
  })
  .catch(error=>{
    console.log(error);
  });
});
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



app.use(errorController.get404Page);
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

sequelize
//.sync({force:true})
.sync()
.then(result=>{
  //console.log(result);
  return User.findByPk(1);
}).then(user=>{
  if(!user){
    return User.create({name:'khadar',email:'khadar@gmail.com'});
  }

  return user;
}).then(user=>{
  return user.createCart();
}).then(cart=>{
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
});