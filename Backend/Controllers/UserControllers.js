const bcrypt = require('bcrypt');
const User = require('../Model/UserModel');

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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      studentID,
      faculty,
      contactNumber,
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
  if (typeof contactNumber !== 'undefined') updatePayload.contactNumber = contactNumber;
  if (typeof role !== 'undefined') updatePayload.role = role;

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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const studentDomain = '@my.sliit.lk';
  const adminDomain = '@sliit.lk';

  const role = email.endsWith(studentDomain)
    ? 'student'
    : email.endsWith(adminDomain)
    ? 'admin'
    : null;

  if (!role) {
    return res.status(403).json({ message: "Unauthorized domain" });
  }

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const storedPassword = user.password || '';
    const isPasswordHashed = storedPassword.startsWith('$2');
    const isPasswordValid = isPasswordHashed
      ? await bcrypt.compare(password, storedPassword)
      : storedPassword === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!isPasswordHashed && role === 'student') {
      // Upgrade legacy student passwords to bcrypt on successful login.
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Login failed" });
  }
};

exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.addUser = addUser;
exports.getById = getById;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;