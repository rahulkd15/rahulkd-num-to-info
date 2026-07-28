export default async function handler(req, res) {
  // CORS Enable karne ke liye
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  // Professional line-by-line function
  const sendFormattedJson = (statusCode, data) => {
    return res.status(statusCode).send(JSON.stringify(data, null, 2));
  };

  const { number } = req.query;

  // Error jab number na dala jaye
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
      const results = Object.values(data.result);
      if (results.length === 0) throw new Error("No data found");

      // Logic: Sabse zyada info wala result (ya last wala) uthana
      let bestItem = results[0];
      let maxInfoCount = 0;

      for (const item of results) {
        let currentInfoCount = 0;
        for (const key in item) {
          if (item[key] !== null && item[key] !== "" && item[key] !== undefined) {
            currentInfoCount++;
          }
        }
        if (currentInfoCount >= maxInfoCount) {
          maxInfoCount = currentInfoCount;
          bestItem = item;
        }
      }

      // Address ko thik se todna
      const rawAddress = bestItem.address || "";
      const parts = rawAddress.split('!').filter(Boolean);

      // NAYA LOGIC: Agar value khali ya null hai, toh usko string "null" me convert kar do
      const getValidValue = (val) => {
        if (val === null || val === undefined || String(val).trim() === "") {
          return "null"; // Text wala "null" with quotes
        }
        return String(val);
      };

      // Response ka Format
      const finalResponse = {
        success: true,
        number: getValidValue(bestItem.num) !== "null" ? getValidValue(bestItem.num) : number,
        name: getValidValue(bestItem.name),
        father_name: getValidValue(bestItem.fname),
        alt_number: getValidValue(bestItem.alt),
        email: getValidValue(bestItem.email), // Yahan ab "null" aayega agar khali hoga
        aadhar: getValidValue(bestItem.aadhar),
        circle: getValidValue(bestItem.circle),
        state: parts.length > 1 ? parts[parts.length - 2] : "null",
        district: parts.length > 2 ? parts[parts.length - 3] : "null",
        "village/city": parts.length > 4 ? parts[1] : "null",
        landmark: parts.length > 4 ? parts[2] : "null",
        pincode: parts.length > 0 ? parts[parts.length - 1] : "null",
        full_address: parts.length > 0 ? parts.join(', ') : "null",
        developer: "RAHUL KD",
        telegram: "@DASJII_H4REE"
      };

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
