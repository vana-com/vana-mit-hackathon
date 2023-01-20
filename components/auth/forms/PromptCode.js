import { useState, useCallback } from "react";

export const PromptCode = ({ onLogin, onSetLoginState, loading }) => {
  const [input, setInput] = useState("");

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onLogin(input);
    },
    [onLogin, input]
  );

  return (
    <>
      <h1>Enter Verification Code</h1>
      <section className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="code"
            placeholder="Enter 6 digit code"
            className="field input"
            autoFocus={true}
            value={input}
            onInput={handleInput}
            autoComplete="off"
          />
          <button type="submit">{loading ? "Sending…" : "Login"}</button>
        </form>
        <p className="description">
          <a onClick={() => onSetLoginState("promptEmail")} href="#">
            Back
          </a>
        </p>
      </section>
    </>
  );
};
