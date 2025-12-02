const axios = require('axios');

(async () => {
  try {
    const body = {
      nombre: 'TestCo',
      giro: 'Tech',
      "tamaño": 'Pequeña',
      "teléfono": '+34123456789',
      fecha_registro: new Date().toISOString().split('T')[0],
      ciudad: 'Madrid',
      "dirección": 'Calle 1'
    };

    const res = await axios.post('http://localhost:3000/api/empresas', body, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
})();
