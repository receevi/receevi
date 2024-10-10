'use server'

import { createServiceClient } from '@/lib/supabase/service-client'
import { createClient } from '@/utils/supabase-server'
import { z } from 'zod'

const userSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["agent", "admin"]),
})

export async function createUser(data: z.infer<typeof userSchema>) {
    const validatedData = userSchema.parse(data)

    // Here you would typically save the user to your database
    // For this example, we'll just log the data and simulate a delay
    console.log('Creating user:', validatedData)
    const supabaseServer = createClient()
    const {data: session, error: sessionGetError} = await supabaseServer.auth.getSession()
    if (sessionGetError) {
        throw sessionGetError
    }
    const userRole = session.session?.user?.user_metadata?.custom_user_role
    if (userRole !== 'admin') {
        return { success: false, message: 'You are not authorized to create users' }
    }

    const supabase = createServiceClient()

    // const { data1, error } = await supabase.auth.admin.createUser({
    //     email: email,
    //     password: 'password',
    //     user_metadata: { name: 'Yoda' }
    // })

    console.log('validatedData', validatedData)


    if (validatedData.id) {
        const { data: userUpdateData, error: userUpdateError } = await supabase.auth.admin.updateUserById(validatedData.id, {
            email: validatedData.email,
            user_metadata: {
                first_name: validatedData.firstName,
                last_name: validatedData.lastName,
                custom_user_role: validatedData.role,
            }
        })
        console.log('userUpdateData', userUpdateData)
        console.log('userUpdateError', userUpdateError)
        if (userUpdateError) {
            throw userUpdateError
        }
    } else {
        const { data: userCreateData, error: userCreateError } = await supabase.auth.admin.inviteUserByEmail(validatedData.email, {
            data: {
                first_name: validatedData.firstName,
                last_name: validatedData.lastName,
                custom_user_role: validatedData.role,
            }
        })
        console.log('userCreateData', userCreateData)
        console.log('userCreateError', userCreateError)
        if (userCreateError) {
            throw userCreateError
        }
    }
    // const { data: userCreateData, error: userCreateError } = await supabase.auth.admin.inviteUserByEmail(data.email, {
    //     data: {
    //         first_name: data.firstName,
    //         last_name: data.lastName,
    //         custom_user_role: data.role,
    //     }
    // })


    // await new Promise(resolve => setTimeout(resolve, 1000))

    // If everything is successful, you can return some data or just resolve
    return { success: true, message: 'User created successfully' }

    // If there's an error, you should throw it so the client can catch it
    // throw new Error('Failed to create user')
}