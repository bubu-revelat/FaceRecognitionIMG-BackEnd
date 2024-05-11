const handleRegister = (req, res,db,bcrypt) => {
    let response = {
        result: false,
        message: ""
    }
    try {
        const { email, name, password } = req.body;
        if (password && name && email) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                }).into('login')
                    .returning('email')
                    .then(loginUser => {
                        return trx('users')
                            .insert({
                                name: name,
                                email: loginUser[0].email,
                                joined: new Date()
                            })
                            .returning('*')
                            .then(user => {
                                response.result = true;
                                console.log(`user: ${JSON.stringify(user)} created`)
                                res.send(response);
                            })
                            .catch(err => {
                                response.message = 'Unable to register'
                                res.status(400).json(response)
                            })
                    }).then(trx.commit)
                    .catch(trx.rollback)
            }).catch(err => {
                response.message = "Cannot register user";
                res.status(400).json(response);
            })
        } else {
            response.message = "Invalid params";
            res.status(400).json(response);
        }
    } catch (error) {
        console.error("signin error: ", error);
    }
};

module.exports={
    handleRegister:handleRegister
};