import { getConnection } from "../../backend/db";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { type, name, surname, username, tel, email, password } = req.body;

  if (!type) {
    return res.status(400).json({ message: 'Request type (login or register) is required.' });
  }

  // --- LOGIN LOGIC ---
  if (type === 'login') {
    /* console.log('--- LOGIN ATTEMPT ---');
    console.log('Incoming username:', username);
    console.log('Incoming password length (NOT THE PASSWORD ITSELF):', password ? password.length : 'undefined'); */

    if (!username || !password) {
      /* console.log('Error: Missing username or password in login request.'); */
      return res.status(400).json({ message: 'Username and password are required for login.' });
    }

    try {
      const pool = await getConnection();

      const result = await pool
        .request()
        .input('username', username)
        .query('SELECT * FROM devinfo WHERE username = @username');

      const user = result.recordset[0];
      /* console.log('Database query result - User found:', !!user); */

      if (!user) {
       /*  console.log('Login failed: Username not found in DB for:', username); */
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      /* console.log('Bcrypt comparison result - Is password valid:', isPasswordValid); */

      if (!isPasswordValid) {
        /* console.log('Login failed: Password mismatch for user:', username); */
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      /* console.log('Login successful for user:', username); */
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          // You can add more user fields here if needed
        },
      });

    } catch (error) {
      console.error('Backend Login Caught Error:', error);
      return res.status(500).json({ message: 'Internal Server Error during login.' });
    }
  }

  // --- REGISTER LOGIC ---
  else if (type === 'register') {
    if (!username || !password || !name || !surname || !email) {
      return res.status(400).json({ message: 'All fields (name, surname, username, email, password) are required for registration.' });
    }

    try {
      const pool = await getConnection();

      const checkUserResult = await pool
        .request()
        .input('username', username)
        .input('email', email)
        .query('SELECT id FROM devinfo WHERE username = @username OR email = @email');

      if (checkUserResult.recordset.length > 0) {
        return res.status(409).json({ message: 'Username or email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertResult = await pool
        .request()
        .input('name', name)
        .input('surname', surname)
        .input('username', username)
        .input('tel', tel || null)
        .input('email', email)
        .input('password', hashedPassword)
        .query(`
          INSERT INTO devinfo (name, surname, username, tel, email, password)
          VALUES (@name, @surname, @username, @tel, @email, @password);
          SELECT SCOPE_IDENTITY() AS id;
        `);

      const newUserId = insertResult.recordset[0].id;

      res.status(201).json({
        message: 'Registration successful! You can now log in.',
        userId: newUserId,
        username: username,
        email: email
      });

    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('Cannot insert duplicate key row')) {
          return res.status(409).json({ message: 'Username or email already exists.' });
      }
      return res.status(500).json({ message: 'Internal Server Error during registration.' });
    }
  }
  
  return res.status(400).json({ message: 'Invalid request type.' });
}
