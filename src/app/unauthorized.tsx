import Link from 'next/link'
import { Button } from '@/front/components/ui/button'
import { ArrowLeftIcon, ShieldXIcon } from 'lucide-react'

export default function unauthorized() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
          <div className='mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6'>
            <ShieldXIcon className='w-8 h-8 text-red-500' />
          </div>
          <h1 className='text-2xl font-bold text-neutral-900 mb-3'>
            Access denied
          </h1>
          <p className='text-neutral-600 mb-8 leading-relaxed'>
            You need to be logged in to access this page with the right permissions
          </p>
          <div className='flex flex-col gap-2'>
            <Button asChild className='w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'>
              <Link href="/login">
                <ArrowLeftIcon className="w-4 h-4" />
                Login
              </Link>
            </Button>

            <Button asChild className='w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'>
              <Link href="/">
                <ArrowLeftIcon className="w-4 h-4" />
                Or go back to the home page
              </Link>
            </Button>
          </div>

        </div>
        <p className='text-center text-sm text-neutral-500 mt-6'>
          Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur.
        </p>
      </div>
    </div>
  )
}
