const attachCookie = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 24;

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    // Use 'lax' for better cross-origin compatibility while still being secure
    sameSite: "lax",
  };

  // In production, we might need to set the domain explicitly
  // For now, let's not set domain and see if that helps
  // if (process.env.NODE_ENV === "production") {
  //   cookieOptions.domain = ".onrender.com"; // This might cause issues
  // }

  console.log("🍪 Setting cookie with options:", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    expires: cookieOptions.expires,
    environment: process.env.NODE_ENV,
  });

  res.cookie("token", token, cookieOptions);

  // Log the actual Set-Cookie header that was set
  const setCookieHeader = res.getHeader("Set-Cookie");
  console.log("🍪 Set-Cookie header:", setCookieHeader);
};

export default attachCookie;
