import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// Function to fetch and parse XML
async function parseXml(xml) {
    try {
        const result = await parseStringPromise(xml);
        return result;
    } catch (err) {
        throw new Error(`Error parsing XML: ${err.message}`);
    }
}

// Function to ensure URL has https:// prefix
function ensureHttpsUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
}

// Function to get product sitemap URL from robots.txt
export const getProductSitemapUrl = async (domain) => {
    try {
        const formattedDomain = ensureHttpsUrl(domain);
        const robotsTxtUrl = `${formattedDomain}/robots.txt`;
        const robotsTxtResponse = await axios.get(robotsTxtUrl);
        const robotsTxt = robotsTxtResponse.data;

        // Extract the sitemap URL from robots.txt
        const sitemapMatch = robotsTxt.match(/Sitemap:\s*(\S+)/i);
        if (!sitemapMatch) throw new Error('Sitemap URL not found in robots.txt');

        const sitemapUrl = sitemapMatch[1];
        console.log('Sitemap URL:', sitemapUrl);

        // Fetch and parse the main sitemap
        const mainSitemapResponse = await axios.get(sitemapUrl);
        console.log('Main sitemap response:', mainSitemapResponse.data);

        const mainSitemap = await parseXml(mainSitemapResponse.data);
        console.log('Parsed main sitemap:', mainSitemap);

        const sitemaps = mainSitemap.sitemapindex.sitemap;
        console.log('Child sitemaps:', sitemaps);

        // Find the product sitemap URL
        const productSitemapUrl = sitemaps.find(sitemap => sitemap.loc[0].includes('product'))?.loc[0] || null;
        if (!productSitemapUrl) throw new Error('Product sitemap URL not found');
        console.log('Product sitemap URL:', productSitemapUrl);

        return productSitemapUrl;
    } catch (error) {
        console.error('Error fetching product sitemap URL:', error.message);
        throw new Error(`Error fetching product sitemap URL: ${error.message}`);
    }
};
