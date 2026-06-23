/*
auth middleware
1. check cookie for token -> false 401
2. verify token jwt.verify(token, process.env.JWT_SECRET) -> false 401  and do not decode just verify - success data
3. attach user to req for future verification
4. call next
*/
