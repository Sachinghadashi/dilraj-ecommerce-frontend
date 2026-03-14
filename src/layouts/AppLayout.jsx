import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingCart, LogIn, Store, Clock, User, Home, Search } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const AppLayout = () => {
    const { cartItems, subTotal } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const handleSearchChange = (e) => {
        const query = e.target.value;
        if (query) {
            if (location.pathname !== '/') {
                navigate(`/?search=${encodeURIComponent(query)}`);
            } else {
                setSearchParams({ search: query });
            }
        } else {
            if (location.pathname === '/') {
                setSearchParams({});
            } else {
                navigate('/');
            }
        }
    };

    const isAuthenticated = !!localStorage.getItem('token');
    const userName = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-16 md:pb-0 relative">
            
            {/* Top Navigation Bar - Sticky Desktop, Hidden on Mobile */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Area */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-brand-500 p-2 rounded-xl group-hover:bg-brand-600 transition">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none">Dilraj Kirana</h1>
                                <p className="text-xs font-semibold text-brand-600 tracking-wider uppercase mt-1">10 Min Delivery</p>
                            </div>
                        </Link>

                        {/* Centered Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8 relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Search className="h-5 w-5" />
                             </div>
                             <input 
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder-slate-400"
                                placeholder="Search for groceries, snacks, beverages..."
                             />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-6">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/orders" className="text-slate-600 font-medium hover:text-brand-600 transition flex items-center gap-2">
                                        <Clock size={18} /> Orders
                                    </Link>
                                    <div className="h-4 w-px bg-slate-300"></div>
                                    <div className="group relative">
                                        <button className="flex items-center gap-2 text-slate-700 font-bold hover:text-brand-600 transition">
                                            <User size={18} /> {userName?.split(' ')[0] || 'Profile'}
                                        </button>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 font-medium">Log Out</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="text-slate-700 font-bold hover:text-brand-600 transition">Login</Link>
                            )}

                            {/* Global Cart Button */}
                            <Link to="/cart" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all transform active:scale-95 shadow-md shadow-brand-500/20">
                                <div className="relative">
                                     <ShoppingCart size={20} />
                                     {cartItems.length > 0 && (
                                         <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-bounce">{cartItems.length}</span>
                                     )}
                                </div>
                                <div className="flex flex-col items-start leading-none gap-0.5">
                                    <span className="text-[10px] uppercase tracking-wider text-brand-100">My Cart</span>
                                    <span>₹{subTotal.toFixed(2)}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header - Visible only on small screens */}
            <header className="md:hidden bg-white px-4 py-3 sticky top-0 z-50 border-b border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-3">
                     <div>
                         <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">Dilraj Kirana</h1>
                         <p className="text-xs font-bold text-brand-600 flex items-center gap-1">⚡ 10 mins delivery</p>
                     </div>
                     <Link to="/login">
                         <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                             <User size={18} />
                         </div>
                     </Link>
                 </div>
                 <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                         <Search className="h-4 w-4" />
                      </div>
                      <input 
                         type="text"
                         value={searchQuery}
                         onChange={handleSearchChange}
                         className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-xs font-medium placeholder-slate-500"
                         placeholder="Search 'Milk'"
                      />
                 </div>
            </header>

            {/* Main Dynamic Content Box */}
            <main className="flex-1 w-full max-w-7xl mx-auto md:px-6 lg:px-8 pt-0 md:pt-6">
                 <Outlet />
            </main>

            {/* Mobile Bottom Navigation Bar (Blinkit Style) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 px-2 pb-safe">
                 <Link to="/" className={`flex flex-col items-center justify-center w-16 gap-1 ${location.pathname === '/' ? 'text-brand-600' : 'text-slate-400'}`}>
                     <Home size={22} className={location.pathname === '/' ? 'fill-brand-100' : ''}/>
                     <span className="text-[10px] font-bold">Home</span>
                 </Link>
                 
                 <Link to="/orders" className={`flex flex-col items-center justify-center w-16 gap-1 ${location.pathname === '/orders' ? 'text-brand-600' : 'text-slate-400'}`}>
                     <Clock size={22} />
                     <span className="text-[10px] font-bold">Orders</span>
                 </Link>
                 
                 <Link to="/cart" className="relative group -mt-6">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${cartItems.length > 0 ? 'bg-brand-600 text-white' : 'bg-slate-800 text-white'}`}>
                          <ShoppingCart size={24} />
                          {cartItems.length > 0 && (
                              <span className="absolute 1 top-0 right-0 bg-yellow-400 text-slate-900 border-2 border-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">{cartItems.length}</span>
                          )}
                     </div>
                 </Link>
            </nav>
        </div>
    );
};

export default AppLayout;
