import { createResource } from "solid-js";
import { A } from "@solidjs/router";

import Card from "../components/Card";

const fetchPlatforms = async () => {
  const res = await fetch('http://localhost:4000/platforms')

  return res.json()
}

export default function Home() {
  const [platforms] = createResource(fetchPlatforms)

  return (
    <Show when={platforms()} fallback={<p>Loading...</p>}>
      <div class="grid grid-cols-4 gap-10 my-4">
        <For each={platforms()}>
          {(platform) => (
            <Card rounded={true} flat={true}>
              <img src={platform.img} alt="product image" />
              <h1 class="my-3 font-bold">{platform.title}</h1>
              <A href={`/product/${platform.id}`} class="btn">View Product</A>
            </Card>
          )}
        </For>
      </div>
    </Show>
  )
}