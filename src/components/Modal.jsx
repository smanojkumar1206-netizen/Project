import React from "react";
import { X } from "lucide-react";

export function Modal({ title, close, children }) {
  return (
    <div className="modalBack" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modalHead">
          <h2>{title}</h2>
          <button className="iconBtn" onClick={close}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
