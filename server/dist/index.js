"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _http = require("http");

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _apolloServerExpress = require("apollo-server-express");

var _graphqlTools = require("graphql-tools");

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _graphql = require("graphql");

var _graphqlSubscriptions = require("graphql-subscriptions");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _dataloader = require("dataloader");

var _dataloader2 = _interopRequireDefault(_dataloader);

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

var _auth = require("./auth");

var _batchFunctions = require("./batchFunctions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./schema")));
var resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./resolvers")));

var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: resolvers
});

var app = (0, _express2.default)();

var readToken = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var token, _ref2, user, refreshToken, newTokens;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return req.headers["x-token"];

          case 2:
            token = _context.sent;

            if (!token) {
              _context.next = 22;
              break;
            }

            _context.prev = 4;
            _context.next = 7;
            return _jsonwebtoken2.default.verify(token, SECRET);

          case 7:
            _ref2 = _context.sent;
            user = _ref2.user;

            req.user = user;
            _context.next = 22;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](4);
            _context.next = 16;
            return req.headers["x-refresh-token"];

          case 16:
            refreshToken = _context.sent;
            _context.next = 19;
            return (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);

          case 19:
            newTokens = _context.sent;

            if (newTokens.token && newTokens.refreshToken) {
              res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
              res.set("x-token", newTokens.token);
              res.set("x-refresh-token", newTokens.refreshToken);
            }
            req.user = newTokens.user;

          case 22:
            next();

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 12]]);
  }));

  return function readToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var SECRET = "sdfAsds:_:As!";
var SECRET2 = "23213$%&$#$LKJdsš";

var uploadDir = "files";

var fileMiddleware = function fileMiddleware(req, res, next) {
  if (!req.is("multipart/form-data")) {
    return next();
  }

  var form = _formidable2.default.IncomingForm({
    uploadDir: uploadDir
  });

  form.parse(req, function (error, _ref3, files) {
    var operations = _ref3.operations;

    if (error) {
      console.log(error);
    }

    var document = JSON.parse(operations);

    if (Object.keys(files).length) {
      var _files$file = files.file,
          type = _files$file.type,
          filePath = _files$file.path;

      console.log(type);
      console.log(filePath);
      document.variables.file = {
        type: type,
        path: filePath
      };
    }

    req.body = document;
    next();
  });
};

var graphqlEndpoint = "/graphql";

// parse application/json
app.use(_bodyParser2.default.json());
app.use(readToken);
app.use((0, _cors2.default)("*"));

// The GraphQL endpoint
app.use(graphqlEndpoint, _bodyParser2.default.json(), fileMiddleware, (0, _apolloServerExpress.graphqlExpress)(function (req) {
  return {
    schema: schema,
    context: {
      models: _models2.default,
      user: req.user,
      SECRET: SECRET,
      SECRET2: SECRET2,
      channelLoader: new _dataloader2.default(function (ids) {
        return (0, _batchFunctions.channelBatcher)(ids, _models2.default, req.user);
      }),
      server_url: req.protocol + "://" + req.get("host")
    }
  };
}));

// GraphiQL, a visual editor for queries
app.use("/graphiql", (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: "/graphql",
  subscriptionsEndpoint: "ws://localhost:4001/subscriptions"
}));

app.use("/files", _express2.default.static("files"));
var server = (0, _http.createServer)(app);

_models2.default.sequelize.sync({ force: false }).then(function () {
  // Start the server

  server.listen(4001, function () {
    new _subscriptionsTransportWs.SubscriptionServer({
      execute: _graphql.execute,
      subscribe: _graphql.subscribe,
      schema: schema,
      onConnect: function () {
        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref5, webSocket) {
          var token = _ref5.token,
              refreshToken = _ref5.refreshToken;

          var user, _jwt$verify, _user, newTokens;

          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(token && refreshToken)) {
                    _context2.next = 13;
                    break;
                  }

                  user = null;
                  _context2.prev = 2;
                  _jwt$verify = _jsonwebtoken2.default.verify(token, SECRET), _user = _jwt$verify.user;
                  return _context2.abrupt("return", { models: _models2.default, user: _user });

                case 7:
                  _context2.prev = 7;
                  _context2.t0 = _context2["catch"](2);
                  _context2.next = 11;
                  return (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);

                case 11:
                  newTokens = _context2.sent;
                  return _context2.abrupt("return", { models: _models2.default, user: newTokens.user });

                case 13:
                  return _context2.abrupt("return", { models: _models2.default });

                case 14:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, undefined, [[2, 7]]);
        }));

        return function onConnect(_x4, _x5) {
          return _ref4.apply(this, arguments);
        };
      }()
    }, {
      server: server,
      path: "/subscriptions"
    });
    console.log("Go to http://localhost:4001/graphiql to run queries!");
  });
});