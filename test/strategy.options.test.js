/* global describe, it, expect, before */
/* jshint expr: true */

var TraktStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  describe('loading profile using custom URL', function() {
    var strategy =  new TraktStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://api.trakt.tv/users/me'
      },
      function() {});
  
    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://api.trakt.tv/users/me') { return callback(new Error('wrong url argument')); }
      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }
    
      var body = '{ "username": "octocat", "name": "monalisa octocat", "private": "false", "vip": "true" }';
  
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('trakt');
      
      expect(profile.id).to.equal('octocat');
      expect(profile.username).to.equal('monalisa octocat');
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
});
