import { useEffect, useState } from "react";
import { fetchShips } from "../api/shipsApi";
import { normalizeShip } from "../utils/normalizeShip";
import { MOCK_FLEET_DATA } from "../utils/helpers";
import ShipGrid from "../components/ShipGrid";
import LoadingScreen from "../components/LoadingScreen";
import StatsBar from "../components/StatsBar";
import AlertBanner from "../components/AlertBanner";
import ShipDetailsModal from "../components/ShipDetailsModal";
import ErrorFallback from "../components/ErrorFallback";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected ship for detail modal telemetry
  const [selectedShip, setSelectedShip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadShips = async () => {
    setLoading(true);
    setError(null);
    try {
      // Artificially delay a tiny bit so the immersive boot telemetry loader prints nicely
      const apiPromise = fetchShips();
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 3600));
      
      const [data] = await Promise.all([apiPromise, delayPromise]);
      const cleaned = data.map(normalizeShip);
      setShips(cleaned);
    } catch (err) {
      console.error("API Link Failure:", err);
      setError(
        err.message || 
        "Failed to establish telemetry link with orbital array. Satellite link handshake timeout."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShips();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDetails = (ship) => {
    setSelectedShip(ship);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedShip(null);
  };

  const handleLoadMockData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const cleaned = MOCK_FLEET_DATA.map(normalizeShip);
      setShips(cleaned);
      setLoading(false);
    }, 1500); // Small immersive simulator boot time
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <ErrorFallback
        errorMsg={error}
        onRetry={loadShips}
        onLoadMock={handleLoadMockData}
      />
    );
  }

  const criticalShips = ships.filter((s) => s.isCritical);

  return (
    <div className="min-h-screen grid-bg pb-12 transition-all duration-500">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-8">
        
        {/* Critical reactor alert warning */}
        <AlertBanner count={criticalShips.length} />

        {/* Fleet telemetry metrics summary */}
        <StatsBar ships={ships} />

        {/* Main interactive grid display */}
        <ShipGrid ships={ships} onViewDetails={handleOpenDetails} />

      </main>

      {/* Details diagnostics inspector dialog */}
      <ShipDetailsModal
        ship={selectedShip}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default Dashboard;
