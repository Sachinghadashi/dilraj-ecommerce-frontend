import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    
    return (
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Product Detail Page</h1>
            <p className="text-slate-500 mb-8">Viewing detail for product ID: {id}</p>
            <Link to="/" className="text-brand-600 font-bold hover:underline">← Back to Home</Link>
        </div>
    )
}
export default ProductDetail;
