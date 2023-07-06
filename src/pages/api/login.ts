// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {username, password} = req.body;
    if(username === "user1" && password === "1234") return res.status(200).json({
        message: "el login ha sido correcto",
        token: "fsdfsgfsgsgsdfsgfsdgsg"
    })
  res.status(400).json({ message: 'credenciales icorrectas' })
}
