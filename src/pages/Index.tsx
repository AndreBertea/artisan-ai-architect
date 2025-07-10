
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Interventions } from '@/components/Interventions';
import { Artisans } from '@/components/Artisans';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/artisans" element={<Artisans />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default Index;
