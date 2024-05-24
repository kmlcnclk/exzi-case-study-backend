import { v4 } from "uuid";
const request = require("supertest");

export async function createUser() {
  const randomEmail = v4();

  const response = await request("http://localhost:8000")
    .post("/user/sign-up")
    .send({
      name: "abcde",
      email: `${randomEmail}@gmail.com`,
      password: "123456",
      passwordConfirmation: "123456",
    });
  return { response };
}
