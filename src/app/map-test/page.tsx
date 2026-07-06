"use client";

import React from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
  MapRoute,
  MapArc,
  MapGeoJSON,
} from "@/components/ui/map";
import { MapPin, Store, Warehouse, Phone, Navigation, Globe } from "lucide-react";

// Our Izmir Locations
const LOCATIONS = [
  {
    id: "flagship",
    name: "Formet Flagship Showroom",
    address: "Alsancak, Atatürk Cd., 35220 Konak/İzmir",
    phone: "+90 232 123 4567",
    coordinates: [27.1428, 38.4237] as [number, number],
    type: "showroom",
  },
  {
    id: "karsiyaka",
    name: "Formet Karşıyaka Boutique",
    address: "Bostanlı, Cemal Gürsel Cd., 35590 Karşıyaka/İzmir",
    phone: "+90 232 987 6543",
    coordinates: [27.1147, 38.4547] as [number, number],
    type: "boutique",
  },
  {
    id: "warehouse",
    name: "Formet Logistics & Outlet",
    address: "Kazımdirik, Ankara Cd., 35100 Bornova/İzmir",
    phone: "+90 232 555 1234",
    coordinates: [27.2289, 38.4622] as [number, number],
    type: "warehouse",
  },
];

// Global shipments data for MapArc
const SHIPMENTS = [
  { id: "ny", from: LOCATIONS[0].coordinates, to: [-74.006, 40.7128] as [number, number], city: "New York" },
  { id: "ldn", from: LOCATIONS[0].coordinates, to: [-0.1276, 51.5074] as [number, number], city: "London" },
  { id: "dxb", from: LOCATIONS[0].coordinates, to: [55.2708, 25.2048] as [number, number], city: "Dubai" },
  { id: "tyo", from: LOCATIONS[0].coordinates, to: [139.6503, 35.6762] as [number, number], city: "Tokyo" },
];

// Delivery Zone Polygon for MapGeoJSON
const DELIVERY_ZONE: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Central Delivery Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [27.05, 38.50], // Top Left
            [27.30, 38.50], // Top Right
            [27.30, 38.35], // Bottom Right
            [27.05, 38.35], // Bottom Left
            [27.05, 38.50], // Close Polygon
          ],
        ],
      },
    },
  ],
};

