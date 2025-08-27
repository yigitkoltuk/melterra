import { neon } from "@neondatabase/serverless";

// Neon bağlantısı
const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  let bodyText = "";
  let dbResult = null;
  if (request.body) {
    try {
      bodyText = await request.text();
      console.log("Request body:", bodyText);

      dbResult = await sql`
        INSERT INTO analytics_requests (body) VALUES (${bodyText}) RETURNING id, created_at;
      `;
    } catch (e) {
      console.log("Request body okunamadı veya DB hatası:", e);
      return Response.json(
        { error: "Body veya DB hatası", details: e.message },
        { status: 500 }
      );
    }
  }
  // Kayıt sonucu ile response
  return Response.json({
    message: "POST request bilgileri loglandı",
    dbResult,
  });
}

// GET endpoint: Tüm kayıtları döndür
export async function GET() {
  try {
    const allRecords =
      await sql`SELECT * FROM analytics_requests ORDER BY created_at DESC;`;
    return Response.json({
      message: "Tüm analytics_requests kayıtları",
      records: allRecords,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return Response.json(
      { error: "DB hatası", details: errorMessage },
      { status: 500 }
    );
  }
}
