import express from 'express';
import cors from 'cors';
import { scrapeProducts } from './scraper.js';
import { getProductSitemapUrl } from './xmlFetcher.js'; // Import the xmlFetcher function

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route to scrape products
app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    try {
        const products = await scrapeProducts(url);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New route to get product sitemap URL
app.post('/getProductSitemap', async (req, res) => {
    const { domain } = req.body;
    try {
        const productSitemapUrl = await getProductSitemapUrl(domain);
        res.json({ productSitemapUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
