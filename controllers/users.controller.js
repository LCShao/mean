var User=require("mongoose").model("User");

var getErrorMessage=function(err){
  if(err.code){
    switch(err.code){
      case 11000:
      case 11001:
        if(err.message.indexOf("username")!=-1)
          return "用户名已被占用";
        else
          return "邮箱已被占用";
      default:
        return "出错啦！";
    }
  }else{
    for(var key in err.errors){
      return err.errors[key].message;
    }
  }
}

//当get方式请求signin路由时，加载signin模板页面
exports.renderSignin=(req,res)=>{
  if(!req.session.uid){
    var msg=req.session.msg;
    req.session.msg=null;
    res.render("signin",{title:"登录",msg:msg||""});
  }else
    return res.redirect("/");
}
//当get方式请求signup路由时，加载signup模板页面
exports.renderSignup=(req,res)=>{
  if(!req.session.uid){
    var msg=req.session.msg;
    req.session.msg=null;
    res.render("signup",{title:"注册",msg:msg||""})
  }else
    return res.redirect("/");
}

//当post方式提交注册请求时
exports.signup=(req,res)=>{
  if(!req.session.uid){
    var user=new User(req.body);
    user.save()
      .then(user=>{
        req.session.uid=user._id;
        res.redirect("/");
      })
      .catch(err=>{
        req.session.msg=getErrorMessage(err);
        res.redirect("/users/signup");
      })
  }
}

//当post方式提交登录请求时
exports.signin=(req,res)=>{
  var user=new User(req.body);
  User.findOne({username:user.username,password:user.password})
    .then(user=>{
      if(user){
        req.session.uid=user._id;
        res.redirect("/");
      }else{
        req.session.msg="用户名或密码不正确！";
        res.redirect("/users/signin")
      }
    })
}
//当post方式请求注销时
exports.signout=(req,res)=>{
  req.session.uid=null;
  res.redirect("/");
}

//中间件函数，为文章功能提供操作前登录检查
exports.requireLogin=(req,res,next)=>{
  if(!req.session.uid)
    return res.status("401").send({msg:"用户未登录"})
  else
    next();
}