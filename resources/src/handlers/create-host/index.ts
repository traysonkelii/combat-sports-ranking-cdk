export const CreateHostHandler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "okay" }),
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",

      // 👇 allow CORS for all origins
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Credentials": "true", // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
    },
  };
  // try {
  //   console.log(event);
  //   const table = process.env.MAIN_TABLE || "CombatSportsRanking";
  //   const region = process.env.REGION || "us-east-1";
  //   console.log("What is the table: " + table);
  //   console.log("What is the region: " + region);

  //   const response = {
  //     statusCode: 200,
  //     body: "success",
  //   };

  //   return JSON.stringify(response);
  // } catch (error) {
  //   console.log("da heck: " + error);
  //   throw new Error("da heck: " + error);
  // }
};
