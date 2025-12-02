import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type Params = { id: string };

export async function GET(request: Request, { params }: { params: Params }) {
  let connection: any;
  try {
    const vacanteId = Number(params.id);
    if (Number.isNaN(vacanteId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') || 20)));
    const withCV = url.searchParams.get('withCV') === 'true';
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const where: string[] = ['id_vacante = ?'];
    const paramsArr: any[] = [vacanteId];
    if (withCV) {
      where.push("cv_url IS NOT NULL AND cv_url <> ''");
    }
    if (from) {
      where.push('fecha_postulación >= ?');
      paramsArr.push(from);
    }
    if (to) {
      where.push('fecha_postulación <= ?');
      paramsArr.push(to);
    }

    connection = await pool.getConnection();

    const whereSql = where.length ? ' WHERE ' + where.join(' AND ') : '';
    const countSql = `SELECT COUNT(*) as total FROM postulaciones ${whereSql}`;
    const [countRows] = await connection.query(countSql, paramsArr) as any;
    const total = Number(countRows[0]?.total || 0);

    const offset = (page - 1) * pageSize;
    const sql = `SELECT * FROM postulaciones ${whereSql} ORDER BY fecha_postulación DESC LIMIT ? OFFSET ?`;
    const [rows] = await connection.query(sql, [...paramsArr, pageSize, offset]) as any;

    return NextResponse.json({ items: rows, pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching postulantes de la vacante' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
