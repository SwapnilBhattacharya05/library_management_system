import Header from "@/components/Header";
import React, { ReactNode } from "react";

/* 
* TELLING TYPESCRIPT WE WANT TO GET SOME CHILDREN THROUGH PROPS HERE 
* AND ARE OF TYPE REACTNODE

*/
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default layout;
