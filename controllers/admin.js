const mongodb=new require('mongodb');
const Product=require('../models/product');

exports.getAddProduct=(req,res,next)=>{
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    //req.session.isLoggedIn
    res.render('admin/edit-product',
    {   pageTitle:'Add Product',
        path:'/admin/add-product',
        formCss:true,
        activeAddProduct:true,
        editing:false,
        isAuthenticated:true
    });
};

exports.postAddProduct=(req,res,next)=>{
    let formData=JSON.parse(JSON.stringify(req.body));
    const title=formData.title;
    const imageUrl=formData.imageUrl;
    const price=formData.price;
    const description=formData.description;
    const product=new Product(title,price,description,imageUrl,null,req.user._id);

    product
    .save()
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
    Product.findById(prodId)
    .then(product=>{
        //const product=products[0];
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
                isAuthenticated:true
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
    const product=new Product(
        updatedTilte,
        updatedPrice,
        updatedDesc,
        updatedImageUrl,
        prodId.trim()
    );
    product
    .save()
    .then(result=>{
        console.log("Product updated");
        res.redirect("/admin/products");
    })
    .catch(error=>{
        console.log(error);
    });
};

exports.getProducts=(req,res,next)=>{
    Product.fetchAll()
    .then(products=>{
        res.render('admin/products',
        {
            prods:products,
            pageTitle:'Admin Products',
            path:'/admin/products',
            hasProducts:products.length>0,
            productCss:true,
            activeShop:true,
            isAuthenticated:true
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
    Product.deleteById(prodId)
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(error=>{

    });
};