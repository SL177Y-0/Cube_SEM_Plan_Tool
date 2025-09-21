// sem api service - the backend connector
// built this after way too many api debugging sessions
// seriously, axios can be tricky sometimes

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// types for api requests and responses - keeping it organized
export interface KeywordRequest {
  seed_keywords: string[];
  brand_url?: string;
  competitor_url?: string;
  locations?: string[];
  max_results?: number;
  include_semantic_search?: boolean;
  include_ai_overviews?: boolean;
}

export interface KeywordItem {
  keyword: string;
  avg_monthly_searches: number;
  competition: string;
  top_of_page_bid_low: number;
  top_of_page_bid_high: number;
  source: string;
  intent: string;
  difficulty_score: number;
  opportunity_score: number;
}

export interface FilterRequest {
  keywords: KeywordItem[];
  min_search_volume?: number;
  max_competition?: string;
  min_opportunity_score?: number;
  exclude_branded?: boolean;
}

export interface AdGroup {
  name: string;
  theme: string;
  keywords: KeywordItem[];
  suggested_match_types: {
    exact: string[];
    phrase: string[];
    bmm: string[];
  };
  cpc_range: {
    low: number;
    high: number;
  };
  estimated_clicks: number;
  estimated_conversions: number;
  target_cpa: number;
}

export interface PMaxTheme {
  title: string;
  category: string;
  description: string;
  keywords: string[];
  target_audience: string;
  estimated_impressions: number;
  expected_ctr: number;
  asset_suggestions: {
    headlines: string[];
    descriptions: string[];
    images: string[];
  };
}

export interface BudgetRequest {
  ad_groups: AdGroup[];
  budgets: {
    search: number;
    shopping: number;
    pmax: number;
  };
  conversion_rate?: number;
  target_roas?: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  error?: string;
  message?: string;
}

// api client setup - learned this pattern from a senior dev
class SEMApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // request interceptor - learned this helps with debugging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // response interceptor - catch errors early
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // health check - always good to have for monitoring
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // generate keywords with ai optimization - this is where the magic happens
  async generateKeywords(request: KeywordRequest): Promise<ApiResponse<{
    total_keywords: number;
    keywords: KeywordItem[];
    trends_analyzed: string[];
    generated_at: string;
  }>> {
    try {
      const response = await this.client.post('/api/v1/generate_keywords', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // filter keywords with advanced criteria - learned this from google ads docs
  async filterKeywords(request: FilterRequest): Promise<ApiResponse<{
    original_count: number;
    filtered_count: number;
    keywords: KeywordItem[];
    filter_criteria: any;
  }>> {
    try {
      const response = await this.client.post('/api/v1/filter_keywords', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // group keywords into ad groups - this took forever to get right
  async groupKeywords(request: FilterRequest): Promise<ApiResponse<{
    ad_groups: AdGroup[];
    total_keywords: number;
    grouped_keywords: number;
    optimization_notes: string[];
  }>> {
    try {
      const response = await this.client.post('/api/v1/group_keywords', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // generate performance max themes - pmax is getting more important
  async generatePMaxThemes(request: FilterRequest): Promise<ApiResponse<{
    themes: PMaxTheme[];
    optimization_features: string[];
    best_practices: string[];
  }>> {
    try {
      const response = await this.client.post('/api/v1/pmax_themes', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // calculate optimal bids - always tricky to get right
  async calculateBids(request: BudgetRequest): Promise<ApiResponse<{
    budget_allocation: any;
    total_budget: number;
    target_cpa: number;
    expected_roas: number;
    bid_recommendations: any[];
    optimization_strategy: any;
  }>> {
    try {
      const response = await this.client.post('/api/v1/calculate_bids', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // optimize campaigns with ai - this is where the real value is
  async optimizeCampaigns(request: BudgetRequest): Promise<ApiResponse<{
    optimizations: any[];
    key_insights: string[];
    next_steps: string[];
  }>> {
    try {
      const response = await this.client.post('/api/v1/optimize_campaigns', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // get latest sem trends - always useful for planning
  async getSEMTrends(): Promise<ApiResponse<{
    trends: Array<{
      trend: string;
      description: string;
      impact: string;
      recommendation: string;
    }>;
    best_practices: string[];
  }>> {
    try {
      const response = await this.client.get('/api/v1/trends');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // error handling utility - learned this the hard way
  private handleError(error: any): Error {
    if (error.response) {
      // server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'Server error';
      return new Error(`API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // request was made but no response received
      return new Error('Network error: Unable to connect to server');
    } else {
      // something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }
}

// create and export singleton instance - keeps things simple
export const semApiClient = new SEMApiClient();

// convenience functions for common operations - makes life easier
export const api = {
  // health and status
  health: () => semApiClient.healthCheck(),
  
  // keyword operations
  generateKeywords: (request: KeywordRequest) => semApiClient.generateKeywords(request),
  filterKeywords: (request: FilterRequest) => semApiClient.filterKeywords(request),
  groupKeywords: (request: FilterRequest) => semApiClient.groupKeywords(request),
  
  // campaign operations
  generatePMaxThemes: (request: FilterRequest) => semApiClient.generatePMaxThemes(request),
  calculateBids: (request: BudgetRequest) => semApiClient.calculateBids(request),
  optimizeCampaigns: (request: BudgetRequest) => semApiClient.optimizeCampaigns(request),
  
  // trends and insights
  getTrends: () => semApiClient.getSEMTrends(),
};

export default semApiClient;