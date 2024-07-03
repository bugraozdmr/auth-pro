// roottaki auth dosyasi bu
import {auth} from "@/auth"
import { json } from "stream/consumers";


const SettingsPage = async () => {
    const settings = await auth();
    return (
        <div>
            {JSON.stringify(settings)}
        </div>
    )
}

export default SettingsPage;