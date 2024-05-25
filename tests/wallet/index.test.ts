import request from "supertest";

describe("Wallet API", () => {
  describe("GET /wallet/balance", () => {
    it("User should be able to get balances of wallet", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTQ3ODAsImV4cCI6MTcxNzE1OTU4MH0.0utJAiA_pcQdJcKluLVHjF0-0Gi2WjNeSNU6U8vtAlY";

      const response = await request("http://localhost:8000")
        .get("/wallet/balance")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.balances).toHaveProperty("ethereum");
      expect(response.body.balances).toHaveProperty("binance");
    });
  });

  describe("GET /wallet/getWalletByUserId", () => {
    it("User should be able to get own wallet address from system", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTQ3ODAsImV4cCI6MTcxNzE1OTU4MH0.0utJAiA_pcQdJcKluLVHjF0-0Gi2WjNeSNU6U8vtAlY";

      const response = await request("http://localhost:8000")
        .get("/wallet/getWalletByUserId")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("walletAddress");
    });
  });

  describe("POST /wallet/create-wallet", () => {
    it("User should not be able to create wallet multiple times", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTQ3ODAsImV4cCI6MTcxNzE1OTU4MH0.0utJAiA_pcQdJcKluLVHjF0-0Gi2WjNeSNU6U8vtAlY";

      const response = await request("http://localhost:8000")
        .post("/wallet/create-wallet")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toEqual("Wallet already exists");
    });
  });

  describe("POST /wallet/withdraw", () => {
    it("User should not be able to withdraw", async () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWFhYSIsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJfaWQiOiI2NjRmMjJkZDBlZTdiYmYwNmZiNmRhMTMiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTIzVDExOjA1OjAxLjE5N1oiLCJpYXQiOjE3MTY1NTQ3ODAsImV4cCI6MTcxNzE1OTU4MH0.0utJAiA_pcQdJcKluLVHjF0-0Gi2WjNeSNU6U8vtAlY";

      const response = await request("http://localhost:8000")
        .post("/wallet/withdraw")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          amount: "0.000000001",
          to: "0x177d84631999414480E833Ae7a1e6235ce5bdB3f",
          network: "ethereum",
          token: "eth",
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toHaveProperty("name");
      expect(response.body.error).toHaveProperty("message");

      expect(response.body.error.name).toEqual("Internal Server Error");
      expect(response.body.error.message).toEqual("Withdraw is not successful");
    });
  });
});
