import {  Radius} from 'lucide-react'

export default function Header() {
  return (
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex ">
            <Radius className="h-8 w-8 " />
            <h1 className="ml-2 text-2xl font-bold  text-red-400">Stock Tracker</h1>
          </div>
        </div>
      </div>
      <div className="h-2 bg-red-500"></div>
    </header>
  )
}

