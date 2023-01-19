import { Spinner } from "components/icons/Spinner";
import { useState, useCallback } from "react";
import styles from "styles/Home.module.css";

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
      <section className={`${styles.content} space-y-4`}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="code"
            placeholder="Enter 6 digit code"
            className={styles.input}
            autoFocus={true}
            value={input}
            onInput={handleInput}
            autoComplete="off"
          />
          <button type="submit">{loading ? <Spinner /> : <>Login</>}</button>
        </form>
        <p className={styles.description}>
          <a onClick={() => onSetLoginState("promptEmail")} href="#">
            Back
          </a>
        </p>
      </section>
    </>
  );
};
