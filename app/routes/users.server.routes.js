'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');

	//console.log('Users: ' + users.list);
	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users/:userId').get(users.findUser);
	app.route('/users/all').get(users.all);
	app.route('/users/list')
		.get(users.list)
		.post(users.search);
	app.route('/users/names').get(users.list_by_name);
	app.route('/users/emails').get(users.list_by_email);
	app.route('/users').put(users.update);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	app.route('/users/add/message/received/:userId')
		.put(users.requiresLogin, users.addReceivedMessage, users.update);
	app.route('/users/add/message/sent/:userId')
		.put(users.requiresLogin, users.addSentMessage, users.update);

	app.route('/user/messages')
		.get(users.getMessages);
	
	app.route('/user/message/delete/:msgID')
		.put(users.requiresLogin, users.deleteReceivedMessage, users.update);
	
	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Email verification
	app.route('/auth/confirm/:token').get(users.confirm);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
	app.param('msgID', users.messageByID);
};
