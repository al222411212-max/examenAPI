import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type Params = { id: string };

export async function GET(request: Request, { params }: { params: Params }) {
  let connection: any;
  try {
    const empresaId = Number(params.id);
    if (Number.isNaN(empresaId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') || 20)));
    const modalidad = url.searchParams.get('modalidad');
    const estatus = url.searchParams.get('estatus');

    const where: string[] = ['id_empresa = ?'];
    const paramsArr: any[] = [empresaId];
    if (modalidad) {
      where.push('modalidad = ?');
      paramsArr.push(modalidad);
    }
    if (estatus) {
      where.push('LOWER(estatus) = LOWER(?)');
      paramsArr.push(estatus);
    }

    connection = await pool.getConnection();

    const whereSql = where.length ? ' WHERE ' + where.join(' AND ') : '';
    const countSql = `SELECT COUNT(*) as total FROM vacantes ${whereSql}`;
    const [countRows] = await connection.query(countSql, paramsArr) as any;
    const total = Number(countRows[0]?.total || 0);

    const offset = (page - 1) * pageSize;
    const sql = `SELECT * FROM vacantes ${whereSql} ORDER BY fecha_publicación DESC LIMIT ? OFFSET ?`;
    const [rows] = await connection.query(sql, [...paramsArr, pageSize, offset]) as any;

    return NextResponse.json({ items: rows, pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching vacantes de la empresa' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
