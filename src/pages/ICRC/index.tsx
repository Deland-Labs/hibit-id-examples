import { FC } from "react";

const IcrcPage: FC = () => {
  return (
    <div className="container p-6 mx-auto">
      <h1 className="flex justify-center items-center gap-2 font-bold text-xl">
        <img src={import.meta.env.BASE_URL + 'logo.png'} alt="logo" className="size-8" />
        <span>Hibit ID Dfinity ICRC Example</span>
      </h1>
      <main className="mt-8 flex flex-col gap-6">
        
      </main>
    </div>
  )
}

export default IcrcPage
