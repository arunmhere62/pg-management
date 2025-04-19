import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchDashboardOverview = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.DASHBOARD.OVERVIEW}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Add these new API fetch functions
const fetchFinancialData = async () => {
  try {
    const response = await fetch('/api/dashboard/financial');
    if (!response.ok) throw new Error('Failed to fetch financial data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return null;
  }
};

const fetchSummaryData = async () => {
  try {
    const response = await fetch('/api/dashboard/summary');
    if (!response.ok) throw new Error('Failed to fetch summary data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching summary data:', error);
    return null;
  }
};

const fetchTenantActivityData = async () => {
  try {
    const response = await fetch('/api/dashboard/tenant-activity');
    if (!response.ok) throw new Error('Failed to fetch tenant activity data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tenant activity data:', error);
    return null;
  }
};

const fetchExpensesData = async () => {
  try {
    const response = await fetch('/api/dashboard/expenses');
    if (!response.ok) throw new Error('Failed to fetch expenses data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching expenses data:', error);
    return null;
  }
};
