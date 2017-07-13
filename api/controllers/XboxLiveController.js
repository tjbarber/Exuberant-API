/**
 * XboxLiveController
 *
 * @description :: Server-side logic for managing Xbox Live
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	profile: function(req, res) {
    XboxLiveService.getProfile({gamertag: req.query['gamertag']}, function(data) {
      return res.send(data);
    });
  }
};

