export interface IAuctionConfig {
    startIndex?: number;
    count?: number;
    q?: string;
    categoryIds?: number[];
    sellerId?: number;
    bidderId?: number;
    sortBy?: string;
    status?: string;
}