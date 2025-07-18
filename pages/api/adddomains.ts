import { getConnection } from "../../backend/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = await getConnection();

  if (req.method === "POST") {
    const {
      user_id,        
      domain_name,
      waf_engine_id = null, 
      notes = null,
      registered_date = null,
      expiration_date = null,
    } = req.body;

    if (!user_id || !domain_name) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const result = await pool
        .request()
        .input("user_id", user_id)
        .input("domain_name", domain_name)
        .input("waf_engine_id", waf_engine_id)
        .input("notes", notes)
        .input("registered_date", registered_date)
        .input("expiration_date", expiration_date)
        .query(`
          INSERT INTO Domains (
            user_id, domain_name, waf_engine_id, notes, registered_date, expiration_date
          ) VALUES (
            @user_id, @domain_name, @waf_engine_id, @notes, @registered_date, @expiration_date
          );
        `);

      return res.status(200).json({ message: "Domain added successfully." });

    } catch (err) {
      console.error("Error adding domain:", err);
      return res.status(500).json({ message: "Failed to add domain." });
    }
  }
}
