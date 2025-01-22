# LetsConnect APIs
## authRouter
-POST /signup
-POST /login
-POST /logout


## profileRouter
-PATCH /profile/edit-not allow edit email/password
-GET /profile/view
-PATCH/profile/password

## connectionRequestRouter
-POST/request/send/intrested/:userId
-POST/request/send/ignored/:userId
-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId


## userRouter
-GET/user/connections
-GET/user/requests/received
-GET/user/feed 

status :ignore ,interested,accepted,rejected



