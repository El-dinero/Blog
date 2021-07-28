//Автопостер

const faker = require("faker");
const TurndownService = require("turndown");

const Post = require("./models/post");


module.exports = (length, owner) => Post.remove()
    .then(() => {
        Array.from({length: length}).forEach(() =>
            Post.create({
                title: faker.lorem.words(5),
                body: new TurndownService().turndown(faker.lorem.words(30)),
                owner,
            })
                .then(console.log)
                .catch(console.log)
        )
    })
    .catch(console.log);
