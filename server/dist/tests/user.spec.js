"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("User resolvers", function () {
  test("allUsers", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var response, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios2.default.post("http://localhost:8081/graphql", {
              query: "\n          {\n              allUsers {\n                  id\n                  username\n                  email\n              }\n          }\n          "
            });

          case 2:
            response = _context.sent;
            data = response.data;


            expect(data).toMatchObject({
              data: {
                allUsers: []
              }
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  test("register", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var response, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _axios2.default.post("http://localhost:8081/graphql", {
              query: "\n              mutation{\n                  register(username: \"testuser\", email:\"test@test.hr\", password: \"passtest\") {\n                      ok\n                      errors{\n                          path\n                          message\n                      }\n                      user{\n                          username\n                          email\n                      }\n                  }\n              }\n              "
            });

          case 2:
            response = _context2.sent;
            data = response.data;


            expect(data).toMatchObject({
              data: {
                register: {
                  ok: true,
                  errors: null,
                  user: {
                    username: "testuser",
                    email: "test@test.hr"
                  }
                }
              }
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  test("login and create team", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var response, _response$data$data$l, ok, token, refreshToken, responseCreateTeam, data;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _axios2.default.post("http://localhost:8081/graphql", {
              query: "\n        mutation{\n            login(email: \"test@test.hr\", password: \"passtest\") {\n              ok\n              token\n              refreshToken\n              errors {\n                path\n                message\n              }\n            }\n          }\n                "
            });

          case 2:
            response = _context3.sent;
            _response$data$data$l = response.data.data.login, ok = _response$data$data$l.ok, token = _response$data$data$l.token, refreshToken = _response$data$data$l.refreshToken;


            expect(ok).toBeTruthy();

            _context3.next = 7;
            return _axios2.default.post("http://localhost:8081/graphql", {
              query: "\n        mutation {\n            createTeam(name: \"team1\") {\n              ok\n              team {\n                name\n              }\n            }\n          }\n                  "
            }, {
              headers: {
                "x-token": token,
                "x-refresh-token": refreshToken
              }
            });

          case 7:
            responseCreateTeam = _context3.sent;
            data = responseCreateTeam.data;


            expect(data).toMatchObject({
              data: {
                createTeam: {
                  ok: true,
                  team: {
                    name: "team1"
                  }
                }
              }
            });

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});