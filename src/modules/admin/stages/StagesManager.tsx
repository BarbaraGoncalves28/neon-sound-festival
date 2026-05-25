import { useState } from "react"
import { store } from "../store/adminStore"

export function StagesManager(){

 const [name,setName] = useState("")
 const [capacity,setCapacity] = useState(0)
 const [,update] = useState(0)

 function createStage(){

   store.stages.push({
     id:crypto.randomUUID(),
     name,
     capacity
   })

   update(v=>v+1)
 }

 function toggleBlock(id:string){
   const stage = store.stages.find(s=>s.id===id)
   if(stage) stage.blocked = !stage.blocked
   update(v=>v+1)
 }

 return(

<div>

<h2 className="text-2xl mb-4">Palcos</h2>

<input
 placeholder="Nome"
 onChange={e=>setName(e.target.value)}
 className="text-black px-2 mr-2"
/>

<input
 placeholder="Capacidade"
 type="number"
 onChange={e=>setCapacity(Number(e.target.value))}
 className="text-black px-2 mr-2"
/>

<button
 onClick={createStage}
 className="bg-pink-500 px-3"
>
Criar
</button>

{store.stages.map(s=>(
<div
 key={s.id}
 className="bg-zinc-900 p-3 mt-3 flex justify-between"
>

<div>
{s.name} — capacidade {s.capacity}
{s.blocked && " 🚫"}
</div>

<button
 onClick={()=>toggleBlock(s.id)}
 className="bg-yellow-500 px-2"
>
Bloquear
</button>

</div>
))}

</div>

 )
}