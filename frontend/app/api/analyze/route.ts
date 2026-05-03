export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(backendUrl + '/analyze', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const error = await res.text()
      return Response.json({ error }, { status: res.status })
    }
    const data = await res.json()
    return Response.json(data, { status: 200 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
