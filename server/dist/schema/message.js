"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\ntype Message {\n  id: Int!\n  text: String\n  user: User!\n  channel: Channel!\n  created_at: String!\n  url: String\n  filetype: String\n}\ninput File {\n  type: String!\n  path: String!\n}\ntype Subscription {\n  newChannelMessage(channelId: Int!): Message!\n}\ntype Query {\n  messages(cursor: String, channelId: Int!): [Message!]!\n}\ntype Mutation {\n  createMessage(channelId: Int!, text: String, file: File): Boolean!\n}\n";