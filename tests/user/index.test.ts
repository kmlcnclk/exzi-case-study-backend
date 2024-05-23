// src/app.test.ts
import request from "supertest";

describe("User API", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const response = await request("http://localhost:8000")
        .post("/user/sign-up")
        .send({
          name: "testuser1",
          password: "testpassword1",
          passwordConfirmation: "testpassword1",
          email: "testuser1@gmail.com",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const response = await request("http://localhost:8000")
        .post("/user/sign-in")
        .send({ email: "testuser1@gmail.com", password: "testpassword" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request("http://localhost:8000")
        .post("/user/sign-in")
        .send({ email: "nonexistent", password: "wrongpassword" });

      expect(response.status).toBe(400);
    });
  });
});
