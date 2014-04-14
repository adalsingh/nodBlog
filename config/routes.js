'use strict';

var config = require('./config');

module.exports = function(app, passport,auth,io) {
    
    /* Default Index */
    var indexDefaultController = require('../app/controllers/default/index');
    app.get('/', indexDefaultController.render(config));
    
    /* Login Index */
    var loginController = require('../app/controllers/login/index');
    app.get('/signin',loginController.render(config));
    
    app.post('/user/auth', loginController.auth(passport));
    app.get('/signout', loginController.signout);
    
    /* Admin Index */
    var indexAdminController = require('../app/controllers/admin/index');
    app.get('/admin',auth.requiresLogin ,indexAdminController.render(config));
    
    /* Admin Post Api */
    var postController = require('../app/controllers/api/post');
    app.post('/admin/api/post',auth.apiRequiresLogin, postController.create);
    app.get('/admin/api/post',auth.apiRequiresLogin, postController.allForAdmin);
    app.get('/admin/api/post/:postId',auth.apiRequiresLogin,auth.requireSameAuthor, postController.showForAdmin);
    app.put('/admin/api/post/:postId',auth.apiRequiresLogin,auth.requireSameAuthor, postController.update);
    app.del('/admin/api/post/:postId',auth.apiRequiresLogin,auth.requireSameAuthor, postController.destroy);
    app.post('/admin/api/post/upload',auth.apiRequiresLogin, postController.upload(io));
    app.get('/admin/api/post/comments/:postId',auth.apiRequiresLogin, postController.commentsByPostIdForAmin);
    
    /* Public Post Api */
    app.get('/api/post',postController.all);
    app.get('/api/post/:postId',postController.show);
    app.get('/api/post/comments/:postId',postController.commentsByPostId);
    
    /* Post Id Param */
    app.param('postId', postController.post);
    
   
    /* Admin Comment Api */
    var commentController = require('../app/controllers/api/comment');
    app.post('/admin/api/comment',auth.apiRequiresLogin, commentController.create);
    app.put('/admin/api/comment/:commentId',auth.apiRequiresLogin, commentController.update);
    
    
    /* Public Comment Api */
    app.post('/api/comment', commentController.create);
    app.get('/api/comment/:commentId', commentController.show);
    
    
    /* Comment Id Param */
    app.param('commentId', commentController.comment);
    
    /* Admin User Api */
    var userController = require('../app/controllers/api/user');
    app.post('/admin/api/user',auth.apiRequiresLogin,auth.isAdmin ,userController.create);
    app.get('/admin/api/user',auth.apiRequiresLogin,auth.isAdmin, userController.all);
    app.get('/admin/api/user/:userId',auth.apiRequiresLogin,auth.isOwnerProfile, userController.show);
    app.put('/admin/api/user/:userId',auth.apiRequiresLogin,auth.isOwnerProfile, userController.update);
    app.del('/admin/api/user/:userId',auth.apiRequiresLogin,auth.isAdmin, userController.destroy);
    app.get('/admin/api/user/email/:userEmail',auth.apiRequiresLogin,userController.showUserByEmail);
    
    /* User Id Param */
    app.param('userId', userController.user);
    app.param('userEmail', userController.userByEmail);
    
    /* Admin Media Api */
    var mediaController = require('../app/controllers/api/media');
    app.post('/admin/api/media',auth.apiRequiresLogin ,mediaController.create(io));
    app.get('/admin/api/media',auth.apiRequiresLogin, mediaController.all);
    app.get('/admin/api/media/:mediaId',auth.apiRequiresLogin, mediaController.show);
    app.put('/admin/api/media/:mediaId',auth.apiRequiresLogin,auth.isOwnerProfile,mediaController.update);
    app.del('/admin/api/media/:mediaId',auth.apiRequiresLogin,auth.isAdmin, mediaController.destroy);
    app.post('/admin/api/media/:mediaId/crop',auth.apiRequiresLogin ,mediaController.crop);
    app.post('/admin/api/media/:mediaId/resize',auth.apiRequiresLogin ,mediaController.resize);
    
    /* Media Id Param */
    app.param('mediaId', mediaController.media);
    
    /* Admin Contact Api */
    var contactController = require('../app/controllers/api/contact');
    app.get('/admin/api/contact',auth.apiRequiresLogin,auth.isAdmin,contactController.all);
    
    /* Public Contact Api */
    app.post('/api/contact',contactController.create);
    
}
