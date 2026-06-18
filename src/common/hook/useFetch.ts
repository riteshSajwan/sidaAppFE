import { useEffect, useState } from 'react';
import { hasAccordionOpended } from 'src/components/Restaurant/utils/RestaurantUtil';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string;
}

const useFetch = <T>(
    apiCall: (sellerId: string) => Promise<T>,
    sellerId: string,
    openAccordionId: string,
    currentAccordionId: string,
): FetchState<T> => {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

   function fetchData() {
  setLoading(true);
  setError('');

  apiCall(sellerId)
    .then((response) => {
      setData(response);
    })
    .catch((err) => {
      setError('Something went wrong!');
      console.error('API Error:', err);
    })
    .finally(() => {
      setLoading(false);
    });
}


    useEffect(() => {
        if (hasAccordionOpended(openAccordionId, currentAccordionId) && !!sellerId) {
            fetchData();
        }

    }, [openAccordionId, sellerId]);

    return { data, loading, error };
};

export default useFetch;
