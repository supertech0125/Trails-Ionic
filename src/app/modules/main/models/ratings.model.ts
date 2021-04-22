export interface IPlaceRatingsReview {
  comment: string;
  email: string;
  firstName: string;
  id: string;
  imageUrls: any[];
  lastName: string;
  profileImageUrl: string;
  rating: number;
  timestamp: string;
}

export interface IPlacesRatings {
  averageRating: number;
  reviewCount: number;
  reviews: IPlaceRatingsReview[];
}

export interface ITrailsRatings {
  aggregateRating: number;
  averageRating: number;
  reviewCount: number;
  reviews: IPlaceRatingsReview[];
}
