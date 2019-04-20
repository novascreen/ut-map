import React, { useEffect, useMemo } from 'react';
import data from 'data.json';
import xor from 'lodash/xor';
import getFilteredProjects from 'lib/getFilteredProjects';

const DataContext = React.createContext();

const initialActiveFilters = {
  status: [],
  type: []
};

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case 'resetFilter': {
      return {
        ...state,
        [payload.type]: []
      };
    }
    case 'toggleFilter': {
      return {
        ...state,
        [payload.type]: xor(state[payload.type], [payload.value])
      };
    }
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
  const [activeFilters, dispatch] = React.useReducer(
    reducer,
    initialActiveFilters
  );

  const actions = {
    resetFilter: type => dispatch({ type: 'resetFilter', payload: { type } }),
    toggleFilter: (type, value) =>
      dispatch({ type: 'toggleFilter', payload: { type, value } })
  };

  const projects = useMemo(
    () => getFilteredProjects(data.projects, activeFilters),
    [activeFilters]
  );

  const value = {
    state: {
      filters: data.filters,
      activeFilters,
      projects
    },
    actions
  };

  // useEffect(() => {
  // }, []);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const { state, actions } = React.useContext(DataContext);

  // const toggle = favorite => dispatch({ type: 'toggle', payload: favorite });
  // const update = favorite => dispatch({ type: 'update', payload: favorite });
  // const move = (from, to) => dispatch({ type: 'move', payload: { from, to } });

  return [state, actions];
};
