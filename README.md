# Referral program api

## Installation
```bash
$ yarn install
```

## Environment Setup
You need to create a PostgreSQL database named `ReferralProgram` and create `.env` file in the root directory of the project and add the following variables:
```
BASIC_AUTH_LOGIN=your_basic_auth_login
BASIC_AUTH_PASSWORD=your_auth_password
JWT_SECRET=your_jwt_secret
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
```

## Migrate database:
```bash
$ yarn knex migrate:latest --knexfile knexfile.ts
```

## Running the app
development:
```bash
$ yarn dev
```
watch mode:
```bash
$ yarn watch
```

## Tests
```bash
$ yarn jest
```

## Auth endpoints
1. Generate referral link (protected bearer, send link, link can be used 3 times, the link is valid for 3 days)
2. Get html form for referral registration student
3. Create student by referral link (input validation, body: refLinkId, fullName, phone, email, password, send: id, fullName, phone, email, referrerId)
4. Login student (input validation, body: phoneOrEmail, password, send: accessToken and refreshToken in cookie)
5. Logout student (refresh token middleware, add refresh token to blacklist)
6. Update refresh token (refresh token middleware, send: accessToken and refreshToken in cookie)

## Students endpoints
1. Get referral statistics student's (protected bearer, send: total count referrals and ids, fullNames)

## Students(superadmin) endpoints
1. Create student by admin (input validation, body: fullName, phone, email, password, send: id, fullName, phone, email, referrerId)

## Payments endpoints
1. Add payment and 4 lessons to referrer student and referral student (protected bearer, input validation, body: refLinkId, amount, paymentStatus, currency, countLessons, productName, send: info lessons for student and referrer)

Used: express, knex, postgresql, express-validator, jsonwebtoken, bcrypt, etc.
