import { headers } from "../../../shared/headers/headers";

export const GetGymsHandler = async (event: { body: any }) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Test me",
    }),
    isBase64Encoded: false,
    headers,
  };
};
