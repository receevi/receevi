import LoginClientComponent from "./LoginClientComponent";
import LoginWrapper from "./LoginWrapper";

export default async function LoginServerComponent() {
    return (
        <>
            <LoginWrapper>
                <LoginClientComponent />
            </LoginWrapper>
        </>
    )
}
