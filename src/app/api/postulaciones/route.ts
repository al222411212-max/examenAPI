import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface PostulacionRow extends RowDataPacket {
  id_postulación?: number;
  id_vacante: number;
  nombre_postulante: string;
  correo: string;
  teléfono: string;
  cv_url: string;
  fecha_postulación: string;
  estatus: string;
}

export async function GET(request: NextRequest) {
  let connection: any;
  try {
    const { searchParams } = new URL(request.url);
    const vacanteId = searchParams.get('vacanteId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const withCV = searchParams.get('withCV');

    connection = await pool.getConnection();

    const where: string[] = [];
    const params: any[] = [];

    if (vacanteId) {
      where.push('id_vacante = ?');
      params.push(Number(vacanteId));
    }
    if (withCV === 'true') {
      where.push("cv_url IS NOT NULL AND cv_url <> ''");
    }
    if (from) {
      where.push('fecha_postulación >= ?');
      params.push(from);
    }
    if (to) {
      where.push('fecha_postulación <= ?');
      params.push(to);
    }

    let sql = 'SELECT * FROM postulaciones';
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY fecha_postulación DESC';

    const [rows] = await connection.query(sql, params) as any;
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching postulaciones' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_vacante, nombre_postulante, correo, teléfono, cv_url, fecha_postulación, estatus } = body;

    if (!id_vacante || !nombre_postulante || !correo || !teléfono || !cv_url || !fecha_postulación || !estatus) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO postulaciones (id_vacante, nombre_postulante, correo, teléfono, cv_url, fecha_postulación, estatus) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_vacante, nombre_postulante, correo, teléfono, cv_url, fecha_postulación, estatus]
    ) as any;
    connection.release();

    return NextResponse.json(
      { message: 'Postulación created successfully', id: result[0].insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating postulación' },
      { status: 500 }
    );
  }
}
