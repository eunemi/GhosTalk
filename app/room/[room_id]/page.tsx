import { ClientRoom } from './ClientRoom'

export default async function RoomPage({
  params,
}: {
  params: Promise<{ room_id: string }>
}) {
  const { room_id } = await params
  return <ClientRoom room_id={room_id} />
}
