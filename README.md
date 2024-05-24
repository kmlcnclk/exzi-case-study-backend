# Cryptocurrency Trading System API For EXZI

This document outlines the APIs provided by our cryptocurrency trading system, which supports Binance and Ethereum networks. The system supports the following tokens: USDT, USDC, ETH, and BNB.

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
- `confirmationPassword` (string): Confirmation of the user's password.

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

---

This documentation provides a comprehensive guide to using the APIs within our cryptocurrency trading system. For further details or support, please refer to the project's GitHub repository.