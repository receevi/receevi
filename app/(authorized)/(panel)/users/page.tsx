import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase-server";
import { FEUser } from "@/types/user";
import SearchBar from "./SearchBar";
import DeleteUser from "./DeleteUser";

const pageSize = 10

export default async function UsersPage(
    {
        searchParams,
    }: {
        searchParams: { [key: string]: string | undefined }
    }
) {
    const pageString = searchParams['page']
    let page = 1;
    if (pageString && typeof pageString === 'string') {
        const parsedPage = parseInt(pageString)
        if (!isNaN(page)) {
            page = parsedPage;
        }
    }
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1


    const searchString = searchParams['search']?.trim()
    const search = searchString ? `%${searchString}%` : undefined

    const supabase = createClient()
    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .limit(pageSize)
        .order('last_updated', { ascending: false })
        .range(from, to)
    if (search) {
        query = query.or(`first_name.ilike.${search},last_name.ilike.${search}`)
    }
    const { data, count, error } = await query
    if (error) throw error
    let users: FEUser[] = []
    if (data?.length && data.length > 0) {
        const { data: roles, error } = await supabase.from('user_roles').select('*').in('user_id', data?.map(user => user.id));
        if (error) throw error
        users = data.map(user => {
            const role = roles?.find((role) => role.user_id === user.id)
            return {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: role?.role || 'No role'
            }
        })
    }
    return (
        <div className="m-4 bg-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 gap-4">
                <SearchBar />
                <Link href="/users/new" className="bg-button-primary-background text-white px-4 py-2 rounded-full flex-shrink-0 text-sm"> Add User</Link>
            </div>
            <div>
                {(() => {
                    if (users?.length && users.length > 0) {
                        return (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>First Name</TableHead>
                                        <TableHead>Last Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users?.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                <Button asChild variant="ghost">
                                                    <Link href={`/users/new?userId=${user.id}`}>Edit</Link>
                                                </Button>
                                                <DeleteUser userId={user.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    } else {
                        return (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )
                    }
                })()}
                {(() => {
                    if (count && count > 0) {
                        return (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>

                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={page > 1 ? `/users?page=${page - 1}` : '#'}
                                                size="default"
                                                className={page === 1 ? "pointer-events-none opacity-30" : ""}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => i + 1).map((pageNumber) => (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationLink href={`/users?page=${pageNumber}`} size="default" isActive={pageNumber === page}>
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                href={page < Math.ceil(count / pageSize) ? `/users?page=${page + 1}` : '#'}
                                                size="default"
                                                className={(page >= Math.ceil(count / pageSize)) ? "pointer-events-none opacity-30" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )
                    }
                })()}
            </div>
        </div>
    )
}