import LoginClientComponent from "./LoginClientComponent";
import LoginWrapper from "./LoginWrapper";

export default async function LoginServerComponent() {
    return (
        <>
            {/* @ts-expect-error Server Component */}
            <LoginWrapper>
                <LoginClientComponent />
            </LoginWrapper>
        </>
    )
}
