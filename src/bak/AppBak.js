import React, { useState, useMemo } from 'react';
import ReactMapGL, { FlyToInterpolator, Marker } from 'react-map-gl';
import ReactMapboxGl from "react-mapbox-gl";
import './App.css';
import getMarkers from './getMarkers';

const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;

const initialState = {
  width: '100%',
  height: '100vh',
  latitude: 43.666828,
  longitude: -79.344528,
  zoom: 8
};



function App() {
  const [viewport, setViewport] = useState(initialState);

  const markers = useMemo(() => getMarkers(), []);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      mapboxApiAccessToken={REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
      transitionDuration={200}
      transitionInterpolator={new FlyToInterpolator()}
    >
      {markers.map(marker => (
        <Marker
          key={marker.title}
          latitude={marker.latitude}
          longitude={marker.longitude}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'red'
            }}
          />
        </Marker>
      ))}
    </ReactMapGL>
  );
}

export default App;
