var User=require("mongoose").model("User");
var Article=require("mongoose").model("Article");

var getErrorMessage=function(err){
  for(var key in err.errors){
    return err.errors[key].message;
  }
}

//post方式，请求创建新文章:
exports.create=(req,res)=>{
  var art=new Article(req.body);
  User.findOne({_id:req.session.uid})
    .then(user=>{
      art.author=user._id;
      return art.save();
    })
    .then(art=>res.json(art))
    .catch(err=>{
      res.status(400).send({msg:getErrorMessage(err)})
    })
}

//get方式请求返回文章列表
exports.list=(req,res)=>{
  Article.find().sort("-createdDate")
    .populate("author","firstName lastName fullName")
    .exec()
    .then(arts=>res.json(arts))
    .catch(err=>res.status(400).send({msg:getErrorMessage(err)}))
}

//当请求中带参数时，自动先执行中间件函数articleById，获得想要的一篇文章对象，为后续操作做准备
exports.articleById=(req,res,next,id)=>{
  Article.findById(id)
    .populate("author","firstName lastName fullName")
    .exec()
    .then(art=>{
      if(!art)
        next(new Error("未找到id为"+id+"的文章"))
      else{
        req.article=art;
        next();
      }
    })
    .catch(next)
}

//get方式请求读取一篇文章
exports.read=(req,res)=>res.json(req.article);

//post请求方式更新文章
exports.update=(req,res)=>{
  var art=req.article;
  art.title=req.body.title;
  art.content=req.body.content;
  art.save()
    .then(art=>res.json(art))
    .catch(err=>res.status(400).send({msg:getErrorMessage(err)}))
}

//delete方式请求删除文章
exports.delete=(req,res)=>{
  var article=req.article;
  article.remove()
    .then(art=>res.json(art))
    .catch(err=>res.status(400).send({msg:getErrorMessage(err)}))
}

//中间件函数，专门判断当前用户是不是文章的作者
exports.isAuthor=(req,res,next)=>{
  if(req.article.author.id != req.session.uid){
    return res.status(403).send({msg:"用户没有权限"})
  }else{
    next();
  }
}