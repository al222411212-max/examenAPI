import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    const [tables] = await connection.query('SHOW TABLES;');
    const [empresas] = await connection.query('SELECT COUNT(*) as total FROM empresas;');
    const [vacantes] = await connection.query('SELECT COUNT(*) as total FROM vacantes;');
    const [postulaciones] = await connection.query('SELECT COUNT(*) as total FROM postulaciones;');

    connection.release();

    return NextResponse.json({
      status: 'success',
      message: 'Conexión a la base de datos exitosa',
      tables: tables,
      stats: {
        empresas: (empresas as any)[0]?.total || 0,
        vacantes: (vacantes as any)[0]?.total || 0,
        postulaciones: (postulaciones as any)[0]?.total || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Error de conexión a la base de datos',
      error: error.message,
      help: [
        'Verifica que XAMPP MySQL esté corriendo',
        'Verifica que la base de datos job_portal existe',
        'Ejecuta el script database.sql en phpMyAdmin',
        'Verifica las credenciales (usuario: root, sin contraseña)',
      ],
    }, { status: 500 });
  }
}
