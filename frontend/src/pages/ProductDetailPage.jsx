import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { requestService } from '../services/requestService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { MapPin, Phone, User, ShoppingBag, Send, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        if (data.quantity) {
          setRequestedQuantity(Math.min(10, data.quantity).toString());
        }
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await requestService.createRequest(
        user.profileId,
        product.id,
        parseFloat(requestedQuantity),
        message
      );
      setSuccess(true);
      setTimeout(() => {
        navigate('/buyer/requests');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send purchase request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading produce details..." />;
  if (!product) return <ErrorAlert message="Product not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Link to="/buyer/marketplace" className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <ErrorAlert message={error} />

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4 text-emerald-800">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-base">Purchase Request Submitted!</h4>
            <p className="text-sm">Your purchase request has been sent to farmer {product.farmerName}. Redirecting to your requests page...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="h-full min-h-[300px]">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-3 border-t border-b border-slate-100 py-4 text-sm">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-extrabold text-emerald-700">₹{product.price} <span className="text-xs text-slate-500 font-normal">/ {product.unit}</span></span>
              <span className="text-xs font-bold text-slate-600">Stock: {product.quantity} {product.unit}</span>
            </div>

            <p className="flex items-center gap-2 text-slate-700 font-semibold"><User className="w-4 h-4 text-emerald-600" /> Farmer: {product.farmerName}</p>
            <p className="flex items-center gap-2 text-slate-600"><MapPin className="w-4 h-4 text-slate-400" /> Pickup Location: {product.location}</p>
            <p className="flex items-center gap-2 text-slate-600"><Phone className="w-4 h-4 text-slate-400" /> Farmer Contact: {product.contact}</p>
          </div>

          {/* Form to submit purchase request */}
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Requested Quantity ({product.unit})
              </label>
              <input
                type="number"
                step="0.1"
                max={product.quantity}
                required
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pickup Request Message
              </label>
              <textarea
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Hi Ramesh, I would like to purchase 10 kg tomatoes for direct farm pickup tomorrow morning."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || success}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-200 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? 'Sending Request...' : <><Send className="w-4 h-4" /> Send Purchase Request to Farmer</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
