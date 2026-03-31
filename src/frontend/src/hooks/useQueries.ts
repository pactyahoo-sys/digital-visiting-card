import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Card } from "../backend.d";
import { useActor } from "./useActor";

const NAGARAJAN_DEFAULT: Card = {
  name: "Nagarajan",
  jobTitle: "Sales Officer",
  company: "InstaSite Kerala",
  email: "cynorlux@gmail.com",
  phone: "+91 8838510443",
  location: "Thiruvananthapuram, Kerala",
  website: "https://instasite.in",
  bio: "Build. Launch. Grow.",
  profilePhotoUrl: "",
};

export function useGetCard() {
  const { actor, isFetching } = useActor();
  return useQuery<Card>({
    queryKey: ["card"],
    queryFn: async () => {
      if (!actor) return NAGARAJAN_DEFAULT;
      return actor.getPublicCard();
    },
    enabled: !isFetching,
  });
}

export function useUpdateCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (card: Card) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCard(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card"] });
    },
  });
}
