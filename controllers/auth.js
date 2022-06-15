const session = require("express-session");

exports.getLogin=(req,res,next)=>{
    //console.log(req.get('Cookie').split(';')[1].trim().split('=')[1]);
    //const isLoggedIn=req.get('Cookie').split(';')[1].trim().split('=')[1]=='true';
    console.log(req.session.isLoggedIn);
    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        isAuthenticated:req.session.isLoggedIn
    });
}

exports.postLogin=(req,res,next)=>{
    req.session.isLoggedIn=true;
    //console.log("isLoggedIn :"+req.session.isLoggedIn);
    //res.setHeader('Set-Cookie','LoggedIn=true');
    req.session.save(()=>{
        res.redirect('/login');
    });
    
}

exports.postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/login');
    });
}