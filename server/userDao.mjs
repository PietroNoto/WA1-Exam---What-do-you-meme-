import { db } from "./db.mjs";
import crypto from "crypto";


/*  Funzione che serve ad autenticare un claimant caratterizzato da (email, password):
    1. Cerca l'email del claimant nella tabella USERS per vedere se esiste la entry;
    2. In caso affermativo, confronta l'hash della password del claimant con il risultato 
    della concatenazione di hash e salt associati alla entry;
    3. Se il confronto ha successo vengono restituiti userId, email e nome. */
export const getUser = (email, password) =>
{
    return new Promise((resolve, reject) =>
    {
        const query = "SELECT * FROM USERS WHERE email = ?";
        db.get(query, [email], (err, row) => 
        {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve(false);
            else
            {
                const user = {id: row.u_id, username: row.email, name: row.name};
                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword)
                {
                    if (err)
                        reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
}