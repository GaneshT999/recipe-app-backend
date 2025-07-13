const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  // MODIFIED: Destructure email from req.body
  const { username, email, password, role } = req.body;

  try {
    // MODIFIED: Check if username OR email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // Provide a more specific error message
      const message = existingUser.username === username 
        ? 'Username already exists' 
        : 'Email is already in use';
      return res.status(409).json({ message });
    }

    const hashed = await bcrypt.hash(password, 10);
    // MODIFIED: Include email when creating the new user
    const user = new User({ username, email, password: hashed, role });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // No changes needed here, login remains the same
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, username: user.username });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};