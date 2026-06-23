/* 
registration controller
check email exits
    if true: 401 {success:'false',user already exists}
    else:
        hash the password using bcryptjs rounds 10:
        create user in db (but allocate uuid on server)
        return 201 {success:'true',message:'user created'}
*/

/* 
login controller
check user exists with email
    if false: 401 {success:false, message:"invalid credential"}
    else:
        compare the hashed password
        if not match : 404 {success:false, message:"user not found"}
        else:
            match the password
            if password does not match:
                401 {success:false,message:"invalid credential"}
            else:
                generate access token with 15 min expiry using jwt
                set access token in http only cookie secure true same site: strict/lax
                return 200 {success:true,message:"login successful",accessToken}
*/

/* 
logout controller
clear access token cookie http only cookie secure true same site: strict/lax
return 200 {success:true,message:"logout successful"}
*/
