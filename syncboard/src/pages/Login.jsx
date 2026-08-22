import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);

    // Backend authentication can be added later
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <h1 className="logo">SyncBoard</h1>

        {/* Heading */}
        <h2>Welcome back</h2>

        <p className="subtitle">
          Sign in to your account and continue collaborating.
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember + Forgot Password */}
          <div className="login-options">

            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span>Remember me</span>
            </label>

            <a href="/forgot-password">
              Forgot Password?
            </a>

          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        {/* Register */}
        <p className="register-text">
          Don't have an account?{" "}
          <a href="/register">Create Account</a>
        </p>

      </div>
    </div>
  );
}

export default Login;