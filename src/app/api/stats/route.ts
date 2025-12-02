import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const connection = await pool.getConnection();

    // Totales generales
    const [empresasCount] = await connection.query('SELECT COUNT(*) as total FROM empresas;');
    const [vacantesCount] = await connection.query('SELECT COUNT(*) as total FROM vacantes;');
    const [postulacionesCount] = await connection.query('SELECT COUNT(*) as total FROM postulaciones;');

    // Empresas con número de vacantes
    const [empresasVacantes] = await connection.query(
      `SELECT e.id_empresa, e.nombre, COUNT(v.id_vacante) AS vacantes
       FROM empresas e
       LEFT JOIN vacantes v ON v.id_empresa = e.id_empresa
       GROUP BY e.id_empresa, e.nombre
       ORDER BY vacantes DESC`
    );

    // Vacantes por modalidad
    const [vacantesModalidad] = await connection.query(
      `SELECT modalidad, COUNT(*) AS total FROM vacantes GROUP BY modalidad`
    );

    // Postulaciones por vacante (conteo)
    const [postulacionesPorVacante] = await connection.query(
      `SELECT p.id_vacante, v.puesto, COUNT(*) AS total
       FROM postulaciones p
       LEFT JOIN vacantes v ON p.id_vacante = v.id_vacante
       GROUP BY p.id_vacante, v.puesto
       ORDER BY total DESC LIMIT 50`
    );

    // Postulaciones por fecha
    const [postulacionesPorFecha] = await connection.query(
      `SELECT fecha_postulación AS fecha, COUNT(*) AS total
       FROM postulaciones
       GROUP BY fecha_postulación
       ORDER BY fecha_postulación ASC`
    );

    // Vacantes cerradas
    const [vacantesCerradas] = await connection.query(
      `SELECT COUNT(*) AS total FROM vacantes WHERE LOWER(estatus) LIKE '%cerr%';`
    );

    // Postulantes con CV registrado
    const [postulantesConCV] = await connection.query(
      `SELECT COUNT(*) AS total FROM postulaciones WHERE cv_url IS NOT NULL AND cv_url <> ''` 
    );

    // Vacantes junto con sus postulantes (lista limitada)
    const [vacantesConPostulantesRows] = await connection.query(
      `SELECT v.id_vacante, v.puesto, p.id_postulacion, p.nombre_postulante, p.correo, p.cv_url
       FROM vacantes v
       LEFT JOIN postulaciones p ON p.id_vacante = v.id_vacante
       ORDER BY v.id_vacante ASC`
    );

    connection.release();

    // Agrupar postulantes por vacante en JS
    const vacantesMap: Record<string, any> = {};
    (vacantesConPostulantesRows as any[]).forEach((r) => {
      const vid = String(r.id_vacante);
      if (!vacantesMap[vid]) vacantesMap[vid] = { id_vacante: r.id_vacante, puesto: r.puesto, postulantes: [] };
      if (r.id_postulacion) {
        vacantesMap[vid].postulantes.push({ id_postulacion: r.id_postulacion, nombre: r.nombre_postulante, correo: r.correo, cv_url: r.cv_url });
      }
    });

    const vacantesConPostulantes = Object.values(vacantesMap);

    return NextResponse.json({
      status: 'success',
      stats: {
        empresas: (empresasCount as any)[0]?.total || 0,
        vacantes: (vacantesCount as any)[0]?.total || 0,
        postulaciones: (postulacionesCount as any)[0]?.total || 0,
      },
      empresasVacantes: empresasVacantes,
      vacantesModalidad: vacantesModalidad,
      postulacionesPorVacante: postulacionesPorVacante,
      postulacionesPorFecha: postulacionesPorFecha,
      vacantesCerradas: (vacantesCerradas as any)[0]?.total || 0,
      postulantesConCV: (postulantesConCV as any)[0]?.total || 0,
      vacantesConPostulantes,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
