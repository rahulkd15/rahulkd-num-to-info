export default async function handler(req, res) {
  // CORS Enable
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  const sendFormattedJson = (statusCode, data) => {
    return res.status(statusCode).send(JSON.stringify(data, null, 2));
  };

  const { number } = req.query;

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
    const apiUrl = `https://api-pro-v2.vercel.app/key/576f1e132326cee10f887ec38ccae1/get_data?number=${number}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Naye API ka format bhot andar tak hai (result ke andar result)
    // Safely array nikalne ka logic:
    const records = data?.result?.result?.result?.result || [];

    if (records.length > 0) {
      
      // SMART FILTER: Sirf wahi record lo jiska 'num' exact search number se match kare
      // Taki kisi aur ka data (jisme ye number alternate diya ho) filter ho jaye
      const matchedRecords = records.filter(item => item.num === number);
      
      // Agar exact match mile toh unme se LAST wala uthao, nahi toh default list ka LAST uthao
      let bestItem = matchedRecords.length > 0 
        ? matchedRecords[matchedRecords.length - 1] 
        : records[records.length - 1];

      // Address Parsing
      const rawAddress = bestItem.address || "";
      const parts = rawAddress.split('!').map(p => p.trim()).filter(Boolean); // Extra spaces hata ke filter karna

      // Value "null" (Text) me set karne ka logic
      const getValidValue = (val) => {
        if (val === null || val === undefined || String(val).trim() === "") {
          return "null"; 
        }
        return String(val).trim();
      };

      // Response ka wahi same Professional Format
      const finalResponse = {
        success: true,
        message: "Record found successfully",
        number: getValidValue(bestItem.num) !== "null" ? getValidValue(bestItem.num) : number,
        name: getValidValue(bestItem.name),
        father_name: getValidValue(bestItem.fname),
        alt_number: getValidValue(bestItem.alt),
        aadhar: getValidValue(bestItem.aadhar), 
        email: getValidValue(bestItem.email),   // Email Aadhar ke just niche
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
      // Agar record na mile
      return sendFormattedJson(404, {
        success: false,
        message: "No record found",
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
