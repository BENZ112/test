import { getConnection } from "../../backend/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domain_id, domain_name, origin_server, ssl_type, waf_engine_id } = req.body;

  if (!domain_id) {
    return res.status(400).json({ message: "Missing domain_id." });
  }
  if (!domain_name || !origin_server) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const pool = await getConnection();

    // Update domain info
    await pool
      .request()
      .input("domain_id", domain_id)
      .input("domain_name", domain_name)
      .input("origin_server", origin_server)
      .input("ssl_type", ssl_type || null)
      .input("waf_engine_id", waf_engine_id || null)
      .query(`
        UPDATE domains
        SET domain_name = @domain_name,
            origin_server = @origin_server,
            ssl_type = @ssl_type,
            waf_engine_id = @waf_engine_id,
            updated_at = GETDATE()
        WHERE domain_id = @domain_id;
      `);

    // Fetch updated domain
    const result = await pool
      .request()
      .input("domain_id", domain_id)
      .query("SELECT * FROM domains WHERE domain_id = @domain_id;");

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Domain not found." });
    }

    return res.status(200).json({ message: "Domain updated successfully.", domain: result.recordset[0] });
  } catch (error) {
    console.error("Error updating domain:", error);
    return res.status(500).json({ message: "Failed to update domain." });
  }
}
