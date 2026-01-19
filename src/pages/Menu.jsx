import React, { useEffect, useState } from 'react'
import { ArrowLeft, Filter, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Menu = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('all')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('available', true)

            if (error) throw error
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category)

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'coffee', label: 'Coffee' },
        { id: 'tea', label: 'Tea' },
        { id: 'pastry', label: 'Pastries' }
    ]

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl animate-fade-in pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2 h-auto" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-3xl font-bold">Our Menu</h1>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`
                    px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all
                    ${category === cat.id
                                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/20'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }
                `}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-black/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20 text-text-muted">
                    <p>No items found in this category.</p>
                </div>
            )}
        </div>
    )
}

export default Menu
