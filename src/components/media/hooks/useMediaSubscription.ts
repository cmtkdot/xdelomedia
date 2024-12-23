import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "../types";

const useMediaSubscription = () => {
  useEffect(() => {
    console.log("Setting up realtime subscription");
    const subscription = supabase
      .channel('media_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'media' 
      }, async (payload) => {
        console.log('New media received:', payload);
      })
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);
};

export default useMediaSubscription;