import { useQuery } from "@tanstack/react-query";

const useGetAllOnlineBookings = () => {
  const {
    isPending,
    isError,
    data: allOnlineBookings = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const res = await fetch(`https://hotelorion-backend.vercel.app/api/onlinebooking/allonlinebookings`);
      return res.json();
    },
  });
  return {allOnlineBookings, refetch};
};

export default useGetAllOnlineBookings;
