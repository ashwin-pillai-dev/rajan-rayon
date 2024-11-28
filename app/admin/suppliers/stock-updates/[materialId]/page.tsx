export default async function Page({
    params,
  }: {
    params: Promise<{ materialId: string }>
  }) {
    const materialId = (await params).materialId
    return <div>materialId: {materialId}</div>
  }