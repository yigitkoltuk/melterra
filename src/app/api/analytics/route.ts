export async function GET(request: Request) {
  // Tüm request detaylarını yazdır
  console.log("Request method:", request.method);
  console.log("Request url:", request.url);
  console.log(
    "Request headers:",
    Object.fromEntries(request.headers.entries())
  );
  if (request.body) {
    try {
      const bodyText = await request.text();
      console.log("Request body:", bodyText);
    } catch (e) {
      console.log("Request body okunamadı:", e);
    }
  }
  // Next.js API route için örnek response
  return Response.json({ message: "Request bilgileri loglandı" });
}

export async function POST(request: Request) {
  // Tüm request detaylarını yazdır
  console.log("Request method:", request.method);
  console.log("Request url:", request.url);
  console.log(
    "Request headers:",
    Object.fromEntries(request.headers.entries())
  );
  if (request.body) {
    try {
      const bodyText = await request.text();
      console.log("Request body:", bodyText);
    } catch (e) {
      console.log("Request body okunamadı:", e);
    }
  }
  // Next.js API route için örnek response
  return Response.json({ message: "POST request bilgileri loglandı" });
}
