const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

        me: async function (parent, arg, context) {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password")
                    .populate("books");
                return userData;
            };
            throw new AuthenticationError("Not logged in");
        }
       
    },

    Mutation: {

        addUser: async function (parent, args) {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }
        }

    }

};

module.exports = resolvers;