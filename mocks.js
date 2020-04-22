const faker = require("faker");
const TurndownService = require("turndown");

const Post = require("./models/user");

const owner = "5addc18c6d1e240d93be34a8";

module.exports = () => {
  Post.remove()
    .then(() => {
      Array.from({ length: 10 }).forEach(() => {
        const turndownService = new TurndownService();

        Post.create({
          title: faker.lorem.words(5),
          body: turndownService.turndown(faker.lorem.words(30)),
          owner,
        })
          .then(console.log)
          .catch(console.log);
      });
    })
    .catch(console.log);
};
