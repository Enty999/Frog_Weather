// Alert Service — cảnh báo thời tiết thật từ weatherapi.com (alerts=yes)
import { apiClient } from './apiClient.js';
import { mapAlerts, mapTyphoon } from './weatherMapper.js';
import { APP_CONFIG } from '../config/constants.js';

export const alertService = {
  // Cảnh báo bão/nguy hiểm chi tiết cho 1 khu vực (null nếu không có)
  getTyphoonAlert: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    try {
      const bundle = await apiClient.getBundle(cityName);
      return mapTyphoon(bundle);
    } catch {
      return null;
    }
  },

  // Danh sách cảnh báo đang có hiệu lực ([] nếu không có)
  getActiveAlerts: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    try {
      const bundle = await apiClient.getBundle(cityName);
      return mapAlerts(bundle);
    } catch {
      return [];
    }
  }
};
