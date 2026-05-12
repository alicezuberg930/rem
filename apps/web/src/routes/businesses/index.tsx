import { createFileRoute } from '@tanstack/react-router'
import { Businesses } from '@/features/businesses'
import { AuthGuard } from '@/components/auth-guard'

export const Route = createFileRoute('/businesses/')({
  // component: Businesses 

  component: () => {
    return (
      // <AuthGuard>
        <Businesses/>
      //  </AuthGuard>
    )
  },
})
