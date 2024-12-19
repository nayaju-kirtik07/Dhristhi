const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.singUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      hashPassword: bcrypt.hashSync(req.body.password, 10),
      c_hashPassword: bcrypt.hashSync(req.body.c_password, 10),
      isAdmin: false,
    });

    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (bcrypt.compareSync(req.body.password, user.hashPassword)) {
      const accessToken = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.AccessToken,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.RefreshToken,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

exports.adminSignUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    if (req.body.password !== req.body.c_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      hashPassword: bcrypt.hashSync(req.body.password, 10),
      c_hashPassword: bcrypt.hashSync(req.body.c_password, 10),
      isAdmin: true,
    });

    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in admin registration",
      error: error.message,
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (bcrypt.compareSync(req.body.password, user.hashPassword)) {
      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.AccessToken,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        message: "Admin login successful",
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in admin login",
      error: error.message,
    });
  }
};

// Profile controllers
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-hashPassword -c_hashPassword"
    );
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
      },
      { new: true }
    ).select("-hashPassword -c_hashPassword");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Admin controllers
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-hashPassword -c_hashPassword");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
