const BASE_URL = "http://192.168.1.119:8000"; // Replace with your computer's local IP

export interface OBDData {
  speed?: number;
  rpm?: number;
  engine_load?: number;
  throttle_position?: number;
  coolant_temp?: number;
  intake_temp?: number;
  maf?: number;
  timing_advance?: number;
  o2_b1s2?: number;
  fuel_level?: number;
  absolute_load?: number;
  barometric_pressure?: number;
  catalyst_temp_b1s1?: number;
  catalyst_temp_b1s2?: number;
  commanded_egr?: number;
  commanded_equiv_ratio?: number;
  control_module_voltage?: number;
  distance_since_dtc_clear?: number;
  distance_w_mil?: number;
  elm_voltage?: number;
  evaporative_purge?: number;
  intake_pressure?: number;
  long_fuel_trim_1?: number;
  o2_s1_wr_current?: number;
  o2_s1_wr_voltage?: number;
  relative_throttle_pos?: number;
  run_time?: number;
  run_time_mil?: number;
  short_fuel_trim_1?: number;
  throttle_actuator?: number;
  throttle_pos_b?: number;
  time_since_dtc_cleared?: number;
  warmups_since_dtc_clear?: number;
  [key: string]: number | undefined;
}

export class OBDService {
  static async connect(): Promise<{ status: string; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/connect`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  static async getData(): Promise<OBDData> {
    try {
      const response = await fetch(`${BASE_URL}/data`);
      if (!response.ok) {
        throw new Error('Failed to fetch OBD data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching OBD data:', error);
      throw error;
    }
  }

  static async getSupportedCommands(): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/supported`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching supported commands:', error);
      throw error;
    }
  }
}
