import { useEffect, useState } from 'react';
import { vanaPost } from 'vanaApi';

const meRegex = /\bme\b/i;

const Generator = ({ authToken, email }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [validPrompt, setValidPrompt] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await vanaPost(`jobs/text-to-image`, {
        prompt: prompt.replace(meRegex, '{target_token}'),
        email,
        exhibit_name: 'text-to-image',
        n_samples: 8,
        seed: -1
      }, authToken);
    } catch (error) {
      setErrorMessage('An error occurred while generating the image');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setValidPrompt(meRegex.test(prompt))
  }, [prompt])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt-input">Prompt:</label>
        <input
          id="prompt-input"
          type="text"
          placeholder="Me eating blue spaghetti"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <button type="submit" disabled={!validPrompt} >Generate image</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
    </div>
  );
};

export default Generator;