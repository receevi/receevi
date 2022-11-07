import setupApplication from "../../lib/setup";

export default async function SetupAppComponent() {
    await setupApplication();
    return (
        <div>Setup complete</div>
    );
}