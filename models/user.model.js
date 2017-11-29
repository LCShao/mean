var mongoose=require("mongoose"),
  Schema=mongoose.Schema;
var UserSchema=new Schema({
  username:{
    type:String,
    unique:true,
    trim:true,
    required:"用户名不能为空"
  },
  password:{
    type:String,
    validate:[
      password=>password&&password.length>=6,
      "密码长度必须6位以上"
    ]
  },
  email:{
    type:String,
    required:"邮箱名不能为空",
    unique:true,
    match:[/.+\@.+\..+/,"邮箱格式不正确"]
  },
  firstName:String,
  lastName:String
})
UserSchema.virtual("fullName")
.get(function(){return this.firstName+" "+this.lastName;})
.set(function(fullName){
  [this.firstName,this.lastName]=fullName.split(" ");
});
UserSchema.set("toJSON",{getters:true});
mongoose.model("User",UserSchema);