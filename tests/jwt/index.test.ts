import request from "supertest";

describe("JWT API", () => {
  describe("POST /jwt/refresh", () => {
    // it("User should be able to use refresh token for new accessToken and refreshToken", async () => {
    //   const refreshToken =
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTI4NjksImV4cCI6MTcxODM2NzI2OX0.c9RB95EGcJqgnl_aO2do8KclttdAU4xhaUVaH_ALY8o";

    //   const response = await request("http://localhost:8000")
    //     .post("/jwt/refresh")
    //     .set("x-refresh", refreshToken);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty("accessToken");
    //   expect(response.body).toHaveProperty("refreshToken");
    // });

    it("User should not be able to use refresh token without sending refreshToken", async () => {
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTI4NjksImV4cCI6MTcxODM2NzI2OX0.c9RB95EGcJqgnl_aO2do8KclttdAU4xhaUVaH_ALY8o";

      const response = await request("http://localhost:8000").post(
        "/jwt/refresh"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("JWT Refresh Token Do Not Exist");
    });

    it("User should not be able to use refresh token to sending decode fail refreshToken", async () => {
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTMxMTQsImV4cCI6MTcxNjU1MzE3NH0.eRe62LQynD2hqS8JjVCRtJCm2np8UrdJAAhWWfUrWpk";

      const response = await request("http://localhost:8000")
        .post("/jwt/refresh")
        .set("x-refresh", refreshToken);

      expect(response.status).toBe(403);
      expect(response.body.data).toEqual(false);
      expect(response.body.message).toEqual("Decode Failed");
    });

    it("User should not be able to use refresh token to sending expired refreshToken", async () => {
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTI4NjksImV4cCI6MTcxODM2NzI2OX0.c9RB95EGcJqgnl_aO2do8KclttdAU4xhaUVaH_ALY8o";

      const response = await request("http://localhost:8000")
        .post("/jwt/refresh")
        .set("x-refresh", refreshToken);

      expect(response.status).toBe(403);
      expect(response.body.data).toEqual(false);
      expect(response.body.message).toEqual("JWT Token Invalid");
    });
  });
});
