import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const offset = (page - 1) * limit;

  // Uncomment and modify these lines to use a database
  // let query = db.select().from(advocates);
  // if (search) {
  //   query = query.where('firstName', 'like', `%${search}%`)
  //               .orWhere('lastName', 'like', `%${search}%`)
  //               .orWhere('city', 'like', `%${search}%`)
  //               .orWhere('degree', 'like', `%${search}%`)
  //               .orWhere('specialties', 'like', `%${search}%`);
  // }
  // const data = await query.limit(limit).offset(offset);
  // const totalCount = await db.select().from(advocates).count().first();

  // For now, we'll filter and paginate the advocateData
  let filteredData = advocateData;
  if (search) {
    filteredData = advocateData.filter(advocate =>
      Object.values(advocate).some(value =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  const totalCount = filteredData.length;
  const data = filteredData.slice(offset, offset + limit);

  return Response.json({
    data,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  });
}