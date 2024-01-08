import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Hello!</h1>
      <div className="bg-entertainment-red text-entertainment-pure-white text-center w-14 h-7 mr-4 rounded-md md:h-8 md:mr-6 lg:mr-0 lg:mb-8 flex align-center justify-center">
        <Link href="/sign-up" className="self-center">
          Signup
        </Link>
      </div>
      {/* <UserButton /> */}
    </div>
  );
}
