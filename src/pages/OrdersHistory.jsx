import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const { data } = await api.get('/orders/myorders');
                setOrders(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setLoading(false);
            }
        };
        fetchMyOrders();
        
        // Refresh component periodically to auto-hide cancel buttons after 2 mins
        const timer = setInterval(() => setCurrentTime(Date.now()), 15000);
        return () => clearInterval(timer);
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        
        setCancellingId(orderId);
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.put(`/orders/${orderId}/cancel`, {});
            
            setOrders(prev => prev.map(order => 
                order._id === orderId ? data.data : order
            ));
        } catch (error) {
            console.error("Cancel failed:", error);
            alert(error.response?.data?.message || "Failed to cancel order.");
        } finally {
            setCancellingId(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const icons = {
            'Placed': <Clock size={14} />,
            'Processing': <Package size={14} />,
            'Out for Delivery': <Truck size={14} />,
            'Delivered': <CheckCircle2 size={14} />,
            'Cancelled': <XCircle size={14} />
        };
        
        const colors = {
            'Placed': 'bg-blue-50 text-blue-700 border-blue-200',
            'Processing': 'bg-orange-50 text-orange-700 border-orange-200',
            'Out for Delivery': 'bg-purple-50 text-purple-700 border-purple-200',
            'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Cancelled': 'bg-red-50 text-red-700 border-red-200'
        };

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                {icons[status]} {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-40"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">No orders yet</h2>
                <p className="text-slate-500 font-medium mb-8 max-w-xs">Looks like you haven't made yours first purchase. Get ordering!</p>
                <Link to="/" className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-8">My Orders</h1>
            
            <div className="space-y-6">
                {orders.map((order) => {
                    const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    
                    const timeElapsed = currentTime - new Date(order.createdAt).getTime();
                    const isCancellable = timeElapsed <= (2 * 60 * 1000) && 
                                          order.orderStatus !== 'Cancelled' && 
                                          order.orderStatus !== 'Delivered';

                    return (
                        <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="bg-slate-50/50 p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-800 text-lg">{order.orderId}</h3>
                                        <StatusBadge status={order.orderStatus} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">{orderDate}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Total Amount</p>
                                    <p className="font-black text-xl text-brand-600">₹{order.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Items Purchased</h4>
                                <div className="space-y-3">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-slate-50/30 p-2 px-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center font-bold text-slate-400 text-xs shrink-0">
                                                    {item.quantity}x
                                                </div>
                                                <span className="font-semibold text-slate-700 text-sm">{item.productName}</span>
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-sm font-medium text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Item Total</span>
                                        <span className="text-slate-700">₹{(order.totalPrice - (order.deliveryFee || 0) - (order.handlingFee || 0)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Handling Fee</span>
                                        <span className="text-slate-700">₹{(order.handlingFee || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee</span>
                                        <span className="text-slate-700">₹{(order.deliveryFee || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-dashed border-slate-200 mt-1">
                                        <span>Grand Total</span>
                                        <span className="text-brand-600 text-base">₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4 text-sm font-medium text-slate-600">
                                    <div className="flex gap-2 text-slate-500">
                                        <span className="font-bold text-slate-700">Payment:</span> {order.paymentMethod}
                                    </div>
                                    <div className="flex gap-2 text-slate-500 truncate mt-1 sm:mt-0">
                                        <span className="font-bold text-slate-700">Delivery:</span> {order.deliveryAddress.area}, {order.deliveryAddress.city}
                                    </div>
                                </div>
                                
                                {isCancellable && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                        <button 
                                            onClick={() => handleCancelOrder(order._id)}
                                            disabled={cancellingId === order._id}
                                            className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {cancellingId === order._id ? (
                                                <div className="w-4 h-4 border-2 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                                            ) : (
                                                <>Cancel Order</>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersHistory;
