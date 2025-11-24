
import React, { useEffect, useRef, useState } from 'react';
import { StateInfo, ShowLocation } from '../types';

// Let TypeScript know that 'L' is in the global scope from the Leaflet CDN script
declare const L: any;

interface MapProps {
  center: ShowLocation | null;
  primaryState: StateInfo | null;
  nearbyStates: StateInfo[];
}

const neutralStyle = {
  color: "#475569", // slate-600
  weight: 1,
  opacity: 1,
  fillColor: "#1e293b", // slate-800
  fillOpacity: 0.5,
};

// Style for suggested/nearby states (Cyan)
const suggestedStyle = {
  color: "#67e8f9", // cyan-300
  weight: 2,
  opacity: 1,
  fillColor: "#0ea5e9", // cyan-500
  fillOpacity: 0.6,
};

// Style for the primary state where the event is (Fuchsia)
const primaryStyle = {
  color: "#f0abfc", // fuchsia-300
  weight: 2,
  opacity: 1,
  fillColor: "#d946ef", // fuchsia-500
  fillOpacity: 0.7,
};

const hoverStyle = {
    weight: 3,
    color: '#e2e8f0', // slate-200
    fillOpacity: 0.9
};

export const MapComponent: React.FC<MapProps> = ({ center, primaryState, nearbyStates }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const activeLayersRef = useRef<any[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
    }).setView([39.8283, -98.5795], 4);

    // Make map container focusable for accessibility
    mapContainerRef.current.setAttribute('tabindex', '0');
  }, []);

  // Fetch US States GeoJSON
  useEffect(() => {
      fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
          .then(response => response.json())
          .then(data => {
              setGeoJsonData(data);
          })
          .catch(error => {
              console.error("Error loading map data:", error);
          });
  }, []);

  // Update map with states and markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJsonData) return;

    // Clear previous layers
    activeLayersRef.current.forEach(layer => {
        if(map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });
    activeLayersRef.current = [];

    try {
        const nearbyStateNames = new Set(nearbyStates.map(s => s.name.toLowerCase()));
        const primaryStateName = primaryState?.name.toLowerCase();
        
        const isCenterValid = center && 
            typeof center.latitude === 'number' && isFinite(center.latitude) && 
            typeof center.longitude === 'number' && isFinite(center.longitude);

        const getFeatureStyle = (feature: any) => {
            const featureName = feature.properties.name?.toLowerCase();
            
            if (featureName === primaryStateName) {
                return primaryStyle;
            } else if (nearbyStateNames.has(featureName)) {
                return suggestedStyle;
            }
            return neutralStyle;
        };
        
        const onEachFeature = (feature: any, layer: any) => {
            layer.bindTooltip(feature.properties.name, {
                className: 'bg-slate-800 text-white border-0 rounded-md px-2 py-1',
                sticky: true
            });

            layer.on({
                mouseover: (e: any) => {
                    e.target.setStyle(hoverStyle);
                    e.target.bringToFront();
                },
                mouseout: (e: any) => {
                    e.target.setStyle(getFeatureStyle(feature));
                }
            });
        };
        
        // Add the main states layer
        const statesLayer = L.geoJSON(geoJsonData, { 
          style: getFeatureStyle,
          onEachFeature: onEachFeature
        });
        map.addLayer(statesLayer);
        activeLayersRef.current.push(statesLayer);

        // Add marker for the show location
        if (isCenterValid) {
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="p-1 bg-white rounded-full shadow-lg"><div class="w-2 h-2 bg-fuchsia-600 rounded-full"></div></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });
            const marker = L.marker([center!.latitude, center!.longitude], { icon });
            map.addLayer(marker);
            activeLayersRef.current.push(marker);
        }
        
        // Zoom logic
        const highlightedFeatures = geoJsonData.features.filter((feature: any) => {
            const name = feature.properties.name?.toLowerCase();
            return name === primaryStateName || nearbyStateNames.has(name);
        });

        if (highlightedFeatures.length > 0) {
            const featureGroup = L.geoJSON(highlightedFeatures);
            map.fitBounds(featureGroup.getBounds().pad(0.2));
        } else if (isCenterValid) {
            map.setView([center!.latitude, center!.longitude], 6);
        } else {
            map.setView([39.8283, -98.5795], 4);
        }

    } catch (e) {
        console.error("An unexpected error occurred while updating the map.", e);
        if (map) {
            map.setView([39.8283, -98.5795], 4);
        }
    }

  }, [center, primaryState, nearbyStates, geoJsonData]);

  return <div ref={mapContainerRef} className="w-full h-full bg-slate-900 rounded-md z-0" />;
};
