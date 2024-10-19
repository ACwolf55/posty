import {Yellowtail} from 'next/font/google'
import {Carter_One} from 'next/font/google'

const yellowTail = Yellowtail({
  subsets: ['latin'],
  weight: '400'
})

const carterOne = Carter_One({
  subsets: ['latin'],
  weight: '400'
})

export const Header = () =>{

    return(
   <header className=" flex w-full items-center justify-around flex-col text-4xl p-6 border-2">

            <h1 className={carterOne.className}>Posty~~</h1>
        <div className='text-lg'>
            <h3 className={yellowTail.className}> ~~ where you can post stuff ~~</h3>
        </div>
   </header>
    )

}
