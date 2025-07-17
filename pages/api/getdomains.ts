import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../backend/db"; // update if your DB file is elsewhere

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ message: "Missing user_id" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("user_id", userId)
      .query(`
        SELECT * FROM Domains WHERE user_id = @user_id;
      `);

    return res.status(200).json({ domains: result.recordset });
  } catch (err) {
    console.error("Error fetching domains:", err);
    return res.status(500).json({ message: "Failed to fetch domains" });
  }
}
