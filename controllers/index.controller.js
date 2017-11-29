var User=require("mongoose").model("User");
exports.render=(req,res)=>{
  if(req.session.uid){
    User.findOne({_id:req.session.uid})
      .then(user=>{
        res.render("index",{title:"MEAN",user:JSON.stringify(user)})
      })
  }else{
    res.render("index",{title:"MEAN",user:""})
  }
}