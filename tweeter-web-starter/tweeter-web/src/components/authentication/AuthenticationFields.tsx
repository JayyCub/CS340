
interface Props {
    setAliasFunc: Function,
    setPasswordFunc: Function,
    bottomClass: boolean
}

const AuthenticationFields = (props: Props) => {
    let passwordClassInner = props.bottomClass ? "form-control bottom" : "form-control";
    let passwordClassOuter = props.bottomClass ? "form-floating mb-3" : "form-floating";
    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    placeholder="name@example.com"
                    onChange={(event) => props.setAliasFunc(event.target.value)}/>
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className={passwordClassOuter}>
                <input
                    type="password"
                    className={passwordClassInner}
                    id="passwordInput"
                    placeholder="Password"
                    onChange={(event) => props.setPasswordFunc(event.target.value)}/>
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    )
}

export default AuthenticationFields;