import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #005bea;
    --secondary: #00c6fb;
    --background: #f5f7fa;
    --text: #222;
    --gray: #888;
    --radius: 12px;
    --shadow: 0 4px 20px rgba(0,0,0,0.08);
    --font-main: 'Montserrat', Arial, Helvetica, sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100vh;
    height: 100%;
    background: var(--background);
    color: var(--text);
    font-family: var(--font-main);
    scroll-behavior: smooth;
  }

  body, #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
  }

  #root > * {
    flex-shrink: 0;
  }

  main {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
  }

  footer {
    flex-shrink: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  .container {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0 1.5rem;
  }

  .cta-btn {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    color: #fff;
    padding: 0.8rem 2.2rem;
    border-radius: var(--radius);
    font-size: 1.1rem;
    font-weight: bold;
    box-shadow: var(--shadow);
    transition: filter 0.2s;
    border: none;
    cursor: pointer;
    display: inline-block;
  }
  .cta-btn:hover {
    filter: brightness(1.1);
  }
`;

export default GlobalStyle;
