import React, { useState } from "react";
import "../pages/popuplogin.css";
import Head from "next/head";

interface PopuploginProps {
  onClose: () => void;
}

const Popuplogin: React.FC<PopuploginProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMsg, setNotificationMsg] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [name, setName] = useState("");
  const [surname, setsurname] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const toggleActive = (state: boolean) => {
    setIsActive(state);
    setNotificationMsg("");
    setIsNotificationVisible(false);
    resetForm();

    if (state) {
      document.querySelector(".container")?.classList.add("active-register");
      document.querySelector(".container")?.classList.remove("active-login");
    } else {
      document.querySelector(".container")?.classList.add("active-login");
      document.querySelector(".container")?.classList.remove("active-register");
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setsurname("");
    setTel("");
    setEmail("");
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const SampleNavigation = () => {
    window.location.href = "./devrole";
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setNotificationMsg("Please enter username and password.");
      setIsNotificationVisible(true);
      return;
    }

    setIsNotificationVisible(true);
    setNotificationMsg("Logging in...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "login", username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setLoginSuccess(true);

        setTimeout(() => {
          setIsNotificationVisible(false);
          SampleNavigation();
        }, 2000);
      } else {
        setNotificationMsg(data.message || "Login failed.");
        setTimeout(() => setIsNotificationVisible(false), 3000);
      }
    } catch (error) {
      setNotificationMsg("Something went wrong.");
      setTimeout(() => setIsNotificationVisible(false), 3000);
    }
  };

  const handleregister = async () => {
    if (!username.trim() || !password.trim()) {
      setNotificationMsg("Please enter username and password.");
      setIsNotificationVisible(true);
      return;
    }

    setIsNotificationVisible(true);
    setNotificationMsg("Registering...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "register",
          name,
          surname,
          username,
          tel,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotificationMsg("Registration successful!");
        setTimeout(() => {
          setIsNotificationVisible(false);
          window.location.href = "/";
        }, 2000);
      } else {
        setNotificationMsg(data.message || "Registration failed.");
        setTimeout(() => setIsNotificationVisible(false), 3000);
      }
    } catch (error) {
      setNotificationMsg("Something went wrong.");
      setTimeout(() => setIsNotificationVisible(false), 3000);
    }
  };

  const checkDuplicate = async () => {
    const res = await fetch("/api/login-duplicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }),
    });

    const data = await res.json();
    setUsernameExists(data.usernameExists);
    setEmailExists(data.emailExists);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setNotificationMsg("Please enter your email.");
      setIsNotificationVisible(true);
      return;
    }

    setIsNotificationVisible(true);
    setNotificationMsg("Sending password reset email...");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotificationMsg("Password reset email sent!");
        setTimeout(() => {
          setIsNotificationVisible(false);
          setIsForgotPasswordActive(false);
        }, 2000);
      } else {
        setNotificationMsg(data.message || "Failed to send reset email.");
        setTimeout(() => setIsNotificationVisible(false), 3000);
      }
    } catch (error) {
      setNotificationMsg("Something went wrong.");
      setTimeout(() => setIsNotificationVisible(false), 3000);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setNotificationMsg("Please enter a valid email.");
      setIsNotificationVisible(true);
      return;
    }

    setIsNotificationVisible(true);
    setNotificationMsg("Sending password reset email...");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotificationMsg("Password reset email sent!");
        setTimeout(() => {
          setIsNotificationVisible(false);
          setIsForgotPasswordActive(false);
          onClose(); // Close the popup as well
        }, 2000);
      } else {
        setNotificationMsg(data.message || "Failed to send reset email.");
        setTimeout(() => setIsNotificationVisible(false), 3000);
      }
    } catch (error) {
      setNotificationMsg("Something went wrong.");
      setTimeout(() => setIsNotificationVisible(false), 3000);
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="popup-overlay" onClick={handleBackgroundClick}>
        <div className={`container ${isActive ? "active" : ""}`}>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close login popup"
          >
            ×
          </button>

          {isNotificationVisible && (
            <div
              className={`notification-box ${
                loginSuccess ? "success" : "error"
              }`}
            >
              <p>{notificationMsg}</p>
            </div>
          )}

          <div className="toggle-box">
            <div
              className={`toggle-panel toggle-left ${
                !isActive ? "active" : ""
              }`}
            >
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button
                className="btn register-btn"
                onClick={() => toggleActive(true)}
              >
                Register
              </button>
            </div>

            <div
              className={`toggle-panel toggle-right ${
                isActive ? "active" : ""
              }`}
            >
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button
                className="btn login-btn"
                onClick={() => toggleActive(false)}
              >
                Login
              </button>
            </div>
          </div>

          <div className={`form-box login ${!isActive ? "active" : ""}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <div className="forget-link">
                <a
                  href="#"
                  onClick={() => {
                    setIsForgotPasswordActive(true);
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="btn">
                Login
              </button>

              <p>Or login with social platforms</p>

              <div className="social-icons">
                <a href="#">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-facebook-circle"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-github"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-linkedin"></i>
                </a>
              </div>

            </form>
          </div>

          <div className={`form-box register ${isActive ? "active" : ""}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleregister();
              }}
            >
              <h1>Registration</h1>
              <section>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Last name"
                    value={surname}
                    onChange={(e) => setsurname(e.target.value)}
                    required
                  />
                  <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      checkDuplicate();
                    }}
                    required
                  />
                  {usernameExists && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      Username already exists
                    </p>
                  )}
                  <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                  <input
                    type="tel"
                    placeholder="Tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    onBlur={checkDuplicate}
                    required
                  />
                  <i className="bx bxs-phone"></i>
                </div>

                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      checkDuplicate();
                    }}
                    required
                  />
                  {emailExists && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      Email already registered
                    </p>
                  )}
                  <i className="bx bxs-envelope"></i>
                </div>

                <div className="input-box">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i className="bx bxs-lock-alt"></i>
                </div>
              </section>

              <div className="Register">
                <button type="submit" className="btn">
                  Register
                </button>
              </div>

              <div className="social-icons">
                <i className="bx bxl-google"></i>
                <i className="bx bxl-facebook-circle"></i>
                <i className="bx bxl-github"></i>
                <i className="bx bxl-linkedin"></i>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Popuplogin;
