import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { SearchHeader } from "../blocks/location-selection/search-header";
import { GPSLocationButton } from "../blocks/location-selection/gps-location-button";
import { WilayaBaladiyaSelector } from "../blocks/location-selection/wilaya-baladiya-selector";
import { Toast } from "~/components/toast/toast";
import { useAppContext } from "~/context/app-context";
import { useLocationSelection } from "~/hooks/use-location-selection";
import styles from "./location-selection.module.css";

export default function LocationSelection() {
  const navigate = useNavigate();
  const { setLocation } = useAppContext();
  const locationState = useLocationSelection();
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const handleGPSDetect = useCallback(() => {
    locationState.detectGPSLocation();
  }, [locationState]);

  // Show success state when GPS finds a location
  const isGPSSuccess =
    gpsSuccess ||
    (!locationState.isDetectingGPS &&
      !locationState.gpsError &&
      locationState.selectedWilaya !== null &&
      locationState.selectedBaladiya !== null);

  const handleConfirm = () => {
    const loc = locationState.getSelectedLocation();
    if (loc) {
      setLocation(loc);
      setGpsSuccess(true);
      navigate("/");
    }
  };

  const canConfirm =
    locationState.selectedWilaya !== null &&
    locationState.selectedBaladiya !== null;

  return (
    <main className={styles.root}>
      <SearchHeader />
      <GPSLocationButton
        isDetecting={locationState.isDetectingGPS}
        isSuccess={isGPSSuccess && !locationState.isDetectingGPS && canConfirm}
        onDetect={handleGPSDetect}
      />
      <WilayaBaladiyaSelector
        wilayas={locationState.wilayas}
        baladiyas={locationState.baladiyas}
        selectedWilaya={locationState.selectedWilaya}
        selectedBaladiya={locationState.selectedBaladiya}
        isLoadingWilayas={locationState.isLoadingWilayas}
        isLoadingBaladiyas={locationState.isLoadingBaladiyas}
        onWilayaChange={locationState.selectWilaya}
        onBaladiyaChange={locationState.selectBaladiya}
        onConfirm={handleConfirm}
        canConfirm={canConfirm}
      />
      {locationState.gpsError && (
        <Toast
          message={locationState.gpsError}
          title="GPS Unavailable"
          type="error"
          onClose={locationState.clearGpsError}
        />
      )}
    </main>
  );
}
