const handleClarifiAPI = (req, res) =>{
    console.log("Inside clarifi method: ", req.body.input);
    const PAT = 'e92018ee4c6e4d6cab68b92d19e801e6';
    const USER_ID = '1o4l1ko26wtm';
    const APP_ID = 'FaceRecognitionIMG';
    const IMAGE_URL = req.body.input;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                        // "base64": IMAGE_BYTES_STRING
                    }
                }
            }
        ]
    });

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", options)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data from Clarifai API');
        }
        return response.json();
    })
    .then(data => {
        console.log("Response from Clarifai API: ", data);
        res.send(data);
    })
    .catch(err => {
        console.error("Error in CLARIFAI API handle: ", err);
        res.status(500).send({ error: 'Internal Server Error' }); // Send an error response to the client
    });
}




const handleImage = (req, res, db) => {
    let response = {
        result: false,
        message: ""
    }
    try {
        const { id } = req.body;
        if (id) {
            db('users').where('id', '=', id)
                .increment('entries', 1)
                .returning('*')
                .then(users => {
                    if (users.length) {
                        response.result = true;
                        response.user = users[0];
                        res.send(response);
                    } else {
                        response.message = "User not found"
                        res.status(400).json(response);
                    }
                })
                .catch(err => {
                    response.message = 'Unexpected error looking for user';
                    res.status(400).json(response)
                })
        } else {
            response.message = "Invalid params";
            res.send(response);
        }
    } catch (error) {
        console.error("signin error: ", error);
    }
}

module.exports = {
    handleImage: handleImage,
    handleClarifiAPI: handleClarifiAPI
}