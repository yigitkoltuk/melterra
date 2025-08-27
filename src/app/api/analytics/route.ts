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
