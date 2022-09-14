const axios = require("axios");

const HttpError = require("../models/http-error");

const getCoordsForAddress = async (address) => {
    const result = 
        await axios
                .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`);

    const data = result.data;

    if (!data || data.status === "ZERO_RESULTS") {
        throw new HttpError("Could not find address for given address", 422);
    }

    return result.data.results[0].geometry.location;
}

module.exports = getCoordsForAddress;