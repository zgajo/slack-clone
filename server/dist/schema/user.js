"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\ntype User {\n  id: Int!\n  username: String!\n  email: String!\n  teams: [Team!]!\n}\n\ntype Query {\n  me: User! #returns user after insert\n  allUsers: [User!]! #returns user after insert\n  getUser(userId: Int): User\n}\n\ntype Mutation {\n  register(\n    username: String!\n    email: String!\n    password: String!\n  ): RegisterResponse! #returns user after insert\n  login(email: String!, password: String): LoginResponse!\n}\n\ntype LoginResponse {\n  ok: Boolean!\n  token: String\n  refreshToken: String\n  errors: [Error!]\n}\n\ntype RegisterResponse {\n  ok: Boolean!\n  user: User\n  errors: [Error!]\n}\n";