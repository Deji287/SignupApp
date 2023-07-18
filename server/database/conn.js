import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import ENV from "../config.js";

async function connect() {
  // const mongod = await MongoMemoryServer.create();
  // const getURI = mongod.getUri();
  // const db = await mongoose.connect(getURI);
  // console.log("Database connected");

  const db = await mongoose.connect(ENV.DATABASE_ACCESS);
  console.log("Database Connected");

  return db;
}
export default connect;
