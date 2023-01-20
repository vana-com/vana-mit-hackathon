import { useState, useCallback } from "react";
import { ArrowIcon } from "components/icons/ArrowIcon";

export const PromptEmail = ({ onGetCode, onSetLoginState, loading }) => {
  const [input, setInput] = useState("");

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onGetCode(input);
    },
    [onGetCode, input]
  );

  return (
    <>
      <h1>Login with Vana</h1>
      <section className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="field input"
            autoFocus={true}
            disabled={loading}
            value={input}
            onInput={handleInput}
          />
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? (
              "Sending…"
            ) : (
              <>
                Get code <ArrowIcon />
              </>
            )}
          </button>
        </form>
        <p className="description">
          <a onClick={() => onSetLoginState("initial")} href="#">
            Back
          </a>
        </p>
      </section>
    </>
  );
};
