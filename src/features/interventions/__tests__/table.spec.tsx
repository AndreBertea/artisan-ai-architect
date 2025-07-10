import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Interventions } from '../pages/Interventions';

// Mock des services
vi.mock('@/services/interventions.api', () => ({
  getInterventions: () => Promise.resolve({
    data: [
      {
        id: 'INT-001',
        client: 'Test Client',
        artisan: 'Test Artisan',
        statut: 'En cours',
        date_creation: '2024-01-15',
        date_echeance: '2024-01-25'
      }
    ]
  })
}));

describe('Interventions Table', () => {
  it('should render interventions table', async () => {
    render(<Interventions />);
    
    expect(screen.getByText('Interventions')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rechercher interventions...')).toBeInTheDocument();
    
    // Wait for data to load
    await screen.findByText('Test Client');
    expect(screen.getByText('Test Artisan')).toBeInTheDocument();
  });

  it('should display correct status badge', async () => {
    render(<Interventions />);
    
    await screen.findByText('En cours');
    const statusBadge = screen.getByText('En cours');
    expect(statusBadge).toHaveClass('bg-orange-100', 'text-orange-800');
  });
});