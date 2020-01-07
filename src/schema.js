import { gql } from "apollo-server";

export const typeDefs = gql`
  type Subscription {
    messageSent: Message
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Message {
    id: ID!
    message: String!
    sender: User!
    receiver: User!
  }

  type Query {
    users: [User!]!
    messages(senderId: ID): [Message!]!
  }

  type Mutation {
    sendMessage(sendMessageInput: SendMessageInput!): Message!
  }

  input SendMessageInput {
    message: String!
    senderId: ID!
    receiverId: ID!
  }

`;
