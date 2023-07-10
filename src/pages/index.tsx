// si el usuario no esta autenticado mostrar login
// si el usuario esta autenticado mostrar formulario para crear un proyecto
// ver la lista de los ultimos 5 proyectos creado
import { ChangeEvent, useState } from "react";
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

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    // ... -> spread operator -> sirve para copiar el valor previo de la variable seleccionada
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (loginForm.email.length <= 0)
      return alert("el email no puede estar vacio");
    if (loginForm.password.length <= 0)
      return alert("el password no puede estar vacio");

    try {
      const { data } = await axios.post(process.env.NEXT_PUBLIC_API + "/auth/login", loginForm);
      // data nos retornara si el login ha sido correcto y un token de sesion de ser asi
      console.log(data);
      setLoginForm({
        password: "",
        email: "",
      });
      setIsLoggedIn(true);
      console.log(data.token);
      setSessionToken(data.token);
    } catch (error) {
      alert(error);
    }
  };

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
          Authorization: 'Bearer ' + sessionToken
        },
      });
      setCreateProjectFrom({
        img: "",
        name: "",
      });
      console.log(data);
      alert("projecto generado");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoggedIn)
    return (
      <>
        <p>FORMULARIO DE CREAR PROYECTO</p>
        <div>
          <label>Nombre de proyecto</label>
          <input
            type="text"
            onChange={(e) => handleProjectFormChange(e)}
            name="name"
            value={createProjectFrom.name}
          />
          <label>url de la imagen</label>
          <input
            type="text"
            onChange={(e) => handleProjectFormChange(e)}
            name="img"
            value={createProjectFrom.img}
          />
          <button onClick={createProject}>create project</button>
        </div>

        <p>TAREA</p>
        <p>
          1. en el api de los proyectos src/pages/api/project en este archivo
          hacer que para una peticion get nos devuelva la lista de proyectos
        </p>
        <p>
          2. mostrar la lista de proyectos en la aplicacion. hacer una funcion
          que llame a la lista de proyectos cuando entramos en la aplicacion
          pistas: useEffect, axios, useState
        </p>
      </>
    );

  return (
    <>
    
      <div className={styles.loginContainer}>
        <div className="d-flex align-items-center py-4 bg-body-tertiary">
        <main className="form-signin w-100 m-auto">
          <form>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
              <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
              <label>Email address</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
              <label >Password</label>
            </div>


            <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2023</p>
          </form>
        </main>
        </div>
     


        <h2>Login</h2>
        <div className={styles.loginFormContainer}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            onChange={(e) => handleFormChange(e)}
            value={loginForm.email}
          />
          <label> password</label>
          <input
            type="password"
            name="password"
            id=""
            value={loginForm.password}
            onChange={(e) => handleFormChange(e)}
          />
          <button onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </>
  );
}
