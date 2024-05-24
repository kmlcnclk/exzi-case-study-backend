import request from "supertest";
import { v4 } from "uuid";

describe("User API", () => {
  const randomEmail = v4();
  describe("POST /user/sign-up", () => {
    it("should register a new user", async () => {
      const response = await request("http://localhost:8000")
        .post("/user/sign-up")
        .send({
          name: "abcde",
          email: `${randomEmail}@gmail.com`,
          password: "123456",
          passwordConfirmation: "123456",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });
  });

  describe("POST /user/sign-in", () => {
    it("should login an existing user", async () => {
      const response = await request("http://localhost:8000")
        .post("/user/sign-in")
        .send({ email: `${randomEmail}@gmail.com`, password: "123456" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request("http://localhost:8000")
        .post("/user/sign-in")
        .send({
          email: `${randomEmail}@gmail.com`,
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /user/getUserById", () => {
    it("user successfully return", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTQ3ODAsImV4cCI6MTcxNzE1OTU4MH0.0utJAiA_pcQdJcKluLVHjF0-0Gi2WjNeSNU6U8vtAlY";

      const response = await request("http://localhost:8000")
        .get("/user/getUserById")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("_id");
    });

    it("JWT Token Not Found Error should return", async () => {
      const response = await request("http://localhost:8000").get(
        "/user/getUserById"
      );

      expect(response.status).toBe(401);
      expect(response.body.error.name).toEqual("Unauthorized Error");
      expect(response.body.error.message).toEqual("JWT Token Not Found");
    });

    it("JWT Token Expired Error should return", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY0NjIzMDEsImV4cCI6MTcxNjQ2NTkwMX0.OM7Q0jpqzVKn6Gy2T27jdYd1iD7bP2-zek3hZE_UY1s";

      const response = await request("http://localhost:8000")
        .get("/user/getUserById")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error.name).toEqual("Unauthorized Error");
      expect(response.body.error.message).toEqual("JWT Token Expired");
    });
  });
});
