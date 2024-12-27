export interface CreateTinyUrlRequest {
  url: string;
  domain?: string;
  alias?: string;
  tags?: string;
  expires_at?: string;
  description?: string;
}

export interface TinyUrlResponse {
  data: {
    domain: string;
    alias: string;
    tiny_url: string;
    url: string;
    created_at: string;
    expires_at: string | null;
    deleted: boolean;
    archived: boolean;
    analytics: {
      enabled: boolean;
      public: boolean;
    };
  };
  code: number;
  errors: string[];
}