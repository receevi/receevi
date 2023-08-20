import ContactBrowserFactory from "@/lib/repositories/contacts/ContactBrowserFactory"

export const itemsPerPage = 10

export async function fetchData(options: {
    pageIndex: number
    pageSize: number
}) {
    const contactRepository = ContactBrowserFactory.getInstance()
    const limit = options.pageSize;
    const offset = options.pageSize * options.pageIndex;
    const result = await contactRepository.getContacts(
        undefined,
        { column: 'profile_name', options: { ascending: true } },
        { limit: limit, offset: offset},
        true,
    )
    const pageCount = result.itemsCount ? Math.ceil(result.itemsCount / itemsPerPage) : -1;
    return {
        rows: result.rows,
        pageCount
    }
}