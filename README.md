# 🌍 Palazzo Travel

O Palazzo Agência de Viagens foi criado com um objetivo claro: tornar o processo de marcar viagens fácil, especialmente para pessoas com pouca familiaridade com tecnologia.

## 🎯 Objetivo do Site

Este é um site de viagens intuitivo criado para ajudar usuários a explorar e escolher seus próximos destinos com facilidade e praticidade. A plataforma oferece uma experiência fluida e agradável, com foco em usabilidade e design acessível, permitindo que qualquer pessoa diferentes idades de viajantes ocasionais a aventureiros experientes e encontre lugares incríveis para visitar.

## 💻 Tecnologias Utilizadas

- *HTML5*
- *CSS3*
- *Bootstrap 5*
- *GitHub Actions*

O site é totalmente *responsivo*, adaptando-se a diferentes tamanhos de tela e proporcionando uma boa experiência tanto em dispositivos móveis quanto em desktops.

## 🔗 URL de Acesso

Site hospedado via Vercel:  
👉 [https://agencia-viagens-iota.vercel.app](https://agencia-viagens-iota.vercel.app)

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

## 👥 Integrantes do Grupo

- *Paulo Henrique Nobre Cagnoto* — RA: 2404453  
- *João Pedro Medeiros de Castro* — RA: 2404751  
- *Murilo Batista da Silva* — RA: 2401604  
- *Pedro Oliveira Ribeiro dos Santos* — RA: 2401723  
