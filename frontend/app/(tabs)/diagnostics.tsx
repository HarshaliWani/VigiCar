import { useEffect, useState } from 'react';
import { ScrollView, View, RefreshControl, Text } from 'react-native';
import { screens } from '../constants/screens';
import { Card } from '../components/ui/card';
import { ListItem } from '../components/ui/list-item';
import { OBDService, OBDData } from '../services/obd.service';

export default function DiagnosticsScreen() {
  const [obdData, setObdData] = useState<OBDData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await OBDService.getData();
      setObdData(data);
    } catch (err) {
      setError('Failed to fetch OBD data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial connection and data fetch
    const initOBD = async () => {
      try {
        await OBDService.connect();
        await fetchData();
      } catch (err) {
        setError('Failed to connect to OBD');
      }
    };
    initOBD();

    // Set up polling interval
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderDataItem = (key: string, value: number | undefined) => {
    if (value === undefined) return null;
    
    // Format the value based on the metric type
    let formattedValue = value;
    let unit = '';
    
    switch(key) {
      case 'speed':
        unit = ' km/h';
        break;
      case 'rpm':
        unit = ' RPM';
        break;
      case 'throttle_position':
      case 'engine_load':
      case 'absolute_load':
      case 'relative_throttle_pos':
        unit = '%';
        break;
      case 'coolant_temp':
      case 'intake_temp':
      case 'catalyst_temp_b1s1':
      case 'catalyst_temp_b1s2':
        unit = '°C';
        break;
      case 'voltage':
      case 'control_module_voltage':
      case 'o2_s1_wr_voltage':
      case 'elm_voltage':
        unit = 'V';
        break;
      case 'maf':
        unit = ' g/s';
        break;
      case 'run_time':
      case 'run_time_mil':
        formattedValue = Math.floor(value / 60); // Convert to minutes
        unit = ' min';
        break;
      case 'distance_w_mil':
      case 'distance_since_dtc_clear':
        unit = ' km';
        break;
    }

    return (
      <ListItem
        key={key}
        label={key.replace(/_/g, ' ').toUpperCase()}
        value={`${typeof formattedValue === 'number' ? formattedValue.toFixed(1) : formattedValue}${unit}`}
      />
    );
  };

  return (
    <ScrollView 
      style={screens.screen}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
      }
    >
      <View style={screens.content}>
        <Card>
          <Card.Header title="Diagnostics" />
          <Card.Content>
            {error ? (
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            ) : (
              obdData && Object.entries(obdData).map(([key, value]) => 
                renderDataItem(key, value)
              )
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}