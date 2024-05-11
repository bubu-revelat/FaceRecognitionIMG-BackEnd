const handleSignIn = (req, res, db, bcrypt) => {
    let response = {
        result: false,
        message: ""
    }
    try {
        const { email, password } = req.body;
        if (email && password) {
            db.select('*').from('login').where({ email: email })
                .then(loginUser => {
                    console.log('loginUser: ', JSON.stringify(loginUser));
                    if (loginUser.length) {
                        const validHash = bcrypt.compareSync(password, loginUser[0].hash);
                        if (validHash) {
                            db.select('*').from('users').where({ email: email })
                                .then(user => {
                                    console.log('user: ', JSON.stringify(user));
                                    response.result = true;
                                    response.user = user[0];
                                    console.log(`user: ${user[0].id} connected`)
                                    res.send(response);
                                })
                        } else {
                            response.message = "User and password invalid";
                            res.status(400).json(response);
                        }
                    } else {
                        response.message = "User not found";
                        res.status(400).json(response);
                    }
                }).catch(err => {
                    response.message = "User not found";
                    res.status(400).json(response);
                })

        } else {
            response.message = "Invalid params";
            res.status(400).json(response);
        }
    } catch (error) {
        console.error("signin error: ", error);
    }
}

module.exports = {
    handleSignIn:handleSignIn
}