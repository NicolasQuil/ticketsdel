const mongoose = require('mongoose');
const {config} = require("../config/secret")
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@clustercats.7pkwn7o.mongodb.net/idf04`);
  console.log("mongo connect idf 77 local");

}