const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");

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
    }
};

module.exports = resolvers;