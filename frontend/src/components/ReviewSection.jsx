import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api';

export const StarRating = ({ rating, size = 14 }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
            <Star key={i} className={`w-[${size}px] h-[${size}px]`} style={{width:size,height:size}}
                fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} 
                stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth={2} />
        ))}
    </div>
);

export const StarInput = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(i => (
            <button key={i} type="button" onClick={() => onChange(i)} className="p-0.5">
                <Star className="w-6 h-6" fill={i <= value ? '#f59e0b' : 'none'} 
                    stroke={i <= value ? '#f59e0b' : '#d1d5db'} strokeWidth={2} />
            </button>
        ))}
    </div>
);

export const ReviewSection = ({ spaceId, darkMode, token, hasBooked }) => {
    const [reviews, setReviews] = useState([]);
    const [avg, setAvg] = useState(0);
    const [total, setTotal] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const dk = darkMode;

    const load = async () => {
        if (loaded) return;
        try {
            const res = await fetch(`${API}/reviews/${spaceId}`);
            const data = await res.json();
            if (res.ok) { setReviews(data.reviews); setAvg(data.averageRating); setTotal(data.totalReviews); }
        } catch(e) { console.error(e); }
        setLoaded(true);
    };

    const submit = async () => {
        if (!rating) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/reviews`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ spaceId, rating, comment })
            });
            const data = await res.json();
            if (res.ok) { 
                setShowForm(false); setRating(0); setComment(''); setLoaded(false); load(); 
                toast.success('Review posted!');
            } else {
                toast.error(data.message || 'Failed to post review');
            }
        } catch(e) { 
            toast.error('An error occurred');
            console.error(e); 
        }
        setSubmitting(false);
    };

    if (!loaded) { load(); return null; }

    return (
        <div className="mt-2">
            <div className="flex items-center gap-2">
                <StarRating rating={avg} size={12} />
                <span className={`text-[11px] font-semibold ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{avg} ({total})</span>
            </div>
            {token && hasBooked && (
                <button onClick={() => setShowForm(!showForm)} className="text-[11px] text-blue-500 hover:text-blue-600 mt-1">
                    {showForm ? 'Cancel' : '✍️ Write Review'}
                </button>
            )}
            {showForm && (
                <div className={`mt-2 p-3 rounded-xl border ${dk ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <StarInput value={rating} onChange={setRating} />
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Your review..."
                        className={`w-full mt-2 rounded-lg p-2 text-[12px] border resize-none ${dk ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} rows={2} />
                    <button onClick={submit} disabled={!rating || submitting}
                        className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-medium disabled:opacity-50">
                        {submitting ? 'Posting...' : 'Post Review'}
                    </button>
                </div>
            )}
            {reviews.length > 0 && (
                <div className="mt-2 space-y-2">
                    {reviews.slice(0,3).map(r => (
                        <div key={r._id} className={`p-2 rounded-lg ${dk ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-bold ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{r.userId?.name}</span>
                                <StarRating rating={r.rating} size={10} />
                            </div>
                            {r.comment && <p className={`text-[11px] mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{r.comment}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
