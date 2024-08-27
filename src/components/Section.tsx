import { FC, PropsWithChildren } from "react";

const Section: FC<PropsWithChildren<{ title: string}>> = ({ title, children }) => {
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-2 p-4 border rounded-lg overflow-hidden">
        {children}
      </div>
    </section>
  )
}

export default Section;
