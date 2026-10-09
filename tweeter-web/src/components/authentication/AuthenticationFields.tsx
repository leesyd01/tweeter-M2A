interface Props {
    onEnter: (event: React.KeyboardEvent<HTMLElement>) => void;
    setAlias: (value: string) => void;
    setPassword: (value: string) => void;
    // login: password is the last field (rounded bottom + margin).
    // register: more fields follow it, leave this false.
    isLastField?: boolean;
  }
  
  const AuthenticationFields = (props: Props) => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={props.onEnter}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className={props.isLastField ? "form-floating mb-3" : "form-floating"}>
          <input
            type="password"
            className={props.isLastField ? "form-control bottom" : "form-control"}
            id="passwordInput"
            placeholder="Password"
            onKeyDown={props.onEnter}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
  };
  
  export default AuthenticationFields;