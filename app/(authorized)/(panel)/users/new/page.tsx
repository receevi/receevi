import { createClient } from "@/utils/supabase-server";
import UserCreationFormClient from "./pageClient"
import { FEUser } from "@/types/user";

export default async function UserCreationForm(
    {
        searchParams,
    }: {
        searchParams: { [key: string]: string | undefined }
    }
) {
    const userIdString = searchParams['userId']
    let userId = null;
    if (userIdString && typeof userIdString === 'string') {
        userId = userIdString;
    }
    console.log('userId', userId)
    if (userId) {
        const supabase = createClient()
        const {data: userProfileData, error: profileError} = await supabase.from('profiles').select('*').eq('id', userId)
        if (profileError) {
            throw profileError
        }
        const {data: roleData, error: roleDataError} = await supabase.from('user_roles').select('*').eq('user_id', userId)
        if (roleDataError) {
            throw roleDataError
        }
        console.log('roleData', roleData)
        const userData: FEUser = {
            firstName: userProfileData[0].first_name,
            lastName: userProfileData[0].last_name,
            email: userProfileData[0].email,
            role: roleData[0].role,
            id: userId
        }
        console.log('userData', userData)
        return (
            <UserCreationFormClient userData={userData}/>
        )
    }

    return (
        <UserCreationFormClient/>
    )
}