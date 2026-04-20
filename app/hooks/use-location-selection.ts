import { useState, useEffect, useCallback } from "react";
import type { Wilaya, Baladiya, Location } from "~/data/prayer-data";
import { fetchWilayas, fetchBaladiyas, findNearestLocation } from "~/services/api";

export interface LocationSelectionState {
  wilayas: Wilaya[];
  baladiyas: Baladiya[];
  selectedWilaya: Wilaya | null;
  selectedBaladiya: Baladiya | null;
  isLoadingWilayas: boolean;
  isLoadingBaladiyas: boolean;
  isDetectingGPS: boolean;
  gpsError: string | null;
  selectWilaya: (wilaya: Wilaya) => void;
  selectBaladiya: (baladiya: Baladiya) => void;
  detectGPSLocation: () => void;
  clearGpsError: () => void;
  getSelectedLocation: () => Location | null;
}

export function useLocationSelection(): LocationSelectionState {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [baladiyas, setBaladiyas] = useState<Baladiya[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  const [selectedBaladiya, setSelectedBaladiya] = useState<Baladiya | null>(null);
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(true);
  const [isLoadingBaladiyas, setIsLoadingBaladiyas] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Fetch wilayas on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoadingWilayas(true);
    fetchWilayas()
      .then((data) => {
        if (!cancelled) setWilayas(data);
      })
      .catch(() => {
        // silently handle
      })
      .finally(() => {
        if (!cancelled) setIsLoadingWilayas(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Fetch baladiyas when wilaya changes
  useEffect(() => {
    if (!selectedWilaya) {
      setBaladiyas([]);
      setSelectedBaladiya(null);
      return;
    }
    let cancelled = false;
    setIsLoadingBaladiyas(true);
    setSelectedBaladiya(null);
    fetchBaladiyas(selectedWilaya.id)
      .then((data) => {
        if (!cancelled) setBaladiyas(data);
      })
      .catch(() => {
        if (!cancelled) setBaladiyas([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBaladiyas(false);
      });
    return () => { cancelled = true; };
  }, [selectedWilaya]);

  const selectWilaya = useCallback((wilaya: Wilaya) => {
    setSelectedWilaya(wilaya);
    setGpsError(null);
  }, []);

  const selectBaladiya = useCallback((baladiya: Baladiya) => {
    setSelectedBaladiya(baladiya);
  }, []);

  const clearGpsError = useCallback(() => {
    setGpsError(null);
  }, []);

  const detectGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS is not available on this device. Please select your Wilaya and Baladiya manually.");
      return;
    }
    setIsDetectingGPS(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await findNearestLocation(pos.coords.latitude, pos.coords.longitude);
          if (result) {
            setSelectedWilaya(result.wilaya);
            // Fetch baladiyas for this wilaya, then auto-select
            const bals = await fetchBaladiyas(result.wilaya.id);
            setBaladiyas(bals);
            setSelectedBaladiya(result.baladiya);
          }
        } catch {
          setGpsError("Could not determine your location. Please select your Wilaya and Baladiya manually.");
        } finally {
          setIsDetectingGPS(false);
        }
      },
      () => {
        setIsDetectingGPS(false);
        setGpsError("Location access was denied. Please select your Wilaya and Baladiya from the dropdowns below.");
      }
    );
  }, []);

  const getSelectedLocation = useCallback((): Location | null => {
    if (!selectedWilaya || !selectedBaladiya) return null;
    return {
      city: `${selectedBaladiya.name}, ${selectedWilaya.name}`,
      country: "Algeria",
      timezone: "Africa/Algiers",
      latitude: selectedBaladiya.latitude,
      longitude: selectedBaladiya.longitude,
    };
  }, [selectedWilaya, selectedBaladiya]);

  return {
    wilayas,
    baladiyas,
    selectedWilaya,
    selectedBaladiya,
    isLoadingWilayas,
    isLoadingBaladiyas,
    isDetectingGPS,
    gpsError,
    selectWilaya,
    selectBaladiya,
    detectGPSLocation,
    clearGpsError,
    getSelectedLocation,
  };
}