export default function MapTestPage() {
  return (
    <div className="min-h-screen flex flex-col p-8 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
            Map Examples
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            A comprehensive showcase of the mapcn library capabilities for Formet Outdoor Furniture.
          </p>

          {/* Pre-built Blocks Navigation */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-12">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Store size={20} className="text-blue-500"/> Installed Full-Page Blocks
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              We installed three of the full-page template blocks. Click below to test them out:
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/store-locator" className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-2">
                <MapPin size={16} className="text-rose-500" /> Store Locator
              </a>
              <a href="/delivery" className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-2">
                <Navigation size={16} className="text-blue-500" /> Delivery Tracker
              </a>
              <a href="/logistics" className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-2">
                <Warehouse size={16} className="text-amber-500" /> Logistics Network
              </a>
            </div>
          </div>
        </div>

        {/* Example 1: Single Showroom Focus */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            1. Flagship Showroom Locator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A focused map showing a single location with a custom branded marker, a simple tooltip on hover, and navigation controls.
          </p>
          
          <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl relative ring-1 ring-zinc-900/5 dark:ring-white/10">
            <Map
              center={LOCATIONS[0].coordinates}
              zoom={13}
              pitch={45}
              styles={{
                light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
              }}
            >
              <MapControls position="top-right" showCompass showZoom showFullscreen />

              <MapMarker longitude={LOCATIONS[0].coordinates[0]} latitude={LOCATIONS[0].coordinates[1]}>
                <MarkerContent className="group">
                  <div className="relative flex items-center justify-center w-12 h-12">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping group-hover:bg-blue-500/40 transition-colors" />
                    <div className="relative bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-zinc-900 transition-transform group-hover:scale-110">
                      <MapPin size={20} className="fill-blue-500" />
                    </div>
                  </div>
                </MarkerContent>
                <MarkerTooltip className="bg-zinc-900 text-white font-medium text-sm py-2 px-3">
                  {LOCATIONS[0].name}
                </MarkerTooltip>
              </MapMarker>
            </Map>
          </div>
        </section>

        {/* Example 2: Multiple Stores with Interactive Popups */}
        <section className="space-y-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            2. Multiple Store Locations
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            An overview of all branches. Click on the different markers to open interactive detail cards.
          </p>

          <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white dark:border-zinc-900">
            <Map
              center={[27.15, 38.44]}
              zoom={11.5}
              styles={{
                light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
                dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
              }}
            >
              <MapControls position="bottom-right" />

              {LOCATIONS.map((location) => (
                <MapMarker
                  key={location.id}
                  longitude={location.coordinates[0]}
                  latitude={location.coordinates[1]}
                >
                  <MarkerContent className="group">
                    <div className={`relative p-2.5 rounded-xl shadow-md border-2 border-white dark:border-zinc-800 transition-transform group-hover:-translate-y-1 ${
                      location.type === 'showroom' ? 'bg-amber-500' :
                      location.type === 'boutique' ? 'bg-rose-500' :
                      'bg-zinc-600'
                    }`}>
                      {location.type === 'showroom' && <Store size={18} className="text-white" />}
                      {location.type === 'boutique' && <MapPin size={18} className="text-white fill-rose-400" />}
                      {location.type === 'warehouse' && <Warehouse size={18} className="text-white" />}
                    </div>
                  </MarkerContent>

                  <MarkerPopup closeButton className="min-w-[280px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 border-b border-zinc-200 dark:border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          location.type === 'showroom' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                          location.type === 'boutique' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                          'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                        }`}>
                          {location.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-zinc-900 dark:text-white leading-tight">
                        {location.name}
                      </h3>
                    </div>
                    
                    <div className="p-4 space-y-3 bg-white dark:bg-zinc-900">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {location.address}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Phone size={14} className="text-zinc-400" />
                        {location.phone}
                      </div>
                      <button className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 py-2.5 rounded-xl text-sm font-medium transition-colors">
                        <Navigation size={14} />
                        Get Directions
                      </button>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}
            </Map>
          </div>
        </section>

        {/* Example 3: Delivery Routing (Light Theme & Blue Dot) */}
        <section className="space-y-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            3. Delivery Routing (Forced Light Theme)
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This map is forced to light mode and demonstrates drawing a route from a "user location" (the default blue dot) to the Bornova warehouse.
          </p>

          <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white dark:border-zinc-900">
            <Map
              center={[27.1850, 38.4500]}
              zoom={11.5}
              theme="light" // Force light theme explicitly
              styles={{
                light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
              }}
            >
              <MapControls position="bottom-right" />

              <MapRoute
                coordinates={[
                  [27.1428, 38.4237], // Alsancak
                  [27.1650, 38.4450], 
                  [27.1850, 38.4500], 
                  [27.2289, 38.4622], // Bornova
                ]}
                color="#3b82f6"
                width={5}
                opacity={0.8}
                dashArray={[2, 2]}
              />

              {/* Destination Marker */}
              <MapMarker longitude={27.1428} latitude={38.4237}>
                <MarkerContent className="group">
                  <div className="bg-amber-500 p-2 rounded-full shadow-md border-2 border-white">
                    <Store size={14} className="text-white" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>Delivery Destination</MarkerTooltip>
              </MapMarker>

              {/* Default "Blue Dot" for placement/user location */}
              <MapMarker longitude={27.2289} latitude={38.4622}>
                <MarkerContent />
                <MarkerTooltip>Delivery Origin</MarkerTooltip>
              </MapMarker>

            </Map>
          </div>
        </section>

        {/* Example 4: Delivery Zone Polygon */}
        <section className="space-y-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            4. Delivery Zone (GeoJSON)
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Highlights a specific area using a GeoJSON polygon, ideal for showing supported delivery zones.
          </p>

          <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white dark:border-zinc-900">
            <Map
              center={[27.17, 38.42]}
              zoom={11}
              styles={{
                light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
              }}
            >
              <MapGeoJSON
                data={DELIVERY_ZONE}
                fillPaint={{
                  "fill-color": "#10b981", // Emerald 500
                  "fill-opacity": 0.2,
                  "fill-outline-color": "#059669"
                }}
              />
              
              <MapMarker longitude={27.1428} latitude={38.4237}>
                <MarkerContent className="group">
                  <div className="bg-amber-500 p-2 rounded-full shadow-md border-2 border-white">
                    <Store size={14} className="text-white" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>Showroom</MarkerTooltip>
              </MapMarker>
            </Map>
          </div>
        </section>

        {/* Example 5: Global Shipments (Globe View & Arcs) */}
        <section className="space-y-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            5. Global Shipments <Globe className="text-blue-500" size={24} />
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A 3D Globe projection demonstrating international reach using animated arcs from the Izmir HQ to global cities.
          </p>

          <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-zinc-200 dark:border-zinc-800 bg-black">
            <Map
              center={[35, 30]} // Centered roughly on EMEA
              zoom={2}
              projection={{ type: "globe" }}
              blank // Uses a transparent background, perfect for custom thematic maps
            >
              <MapArc
                data={SHIPMENTS}
                paint={{
                  "line-color": "#3b82f6",
                  "line-width": 2,
                  "line-opacity": 0.6,
                }}
              />
              
              {/* Origin Marker */}
              <MapMarker longitude={LOCATIONS[0].coordinates[0]} latitude={LOCATIONS[0].coordinates[1]}>
                <MarkerContent>
                  <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
                </MarkerContent>
                <MarkerTooltip>Izmir HQ</MarkerTooltip>
              </MapMarker>

              {/* Destination Markers */}
              {SHIPMENTS.map((shipment, index) => (
                <MapMarker key={index} longitude={shipment.to[0]} latitude={shipment.to[1]}>
                  <MarkerContent>
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  </MarkerContent>
                  <MarkerTooltip>{shipment.city}</MarkerTooltip>
                </MapMarker>
              ))}

            </Map>
          </div>
        </section>

      </div>
    </div>
  );
}
