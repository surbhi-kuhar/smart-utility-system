const axios = require("axios");

module.exports.getDistance = async (req, res) => {
  console.log("inside distance finding controller");
  const { origins, destinations } = req.query;
  console.log(origins);
  console.log(destinations);
  const apiKey =
    "F49RqrisG9HgUXfBMiedJLbXaz7JzfLrPHvbKaQABTPv3CAXLg6Y2ESEgu13q0Lj";
  const url = `https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};
