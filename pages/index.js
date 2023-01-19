import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import styles from "styles/Home.module.css";
import Generator from "components/Generator";
import { VanaLogo } from "components/icons/VanaLogo";
import { GithubIcon } from "components/icons/GithubIcon";
import { vanaGet } from "vanaApi";
import { LoggedIn } from "components/auth/LoggedIn";

/**
 * The entry point for the demo app
 * It contains the state management for the app flow.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Vana Boilerplate</title>
        <meta name="description" content="Generate portraits with Vana" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <VanaLogo />
        <a href="https://github.com/corsali/vana-portrait-demo" target="_blank">
          <GithubIcon />
        </a>
      </header>
      <main className={styles.main}>
        <LoggedIn>
          <TextToImage />
        </LoggedIn>
      </main>
    </>
  );
}

const TextToImage = () => {
  const authToken = localStorage.getItem("authToken");
  const [user, setUser] = useState({ balance: 0, exhibits: {} });

  const refreshUser = async () => {
    if (authToken) {
      const [exhibitsPromise, textToImagePromise, balancePromise] = [
        vanaGet("account/exhibits", {}, authToken),
        vanaGet("account/exhibits/text-to-image", {}, authToken),
        vanaGet("account/balance", {}, authToken),
      ];

      const [exhibitsResponse, textToImageResponse, balanceResponse] =
        await Promise.all([
          exhibitsPromise,
          textToImagePromise,
          balancePromise,
        ]);

      const newUser = {
        balance: balanceResponse.balance,
        exhibits: exhibitsResponse.exhibits,
        textToImage: textToImageResponse.urls,
      };
      setUser(newUser);
    }
  };

  // Refresh the user's details every minute
  useEffect(() => {
    const refreshUserWithTimeout = async () => {
      await refreshUser();
      setTimeout(refreshUserWithTimeout, 60000);
    };
    refreshUserWithTimeout();

    return () => clearTimeout(refreshUserWithTimeout);
  }, []);

  if (!user.exhibits.length) {
    // The user doesn't have any exhibits, they likely don't have a trained model
    return (
      <>
        <h1>Create your Vana Portrait</h1>
        <section className={`${styles.content} space-y-3`}>
          <p className="text-center">
            It seems we don't have a model for you yet.
          </p>
          <button
            type="submit"
            onClick={() =>
              window.open("https://portrait.vana.com/create", "_blank").focus()
            }
            className={styles.primaryButton}
          >
            Create Portrait on Vana
          </button>
        </section>
      </>
    );
  }

  return (
    <div>
      <div style={{ color: "black" }}>Credit balance: {user?.balance ?? 0}</div>

      <Generator authToken={authToken} />
      {user.textToImage?.map((image, i) => (
        <img src={image} key={i} />
      ))}
    </div>
  );
};
