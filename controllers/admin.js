const Product=require('../models/product');
exports.getAddProduct=(req,res,next)=>{
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/edit-product',
    {   pageTitle:'Add Product',
        path:'/admin/add-product',
        formCss:true,
        activeAddProduct:true,
        editing:false,
        isAuthenticated:req.session.isLoggedIn
    });
};

exports.postAddProduct=(req,res,next)=>{
    let formData=JSON.parse(JSON.stringify(req.body));
    const title=formData.title;
    const imageUrl=formData.imageUrl;
    const price=formData.price;
    const description=formData.description;

    req.user.createProduct
    ({
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description
    })
    .then(result=>{
        res.redirect('/');
    }).catch(err=>{

    });

    /* Product.create({
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description,
        userId:req.user.id
    }).then(result=>{
        res.redirect('/');
    }).catch(err=>{

    }); */
};

exports.getEditProduct=(req,res,next)=>{
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    const editMode=req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }

    const prodId=req.params.productId;
    req.user.getProducts({where:{id:productId}})
    .then(products=>{
        const product=products[0];
        //console.log(product.price);
        if(!product){
            return res.redirect("/");
        }
        //console.log(product.price);
        //product.price=product.price.trim();
        //console.log(product.price);
        res.render('admin/edit-product',
            {
                pageTitle:'Edit Product',
                path:'/admin/edit-product',
                editing:editMode,
                product:product,
                isAuthenticated:req.session.isLoggedIn
            }
        );
    })
    .catch(error=>{
        console.log(error);
    }); 

    /* Product.findByPk(prodId)
    .then(product=>{
        //console.log(product.price);
        if(!product){
            return res.redirect("/");
        }
        //console.log(product.price);
        //product.price=product.price.trim();
        //console.log(product.price);
        res.render('admin/edit-product',
            {
                pageTitle:'Edit Product',
                path:'/admin/edit-product',
                editing:editMode,
                product:product
            }
        );
    })
    .catch(error=>{
        console.log(error);
    });  */   
};


exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updatedTilte=req.body.title;
    const updatedPrice=req.body.price;
    const updatedImageUrl=req.body.imageUrl;
    const updatedDesc=req.body.description;
    Product.findByPk(prodId)
    .then(product=>{
        product.title=updatedTilte;
        product.price=updatedPrice;
        product.description=updatedDesc;
        product.imageUrl=updatedImageUrl;
        return product.save();
    })
    .then(result=>{
        console.log("Product updated");
        res.redirect("/admin/products");
    })
    .catch(error=>{
        console.log(error);
    });
};

exports.getProducts=(req,res,next)=>{
    req.user.getProducts()
    .then(products=>{
        res.render('admin/products',
        {
            prods:products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true,
            isAuthenticated:req.session.isLoggedIn
        });
    })
    .catch(error=>{
        console.log(error);
    });
    /* Product.findAll()
    .then(products=>{
        res.render('admin/products',
        {
            prods:products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true
        });
    })
    .catch(error=>{
        console.log(error);
    }); */
};

exports.postDeleteProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    Product.findByPk(prodId)
    .then(product=>{
        return product.destroy();
    })
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(error=>{

    });
};