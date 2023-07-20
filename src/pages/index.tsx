import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
// import {Modal} from "bootstrap";

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
    id: "",
    name: "",
    img: "",
    description: "",
  });

  const handleProjectFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateProjectFrom({
      ...createProjectFrom,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async () => {
    try {
      let edit = false;
      if(createProjectFrom.id) {
        edit = true;
      }
      if (createProjectFrom.name.length <= 0)
        return alert("el nombre no puede estar vacio");
      if (createProjectFrom.img.length <= 0)
        return alert("la imagen no puede estar vacia"); {
      }
      let urlapi = process.env.NEXT_PUBLIC_API + "/projects";
      if(edit) {
        urlapi = process.env.NEXT_PUBLIC_API + "/projects/" + createProjectFrom.id;
      }

      if(edit) {
        //editar
        const { data } = await axios.put(
          urlapi,
          createProjectFrom,
          {
            headers: {
              token: sessionToken,
              Authorization: "Bearer " + sessionToken,
            },
          }
        ); 
      } else {
        // guardar
        const { data } = await axios.post(
          urlapi,
          createProjectFrom,
          {
            headers: {
              token: sessionToken,
              Authorization: "Bearer " + sessionToken,
            },
          }
        );
        setCreateProjectFrom({
          id: "",
          img: "",
          name: "",
          description: "",
        });
      }
      
      getProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const activeModal = () => {
    const { Modal } = require("bootstrap");
    const myModal = new Modal("#exampleModal");
    myModal.show();
  };

  const newProject = () => {
    setCreateProjectFrom({
      id: "",
      img: "",
      name: "",
      description: "",
    });
    activeModal();
  }
  const editModal = (id: string, name: string, img: string, description: string) => {
    setCreateProjectFrom({
      id,
      img,
      name,
      description
    });
    activeModal();
  };
  const deleteConfirm = (id: string) => {
    
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
                <h1 className="h6 mb-0 text-white lh-1">Lista de proyectos RacksLabs</h1>
                <small> 2023</small>
              </div>
            </div>

            <div className="my-3 p-3 bg-body rounded shadow-sm">
              <div className="row border-bottom">
                <div className="col-8">
                  <h2 className="pb-2 mb-0">Proyectos</h2>
                </div>
                <div className="col-4 d-flex justify-content-end">
                  <div className="d-block text-end ">
                    <button
                      type="button"
                      className="btn btn-primary mb-2"
                      onClick={() => newProject()}
                    >
                      Crear nuevo
                    </button>
                  </div>
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

                      <div className="pb-3 mb-0 small lh-sm border-bottom col-10">
                        <strong className="d-block text-gray-dark">
                          {" "}
                          {p.name}
                        </strong>
                        {p.description}
                      </div>
                      <div className="p-2 col-1 text-center">
                        <i onClick={() => editModal(p._id, p.name, p.img, p.description)} className="fa-solid fa-pen-to-square p-2 "></i>
                        <i onClick={() => deleteConfirm(p._id)} className="fa-solid fa-trash"></i>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>

        <div
          className="modal"
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
                <div className="">
                  <label>Nombre de proyecto</label>
                  <input value={createProjectFrom.id} type="hidden" name="id"  />  
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) => handleProjectFormChange(e)}
                    name="name"
                    value={createProjectFrom.name}
                  />
                  <label className="mt-2">url de la imagen</label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) => handleProjectFormChange(e)}
                    name="img"
                    value={createProjectFrom.img}
                  />
                  <label className="mt-2">Descripción</label>
                  <textarea name="description" onChange={(e) => handleProjectFormChange(e)} className="form-control" value={createProjectFrom.description}>

                  </textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
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
