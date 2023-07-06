// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/dist/client/components/headers'

const projects = [
    {
        id: 1, 
        projectName: "projecto de prueba",
        projectUrl: "afsdfgsgsdgds"
    }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === "GET") {
        // parte 1 de la tarea aqui
    }

    if(req.method === "POST") {
        console.log(req.body, "Body")
        console.log(req.headers, "header")

        if(req.headers.token !== "fsdfsgfsgsgsdfsgfsdgsg") 
            return res.status(400).json({message: "unauthorized"})

        const {projectName, imageUrl} = req.body;
        projects.push({id: projects.length +1, projectName, projectUrl: imageUrl})
        res.status(200).json({ message: 'proyecto genereado', projects })
    }
    
}
