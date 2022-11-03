export default async function ContactChat({ params }: {params: {wa_id: string}}) {
    return (
        <div>
            <span>{params.wa_id}</span>
        </div>
    )
}