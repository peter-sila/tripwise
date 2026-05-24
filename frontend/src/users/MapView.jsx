/**
 * MapView Component
 * 
 * Displays destinations on an interactive map using Leaflet
 * Features:
 * - Interactive map with zoom and pan controls
 * - Destination markers with popups
 * - Click markers to view destination details
 * - Supports multiple tile providers
 * - Responsive design
 * 
 * @param {Array} destinations - Array of destination objects to display
 * @param {Function} onMarkerClick - Callback when marker is clicked
 * @param {Function} onViewDetails - Callback when "View Details" button is clicked
 * @returns {JSX.Element} Map component
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';
import { getSafeImageUrl } from './utils/imageUtils';
import './css/mapview.css';

/**
 * Simple Map Component using dynamic import to avoid SSR issues
 * Falls back to list view if map library not available
 */
const MapView = ({ destinations = [], onMarkerClick = null, onViewDetails = null }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const markersRef = useRef([]);

  /**
   * Add markers for all destinations to the map
   * Each marker is clickable and shows destination info in a popup
   */
  const addDestinationMarkers = useCallback((mapInstance) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (!destinations || destinations.length === 0) return;

    destinations.forEach((destination) => {
      // Use mock coordinates based on destination ID
      // In production, coordinates should come from database
      const lat = -0.023559 + (destination.id * 0.5) % 3;
      const lng = 37.906193 + (destination.id * 0.5) % 3;

      try {
        // Create marker with custom popup
        const marker = window.L.marker([lat, lng])
          .addTo(mapInstance)
          .bindPopup(`
            <div class="map-popup">
              <h4>${destination.name}</h4>
              <p>${destination.location || 'Kenya'}</p>
              ${destination.image_url ? `<img src="${getSafeImageUrl(destination.image_url)}" alt="${destination.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/200x120?text=No+Image'" />` : ''}
              <button class="popup-btn view-details-popup-btn" data-id="${destination.id}">View Details</button>
            </div>
          `);

        // Handle marker click
        marker.on('click', () => {
          setSelectedMarker(destination);
          if (onMarkerClick) {
            onMarkerClick(destination);
          }
        });

        // Handle popup open to attach event listener to button
        marker.on('popupopen', () => {
          const button = document.querySelector('.view-details-popup-btn');
          if (button) {
            button.onclick = () => {
              if (onViewDetails) {
                onViewDetails(destination);
              }
            };
          }
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Failed to add marker:', error);
      }
    });

    // Auto-fit map bounds to show all markers
    if (markersRef.current.length > 0) {
      try {
        const group = window.L.featureGroup(markersRef.current);
        mapInstance.fitBounds(group.getBounds(), { padding: [50, 50] });
      } catch (error) {
        console.error('Failed to fit bounds:', error);
      }
    }
  }, [destinations, onMarkerClick, onViewDetails]);

  /**
   * Initialize Leaflet map on component mount
   * Creates map centered on Kenya with markers for all destinations
   */
  useEffect(() => {
    if (!mapContainer.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      try {
        // Import Leaflet CSS and JS dynamically
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(leafletCSS);

        // Wait for Leaflet script to load
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = () => {
          // Create map instance centered on Kenya
          const newMap = window.L.map(mapContainer.current).setView(
            [-0.023559, 37.906193], // Kenya center coordinates
            7 // Zoom level
          );

          // Add tile layer (OpenStreetMap)
          window.L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19,
            }
          ).addTo(newMap);

          map.current = newMap;
          setMapReady(true);

          // Add markers for destinations
          addDestinationMarkers(newMap);
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  /**
   * Update markers when destinations change
   */
  useEffect(() => {
    if (mapReady && map.current) {
      addDestinationMarkers(map.current);
    }
  }, [mapReady, addDestinationMarkers]);

  /**
   * Handle map container resize
   */
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        try {
          map.current.invalidateSize();
        } catch (error) {
          console.error('Failed to resize map:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mapview-container">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="map-container"
        style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}
      />

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <MapPin size={16} />
          <span>{destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'} shown</span>
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="selected-marker-info">
          <button 
            className="close-btn"
            onClick={() => setSelectedMarker(null)}
          >
            <X size={20} />
          </button>
          <h3>{selectedMarker.name}</h3>
          <p className="location">
            <MapPin size={14} />
            {selectedMarker.location || 'Kenya'}
          </p>
          {selectedMarker.description && (
            <p className="description">{selectedMarker.description.substring(0, 100)}...</p>
          )}
          <button 
            className="view-details-btn"
            onClick={() => {
              if (onMarkerClick) {
                onMarkerClick(selectedMarker);
              }
              setSelectedMarker(null);
            }}
          >
            View Full Details
          </button>
        </div>
      )}

      {/* No Data Message */}
      {destinations.length === 0 && (
        <div className="map-empty-state">
          <MapPin size={48} />
          <p>No destinations to display on map</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
