
"use client"

import { useRouter } from "next/navigation"
import { CreateBlogForm } from "@/front/components/Private/Global/CreateBlogForm"

export default function CreateBlogPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-12">
        <CreateBlogForm 
          onSuccess={() => {
            router.push("/admin/blog")
          }}
        />
      </div>
    </div>
  )
}
