# Markdown &rarr; Atlassian Markup

## Run via Docker

    docker build -t atlassian-markdown .
    docker run --rm -p 8080:80 atlassian-markdown

Then, open <http://localhost:8080>.

## Run Natively

    npm install
    npm run build
    npm run preview

Open the displayed link.

## With HMR (for development)

    npm install
    npm run dev
