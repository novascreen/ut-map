import React, { useState, useMemo } from 'react';
import ReactMapboxGl, {
  Layer,
  Feature,
  Popup,
  ZoomControl
} from 'react-mapbox-gl';
import getProjects from 'lib/getProjects';
import ProjectPopup from 'components/ProjectPopup';

const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;

const initialViewport = {
  fitBounds: undefined,
  center: [-79.387057, 43.642566],
  zoom: [14]
};

const config = {
  style: 'mapbox://styles/mapbox/streets-v9',
  flyToOptions: {
    speed: 0.8
  },
  pitch: [60],
  bearing: [-15]
};

const Map = ReactMapboxGl({
  accessToken: REACT_APP_MAPBOX_ACCESS_TOKEN
});

const paintCircles = {
  'circle-radius': 5,
  'circle-color': '#0099FF',
  'circle-stroke-width': 1,
  'circle-stroke-color': '#fff'
};

const paintBuildings = {
  'fill-extrusion-color': '#aaa',
  'fill-extrusion-height': {
    type: 'identity',
    property: 'height'
  },
  'fill-extrusion-base': {
    type: 'identity',
    property: 'min_height'
  },
  'fill-extrusion-opacity': 0.6
};

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
      <ZoomControl />
      <Layer
        id="3d-buildings"
        sourceId="composite"
        sourceLayer="building"
        filter={['==', 'extrude', 'true']}
        type="fill-extrusion"
        minZoom={14}
        paint={paintBuildings}
      />

      <Layer id="marker" type="circle" paint={paintCircles}>
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
