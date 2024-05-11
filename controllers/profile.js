const handleProfile = (req, res, db) => {
    let response = {
        result: false,
        message: ""
    }
    try {
        const { id } = req.params;
        if (id) {
            db.select('*').from('users').where({ id: id })
                .then(user => {
                    if (user.length) {
                        response.result = true;
                        response.user = user;
                        res.send(response);
                    } else {
                        response.message = "user not found";
                        res.status(400).json(response);
                    }
                }).catch(err => {
                    response.message = "error looking for user";
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
    handleProfile : handleProfile
}