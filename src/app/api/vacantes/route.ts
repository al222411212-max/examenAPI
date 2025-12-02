import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface VacanteRow extends RowDataPacket {
  id_vacante?: number;
  id_empresa: number;
  puesto: string;
  descripción: string;
  salario: number;
  modalidad: string;
  especialidad: string;
  fecha_publicación: string;
  estatus: string;
}

export async function GET(request: NextRequest) {
  let connection: any;
  try {
    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get('empresaId');
    const modalidad = searchParams.get('modalidad');
    const estatus = searchParams.get('estatus');
    const limit = searchParams.get('limit');

    connection = await pool.getConnection();

    const where: string[] = [];
    const params: any[] = [];

    if (empresaId) {
      where.push('id_empresa = ?');
      params.push(Number(empresaId));
    }
    if (modalidad) {
      where.push('modalidad = ?');
      params.push(modalidad);
    }
    if (estatus) {
      where.push('LOWER(estatus) = LOWER(?)');
      params.push(estatus);
    }

    let sql = 'SELECT * FROM vacantes';
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY fecha_publicación DESC';
    if (limit) sql += ' LIMIT ' + Number(limit);

    const [rows] = await connection.query(sql, params) as any;
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching vacantes' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_empresa, puesto, descripción, salario, modalidad, especialidad, fecha_publicación, estatus } = body;

    if (!id_empresa || !puesto || !descripción || !salario || !modalidad || !especialidad || !fecha_publicación || !estatus) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO vacantes (id_empresa, puesto, descripción, salario, modalidad, especialidad, fecha_publicación, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id_empresa, puesto, descripción, salario, modalidad, especialidad, fecha_publicación, estatus]
    ) as any;
    connection.release();

    return NextResponse.json(
      { message: 'Vacante created successfully', id: result[0].insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating vacante' },
      { status: 500 }
    );
  }
}
