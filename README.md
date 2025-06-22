# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

<<<<<<< HEAD
export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======
## 🧪 Instruções de Uso e Instalação

Para rodar o projeto localmente:

1. Clone o repositório:
   bash
   git clone [https://github.com/pedroavv1914/repositorio.git](https://github.com/pedroavv1914/agencia-viagens)
   cd repositorio
   

2. Abra o arquivo index.html em um navegador ou utilize uma extensão como *Live Server* (VS Code) para melhor visualização.

> Não é necessário back-end ou instalação de dependências. O site é totalmente estático.

## ⚙ Descrição do Pipeline Configurado (CI/CD)

O projeto utiliza *GitHub Actions* para integração contínua. O pipeline está definido em .github/workflows/jekyll-docker.yml com os seguintes comportamentos:

- *Gatilhos*:
  - push e pull_request para a branch main.

- *Execução*:
  - Ação de checkout do repositório.
  - Build do site usando container Docker jekyll/builder:latest, garantindo que o site estático pode ser gerado corretamente via jekyll build.
>>>>>>> 8c1514d5468e344ef0c9e804acf45ee85c9691fd
