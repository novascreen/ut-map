import React, { useState, useMemo } from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import './App.css';
import getProjects from '../lib/getProjects';
import marker from '../assets/marker';
import ProjectPopup from '../ProjectPopup';

const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;

const initialViewport = {
  fitBounds: undefined,
  center: [-79.387057, 43.642566],
  zoom: [14]
};

const config = {
  style: 'mapbox://styles/mapbox/dark-v9',
  flyToOptions: {
    speed: 0.8
  }
};

const Map = ReactMapboxGl({
  accessToken: REACT_APP_MAPBOX_ACCESS_TOKEN
});

const layoutLayer = { 'icon-image': 'londonCycle' };
const image = new Image();
image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(marker);
const images = ['londonCycle', image];

function App() {
  const [viewport, setViewport] = useState(initialViewport);
  const [activeProject, setActiveProject] = useState(null);

  const projects = useMemo(() => getProjects(), []);

  const handleDrag = () => setActiveProject(null);
  const handleMouseEnter = ({ map }) =>
    (map.getCanvas().style.cursor = 'pointer');
  const handleMouseLeave = ({ map }) => (map.getCanvas().style.cursor = '');
  const handleClick = project => ({ feature }) => {
    setViewport({
      ...viewport,
      center: feature.geometry.coordinates,
      zoom: [14]
    });
    setActiveProject(project);
  };

  return (
    <Map className="map" {...viewport} {...config} onDrag={handleDrag}>
      <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
        {projects.map(project => (
          <Feature
            key={project.title}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick(project)}
            coordinates={[project.longitude, project.latitude]}
          />
        ))}
      </Layer>
      {activeProject && (
        <Popup
          key={activeProject.title}
          coordinates={[activeProject.longitude, activeProject.latitude]}
        >
          <ProjectPopup project={activeProject} />
        </Popup>
      )}
    </Map>
  );
}

export default App;
