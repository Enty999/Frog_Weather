// Weather Service — dữ liệu thật từ weatherapi.com (qua apiClient + weatherMapper)
import { apiClient } from './apiClient.js';
import { mapCurrent, mapHourly, mapDaily, mapAQI } from './weatherMapper.js';
import { APP_CONFIG } from '../config/constants.js';

export const weatherService = {
  // Thời tiết hiện tại của 1 thành phố
  getCurrentWeather: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const bundle = await apiClient.getBundle(cityName);
    return mapCurrent(bundle, cityName);
  },

  // Dự báo theo giờ (24h tới)
  getHourlyForecast: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const bundle = await apiClient.getBundle(cityName);
    return mapHourly(bundle);
  },

  // Dự báo nhiều ngày (số ngày phụ thuộc gói — gói free 3 ngày)
  get7DayForecast: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const bundle = await apiClient.getBundle(cityName);
    return mapDaily(bundle);
  },

  // Chất lượng không khí (AQI)
  getAQI: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const bundle = await apiClient.getBundle(cityName);
    return mapAQI(bundle, cityName);
  }
};
