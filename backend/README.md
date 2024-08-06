# Product Scraper

This project allows users to fetch and scrape product data from a domain's product sitemap. The application consists of a React frontend and an Express backend that work together to find and parse the product sitemap from the provided domain. Then it extracts 5 products with their image, title and url. A small summary is generated using Groq's API with a simple prompt.

## Features

- Fetch product sitemap URL from `robots.txt`
- Parse and extract product information from the sitemap
- Display product information in a user-friendly UI
- Copy product sitemap URL to clipboard
- Scrap top 5 products from it

## Tech Stack

- Frontend: React, Axios, Tailwind CSS
- Backend: Node.js, Express, Axios, xml2js, Groq-sdk

## Prerequisites

- Node.js and npm installed on your machine
