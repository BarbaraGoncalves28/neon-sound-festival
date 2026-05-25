import { useState } from "react"
import { store } from "../store/adminStore"

export function ArtistsManager() {

 const [name,setName] = useState("")
 const [genre,setGenre] = useState("")
 const [,update] = useState(0)

 function createArtist(){

   store.artists.push({
     id: crypto.randomUUID(),
     name,
     genre,
     headliner:false
   })

   setName("")
   setGenre("")
   update(v=>v+1)
 }

 function toggleHeadliner(id:string){
   const artist = store.artists.find(a=>a.id===id)
   if(artist) artist.headliner = !artist.headliner
   update(v=>v+1)
 }

 function cancelArtist(id:string){
   const artist = store.artists.find(a=>a.id===id)
   if(artist) artist.canceled = true
   update(v=>v+1)
 }

 return(

<div>

<h2 className="text-2xl mb-4">Artistas</h2>

<div className="flex gap-2 mb-6">
<input
 placeholder="Nome"
 value={name}
 onChange={e=>setName(e.target.value)}
 className="text-black px-2"
/>

<input
 placeholder="Gênero"
 value={genre}
 onChange={e=>setGenre(e.target.value)}
 className="text-black px-2"
/>

<button
 onClick={createArtist}
 className="bg-pink-500 px-3 py-1"
>
Criar
</button>

</div>

{store.artists.map(a=>(
<div
 key={a.id}
 className="bg-zinc-900 p-3 mb-3 flex justify-between"
>

<div>
<b>{a.name}</b> - {a.genre}
{a.headliner && " ⭐"}
{a.canceled && " ❌ cancelado"}
</div>

<div className="flex gap-2">

<button
 onClick={()=>toggleHeadliner(a.id)}
 className="bg-green-500 px-2"
>
Headliner
</button>

<button
 onClick={()=>cancelArtist(a.id)}
 className="bg-red-500 px-2"
>
Cancelar
</button>

</div>

</div>
))}

</div>

 )
}