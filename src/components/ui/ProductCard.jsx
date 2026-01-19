import React from 'react'
import { Plus } from 'lucide-react'
import Card from './Card'
import Button from './Button'

const ProductCard = ({ product }) => {
    return (
        <Card className="p-0 overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=300'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    {/* Future: Add to Cart Quick Action */}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-text text-lg leading-tight">{product.name}</h3>
                        <p className="text-xs text-text-muted capitalize">{product.category}</p>
                    </div>
                    <span className="font-display font-bold text-emerald-700 text-lg">
                        ${product.price ? product.price.toFixed(2) : '0.00'}
                    </span>
                </div>

                <p className="text-sm text-text-muted line-clamp-2 mb-4 h-10">
                    {product.description}
                </p>

                <Button className="w-full h-10 text-sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Order
                </Button>
            </div>
        </Card>
    )
}

export default ProductCard
