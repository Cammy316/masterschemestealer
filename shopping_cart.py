"""
Shopping cart system for Amazon affiliate monetization
Generates optimized affiliate links and tracks conversions
"""
from typing import List, Dict
import urllib.parse
from config import Affiliate


class ShoppingCart:
    """
    Builds shopping cart URLs for Amazon affiliate program
    Supports multi-item carts and region-specific links
    """
    
    def __init__(self, region_key: str = "🇺🇸 USA"):
        """
        Initialize shopping cart with region
        
        Args:
            region_key: Region from Affiliate.REGIONS (e.g., "🇺🇸 USA", "🇬🇧 UK")
        """
        self.region_key = region_key
        self.config = Affiliate.REGIONS[region_key]
        self.cart_items = []
    
    def add_paint(self, brand: str, paint_name: str, quantity: int = 1):
        """
        Add paint to cart
        
        Args:
            brand: Paint brand (Citadel, Vallejo, Army Painter)
            paint_name: Name of the paint
            quantity: Number of bottles (default 1)
        """
        self.cart_items.append({
            'brand': brand,
            'name': paint_name,
            'quantity': quantity
        })
    
    def clear_cart(self):
        """Remove all items from cart"""
        self.cart_items = []
    
    def generate_cart_url(self) -> str:
        """
        Generate Amazon multi-item search link
        
        Note: Amazon Associates doesn't support direct cart links,
        but we can create a combined search that opens the relevant products
        
        Returns:
            Amazon search URL with affiliate tag
        """
        domain = self.config['domain']
        tag = self.config['tag']
        
        if not self.cart_items:
            return f"https://www.{domain}"
        
        # Build search query for all paints
        # Format: "Brand1 Paint1 OR Brand2 Paint2"
        search_terms = []
        for item in self.cart_items:
            query = f"{item['brand']} {item['name']} paint"
            search_terms.append(query)
        
        # Combine with OR for better search results
        combined_query = " OR ".join(search_terms)
        encoded_query = urllib.parse.quote(combined_query)
        
        return f"https://www.{domain}/s?k={encoded_query}&tag={tag}"
    
    def generate_individual_links(self) -> List[Dict[str, str]]:
        """
        Generate individual affiliate links for each paint
        
        Returns:
            List of dicts with paint name and URL
        """
        links = []
        domain = self.config['domain']
        tag = self.config['tag']
        
        for item in self.cart_items:
            query = f"{item['brand']} {item['name']} paint"
            encoded_query = urllib.parse.quote(query)
            url = f"https://www.{domain}/s?k={encoded_query}&tag={tag}"
            
            links.append({
                'paint': f"{item['brand']} {item['name']}",
                'url': url,
                'quantity': item['quantity']
            })
        
        return links
    
    def get_cart_summary(self) -> Dict:
        """
        Get cart summary for UI display
        
        Returns:
            Dict with total paints, brands breakdown, and items list
        """
        brands = {}
        for item in self.cart_items:
            brand = item['brand']
            brands[brand] = brands.get(brand, 0) + item.get('quantity', 1)
        
        total_bottles = sum(item.get('quantity', 1) for item in self.cart_items)
        
        return {
            'total_paints': len(self.cart_items),
            'total_bottles': total_bottles,
            'brands': brands,
            'items': self.cart_items
        }
    
    def estimate_cost(self) -> Dict[str, float]:
        """
        Estimate total cost (approximate)
        Based on average paint prices by brand
        
        Returns:
            Dict with min, max, and average estimated costs
        """
        # Average prices per brand (USD, approximate)
        BRAND_PRICES = {
            'Citadel': 4.55,
            'Vallejo': 3.50,
            'Army Painter': 3.25
        }
        
        total_min = 0
        total_max = 0
        total_avg = 0
        
        for item in self.cart_items:
            brand = item['brand']
            qty = item.get('quantity', 1)
            
            base_price = BRAND_PRICES.get(brand, 4.0)
            
            # Account for price variance (±15%)
            total_min += base_price * 0.85 * qty
            total_max += base_price * 1.15 * qty
            total_avg += base_price * qty
        
        return {
            'min': round(total_min, 2),
            'max': round(total_max, 2),
            'avg': round(total_avg, 2),
            'currency': 'USD' if 'USA' in self.region_key else 'local'
        }