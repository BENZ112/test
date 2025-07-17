import { getConnection } from "../../backend/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, surname, username, tel, email, password } = req.body;

  if (!name || !surname || !username || !tel || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await getConnection();

    const checkResult = await pool.request()
      .input("username", username)
      .input("email", email)
      .query(`
        SELECT username, email FROM devinfo
        WHERE username = @username OR email = @email
      `);

    const exists = checkResult.recordset[0];

    if (exists) {
      const usernameExists = exists.username === username;
      const emailExists = exists.email === email;

      await new Promise(resolve => setTimeout(resolve, 2000));

      let message = '';
      if (usernameExists && emailExists) {
        message = 'Username and Email already exist';
      } else if (usernameExists) {
        message = 'Username already exists';
      } else if (emailExists) {
        message = 'Email already exists';
      }

      return res.status(409).json({
        message,
        usernameExists,
        emailExists,
      });
    }

    await pool.request()
      .input("name", name)
      .input("surname", surname)
      .input("username", username)
      .input("tel", tel)
      .input("email", email)
      .input("password", password)
      .query(`
        INSERT INTO devinfo (name, surname, username, tel, email, password)
        OUTPUT INSERTED.id
        VALUES (@name, @surname, @username, @tel, @email, @password)
      `);

    return res.status(200).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}