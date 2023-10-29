import { AppSetup, SetupRepository } from "@/lib/repositories/setup/SetupRepository"
import SetupServerFactory from "@/lib/repositories/setup/SetupServerFactory"
import SetupFrontendClient from "./pageClient"

export default async function SetupFrontend() {
    const setupRepository: SetupRepository = SetupServerFactory.getInstance()
    const setupPendingItems = await setupRepository.getIncompleteItems()
    return (
        <SetupFrontendClient pendingItems={setupPendingItems} />
    )
}