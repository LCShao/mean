var mongoose=require("mongoose"),
  Schema=mongoose.Schema;
var ArticleSchema=new Schema({
  title:{type:String,trim:true,required:"标题不能为空"},
  content:{type:String,required:"内容不能为空"},
  author:{type:Schema.ObjectId,ref:"User"},
  createdDate:{type:Date,default:Date.now}
});
mongoose.model("Article",ArticleSchema);