import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function VelvetEdit() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility function to calculate discount
  const calculateDiscount = (price, strikePrice) => {
    if (price && strikePrice && price < strikePrice) {
      // Calculate discount percentage
      const discount = Math.round(((strikePrice - price) / strikePrice) * 100);
      return discount;
    }
    return null;
  };

  const id = "6916237ca39e6cb9b2115707"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`https://navdana.com/api/v1/product/category/${id}`);
        if (res.data.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data); 
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading products...</p>;
  }
  
  // Optional: If you want to show nothing when no products are fetched
  if (!products.length) {
    return <p className="text-center py-10">No latest launches found.</p>;
  }

  return (
    <section className="px-6 py-10 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-medium text-center mb-13">
          Velvet Edit
        </h2>

        <div className="max-w-8xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // Calculate discount for each product
            const discountPercentage = calculateDiscount(product.price, product.strikePrice);
            
            return (
              <div 
                key={product._id} 
                className="group bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
              >
                <Link
                  to={`/product/${product._id}`} 
                  className="relative w-full aspect-[3/4] overflow-hidden rounded-lg block"
                >
                  <LazyLoadImage
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt || product.name}
                    effect="blur"
                    width="100%"
                    height="auto"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    lazy="loading"
                  />
                  
                  {/* START: Discount Percentage Badge */}
                  {discountPercentage !== null && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                      {discountPercentage}% OFF
                    </div>
                  )}
                  {/* END: Discount Percentage Badge */}

                  {/* Bottom Right: Add to Bag */}
                  <div className="absolute bottom-2 right-2 bg-white text-gray-800 p-1 rounded-full shadow transition-opacity duration-300 group-hover:opacity-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>

                  {/* Hover Quick View */}
                  <div className="absolute bottom-2 left-2 right-2 bg-[#2C4A52] text-white text-center py-3 opacity-0 group-hover:opacity-100 transition rounded-[8px]">
                    Quick view
                  </div>
                </Link>

                {/* Description, Price, and Sizes */}
                <div className="pt-2 px-2 pb-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
                    {product.name}
                  </h3>

                  {/* START: Price with Strike Price */}
                  <div className="flex items-center space-x-2 mb-2">
                    {/* Discounted Price (Main Price) */}
                    <div className="text-sm font-semibold text-pink-600">
                      ₹{product.price}
                    </div>
                    {/* Strikethrough Price (Original Price) */}
                    {product.strikePrice && product.price < product.strikePrice && (
                      <div className="text-xs text-gray-400 line-through">
                        ₹{product.strikePrice}
                      </div>
                    )}
                  </div>
                  {/* END: Price with Strike Price */}

                  {/* Sizes as red boxes under price */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.variant
                      .filter(v => v.stock > 0)
                      .map((v, idx) => (
                        <span
                          key={idx}
                          className="bg-red-600 text-white px-3 py-1 rounded font-semibold text-xs sm:text-sm"
                        >
                          {v.size}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}