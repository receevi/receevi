import constants from "@/lib/constants";
import { SetupRepository } from "@/lib/repositories/setup/SetupRepository"
import SetupServerFactory from "@/lib/repositories/setup/SetupServerFactory"
import { redirect } from "next/navigation";

async function postLoginRedirect() {
    const setupRepository: SetupRepository = SetupServerFactory.getInstance()
    const setupPendingItems = await setupRepository.getIncompleteItems()
    if (setupPendingItems.length > 0) {
        redirect('/setup')
    } else {
        redirect(constants.DEFAULT_ROUTE)
    }
}

export default async function SetupFrontend() {
    await postLoginRedirect()
    return (
        <></>
    )
}