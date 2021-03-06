//const { redirect } = require('express/lib/response');
const Product=require('../models/product');
//const Cart=require('../models/cart');
//const User = require('../models/user');

exports.getProducts=(req,res,next)=>{
    Product.fetchAll()
    .then(products=>{
        res.render('shop/product-list',
        {
            prods:products,
            pageTitle:'Products',
            path:'/products',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true,
            isAuthenticated:true
        });
    }).catch(error=>{

    });
};

exports.getProduct=(req,res,next)=>{
    const productId=req.params.productId;
   //console.log(productId);
    Product.findById(productId)
    .then(product=>{
        //console.log(product);
        res.render('shop/product-detail',{
            product:product,
            pageTitle:product.title,
            path:'/products',
            isAuthenticated:true
        });
    })
    .catch(err=>{

    });
    
};

exports.getIndex=(req,res,next)=>{
    Product.fetchAll()
    .then(products=>{
        res.render('shop/index',
        {
            prods:products,
            pageTitle:'Shop',
            path:'/',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true,
            isAuthenticated:true
        });
    })
    .catch(err=>{

    });
};

exports.getCart=(req,res,next)=>{
    req.user.getCart()
    .then(products=>{
        res.render('shop/cart',{
            pageTitle:'Your Cart',
            path:'/cart',
            products:products,
            isAuthenticated:true
        });
    })
    .catch(error=>{
        console.log(error);
    });
    
}

exports.postCart=(req,res,next)=>{
    const prodId=req.body.productId;
    Product.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product);
    })
    .then(result=>{
        res.redirect('/cart'); 
        console.log(result);
    });
    /* let fetchedCart;
    let newQuantity=1;
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts({where:{id:prodId}});
    }).then(products=>{
        let product;
        if(products.length>0){
            product=products[0];
        }

        if(product){
            const oldQuantity=product.cartItem.quantity;
            newQuantity=oldQuantity+1; 
            return product;  
        }

        return Product.findByPk(prodId)
    }).then(product=>{
        return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
    })
    .then(()=>{
        res.redirect('/cart'); 
    })
    .catch(error=>{
        console.log(error);
    }); */
   
}

exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
        pageTitle:'Checkout',
        path:'/checkout'
    });
}

exports.postCartDeleteProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(error=>{
        console.log(error);
    });
};

exports.postOrder=(req,res,next)=>{
    let fetchedCart;
    req.user
    .addOrder()
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getOrders=(req,res,next)=>{
    req.user.getOrders()
    .then(orders=>{
        console.log(orders);
        res.render('shop/orders',{
            path:'/orders',
            pageTitle:'Your orders',
            orders:orders,
            isAuthenticated:true
        });
    })
    .catch(err=>{console.log(err);});
}