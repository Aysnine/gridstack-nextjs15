"use client";

import { moduleA } from "../../cyclic-module/module-a";

export default function Foo() {
  return (
    <div>
      <p>Number: {moduleA.module.num}</p>
    </div>
  );
}
