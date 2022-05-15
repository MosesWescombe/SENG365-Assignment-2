import { IBidResult } from "./IBidResult";

export interface IAuctionResult {
    auctionId: number;
    title: string;
    categoryId: number;
    endDate: string;
    reserve: number;
    highestBid: IBidResult;
    numBids: number;
    sellerId: number;
    sellerFirstName: string;
    sellerLastName: string;
}