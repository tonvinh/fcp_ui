import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProductList } from './pages/ProductList';
import { CreateProduct } from './pages/CreateProduct';
import { ProductDetail } from './pages/ProductDetail';
import { PricingPolicyList } from './pages/PricingPolicyList';
import { CreatePricingPolicy } from './pages/CreatePricingPolicy';
import { PricingPolicyDetail } from './pages/PricingPolicyDetail';
import { ServicePriceAllocation } from './pages/ServicePriceAllocation';
import { NotFound } from './pages/NotFound';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <div className={`flex-1 flex flex-col pt-16 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Header isCollapsed={isCollapsed} />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/edit/:id" element={<CreateProduct />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
            <Route path="/pricing-policies" element={<PricingPolicyList />} />
            <Route path="/pricing-policies/create" element={<CreatePricingPolicy />} />
            <Route path="/pricing-policies/edit/:id" element={<CreatePricingPolicy />} />
            <Route path="/pricing-policies/:id" element={<PricingPolicyDetail />} />
            <Route path="/settings/price-allocation" element={<ServicePriceAllocation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
