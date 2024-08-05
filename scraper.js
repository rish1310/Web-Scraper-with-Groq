import axios from 'axios';
import { parseString } from 'xml2js';
import cheerio from 'cheerio';
import { summarizeText } from './summarizer.js';

export async function scrapeProducts(url) {
    const products = await getSitemapProducts(url);
    const detailedProducts = await Promise.all(products.slice(0, 5).map(getProductDetails));
    return detailedProducts;
}

async function getSitemapProducts(url) {
    const response = await axios.get(url);
    const products = await parseXml(response.data);

    // Optional: Log products for debugging
    console.log('Products:', products);

    return products
        .map(product => {
            const image = product['image:image'] && product['image:image'].length > 0 ? product['image:image'][0] : {};
            const imageLoc = image['image:loc'] ? image['image:loc'][0] : '';
            const title = image['image:title'] ? image['image:title'][0] : '';

            return {
                url: product.loc ? product.loc[0] : '',
                image: imageLoc,
                title: title
            };
        })
        .filter(product => product.image); // Filter out products without image URLs
}

function parseXml(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) reject(err);
            else resolve(result.urlset.url);
        });
    });
}

async function getProductDetails(product) {
    try {
        const response = await axios.get(product.url);
        const $ = cheerio.load(response.data);

        // Extract text from <p> tags only
        const pageText = $('p').map((i, el) => $(el).text()).get().join(' ');

        // Summarize the extracted text
        const summary = await summarizeText(pageText);

        return { ...product, summary };
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        return { ...product, summary: 'Error fetching details' };
    }
}
