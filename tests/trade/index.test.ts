import request from "supertest";

describe("Trade API", () => {
  describe("GET /trade/history", () => {
    it("User should be able to get histories of trade processes", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTQ3ODAsImV4cCI6MTcxNzE1OTU4MH0.0utJAiA_pcQdJcKluLVHjF0-0Gi2WjNeSNU6U8vtAlY";

      const response = await request("http://localhost:8000")
        .get("/trade/history")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe("GET /trade/buy-and-sale", () => {});
});
