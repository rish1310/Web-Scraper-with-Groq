import React, { useState } from 'react';
import axios from 'axios';

// Function to convert the summary text into bullet points
const formatSummary = (summary) => {
  if (!summary) return '';
  return summary.split('\n').map((point, index) => (
    <li key={index} className="text-gray-600 text-sm">
      {point}
    </li>
  ));
};

function App() {
  const [domain, setDomain] = useState('');
  const [url, setUrl] = useState('');
  const [products, setProducts] = useState([]);
  const [productSitemapUrl, setProductSitemapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  console.log(process.env.REACT_APP_SERVER_URL);
  const fetchProductSitemapUrl = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getProductSitemap`, { domain });
      setProductSitemapUrl(response.data.productSitemapUrl);
    } catch (error) {
      setError('Error fetching product sitemap URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeSubmit = async (e) => {
    e.preventDefault();
    setScraping(true);
    setError(null);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/scrape`, { url });
      setProducts(response.data);
    } catch (error) {
      setError('Error scraping products. Please try again.');
    } finally {
      setScraping(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(productSitemapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide the message after 2 seconds
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Fetch Product Sitemap URL</h1>
        <form className="mb-6">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter Domain (e.g., https://example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={fetchProductSitemapUrl}
              className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Get Product Sitemap URL'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
        {productSitemapUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Product Sitemap URL:</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={productSitemapUrl}
                readOnly
                className="p-3 border border-gray-300 rounded-lg shadow-sm mb-2 flex-grow"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition ml-2"
              >
                Copy URL
              </button>
            </div>
            {copied && (
              <div className="flex items-center mt-2 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                URL copied to clipboard!
              </div>
            )}
          </div>
        )}
      </div>

      {productSitemapUrl && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Scrape Products</h1>
          <form onSubmit={handleScrapeSubmit}>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Enter Product Sitemap URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                disabled={scraping}
              >
                {scraping ? 'Scraping...' : 'Scrape Products'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-6 justify-center mt-8">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transform transition-transform hover:scale-105"
            >
              <div className="bg-white border rounded-lg overflow-hidden shadow-md">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                  <ul className="list-none pl-0 space-y-2">
                    {formatSummary(product.summary)}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          !scraping && <p className="text-gray-600 text-center w-full">No products available</p>
        )}
      </div>
    </div>
  );
}

export default App;
