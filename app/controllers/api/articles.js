'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');

/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
   Article.findOne({ '_id': id }, function (err, article) {
        if (err) {
            return next(err);
        }
        if (!article) {
            return next(new Error('Failed to load article ' + id));
        }
        req.article = article;
        next();
    });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    var article = req.body;
    var article = new Article(req.body);
    article.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;
    article = _.extend(article, req.body);
    article.save(function(err) {
        if (err) {
             console.log(err);
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;
    article.remove(function(err) {
        if (err) {
            console.log(err); 
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Article.find().sort('-created').exec(function(err, articles) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(articles);
        }
    });
};