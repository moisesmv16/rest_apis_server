import server from "./server";
import colors from "colors";


server.listen(4001, () => {
    console.log(colors.cyan.bold("REST API en el puerto 4000"))
})
