const { CreatedResponse, OKResponse } = require("../response/success");
const ArticleService = require("../services/article");

class ArticleController {
  static async getAll(req, res) {
    new OKResponse({
      metadata: await ArticleService.getAll(),
    }).send(res);
  }

  static async getCurrent(req, res) {
    new OKResponse({
      metadata: await ArticleService.getCurrent(),
    }).send(res);
  }

  static async getById(req, res) {
    new OKResponse({
      metadata: await ArticleService.getById(req.params.articleId),
    }).send(res);
  }

  static async create(req, res) {
    new CreatedResponse({
      metadata: await ArticleService.create(req.body),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await ArticleService.update(req.params.articleId, req.body),
    }).send(res);
  }

  static async toggleHide(req, res) {
    new OKResponse({
      metadata: await ArticleService.toggleHide(req.params.articleId),
    }).send(res);
  }
}

module.exports = ArticleController;
