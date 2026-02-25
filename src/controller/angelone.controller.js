require('dotenv').config()


let authController = {

    authCallback: async (req, res) => {
        try {
            console.log(`22222222222222`)
            const { auth_token, feed_token, state } = req.query;

            if (!auth_token) {
                return res.status(400).send("Login Failed");
            }

            const response = await axios.post(
                `${process.env.APP_BASE_URL}/rest/auth/angelbroking/jwt/v1/generateTokens`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                        "X-PrivateKey": API_KEY,
                        "Content-Type": "application/json"
                    }
                }

            );
            const tokens = response.data.data;


            console.log({
                message: "Angel Connected Successfully",
                tokens,
                feed_token,
                auth_token,
                state
            } , '0000000000000')
        

            res.status(200).json({
                message: "Angel Connected Successfully",
                tokens,
                feed_token,
                auth_token,
                state
            })

        } catch (err) {
            console.log(err.response?.data || err.message);
            res.status(500).send("Error connecting Angel");
        }
    },


    generateRefreshToken:  async (req, res) => {
        try {
            const { userId } = req.body;
            // const user = userStore[userId];

            const response = await axios.post(
                `${BASE_URL}/rest/auth/angelbroking/jwt/v1/generateTokens`,
                {
                    refreshToken: user.refreshToken
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-PrivateKey": API_KEY
                    }
                }
            );

            user.jwtToken = response.data.data.jwtToken;
            user.refreshToken = response.data.data.refreshToken;

            res.json(response.data);

        } catch (err) {
            res.status(500).json(err.response?.data || err.message);
        }
    },


    placeOrder: async (req, res) => {
        try {
            const { userId, orderData } = req.body;
            const user = userStore[userId];

            const response = await axios.post(
                `${BASE_URL}/rest/secure/angelbroking/order/v1/placeOrder`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${user.jwtToken}`,
                        "X-PrivateKey": API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            );

            res.json(response.data);

        } catch (err) {
            if (err.response?.status === 401) {
                return res.status(401).json({ message: "Token expired. Refresh required." });
            }

            res.status(500).json(err.response?.data || err.message);
        }
    }

}

module.exports = authController