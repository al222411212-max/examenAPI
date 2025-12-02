const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'job_portal',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('Intentando conectar a MySQL...\n');

    const connection = await pool.getConnection();
    console.log('✓ Conexión a MySQL exitosa!\n');

    const [rows] = await connection.query('SHOW TABLES;');
    console.log('Tablas en la base de datos job_portal:');
    console.log(rows);
    console.log('\n');

    const [empresas] = await connection.query('SELECT COUNT(*) as total FROM empresas;');
    const [vacantes] = await connection.query('SELECT COUNT(*) as total FROM vacantes;');
    const [postulaciones] = await connection.query('SELECT COUNT(*) as total FROM postulaciones;');

    console.log('Registros en cada tabla:');
    console.log('- Empresas:', empresas[0].total);
    console.log('- Vacantes:', vacantes[0].total);
    console.log('- Postulaciones:', postulaciones[0].total);

    connection.release();
    pool.end();
    console.log('\n✓ Prueba completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error de conexión:');
    console.error(error.message);
    console.error('\nVerifica que:');
    console.error('1. XAMPP MySQL está corriendo');
    console.error('2. La base de datos job_portal existe');
    console.error('3. Las credenciales sean correctas (usuario: root, sin contraseña)');
    process.exit(1);
  }
}

testConnection();
