import { useEffect, useState } from 'react';
import './css/DestinationManagement.css';

const API_BASE = 'http://localhost:8000/api';

const DestinationManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}/destinations`);
        const data = await response.json();

        if (response.ok && data.data) {
          setDestinations(data.data);
        } else {
          setError(data.detail || data.error || 'Unable to load destinations.');
        }
      } catch (err) {
        console.error('Unable to load destinations:', err);
        setError('Unable to load destinations.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="admin-panel-card admin-destinations-card">
      <div className="admin-panel-card-header">
        <div>
          <h2>Destinations</h2>
          <p>Browse and review destination data from the API.</p>
        </div>
        <div className="admin-badge-small">Total: {destinations.length}</div>
      </div>

      {loading && <div className="admin-panel-empty">Loading destinations...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      {!loading && !error && destinations.length === 0 && (
        <div className="admin-panel-empty">No destinations available.</div>
      )}

      {!loading && !error && destinations.length > 0 && (
        <div className="admin-cards-grid">
          {destinations.map((destination) => (
            <article key={destination.id} className="admin-destination-card">
              <div className="admin-destination-card-header">
                <h3>{destination.name}</h3>
                <span>{destination.location || 'Unknown location'}</span>
              </div>
              <p className="admin-destination-category">{destination.category || 'Unknown category'}</p>
              <div className="admin-destination-meta">
                <span>Rating: {destination.rating ?? 'N/A'}</span>
                <span>{destination.price ? `Price: ${destination.price}` : 'No price info'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default DestinationManagement;
