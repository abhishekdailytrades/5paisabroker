const axios = require("axios");
require('dotenv').config()

let userSession = {};

let fivePaisaController = {
    login: (req, res) => {

        const state = "12345";
        const loginUrl = `${process.env.FIVEPAISA_BASE_URL}/WebVendorLogin/VLogin/Index?VendorKey=${process.env.FIVEPAISA_API_KEY}&ResponseURL=${process.env.CALLBACK_URL}&State=${state}`;

        console.log(loginUrl , 'loginUrlloginUrlloginUrlloginUrl' )
        return res.redirect(loginUrl);
    },

    callback: async (req, res) => {
        try {

            const { RequestToken, State } = req.query;

            if (!RequestToken) {
                return res.status(400).send("Login Failed");
            }

            console.log("RequestToken:", RequestToken);
            const response = await axios.post(
                `${process.env.FIVEPAISA_BASE_URL}/Session/GenerateToken`,
                {
                    Code: RequestToken,
                    AppKey: process.env.FIVEPAISA_API_KEY,
                    SecretKey: process.env.FIVEPAISA_SECRET_KEY
                }
            );

            const { AccessToken } = response.data;

            userSession[State] = {
                accessToken: AccessToken
            };

            console.log("AccessToken:", AccessToken);

            res.json({
                message: "5 Paisa Connected Successfully",
                accessToken: AccessToken,
                user: State
            });

        } catch (error) {
            console.log(error.response?.data || error.message);
            res.status(500).send("Error generating access token");
        }
    }
    ,

    placeOrder: async (req, res) => {
        try {

            const { userId } = req.body;

            const session = userSession[userId];

            if (!session) {
                return res.status(401).send("User not logged in");
            }

            const orderResponse = await axios.post(
                `${process.env.FIVEPAISA_BASE_URL}/Order/PlaceOrder`,
                {
                    Exchange: "N",
                    ExchangeType: "C",
                    ScripCode: 3045,
                    Qty: 1,
                    Price: 0,
                    OrderType: "M",
                    IsIntraday: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                }
            );

            res.json(orderResponse.data);

        } catch (error) {
            console.log(error.response?.data || error.message);
            res.status(500).send("Order Failed");
        }
    }
}


module.exports = fivePaisaController