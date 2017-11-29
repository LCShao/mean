var express = require('express');
var router = express.Router();
var users=require("../controllers/users.controller");
var articles=require("../controllers/articles.controller");

///articles下
router.route("/")
  .get(articles.list)//get请求，获取所有文章的列表
  .post(users.requireLogin,articles.create);//post请求，请求文章路由
router.route("/:articleId")
  .get(articles.read)
  .post(users.requireLogin,articles.isAuthor,articles.update)
  .delete(users.requireLogin,articles.isAuthor,articles.delete);
router.param("articleId",articles.articleById);

module.exports = router;