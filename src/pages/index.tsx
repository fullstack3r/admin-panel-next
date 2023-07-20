// si el usuario no esta autenticado mostrar login
// si el usuario esta autenticado mostrar formulario para crear un proyecto
// ver la lista de los ultimos 5 proyectos creado
import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
  //logica de react
  const [sessionToken, setSessionToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [state, setState] = useState([]);
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    // ... -> spread operator -> sirve para copiar el valor previo de la variable seleccionada
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(()=> {
    let session = localStorage.getItem("TokenSession") || "";
   
    if(session) {
      setIsLoggedIn(true);
      setSessionToken(session); 
    }
  }, [])

  const handleSubmit = async () => {
    if (loginForm.email.length <= 0)
      return alert("el email no puede estar vacio");
    if (loginForm.password.length <= 0)
      return alert("el password no puede estar vacio");

    try {
      const { data } = await axios.post( process.env.NEXT_PUBLIC_API + "/auth/login", loginForm);
      // data nos retornara si el login ha sido correcto y un token de sesion de ser asi
      console.log("🚀 ~ file: index.tsx:35 ~ handleSubmit ~ data:", data)
      setLoginForm({
        password: "",
        email: "",
      });
      setIsLoggedIn(true);
      localStorage.setItem("TokenSession", data.token);

      setSessionToken(data.token);
      // getProjects();
    } catch (error) {
      alert(error);
    }
  };
  async function getProjects() {
    try {
      const { data } = await axios.get(process.env.NEXT_PUBLIC_API + "/projects");
      console.log("🚀 ~ file: index.tsx:53 ~ getProjects ~ data:", data);
      setState(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getProjects();
  }, []);

  const [createProjectFrom, setCreateProjectFrom] = useState({
    name: "",
    img: "",
  });

  const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateProjectFrom({
      ...createProjectFrom,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async () => {
    try {
      const { data } = await axios.post(process.env.NEXT_PUBLIC_API + "/projects", createProjectFrom, {
        headers: {
          token: sessionToken,
          Authorization: 'Bearer '+ sessionToken
        },
      });
      setCreateProjectFrom({
        img: "",
        name: "",
      });
      getProjects();
     
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoggedIn)
    return (
      <>
        <div className="container">
          <div className="row">
            
              <div className="d-flex align-items-center p-3 my-3 text-white bg-black rounded shadow-sm ">
                <img
                  className="me-3"
                  src="https://moon.ly/uploads/nft/clg20i5ys7518u5jsdr1xcqgx.png"
                  alt=""
                  width="48"
                  height="38"
                />
                <div className="lh-1">
                  <h1 className="h6 mb-0 text-white lh-1">Bootstrap</h1>
                  <small>Since 2011</small>
                </div>
              </div>

              <div className="my-3 p-3 bg-body rounded shadow-sm">
                <h6 className="border-bottom pb-2 mb-0">Proyectos</h6>

                {state
                  ? state.map((p: any) => (
                      <div
                        key={p.id}
                        className="d-flex text-body-secondary pt-3"
                      >
                        {/* <svg
                          className="bd-placeholder-img flex-shrink-0 me-2 rounded"
                          width="32"
                          height="32"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Placeholder: 32x32"
                          preserveAspectRatio="xMidYMid slice"
                          focusable="false"
                        >
                          <title>Placeholder</title>
                          <rect
                            width="100%"
                            height="100%"
                            fill="#007bff"
                          ></rect>
                          <text x="50%" y="50%" fill="#007bff" dy=".3em">
                            32x32
                          </text>
                        </svg> */}
                        <img  width="48"
                  height="38" className="bd-placeholder-img flex-shrink-0 me-2 rounded " src={p.img}/>

                        <p className="pb-3 mb-0 small lh-sm border-bottom">
                          <strong className="d-block text-gray-dark">
                            {" "}
                            {p.name}
                          </strong>
                          Some representative placeholder content, with some
                          information about this user. Imagine this being some
                          sort of status update, perhaps?
                        </p>
                      </div>
                    ))
                  : ""}

                <small className="d-block text-end mt-3">
                  <a href="#">Crear nuevo</a>
                </small>
              </div>
              <div className="col-6">
              <p>FORMULARIO DE CREAR PROYECTO</p>
              <div className="text-center">
                <label>Nombre de proyecto</label>
                <div className="form-control">
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) => handleProjectFormChange(e)}
                    name="name"
                    value={createProjectFrom.name}
                  />
                  <label>url de la imagen</label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) => handleProjectFormChange(e)}
                    name="img"
                    value={createProjectFrom.img}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={createProject}
                  >
                    create project
                  </button>
                </div>
              </div>
            </div>
            {/* <ul>
          {
            state ? 
          state.map((p: any) => (
              <li key={p.id}>{p.projectName}</li>
          ))
          : ""
          }
          
        </ul> */}
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className={styles.loginContainer}>
      <div >
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              name="email"
              onChange={(e) => handleFormChange(e)}
              value={loginForm.email}
            />
            <label>Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              name="password"
              id=""
              value={loginForm.password}
              onChange={(e) => handleFormChange(e)}
              className="form-control"
              placeholder="Password"
            />
            <label>Password</label>
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-100 py-2"
          >
            Sign in
          </button>
          </div>
      

        {/* <div className={styles.loginFormContainer}>
          <label>username</label>
          <input
            type="text"
            name="username"
            onChange={(e) => handleFormChange(e)}
            value={loginForm.username}
          />
          <label> password</label>
          <input
            type="password"
            name="password"
            id=""
            value={loginForm.password}
            onChange={(e) => handleFormChange(e)}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>Login</button>
        </div> */}
      </div>
    </>
  );
}
