export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json'); // Format ko text ki jagah JSON banane ke liye

  // Line-by-line (Professional) print karne ke liye custom function
  const sendFormattedJson = (statusCode, data) => {
    return res.status(statusCode).send(JSON.stringify(data, null, 2));
  };

  const { number } = req.query;

  // Error Format
  if (!number) {
    return sendFormattedJson(400, {
      success: false,
      message: "Number required",
      example: "/api?number=9876543210",
      developer: "RAHUL KD",
      telegram: "@DASJII_H4REE"
    });
  }

  try {
    const apiUrl = `https://shuruuuuuuuuuuuu-num-info.vercel.app/apis/num_info_v1?key=HUNTERX&num=${number}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === true && data.result) {
      
      // Original API chahe duplicate result de, hum sirf pehla (First) result nikalenge
      const keys = Object.keys(data.result);
      if (keys.length === 0) throw new Error("No data found");
      
      const item = data.result[keys[0]]; // Sirf 1 result

      // Address Parsing
      const rawAddress = item.address || "";
      const parts = rawAddress.split('!').filter(Boolean); // '!' ko remove karke words alag karna

      const full_address = parts.join(', ');
      const pincode = parts.length > 0 ? parts[parts.length - 1] : "";
      const state = parts.length > 1 ? parts[parts.length - 2] : "";
      const district = parts.length > 2 ? parts[parts.length - 3] : "";
      const village_city = parts.length > 4 ? parts[1] : "";
      const landmark = parts.length > 4 ? parts[2] : "";

      // Exact Wahi Format Jo Aapko Chahiye Tha (Without Array)
      const finalResponse = {
        success: true,
        developer: "RAHUL KD",
        telegram: "@DASJII_H4REE",
        number: item.num || number,
        name: item.name || "",
        father_name: item.fname || "",
        alt_number: item.alt || "",
        email: item.email || "",
        aadhar: item.aadhar || "",
        circle: item.circle || "",
        state: state,
        district: district,
        "village/city": village_city,
        landmark: landmark,
        pincode: pincode,
        full_address: full_address
      };

      // Success Response Print karega (Line by line)
      return sendFormattedJson(200, finalResponse);

    } else {
      return sendFormattedJson(404, {
        success: false,
        message: "No details found for this number",
        developer: "RAHUL KD",
        telegram: "@DASJII_H4REE"
      });
    }

  } catch (error) {
    return sendFormattedJson(500, {
      success: false,
      message: "Server Error, please try again",
      developer: "RAHUL KD",
      telegram: "@DASJII_H4REE"
    });
  }
}
