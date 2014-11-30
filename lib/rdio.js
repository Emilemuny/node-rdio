/***
 *                                           
 *                  |                 |o     
 *    ,---.,---.,---|,---.   ,---.,---|.,---.
 *    |   ||   ||   ||---'---|    |   |||   |
 *    `   '`---'`---'`---'   `    `---'``---'
 *                                           
 *  Author: Troy Whiteley <troy@somany.com>
 *  Homepage: http://github.com/dawnerd/
 *  License: MIT
 *
 * See readme.md for usage
 */

var request = require('request');
var Hoek = require('hoek');

module.exports = function(config) {

  function configSetup(config) {
    options = Hoek.applyToDefaults(defaults, config);
  }

  var defaults = {
    urls: {
      request_token: 'http://api.rdio.com/oauth/request_token',
      access_token: 'http://api.rdio.com/oauth/access_token',
      api: 'http://api.rdio.com/1/'
    },
    rdio: {
      key: "",
      shared: ""
    }
  };

  var options = defaults;

  if(config) {
    configSetup(config);
  }

  function api(tokens, config) {
    this.tokens = tokens || {};

    if(config) {
      configSetup(config);
    }

    return this;
  }

  api.prototype.request = function(data, type, callback) {
    if(typeof type === 'object') {
      callback = type;
      type = 'api';
    }

    var oauth = {
      consumer_key: options.rdio.key,
      consumer_secret: options.rdio.secret
    };

    if(this.tokens.access_token) {
      oauth.access_token = this.tokens.access_token;
      oauth.access_token_secret = this.tokens.access_token_secret;
    } else {
      if(this.tokens.auth_token) {
        oauth.token = this.tokens.auth_token;
        oauth.token_secret = this.tokens.auth_token_secret;
      }

      if(this.tokens.verifier) {
        oauth.verifier = this.tokens.verifier;
      }
    }

    if(data.callback_url) {
      oauth.callback = data.callback_url;
      delete data.callback_url;
    }

    var postData = {
      url: options.urls[type],
      oauth: oauth,
      qs: data
    };

    request.post(postData, callback);
  };

  api.prototype.setTokens = function(tokens) {
    this.tokens = Hoek.applyToDefaults(this.tokens, tokens);

    return this;
  };

  api.prototype.getTokens = function() {
    return this.tokens;
  };

  api.prototype.getRequestToken = function(callback_url, callback) {
    this.request({
      callback_url: callback_url
    }, 'request_token', callback);
  };

  api.prototype.getAccessToken = function(verifier, callback) {
    this.tokens.verifier = verifier;
    this.request({}, 'access_token', callback);
  };

  api.prototype.getPlaybackToken = function(domain, callback) {
    this.request({
      method: 'getPlaybackToken',
      domain: domain
    }, callback);
  };

  return api;
};