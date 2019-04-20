export default function getFilteredProjects(projects, activeFilters) {
  console.log('filtering');
  return projects.filter(project => {
    if (
      activeFilters.status.length &&
      !activeFilters.status.includes(project.status)
    )
      return false;
    if (
      activeFilters.type.length &&
      !activeFilters.type.some(type => project.types.includes(type))
    )
      return false;
    return true;
  });
}
