const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
const User = require('../Model/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-env';

//Data Display
const getAllUsers = async (req, res, next) => {
  try {
    const Users = await User.find().select('-password');
    if (!Users || Users.length === 0) {
      return res.status(404).json({ message: "No Users found" });
    }
    return res.status(200).json({ Users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

//Data Insert
const addUser = async (req, res, next) => {
  const { name, email, studentID, faculty, contactNumber, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Validate contact number: require exactly 10 digits
  const contactDigits = String(contactNumber || '').replace(/\D/g, '');
  if (contactDigits.length !== 10) {
    return res.status(400).json({ message: 'Contact number must be exactly 10 digits' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      studentID,
      faculty,
      contactNumber: contactDigits,
      password: hashedPassword,
      role: role || 'student',
    });
    await user.save();
    return res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add user" });
  }
}

//Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "No User found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}

//Update User Details
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, studentID, faculty, contactNumber, password, confirmPassword, role } = req.body;

  if ((password || confirmPassword) && password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const updatePayload = {};
  if (typeof name !== 'undefined') updatePayload.name = name;
  if (typeof email !== 'undefined') updatePayload.email = email;
  if (typeof studentID !== 'undefined') updatePayload.studentID = studentID;
  if (typeof faculty !== 'undefined') updatePayload.faculty = faculty;
  if (typeof role !== 'undefined') updatePayload.role = role;

  if (typeof contactNumber !== 'undefined') {
    const digits = String(contactNumber || '').replace(/\D/g, '');
    if (digits.length !== 10) {
      return res.status(400).json({ message: 'Contact number must be exactly 10 digits' });
    }
    updatePayload.contactNumber = digits;
  }

  if (password && confirmPassword) {
    updatePayload.password = await bcrypt.hash(password, 10);
  }

  try {
    const user = await User.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!user) {
      return res.status(404).json({ message: "Unable to Update User Details" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to update user" });
  }
}

//Delete User Details
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  let user;

  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  //not found
  if (!user) {
    return res.status(404).json({ message: "Unable to Delete User Details" });
  }
  return res.status(200).json({ message: "User Deleted Successfully" });
}

const loginUser = async (req, res) => {
  const { email, password, totp } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  console.log('[auth] Login attempt for:', normalizedEmail);

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const studentDomain = '@my.sliit.lk';
  const adminDomain = '@sliit.lk';

  const role = normalizedEmail.endsWith(studentDomain)
    ? 'student'
    : normalizedEmail.endsWith(adminDomain)
    ? 'admin'
    : null;

  if (!role) {
    return res.status(403).json({ message: "Unauthorized domain" });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    console.log('[auth] User lookup result:', !!user);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Support legacy users created before role field was enforced.
    if (!user.role) {
      user.role = 'student';
      await user.save();
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role for this email domain" });
    }

    const storedPassword = user.password || '';
    const isPasswordHashed = storedPassword.startsWith('$2');
    const isPasswordValid = isPasswordHashed
      ? await bcrypt.compare(password, storedPassword)
      : storedPassword === password;

    console.log('[auth] Password valid:', isPasswordValid, 'passwordHashed:', isPasswordHashed);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!isPasswordHashed && role === 'student') {
      // Upgrade legacy student passwords to bcrypt on successful login.
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    // If MFA is enabled for this user (or a secret already exists), require a valid TOTP code.
    const accountHasMfa = Boolean(user.mfaEnabled) || Boolean(user.mfaSecret);
    if (accountHasMfa) {
      if (!totp) {
        return res.status(200).json({ mfaRequired: true, message: 'MFA code required' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: String(totp).trim(),
        window: 1,
      });

      if (!verified) {
        return res.status(401).json({ message: 'Invalid MFA code' });
      }
    }

    const safeUser = user.toObject();
    delete safeUser.password;

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ message: "Login successful", token, user: safeUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Login failed" });
  }
};

// Generate MFA secret & QR code (stores temp secret until verified)
const generateMfa = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({ name: `LostFoundUM (${user.email})` });
    user.mfaTempSecret = secret.base32;
    await user.save();

    const otpauth = secret.otpauth_url;
    const qrData = await qrcode.toDataURL(otpauth);

    return res.status(200).json({ otpauth, qr: qrData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to generate MFA secret' });
  }
};

// Verify MFA setup using temp secret and enable
const verifyMfa = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.mfaTempSecret) return res.status(400).json({ message: 'No MFA setup in progress' });

    const verified = speakeasy.totp.verify({
      secret: user.mfaTempSecret,
      encoding: 'base32',
      token: String(token).trim(),
      window: 1,
    });

    if (!verified) return res.status(401).json({ message: 'Invalid MFA code' });

    user.mfaSecret = user.mfaTempSecret;
    user.mfaTempSecret = undefined;
    user.mfaEnabled = true;
    await user.save();

    return res.status(200).json({ message: 'MFA enabled' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to verify MFA' });
  }
};

// Disable MFA (requires current TOTP)
const disableMfa = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.mfaEnabled || !user.mfaSecret) return res.status(400).json({ message: 'MFA is not enabled' });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: String(token).trim(),
      window: 1,
    });

    if (!verified) return res.status(401).json({ message: 'Invalid MFA code' });

    user.mfaSecret = undefined;
    user.mfaEnabled = false;
    await user.save();

    return res.status(200).json({ message: 'MFA disabled' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to disable MFA' });
  }
};

const getSessionUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to validate session' });
  }
};

// Forgot password: generate a reset token and (for now) return it in response for testing
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Avoid revealing whether email exists
      return res.status(200).json({ message: 'If the email exists, a reset token was generated' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordToken = hashed;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // In production, send `token` via email. For now return token for manual testing.
    return res.status(200).json({ message: 'Reset token generated', token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to generate reset token' });
  }
};

// Reset password using token
const resetPassword = async (req, res) => {
  const { email, token, password, confirmPassword } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !token || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Email, token and new password are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'Invalid token or email' });

    const hashed = crypto.createHash('sha256').update(String(token)).digest('hex');
    if (!user.resetPasswordToken || user.resetPasswordToken !== hashed) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < Date.now()) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    user.password = password; // will be hashed by pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};

exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.addUser = addUser;
exports.getById = getById;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.generateMfa = generateMfa;
exports.verifyMfa = verifyMfa;
exports.disableMfa = disableMfa;
exports.getSessionUser = getSessionUser;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;