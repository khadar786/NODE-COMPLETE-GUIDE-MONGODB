//const { redirect } = require('express/lib/response');
const Product=require('../models/product');
const Cart=require('../models/cart');
const User = require('../models/user');

exports.getProducts=(req,res,next)=>{
    Product.findAll()
    .then(products=>{
        res.render('shop/product-list',
        {
            prods:products,
            pageTitle:'Products',
            path:'/products',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true,
            isAuthenticated:req.session.isLoggedIn
        });
    }).catch(error=>{

    });
};

exports.getProduct=(req,res,next)=>{
    const productId=req.params.productId;
   //console.log(productId);
    Product.findByPk(productId)
    .then(product=>{
        //console.log(product);
        res.render('shop/product-detail',{
            product:product,
            pageTitle:product.title,
            path:'/products',
            isAuthenticated:req.session.isLoggedIn
        });
    })
    .catch(err=>{

    });
    
};

exports.getIndex=(req,res,next)=>{
    req.user.getProducts()
    .then(products=>{
        res.render('shop/index',
        {
            prods:products,
            pageTitle:'Shop',
            path:'/',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true,
            isAuthenticated:req.session.isLoggedIn
        });
    })
    .catch(err=>{

    });

    /* Product.findAll()
    .then(products=>{
        res.render('shop/index',
        {
            prods:products,
            pageTitle:'Shop',
            path:'/',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true
        });
    })
    .catch(err=>{

    }); */
};

exports.getCart=(req,res,next)=>{
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart',{
                pageTitle:'Your Cart',
                path:'/cart',
                products:products,
                isAuthenticated:req.session.isLoggedIn
            });
        })
        .catch(error=>{
            console.log(error);
        });
    })
    .catch(error=>{
        console.log(error);
    });
    /* Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts=[];
            for (product of products) {
                const cartProductData=cart.products.find(prod=>prod.id===product.id);
                if(cartProductData){
                    cartProducts.push({productData:product,qty:cartProductData.qty});
                }
            }
            //console.log(cartProducts);
            res.render('shop/cart',{
                pageTitle:'Your Cart',
                path:'/cart',
                products:cartProducts
            });
        });
    }); */
    
}

exports.postCart=(req,res,next)=>{
    const prodId=req.body.productId;
    let fetchedCart;
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
    });
    /* console.log(prodId);
    Product.findById(prodId,(product)=>{
        Cart.addProduct(prodId,product.price);
    });
    res.redirect('/cart'); */
}

exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
        pageTitle:'Checkout',
        path:'/checkout'
    });
}

exports.postCartDeleteProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where:{id:prodId}});
    }).then(products=>{
        const product=products[0];
        return product.cartItem.destroy();
    }).then(result=>{
        res.redirect('/cart');
    })
    .catch(error=>{
        console.log(error);
    });
};

exports.postOrder=(req,res,next)=>{
    let fetchedCart;
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts();
    })
    .then(products=>{
        return  req.user.createOrder()
                .then(order=>{
                    return order.addProducts(products.map(product=>{
                        product.orderItem={quantity:product.cartItem.quantity};
                        return product;
                    }));
                });
        console.log(products);
    }).then(result=>{
        return fetchedCart.setProducts(null);
        res.redirect('/orders');
    }).then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getOrders=(req,res,next)=>{
    req.user.getOrders({include:['products']})
    .then(orders=>{
        console.log(orders);
        res.render('shop/orders',{
            path:'/orders',
            pageTitle:'Your orders',
            orders:orders,
            isAuthenticated:req.session.isLoggedIn
        });
    })
    .catch(err=>{console.log(err);});
}