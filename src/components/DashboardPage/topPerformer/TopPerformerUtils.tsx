 interface IBestSeller {
    id: number;
    sellerName: string;
    logoUrl?: string; 
    reviewCount: number;
    totalOrders: number;
    sellerRatings: number;
  }
  interface IBestRider {
    id: number;
    riderName: string;
    profileUrl?: string; 
    rating: number;
    totalOrder:number;
    totalReview:number;
  }
  interface IErrors {
    bestSellerError: string;
    bestRiderError: string;
}
  function generateInitialErrorsData(): IErrors {
      return {
          bestSellerError: '',
          bestRiderError: '',
      }
  }
  function generateInitialBestSellerData(): IBestSeller {
      return {
        id: 0 ,
        sellerName: '' ,
        logoUrl: '' ,
        reviewCount:0 ,
        totalOrders: 0 ,
        sellerRatings: 0 ,
      }
  }
 const truncateText = (text: string, limit = 15): string => {
    const dotIndex = text.lastIndexOf('.');
    if (dotIndex === -1 || dotIndex === 0 || dotIndex === text.length - 1) {
      return text.length > limit ? text.substring(0, limit) + '...' : text;
    }
  
    const name = text.substring(0, dotIndex);
    const extension = text.substring(dotIndex);
    const truncatedName = name.length > limit ? name.substring(0, limit) + '...' : name;
  
    return truncatedName + extension;
  };
  


export { IErrors,IBestSeller,IBestRider,generateInitialBestSellerData ,truncateText,generateInitialErrorsData }