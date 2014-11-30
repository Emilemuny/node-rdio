var Hapi = require('hapi');
var qs = require('querystring');
var Rdio = require('../../')({
  rdio: {
    key: '8nfujzs8m5td6wy5cquap8vb',
    secret: 'FajApfbYva'
  }
});

var server = new Hapi.Server('localhost', 8000);


// Please don't actually do this
// This variable will contain the users auth tokens.
// You should save the tokens in a session or something.
// You can pass the tokens into Rdio() to restore.
var rdio = new Rdio(/* tokens, config*/);

server.route([
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply('<a href="/auth">Login here</a>');
    }
  },
  {
    method: 'GET',
    path: '/auth',
    handler: function(request, reply) {
      rdio.getRequestToken('http://localhost:8000/auth/callback', function(err, response, body) {
        var parsed = qs.parse(body);

        rdio.setTokens({
          auth_token: parsed.oauth_token,
          auth_token_secret: parsed.oauth_token_secret
        });

        reply.redirect(parsed.login_url + '?oauth_token=' + parsed.oauth_token);
      });
    },
  },
  {
    method: 'GET',
    path: '/auth/callback',
    handler: function(request, reply) {
      rdio.getAccessToken(request.query.oauth_verifier, function(e, response, body) {
        var parsed = qs.parse(body);

        rdio.setTokens({
          access_token: parsed.oauth_token,
          access_token_secret: parsed.oauth_token_secret
        });

        reply.redirect('/secure');
      });
    }
  },
  {
    method: 'GET',
    path: '/secure',
    handler: function(request, reply) {
      reply(rdio.getTokens());
    }
  }
]);

server.start();