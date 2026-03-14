import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle2, ShoppingBag, Plus, Minus, ArrowRight, Home, MapPin } from 'lucide-react';
import api from '../api/api';

const Cart = () => {
  const { cartItems, subTotal, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  
  // Pull from local storage to permanently sync address across sessions and orders
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
      const savedAddress = localStorage.getItem('dilraj_delivery_address');
      return savedAddress ? JSON.parse(savedAddress) : {
          addressLine1: 'Flat 40B, Sunrise Apartments',
          area: 'Bandra West',
          city: 'Mumbai',
          pincode: '400050',
          contactNumber: '9876543210'
      };
  });
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);

  const handleSaveAddress = () => {
      setDeliveryAddress(tempAddress);
      localStorage.setItem('dilraj_delivery_address', JSON.stringify(tempAddress));
      setIsEditingAddress(false);
  };

  const finalTotal = subTotal + 15; // + ₹15 Delivery Fee mockup

  const handleCheckout = async () => {
     setLoading(true);
     try {
       const token = localStorage.getItem('token');
       if (!token) {
           alert("Please login to place an order");
           navigate('/login');
           return;
       }
       
       const { data } = await api.post('/orders', {
           products: cartItems,
           deliveryAddress,
           paymentMethod: 'Cash On Delivery',
           deliveryFee: 10,
           handlingFee: 5
       });
       
       setSuccess({
           orderId: data.data.orderId,
           total: finalTotal
       });
       clearCart();
     } catch (error) {
       console.error("Checkout failed:", error);
       alert(error.response?.data?.message || "Failed to place order. Check product stock.");
     } finally {
       setLoading(false);
     }
  };

  if (success) {
      return (
         <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in-up">
             <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mb-6 border-8 border-brand-50 relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-400 opacity-20 animate-pulse"></div>
                 <CheckCircle2 className="w-12 h-12 text-brand-600 relative z-10" />
             </div>
             <h2 className="text-3xl font-black text-slate-800 mb-2">Order Confirmed!</h2>
             <p className="text-slate-500 font-medium mb-8 text-center max-w-sm">We've received your order and are packing it up right now. Get ready for 10-min magic!</p>
             
             <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-sm shadow-xl shadow-brand-900/5 mb-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Order ID</p>
                  <p className="font-mono font-bold text-slate-800 text-lg">{success.orderId}</p>
             </div>

             <div className="flex gap-4 w-full max-w-sm">
                 <Link to="/orders" className="flex-1 bg-white border border-slate-300 text-slate-700 py-3.5 rounded-2xl font-bold text-center hover:bg-slate-50 transition">Track Order</Link>
                 <Link to="/" className="flex-1 bg-brand-600 text-white py-3.5 rounded-2xl font-bold text-center shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition">Shop More</Link>
             </div>
         </div>
      );
  }

  if (cartItems.length === 0) {
      return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
              <img src="/vite.svg" className="w-32 h-32 opacity-20 grayscale brightness-0 mb-6 grayscale" alt="Empty Cart" />
              <h2 className="text-2xl font-black text-slate-800 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 font-medium mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/" className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all">Start Shopping</Link>
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in-up">
        {/* Left Column - Cart Details */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Delivery Banner */}
            <div className="bg-white rounded-3xl p-5 border border-brand-100 shadow-sm flex items-center gap-4 bg-gradient-to-r from-white to-brand-50/30 relative overflow-hidden">
                <div className="w-2 h-full bg-brand-500 absolute left-0 top-0"></div>
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-black text-slate-800 text-lg">Delivery in 10 minutes</h3>
                    <p className="text-sm font-medium text-slate-500">Your order will be prioritized and assigned to a rider.</p>
                </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col pt-3">
                <h3 className="font-extrabold text-slate-800 px-6 pb-3 border-b border-slate-50 text-xl">Review Items</h3>
                <div className="p-2 sm:p-4">
                    {cartItems.map(item => (
                        <div key={item.product} className="flex gap-4 p-3 bg-white hover:bg-slate-50 rounded-2xl transition">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shrink-0 p-2 overflow-hidden">
                                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.productName} className="object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col py-1">
                                <h4 className="font-bold text-slate-800 leading-tight sm:text-lg mb-1">{item.productName}</h4>
                                <div className="font-black text-slate-900 mt-auto">₹{item.price}</div>
                            </div>
                            <div className="flex flex-col items-end justify-between py-1 shrink-0">
                                <div className="font-black text-lg text-brand-600">₹{item.total}</div>
                                <div className="flex items-center gap-0 bg-brand-50 border border-brand-200 rounded-lg p-0.5 text-brand-700 font-black shrink-0">
                                    <button onClick={() => item.quantity === 1 ? removeFromCart(item.product) : updateQuantity(item.product, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand-200 rounded-md transition active:scale-95"><Minus size={14}/></button>
                                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand-200 rounded-md transition active:scale-95"><Plus size={14}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Right Column - Bill Summary & Checkout */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
             {/* Address Block */}
             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2"><MapPin className="text-brand-500"/> Delivery Address</h3>
                     {!isEditingAddress && (
                         <button onClick={() => { setTempAddress(deliveryAddress); setIsEditingAddress(true); }} className="text-brand-600 text-xs font-bold uppercase tracking-wider hover:underline">Change</button>
                     )}
                 </div>
                 
                 {isEditingAddress ? (
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 space-y-3 animate-fade-in-up">
                         <input 
                            type="text" 
                            name="addressLine1"
                            value={tempAddress.addressLine1} 
                            onChange={(e) => setTempAddress({...tempAddress, addressLine1: e.target.value})}
                            placeholder="Address Line 1"
                            className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                         />
                         <div className="grid grid-cols-2 gap-2">
                             <input 
                                type="text" 
                                value={tempAddress.area} 
                                onChange={(e) => setTempAddress({...tempAddress, area: e.target.value})}
                                placeholder="Area"
                                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                             <input 
                                type="text" 
                                value={tempAddress.city} 
                                onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})}
                                placeholder="City"
                                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                             <input 
                                type="text" 
                                value={tempAddress.pincode} 
                                onChange={(e) => setTempAddress({...tempAddress, pincode: e.target.value})}
                                placeholder="Pincode"
                                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                             <input 
                                type="text" 
                                value={tempAddress.contactNumber} 
                                onChange={(e) => setTempAddress({...tempAddress, contactNumber: e.target.value})}
                                placeholder="Contact Number"
                                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                         </div>
                         <div className="flex gap-2 pt-2">
                             <button onClick={() => setIsEditingAddress(false)} className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-50">Cancel</button>
                             <button onClick={handleSaveAddress} className="flex-1 bg-brand-600 text-white font-bold py-2 rounded-lg hover:bg-brand-700">Save</button>
                         </div>
                     </div>
                 ) : (
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="font-bold text-slate-800 text-sm">{deliveryAddress.addressLine1}</p>
                         <p className="font-medium text-slate-500 text-sm mt-0.5">{deliveryAddress.area}, {deliveryAddress.city} - {deliveryAddress.pincode}</p>
                         <p className="font-medium text-slate-500 text-xs mt-1">📞 {deliveryAddress.contactNumber}</p>
                     </div>
                 )}
             </div>

             {/* Bill Summary */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-brand-900/5 overflow-hidden flex flex-col relative sticky top-24">
                 <div className="p-6">
                     <h3 className="font-extrabold text-slate-800 text-xl border-b border-slate-100 pb-4 mb-4">Bill Details</h3>
                     
                     <div className="space-y-3 font-medium text-sm text-slate-600 mb-6">
                         <div className="flex justify-between">
                             <span>Item Total ({cartItems.length} items)</span>
                             <span className="font-bold text-slate-800">₹{subTotal.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between">
                             <span>Handling Fee</span>
                             <span className="font-bold text-slate-800">₹5.00</span>
                         </div>
                         <div className="flex justify-between">
                             <span>Delivery Fee</span>
                             <span className="font-bold text-slate-800">₹10.00</span>
                         </div>
                     </div>
                     
                     <div className="border-t border-slate-100 pt-4 flex justify-between items-end mb-8">
                         <span className="font-bold text-slate-800">Grand Total</span>
                         <span className="font-black text-2xl text-slate-900">₹{finalTotal.toFixed(2)}</span>
                     </div>
                 </div>

                 {/* Sticky bottom for mobile */}
                 <div className="p-4 bg-white border-t border-slate-100 sticky bottom-16 md:static z-20">
                     <button 
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-brand-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-500/30 hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-between px-6"
                     >
                        <span>{loading ? 'Processing...' : 'Place Order'}</span>
                        <div className="flex items-center gap-2">
                             <span>₹{finalTotal.toFixed(2)}</span>
                             <ArrowRight size={18} />
                        </div>
                     </button>
                     <p className="text-center text-[10px] uppercase font-bold text-slate-400 mt-3 flex items-center justify-center gap-1">
                         <CheckCircle2 size={10} /> Secure COD Payment Option Selected
                     </p>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default Cart;
