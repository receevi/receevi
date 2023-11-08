import { SupabaseClientType } from "../_shared/supabase_types.ts";

export abstract class SetupCore {
    constructor(private supabase: SupabaseClientType, private setupName: string) {
    }
    async execute() {
        const response1 = await this.supabase
            .from('setup')
            .update({ in_progress: true })
            .eq('name', this.setupName)
        if (response1.error) throw response1.error
        await this.setup(this.supabase)
        const response2 = await this.supabase
            .from('setup')
            .update({ in_progress: false, done_at: new Date() })
            .eq('name', this.setupName)
        if (response2.error) throw response2.error

    }
    abstract setup(supabase: SupabaseClientType): Promise<void>;
}
