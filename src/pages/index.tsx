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

  useEffect(() => {
    let session = localStorage.getItem("TokenSession") || "";

    if (session) {
      setIsLoggedIn(true);
      setSessionToken(session);
    }
  }, []);

  const handleSubmit = async () => {
    if (loginForm.email.length <= 0)
      return alert("el email no puede estar vacio");
    if (loginForm.password.length <= 0)
      return alert("el password no puede estar vacio");

    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_API + "/auth/login",
        loginForm
      );
      // data nos retornara si el login ha sido correcto y un token de sesion de ser asi
      console.log("🚀 ~ file: index.tsx:35 ~ handleSubmit ~ data:", data);
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
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_API + "/projects"
      );
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
    description: ""
  });

  const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement >) => {
    setCreateProjectFrom({
      ...createProjectFrom,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async () => {
    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_API + "/projects",
        createProjectFrom,
        {
          headers: {
            token: sessionToken,
            Authorization: "Bearer " + sessionToken,
          },
        }
      );
      setCreateProjectFrom({
        img: "",
        name: "",
        description: "",
      });
      getProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => {
    const { Modal } = require("bootstrap");
    const myModal = new Modal("#exampleModal");

    myModal.show();
  };

  const editModal = (_id: string, name:string, img: string, description:string ) => {
    // edit modal
    console.log(_id, name, img, description);
    setCreateProjectFrom({
      img,
      name,
      description,
    });

    showModal();
  }

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
              <div className="row border-bottom">
                <div className="col-9">
                <h3 className=" pb-2 mb-0">Proyectos</h3>
                </div>
                <div className="col-3">
                  <button type="button" className="btn btn-primary mb-2" onClick={showModal}>
                    Crear proyecto
                  </button>
                </div> 
              </div>
             

              {state
                ? state.map((p: any) => (
                    <div key={p._id} className="d-flex text-body-secondary pt-3">
                      <div className="col-1">
                        <img
                          width="48"
                          height="38"
                          className="bd-placeholder-img flex-shrink-0 me-2 rounded "
                          src={p.img}
                        />
                      </div>
                      <div className="col-10">
                        <p className="pb-3 mb-0 small lh-sm border-bottom">
                        <strong className="d-block text-gray-dark">
                          {p.name}
                        </strong>
                          {p.description}
                        </p>
                      </div>
                      <div className="col-1">
                        <i onClick={() => editModal(p._id, p.name, p.img, p.description)} className="fa-solid fa-pen-to-square cursor-pointer"></i>
                        <i className="fa-solid fa-trash p-2 cursor-pointer"></i>
                      </div>
                    </div>
                  ))
                : ""}

              <small className="d-block text-end mt-3">
                <button type="button" className="btn" onClick={showModal}>
                  Crear proyecto
                </button>
              </small>
            </div>
            {/* modal              */}
            <div className="d-flex">
            
              <div
                className="modal fade"
                id="exampleModal"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Registro
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <label>Nombre de proyecto</label>
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
                      <label>Descripcion</label>
                      <textarea name="description" 
                       onChange={(e) => handleProjectFormChange(e)} 
                       className="form-control"
                       value={createProjectFrom.description}>
                      </textarea>
                      {/* <button
                        className="btn btn-primary mt-2"
                        onClick={createProject}
                      >
                        create project
                      </button> */}
                    </div>
                    <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Cerrar
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={createProject}
                        >
                          Guardar
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className={styles.loginContainer}>
        <div>
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
          <button onClick={handleSubmit} className="btn btn-primary w-100 py-2">
            Sign in
          </button>
        </div>
      </div>
    </>
  );
}
