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
    username: "",
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
    if (loginForm.username.length <= 0)
      return alert("el username no puede estar vacio");
    if (loginForm.password.length <= 0)
      return alert("el password no puede estar vacio");

    try {
      const { data } = await axios.post("/api/login", loginForm);
      // data nos retornara si el login ha sido correcto y un token de sesion de ser asi
      console.log(data);
      setLoginForm({
        password: "",
        username: "",
      });
      setIsLoggedIn(true);
      setSessionToken(data.token);
    } catch (error) {
      alert(error);
    }
  };

  const [createProjectFrom, setCreateProjectFrom] = useState({
    projectName: "",
    imageUrl: "",
  });

  const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateProjectFrom({
      ...createProjectFrom,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async () => {
    try {
      const { data } = await axios.post("/api/project", createProjectFrom, {
        headers: {
          token: sessionToken,
        },
      });
      setCreateProjectFrom({
        imageUrl: "",
        projectName: "",
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
            name="projectName"
            value={createProjectFrom.projectName}
          />
          <label>url de la imagen</label>
          <input
            type="text"
            onChange={(e) => handleProjectFormChange(e)}
            name="imageUrl"
            value={createProjectFrom.imageUrl}
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
        <h2>Login</h2>
        <div className={styles.loginFormContainer}>
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
          <button onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </>
  );
}
