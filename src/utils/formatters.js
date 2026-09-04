// Formatter Utilities

export const formatTemp = (temp) => `${Math.round(temp)}°C`;

export const getWeatherIconSvg = (iconName) => {
  const icons = {
    'sun': 'bi-sun-fill text-warning',
    'cloud-sun': 'bi-cloud-sun-fill text-warning',
    'cloud': 'bi-cloud-fill text-secondary',
    'cloud-rain': 'bi-cloud-rain-fill text-info',
    'cloud-drizzle': 'bi-cloud-drizzle-fill text-info',
    'cloud-heavy-rain': 'bi-cloud-heavy-rain-fill text-primary',
    'cloud-lightning-rain': 'bi-cloud-lightning-rain-fill text-warning',
    'moon': 'bi-moon-stars-fill text-light',
    'moon-cloud': 'bi-cloud-moon-fill text-light'
  };
  return icons[iconName] || 'bi-cloud-sun-fill text-warning';
};
