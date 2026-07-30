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

    const records = data?.result?.result?.result?.result || [];

    // Sirf usi number ka data separate karne ke liye (Taki kisi aur ka data na aaye)
    const matchedRecords = records.filter(item => item.num === number);

    if (matchedRecords.length > 0) {
      const getValidValue = (val) => {
        if (val === null || val === undefined || String(val).trim() === "") {
          return "null"; 
        }
        return String(val).trim();
      };

      // Shuruwat ka Format
      const finalResponse = {
        success: true,
        message: "Records found successfully",
        total_records: matchedRecords.length // Ye batayega total kitne records mile
      };

      // Loop lagakar sabhi records ko record_1, record_2 banana
      matchedRecords.forEach((item, index) => {
        const rawAddress = item.address || "";
        const parts = rawAddress.split('!').map(p => p.trim()).filter(Boolean);

        finalResponse[`record_${index + 1}`] = {
          number: getValidValue(item.num) !== "null" ? getValidValue(item.num) : number,
          name: getValidValue(item.name),
          father_name: getValidValue(item.fname),
          alt_number: getValidValue(item.alt),
          aadhar: getValidValue(item.aadhar), 
          email: getValidValue(item.email),   // Email Aadhar ke niche
          circle: getValidValue(item.circle),
          state: parts.length > 1 ? parts[parts.length - 2] : "null",
          district: parts.length > 2 ? parts[parts.length - 3] : "null",
          "village/city": parts.length > 4 ? parts[1] : "null",
          landmark: parts.length > 4 ? parts[2] : "null",
          pincode: parts.length > 0 ? parts[parts.length - 1] : "null",
          full_address: parts.length > 0 ? parts.join(', ') : "null"
        };
      });

      // Saare records ke baad ekdum LAST me Developer details daalna
      finalResponse.developer = "RAHUL KD";
      finalResponse.telegram = "@DASJII_H4REE";

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
