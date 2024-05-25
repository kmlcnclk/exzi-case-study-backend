# Cryptocurrency Trading System API For EXZI

This document outlines the APIs provided by our cryptocurrency trading system, which supports Binance and Ethereum networks. The system supports the following tokens: USDT, USDC, ETH, and BNB. Go to [EXZI Frontend](https://github.com/kmlcnclk/exzi-case-study-frontend/)

## User Management

### User Sign-In

**Endpoint:** `/user/sign-in`  
**Method:** `POST`

Allows the user to log in successfully.

**Parameters:**
- `email` (string): The user's email.
- `password` (string): The user's password.

### User Sign-Up

**Endpoint:** `/user/sign-up`  
**Method:** `POST`

Allows the user to successfully register to the system.

**Parameters:**
- `name` (string): The user's name.
- `email` (string): The user's email.
- `password` (string): The user's password.
- `passwordConfirmation` (string): Confirmation of the user's password.

### Get User By ID

**Endpoint:** `/user/getUserById`  
**Method:** `GET`

Returns the user's information.

**Headers:**
- `Authorization` (string): The access token.

## JWT Management

### Refresh JWT

**Endpoint:** `/jwt/refresh`  
**Method:** `POST`

Generates new access tokens and refresh tokens for the user.

**Headers:**
- `Authorization` (string): The refresh token.

## Wallet Management

### Create Wallet

**Endpoint:** `/wallet/create-wallet`  
**Method:** `POST`

Creates an Ethereum wallet for the user.

### Get Wallet By User ID

**Endpoint:** `/wallet/getWalletByUserId`  
**Method:** `GET`

Gets the information of the user's wallet.

### Withdraw Tokens

**Endpoint:** `/wallet/withdraw`  
**Method:** `POST`

Allows the user to send the desired amount of tokens from the wallet previously created in the system to another wallet.

**Parameters:**
- `token` (string): The token to withdraw (e.g., USDT, USDC, ETH, BNB).
- `amount` (number): The amount of tokens to withdraw.
- `to` (string): The address of the destination wallet.
- `network` (string): The network for token.


### Wallet Balance

**Endpoint:** `/wallet/balance`  
**Method:** `GET`

Allows the user to see the balance of the tokens in their wallet within the system.

## Trading

### Buy and Sell Tokens

**Endpoint:** `/trade/buy-and-sell`  
**Method:** `POST`

Allows the user to buy and sell tokens with their wallet in the system.

**Parameters:**
- `network` (string): The network for the token.
- `tokens` (array): The tokens to trade (e.g., USDT, USDC, ETH, BNB).
- `amount` (number): The amount of tokens to buy or sell.

### Trade History

**Endpoint:** `/trade/history`  
**Method:** `GET`

Allows the user to obtain records of their buy and sell transactions.

## Supported Networks and Tokens

The system supports the following networks and tokens:

- **Binance Network:**
  - USDT
  - USDC
  - BNB
  - ETH

- **Ethereum Network:**
  - USDT
  - USDC
  - ETH


## Used Technologies

- Typescript
- Javascript
- Express.js
- Zod
- Ethers
- Web3.js
- Helmet
- Mongo DB
- Cors
- Uniswap SDK
- Truffle
- Openzeppelin Contracts
- Node RSA
- Json Web Token
- Bcrypt
- Lodash
- Winston
- UUID
- Supertest
- Jest


## Node Version

The system is built using Node version v20.11.1.

## Note

- Normally important information such as `.env` and `rsa_key.pem` should not be added to GitHub projects, but I added it so that the application can be run by everyone.
- Additionally, unit tests have been written for APIs.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/kmlcnclk/exzi-case-study-backend.git
    ```
2. Install dependencies:
    ```bash
    cd exzi-case-study-backend
    npm install
    ```
3. Run the application:
    ```bash
    npm run dev
    ```

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.

This documentation provides a comprehensive guide to using the APIs within our cryptocurrency trading system. For further details or support, please refer to the project's GitHub repository.
