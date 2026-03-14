import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { Plus, Minus, Clock, MapPin, Search, PackageSearch } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const categories = ['All', 'Groceries', 'Snacks', 'Dairy', 'Beverages', 'Personal Care', 'Household'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
       <div className="bg-white px-4 md:px-0">
          
          {/* Categories Navigation */}
          <div className="overflow-x-auto hide-scrollbar border-b border-slate-100 mb-6 py-4 px-2">
             <div className="flex gap-3 min-w-max">
                {categories.map(cat => (
                   <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all transform active:scale-95 ${
                         activeCategory === cat 
                           ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/30 border border-brand-400' 
                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                   >
                     {cat}
                   </button>
                ))}
             </div>
          </div>

          <div className="p-2 px-4 md:px-0 mb-4 flex justify-between items-center">
             <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                 {searchQuery 
                    ? <span>Search results for <span className="text-brand-600">"{searchQuery}"</span></span> 
                    : (activeCategory === 'All' ? 'Bestsellers' : activeCategory)
                 }
             </h2>
             <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredProducts.length} items</span>
          </div>
       </div>

       {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 pt-0">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm animate-pulse h-60"></div>
             ))}
          </div>
       ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pb-24 md:pb-6">
              {filteredProducts.length === 0 ? (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                       <PackageSearch className="w-16 h-16 text-slate-300 mb-4" />
                       <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                       <p className="text-slate-500 font-medium">Try searching for something else or clearing your filters.</p>
                  </div>
              ) : (
                  filteredProducts.map((product) => {
                      const cartItem = cartItems.find(item => item.product === product._id);
                      
                      return (
                          <div key={product._id} className="bg-white rounded-[24px] border border-slate-100/80 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 overflow-hidden flex flex-col group relative">
                              <Link to={`/product/${product._id}`} className="block relative aspect-square p-4 bg-slate-50/50 group-hover:bg-brand-50/30 transition-colors">
                                  <img 
                                      src={product.image || 'https://via.placeholder.com/300?text=No+Image'} 
                                      alt={product.productName}
                                      className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                      loading="lazy"
                                  />
                                  {product.mrp > product.price && (
                                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                      </div>
                                  )}
                              </Link>
                              
                              <div className="p-4 flex flex-col flex-1 pb-5">
                                  <Link to={`/product/${product._id}`}>
                                      <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight line-clamp-2 md:text-base">{product.productName}</h3>
                                      <p className="text-slate-400 text-xs font-semibold mb-3">{product.category}</p>
                                  </Link>
                                  
                                  <div className="mt-auto flex justify-between items-end gap-1">
                                      <div>
                                          <div className="font-black text-slate-800 text-lg leading-none tracking-tight">₹{product.price}</div>
                                          {product.mrp > product.price && <div className="text-slate-400 text-xs font-medium line-through mt-0.5">₹{product.mrp}</div>}
                                      </div>
                                      
                                      <div className="w-[84px] h-[36px] flex-shrink-0">
                                          {cartItem ? (
                                              <div className="flex items-center justify-between w-full h-full bg-brand-600 rounded-xl overflow-hidden shadow-md shadow-brand-500/20 text-white font-black px-1 border border-brand-500">
                                                  <button onClick={() => cartItem.quantity === 1 ? removeFromCart(product._id) : updateQuantity(product._id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-brand-700 transition active:scale-90 text-xl font-medium">
                                                      <Minus size={16} strokeWidth={3} />
                                                  </button>
                                                  <span className="text-sm cursor-default">{cartItem.quantity}</span>
                                                  <button onClick={() => updateQuantity(product._id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-brand-700 transition active:scale-90">
                                                      <Plus size={16} strokeWidth={3} />
                                                  </button>
                                              </div>
                                          ) : (
                                              <button 
                                                  onClick={() => addToCart(product)}
                                                  className="w-full h-full flex items-center justify-center bg-white border-2 border-brand-500 text-brand-600 font-bold rounded-xl hover:bg-brand-50 hover:border-brand-600 transition-all transform active:scale-95 shadow-sm uppercase tracking-wide text-xs"
                                              >
                                                  Add
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })
              )}
           </div>
       )}
    </div>
  );
};

export default Home;
