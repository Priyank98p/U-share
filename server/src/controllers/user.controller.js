import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const generateRefreshTokenAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating the tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullname, department, year } = req.body;

  if (
    [username, email, password, fullname, department, year].some(
      (field) => field === undefined || field?.toString().trim() === "",
    )
  )
    throw new ApiError(400, "All field are strictly required");

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser)
    throw new ApiError(
      409,
      "A user with this email or username already exists",
    );

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const studentIdCardLocalPath = req.files?.studentIdCard[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  if (!studentIdCardLocalPath)
    throw new ApiError(400, "Student id card is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const studentIdCardCloudinary = await uploadOnCloudinary(
    studentIdCardLocalPath,
  );

  if (!studentIdCardCloudinary)
    throw new ApiError(400, "Failed to upload Student ID card");

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    department,
    year,
    studentIdCard: studentIdCardCloudinary.url,
    avatar: avatar.url
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!userCreated)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userCreated,
        "User registered successfully. Awaiting admin verification.",
      ),
    );
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, username, password, isAdminLogin } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordCorrectOrNot = await user.isPasswordCorrect(password);
  if (!isPasswordCorrectOrNot) {
    throw new ApiError(400, "Wrong credentials");
  }

  if (isAdminLogin && user.role !== "admin") {
    throw new ApiError(403, "Access denied. You are not an admin.");
  }

  const { refreshToken, accessToken } =
    await generateRefreshTokenAndAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User login successfull",
      ),
    );
});

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } =
    await generateRefreshTokenAndAccessToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully",
      ),
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req?.file?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  // Delete old avatar from Cloudinary before uploading new one
  const currentUser = await User.findById(req.user._id);
  if (currentUser?.avatar && currentUser.avatar.includes("cloudinary.com")) {
    await deleteFromCloudinary(currentUser.avatar);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) throw new ApiError(400, "Error while updating avatar");

  const user = await User.findByIdAndUpdate(
    req?.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isWished = user.wishlist.includes(itemId);
  
  if (isWished) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== itemId);
  } else {
    user.wishlist.push(itemId);
  }

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200, 
      { isWished: !isWished, wishlist: user.wishlist }, 
      isWished ? "Item removed from wishlist" : "Item added to wishlist"
    )
  );
});

const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user.wishlist, "Wishlist fetched successfully")
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, department, year } = req.body;
  
  const updateFields = {};
  if (fullname) updateFields.fullname = fullname.trim();
  if (department) updateFields.department = department.trim();
  if (year) updateFields.year = Number(year);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

const updateStudentIdCard = asyncHandler(async (req, res) => {
  const localPath = req?.file?.path;
  if (!localPath) throw new ApiError(400, "Student ID card image is required");

  // Delete old ID card from Cloudinary
  const currentUser = await User.findById(req.user._id);
  if (currentUser?.studentIdCard && currentUser.studentIdCard.includes("cloudinary.com")) {
    await deleteFromCloudinary(currentUser.studentIdCard);
  }

  const uploaded = await uploadOnCloudinary(localPath);
  if (!uploaded?.url) throw new ApiError(400, "Failed to upload student ID card");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { studentIdCard: uploaded.url } },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "Student ID card updated successfully"));
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const { default: mongoose } = await import("mongoose");
  const Booking = mongoose.model("Booking");
  const Item = mongoose.model("Item");

  const userId = req.user._id;

  const activeRentals = await Booking.countDocuments({
    borrowerId: userId,
    status: { $in: ["approved", "ongoing"] }
  });

  const earningsAgg = await Booking.aggregate([
    { $match: { ownerId: userId, status: { $in: ["approved", "ongoing", "returned"] } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

  const pendingRequests = await Booking.countDocuments({
    ownerId: userId,
    status: "pending"
  });

  const user = await User.findById(userId).select("rating totalReviews");

  const recentBookings = await Booking.find({
    $or: [{ borrowerId: userId }, { ownerId: userId }]
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("itemId", "title images category")
    .populate("borrowerId", "fullname avatar")
    .populate("ownerId", "fullname avatar");

  const myItems = await Item.find({ ownerId: userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(3);

  return res.status(200).json(new ApiResponse(200, {
    stats: {
      activeRentals,
      totalEarnings,
      pendingRequests,
      averageRating: user?.rating || 0,
      totalReviews: user?.totalReviews || 0,
    },
    recentBookings,
    topItems: myItems,
  }, "Dashboard stats fetched successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Please provide an email address");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Use frontend URL from env or fallback to localhost
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "U-Share Password Reset Token",
      message,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your U-Share account. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>This link will expire in 10 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json(
      new ApiResponse(200, {}, "Password reset link sent to your email.")
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("EMAIL_ERROR:", error);
    throw new ApiError(500, "Email could not be sent. Please try again later.");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  import("crypto").then(async (crypto) => {
    const resetPasswordToken = crypto.default
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired password reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
  });
});

export {
  registerUser,
  userLogin,
  userLogout,
  refreshAccessToken,
  updateAvatar,
  toggleWishlist,
  getWishlist,
  getCurrentUser,
  updateProfile,
  updateStudentIdCard,
  getDashboardStats,
  forgotPassword,
  resetPassword,
};
