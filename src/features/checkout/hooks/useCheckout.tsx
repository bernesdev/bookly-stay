import { useLocalSearchParams } from 'expo-router';

import { useAccommodationQuery } from '@/src/features/accommodation/api/accommodation.queries';
import { useStayStore } from '@/src/shared/hooks/useStayStore';
import { selectNights } from '@/src/shared/selectors/stay.selectors';

export const useCheckout = () => {
  const nights = useStayStore(selectNights);

  const { id } = useLocalSearchParams<{ id: string }>();

  const query = useAccommodationQuery(id);

  const accommodation = query.data;

  const totalDiscount = accommodation?.price.discount
    ? accommodation.price.discount * nights
    : null;

  const oldPrice =
    accommodation?.price.oldPrice ?? accommodation?.price.currentPrice;

  const totalOldPrice = oldPrice ? oldPrice * nights : null;

  const totalCurrentPrice = (accommodation?.price.currentPrice ?? 0) * nights;

  return {
    id,
    totalDiscount,
    totalOldPrice,
    totalCurrentPrice,
    nights,
    accommodation,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
