'use client'

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";


const AdminPage = () => {
  const onServerActionClick = () => {
    admin()
      .then((data) => {
      if(data.error){
        toast.error(data.error);
      }
      if(data.success){
        toast.success(data.success);
      }
    })
  }

  const onApiRouteClicked = () => {
    fetch('/api/admin')
    .then((response) => {
      if(response.ok){
        toast.success('Allowed API route')
      }
      else{
        toast.success('Forbidden api route')
      }
    });
  }


  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔐 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        {/* Test Button */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin only API route
          </p>
          <Button onClick={onApiRouteClicked}>
            Click to test
          </Button>
        </div>
        {/* Admin Only Button */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin only server action
          </p>
          <Button onClick={onServerActionClick}>
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage;