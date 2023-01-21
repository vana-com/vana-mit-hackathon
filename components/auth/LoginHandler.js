import { useState, useEffect } from "react";
import { LoginEmailForm } from "components/auth/forms/LoginEmailForm";
import { LoginCodeForm } from "components/auth/forms/LoginCodeForm";
import { StartLogin } from "components/auth/forms/StartLogin";
import * as jose from "jose";
import { vanaApiPost, vanaApiGet } from "vanaApi";

/**
 * This component abstracts login. Feel free to take a look but you can just ignore it in this
 * hackathon
 */
export const LoginHandler = ({ children, setUser }) => {
  const [email, setEmail] = useState("");
  const [loginState, setLoginState] = useState("initial"); // initial, emailInput, codeInput, loggedIn
  const [loading, setLoading] = useState(false);

  const refreshUserWithTimeout = async () => {
    const refreshUser = async () => {
      const authToken = localStorage?.authToken ?? undefined;
      if (authToken) {
        const [exhibitsPromise, textToImagePromise, balancePromise] = [
          vanaApiGet("account/exhibits"),
          vanaApiGet("account/exhibits/text-to-image"),
          vanaApiGet("account/balance"),
        ];

        const [exhibitsResponse, textToImageResponse, balanceResponse] =
          await Promise.all([
            exhibitsPromise,
            textToImagePromise,
            balancePromise,
          ]);

        const newUser = {
          balance: balanceResponse?.balance ?? 0,
          exhibits: exhibitsResponse?.exhibits ?? [],
          textToImage: textToImageResponse?.urls ?? [],
        };

        setUser(newUser);
        setLoginState("loggedIn");
      }
    };
    await refreshUser();
    setTimeout(refreshUserWithTimeout, 60000);
  };

  // Refresh the user's details every minute
  useEffect(() => {
    readCachedAuthToken();
    return () => clearTimeout(refreshUserWithTimeout);
  }, []);

  /**
   * Reads a cached JWT token from LocalStorage, and updates the state
   * Checks for token expiry as well
   */
  const readCachedAuthToken = () => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("authToken");
      if (savedToken) {
        try {
          const claims = jose.decodeJwt(savedToken);
          if (claims && claims.exp) {
            const isExpired = Date.now() >= claims.exp * 1000;
            if (isExpired) {
              console.warn("Cached JWT is expired, logging user out.");
            } else {
              // Valid token still cached, let's get user details
              refreshUserWithTimeout();
              return;
            }
          }
          logOut();
        } catch (e) {
          console.error("Unable to decode auth token", e);
          logOut();
        }
      }
    }
  };

  const createLogin = async (email) => {
    setEmail(email);
    setLoading(true);

    try {
      await vanaApiPost("auth/create-login", {
        email,
      });
      setLoginState("codeInput");
    } catch (error) {
      console.error("Unable to create log in code", error);
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (code) => {
    try {
      setLoading(true);
      const { token } = await vanaApiPost("auth/login", {
        email,
        code,
      });

      localStorage.setItem("authToken", token);
      refreshUserWithTimeout();
    } catch (error) {
      console.error("Unable to log in", error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    localStorage.setItem("authToken", "");
    setLoginState("initial");
  };

  return (
    <>
      {loginState === "initial" && (
        <StartLogin onSetLoginState={setLoginState} />
      )}

      {loginState === "emailInput" && (
        <LoginEmailForm
          onGetCode={createLogin}
          onSetLoginState={setLoginState}
          loading={loading}
        />
      )}

      {loginState === "codeInput" && (
        <LoginCodeForm
          onLogin={logIn}
          loading={loading}
          onSetLoginState={setLoginState}
        />
      )}

      {loginState === "loggedIn" && children}
    </>
  );
};
