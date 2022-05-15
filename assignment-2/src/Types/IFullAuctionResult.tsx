import { IBidResult } from "./IBidResult";

export interface IFullAuctionResult {
    auctionId: number;
    title: string;
    description: string;
    categoryId: number;
    endDate: string;
    reserve: number;
    highestBid: IBidResult;
    numBids: number;
    sellerId: number;
    sellerFirstName: string;
    sellerLastName: string;
}