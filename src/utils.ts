function safeJSON(data: string): JSON | string {
  try {
    return JSON.parse(data)
  } catch {
    return 'Invalid JSON'
  }
}

export default safeJSON
