// use client ise custom hook kullan diyor ASYNC YOK METODDA

'use client'
// rafc

import { auth } from "@/auth";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";


const ClientPage = () => {
    // burdan geldi cunku session.data? -- hookda
    const user = useCurrentUser();

  return (
    <UserInfo 
    user={user}
    label="📱 Client Component"
    />
  )
}

export default ClientPage;