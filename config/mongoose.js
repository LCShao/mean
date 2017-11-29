var mongoose=require("mongoose");
mongoose.Promise=global.Promise;
mongoose.connect(require("./config").db,{useMongoClient:true});
require("../models/user.model");
require("../models/article.model");