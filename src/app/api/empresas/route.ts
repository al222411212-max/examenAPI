import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface EmpresaRow extends RowDataPacket {
  id_empresa?: number;
  nombre: string;
  giro: string;
  tamaño: string;
  teléfono: string;
  fecha_registro: string;
  ciudad: string;
  dirección: string;
}

export async function GET(request: NextRequest) {
  let connection: any;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const withVacantes = searchParams.get('withVacantes');

    connection = await pool.getConnection();

    if (id) {
      const [rows] = await connection.query<EmpresaRow[]>('SELECT * FROM empresas WHERE id_empresa = ?', [Number(id)]) as any;
      const empresa = (rows as any)[0] || null;
      if (!empresa) return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });

      if (withVacantes === 'true') {
        const [vacantes] = await connection.query('SELECT * FROM vacantes WHERE id_empresa = ?', [Number(id)]) as any;
        empresa.vacantes = vacantes;
      }

      return NextResponse.json(empresa);
    }

    const [rows] = await connection.query<EmpresaRow[]>('SELECT * FROM empresas') as any;
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching empresas' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, giro, tamaño, teléfono, fecha_registro, ciudad, dirección } = body;

    if (!nombre || !giro || !tamaño || !teléfono || !fecha_registro || !ciudad || !dirección) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const result = await connection.query(
      'INSERT INTO empresas (nombre, giro, tamaño, teléfono, fecha_registro, ciudad, dirección) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, giro, tamaño, teléfono, fecha_registro, ciudad, dirección]
    ) as any;
    connection.release();

    return NextResponse.json(
      { message: 'Empresa created successfully', id: result[0].insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating empresa' },
      { status: 500 }
    );
  }
}
