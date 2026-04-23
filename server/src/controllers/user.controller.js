import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  const studentIdCardLocalPath = req.files?.studentIdCard[0]?.path;

  if (!studentIdCardLocalPath)
    throw new ApiError(400, "Student id card is required");

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
  const { email, username, password } = req.body;

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
    throw new ApiError(400, "Invalid credentials");
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
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out successfully"))
});

export { registerUser, userLogin, userLogout };
