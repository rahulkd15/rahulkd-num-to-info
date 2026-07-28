export default async function handler(req, res) {
  // CORS enable karne ke liye (taki kisi bhi website se api call ho sake)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // URL se number nikalna (jaise: /api?number=9876543210)
  const { number } = req.query;

  // Agar number nahi dala toh aapka custom error response
  if (!number) {
    return res.status(400).json({
      success: false,
      message: "Number required",
      example: "/api?number=9876543210",
      developer: "RAHUL KD",
      telegram: "@DASJII_H4REE"
    });
  }

  try {
    // Original API ko call karna
    const apiUrl = `https://shuruuuuuuuuuuuu-num-info.vercel.app/apis/num_info_v1?key=HUNTERX&num=${number}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Agar original API se response 'true' aata hai
    if (data.status === true && data.result) {
      const formattedData = [];

      // Result object ko array me convert karke format karna
      for (const key in data.result) {
        const item = data.result[key];
        
        // Address ko '!' se split karke parts me divide karna
        const rawAddress = item.address || "";
        const parts = rawAddress.split('!').filter(Boolean); // Empty spaces ko remove karne ke liye filter

        // Address parts nikalna (Logic based on provided address format)
        const full_address = parts.join(', ');
        const pincode = parts.length > 0 ? parts[parts.length - 1] : "Not Found";
        const state = parts.length > 1 ? parts[parts.length - 2] : "Not Found";
        const district = parts.length > 2 ? parts[parts.length - 3] : "Not Found";
        const village_city = parts.length > 4 ? parts[1] : (parts.length > 0 ? parts[0] : "Not Found");
        const landmark = parts.length > 4 ? parts[2] : "Not Found";

        // Aapke format ke mutabiq object taiyar karna
        formattedData.push({
          number: item.num || number,
          name: item.name || "Not Found",
          father_name: item.fname || "Not Found",
          alt_number: item.alt || "Not Found",
          email: item.email || "Not Available",
          aadhar: item.aadhar || "Not Found",
          circle: item.circle || "Not Found",
          state: state,
          district: district,
          "village/city": village_city,
          landmark: landmark,
          pincode: pincode,
          full_address: full_address
        });
      }

      // Success Response
      return res.status(200).json({
        success: true,
        developer: "RAHUL KD",
        telegram: "@DASJII_H4REE",
        total_results: data.total_results,
        data: formattedData
      });

    } else {
      // Agar number ka data original API me na mile
      return res.status(404).json({
        success: false,
        message: "No details found for this number",
        developer: "RAHUL KD",
        telegram: "@DASJII_H4REE"
      });
    }

  } catch (error) {
    // Agar server ya fetch me koi error aaye
    return res.status(500).json({
      success: false,
      message: "Server Error, please try again later",
      error: error.message,
      developer: "RAHUL KD",
      telegram: "@DASJII_H4REE"
    });
  }
}
